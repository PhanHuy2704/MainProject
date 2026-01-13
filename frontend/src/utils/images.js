export const getSafeImageSrc = ({ src, fallbackSrc, placeholders = [] }) => {
	const fallback = fallbackSrc || "/assets/images/logo.svg";
	const s = String(src || "");
	if (!s) return fallback;
	if (placeholders.includes(s)) return fallback;
	return s;
};
