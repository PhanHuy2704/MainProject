import React, { useMemo, useState } from "react";
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Statistic, Table, Typography, message, theme } from "antd";

import { useAdminBrands } from "../../hooks/admin/useAdminBrands";
import { formatDateTimeVi } from "../../utils/formatters";
import { activeLabelFromCode, isActiveLabel, normalizeActiveLabel } from "../../utils/status";

export default function BrandPage() {
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
	const { items, loading, save, remove } = useAdminBrands();

	const stats = useMemo(() => {
		const list = Array.isArray(items) ? items : [];
		return {
			total: list.length,
			active: list.filter((b) => isActiveLabel(b?.status)).length,
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
			message.success(editing?.id != null ? "Đã cập nhật thương hiệu" : "Đã thêm thương hiệu");
			setOpen(false);
			setEditing(null);
		} catch (e) {
			message.error(e?.response?.data?.message || "Lưu thương hiệu thất bại");
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
		{ title: "Tên thương hiệu", dataIndex: "name", key: "name" },
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
						title="Xóa thương hiệu này?"
						onConfirm={async () => {
							try {
								await remove(record.id);
								message.success("Đã xóa thương hiệu");
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
		return list.filter((it) => String(it?.name || "").toLowerCase().includes(q));
	}, [viewModels, query]);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Title level={4} style={{ margin: 0 }}>
					Quản lý thương hiệu
				</Title>
				<Space>
					<Input.Search
						placeholder="Tìm theo tên hoặc id"
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
						Thêm thương hiệu
					</Button>
				</Space>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<Statistic title="Tổng thương hiệu" value={stats.total} />
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
				title={editing ? "Sửa thương hiệu" : "Thêm thương hiệu"}
				open={open}
				onOk={onSubmit}
				onCancel={() => setOpen(false)}
				okText="Lưu"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="Tên thương hiệu" rules={[{ required: true, message: "Nhập tên" }]}
					>
						<Input placeholder="VD: Seiko" />
					</Form.Item>
					<Form.Item name="description" label="Mô tả">
						<Input.TextArea placeholder="Mô tả ngắn về thương hiệu" rows={3} />
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
