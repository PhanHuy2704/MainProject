import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Breadcrumb, Button, Card, Empty, Rate, Space, Tag, Typography, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { useOrderDetail } from "../../../hooks/customer/useOrderDetail";
import { formatDateTimeVi, formatVnd } from "../../../utils/formatters";
import { useAuth } from "../../../hooks/customer/useAuth";

const { Title, Text } = Typography;

export default function OrderDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const fallbackImage = "/assets/images/logo.svg";
	const { user } = useAuth();
	const userId = user?.id;

	const onAuthRequired = React.useCallback(
		({ reason }) => {
			if (reason === "missing_token") {
				message.info("Vui lòng đăng nhập để xem chi tiết đơn hàng");
			} else {
				message.info("Phiên đăng nhập đã hết hạn");
			}
			navigate("/auth");
		},
		[navigate]
	);

	const {
		order,
		isLoading,
		error: loadError,
	} = useOrderDetail({ orderId: id, userId, enabled: Boolean(id), onAuthRequired });

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card bordered={false} className="shadow-sm">
					<Text type="secondary">Đang tải dữ liệu...</Text>
				</Card>
			</div>
		);
	}

	if (loadError) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Alert message="Lỗi" description="Không tải được đơn hàng." type="error" showIcon />
			</div>
		);
	}

	if (!order) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Empty description="Không tìm thấy đơn hàng" />
				<div className="mt-4">
					<Link to="/order-history" className="hover:no-underline">
						<Button type="primary">Quay lại lịch sử đơn hàng</Button>
					</Link>
				</div>
			</div>
		);
	}

	const items = Array.isArray(order.items) ? order.items : [];
	const itemsSubtotal = items.reduce(
		(sum, it) => sum + (Number(it?.price) || 0) * (Number(it?.quantity) || 0),
		0
	);
	const finalPrice = Number(order?.finalPrice) || 0;
	const discount = Math.max(0, itemsSubtotal - finalPrice);
	const totals = {
		itemsSubtotal,
		discount,
		total: finalPrice || itemsSubtotal,
	};
	const status = String(order.status || "-");
	const statusLower = status.toLowerCase();
	const statusColor = statusLower === "hoàn thành" ? "green" : statusLower === "đã hủy" ? "red" : "blue";

	return (
		<div className="container mx-auto px-4 py-8">
			<Breadcrumb className="mb-6">
				<Breadcrumb.Item>
					<Link to="/" className="hover:no-underline">
						<HomeOutlined /> Trang chủ
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link to="/order-history" className="hover:no-underline">
						Lịch sử đơn hàng
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{order.code || order.id}</Breadcrumb.Item>
			</Breadcrumb>

			<Space direction="vertical" size="large" className="w-full">
				<Card bordered={false} className="shadow-sm">
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
						<div>
							<Title level={3} className="!mb-1">
								Đơn hàng {order.code || ""}
							</Title>
							
						</div>
						<Tag color={statusColor}>{status}</Tag>
					</div>

					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex items-start gap-2">
							<Text type="secondary" className="shrink-0">
								Ngày đặt:
							</Text>
							<div className="font-medium break-words">{formatDateTimeVi(order.createdAt) || "-"}</div>
						</div>

						<div className="flex items-start gap-2">
							<Text type="secondary" className="shrink-0">
								Người nhận:
							</Text>
							<div className="font-medium break-words">{order.receiverName || "-"}</div>
						</div>

						<div className="flex items-start gap-2">
							<Text type="secondary" className="shrink-0">
								Điện thoại:
							</Text>
							<div className="font-medium break-words">{order.receiverPhone || "-"}</div>
						</div>

						<div className="flex items-start gap-2">
							<Text type="secondary" className="shrink-0">
								Địa chỉ nhận:
							</Text>
							<div className="font-medium break-words">{order.shippingAddress || "-"}</div>
						</div>

						<div className="flex items-start gap-2">
							<Text type="secondary" className="shrink-0">
								Thanh toán:
							</Text>
							<div className="font-medium break-words">{order.paymentMethod || "-"}</div>
						</div>
					</div>
				</Card>

				<Card bordered={false} className="shadow-sm" title={<div className="font-medium">Sản phẩm</div>}>
					{items.length === 0 ? (
						<Text type="secondary">Không có sản phẩm trong đơn.</Text>
					) : (
						<div className="space-y-3">
							{items.map((item) => {
								const quantity = Number(item?.quantity) || 0;
								const price = Number(item?.price) || 0;
								const lineTotal = price * quantity;
									const review = item?.myReview;
									const reviewed = Boolean(review && Number(review.rating) >= 1);
									const ratingValue = Math.max(0, Math.min(5, Number(review?.rating) || 0));
									const commentValue = String(review?.comment || "").trim();
								return (
									<div key={item.id} className="flex items-start justify-between gap-3">
										<div className="min-w-0 flex items-start gap-3">
											<div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center overflow-hidden shrink-0">
												<img
													src={item.image || fallbackImage}
													alt={item.name}
													className="w-full h-full object-contain p-1"
													onError={(e) => {
														e.currentTarget.onerror = null;
														e.currentTarget.src = fallbackImage;
													}}
												/>
											</div>
											<div className="min-w-0">
												<div className="font-medium truncate flex items-center gap-2">
													<span className="truncate">{item.name}</span>
													{reviewed ? <Tag color="green">Đã đánh giá</Tag> : null}
												</div>
												<Text type="secondary">
													Đơn giá: {formatVnd(price)} • Số lượng: {quantity}
												</Text>
												{reviewed ? (
													<div className="mt-1">
														<div className="flex items-center gap-2">
															<Rate allowHalf={false} disabled value={ratingValue} />
															<Text type="secondary">{ratingValue}/5</Text>
														</div>
														<Text type="secondary">
															Bình luận: {commentValue || "-"}
														</Text>
													</div>
												) : null}
											</div>
										</div>
										<div className="whitespace-nowrap text-right">
											<div className="font-medium">{formatVnd(lineTotal)}</div>
											<Text type="secondary">Thành tiền</Text>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</Card>

				<Card bordered={false} className="shadow-sm">
					<div className="flex items-center justify-between">
						<Text type="secondary">Tạm tính</Text>
						<Text className="font-medium">{formatVnd(totals.itemsSubtotal)}</Text>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<Text type="secondary">Giảm giá</Text>
						<Text className="font-medium">-{formatVnd(totals.discount)}</Text>
					</div>
					<div className="mt-3 pt-3 border-t flex items-center justify-between">
						<Text strong>Tổng tiền</Text>
						<Text strong className="text-blue-800">
							{formatVnd(totals.total)}
						</Text>
					</div>
					<div className="mt-4 flex justify-end">
						<Link to="/order-history" className="hover:no-underline">
							<Button>Quay lại</Button>
						</Link>
					</div>
				</Card>
			</Space>
		</div>
	);
}
