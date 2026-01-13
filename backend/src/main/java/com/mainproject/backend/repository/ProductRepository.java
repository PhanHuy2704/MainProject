package com.mainproject.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mainproject.backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	Optional<Product> findByCodeIgnoreCase(String code);
	boolean existsByCodeIgnoreCase(String code);
}
