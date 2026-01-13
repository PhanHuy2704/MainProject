package com.mainproject.backend.dto.request;

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
public class OrderRequest {
	private String code;
	private Long userId;
	private Order.Status status;
	private String receiverName;
	private String receiverPhone;
	private String shippingAddress;
	private Order.PaymentMethod paymentMethod;
	private BigDecimal finalPrice;
	private Long discountId;
	private Timestamp receiveAt;
	private Timestamp endAt;
}
