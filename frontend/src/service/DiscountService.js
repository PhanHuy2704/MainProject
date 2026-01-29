import http from "./http";

async function getAll() {
	const res = await http.get("/api/discounts");
	return res.data;
}

async function getValidByCode(code) {
	const normalized = String(code || "").trim();
	const res = await http.get(`/api/discounts/code/${encodeURIComponent(normalized)}`);
	return res.data;
}

export const DiscountService = {
	getAll,
	getValidByCode,
};
