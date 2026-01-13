package com.mainproject.backend.dto;

import java.math.BigDecimal;
import java.util.List;

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
public class CheckoutDTO {
	private OrderDTO order;
	private List<OrderDetailDTO> details;
	private BigDecimal subtotal;
	private BigDecimal discountAmount;
}
