package com.mainproject.backend.bootstrap;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.entity.User;
import com.mainproject.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class BootstrapAdminRunner implements ApplicationRunner {
	private static final String DEFAULT_ADMIN_NAME = "admin";
	private static final String DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
	private static final String DEFAULT_ADMIN_PASSWORD = "123456";

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		try {
			ensureAdminAccount();
		} catch (Exception ex) {
			// Don't prevent the app from starting if DB isn't reachable during tests/dev.
			log.warn("Bootstrap admin skipped: {}", ex.getMessage());
		}
	}

	private void ensureAdminAccount() {
		User existing = userRepository.findByEmailIgnoreCase(DEFAULT_ADMIN_EMAIL).orElse(null);
		if (existing == null) {
			User admin = User.builder()
					.name(DEFAULT_ADMIN_NAME)
					.email(DEFAULT_ADMIN_EMAIL)
					.passwordHash(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
					.role(User.Role.ADMIN)
					.build();
			userRepository.save(admin);
			log.info("Bootstrap admin created: {} / {}", DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
			return;
		}

		boolean changed = false;
		if (existing.getRole() != User.Role.ADMIN) {
			existing.setRole(User.Role.ADMIN);
			changed = true;
		}
		if (existing.getName() == null || existing.getName().isBlank()) {
			existing.setName(DEFAULT_ADMIN_NAME);
			changed = true;
		}

		String storedHash = existing.getPasswordHash();
		boolean matches = false;
		if (storedHash != null) {
			try {
				matches = passwordEncoder.matches(DEFAULT_ADMIN_PASSWORD, storedHash);
			} catch (IllegalArgumentException ex) {
				matches = false;
			}
			// If password stored as plaintext (dev convenience), accept and upgrade to bcrypt.
			if (!matches && DEFAULT_ADMIN_PASSWORD.equals(storedHash)) {
				matches = true;
				existing.setPasswordHash(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
				changed = true;
			}
		}
		if (!matches) {
			existing.setPasswordHash(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
			changed = true;
		}

		if (changed) {
			userRepository.save(existing);
			log.info("Bootstrap admin updated: {} / {}", DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
		}
	}
}
