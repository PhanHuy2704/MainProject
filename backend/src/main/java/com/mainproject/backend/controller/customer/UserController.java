package com.mainproject.backend.controller.customer;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mainproject.backend.dto.UserDTO;
import com.mainproject.backend.dto.request.ChangePasswordRequest;
import com.mainproject.backend.dto.request.UserUpdateRequest;
import com.mainproject.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@GetMapping("/me")
	public UserDTO getMe(Principal principal) {
		return userService.getByEmail(principal.getName());
	}

	@PutMapping("/me")
	public UserDTO updateMe(Principal principal, @RequestBody UserUpdateRequest req) {
		return userService.updateByEmail(principal.getName(), req);
	}

	@PutMapping("/me/password")
	public ResponseEntity<Void> changePassword(Principal principal, @RequestBody ChangePasswordRequest req) {
		userService.changePasswordByEmail(principal.getName(), req);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
}
