package com.mainproject.backend.dto.request;

import java.util.List;

import com.mainproject.backend.entity.order.Order;

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
public class CheckoutRequest {
	private String receiverName;
	private String receiverPhone;
	private String shippingAddress;
	private Order.PaymentMethod paymentMethod;
	private String discountCode;
	private List<Item> items;

	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class Item {
		private Long productId;
		private Integer quantity;
	}
}
