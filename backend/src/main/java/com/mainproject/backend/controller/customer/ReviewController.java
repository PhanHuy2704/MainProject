package com.mainproject.backend.controller.customer;

import java.util.List;
import java.security.Principal;

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

import com.mainproject.backend.dto.ReviewDTO;
import com.mainproject.backend.dto.request.ReviewRequest;
import com.mainproject.backend.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
	private final ReviewService reviewService;

	@GetMapping("/product/{productId}")
	public List<ReviewDTO> getByProductId(@PathVariable Long productId) {
		return reviewService.getByProductId(productId);
	}

	@GetMapping("/{id}")
	public ReviewDTO getById(@PathVariable Long id) {
		return reviewService.getById(id);
	}

	@PostMapping
	public ResponseEntity<ReviewDTO> create(Principal principal, @RequestBody ReviewRequest req) {
		return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.create(principal.getName(), req));
	}

	@PutMapping("/{id}")
	public ReviewDTO update(Principal principal, @PathVariable Long id, @RequestBody ReviewRequest req) {
		return reviewService.update(principal.getName(), id, req);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		reviewService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
