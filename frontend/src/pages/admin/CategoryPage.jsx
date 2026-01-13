import React, { useMemo, useState } from "react";
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Statistic, Table, Typography, message, theme } from "antd";

import { useAdminCategories } from "../../hooks/admin/useAdminCategories";
import { formatDateTimeVi } from "../../utils/formatters";
import { activeLabelFromCode, isActiveLabel, normalizeActiveLabel } from "../../utils/status";

export default function CategoryPage() {
	const { Title } = Typography;
	const { token } = theme.useToken();
	const viewButtonStyle = {
		backgroundColor: token.colorPrimary,
		borderColor: token.colorPrimary,
		color: token.colorTextLightSolid,
	};
	const renderStatus = (value) => {
		const normalized = normalizeActiveLabel(value);
		return (
			<Typography.Text type={normalized === "Hoạt động" ? "success" : "danger"}>
				{normalized}
			</Typography.Text>
		);
	};
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
	const [query, setQuery] = useState("");
	const { items, loading, save, remove } = useAdminCategories();

	const stats = useMemo(() => {
		const list = Array.isArray(items) ? items : [];
		return {
			total: list.length,
			active: list.filter((c) => isActiveLabel(c?.status)).length,
		};
	}, [items]);

	const openCreate = () => {
		setEditing(null);
		form.resetFields();
		form.setFieldsValue({ status: "Hoạt động" });
		setOpen(true);
	};

	const openEdit = (record) => {
		setEditing(record);
		form.setFieldsValue({
			name: record?.name,
			description: record?.description,
			status: normalizeActiveLabel(record?.status ?? "Hoạt động"),
		});
		setOpen(true);
	};

	const onSubmit = async () => {
		const values = await form.validateFields();
		try {
			await save({ editingId: editing?.id, values });
			message.success(editing?.id != null ? "Đã cập nhật danh mục" : "Đã thêm danh mục");
			setOpen(false);
			setEditing(null);
		} catch (e) {
			message.error(e?.response?.data?.message || "Lưu danh mục thất bại");
		}
	};

	const columns = [
		{
			title: "STT",
			key: "stt",
			width: 70,
			align: "center",
			render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
		},
		{ title: "Tên danh mục", dataIndex: "name", key: "name" },
		{ title: "Mô tả", dataIndex: "description", key: "description" },
		{ title: "Trạng thái", dataIndex: "status", key: "status", render: renderStatus },
		{ title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", render: formatDateTimeVi },
		{
			title: "Hành động",
			key: "actions",
			render: (_, record) => (
				<Space>
					<Button type="primary" style={viewButtonStyle} onClick={() => openEdit(record)}>
						Xem
					</Button>
					<Popconfirm
						title="Xóa danh mục này?"
						onConfirm={async () => {
							try {
								await remove(record.id);
								message.success("Đã xóa danh mục");
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

	const viewModels = useMemo(() => {
		return (Array.isArray(items) ? items : []).map((it) => ({
			...it,
			status: activeLabelFromCode(it?.status),
		}));
	}, [items]);

	const filtered = useMemo(() => {
		const list = Array.isArray(viewModels) ? viewModels : [];
		const q = String(query || "").trim().toLowerCase();
		if (!q) return list;
		return list.filter((it) => {
			return (
				String(it?.name || "").toLowerCase().includes(q) ||
				String(it?.description || "").toLowerCase().includes(q) ||
				String(it?.id || "").toLowerCase().includes(q)
			);
		});
	}, [viewModels, query]);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Typography.Title level={4} style={{ margin: 0 }}>
					Quản lý danh mục
				</Typography.Title>
				<Space>
					<Input.Search
						placeholder="Tìm theo tên hoặc mô tả"
						allowClear
						onSearch={(v) => {
							setQuery(v);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						onChange={(e) => {
							setQuery(e.target.value);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						style={{ width: 260 }}
					/>
					<Button type="primary" onClick={openCreate}>
						Thêm danh mục
					</Button>
				</Space>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<Statistic title="Tổng danh mục" value={stats.total} />
				</Card>
				<Card>
					<Statistic title="Đang hoạt động" value={stats.active} />
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

			<Modal
				title={editing ? "Sửa danh mục" : "Thêm danh mục"}
				open={open}
				onOk={onSubmit}
				onCancel={() => setOpen(false)}
				okText="Lưu"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: "Nhập tên" }]}
					>
						<Input placeholder="VD: Đồng hồ cơ" />
					</Form.Item>
					<Form.Item name="description" label="Mô tả">
						<Input.TextArea placeholder="Mô tả ngắn..." rows={3} />
					</Form.Item>
					<Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}
					>
						<Select
							options={[
								{ value: "Hoạt động", label: "Hoạt động" },
								{ value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
