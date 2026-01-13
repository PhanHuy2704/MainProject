package com.mainproject.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.dto.CheckoutDTO;
import com.mainproject.backend.dto.OrderDTO;
import com.mainproject.backend.dto.OrderDetailDTO;
import com.mainproject.backend.dto.request.CheckoutRequest;
import com.mainproject.backend.dto.request.OrderRequest;
import com.mainproject.backend.entity.Product;
import com.mainproject.backend.entity.User;
import com.mainproject.backend.entity.Discount;
import com.mainproject.backend.entity.order.Order;
import com.mainproject.backend.entity.order.OrderDetail;
import com.mainproject.backend.exception.BadRequestException;
import com.mainproject.backend.exception.ResourceNotFoundException;
import com.mainproject.backend.exception.UnauthorizedException;
import com.mainproject.backend.repository.DiscountRepository;
import com.mainproject.backend.repository.OrderDetailRepository;
import com.mainproject.backend.repository.OrderRepository;
import com.mainproject.backend.repository.ProductRepository;
import com.mainproject.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final DiscountRepository discountRepository;
	private final ProductRepository productRepository;
	private final OrderDetailRepository orderDetailRepository;

	@Transactional(readOnly = true)
	public List<OrderDTO> getAll() {
		return orderRepository.findAll().stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public List<OrderDTO> getMyOrders(String email) {
		return orderRepository.findByUser_EmailIgnoreCaseOrderByCreatedAtDesc(email)
				.stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public OrderDTO getById(Long id) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
		return toDTO(order);
	}

	@Transactional(readOnly = true)
	public OrderDTO getMyOrder(String email, Long id) {
		Order order = orderRepository.findByIdAndUser_EmailIgnoreCase(id, email)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
		return toDTO(order);
	}

	@Transactional(readOnly = true)
	public List<OrderDetailDTO> getMyOrderDetails(String email, Long orderId) {
		assertOrderOwnedByEmail(email, orderId);
		return orderDetailRepository.findByOrder_Id(orderId).stream().map(this::toDetailDTO).toList();
	}

	public CheckoutDTO checkout(String email, CheckoutRequest req) {
		if (req == null) {
			throw new BadRequestException("Request body is required");
		}
		if (req.getItems() == null || req.getItems().isEmpty()) {
			throw new BadRequestException("items are required");
		}
		if (req.getReceiverName() == null || req.getReceiverName().isBlank()
				|| req.getReceiverPhone() == null || req.getReceiverPhone().isBlank()
				|| req.getShippingAddress() == null || req.getShippingAddress().isBlank()
				|| req.getPaymentMethod() == null) {
			throw new BadRequestException("receiverName, receiverPhone, shippingAddress, paymentMethod are required");
		}

		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

		// Build order details (validate stock + compute subtotal)
		BigDecimal subtotal = BigDecimal.ZERO;
		List<OrderDetail> details = req.getItems().stream().map(item -> {
			Long productId = item == null ? null : item.getProductId();
			int quantity = item == null || item.getQuantity() == null ? 0 : item.getQuantity();
			if (productId == null || quantity <= 0) {
				throw new BadRequestException("Each item requires productId and quantity > 0");
			}
			Product product = productRepository.findById(productId)
					.orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
			if (product.getStock() < quantity) {
				throw new BadRequestException("Not enough stock for product: " + productId);
			}
			return OrderDetail.builder()
					.product(product)
					.quantity(quantity)
					.unitPrice(product.getPrice())
					.build();
		}).toList();

		for (OrderDetail d : details) {
			subtotal = subtotal.add(d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())));
		}

		Discount discount = null;
		BigDecimal discountAmount = BigDecimal.ZERO;
		String discountCode = req.getDiscountCode();
		if (discountCode != null && !discountCode.isBlank()) {
			String normalized = discountCode.trim().toLowerCase(Locale.ROOT);
			discount = discountRepository.findByCodeIgnoreCase(normalized)
					.orElseThrow(() -> new ResourceNotFoundException("Discount not found: " + discountCode));
			validateDiscountActive(discount);
			discountAmount = calculateDiscountAmount(subtotal, discount);
		}

		BigDecimal finalPrice = subtotal.subtract(discountAmount);
		if (finalPrice.compareTo(BigDecimal.ZERO) < 0) {
			finalPrice = BigDecimal.ZERO;
		}

		Order order = Order.builder()
				.code(generateUniqueOrderCode())
				.user(user)
				.status(Order.Status.CREATED)
				.receiverName(req.getReceiverName())
				.receiverPhone(req.getReceiverPhone())
				.shippingAddress(req.getShippingAddress())
				.paymentMethod(req.getPaymentMethod())
				.finalPrice(finalPrice)
				.discount(discount)
				.receiveAt(null)
				.endAt(null)
				.build();

		Order savedOrder = orderRepository.save(order);
		for (OrderDetail d : details) {
			d.setOrder(savedOrder);
			// update inventory
			Product p = d.getProduct();
			p.setStock(p.getStock() - d.getQuantity());
			p.setSoldQuantity(p.getSoldQuantity() + d.getQuantity());
			if (p.getStock() <= 0) {
				p.setStock(0);
				p.setStatus(Product.Status.OUT_OF_STOCK);
			}
			productRepository.save(p);
		}

		List<OrderDetailDTO> savedDetails = orderDetailRepository.saveAll(details).stream().map(this::toDetailDTO).toList();

		if (discount != null) {
			discount.setUsedQuantity(discount.getUsedQuantity() + 1);
			if (discount.getUsedQuantity() >= discount.getStock()) {
				discount.setStatus(Discount.Status.INACTIVE);
			}
			discountRepository.save(discount);
		}

		return CheckoutDTO.builder()
				.order(toDTO(savedOrder))
				.details(savedDetails)
				.subtotal(subtotal)
				.discountAmount(discountAmount)
				.build();
	}

	public OrderDTO cancelMyOrder(String email, Long id) {
		Order order = orderRepository.findByIdAndUser_EmailIgnoreCase(id, email)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
		if (order.getStatus() == Order.Status.CANCELED) {
			return toDTO(order);
		}
		if (order.getStatus() == Order.Status.COMPLETED) {
			throw new BadRequestException("Completed orders cannot be canceled");
		}
		if (order.getStatus() != Order.Status.CREATED && order.getStatus() != Order.Status.SHIPPING) {
			throw new BadRequestException("Only orders before completion can be canceled");
		}
		order.setStatus(Order.Status.CANCELED);
		order.setEndAt(null);
		return toDTO(orderRepository.save(order));
	}

	public OrderDTO create(OrderRequest req) {
		User user = null;
		Discount discount = null;
		if (req.getUserId() != null) {
			user = userRepository.findById(req.getUserId())
					.orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));
		}
		if (req.getDiscountId() != null) {
			discount = discountRepository.findById(req.getDiscountId()).orElseThrow(
					() -> new ResourceNotFoundException("Discount not found: " + req.getDiscountId()));
		}

		Order order = Order.builder()
				.code(req.getCode())
				.user(user)
				.status(req.getStatus() == null ? Order.Status.CREATED : req.getStatus())
				.receiverName(req.getReceiverName())
				.receiverPhone(req.getReceiverPhone())
				.shippingAddress(req.getShippingAddress())
				.paymentMethod(req.getPaymentMethod())
				.finalPrice(req.getFinalPrice())
				.discount(discount)
				.receiveAt(req.getReceiveAt())
				.endAt(req.getEndAt())
				.build();

		if (order.getStatus() == Order.Status.COMPLETED) {
			order.setEndAt(new Timestamp(System.currentTimeMillis()));
		} else {
			order.setEndAt(null);
		}

		return toDTO(orderRepository.save(order));
	}

	public OrderDTO update(Long id, OrderRequest req) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
		if (req.getCode() != null)
			order.setCode(req.getCode());
		if (req.getUserId() != null) {
			User user = userRepository.findById(req.getUserId())
					.orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));
			order.setUser(user);
		}
		if (req.getStatus() != null) {
			order.setStatus(req.getStatus());
			if (order.getStatus() == Order.Status.COMPLETED) {
				order.setEndAt(new Timestamp(System.currentTimeMillis()));
			} else {
				order.setEndAt(null);
			}
		}
		if (req.getReceiverName() != null)
			order.setReceiverName(req.getReceiverName());
		if (req.getReceiverPhone() != null)
			order.setReceiverPhone(req.getReceiverPhone());
		if (req.getShippingAddress() != null)
			order.setShippingAddress(req.getShippingAddress());
		if (req.getPaymentMethod() != null)
			order.setPaymentMethod(req.getPaymentMethod());
		if (req.getFinalPrice() != null)
			order.setFinalPrice(req.getFinalPrice());
		if (req.getDiscountId() != null) {
			Discount discount = discountRepository.findById(req.getDiscountId()).orElseThrow(
					() -> new ResourceNotFoundException("Discount not found: " + req.getDiscountId()));
			order.setDiscount(discount);
		}
		if (req.getReceiveAt() != null)
			order.setReceiveAt(req.getReceiveAt());
		// endAt is derived from status: COMPLETED => now, otherwise null
		return toDTO(orderRepository.save(order));
	}

	public void delete(Long id) {
		if (!orderRepository.existsById(id)) {
			throw new ResourceNotFoundException("Order not found: " + id);
		}
		orderRepository.deleteById(id);
	}

	private OrderDTO toDTO(Order o) {
		return OrderDTO.builder()
				.id(o.getId())
				.code(o.getCode())
				.createdAt(o.getCreatedAt())
				.receiveAt(o.getReceiveAt())
				.endAt(o.getEndAt())
				.userId(o.getUser() == null ? null : o.getUser().getId())
				.status(o.getStatus())
				.receiverName(o.getReceiverName())
				.receiverPhone(o.getReceiverPhone())
				.shippingAddress(o.getShippingAddress())
				.paymentMethod(o.getPaymentMethod())
				.finalPrice(o.getFinalPrice())
				.discountId(o.getDiscount() == null ? null : o.getDiscount().getId())
				.build();
	}

	private OrderDetailDTO toDetailDTO(OrderDetail od) {
		return OrderDetailDTO.builder()
				.orderDetailId(od.getOrderDetailId())
				.orderId(od.getOrder() == null ? null : od.getOrder().getId())
				.productId(od.getProduct() == null ? null : od.getProduct().getId())
				.quantity(od.getQuantity())
				.unitPrice(od.getUnitPrice())
				.build();
	}

	private void assertOrderOwnedByEmail(String email, Long orderId) {
		boolean owned = orderRepository.findByIdAndUser_EmailIgnoreCase(orderId, email).isPresent();
		if (!owned) {
			throw new UnauthorizedException("Order access denied");
		}
	}

	private String generateUniqueOrderCode() {
		for (int i = 0; i < 5; i++) {
			String code = "ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase(Locale.ROOT);
			if (!orderRepository.existsByCodeIgnoreCase(code)) {
				return code;
			}
		}
		return "ORD-" + System.currentTimeMillis();
	}

	private static void validateDiscountActive(Discount discount) {
		if (discount.getStatus() != Discount.Status.ACTIVE) {
			throw new BadRequestException("Discount is not active");
		}
		Timestamp now = new Timestamp(System.currentTimeMillis());
		if (discount.getStartAt() != null && now.before(discount.getStartAt())) {
			throw new BadRequestException("Discount is not started yet");
		}
		if (discount.getEndAt() != null && now.after(discount.getEndAt())) {
			throw new BadRequestException("Discount has expired");
		}
		int available = discount.getStock() - discount.getUsedQuantity();
		if (available <= 0) {
			throw new BadRequestException("Discount is out of stock");
		}
	}

	private static BigDecimal calculateDiscountAmount(BigDecimal subtotal, Discount discount) {
		if (subtotal == null) subtotal = BigDecimal.ZERO;
		if (discount == null || discount.getValue() == null) return BigDecimal.ZERO;
		BigDecimal value = discount.getValue();
		switch (discount.getType()) {
			case FIX:
				return value.min(subtotal).max(BigDecimal.ZERO);
			case PERCENT:
				// VND: round to 0 decimals
				return subtotal
						.multiply(value)
						.divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP)
						.min(subtotal)
						.max(BigDecimal.ZERO);
			default:
				return BigDecimal.ZERO;
		}
	}
}
