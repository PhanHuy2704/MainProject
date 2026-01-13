package com.mainproject.backend.dto;

import java.time.LocalDateTime;

import com.mainproject.backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
	private Long id;
	private User.Role role;
	private String name;
	private String email;
	private String phone;
	private String gender;
	private String address;
	private LocalDateTime createdAt;
}
