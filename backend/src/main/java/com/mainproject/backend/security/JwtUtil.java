package com.mainproject.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.mainproject.backend.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	private final SecretKey signingKey;
	private final long expirationMillis;
	private final TokenBlacklist tokenBlacklist;

	public JwtUtil(
			@Value("${jwt.secret}") String secret,
			@Value("${jwt.expirationMillis}") long expirationMillis,
			TokenBlacklist tokenBlacklist) {
		this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.expirationMillis = expirationMillis;
		this.tokenBlacklist = tokenBlacklist;
	}

	public String generateToken(User user) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expirationMillis);

		String role = user.getRole() == null ? null : "ROLE_" + user.getRole().name();

		return Jwts.builder()
				.subject(user.getEmail())
				.issuedAt(now)
				.expiration(expiry)
				.claim("role", role)
				.signWith(signingKey)
				.compact();
	}

	public boolean isTokenBlacklisted(String token) {
		return tokenBlacklist.isBlacklisted(token);
	}

	public String extractEmail(String token) {
		return extractAllClaims(token).getSubject();
	}

	public Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(signingKey)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	public boolean isTokenValid(String token) {
		if (tokenBlacklist.isBlacklisted(token)) {
			return false;
		}
		try {
			Claims claims = extractAllClaims(token);
			Date exp = claims.getExpiration();
			return exp != null && exp.after(new Date());
		} catch (Exception ex) {
			return false;
		}
	}
}
