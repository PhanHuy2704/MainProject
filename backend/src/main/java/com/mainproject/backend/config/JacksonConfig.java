package com.mainproject.backend.config;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {
	private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
	private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");

	@Bean
	public Module javaTimeModule() {
		JavaTimeModule javaTimeModule = new JavaTimeModule();
		javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer());
		return javaTimeModule;
	}

	@Bean
	public Module sqlTimestampModule() {
		SimpleModule sqlModule = new SimpleModule();
		sqlModule.addSerializer(Timestamp.class, new TimestampSerializer());
		return sqlModule;
	}

	static class TimestampSerializer extends JsonSerializer<Timestamp> {
		@Override
		public void serialize(Timestamp value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
			if (value == null) {
				gen.writeNull();
				return;
			}
			String out = value.toInstant().atZone(VIETNAM_ZONE).format(DATE_TIME_FORMATTER);
			gen.writeString(out);
		}
	}

	static class LocalDateTimeSerializer extends JsonSerializer<LocalDateTime> {
		@Override
		public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
			if (value == null) {
				gen.writeNull();
				return;
			}
			gen.writeString(value.format(DATE_TIME_FORMATTER));
		}
	}
}
