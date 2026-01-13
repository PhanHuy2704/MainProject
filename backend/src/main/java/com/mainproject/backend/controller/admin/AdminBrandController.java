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

import com.mainproject.backend.dto.BrandDTO;
import com.mainproject.backend.dto.request.BrandRequest;
import com.mainproject.backend.service.BrandService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/brands")
@RequiredArgsConstructor
public class AdminBrandController {
	private final BrandService brandService;

	@GetMapping
	public List<BrandDTO> getAll() {
		return brandService.getAll();
	}

	@GetMapping("/{id}")
	public BrandDTO getById(@PathVariable Long id) {
		return brandService.getById(id);
	}

	@PostMapping
	public ResponseEntity<BrandDTO> create(@RequestBody BrandRequest req) {
		return ResponseEntity.status(HttpStatus.CREATED).body(brandService.create(req));
	}

	@PutMapping("/{id}")
	public BrandDTO update(@PathVariable Long id, @RequestBody BrandRequest req) {
		return brandService.update(id, req);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		brandService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
