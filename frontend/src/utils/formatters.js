export const formatVnd = (value) => {
	try {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			maximumFractionDigits: 0,
		}).format(Number(value) || 0);
	} catch {
		return `${value} VND`;
	}
};

export const formatDateTimeVi = (value) => {
	if (!value) return "";
	const d = parseDateTimeAny(value);
	if (!d) return String(value);
	return formatDateTimePattern(d);
};

export const formatDateVi = (value) => {
	if (!value) return "";
	const d = parseDateTimeAny(value) || new Date(value);
	if (!Number.isFinite(d.getTime())) return String(value);
	return d.toLocaleDateString("vi-VN");
};

export const formatIntVi = (value) => {
	const n = Number(value) || 0;
	return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n);
};

export const formatDateIso = (value) => {
	if (value == null) return "";
	const d = parseDateTimeAny(value) || new Date(value);
	if (Number.isNaN(d.getTime())) return String(value);
	return d.toISOString().slice(0, 10);
};

const pad2 = (n) => String(Math.trunc(Number(n) || 0)).padStart(2, "0");

const formatDateTimePattern = (d) => {
	const hh = pad2(d.getHours());
	const mm = pad2(d.getMinutes());
	const dd = pad2(d.getDate());
	const MM = pad2(d.getMonth() + 1);
	const yyyy = String(d.getFullYear());
	return `${hh}:${mm} ${dd}/${MM}/${yyyy}`;
};

export const parseDateTimeAny = (value) => {
	if (value == null) return null;
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	if (typeof value === "number") {
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? null : d;
	}

	const s = String(value).trim();
	if (!s) return null;

	// Expected: HH:mm dd/MM/yyyy (e.g. 22:16 12/12/2025)
	const m = s.match(/^(\d{2}):(\d{2})\s(\d{2})\/(\d{2})\/(\d{4})$/);
	if (m) {
		const hh = Number(m[1]);
		const mm = Number(m[2]);
		const dd = Number(m[3]);
		const MM = Number(m[4]);
		const yyyy = Number(m[5]);
		const d = new Date(yyyy, MM - 1, dd, hh, mm, 0, 0);
		return Number.isNaN(d.getTime()) ? null : d;
	}

	const d = new Date(s);
	return Number.isNaN(d.getTime()) ? null : d;
};

export const parseDateOnlyToMillisUtc = (dateText) => {
	const s = String(dateText || "").trim();
	if (!s) return null;
	const ms = Date.parse(`${s}T00:00:00.000Z`);
	return Number.isNaN(ms) ? null : ms;
};
