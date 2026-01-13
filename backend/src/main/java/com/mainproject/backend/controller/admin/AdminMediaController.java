package com.mainproject.backend.controller.admin;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mainproject.backend.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
public class AdminMediaController {
	private final CloudinaryService cloudinaryService;

	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<CloudinaryService.UploadResult> upload(
			@RequestPart("file") MultipartFile file,
			@RequestParam(value = "folder", required = false) String folder) throws IOException {
		return ResponseEntity.ok(cloudinaryService.uploadImage(file, folder));
	}
}
