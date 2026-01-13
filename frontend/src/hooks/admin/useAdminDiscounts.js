import React from "react";
import dayjs from "dayjs";

import { AdminDiscountService } from "../../service/AdminDiscountService";
import { parseDateOnlyToMillisUtc, parseDateTimeAny } from "../../utils/formatters";
import { activeCodeFromLabel, normalizeActiveLabel } from "../../utils/status";

const normalizeType = (value) => {
	const s = String(value || "");
	if (s === "fixed" || s === "FIX") return "fixed";
	if (s === "percent" || s === "PERCENT") return "percent";
	return "fixed";
};

const sortByCreatedAtDesc = (list) => {
	const safe = Array.isArray(list) ? list : [];
	const toMs = (v) => {
		const d = parseDateTimeAny(v);
		return d ? d.getTime() : 0;
	};
	return [...safe].sort((a, b) => {
		const diff = toMs(b?.createdAt) - toMs(a?.createdAt);
		if (diff !== 0) return diff;
		return (Number(b?.id) || 0) - (Number(a?.id) || 0);
	});
};

export function useAdminDiscounts() {
	const mountedRef = React.useRef(true);
	const [items, setItems] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const reload = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const list = await AdminDiscountService.getAll();
			if (mountedRef.current) setItems(sortByCreatedAtDesc(list));
		} catch (e) {
			if (mountedRef.current) {
				setItems([]);
				setError(e);
			}
			throw e;
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		reload().catch(() => {});
	}, [reload]);

	const toFormValues = React.useCallback((record) => {
		const startAt = record?.startAt != null ? dayjs(record.startAt) : null;
		const endAt = record?.endAt != null ? dayjs(record.endAt) : null;
		return {
			code: record?.code,
			type: normalizeType(record?.type),
			value: record?.value,
			quantity: record?.stock ?? 0,
			maxDiscount: null,
			startAt: startAt && startAt.isValid() ? startAt : null,
			endAt: endAt && endAt.isValid() ? endAt : null,
			status: normalizeActiveLabel(record?.status ?? "Hoạt động"),
		};
	}, []);

	const save = React.useCallback(
		async ({ editingId, values }) => {
			const startAtText = values?.startAt ? String(values.startAt.format?.("YYYY-MM-DD") || "") : "";
			const endAtText = values?.endAt ? String(values.endAt.format?.("YYYY-MM-DD") || "") : "";
			const payload = {
				code: values?.code,
				type: normalizeType(values?.type) === "percent" ? "PERCENT" : "FIX",
				value: values?.value,
				stock: values?.quantity,
				status: activeCodeFromLabel(values?.status),
				startAt: parseDateOnlyToMillisUtc(startAtText),
				endAt: parseDateOnlyToMillisUtc(endAtText),
			};

			if (editingId != null) {
				await AdminDiscountService.update(editingId, payload);
			} else {
				await AdminDiscountService.create(payload);
			}

			await reload();
		},
		[reload]
	);

	const remove = React.useCallback(
		async (id) => {
			await AdminDiscountService.remove(id);
			await reload();
		},
		[reload]
	);

	return { items, loading, error, reload, save, remove, toFormValues };
}
