import React, { useMemo, useState } from "react";
import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Statistic, Table, Typography, message, theme } from "antd";

import { useAdminDiscounts } from "../../hooks/admin/useAdminDiscounts";
import { formatDateVi } from "../../utils/formatters";
import { isActiveLabel, normalizeActiveLabel } from "../../utils/status";

export default function DiscountPage() {
	const { Title } = Typography;
	const { token } = theme.useToken();
	const viewButtonStyle = {
		backgroundColor: token.colorPrimary,
		borderColor: token.colorPrimary,
		color: token.colorTextLightSolid,
	};
	const normalizeType = (value) => {
		const s = String(value || "");
		if (s === "fixed" || s === "FIX") return "fixed";
		if (s === "percent" || s === "PERCENT") return "percent";
		return "fixed";
	};
	const renderType = (value) => normalizeType(value);
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
	const { items, loading, save, remove, toFormValues } = useAdminDiscounts();

	const stats = useMemo(() => {
		const list = Array.isArray(items) ? items : [];
		return {
			total: list.length,
			active: list.filter((d) => isActiveLabel(d?.status)).length,
		};
	}, [items]);

	const openCreate = () => {
		setEditing(null);
		form.resetFields();
		form.setFieldsValue({ type: "fixed", status: "Hoạt động", value: 0, quantity: 0 });
		setOpen(true);
	};

	const openEdit = (record) => {
		setEditing(record);
		form.setFieldsValue(toFormValues(record));
		setOpen(true);
	};

	const onSubmit = async () => {
		try {
			const values = await form.validateFields();
			await save({ editingId: editing?.id, values });
			message.success(editing?.id != null ? "Đã cập nhật mã giảm giá" : "Đã thêm mã giảm giá");
			setOpen(false);
			setEditing(null);
		} catch (e) {
			message.error(e?.response?.data?.message || "Lưu mã giảm giá thất bại");
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
		{ title: "Mã", dataIndex: "code", key: "code" },
		{ title: "Loại", dataIndex: "type", key: "type", render: renderType },
		{ title: "Giá trị", dataIndex: "value", key: "value" },
		{
			title: "Số lượng",
			dataIndex: "stock",
			key: "stock",
			render: (_, record) => record.stock,
		},
		{
			title: "Đã sử dụng",
			dataIndex: "usedQuantity",
			key: "usedQuantity",
			align: "right",
			render: (v) => Number(v) || 0,
		},
		{ title: "Bắt đầu", dataIndex: "startAt", key: "startAt", render: formatDateVi },
		{ title: "Kết thúc", dataIndex: "endAt", key: "endAt", render: formatDateVi },
		{ title: "Trạng thái", dataIndex: "status", key: "status", render: renderStatus },
		{
			title: "Hành động",
			key: "actions",
			render: (_, record) => (
				<Space>
					<Button type="primary" style={viewButtonStyle} onClick={() => openEdit(record)}>
						Xem
					</Button>
					<Popconfirm
						title="Xóa mã giảm giá này?"
						onConfirm={async () => {
							try {
									await remove(record.id);
								message.success("Đã xóa mã giảm giá");
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
				String(it?.code || "").toLowerCase().includes(q) ||
				String(it?.id || "").toLowerCase().includes(q) ||
				String(it?.type || "").toLowerCase().includes(q)
			);
		});
	}, [items, query]);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Title level={4} style={{ margin: 0 }}>
					Quản lý giảm giá
				</Title>
				<Space>
					<Input.Search
						placeholder="Tìm theo mã hoặc loại"
						allowClear
						onSearch={(v) => {
							setQuery(v);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						onChange={(e) => {
							setQuery(e.target.value);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						style={{ width: 300 }}
					/>
					<Button type="primary" onClick={openCreate}>
						Thêm giảm giá
					</Button>
				</Space>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<Statistic title="Tổng mã" value={stats.total} />
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
				title={editing ? "Sửa giảm giá" : "Thêm giảm giá"}
				open={open}
				onOk={onSubmit}
				onCancel={() => setOpen(false)}
				okText="Lưu"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item name="code" label="Mã giảm giá" rules={[{ required: true, message: "Nhập mã" }]}
					>
						<Input placeholder="VD: GIAM10" />
					</Form.Item>
					<Form.Item name="type" label="Loại" rules={[{ required: true }]}>
						<Select
							options={[
								{ value: "fixed", label: "fixed" },
								{ value: "percent", label: "percent" },
							]}
						/>
					</Form.Item>
					<Form.Item name="value" label="Giá trị" rules={[{ required: true }]}>
						<InputNumber className="w-full" min={0} />
					</Form.Item>
					<Form.Item name="quantity" label="Số lượng">
						<InputNumber className="w-full" min={0} />
					</Form.Item>
					
					<Form.Item name="startAt" label="Bắt đầu">
						<DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày" />
					</Form.Item>
					<Form.Item name="endAt" label="Kết thúc">
						<DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày" />
					</Form.Item>
					<Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
						<Select
							options={[
								{ value: "Hoạt động", label: "Hoạt động" },
								{ value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
								{ value: "Đã quá hạn", label: "Đã quá hạn", disabled: true },
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}

