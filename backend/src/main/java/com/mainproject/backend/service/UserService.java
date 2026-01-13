package com.mainproject.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.mainproject.backend.dto.UserDTO;
import com.mainproject.backend.dto.request.ChangePasswordRequest;
import com.mainproject.backend.dto.request.UserUpdateRequest;
import com.mainproject.backend.entity.User;
import com.mainproject.backend.exception.BadRequestException;
import com.mainproject.backend.exception.ResourceNotFoundException;
import com.mainproject.backend.exception.UnauthorizedException;
import com.mainproject.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public List<UserDTO> getAll() {
		return userRepository.findAll().stream().map(this::toDTO).toList();
	}

	@Transactional(readOnly = true)
	public UserDTO getByEmail(String email) {
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
		return toDTO(user);
	}

	public UserDTO updateByEmail(String email, UserUpdateRequest req) {
		if (req == null) {
			throw new BadRequestException("Request body is required");
		}
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
		if (req.getName() != null) user.setName(req.getName());
		if (req.getPhone() != null) user.setPhone(req.getPhone());
		if (req.getGender() != null) user.setGender(req.getGender());
		if (req.getAddress() != null) user.setAddress(req.getAddress());
		return toDTO(userRepository.save(user));
	}

	public void changePasswordByEmail(String email, ChangePasswordRequest req) {
		if (req == null) {
			throw new BadRequestException("Request body is required");
		}
		String currentPassword = req.getCurrentPassword();
		String newPassword = req.getNewPassword();
		if (currentPassword == null || currentPassword.isBlank() || newPassword == null || newPassword.isBlank()) {
			throw new BadRequestException("currentPassword and newPassword are required");
		}
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
		if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
			throw new UnauthorizedException("Current password is incorrect");
		}
		user.setPasswordHash(passwordEncoder.encode(newPassword));
		userRepository.save(user);
	}

	@Transactional(readOnly = true)
	public UserDTO getById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
		return toDTO(user);
	}

	public void delete(Long id) {
		if (!userRepository.existsById(id)) {
			throw new ResourceNotFoundException("User not found: " + id);
		}
		userRepository.deleteById(id);
	}

	private UserDTO toDTO(User u) {
		return UserDTO.builder()
				.id(u.getId())
				.role(u.getRole())
				.name(u.getName())
				.email(u.getEmail())
				.phone(u.getPhone())
				.gender(u.getGender())
				.address(u.getAddress())
				.createdAt(u.getCreatedAt())
				.build();
	}

}
