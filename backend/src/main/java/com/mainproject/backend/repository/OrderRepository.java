package com.mainproject.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mainproject.backend.entity.order.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	Optional<Order> findByCodeIgnoreCase(String code);
	boolean existsByCodeIgnoreCase(String code);
	List<Order> findByUser_EmailIgnoreCaseOrderByCreatedAtDesc(String email);
	Optional<Order> findByIdAndUser_EmailIgnoreCase(Long id, String email);
}
