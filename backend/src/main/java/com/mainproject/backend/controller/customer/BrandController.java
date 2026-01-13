package com.mainproject.backend.controller.customer;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mainproject.backend.dto.BrandDTO;
import com.mainproject.backend.service.BrandService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {
	private final BrandService brandService;

	@GetMapping
	public List<BrandDTO> getAll() {
		return brandService.getAll();
	}

	@GetMapping("/{id}")
	public BrandDTO getById(@PathVariable Long id) {
		return brandService.getById(id);
	}
}
