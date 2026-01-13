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

import com.mainproject.backend.dto.CategoryDTO;
import com.mainproject.backend.dto.request.CategoryRequest;
import com.mainproject.backend.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {
	private final CategoryService categoryService;

	@GetMapping
	public List<CategoryDTO> getAll() {
		return categoryService.getAll();
	}

	@GetMapping("/{id}")
	public CategoryDTO getById(@PathVariable Long id) {
		return categoryService.getById(id);
	}

	@PostMapping
	public ResponseEntity<CategoryDTO> create(@RequestBody CategoryRequest req) {
		return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(req));
	}

	@PutMapping("/{id}")
	public CategoryDTO update(@PathVariable Long id, @RequestBody CategoryRequest req) {
		return categoryService.update(id, req);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		categoryService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
