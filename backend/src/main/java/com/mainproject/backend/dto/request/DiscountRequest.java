package com.mainproject.backend.dto.request;

import java.math.BigDecimal;
import java.sql.Timestamp;

import com.mainproject.backend.entity.Discount;

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
public class DiscountRequest {
	private String code;
	private Discount.Type type;
	private Timestamp startAt;
	private Timestamp endAt;
	private BigDecimal value;
	private Integer stock;
	private Integer usedQuantity;
	private Discount.Status status;
}
