
// import { useEffect, useMemo, useState } from "react";

// export { default as mockBrands } from "./brands";
// export { default as mockCategories } from "./categories";
// export { default as mockProductsAdmin } from "./products";
// export { default as mockCustomers } from "./customers";
// export { default as mockDiscounts } from "./discounts";
// export { default as mockOrdersAdmin, calcOrderTotal } from "./orders";
// export { default as getDashboardStats } from "./dashboard";

// const safeJsonParse = (value, fallback) => {
// 	if (!value) return fallback;
// 	try {
// 		return JSON.parse(value);
// 	} catch {
// 		return fallback;
// 	}
// };

// const createId = (prefix = "id") => {
// 	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
// 		return `${prefix}-${crypto.randomUUID()}`;
// 	}
// 	return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
// };

// export function useMockCrud(storageKey, initialItems, options = {}) {
// 	const { idPrefix = "item" } = options;

// 	const initial = useMemo(() => (Array.isArray(initialItems) ? initialItems : []), [initialItems]);

// 	const [items, setItems] = useState(() => {
// 		const cached = safeJsonParse(localStorage.getItem(storageKey), null);
// 		return Array.isArray(cached) ? cached : initial;
// 	});

// 	useEffect(() => {
// 		localStorage.setItem(storageKey, JSON.stringify(items));
// 	}, [storageKey, items]);

// 	const upsert = (payload) => {
// 		const id = payload?.id;
// 		if (!id) {
// 			setItems((prev) => [{ ...payload, id: createId(idPrefix) }, ...prev]);
// 			return;
// 		}
// 		setItems((prev) => prev.map((it) => (it?.id === id ? { ...it, ...payload } : it)));
// 	};

// 	const removeById = (id) => {
// 		setItems((prev) => prev.filter((it) => it?.id !== id));
// 	};

// 	const reset = () => {
// 		setItems(initial);
// 	};

// 	return { items, setItems, upsert, removeById, reset };
// }

// export { useMockCrud as useMockCrudNamed };

// export default useMockCrud;
