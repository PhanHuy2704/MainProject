import React from "react";

import { AdminUserService } from "../../service/AdminUserService";
import { parseDateTimeAny } from "../../utils/formatters";

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

export function useAdminCustomers() {
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
			const list = await AdminUserService.getAll();
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

	const remove = React.useCallback(
		async (id) => {
			await AdminUserService.remove(id);
			await reload();
		},
		[reload]
	);

	const update = React.useCallback(
		async (id, data) => {
			await AdminUserService.update(id, data);
			await reload();
		},
		[reload]
	);

	return { items, loading, error, reload, remove, update };
}
