package com.mainproject.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.dto.OrderDetailDTO;
import com.mainproject.backend.dto.request.OrderDetailRequest;
import com.mainproject.backend.entity.order.Order;
import com.mainproject.backend.entity.order.OrderDetail;
import com.mainproject.backend.entity.Product;
import com.mainproject.backend.exception.ResourceNotFoundException;
import com.mainproject.backend.repository.OrderDetailRepository;
import com.mainproject.backend.repository.OrderRepository;
import com.mainproject.backend.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderDetailService {
	private final OrderDetailRepository orderDetailRepository;
	private final OrderRepository orderRepository;
	private final ProductRepository productRepository;

	@Transactional(readOnly = true)
	public List<OrderDetailDTO> getByOrderId(Long orderId) {
		return orderDetailRepository.findByOrder_Id(orderId).stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public OrderDetailDTO getById(Long id) {
		OrderDetail od = orderDetailRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("OrderDetail not found: " + id));
		return toDTO(od);
	}

	public OrderDetailDTO create(OrderDetailRequest req) {
		Order order = orderRepository.findById(req.getOrderId())
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + req.getOrderId()));
		Product product = productRepository.findById(req.getProductId()).orElseThrow(
				() -> new ResourceNotFoundException("Product not found: " + req.getProductId()));
		Integer quantityObj = req.getQuantity();
		int quantity = quantityObj == null ? 1 : quantityObj;

		OrderDetail od = OrderDetail.builder()
				.order(order)
				.product(product)
				.quantity(quantity)
				.unitPrice(req.getUnitPrice())
				.build();
		return toDTO(orderDetailRepository.save(od));
	}

	public OrderDetailDTO update(Long id, OrderDetailRequest req) {
		OrderDetail od = orderDetailRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("OrderDetail not found: " + id));
		if (req.getOrderId() != null) {
			Order order = orderRepository.findById(req.getOrderId())
					.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + req.getOrderId()));
			od.setOrder(order);
		}
		if (req.getProductId() != null) {
			Product product = productRepository.findById(req.getProductId()).orElseThrow(
					() -> new ResourceNotFoundException("Product not found: " + req.getProductId()));
			od.setProduct(product);
		}
		if (req.getQuantity() != null)
			od.setQuantity(req.getQuantity());
		if (req.getUnitPrice() != null)
			od.setUnitPrice(req.getUnitPrice());
		return toDTO(orderDetailRepository.save(od));
	}

	public void delete(Long id) {
		if (!orderDetailRepository.existsById(id)) {
			throw new ResourceNotFoundException("OrderDetail not found: " + id);
		}
		orderDetailRepository.deleteById(id);
	}

	private OrderDetailDTO toDTO(OrderDetail od) {
		return OrderDetailDTO.builder()
				.orderDetailId(od.getOrderDetailId())
				.orderId(od.getOrder() == null ? null : od.getOrder().getId())
				.productId(od.getProduct() == null ? null : od.getProduct().getId())
				.quantity(od.getQuantity())
				.unitPrice(od.getUnitPrice())
				.build();
	}
}
