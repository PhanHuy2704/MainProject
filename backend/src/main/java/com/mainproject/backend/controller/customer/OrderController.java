package com.mainproject.backend.controller.customer;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mainproject.backend.dto.CheckoutDTO;
import com.mainproject.backend.dto.OrderDTO;
import com.mainproject.backend.dto.OrderDetailDTO;
import com.mainproject.backend.dto.request.CheckoutRequest;
import com.mainproject.backend.dto.request.OrderRequest;
import com.mainproject.backend.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
	private final OrderService orderService;

	@GetMapping
	public List<OrderDTO> getAll(Principal principal) {
		return orderService.getMyOrders(principal.getName());
	}

	@GetMapping("/{id}")
	public OrderDTO getById(Principal principal, @PathVariable Long id) {
		return orderService.getMyOrder(principal.getName(), id);
	}

	@GetMapping("/{orderId}/details")
	public List<OrderDetailDTO> getDetailsByOrderId(Principal principal, @PathVariable Long orderId) {
		return orderService.getMyOrderDetails(principal.getName(), orderId);
	}

	@PostMapping("/checkout")
	public CheckoutDTO checkout(Principal principal, @RequestBody CheckoutRequest req) {
		return orderService.checkout(principal.getName(), req);
	}

	@PutMapping("/{id}")
	public OrderDTO update(Principal principal, @PathVariable Long id, @RequestBody OrderRequest req) {
		// Customer update is limited to cancellation.
		return orderService.cancelMyOrder(principal.getName(), id);
	}
}
