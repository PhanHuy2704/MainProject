package com.mainproject.backend.controller.customer;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mainproject.backend.dto.CategoryDTO;
import com.mainproject.backend.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
	private final CategoryService categoryService;

	@GetMapping
	public List<CategoryDTO> getAll() {
		return categoryService.getAll();
	}

	@GetMapping("/{id}")
	public CategoryDTO getById(@PathVariable Long id) {
		return categoryService.getById(id);
	}
}
