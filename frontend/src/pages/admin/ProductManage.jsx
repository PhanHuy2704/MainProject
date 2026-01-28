import React, { useMemo, useState } from "react";
import {
	Button,
	Card,
	DatePicker,
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
	Upload,
	message,
	theme,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

import { useAdminProducts } from "../../hooks/admin/useAdminProducts";
import { AdminMediaService } from "../../service/AdminMediaService";
import { formatVnd } from "../../utils/formatters";
import { getSafeImageSrc } from "../../utils/images";
import { normalizeStockStatusLabel } from "../../utils/status";

export default function ProductManage() {
	const { Title } = Typography;
	const { token } = theme.useToken();
	const viewButtonStyle = {
		backgroundColor: token.colorPrimary,
		borderColor: token.colorPrimary,
		color: token.colorTextLightSolid,
	};
	const renderStatus = (value) => {
		const normalized = normalizeStockStatusLabel(value);
		return (
			<Typography.Text type={normalized === "Hoạt động" ? "success" : "danger"}>
				{normalized}
			</Typography.Text>
		);
	};
	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
	const [query, setQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState([]);
	const [filterBrand, setFilterBrand] = useState([]);
	const [filterStatus, setFilterStatus] = useState([]);
	const [filterStock, setFilterStock] = useState([]);
	const [filterPriceRange, setFilterPriceRange] = useState([]); 
	const [filterDateRange, setFilterDateRange] = useState(undefined);
	const { brands, categories, items, loading, error, save, remove, DEFAULT_PRODUCT_IMAGE, LEGACY_PLACEHOLDERS } =
		useAdminProducts();

	React.useEffect(() => {
		if (!error) return;
		message.error(error?.response?.data?.message || "Không tải được dữ liệu sản phẩm");
	}, [error]);

	const getProductImageSrc = (src) =>
		getSafeImageSrc({
			src,
			fallbackSrc: DEFAULT_PRODUCT_IMAGE,
			placeholders: LEGACY_PLACEHOLDERS,
		});

	const brandOptions = useMemo(
		() => (Array.isArray(brands) ? brands : []).map((b) => ({ value: String(b.id), label: b.name })),
		[brands]
	);
	const brandLabelById = useMemo(() => {
		const map = new Map();
		(Array.isArray(brands) ? brands : []).forEach((b) => map.set(b.id, b.name));
		return map;
	}, [brands]);
	const categoryOptions = useMemo(
		() => (Array.isArray(categories) ? categories : []).map((c) => ({ value: String(c.id), label: c.name })),
		[categories]
	);
	const categoryLabelById = useMemo(() => {
		const map = new Map();
		(Array.isArray(categories) ? categories : []).forEach((c) => map.set(c.id, c.name));
		return map;
	}, [categories]);

    const stats = useMemo(() => {
		const list = Array.isArray(items) ? items : [];
		const sold = list.reduce((sum, p) => sum + (Number(p?.soldQuantity) || 0), 0);
		const outOfStock = list.filter((p) => (Number(p?.stock) || 0) <= 0).length;
		return { total: list.length, sold, outOfStock };
	}, [items]);

	const filtered = useMemo(() => {
		let list = Array.isArray(items) ? items : [];
		const q = String(query || "").trim().toLowerCase();
		if (q) {
			list = list.filter((it) =>
				String(it?.name || "").toLowerCase().includes(q) ||
				String(it?.code || "").toLowerCase().includes(q) ||
				String(it?.id || "").toLowerCase().includes(q)
			);
		}
		if (Array.isArray(filterCategory) && filterCategory.length > 0) {
			list = list.filter((it) => filterCategory.includes(String(it?.categoryId)));
		}
		if (Array.isArray(filterBrand) && filterBrand.length > 0) {
			list = list.filter((it) => filterBrand.includes(String(it?.brandId)));
		}
		if (Array.isArray(filterStatus) && filterStatus.length > 0) {
			list = list.filter((it) => filterStatus.includes(normalizeStockStatusLabel(it?.status)));
		}
		if (Array.isArray(filterStock) && filterStock.length > 0) {
			const hasIn = filterStock.includes("in");
			const hasOut = filterStock.includes("out");
			if (hasIn && !hasOut) list = list.filter((it) => Number(it?.stock) > 0);
			if (hasOut && !hasIn) list = list.filter((it) => Number(it?.stock) <= 0);
		}
		if (Array.isArray(filterPriceRange) && filterPriceRange.length > 0) {
			list = list.filter((it) => {
				const price = Number(it?.price) || 0;
				return filterPriceRange.some((range) => {
					const [min, max] = range.split('-').map(Number);
					return price >= min && price <= max;
				});
			});
		}
		if (filterDateRange && Array.isArray(filterDateRange) && filterDateRange[0] && filterDateRange[1]) {
			const [start, end] = filterDateRange;
			const dayjs = require("dayjs");
			list = list.filter((it) => {
				if (!it?.createdAt) return false;
				const d = dayjs(it.createdAt);
				return d.isSame(start, "day") || d.isSame(end, "day") || (d.isAfter(start, "day") && d.isBefore(end, "day"));
			});
		}
		return list;
	}, [items, query, filterCategory, filterBrand, filterStatus, filterStock, filterPriceRange, filterDateRange]);

	const openCreate = () => {
		setEditing(null);
		setImagePreview(null);
		form.resetFields();
		form.setFieldsValue({
			status: "Hoạt động",
			price: 0,
			stock: 0,
			soldQuantity: 0,
			description: "",
			image: null,
		});
		setOpen(true);
	};

	const openEdit = (record) => {
		setEditing(record);
		setImagePreview(getProductImageSrc(record?.image ?? null));
		form.setFieldsValue({
			sku: record?.code,
			name: record?.name,
			description: record?.description,
			categoryId: record?.categoryId,
			brandId: record?.brandId,
			price: record?.price,
			stock: record?.stock,
			soldQuantity: record?.soldQuantity,
			status: normalizeStockStatusLabel(record?.status ?? "Hoạt động"),
			image: getProductImageSrc(record?.image ?? null),
		});
		setOpen(true);
	};

	const onSubmit = async () => {
		try {
			const values = await form.validateFields();
			await save({
				editingId: editing?.id,
				values,
				fallbackImage: editing?.image || DEFAULT_PRODUCT_IMAGE,
			});
			message.success(editing?.id != null ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm");
			setOpen(false);
			setEditing(null);
		} catch (e) {
			message.error(e?.response?.data?.message || "Lưu sản phẩm thất bại");
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
		{
			title: "Ảnh",
			dataIndex: "image",
			key: "image",
			width: 90,
			render: (src) => (
				<img
					loading="lazy"
					decoding="async"
					src={getProductImageSrc(src)}
					alt="product"
					style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
					onError={(e) => {
						e.currentTarget.onerror = null;
						e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
					}}
				/>
			),
		},
		{ title: "SKU", dataIndex: "code", key: "code", width: 140, ellipsis: true },
		{ title: "Tên", dataIndex: "name", key: "name", width: 220, ellipsis: true },
		{
			title: "Mô tả",
			dataIndex: "description",
			key: "description",
			width: 260,
			ellipsis: true,
			render: (value) => (
				<Typography.Text ellipsis={{ tooltip: value }}>
					{value}
				</Typography.Text>
			),
		},
		{
			title: "Danh mục",
			dataIndex: "categoryId",
			key: "categoryId",
			width: 160,
			ellipsis: true,
			render: (id) => categoryLabelById.get(id) || id,
		},
		{
			title: "Thương hiệu",
			dataIndex: "brandId",
			key: "brandId",
			width: 160,
			ellipsis: true,
			render: (id) => brandLabelById.get(id) || id,
		},
		{ title: "Giá", dataIndex: "price", key: "price", width: 140, align: "right", render: (v) => formatVnd(v) },
		{ title: "Kho", dataIndex: "stock", key: "stock", width: 90, align: "right" },
		{ title: "Đã bán", dataIndex: "soldQuantity", key: "soldQuantity", width: 100, align: "right" },
		{ title: "Trạng thái", dataIndex: "status", key: "status", width: 130, render: renderStatus },
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
						title="Xóa sản phẩm này?"
						onConfirm={async () => {
							try {
								await remove(record.id);
								message.success("Đã xóa sản phẩm");
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

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<Title level={4} style={{ margin: 0 }}>
					Quản lý sản phẩm
				</Title>
				<Space wrap>
					<Input.Search
						placeholder="Tìm theo tên hoặc SKU"
						allowClear
						onSearch={(v) => {
							setQuery(v);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						onChange={(e) => {
							setQuery(e.target.value);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						style={{ width: 180 }}
					/>
					<Button type="primary" onClick={openCreate}>
						Thêm sản phẩm
					</Button>
				</Space>
			</div>

			

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<Statistic title="Tổng sản phẩm" value={stats.total} />
				</Card>
				<Card>
					<Statistic title="Sản phẩm đã bán" value={stats.sold} />
				</Card>
				<Card>
					<Statistic title="Hết hàng" value={stats.outOfStock} />
				</Card>
			</div>

			
			<div className="flex flex-wrap gap-2 mb-2 mt-2 justify-end">
				   <Select
					   allowClear
					   mode="multiple"
					   placeholder="Danh mục"
					   style={{ width: 160 }}
					   options={categoryOptions}
					   value={filterCategory.map(String)}
					   onChange={(v) => {
						   setFilterCategory(Array.isArray(v) ? v.map(String) : v ? [String(v)] : []);
						   setPagination({ current: 1, pageSize: pagination.pageSize });
					   }}
					   maxTagCount={0}
					   maxTagPlaceholder={() => "Danh mục"}
				   />
				   <Select
					   allowClear
					   mode="multiple"
					   placeholder="Thương hiệu"
					   style={{ width: 160 }}
					   options={brandOptions}
					   value={filterBrand.map(String)}
					   onChange={(v) => {
						   setFilterBrand(Array.isArray(v) ? v.map(String) : v ? [String(v)] : []);
						   setPagination({ current: 1, pageSize: pagination.pageSize });
					   }}
					   maxTagCount={0}
					   maxTagPlaceholder={() => "Thương hiệu"}
				   />
					<Select
						allowClear
						mode="multiple"
						placeholder="Khoảng giá"
						style={{ width: 200 }}
						options={[
							{ value: '0-200000000', label: '0 - 200 triệu' },
							{ value: '200000000-400000000', label: '200 - 400 triệu' },
							{ value: '400000000-600000000', label: '400 - 600 triệu' },
							{ value: '600000000-800000000', label: '600 - 800 triệu' },
							{ value: '800000000-1000000000', label: '800 triệu - 1 tỷ' },
						]}
						value={filterPriceRange}
						onChange={(v) => {
							setFilterPriceRange(Array.isArray(v) ? v : v ? [v] : []);
							setPagination({ current: 1, pageSize: pagination.pageSize });
						}}
						maxTagCount={0}
						maxTagPlaceholder={() => "Khoảng giá"}
					/>
				<Select
					allowClear
					mode="multiple"
					placeholder="Trạng thái"
					style={{ width: 160 }}
					options={[
						{ value: "Hoạt động", label: "Hoạt động" },
						{ value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
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
					placeholder="Kho hàng"
					style={{ width: 140 }}
					options={[
						{ value: "in", label: "Còn hàng" },
						{ value: "out", label: "Hết hàng" },
					]}
					value={filterStock}
					onChange={(v) => {
						setFilterStock(Array.isArray(v) ? v : v ? [v] : []);
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					maxTagCount={0}
					maxTagPlaceholder={() => "Kho"}
				/>
				<DatePicker.RangePicker
					allowClear
					style={{ width: 260 }}
					value={filterDateRange}
					onChange={(v) => {
						setFilterDateRange(v);
						setPagination({ current: 1, pageSize: pagination.pageSize });
					}}
					format="DD/MM/YYYY"
					placeholder={["Tạo từ ngày", "Tạo đến ngày"]}
				/>
				<Button onClick={() => {
					setQuery("");
					setFilterCategory([]);
					setFilterBrand([]);
					setFilterStatus([]);
					setFilterStock([]);
					setFilterPriceRange([]);
					setFilterDateRange(undefined);
					setPagination({ current: 1, pageSize: pagination.pageSize });
				}}>Đặt lại</Button>
			</div>


			<Card>
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
				title={editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
				open={open}
				onOk={onSubmit}
				onCancel={() => setOpen(false)}
				okText="Lưu"
				cancelText="Hủy"
				destroyOnHidden
			>
				<Form form={form} layout="vertical">
					<Form.Item name="image" hidden>
						<Input />
					</Form.Item>
					<Form.Item label="Ảnh sản phẩm">
						<Space direction="vertical" size={12} style={{ width: "100%" }}>
							<Upload
								accept="image/*"
								maxCount={1}
								showUploadList={false}
								beforeUpload={async (file) => {
										const key = "upload-product-image";
										try {
											message.loading({ content: "Đang tải ảnh lên...", key, duration: 0 });
											const res = await AdminMediaService.uploadImage(file, { folder: "mainproject/products" });
											const url = res?.secureUrl || res?.secure_url || res?.url;
											if (!url) throw new Error("Upload failed");
											setImagePreview(url);
											form.setFieldsValue({ image: url });
											message.success({ content: "Tải ảnh lên thành công", key, duration: 2 });
										} catch (e) {
											message.error({ content: e?.response?.data?.message || "Tải ảnh lên thất bại", key, duration: 3 });
										}
									return false;
								}}
								onRemove={() => {
									setImagePreview(null);
									form.setFieldsValue({ image: null });
								}}
							>
								<Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
							</Upload>

							{imagePreview ? (
								<img
									src={imagePreview}
									alt="preview"
									style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 8 }}
								/>
							) : null}
						</Space>
					</Form.Item>

					<Form.Item name="sku" label="SKU" rules={[{ required: true, message: "Nhập SKU" }]}>
						<Input />
					</Form.Item>
					<Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: "Nhập tên" }]}>
						<Input />
					</Form.Item>
					<Form.Item name="description" label="Mô tả">
						<Input.TextArea rows={3} placeholder="Mô tả sản phẩm" />
					</Form.Item>
					<Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}
					>
						<Select options={categoryOptions} placeholder="Chọn danh mục" />
					</Form.Item>
					<Form.Item name="brandId" label="Thương hiệu" rules={[{ required: true }]}>
						<Select options={brandOptions} placeholder="Chọn thương hiệu" />
					</Form.Item>
					<Form.Item name="price" label="Giá" rules={[{ required: true }]}>
						<InputNumber className="w-full" min={0} />
					</Form.Item>
					<Form.Item name="stock" label="Tồn kho" rules={[{ required: true }]}>
						<InputNumber className="w-full" min={0} />
					</Form.Item>
					   
					<Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
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

