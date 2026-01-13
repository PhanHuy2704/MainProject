export const normalizeActiveLabel = (value) => {
	const s = String(value || "");
	if (s === "Đã quá hạn" || s === "expired" || s === "EXPIRED") return "Đã quá hạn";
	if (s === "Hoạt động" || s === "active" || s === "ACTIVE") return "Hoạt động";
	return "Ngừng hoạt động";
};

export const isActiveLabel = (value) => normalizeActiveLabel(value) === "Hoạt động";

export const activeCodeFromLabel = (label) => {
	const normalized = normalizeActiveLabel(label);
	if (normalized === "Đã quá hạn") return "EXPIRED";
	return normalized === "Hoạt động" ? "ACTIVE" : "INACTIVE";
};

export const activeLabelFromCode = (code) => {
	const c = String(code || "").toUpperCase();
	if (c === "EXPIRED") return "Đã quá hạn";
	return c === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động";
};

export const normalizeStockStatusLabel = (value) => {
	const s = String(value || "");
	if (s === "Hoạt động" || s === "active" || s === "IN_STOCK") return "Hoạt động";
	return "Ngừng hoạt động";
};

export const stockCodeFromLabel = (label) => (normalizeStockStatusLabel(label) === "Hoạt động" ? "IN_STOCK" : "OUT_OF_STOCK");
