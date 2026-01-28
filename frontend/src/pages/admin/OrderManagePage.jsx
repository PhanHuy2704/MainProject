import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import {
	Button,
	Card,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Select,
	Space,
	Statistic,
	Table,
	Typography,
	message,
	theme,
} from "antd";

import { useAdminOrders } from "../../hooks/admin/useAdminOrders";
import { formatDateTimeVi, formatVnd } from "../../utils/formatters";
import { mapOrderStatusToVi, mapPaymentMethodToVi } from "../../utils/orderMappings";

export default function OrderManagePage() {
	const { Title } = Typography;
	const { token } = theme.useToken();
	const viewButtonStyle = {
		backgroundColor: token.colorPrimary,
		borderColor: token.colorPrimary,
		color: token.colorTextLightSolid,
	};
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
	const [query, setQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState([]);
	const [filterPayment, setFilterPayment] = useState([]);
	const [filterCustomer, setFilterCustomer] = useState([]);
	const [filterTotalRange, setFilterTotalRange] = useState([]); 
	const [filterDateRange, setFilterDateRange] = useState(null); 
	const [filterEndDateRange, setFilterEndDateRange] = useState(null); 
	const { customers, products, items, detailsByOrderId, loading, error, loadDetails, save, remove } = useAdminOrders();
	const watchedItems = Form.useWatch("items", form);
	const watchedDiscount = Form.useWatch("discount", form);

	React.useEffect(() => {
		if (!error) return;
		message.error(error?.response?.data?.message || "Không tải được dữ liệu đơn hàng");
	}, [error]);

	const customerOptions = useMemo(
		() => (Array.isArray(customers) ? customers : []).map((c) => ({ value: String(c.id), label: `${c.name} (${c.email})` })),
		[customers]
	);
	const customerLabelById = useMemo(() => {
		const map = new Map();
		(Array.isArray(customers) ? customers : []).forEach((c) => map.set(c.id, `${c.name} (${c.email})`));
		return map;
	}, [customers]);
	const productOptions = useMemo(
		() => (Array.isArray(products) ? products : []).map((p) => ({ value: p.id, label: p.name })),
		[products]
	);
	const productById = useMemo(() => {
		const map = new Map();
		(Array.isArray(products) ? products : []).forEach((p) => map.set(p.id, p));
		return map;
	}, [products]);

	const modalTotals = useMemo(() => {
		const list = Array.isArray(watchedItems) ? watchedItems : [];
		const subtotal = list.reduce((sum, it) => {
			const product = productById.get(it?.productId);
			const unitPrice = Number(it?.price) || Number(product?.price) || 0;
			const quantity = Number(it?.quantity) || 0;
			return sum + unitPrice * quantity;
		}, 0);
		const rawDiscount = Number(watchedDiscount) || 0;
		const effectiveDiscount = Math.max(0, Math.min(rawDiscount, subtotal));
		const total = Math.max(0, subtotal - effectiveDiscount);
		return { subtotal, discount: effectiveDiscount, total };
	}, [watchedItems, watchedDiscount, productById]);
	const renderStatus = (status) => mapOrderStatusToVi(status);
	const renderPaymentMethod = (value) => mapPaymentMethodToVi(value);

	const stats = useMemo(() => {
		const list = Array.isArray(items) ? items : [];
		const completed = list.filter((o) => String(o?.status || "") === "COMPLETED");
		const revenue = completed.reduce((sum, o) => sum + (Number(o?.finalPrice) || 0), 0);
		return { total: list.length, revenue };
	}, [items]);

	const openCreate = () => {
		setEditing(null);
		form.resetFields();
		form.setFieldsValue({
			status: "CREATED",
			paymentMethod: "CASH",
			discount: 0,
			items: [{ productId: productOptions?.[0]?.value, quantity: 1, price: 0 }],
		});
		setOpen(true);
	};

	const resetFilters = () => {
		setQuery("");
		setFilterStatus([]);
		setFilterPayment([]);
		setFilterCustomer([]);
		setFilterDateRange(null);
		setFilterEndDateRange(null);
		setPagination({ current: 1, pageSize: pagination.pageSize });
	};

	const openEdit = async (record) => {
		setEditing(record);
		try {
			const details = await loadDetails(record.id);
			const itemsSubtotal = (Array.isArray(details) ? details : []).reduce(
				(sum, d) => sum + (Number(d?.unitPrice) || 0) * (Number(d?.quantity) || 0),
				0
			);
			const finalPrice = Number(record?.finalPrice) || 0;
			const derivedDiscount = Math.max(0, itemsSubtotal - finalPrice);
			const recordDiscount = Number(record?.discount);
			const initialDiscount = Number.isFinite(recordDiscount) ? recordDiscount : derivedDiscount;
			form.setFieldsValue({
				userId: record?.userId,
				status: record?.status,
				paymentMethod: record?.paymentMethod,
				discount: initialDiscount,
				receiverName: record?.receiverName,
				receiverPhone: record?.receiverPhone,
				shippingAddress: record?.shippingAddress,
				items: (Array.isArray(details) ? details : []).map((d) => ({
					id: d?.id ?? d?.orderDetailId,
					productId: d.productId,
					quantity: d.quantity,
					price: d.unitPrice,
				})),
			});
			setOpen(true);
		} catch (e) {
			message.error(e?.response?.data?.message || "Không tải được chi tiết đơn hàng");
		}
	};

	const onSubmit = async () => {
		try {
			const values = await form.validateFields();
			await save({ editingId: editing?.id, values });
			message.success(editing?.id != null ? "Đã cập nhật đơn hàng" : "Đã thêm đơn hàng");
			setOpen(false);
			setEditing(null);
		} catch (e) {
			message.error(e?.response?.data?.message || "Lưu đơn hàng thất bại");
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
		{ title: "Mã đơn", dataIndex: "code", key: "code", width: 130, ellipsis: true },
		{
			title: "Khách hàng",
			dataIndex: "userId",
			key: "userId",
			width: 220,
			ellipsis: true,
			render: (id) => customerLabelById.get(id) || id,
		},
		{ title: "SĐT", dataIndex: "receiverPhone", key: "receiverPhone", width: 130, ellipsis: true },
		{
			title: "Tên sản phẩm",
			key: "productNames",
			width: 260,
			ellipsis: true,
			render: (_, record) => {
				const details = detailsByOrderId?.[record.id];
				if (!Array.isArray(details) || details.length === 0) return "";
				const text = details
					.map((d) => productById.get(d.productId)?.name || String(d.productId))
					.join(", ");
				return <Typography.Text ellipsis={{ tooltip: text }}>{text}</Typography.Text>;
			},
		},
		{
			title: "Số lượng",
			key: "totalQuantity",
			width: 100,
			align: "right",
			render: (_, record) => {
				const details = detailsByOrderId?.[record.id];
				return Array.isArray(details) ? details.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0) : 0;
			},
		},
		{ title: "Trạng thái", dataIndex: "status", key: "status", width: 120, render: renderStatus },
		{ title: "Thanh toán", dataIndex: "paymentMethod", key: "paymentMethod", width: 130, render: renderPaymentMethod },
		{ title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", width: 160, render: formatDateTimeVi },
		{ title: "Kết thúc", dataIndex: "endAt", key: "endAt", width: 160, render: (v) => (v ? formatDateTimeVi(v) : "") },
		{ title: "Tổng", key: "total", width: 140, align: "right", render: (_, record) => formatVnd(record?.finalPrice) },
		{
			title: "Hành động",
			key: "actions",
			width: 160,
			fixed: "right",
			render: (_, record) => (
				<Space>
					<Button type="primary" style={viewButtonStyle} onClick={() => openEdit(record)}>
						Xem
					</Button>
					<Popconfirm
						title="Xóa đơn hàng này?"
						onConfirm={async () => {
							try {
									await remove(record.id);
								message.success("Đã xóa đơn hàng");
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
				String(it?.userId || "").toLowerCase().includes(q) ||
				String(it?.id || "").toLowerCase().includes(q)
			);
		}
		if (Array.isArray(filterStatus) && filterStatus.length > 0) {
			list = list.filter((it) => filterStatus.includes(String(it?.status)));
		}
		if (Array.isArray(filterPayment) && filterPayment.length > 0) {
			list = list.filter((it) => filterPayment.includes(String(it?.paymentMethod)));
		}
		if (Array.isArray(filterCustomer) && filterCustomer.length > 0) {
			list = list.filter((it) => filterCustomer.includes(String(it?.userId)));
		}
		if (Array.isArray(filterTotalRange) && filterTotalRange.length > 0) {
			list = list.filter((it) => {
				const total = Number(it?.finalPrice) || 0;
				return filterTotalRange.some((range) => {
					const [min, max] = range.split('-').map(Number);
					return total >= min && total <= max;
				});
			});
		}
		if (filterDateRange && Array.isArray(filterDateRange) && filterDateRange[0] && filterDateRange[1]) {
			const [start, end] = filterDateRange;
			list = list.filter((it) => {
				const created = it?.createdAt ? dayjs(it.createdAt) : null;
				return created && created.isAfter(dayjs(start).startOf('day').subtract(1, 'ms')) && created.isBefore(dayjs(end).endOf('day').add(1, 'ms'));
			});
		}
		if (filterEndDateRange && Array.isArray(filterEndDateRange) && filterEndDateRange[0] && filterEndDateRange[1]) {
			const [start, end] = filterEndDateRange;
			list = list.filter((it) => {
				const ended = it?.endAt ? dayjs(it.endAt) : null;
				return ended && ended.isAfter(dayjs(start).startOf('day').subtract(1, 'ms')) && ended.isBefore(dayjs(end).endOf('day').add(1, 'ms'));
			});
		}
		return list;
	}, [items, query, filterStatus, filterPayment, filterCustomer, filterTotalRange, filterDateRange, filterEndDateRange]);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<Title level={4} style={{ margin: 0 }}>
					Quản lý đơn hàng
				</Title>
				<Space wrap>
					<Input.Search
						placeholder="Tìm theo mã đơn hoặc id"
						allowClear
						value={query}
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
						Thêm đơn hàng
					</Button>
				</Space>
			</div>



			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 			   <Card variant="outlined">
 				<Statistic title="Tổng đơn" value={stats.total} />
 			   </Card>
 			   <Card variant="outlined">
 				<Statistic title="Doanh thu (hoàn thành)" value={stats.revenue} formatter={(v) => formatVnd(v)} />
 			   </Card>
			</div>

			
			<div className="flex flex-wrap gap-2 mb-2 mt-2 justify-end">
				
					<Select
						allowClear
						mode="multiple"
						placeholder="Trạng thái"
						style={{ width: 140 }}
						options={[
							{ value: "CREATED", label: mapOrderStatusToVi("CREATED") },
							{ value: "SHIPPING", label: mapOrderStatusToVi("SHIPPING") },
							{ value: "COMPLETED", label: mapOrderStatusToVi("COMPLETED") },
							{ value: "CANCELED", label: mapOrderStatusToVi("CANCELED") },
						]}
						value={filterStatus}
						onChange={(v) => {
							setFilterStatus(Array.isArray(v) ? v : (v ? [v] : []));
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						maxTagCount={0}
						maxTagPlaceholder={() => "Trạng thái"}
					/>

					<Select
						allowClear
						mode="multiple"
						placeholder="Tổng tiền"
						style={{ width: 200 }}
						options={[
							{ value: '0-200000000', label: '0 - 200 triệu' },
							{ value: '200000000-400000000', label: '200 - 400 triệu' },
							{ value: '400000000-600000000', label: '400 - 600 triệu' },
							{ value: '600000000-800000000', label: '600 - 800 triệu' },
							{ value: '800000000-1000000000', label: '800 triệu - 1 tỷ' },
							{ value: '1000000000-99999999999', label: 'Trên 1 tỷ' },
						]}
						value={filterTotalRange}
						onChange={(v) => {
							setFilterTotalRange(Array.isArray(v) ? v : v ? [v] : []);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						maxTagCount={0}
						maxTagPlaceholder={() => "Tổng tiền"}
					/>
				
				<Select
					allowClear
					mode="multiple"
					placeholder="Thanh toán"
					style={{ width: 140 }}
					options={[
						{ value: "CASH", label: mapPaymentMethodToVi("CASH") },
						{ value: "BANK_TRANSFER", label: mapPaymentMethodToVi("BANK_TRANSFER") },
					]}
					value={filterPayment}
					onChange={(v) => {
						setFilterPayment(Array.isArray(v) ? v : (v ? [v] : []));
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					maxTagCount={0}
					maxTagPlaceholder={() => "Thanh toán"}
				/>
				
				<Select
					allowClear
					mode="multiple"
					placeholder="Khách hàng"
					style={{ width: 180 }}
					options={customerOptions}
					value={filterCustomer.map(String)}
					onChange={(v) => {
						setFilterCustomer(Array.isArray(v) ? v.map(String) : (v ? [String(v)] : []));
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					showSearch
					optionFilterProp="label"
					maxTagCount={0}
					maxTagPlaceholder={() => "Khách hàng"}
				/>
				
				<DatePicker.RangePicker
					allowClear
					style={{ width: 240 }}
					value={filterDateRange}
					onChange={(v) => {
						setFilterDateRange(v);
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					format="DD/MM/YYYY"
					placeholder={["Tạo từ ngày", "Tạo đến ngày"]}
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
					placeholder={["Kết thúc từ ngày", "Kết thúc đến ngày"]}
				/>
				<Button onClick={resetFilters}>
					Đặt lại
				</Button>
			</div>

			   <Card variant="outlined">
				<Table
					rowKey="id"
					columns={columns}
					dataSource={filtered}
					loading={loading}
					tableLayout="fixed"
					scroll={{ x: "max-content" }}
					pagination={{
						...pagination,
						onChange: (current, pageSize) => setPagination({ current, pageSize }),
					}}
				/>
			</Card>

			<Modal
				title={editing ? "Sửa đơn hàng" : "Thêm đơn hàng"}
				open={open}
				onOk={onSubmit}
				onCancel={() => setOpen(false)}
				okText="Lưu"
				cancelText="Hủy"
				width={720}
				destroyOnHidden
			>
				<Form form={form} layout="vertical">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{!editing ? (
							<Form.Item name="code" label="Mã đơn" rules={[{ required: true, message: "Nhập mã" }]}>
								<Input placeholder="VD: DH-1004" />
							</Form.Item>
						) : (
							<Form.Item label="Mã đơn">
								<Input value={editing?.code} disabled />
							</Form.Item>
						)}
						<Form.Item name="userId" label="Khách hàng" rules={[{ required: true }]}> 
							<Select options={customerOptions} placeholder="Chọn khách hàng" />
						</Form.Item>
						<Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
							<Select
								options={[
									{ value: "CREATED", label: "Đã tạo" },
									{ value: "SHIPPING", label: "Đang giao" },
									{ value: "COMPLETED", label: "Hoàn thành" },
									{ value: "CANCELED", label: "Đã hủy" },
								]}
							/>
						</Form.Item>
						<Form.Item name="paymentMethod" label="Thanh toán" rules={[{ required: true }]}>
							<Select
								options={[
									{ value: "CASH", label: "Tiền mặt" },
									{ value: "BANK_TRANSFER", label: "Chuyển khoản" },
								]}
							/>
						</Form.Item>
						<Form.Item name="discount" label="Giảm giá">
							<InputNumber className="w-full" min={0} />
						</Form.Item>
						<Form.Item name="receiverName" label="Tên người nhận" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item name="receiverPhone" label="SĐT người nhận" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						<Form.Item
							name="shippingAddress"
							label="Địa chỉ giao"
							rules={[{ required: true }]}
							className="md:col-span-2"
						>
							<Input />
						</Form.Item>
					</div>

					<Typography.Title level={5} style={{ marginTop: 8 }}>
						Sản phẩm
					</Typography.Title>
					<Form.List name="items">
						{(fields, { add, remove }) => (
							<div className="space-y-2">
								{fields.map((field) => (
									<div key={field.key} className="grid grid-cols-12 gap-2 items-end">
										<Form.Item {...field} name={[field.name, "id"]} hidden>
											<Input />
										</Form.Item>
										<div className="col-span-6">
											<Form.Item
												{...field}
												name={[field.name, "productId"]}
												label="Sản phẩm"
												rules={[{ required: true, message: "Chọn sản phẩm" }]}
											>
												<Select options={productOptions} placeholder="Chọn" />
											</Form.Item>
										</div>
										<div className="col-span-3">
											<Form.Item
												{...field}
												name={[field.name, "quantity"]}
												label="Số lượng"
												rules={[{ required: true, message: "Nhập số lượng" }]}
											>
												<InputNumber className="w-full" min={1} />
											</Form.Item>
										</div>
										<div className="col-span-3">
											<Form.Item {...field} name={[field.name, "price"]} label="Giá">
												<InputNumber className="w-full" min={0} />
											</Form.Item>
										</div>
										<div className="col-span-12 flex justify-end">
											<Button danger onClick={() => remove(field.name)}>
												Xóa dòng
											</Button>
										</div>
									</div>
								))}
								<Button onClick={() => add({ quantity: 1, price: 0 })}>Thêm sản phẩm</Button>
							</div>
						)}
					</Form.List>

					<Divider className="my-3" />
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Typography.Text type="secondary">Tạm tính</Typography.Text>
							<Typography.Text strong>{formatVnd(modalTotals.subtotal)}</Typography.Text>
						</div>
						<div className="flex items-center justify-between">
							<Typography.Text type="secondary">Giảm giá</Typography.Text>
							<Typography.Text strong>
								{modalTotals.discount > 0 ? `-${formatVnd(modalTotals.discount)}` : formatVnd(0)}
							</Typography.Text>
						</div>
						<div className="flex items-center justify-between">
							<Typography.Text strong>Tổng cộng</Typography.Text>
							<Typography.Text strong>{formatVnd(modalTotals.total)}</Typography.Text>
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	);
}

