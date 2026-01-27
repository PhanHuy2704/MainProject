package com.mainproject.backend.service;

import java.util.Locale;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.mainproject.backend.dto.AuthDTO;
import com.mainproject.backend.dto.UserDTO;
import com.mainproject.backend.dto.request.AuthRequest;
import com.mainproject.backend.entity.User;
import com.mainproject.backend.exception.BadRequestException;
import com.mainproject.backend.exception.UnauthorizedException;
import com.mainproject.backend.repository.UserRepository;
import com.mainproject.backend.security.JwtUtil;
import com.mainproject.backend.security.TokenBlacklist;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final TokenBlacklist tokenBlacklist;

	public AuthDTO register(Map<String, Object> payload) {
		AuthRequest.RegisterRequest req = parseRegisterRequest(payload);
		String name = req.getName();
		String email = req.getEmail();
		String rawPassword = req.getPassword();

		if (!StringUtils.hasText(name) || !StringUtils.hasText(email) || !StringUtils.hasText(rawPassword)) {
			throw new BadRequestException("name, email, password are required");
		}

		String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
		if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
			throw new BadRequestException("Email already exists");
		}

		User user = User.builder()
				.name(name.trim())
				.email(normalizedEmail)
				.passwordHash(passwordEncoder.encode(rawPassword))
				.phone(req.getPhone())
				.gender(req.getGender())
				.address(req.getAddress())
				.role(User.Role.CUSTOMER)
				.build();

		User saved = userRepository.save(user);
		String token = jwtUtil.generateToken(saved);
		return AuthDTO.builder().user(toDTO(saved)).token(token).build();
	}

	
	public AuthDTO login(Map<String, Object> payload) {
		AuthRequest.LoginRequest req = parseLoginRequest(payload);
		String email = req.getEmail();
		String rawPassword = req.getPassword();

		if (!StringUtils.hasText(email) || !StringUtils.hasText(rawPassword)) {
			throw new BadRequestException("email and password are required");
		}

		String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
		User user = userRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
		if (user == null || !matchesAndMaybeUpgradePassword(user, rawPassword)) {
			throw new UnauthorizedException("Invalid credentials");
		}

		String token = jwtUtil.generateToken(user);
		return AuthDTO.builder().user(toDTO(user)).token(token).build();
	}

	private boolean matchesAndMaybeUpgradePassword(User user, String rawPassword) {
		String stored = user.getPasswordHash();
		if (!StringUtils.hasText(stored) || !StringUtils.hasText(rawPassword)) return false;

		if (looksLikeBcrypt(stored)) {
			try {
				return passwordEncoder.matches(rawPassword, stored);
			} catch (IllegalArgumentException ex) {
				return false;
			}
		}


		if (!rawPassword.equals(stored)) return false;
		user.setPasswordHash(passwordEncoder.encode(rawPassword));
		userRepository.save(user);
		return true;
	}

	private static boolean looksLikeBcrypt(String stored) {
		String s = stored.trim();
		return s.startsWith("$2a$") || s.startsWith("$2b$") || s.startsWith("$2y$");
	}

	public void logout(String token) {
		tokenBlacklist.blacklist(token);
	}

	private AuthRequest.LoginRequest parseLoginRequest(Map<String, Object> payload) {
		Map<String, Object> body = unwrapBody(payload);

		String password = asString(body.get("password"));
		if (!StringUtils.hasText(password)) {
			
			password = asString(body.get("passwordHash"));
		}

		return AuthRequest.LoginRequest.builder()
				.email(asString(body.get("email")))
				.password(password)
				.build();
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

	private AuthRequest.RegisterRequest parseRegisterRequest(Map<String, Object> payload) {
		Map<String, Object> body = unwrapBody(payload);

		String password = asString(body.get("password"));
		if (!StringUtils.hasText(password)) {
			
			password = asString(body.get("passwordHash"));
		}

		return AuthRequest.RegisterRequest.builder()
				.name(asString(body.get("name")))
				.email(asString(body.get("email")))
				.password(password)
				.phone(asString(body.get("phone")))
				.gender(asString(body.get("gender")))
				.address(asString(body.get("address")))
				.build();
	}

	private static Map<String, Object> unwrapBody(Map<String, Object> payload) {
		if (payload == null) {
			return Map.of();
		}
		Object wrappedUser = payload.get("user");
		if (wrappedUser instanceof Map<?, ?> wrappedMap) {
			@SuppressWarnings("unchecked")
			Map<String, Object> casted = (Map<String, Object>) wrappedMap;
			return casted;
		}
		return payload;
	}

	private static String asString(Object value) {
		return value == null ? null : String.valueOf(value);
	}
}

