package com.mainproject.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mainproject.backend.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
