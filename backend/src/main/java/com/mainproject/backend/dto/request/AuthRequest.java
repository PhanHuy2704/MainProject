package com.mainproject.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class AuthRequest {
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class RegisterRequest {
		private String name;
		private String email;
		private String password;
		private String phone;
		private String gender;
		private String address;
	}

	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class LoginRequest {
		private String email;
		private String password;
	}
}
