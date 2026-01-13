package com.mainproject.backend.controller.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mainproject.backend.dto.ReportDTO;
import com.mainproject.backend.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class AdminReportController {
	private final ReportService reportService;

	@GetMapping("/report")
	public ReportDTO report(@RequestParam(name = "groupBy", required = false) String groupBy) {
		return reportService.getReport(groupBy);
	}
}
