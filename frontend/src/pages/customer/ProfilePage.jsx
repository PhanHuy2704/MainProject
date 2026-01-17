import React, { useEffect, useMemo, useState } from "react";
import {
	Breadcrumb,
	Button,
	Card,
	Form,
	Input,
	Select,
	Menu,
	Spin,
	Typography,
	message,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/customer/useAuth";
import { UserService } from "../../service/UserService";
const { Title, Text } = Typography;

function AccountFieldRow({ label, field, inputType, editingField, startEdit, finishEdit }) {
	const isEditing = editingField === field;
	const isEmail = field === "email";
	const commonInputProps = {
		readOnly: isEmail || !isEditing,
		bordered: false,
		className: isEditing ? "px-2 py-1" : "cursor-pointer px-2 py-1 hover:bg-black/5",
		onClick: () => {
			if (!isEditing && !isEmail) startEdit(field);
		},
		onBlur: finishEdit,
	};

	return (
		<div>
			<Text type="secondary">{label}</Text>
			<Form.Item name={field} className="!mb-0">
				{inputType === "textarea" ? (
					<Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder={label} {...commonInputProps} />
				) : inputType === "gender" ? (
					<Select
						placeholder="Chọn giới tính"
						options={[
							{ value: "Nam", label: "Nam" },
							{ value: "Nữ", label: "Nữ" },
						]}
						bordered={false}
						className={isEditing ? "px-2 py-1" : "cursor-pointer px-2 py-1 hover:bg-black/5"}
						onMouseDown={() => {
							if (!isEditing) startEdit(field);
						}}
						onBlur={finishEdit}
						onChange={() => {
							finishEdit();
						}}
					/>
				) : (
					<Input
						placeholder={label}
						inputMode={inputType === "tel" ? "tel" : undefined}
						onPressEnter={finishEdit}
						{...commonInputProps}
					/>
				)}
			</Form.Item>
		</div>
	);
}

function normalizeAccountValues(user) {
	return {
		name: user?.name || user?.fullName || "",
		gender: user?.gender || "Nam",
		email: user?.email || "",
		phone: user?.phone || user?.phoneNumber || "",
		address: user?.address || "",
	};
}

function isAccountDirty(current, initial) {
	return (
		(current?.name ?? "") !== (initial?.name ?? "") ||
		(current?.gender ?? "") !== (initial?.gender ?? "") ||
		(current?.email ?? "") !== (initial?.email ?? "") ||
		(current?.phone ?? "") !== (initial?.phone ?? "") ||
		(current?.address ?? "") !== (initial?.address ?? "")
	);
}

// THÔNG TIN TÀI KHOẢN (editable)
function AccountInfo({ user, onUserUpdated }) {
	const [form] = Form.useForm();
	const [editingField, setEditingField] = React.useState(null);
	const initialValues = React.useMemo(() => normalizeAccountValues(user), [user]);
	const [isDirty, setIsDirty] = React.useState(false);

	React.useEffect(() => {
		form.setFieldsValue(initialValues);
		setIsDirty(false);
	}, [form, initialValues]);

	const startEdit = (field) => {
		setEditingField(field);
	};

	const finishEdit = () => setEditingField(null);

	const handleUpdate = async () => {
		try {
			const values = form.getFieldsValue(true);

			const updated = await UserService.updateMe({
				name: values.name,
				gender: values.gender,
				phone: values.phone,
				address: values.address,
			});
			onUserUpdated?.(updated);
			message.success("Đã cập nhật thông tin");
			setEditingField(null);
			setIsDirty(false);
		} catch (e) {
			message.error(e?.response?.data?.message || "Cập nhật thất bại");
		}
	};

	return (
		<div>
			<Title level={4} className="!mb-4">
				Thông tin tài khoản
			</Title>
			

			<Form
				form={form}
				layout="vertical"
				className="mt-4"
				onValuesChange={(_, allValues) => {
					setIsDirty(isAccountDirty(allValues, initialValues));
				}}
			>
				<div className="space-y-3">
					<AccountFieldRow label="Họ tên" field="name" editingField={editingField} startEdit={startEdit} finishEdit={finishEdit} />
					<AccountFieldRow label="Giới tính" field="gender" inputType="gender" editingField={editingField} startEdit={startEdit} finishEdit={finishEdit} />
					<AccountFieldRow label="Email" field="email" editingField={editingField} startEdit={startEdit} finishEdit={finishEdit} />
					<AccountFieldRow label="Số điện thoại" field="phone" inputType="tel" editingField={editingField} startEdit={startEdit} finishEdit={finishEdit} />
					<AccountFieldRow label="Địa chỉ" field="address" inputType="textarea" editingField={editingField} startEdit={startEdit} finishEdit={finishEdit} />
				</div>

				<div className="mt-6">
					<Button type="primary" onClick={handleUpdate} disabled={!isDirty}>
						Cập nhật thông tin tài khoản
					</Button>
					
				</div>
			</Form>
		</div>
	);
}

//ĐỔI MẬT KHẨU
function PasswordChange() {
	const [form] = Form.useForm();

	return (
		<div>
			<Title level={4} className="!mb-4">
				Đổi mật khẩu
			</Title>
			<Form
				form={form}
				layout="vertical"
				onFinish={async (values) => {
					try {
						await UserService.changePassword({
							currentPassword: values.currentPassword,
							newPassword: values.newPassword,
						});
						message.success("Đổi mật khẩu thành công");
						form.resetFields();
					} catch (e) {
						message.error(e?.response?.data?.message || "Đổi mật khẩu thất bại");
					}
				}}
			>
					<Form.Item
						label="Mật khẩu hiện tại"
						name="currentPassword"
						rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
					>
						<Input placeholder="Nhập mật khẩu hiện tại" />
					</Form.Item>

					<Form.Item
						label="Mật khẩu mới"
						name="newPassword"
						rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
					>
						<Input placeholder="Nhập mật khẩu mới" />
					</Form.Item>

					<Form.Item
						label="Xác nhận mật khẩu mới"
						name="confirmPassword"
						dependencies={["newPassword"]}
						rules={[
							{ required: true, message: "Vui lòng xác nhận mật khẩu mới" },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
									return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
								},
							}),
						]}
					>
						<Input placeholder="Nhập lại mật khẩu mới" />
					</Form.Item>

					<Button type="primary" htmlType="submit">
						Cập nhật
					</Button>
			</Form>
		</div>
	);
}

