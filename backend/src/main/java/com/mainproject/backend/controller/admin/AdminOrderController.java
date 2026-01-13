package com.mainproject.backend.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mainproject.backend.dto.OrderDTO;
import com.mainproject.backend.dto.OrderDetailDTO;
import com.mainproject.backend.dto.request.OrderDetailRequest;
import com.mainproject.backend.dto.request.OrderRequest;
import com.mainproject.backend.service.OrderDetailService;
import com.mainproject.backend.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {
	private final OrderService orderService;
	private final OrderDetailService orderDetailService;

	@GetMapping
	public List<OrderDTO> getAll() {
		return orderService.getAll();
	}

	@GetMapping("/{id}")
	public OrderDTO getById(@PathVariable Long id) {
		return orderService.getById(id);
	}

	@PostMapping
	public ResponseEntity<OrderDTO> create(@RequestBody OrderRequest req) {
		return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(req));
	}

	@PutMapping("/{id}")
	public OrderDTO update(@PathVariable Long id, @RequestBody OrderRequest req) {
		return orderService.update(id, req);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		orderService.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{orderId}/details")
	public List<OrderDetailDTO> getDetailsByOrderId(@PathVariable Long orderId) {
		return orderDetailService.getByOrderId(orderId);
	}

	@GetMapping("/details/{id}")
	public OrderDetailDTO getDetailById(@PathVariable Long id) {
		return orderDetailService.getById(id);
	}

	@PostMapping("/{orderId}/details")
	public ResponseEntity<OrderDetailDTO> createDetail(@PathVariable Long orderId, @RequestBody OrderDetailRequest req) {
		OrderDetailRequest merged = OrderDetailRequest.builder()
				.orderId(orderId)
				.productId(req.getProductId())
				.quantity(req.getQuantity())
				.unitPrice(req.getUnitPrice())
				.build();
		return ResponseEntity.status(HttpStatus.CREATED).body(orderDetailService.create(merged));
	}

	@PutMapping("/details/{id}")
	public OrderDetailDTO updateDetail(@PathVariable Long id, @RequestBody OrderDetailRequest req) {
		return orderDetailService.update(id, req);
	}

	@DeleteMapping("/details/{id}")
	public ResponseEntity<Void> deleteDetail(@PathVariable Long id) {
		orderDetailService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
