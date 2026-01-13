package com.mainproject.backend.entity.order;

import java.math.BigDecimal;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.mainproject.backend.entity.Discount;
import com.mainproject.backend.entity.User;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_id")
	private Long id;

	@Column(nullable = false, unique = true)
	private String code;

	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private Timestamp createdAt;

	@Column(name = "receive_at")
	private Timestamp receiveAt;

	@Column(name = "end_at")
	private Timestamp endAt;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private Status status = Status.CREATED;

	@Column(name = "receiver_name", nullable = false)
	private String receiverName;

	@Column(name = "receiver_phone", nullable = false, length = 50)
	private String receiverPhone;

	@Column(name = "shipping_address", nullable = false, length = 500)
	private String shippingAddress;

	@Enumerated(EnumType.STRING)
	@Column(name = "payment_method", nullable = false)
	private PaymentMethod paymentMethod;

	@Column(name = "final_price", nullable = false)
	private BigDecimal finalPrice;

	@ManyToOne
	@JoinColumn(name = "discount_id")
	private Discount discount;

	public enum Status { CREATED, SHIPPING, COMPLETED, CANCELED }
	public enum PaymentMethod { BANK_TRANSFER, CASH }
}
