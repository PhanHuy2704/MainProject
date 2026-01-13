package com.mainproject.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mainproject.backend.entity.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
	Optional<Discount> findByCodeIgnoreCase(String code);
	boolean existsByCodeIgnoreCase(String code);
}
