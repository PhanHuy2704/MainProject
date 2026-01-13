package com.mainproject.backend.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {
	private final Cloudinary cloudinary;
	private final String defaultFolder;

	public CloudinaryService(Cloudinary cloudinary, @Value("${cloudinary.folder:mainproject}") String defaultFolder) {
		this.cloudinary = cloudinary;
		this.defaultFolder = defaultFolder;
	}

	public UploadResult uploadImage(MultipartFile file, String folder) throws IOException {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("File is empty");
		}
		String contentType = file.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new IllegalArgumentException("Only image/* is allowed");
		}

		String useFolder = (folder == null || folder.isBlank()) ? defaultFolder : folder;

		Map<?, ?> res = cloudinary.uploader().upload(
				file.getBytes(),
				ObjectUtils.asMap(
						"folder", useFolder,
						"resource_type", "image"
				)
		);

		return UploadResult.from(res);
	}

	public record UploadResult(
			String url,
			String secureUrl,
			String publicId,
			String format,
			Long bytes,
			Integer width,
			Integer height) {
		static UploadResult from(Map<?, ?> res) {
			return new UploadResult(
					(String) res.get("url"),
					(String) res.get("secure_url"),
					(String) res.get("public_id"),
					(String) res.get("format"),
					res.get("bytes") == null ? null : ((Number) res.get("bytes")).longValue(),
					res.get("width") == null ? null : ((Number) res.get("width")).intValue(),
					res.get("height") == null ? null : ((Number) res.get("height")).intValue()
			);
		}
	}
}
