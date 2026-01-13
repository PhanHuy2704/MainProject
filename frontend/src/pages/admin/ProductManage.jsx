import React, { useMemo, useState } from "react";
import {
	Button,
	Card,
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
	const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
	const [query, setQuery] = useState("");
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
		() => (Array.isArray(brands) ? brands : []).map((b) => ({ value: b.id, label: b.name })),
		[brands]
	);
	const brandLabelById = useMemo(() => {
		const map = new Map();
		(Array.isArray(brands) ? brands : []).forEach((b) => map.set(b.id, b.name));
		return map;
	}, [brands]);
	const categoryOptions = useMemo(
		() => (Array.isArray(categories) ? categories : []).map((c) => ({ value: c.id, label: c.name })),
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
		const list = Array.isArray(items) ? items : [];
		const q = String(query || "").trim().toLowerCase();
		if (!q) return list;
		return list.filter((it) => {
			return (
				String(it?.name || "").toLowerCase().includes(q) ||
				String(it?.code || "").toLowerCase().includes(q) ||
				String(it?.id || "").toLowerCase().includes(q)
			);
		});
	}, [items, query]);

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
			<div className="flex items-center justify-between">
				<Title level={4} style={{ margin: 0 }}>
					Quản lý sản phẩm
				</Title>
				<Space>
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
						style={{ width: 320 }}
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
				destroyOnClose
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
					   {/* Đã bán: chỉ hiển thị ở bảng, không cho nhập/sửa trong form */}
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

