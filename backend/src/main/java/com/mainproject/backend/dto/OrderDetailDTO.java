package com.mainproject.backend.dto;

import java.math.BigDecimal;

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
public class OrderDetailDTO {
	private Long orderDetailId;
	private Long orderId;
	private Long productId;
	private int quantity;
	private BigDecimal unitPrice;
}
