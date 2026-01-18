import React from "react";
import { Button, Card, Form, Input, Radio, Space, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { OrderService } from "../../../service/OrderService";
import { useAuth } from "../../../hooks/customer/useAuth";
import { useCart } from "../../../hooks/customer/useCart";

const { Title, Paragraph, Text } = Typography;

export default function OrderPage() {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [submitting, setSubmitting] = React.useState(false);
	const { token } = useAuth();
	const { items, coupon, clearCart, clearCoupon } = useCart();

	const mapPaymentMethod = (value) => {
		const key = String(value || "").toLowerCase();
		if (key === "bank") return "BANK_TRANSFER";
		if (key === "cod") return "CASH";
		return "BANK_TRANSFER";
	};

	return (
		<div className="container mx-auto px-4 py-10">
			<Space direction="vertical" size="large" className="w-full">
				<div>
					<Title level={2} className="!mb-1">
						Đặt hàng
					</Title>
					<Text type="secondary"></Text>
				</div>

					<Card variant="borderless" className="shadow-sm">
					<Paragraph className="!mb-6">
						Vui lòng nhập thông tin nhận hàng và chọn phương thức thanh toán.
					</Paragraph>

					<Form
						form={form}
						layout="vertical"
						initialValues={{ paymentMethod: "bank" }}
						onFinish={async (values) => {
						try {
							if (!token) {
								message.info("Vui lòng đăng nhập để đặt hàng");
								navigate("/auth");
								return;
							}
							if (!Array.isArray(items) || items.length === 0) {
								message.warning("Giỏ hàng đang trống");
								navigate("/cart");
								return;
							}

							setSubmitting(true);
							await OrderService.checkout({
								receiverName: values.receiverName,
								receiverPhone: values.receiverPhone,
								shippingAddress: values.shippingAddress,
								paymentMethod: mapPaymentMethod(values.paymentMethod),
								discountCode: coupon?.code || null,
								items: items.map((it) => ({
									productId: it?.productId,
									quantity: it?.quantity,
								})),
							});

							clearCart();
							clearCoupon();
							message.success("Đặt hàng thành công");
							navigate("/order-success");
						} catch (e) {
							message.error(e?.response?.data?.message || "Đặt hàng thất bại");
						} finally {
							setSubmitting(false);
						}
					}}
					>
						<Form.Item
							label="Tên người nhận"
							name="receiverName"
							rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
						>
							<Input placeholder="Nhập tên người nhận" />
						</Form.Item>

						<Form.Item
							label="Số điện thoại người nhận"
							name="receiverPhone"
							rules={[{ required: true, message: "Vui lòng nhập số điện thoại người nhận" }]}
						>
							<Input inputMode="tel" placeholder="Nhập số điện thoại" />
						</Form.Item>

						<Form.Item
							label="Địa chỉ nhận hàng"
							name="shippingAddress"
							rules={[{ required: true, message: "Vui lòng nhập địa chỉ nhận hàng" }]}
						>
							<Input.TextArea rows={3} placeholder="Nhập địa chỉ nhận hàng" />
						</Form.Item>

						<Form.Item
							label="Chọn phương thức thanh toán khi nhận hàng"
							name="paymentMethod"
							rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
						>
							<Radio.Group>
								<Space direction="vertical">
									<Radio value="bank">Chuyển khoản ngân hàng</Radio>
									<Radio value="cod">Thanh toán bằng tiền mặt</Radio>
								</Space>
							</Radio.Group>
						</Form.Item>

						<Space className="w-full" align="center">
							<Link to="/cart" className="hover:no-underline">
								<Button>Quay lại giỏ hàng</Button>
							</Link>
							<Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
								Xác nhận đặt hàng
							</Button>
						</Space>
					</Form>
				</Card>
			</Space>
		</div>
	);
}
