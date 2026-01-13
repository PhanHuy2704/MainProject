package com.mainproject.backend.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mainproject.backend.entity.User;
import com.mainproject.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {
	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

		String role = user.getRole() == null ? "ROLE_CUSTOMER" : "ROLE_" + user.getRole().name();

		return new org.springframework.security.core.userdetails.User(
				user.getEmail(),
				user.getPasswordHash(),
				List.of(new SimpleGrantedAuthority(role))
		);
	}
}
