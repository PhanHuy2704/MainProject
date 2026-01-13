package com.mainproject.backend.dto;

import java.sql.Timestamp;

import com.mainproject.backend.entity.Brand;

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
public class BrandDTO {
	private Long id;
	private String name;
	private String description;
	private Brand.Status status;
	private Timestamp createdAt;
	private Timestamp updatedAt;
}
