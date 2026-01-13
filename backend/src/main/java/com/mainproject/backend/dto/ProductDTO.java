package com.mainproject.backend.dto;

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
public class ProductDTO {
	private Long id;
	private String name;
	private Long brandId;
	private Long categoryId;
	private int stock;
	private int soldQuantity;
	private String code;
	private String image;
	private BigDecimal price;
	private String description;
	private Product.Status status;
}