//NESTED PROFILE PAGE
export default function ProfilePage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const { token, setUser: setAuthUser } = useAuth();

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				if (!token) {
					message.info("Vui lòng đăng nhập để xem hồ sơ");
					navigate("/auth", { replace: true });
					return;
				}
				const me = await UserService.getMe();
				if (cancelled) return;
				setAuthUser(me);
				setUser(me);
			} catch (e) {
				message.error(e?.response?.data?.message || "Không tải được hồ sơ");
				navigate("/auth", { replace: true });
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [navigate, token, setAuthUser]);


	const selectedKey = useMemo(() => {
		if (location.pathname.endsWith("/password")) return "password";
		return "account";
	}, [location.pathname]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-96">
				<Spin size="large" tip="Đang tải thông tin..." />
			</div>
		);
	}

	return (
		<div className="min-h-full">
			

			<div className="container mx-auto px-4 py-6">
				<Title level={3} className="mb-6" style={{ paddingBottom: '20px' }}>
					Tài khoản của tôi
				</Title>

				<div className="flex flex-col md:flex-row gap-4">
						<div className="w-full md:w-72">
							<Card bordered={false} className="shadow-sm">
								<Menu
									mode="inline"
									selectedKeys={[selectedKey]}
									items={[
										{ key: "account", label: "Thông tin tài khoản", onClick: () => navigate("/profile") },
										{ key: "orders", label: "Đơn hàng", onClick: () => navigate("/order-history") },
										{ key: "password", label: "Đổi mật khẩu", onClick: () => navigate("/profile/password") },
									]}
								/>
							</Card>
						</div>

						<div className="bg-white shadow-sm rounded-lg p-6 w-full">
							<Routes>
								<Route
									path="/"
										element={
											<AccountInfo
												user={user}
												onUserUpdated={(next) => {
													setAuthUser(next);
													setUser(next);
												}}
											/>
										}
								/>
								<Route path="/password" element={<PasswordChange />} />
							</Routes>
						</div>
					</div>
			</div>
		</div>
	);
}
