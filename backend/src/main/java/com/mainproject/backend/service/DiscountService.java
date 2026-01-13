package com.mainproject.backend.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.dto.DiscountDTO;
import com.mainproject.backend.dto.request.DiscountRequest;
import com.mainproject.backend.entity.Discount;
import com.mainproject.backend.exception.BadRequestException;
import com.mainproject.backend.exception.ResourceNotFoundException;
import com.mainproject.backend.repository.DiscountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DiscountService {
	private final DiscountRepository discountRepository;

	public List<DiscountDTO> getAll() {
		List<Discount> discounts = discountRepository.findAll();
		boolean changed = false;
		for (Discount d : discounts) {
			changed = applyAutoStatus(d) || changed;
		}
		if (changed) {
			discountRepository.saveAll(discounts);
		}
		return discounts.stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public DiscountDTO getById(Long id) {
		Discount discount = discountRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Discount not found: " + id));
		if (applyAutoStatus(discount)) {
			discountRepository.save(discount);
		}
		return toDTO(discount);
	}

	@Transactional(readOnly = true)
	public DiscountDTO getValidByCode(String code) {
		if (code == null || code.isBlank()) {
			throw new BadRequestException("code is required");
		}
		String normalized = code.trim().toLowerCase(Locale.ROOT);
		Discount discount = discountRepository.findByCodeIgnoreCase(normalized)
				.orElseThrow(() -> new ResourceNotFoundException("Discount not found: " + code));
		if (applyAutoStatus(discount)) {
			discountRepository.save(discount);
		}
		validateDiscountActive(discount);
		return toDTO(discount);
	}

	private static void validateDiscountActive(Discount discount) {
		if (discount.getStatus() != Discount.Status.ACTIVE) {
			throw new BadRequestException("Discount is not active");
		}
		Timestamp now = new Timestamp(System.currentTimeMillis());
		if (discount.getStartAt() != null && now.before(discount.getStartAt())) {
			throw new BadRequestException("Discount is not started yet");
		}
		if (discount.getEndAt() != null && now.after(discount.getEndAt())) {
			throw new BadRequestException("Discount has expired");
		}
		int available = discount.getStock() - discount.getUsedQuantity();
		if (available <= 0) {
			throw new BadRequestException("Discount is out of stock");
		}
	}

	private static boolean applyAutoStatus(Discount discount) {
		if (discount == null) return false;
		Discount.Status before = discount.getStatus();
		Timestamp now = new Timestamp(System.currentTimeMillis());
		if (discount.getEndAt() != null && now.after(discount.getEndAt())) {
			discount.setStatus(Discount.Status.EXPIRED);
		} else if (discount.getStock() <= 0 || discount.getUsedQuantity() >= discount.getStock()) {
			discount.setStatus(Discount.Status.INACTIVE);
		}
		return before != discount.getStatus();
	}

	public DiscountDTO create(DiscountRequest req) {
		Integer stockObj = req.getStock();
		Integer usedQuantityObj = req.getUsedQuantity();
		int stock = stockObj == null ? 0 : stockObj;
		int usedQuantity = usedQuantityObj == null ? 0 : usedQuantityObj;

		Discount discount = Discount.builder()
				.code(req.getCode())
				.type(req.getType())
				.startAt(req.getStartAt())
				.endAt(req.getEndAt())
				.value(req.getValue())
				.stock(stock)
				.usedQuantity(usedQuantity)
				.status(req.getStatus() == null ? Discount.Status.ACTIVE : req.getStatus())
				.build();
		applyAutoStatus(discount);
		return toDTO(discountRepository.save(discount));
	}

	public DiscountDTO update(Long id, DiscountRequest req) {
		Discount discount = discountRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Discount not found: " + id));
		if (req.getCode() != null)
			discount.setCode(req.getCode());
		if (req.getType() != null)
			discount.setType(req.getType());
		if (req.getStartAt() != null)
			discount.setStartAt(req.getStartAt());
		if (req.getEndAt() != null)
			discount.setEndAt(req.getEndAt());
		if (req.getValue() != null)
			discount.setValue(req.getValue());
		if (req.getStock() != null)
			discount.setStock(req.getStock());
		if (req.getUsedQuantity() != null)
			discount.setUsedQuantity(req.getUsedQuantity());
		if (req.getStatus() != null)
			discount.setStatus(req.getStatus());
		applyAutoStatus(discount);
		return toDTO(discountRepository.save(discount));
	}

	public void delete(Long id) {
		if (!discountRepository.existsById(id)) {
			throw new ResourceNotFoundException("Discount not found: " + id);
		}
		discountRepository.deleteById(id);
	}

	private DiscountDTO toDTO(Discount d) {
		return DiscountDTO.builder()
				.id(d.getId())
				.code(d.getCode())
				.type(d.getType())
				.startAt(d.getStartAt())
				.endAt(d.getEndAt())
				.value(d.getValue())
				.stock(d.getStock())
				.usedQuantity(d.getUsedQuantity())
				.status(d.getStatus())
				.build();
	}
}
