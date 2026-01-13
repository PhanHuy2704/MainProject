package com.mainproject.backend.controller.customer;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mainproject.backend.dto.DiscountDTO;
import com.mainproject.backend.service.DiscountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {
	private final DiscountService discountService;

	@GetMapping("/code/{code}")
	public DiscountDTO getValidByCode(@PathVariable String code) {
		return discountService.getValidByCode(code);
	}
}
