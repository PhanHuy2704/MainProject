import http from "./http";

async function getValidByCode(code) {
	const normalized = String(code || "").trim();
	const res = await http.get(`/api/discounts/code/${encodeURIComponent(normalized)}`);
	return res.data;
}

export const DiscountService = {
	getValidByCode,
};
