package com.mainproject.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.dto.BrandDTO;
import com.mainproject.backend.dto.request.BrandRequest;
import com.mainproject.backend.entity.Brand;
import com.mainproject.backend.exception.ResourceNotFoundException;
import com.mainproject.backend.repository.BrandRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BrandService {
	private final BrandRepository brandRepository;

	@Transactional(readOnly = true)
	public List<BrandDTO> getAll() {
		return brandRepository.findAll().stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public BrandDTO getById(Long id) {
		Brand brand = brandRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + id));
		return toDTO(brand);
	}

	public BrandDTO create(BrandRequest req) {
		Brand brand = Brand.builder()
				.name(req.getName())
				.description(req.getDescription())
				.status(req.getStatus() == null ? Brand.Status.ACTIVE : req.getStatus())
				.build();
		return toDTO(brandRepository.save(brand));
	}

	public BrandDTO update(Long id, BrandRequest req) {
		Brand brand = brandRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + id));
		if (req.getName() != null)
			brand.setName(req.getName());
		if (req.getDescription() != null)
			brand.setDescription(req.getDescription());
		if (req.getStatus() != null)
			brand.setStatus(req.getStatus());
		return toDTO(brandRepository.save(brand));
	}

	public void delete(Long id) {
		if (!brandRepository.existsById(id)) {
			throw new ResourceNotFoundException("Brand not found: " + id);
		}
		brandRepository.deleteById(id);
	}

	private BrandDTO toDTO(Brand b) {
		return BrandDTO.builder()
				.id(b.getId())
				.name(b.getName())
				.description(b.getDescription())
				.status(b.getStatus())
				.createdAt(b.getCreatedAt())
				.updatedAt(b.getUpdatedAt())
				.build();
	}
}
