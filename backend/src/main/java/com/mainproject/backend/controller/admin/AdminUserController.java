package com.mainproject.backend.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
	private final UserService userService;

	@GetMapping
	public List<UserDTO> getAll() {
		return userService.getAll();
	}

	@GetMapping("/{id}")
	public UserDTO getById(@PathVariable Long id) {
		return userService.getById(id);
	}


	@PutMapping("/{id}")
	public UserDTO update(@PathVariable Long id, @RequestBody UserUpdateRequest req) {
		return userService.updateById(id, req);
	}

	
	@PutMapping("/{id}/password")
	public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest req) {
		userService.changePasswordById(id, req);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		userService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
