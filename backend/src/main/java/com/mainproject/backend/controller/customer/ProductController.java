package com.mainproject.backend.controller.customer;

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

import com.mainproject.backend.dto.ProductDTO;
import com.mainproject.backend.dto.request.ProductRequest;
import com.mainproject.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
	private final ProductService productService;

	@GetMapping
	public List<ProductDTO> getAll() {
		return productService.getAll();
	}

	@GetMapping("/{id}")
	public ProductDTO getById(@PathVariable Long id) {
		return productService.getById(id);
	}

	@PostMapping
	public ResponseEntity<ProductDTO> create(@RequestBody ProductRequest req) {
		return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(req));
	}

	@PutMapping("/{id}")
	public ProductDTO update(@PathVariable Long id, @RequestBody ProductRequest req) {
		return productService.update(id, req);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		productService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
