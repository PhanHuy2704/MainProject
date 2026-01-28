import React, { useMemo, useState } from "react";
import { Card, Col, Row, Segmented, Space, Statistic, Typography, theme, message } from "antd";

import { useAdminDashboardReport } from "../../hooks/admin/useAdminDashboardReport";
import { formatIntVi, formatVnd } from "../../utils/formatters";

function GrowthChart({ data, formatY, formatTooltip, token }) {
	const width = 600;
	const height = 300;
	const margin = { top: 8, right: 8, bottom: 24, left: 68 };
	const labelFontSize = 18;
	const innerW = width - margin.left - margin.right;
	const innerH = height - margin.top - margin.bottom;

	const safe = Array.isArray(data) ? data : [];
	if (safe.length === 0) {
		return <div style={{ padding: 12, color: token.colorTextSecondary }}>Chưa có dữ liệu</div>;
	}

	const max = Math.max(...safe.map((d) => Number(d?.value) || 0), 0);
	const yMax = max > 0 ? max : 1;

	const xForIndex = (i) => {
		if (safe.length === 1) return margin.left + innerW / 2;
		const compactW = innerW * 0.7;
		const offset = (innerW - compactW) / 2;
		return margin.left + offset + (compactW * i) / (safe.length - 1);
	};
	const yForValue = (v) => margin.top + innerH - (innerH * (Number(v) || 0)) / yMax;

	const points = safe.map((d, i) => `${xForIndex(i)},${yForValue(d.value)}`).join(" ");
	const pickLabelIndex = (idx) => {
		if (idx < 0 || idx >= safe.length) return null;
		return { x: xForIndex(idx), text: safe[idx]?.label || "" };
	};
	const xLabels = [pickLabelIndex(0), pickLabelIndex(Math.floor((safe.length - 1) / 2)), pickLabelIndex(safe.length - 1)]
		.filter(Boolean)
		.filter((v, i, arr) => arr.findIndex((a) => a.text === v.text) === i);

	return (
		<div style={{ width: "100%", overflowX: "auto" }}>
			<svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Biểu đồ tăng trưởng">
				<line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + innerH} stroke={token.colorBorder} />
				<line
					x1={margin.left}
					y1={margin.top + innerH}
					x2={margin.left + innerW}
					y2={margin.top + innerH}
					stroke={token.colorBorder}
				/>

				<text x={margin.left} y={margin.top - 8} textAnchor="middle" fontSize={labelFontSize} fill={token.colorTextSecondary}>
					{typeof formatY === "function" ? formatY(yMax) : String(yMax)}
				</text>

				<text
					x={margin.left - 6}
					y={margin.top + innerH + 4}
					textAnchor="end"
					fontSize={labelFontSize}
					fill={token.colorTextSecondary}
				>
					{typeof formatY === "function" ? formatY(0) : "0"}
				</text>

				<polyline fill="none" stroke={token.colorPrimary} strokeWidth="3" points={points} />
				{safe.map((d, i) => {
					const tooltip = typeof formatTooltip === "function" ? formatTooltip(d?.value) : String(Number(d?.value) || 0);
					return (
						<g key={d.key || i}>
							<circle cx={xForIndex(i)} cy={yForValue(d.value)} r="4" fill={token.colorPrimary} />
							<title>{`${d?.label || ""}: ${tooltip}`}</title>
						</g>
					);
				})}

				{xLabels.map((l) => (
					<text
						key={l.text}
						x={l.x}
						y={margin.top + innerH + 20}
						textAnchor="middle"
						fontSize={labelFontSize}
						fill={token.colorTextSecondary}
					>
						{l.text}
					</text>
				))}
			</svg>
		</div>
	);
}

