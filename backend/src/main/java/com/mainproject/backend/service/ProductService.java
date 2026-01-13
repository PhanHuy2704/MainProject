package com.mainproject.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.dto.ProductDTO;
import com.mainproject.backend.dto.request.ProductRequest;
import com.mainproject.backend.entity.Brand;
import com.mainproject.backend.entity.Category;
import com.mainproject.backend.entity.Product;
import com.mainproject.backend.exception.ResourceNotFoundException;
import com.mainproject.backend.repository.BrandRepository;
import com.mainproject.backend.repository.CategoryRepository;
import com.mainproject.backend.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
	private final ProductRepository productRepository;
	private final BrandRepository brandRepository;
	private final CategoryRepository categoryRepository;

	@Transactional(readOnly = true)
	public List<ProductDTO> getAll() {
		return productRepository.findAll().stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public ProductDTO getById(Long id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
		return toDTO(product);
	}

	public ProductDTO create(ProductRequest req) {
		Brand brand = null;
		Category category = null;
		if (req.getBrandId() != null) {
			brand = brandRepository.findById(req.getBrandId())
					.orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + req.getBrandId()));
		}
		if (req.getCategoryId() != null) {
			category = categoryRepository.findById(req.getCategoryId()).orElseThrow(
					() -> new ResourceNotFoundException("Category not found: " + req.getCategoryId()));
		}

		Product.Status status = req.getStatus() == null ? Product.Status.IN_STOCK : req.getStatus();
		Integer stockObj = req.getStock();
		Integer soldQuantityObj = req.getSoldQuantity();
		int stock = stockObj == null ? 0 : stockObj;
		int soldQuantity = soldQuantityObj == null ? 0 : soldQuantityObj;

		Product product = Product.builder()
				.name(req.getName())
				.brand(brand)
				.category(category)
				.stock(stock)
				.soldQuantity(soldQuantity)
				.code(req.getCode())
				.image(req.getImage())
				.price(req.getPrice())
				.description(req.getDescription())
				.status(status)
				.build();

		return toDTO(productRepository.save(product));
	}

	public ProductDTO update(Long id, ProductRequest req) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
		if (req.getName() != null)
			product.setName(req.getName());
		if (req.getBrandId() != null) {
			Brand brand = brandRepository.findById(req.getBrandId())
					.orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + req.getBrandId()));
			product.setBrand(brand);
		}
		if (req.getCategoryId() != null) {
			Category category = categoryRepository.findById(req.getCategoryId()).orElseThrow(
					() -> new ResourceNotFoundException("Category not found: " + req.getCategoryId()));
			product.setCategory(category);
		}
		if (req.getStock() != null)
			product.setStock(req.getStock());
		if (req.getSoldQuantity() != null)
			product.setSoldQuantity(req.getSoldQuantity());
		if (req.getCode() != null)
			product.setCode(req.getCode());
		if (req.getImage() != null)
			product.setImage(req.getImage());
		if (req.getPrice() != null)
			product.setPrice(req.getPrice());
		if (req.getDescription() != null)
			product.setDescription(req.getDescription());
		if (req.getStatus() != null)
			product.setStatus(req.getStatus());
		return toDTO(productRepository.save(product));
	}

	public void delete(Long id) {
		if (!productRepository.existsById(id)) {
			throw new ResourceNotFoundException("Product not found: " + id);
		}
		productRepository.deleteById(id);
	}

	private ProductDTO toDTO(Product p) {
		return ProductDTO.builder()
				.id(p.getId())
				.name(p.getName())
				.brandId(p.getBrand() == null ? null : p.getBrand().getId())
				.categoryId(p.getCategory() == null ? null : p.getCategory().getId())
				.stock(p.getStock())
				.soldQuantity(p.getSoldQuantity())
				.code(p.getCode())
				.image(p.getImage())
				.price(p.getPrice())
				.description(p.getDescription())
				.status(p.getStatus())
				.build();
	}
}
