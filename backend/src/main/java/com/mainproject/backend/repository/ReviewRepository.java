package com.mainproject.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mainproject.backend.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
	List<Review> findByProduct_IdOrderByIdDesc(Long productId);
}
