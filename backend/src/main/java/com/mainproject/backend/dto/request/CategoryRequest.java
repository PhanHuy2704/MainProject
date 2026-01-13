package com.mainproject.backend.dto.request;

import com.mainproject.backend.entity.Category;

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
public class CategoryRequest {
	private String name;
	private String description;
	private Category.Status status;
}
