package com.mainproject.backend.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "discounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "discount_id")
	private Long id;

	@Column(nullable = false, unique = true)
	private String code;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Type type;

	@Column(name = "start_at", nullable = false)
	private Timestamp startAt;

	@Column(name = "end_at", nullable = false)
	private Timestamp endAt;

	@Column(nullable = false)
	private BigDecimal value;

	@Column(nullable = false)
	private int stock;

	@Column(name = "used_quantity", nullable = false)
	private int usedQuantity;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private Status status = Status.ACTIVE;

	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private Timestamp createdAt;

	@Column(name = "updated_at", insertable = false, updatable = false)
	private Timestamp updatedAt;

	public enum Type { FIX, PERCENT }
	public enum Status { ACTIVE, INACTIVE, EXPIRED }
}
