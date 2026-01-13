package com.mainproject.backend.controller.customer;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mainproject.backend.dto.AuthDTO;
import com.mainproject.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) {
		AuthDTO dto = authService.register(payload);
		return ResponseEntity.status(201).body(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> payload) {
		AuthDTO dto = authService.login(payload);
		return ResponseEntity.ok(dto);
    }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
    if (authorization != null && authorization.startsWith("Bearer ")) {
      String token = authorization.substring(7);
      authService.logout(token);
    }
    return ResponseEntity.noContent().build();
  }
}

