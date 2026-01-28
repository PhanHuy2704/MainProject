package com.mainproject.backend.dto;

import java.util.List;

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
public class ReportDTO {
	private String periodTitle;
	private ReportStatsDTO stats;
	private List<ReportSeriesPointDTO> seriesRevenue;


	private List<ReportTopItemDTO> topCategories;
	private List<ReportTopItemDTO> topBrands;
	private List<ReportTopItemDTO> topProducts;
	private List<ReportSeriesPointDTO> seriesOrders;
	private List<ReportSeriesPointDTO> seriesSoldItems;


	private List<ReportTopItemDTO> topDiscounts;
	private List<ReportTopItemDTO> topCustomers;
	private List<ReportTopItemDTO> topLowStockProducts;
}
