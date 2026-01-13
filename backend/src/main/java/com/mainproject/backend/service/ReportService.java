package com.mainproject.backend.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mainproject.backend.dto.ReportDTO;
import com.mainproject.backend.dto.ReportSeriesPointDTO;
import com.mainproject.backend.dto.ReportStatsDTO;
import com.mainproject.backend.entity.order.Order;
import com.mainproject.backend.repository.OrderDetailRepository;
import com.mainproject.backend.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {
	private final OrderRepository orderRepository;
	private final OrderDetailRepository orderDetailRepository;

	public ReportDTO getReport(String groupByRaw) {
		String groupBy = normalizeGroupBy(groupByRaw);

		List<String> lastKeys = getLastNBucketKeys(3, groupBy);
		Map<String, Bucket> buckets = new LinkedHashMap<>();
		for (String key : lastKeys) {
			buckets.put(key, new Bucket(key, formatBucketLabel(key, groupBy)));
		}

		List<Order> orders = orderRepository.findAll();
		for (Order order : orders) {
			String key = getBucketKey(order.getCreatedAt(), groupBy);
			if (key == null || !buckets.containsKey(key)) {
				continue;
			}
			Bucket bucket = buckets.get(key);
			bucket.totalOrders += 1;

			if (order.getStatus() == Order.Status.COMPLETED) {
				bucket.revenue = bucket.revenue.add(safe(order.getFinalPrice()));
				long soldItems = orderDetailRepository.findByOrder_Id(order.getId()).stream()
						.mapToLong(od -> od == null ? 0L : od.getQuantity())
						.sum();
				bucket.soldItems += soldItems;
			}
		}

		List<Bucket> ordered = new ArrayList<>(buckets.values());
		Bucket active = ordered.isEmpty() ? null : ordered.get(ordered.size() - 1);
		String periodTitle = buildPeriodTitle(active == null ? null : active.key, groupBy);

		return ReportDTO.builder()
				.periodTitle(periodTitle)
				.stats(ReportStatsDTO.builder()
						.revenue(active == null ? BigDecimal.ZERO : active.revenue)
						.soldItems(active == null ? 0 : active.soldItems)
						.totalOrders(active == null ? 0 : active.totalOrders)
						.build())
				.seriesRevenue(ordered.stream().map(b -> ReportSeriesPointDTO.builder()
						.key(b.key).label(b.label).value(b.revenue).build()).toList())
				.seriesOrders(ordered.stream().map(b -> ReportSeriesPointDTO.builder()
						.key(b.key).label(b.label).value(BigDecimal.valueOf(b.totalOrders)).build()).toList())
				.seriesSoldItems(ordered.stream().map(b -> ReportSeriesPointDTO.builder()
						.key(b.key).label(b.label).value(BigDecimal.valueOf(b.soldItems)).build()).toList())
				.build();
	}

	private static String normalizeGroupBy(String value) {
		String v = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
		return switch (v) {
			case "year" -> "year";
			case "month" -> "month";
			default -> "day";
		};
	}

	private static List<String> getLastNBucketKeys(int n, String groupBy) {
		String gb = groupBy == null ? "day" : groupBy;
		List<String> keys = new ArrayList<>();
		LocalDate now = LocalDate.now(ZoneOffset.UTC);
		for (int i = n - 1; i >= 0; i--) {
			LocalDate d = switch (gb) {
				case "year" -> LocalDate.of(now.getYear() - i, 1, 1);
				case "month" -> now.minusMonths(i).withDayOfMonth(1);
				default -> now.minusDays(i);
			};
			keys.add(getBucketKey(Timestamp.from(d.atStartOfDay().toInstant(ZoneOffset.UTC)), gb));
		}
		return keys;
	}

	private static String getBucketKey(Timestamp ts, String groupBy) {
		if (ts == null) return null;
		Instant instant = ts.toInstant();
		LocalDate date = instant.atZone(ZoneOffset.UTC).toLocalDate();
		if ("year".equals(groupBy)) {
			return String.valueOf(date.getYear());
		}
		if ("month".equals(groupBy)) {
			return String.format("%04d-%02d", date.getYear(), date.getMonthValue());
		}
		return date.format(DateTimeFormatter.ISO_DATE);
	}

	private static String formatBucketLabel(String key, String groupBy) {
		if (key == null) return "";
		if ("year".equals(groupBy)) return key;
		if ("month".equals(groupBy)) {
			String[] parts = key.split("-");
			if (parts.length >= 2) {
				return parts[1] + "/" + parts[0];
			}
			return key;
		}
		String[] parts = key.split("-");
		if (parts.length == 3) {
			return parts[2] + "/" + parts[1];
		}
		return key;
	}

	private static String buildPeriodTitle(String activeKey, String groupBy) {
		if (activeKey == null) return "";
		if ("year".equals(groupBy)) return "Năm " + activeKey;
		if ("month".equals(groupBy)) return "Tháng " + activeKey;
		return "Ngày " + activeKey;
	}

	private static BigDecimal safe(BigDecimal v) {
		return v == null ? BigDecimal.ZERO : v;
	}

	private static final class Bucket {
		final String key;
		final String label;
		BigDecimal revenue = BigDecimal.ZERO;
		long soldItems = 0;
		long totalOrders = 0;

		Bucket(String key, String label) {
			this.key = key;
			this.label = label;
		}
	}
}
