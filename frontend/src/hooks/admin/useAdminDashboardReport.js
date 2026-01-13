import React from "react";

import { AdminReportService } from "../../service/AdminReportService";

export function useAdminDashboardReport({ groupBy }) {
	const mountedRef = React.useRef(true);
	const [report, setReport] = React.useState(null);
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
			const data = await AdminReportService.getReport(groupBy);
			if (mountedRef.current) setReport(data || null);
		} catch (e) {
			if (mountedRef.current) {
				setReport(null);
				setError(e);
			}
			throw e;
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, [groupBy]);

	React.useEffect(() => {
		reload().catch(() => {});
	}, [reload]);

	return { report, loading, error, reload };
}
