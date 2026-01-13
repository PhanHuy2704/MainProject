package com.mainproject.backend.dto;

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
public class ReviewDTO {
	private Long id;
	private Long productId;
	private Long userId;
	private String userName;
	private int rating;
	private String comment;
}
