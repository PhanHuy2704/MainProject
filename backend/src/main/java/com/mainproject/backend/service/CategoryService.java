package com.mainproject.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.dto.CategoryDTO;
import com.mainproject.backend.dto.request.CategoryRequest;
import com.mainproject.backend.entity.Category;
import com.mainproject.backend.exception.ResourceNotFoundException;
import com.mainproject.backend.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
	private final CategoryRepository categoryRepository;

	@Transactional(readOnly = true)
	public List<CategoryDTO> getAll() {
		return categoryRepository.findAll().stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public CategoryDTO getById(Long id) {
		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
		return toDTO(category);
	}

	public CategoryDTO create(CategoryRequest req) {
		Category category = Category.builder()
				.name(req.getName())
				.description(req.getDescription())
				.status(req.getStatus() == null ? Category.Status.ACTIVE : req.getStatus())
				.build();
		return toDTO(categoryRepository.save(category));
	}

	public CategoryDTO update(Long id, CategoryRequest req) {
		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
		if (req.getName() != null)
			category.setName(req.getName());
		if (req.getDescription() != null)
			category.setDescription(req.getDescription());
		if (req.getStatus() != null)
			category.setStatus(req.getStatus());
		return toDTO(categoryRepository.save(category));
	}

	public void delete(Long id) {
		if (!categoryRepository.existsById(id)) {
			throw new ResourceNotFoundException("Category not found: " + id);
		}
		categoryRepository.deleteById(id);
	}

	private CategoryDTO toDTO(Category c) {
		return CategoryDTO.builder()
				.id(c.getId())
				.name(c.getName())
				.description(c.getDescription())
				.status(c.getStatus())
				.createdAt(c.getCreatedAt())
				.updatedAt(c.getUpdatedAt())
				.build();
	}
}
