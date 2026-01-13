import React, { useMemo, useState } from "react";
import { Button, Card, Input, Popconfirm, Space, Statistic, Table, Typography, message } from "antd";

import { useAdminCustomers } from "../../hooks/admin/useAdminCustomers";
import { formatDateTimeVi, parseDateTimeAny } from "../../utils/formatters";

export default function CustomerManagePage() {
	const { Title } = Typography;
	const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
	const [query, setQuery] = useState("");
	const { items, loading, error, remove } = useAdminCustomers();

	const renderGender = (value) => {
		if (value == null) return "";
		const s = String(value).trim().toLowerCase();
		if (!s) return "";
		if (s === "male" || s === "m" || s === "nam" || s === "true" || s === "1" || s === "MALE".toLowerCase()) return "Nam";
		if (s === "female" || s === "f" || s === "nữ" || s === "nu" || s === "false" || s === "0" || s === "FEMALE".toLowerCase()) return "Nữ";
		return String(value);
	};

	React.useEffect(() => {
		if (!error) return;
		message.error(error?.response?.data?.message || "Không tải được danh sách khách hàng");
	}, [error]);

	const stats = useMemo(() => {
		const list = Array.isArray(items) ? items : [];
		const now = new Date();
		const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
		const newInLastMonth = list.filter((c) => {
			if (!c?.createdAt) return false;
			const created = parseDateTimeAny(c.createdAt);
			if (!created) return false;
			return created >= lastMonth && created <= now;
		}).length;
		return {
			total: list.length,
			newLastMonth: newInLastMonth,
		};
	}, [items]);

	const columns = [
		{
			title: "STT",
			key: "stt",
			width: 70,
			align: "center",
			render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
		},
		{ title: "Tên", dataIndex: "name", key: "name" },
		{ title: "Email", dataIndex: "email", key: "email" },
		{ title: "SĐT", dataIndex: "phone", key: "phone" },
		{ title: "Giới tính", dataIndex: "gender", key: "gender", render: renderGender },
		{ title: "Địa chỉ", dataIndex: "address", key: "address" },
		{ title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", render: formatDateTimeVi },
		{
			title: "Hành động",
			key: "actions",
			render: (_, record) => (
				<Space>
					<Popconfirm
						title="Xóa khách hàng này?"
						onConfirm={async () => {
							try {
								await remove(record.id);
								message.success("Đã xóa khách hàng");
							} catch (e) {
								message.error(e?.response?.data?.message || "Xóa thất bại");
							}
						}}
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const filtered = useMemo(() => {
		const list = Array.isArray(items) ? items : [];
		const q = String(query || "").trim().toLowerCase();
		if (!q) return list;
		return list.filter((it) => {
			return (
				String(it?.name || "").toLowerCase().includes(q) ||
				String(it?.email || "").toLowerCase().includes(q) ||
				String(it?.phone || "").toLowerCase().includes(q) ||
				String(it?.id || "").toLowerCase().includes(q)
			);
		});
	}, [items, query]);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Title level={4} style={{ margin: 0 }}>
					Quản lý khách hàng
				</Title>
				<Space>
					<Input.Search
						placeholder="Tìm theo tên, email hoặc SĐT"
						allowClear
						onSearch={(v) => {
							setQuery(v);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						onChange={(e) => {
							setQuery(e.target.value);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						style={{ width: 320 }}
					/>
				</Space>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<Statistic title="Tổng khách hàng" value={stats.total} />
				</Card>
				<Card>
					<Statistic title="Khách hàng mới tháng qua" value={stats.newLastMonth} />
				</Card>
			</div>

			<Card>
				<Table
					rowKey="id"
					columns={columns}
					dataSource={filtered}
					loading={loading}
					pagination={{
						...pagination,
						onChange: (current, pageSize) => setPagination({ current, pageSize }),
					}}
				/>
			</Card>
		</div>
	);
}

