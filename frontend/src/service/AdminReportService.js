import http from "./http";

async function getReport(groupBy) {
	const res = await http.get("/api/admin/reports/report", {
		params: groupBy ? { groupBy } : {},
	});
	return res.data;
}

export const AdminReportService = {
	getReport,
};
