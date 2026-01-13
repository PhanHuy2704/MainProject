package com.mainproject.backend.dto.request;

import java.math.BigDecimal;

import com.mainproject.backend.entity.Product;

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
public class ProductRequest {
	private String name;
	private Long brandId;
	private Long categoryId;
	private Integer stock;
	private Integer soldQuantity;
	private String code;
	private String image;
	private BigDecimal price;
	private String description;
	private Product.Status status;
}
