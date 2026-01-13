package com.mainproject.backend.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

import com.mainproject.backend.entity.order.Order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
	private Long id;
	private String code;
	private Timestamp createdAt;
	private Timestamp receiveAt;
	private Timestamp endAt;
	private Long userId;
	private Order.Status status;
	private String receiverName;
	private String receiverPhone;
	private String shippingAddress;
	private Order.PaymentMethod paymentMethod;
	private BigDecimal finalPrice;
	private Long discountId;
}
