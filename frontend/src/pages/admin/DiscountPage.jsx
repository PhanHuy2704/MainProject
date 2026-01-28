import React, { useMemo, useState } from "react";
import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Statistic, Table, Typography, message, theme } from "antd";
import dayjs from "dayjs";

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
	const [filterStatus, setFilterStatus] = useState([]);
	const [filterType, setFilterType] = useState([]);
	const [filterStartDateRange, setFilterStartDateRange] = useState(undefined);
	const [filterEndDateRange, setFilterEndDateRange] = useState(undefined);
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

	const resetFilters = () => {
		setQuery("");
		setFilterStatus([]);
		setFilterType([]);
		setFilterStartDateRange(undefined);
		setFilterEndDateRange(undefined);
		setPagination({ current: 1, pageSize: pagination.pageSize });
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
		let list = Array.isArray(items) ? items : [];
		const q = String(query || "").trim().toLowerCase();
		if (q) {
			list = list.filter((it) =>
				String(it?.code || "").toLowerCase().includes(q) ||
				String(it?.id || "").toLowerCase().includes(q) ||
				String(it?.type || "").toLowerCase().includes(q)
			);
		}
		if (Array.isArray(filterStatus) && filterStatus.length > 0) {
			list = list.filter((it) => filterStatus.includes(normalizeActiveLabel(it?.status)));
		}
		if (Array.isArray(filterType) && filterType.length > 0) {
			list = list.filter((it) => filterType.includes(normalizeType(it?.type)));
		}
		if (filterStartDateRange && Array.isArray(filterStartDateRange) && filterStartDateRange[0] && filterStartDateRange[1]) {
			const [start, end] = filterStartDateRange;
			list = list.filter((it) => {
				if (!it?.startAt) return false;
				const d = dayjs(it.startAt);
				return d.isSame(start, "day") || d.isSame(end, "day") || (d.isAfter(start, "day") && d.isBefore(end, "day"));
			});
		}
		if (filterEndDateRange && Array.isArray(filterEndDateRange) && filterEndDateRange[0] && filterEndDateRange[1]) {
			const [start, end] = filterEndDateRange;
			list = list.filter((it) => {
				if (!it?.endAt) return false;
				const d = dayjs(it.endAt);
				return d.isSame(start, "day") || d.isSame(end, "day") || (d.isAfter(start, "day") && d.isBefore(end, "day"));
			});
		}
		return list;
	}, [items, query, filterStatus, filterType, filterStartDateRange, filterEndDateRange]);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<Title level={4} style={{ margin: 0 }}>
					Quản lý giảm giá
				</Title>
				<Space wrap>
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
						style={{ width: 160 }}
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

			{/* Bộ lọc ngay dưới thống kê, trên bảng */}
			<div className="flex flex-wrap gap-2 mb-2 mt-2 justify-end">
				<Select
					allowClear
					mode="multiple"
					placeholder="Trạng thái"
					style={{ width: 160 }}
					options={[
						{ value: "Hoạt động", label: "Hoạt động" },
						{ value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
						{ value: "Đã quá hạn", label: "Đã quá hạn" },
					]}
					value={filterStatus}
					onChange={(v) => {
						setFilterStatus(Array.isArray(v) ? v : v ? [v] : []);
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					maxTagCount={0}
					maxTagPlaceholder={() => "Trạng thái"}
				/>
				<Select
					allowClear
					mode="multiple"
					placeholder="Loại giảm giá"
					style={{ width: 160 }}
					options={[
						{ value: "fixed", label: "fixed" },
						{ value: "percent", label: "percent" },
					]}
					value={filterType}
					onChange={(v) => {
						setFilterType(Array.isArray(v) ? v : v ? [v] : []);
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					maxTagCount={0}
					maxTagPlaceholder={() => "Loại"}
				/>
				<DatePicker.RangePicker
					allowClear
					style={{ width: 240 }}
					value={filterStartDateRange}
					onChange={(v) => {
						setFilterStartDateRange(v);
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					format="DD/MM/YYYY"
					placeholder={["Bắt đầu từ", "Bắt đầu đến"]}
				/>
				<DatePicker.RangePicker
					allowClear
					style={{ width: 240 }}
					value={filterEndDateRange}
					onChange={(v) => {
						setFilterEndDateRange(v);
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					format="DD/MM/YYYY"
					placeholder={["Kết thúc từ", "Kết thúc đến"]}
				/>
				<Button onClick={resetFilters}>Đặt lại</Button>
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
				destroyOnHidden
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

