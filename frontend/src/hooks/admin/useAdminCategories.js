import React from "react";

import { AdminCategoryService } from "../../service/AdminCategoryService";
import { parseDateTimeAny } from "../../utils/formatters";
import { activeCodeFromLabel } from "../../utils/status";

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

export function useAdminCategories() {
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
			const list = await AdminCategoryService.getAll();
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

	const save = React.useCallback(
		async ({ editingId, values }) => {
			const payload = {
				name: values?.name,
				description: values?.description || "",
				status: activeCodeFromLabel(values?.status),
			};

			if (editingId != null) {
				await AdminCategoryService.update(editingId, payload);
			} else {
				await AdminCategoryService.create(payload);
			}

			await reload();
		},
		[reload]
	);

	const remove = React.useCallback(
		async (id) => {
			await AdminCategoryService.remove(id);
			await reload();
		},
		[reload]
	);

	return { items, loading, error, reload, save, remove };
}