export default function DashboardPage() {
	const { Title } = Typography;
	const { token } = theme.useToken();
	const [groupBy, setGroupBy] = useState("day");
	const { report, loading, error } = useAdminDashboardReport({ groupBy });

	React.useEffect(() => {
		if (!error) return;
		message.error(error?.response?.data?.message || "Không tải được báo cáo");
	}, [error]);

	const dashboard = useMemo(() => {
		const data = report || {};
		return {
			periodTitle: data?.periodTitle || "",
			stats: {
				revenue: Number(data?.stats?.revenue) || 0,
				soldItems: Number(data?.stats?.soldItems) || 0,
				totalOrders: Number(data?.stats?.totalOrders) || 0,
			},
			seriesRevenue: (Array.isArray(data?.seriesRevenue) ? data.seriesRevenue : []).map((p) => ({
				key: p?.key,
				label: p?.label,
				value: Number(p?.value) || 0,
			})),
			seriesOrders: (Array.isArray(data?.seriesOrders) ? data.seriesOrders : []).map((p) => ({
				key: p?.key,
				label: p?.label,
				value: Number(p?.value) || 0,
			})),
			seriesSoldItems: (Array.isArray(data?.seriesSoldItems) ? data.seriesSoldItems : []).map((p) => ({
				key: p?.key,
				label: p?.label,
				value: Number(p?.value) || 0,
			})),
			topCategories: Array.isArray(data?.topCategories) ? data.topCategories : [],
			topBrands: Array.isArray(data?.topBrands) ? data.topBrands : [],
			topProducts: Array.isArray(data?.topProducts) ? data.topProducts : [],
			topDiscounts: Array.isArray(data?.topDiscounts) ? data.topDiscounts : [],
			topCustomers: Array.isArray(data?.topCustomers) ? data.topCustomers : [],
			topLowStockProducts: Array.isArray(data?.topLowStockProducts) ? data.topLowStockProducts : [],
		};
	}, [report]);

	const formatInt = (value) => formatIntVi(value);

	const renderTopList = (items, title, quantityLabel = "Sản phẩm đã bán") => {
		const rowHeight = 36; // px
		const minRows = 3;
		const displayItems = items.slice(0, minRows);
		const emptyRows = minRows - displayItems.length;
		return (
			<Card bordered style={{ marginBottom: 0, minHeight: rowHeight * minRows + 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative' }} title={title}>
				<table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 0 }}>
					<thead>
						<tr>
							<th style={{ textAlign: "left", padding: "4px 8px", fontWeight: 700, width: "60%" }}>Tên</th>
							<th style={{ textAlign: "right", padding: "4px 8px", fontWeight: 700, width: "40%" }}>{quantityLabel}</th>
						</tr>
					</thead>
					<tbody>
						{displayItems.map((item) => (
							<tr key={item.name} style={{ height: rowHeight }}>
								<td style={{ padding: "4px 8px", border: 0 }}>{item.name}</td>
								<td style={{ padding: "4px 8px", textAlign: "right", border: 0 }}>{formatInt(item.soldQuantity)}</td>
							</tr>
						))}
						{items.length === 0 && (
							<tr>
								<td colSpan={2} style={{ padding: "4px 8px", border: 0, color: token.colorTextSecondary, textAlign: 'center', height: rowHeight * minRows }}>
									Chưa có dữ liệu
								</td>
							</tr>
						)}
						{emptyRows > 0 && items.length > 0 &&
							[...Array(emptyRows)].map((_, idx) => (
								<tr key={"empty-" + idx} style={{ height: rowHeight }}>
									<td colSpan={2} style={{ padding: "4px 8px", border: 0 }}></td>
								</tr>
							))}
					</tbody>
				</table>
			</Card>
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<div>
					<Title level={4} style={{ margin: 0 }}>
						Tổng quan
					</Title>
					{dashboard.periodTitle ? (
						<div style={{ color: token.colorTextSecondary, marginTop: 4 }}>{dashboard.periodTitle}</div>
					) : null}
				</div>
				<Segmented
					value={groupBy}
					onChange={setGroupBy}
					options={[
						{ label: "Ngày", value: "day" },
						{ label: "Tháng", value: "month" },
						{ label: "Năm", value: "year" },
					]}
				/>
			</div>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card bordered>
						<Statistic title="Doanh thu" value={dashboard.stats.revenue} formatter={(v) => formatVnd(v)} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card bordered>
						<Statistic title="Sản phẩm đã bán" value={dashboard.stats.soldItems} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card bordered>
						<Statistic title="Đơn hàng" value={dashboard.stats.totalOrders} />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 32]} align="stretch">
				<Col xs={24} md={8} className="flex">
					<Card bordered title="Doanh thu" style={{ width: "100%", height: "100%" }} loading={loading}>
						<Space direction="vertical" size={12} style={{ width: "100%" }}>
							<GrowthChart data={dashboard.seriesRevenue} formatY={formatVnd} formatTooltip={formatVnd} token={token} />
						</Space>
					</Card>
				</Col>
				<Col xs={24} md={8} className="flex">
					<Card bordered title="Số lượng sản phẩm đã bán" style={{ width: "100%", height: "100%" }} loading={loading}>
						<Space direction="vertical" size={12} style={{ width: "100%" }}>
							<GrowthChart data={dashboard.seriesSoldItems} formatY={formatInt} formatTooltip={formatInt} token={token} />
						</Space>
					</Card>
				</Col>
				<Col xs={24} md={8} className="flex">
					<Card bordered title="Số lượng đơn hàng" style={{ width: "100%", height: "100%" }} loading={loading}>
						<Space direction="vertical" size={12} style={{ width: "100%" }}>
							<GrowthChart data={dashboard.seriesOrders} formatY={formatInt} formatTooltip={formatInt} token={token} />
						</Space>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 32]}>
				<Col xs={24} md={8}>{renderTopList(dashboard.topCategories, "Danh mục bán chạy")}</Col>
				<Col xs={24} md={8}>{renderTopList(dashboard.topBrands, "Thương hiệu bán chạy")}</Col>
				<Col xs={24} md={8}>{renderTopList(dashboard.topProducts, "Sản phẩm bán chạy")}</Col>
			</Row>

			<Row gutter={[16, 32]}>
				<Col xs={24} md={8}>{renderTopList(dashboard.topDiscounts, "Mã giảm giá sử dụng nhiều nhất", "Đã sử dụng")}</Col>
				<Col xs={24} md={8}>{renderTopList(dashboard.topCustomers, "Khách hàng mua nhiều nhất", "Đơn hàng hoàn thành")}</Col>
				<Col xs={24} md={8}>{renderTopList(dashboard.topLowStockProducts, "Sản phẩm tồn kho sắp hết", "Tồn kho")}</Col>
			</Row>
		</div>
	);
}

