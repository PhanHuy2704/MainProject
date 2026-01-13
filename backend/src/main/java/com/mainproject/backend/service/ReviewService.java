package com.mainproject.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.dto.ReviewDTO;
import com.mainproject.backend.dto.request.ReviewRequest;
import com.mainproject.backend.entity.User;
import com.mainproject.backend.entity.Product;
import com.mainproject.backend.entity.Review;
import com.mainproject.backend.exception.ResourceNotFoundException;
import com.mainproject.backend.exception.BadRequestException;
import com.mainproject.backend.exception.UnauthorizedException;
import com.mainproject.backend.repository.ProductRepository;
import com.mainproject.backend.repository.ReviewRepository;
import com.mainproject.backend.repository.UserRepository;
import com.mainproject.backend.repository.OrderDetailRepository;
import com.mainproject.backend.entity.order.Order;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {
	private final ReviewRepository reviewRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final OrderDetailRepository orderDetailRepository;

	@Transactional(readOnly = true)
	public List<ReviewDTO> getByProductId(Long productId) {
		return reviewRepository.findByProduct_IdOrderByIdDesc(productId).stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public ReviewDTO getById(Long id) {
		Review review = reviewRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));
		return toDTO(review);
	}

	public ReviewDTO create(String email, ReviewRequest req) {
		if (req == null) {
			throw new BadRequestException("Request body is required");
		}
		if (req.getProductId() == null) {
			throw new BadRequestException("productId is required");
		}
		Product product = productRepository.findById(req.getProductId()).orElseThrow(
				() -> new ResourceNotFoundException("Product not found: " + req.getProductId()));
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

		boolean purchasedAndCompleted = orderDetailRepository
				.existsByOrder_User_EmailIgnoreCaseAndProduct_IdAndOrder_Status(email, product.getId(), Order.Status.COMPLETED);
		if (!purchasedAndCompleted) {
			throw new BadRequestException("You can only review products from completed orders");
		}
		Integer ratingObj = req.getRating();
		int rating = ratingObj == null ? 5 : ratingObj;

		Review review = Review.builder()
				.product(product)
				.user(user)
				.rating(rating)
				.comment(req.getComment())
				.build();
		return toDTO(reviewRepository.save(review));
	}

	public ReviewDTO update(String email, Long id, ReviewRequest req) {
		Review review = reviewRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Review not found: " + id));
		if (review.getUser() == null || review.getUser().getEmail() == null
				|| !review.getUser().getEmail().equalsIgnoreCase(email)) {
			throw new UnauthorizedException("Review access denied");
		}
		if (req == null) {
			return toDTO(review);
		}

		// Only allow updating rating/comment (no user/product reassignment)
		if (req.getRating() != null)
			review.setRating(req.getRating());
		if (req.getComment() != null)
			review.setComment(req.getComment());

		Long productId = review.getProduct() == null ? null : review.getProduct().getId();
		if (productId != null) {
			boolean purchasedAndCompleted = orderDetailRepository
					.existsByOrder_User_EmailIgnoreCaseAndProduct_IdAndOrder_Status(email, productId, Order.Status.COMPLETED);
			if (!purchasedAndCompleted) {
				throw new BadRequestException("You can only review products from completed orders");
			}
		}
		return toDTO(reviewRepository.save(review));
	}

	public void delete(Long id) {
		if (!reviewRepository.existsById(id)) {
			throw new ResourceNotFoundException("Review not found: " + id);
		}
		reviewRepository.deleteById(id);
	}

	private ReviewDTO toDTO(Review r) {
		return ReviewDTO.builder()
				.id(r.getId())
				.productId(r.getProduct() == null ? null : r.getProduct().getId())
				.userId(r.getUser() == null ? null : r.getUser().getId())
				.userName(r.getUser() == null ? null : r.getUser().getName())
				.rating(r.getRating())
				.comment(r.getComment())
				.build();
	}
}
