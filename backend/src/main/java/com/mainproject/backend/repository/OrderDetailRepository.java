package com.mainproject.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mainproject.backend.entity.order.OrderDetail;
import com.mainproject.backend.entity.order.Order;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
	List<OrderDetail> findByOrder_Id(Long orderId);
	boolean existsByOrder_User_EmailIgnoreCaseAndProduct_IdAndOrder_Status(String email, Long productId, Order.Status status);
}
