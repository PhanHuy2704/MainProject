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

import com.mainproject.backend.dto.DiscountDTO;
import com.mainproject.backend.dto.request.DiscountRequest;
import com.mainproject.backend.service.DiscountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/discounts")
@RequiredArgsConstructor
public class AdminDiscountController {
	private final DiscountService discountService;

	@GetMapping
	public List<DiscountDTO> getAll() {
		return discountService.getAll();
	}

	@GetMapping("/{id}")
	public DiscountDTO getById(@PathVariable Long id) {
		return discountService.getById(id);
	}

	@PostMapping
	public ResponseEntity<DiscountDTO> create(@RequestBody DiscountRequest req) {
		return ResponseEntity.status(HttpStatus.CREATED).body(discountService.create(req));
	}

	@PutMapping("/{id}")
	public DiscountDTO update(@PathVariable Long id, @RequestBody DiscountRequest req) {
		return discountService.update(id, req);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		discountService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
