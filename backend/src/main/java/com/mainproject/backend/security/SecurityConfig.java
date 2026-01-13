package com.mainproject.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	private final JwtRequestFilter jwtRequestFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.cors(Customizer.withDefaults())
				.csrf(csrf -> csrf.disable())
				.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						// Spring Boot error endpoint (avoid masking real errors as 403)
						.requestMatchers("/error").permitAll()

						// Auth endpoints
						.requestMatchers("/api/auth/**").permitAll()

						// Public reads
							.requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
							.requestMatchers(HttpMethod.GET, "/api/reviews", "/api/reviews/**").permitAll()
							.requestMatchers(HttpMethod.GET, "/api/brands", "/api/brands/**").permitAll()
							.requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/**").permitAll()
							.requestMatchers(HttpMethod.GET, "/api/discounts", "/api/discounts/**").permitAll()

						// Product writes should be admin
						.requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

						// Admin APIs
						.requestMatchers("/api/admin/**").hasRole("ADMIN")

						// Everything else requires authentication
						.anyRequest().authenticated()
				);

		http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
