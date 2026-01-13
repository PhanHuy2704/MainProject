package com.mainproject.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mainproject.backend.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}
