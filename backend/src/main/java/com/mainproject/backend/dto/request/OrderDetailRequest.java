package com.mainproject.backend.dto.request;

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
public class OrderDetailRequest {
	private Long orderId;
	private Long productId;
	private Integer quantity;
	private BigDecimal unitPrice;
}
