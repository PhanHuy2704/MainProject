import React from "react";
import { Button, Card, Form, Input, Modal, Rate, Space, Tag, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useOrderHistory } from "../../../hooks/customer/useOrderHistory";
import { useAuth } from "../../../hooks/customer/useAuth";
import { formatDateTimeVi, formatVnd } from "../../../utils/formatters";

const { Title, Text } = Typography;

const getOrderTotals = (order) => {
	const items = Array.isArray(order?.items) ? order.items : [];
	const itemCount = items.reduce((sum, it) => sum + (Number(it?.quantity) || 0), 0);
	const total = items.reduce(
		(sum, it) => sum + (Number(it?.price) || 0) * (Number(it?.quantity) || 0),
		0
	);
	return { itemCount, total };
};


const isOrderFullyReviewed = (order) => {
	const items = Array.isArray(order?.items) ? order.items : [];
	if (items.length === 0) return false;
	return items.every((it) => Boolean(it?.myReview && Number(it.myReview.rating) >= 1));
};

export default function OrderHistory() {
	const navigate = useNavigate();
	const fallbackImage = "/assets/images/logo.svg";
	const [searchInput, setSearchInput] = React.useState("");
	const [appliedSearch, setAppliedSearch] = React.useState("");
	const [isReviewOpen, setIsReviewOpen] = React.useState(false);
	const [reviewOrder, setReviewOrder] = React.useState(null);
	const [reviewForm] = Form.useForm();
	const { user } = useAuth();
	const userId = user?.id;

	const onAuthRequired = React.useCallback(
		({ reason, error }) => {
			if (reason === "missing_token") {
				message.info("Vui lòng đăng nhập để xem lịch sử đơn hàng");
			} else if (error?.response?.status === 401) {
				message.info("Phiên đăng nhập đã hết hạn");
			} else {
				message.info("Vui lòng đăng nhập");
			}
			navigate("/auth");
		},
		[navigate]
	);

	const {
		orders,
		isLoading,
		cancelOrder: cancelOrderApi,
		saveReviews,
	} = useOrderHistory({ userId, enabled: true, onAuthRequired });

	const normalizedSearch = appliedSearch.trim().toLowerCase();
	const filteredOrders = React.useMemo(() => {
		if (!normalizedSearch) return orders;
		return orders.filter((order) => {
			const code = String(order?.code || "").toLowerCase();
			if (code.includes(normalizedSearch)) return true;
			const items = Array.isArray(order?.items) ? order.items : [];
			return items.some((it) => String(it?.name || "").toLowerCase().includes(normalizedSearch));
		});
	}, [orders, normalizedSearch]);

	const isCompletedOrder = (order) => String(order?.status || "").toLowerCase() === "hoàn thành";
	const isCancelledOrder = (order) => String(order?.status || "").toLowerCase() === "đã hủy";

	const cancelOrder = (order) => {
		Modal.confirm({
			title: "Xác nhận hủy đơn hàng",
			content: `Bạn có chắc muốn hủy đơn ${order?.code || ""} không?`,
			okText: "Hủy đơn",
			okButtonProps: { danger: true },
			cancelText: "Không",
			onOk: async () => {
				try {
					await cancelOrderApi(order?.id);
					message.success("Đã hủy đơn hàng");
				} catch {
					message.error("Hủy đơn thất bại. Vui lòng thử lại.");
				}
			},
		});
	};

	const openReviewModal = (order) => {
		setReviewOrder(order);
		setIsReviewOpen(true);
		const items = Array.isArray(order?.items) ? order.items : [];
		reviewForm.setFieldsValue({
			items: items.map((it) => ({
				id: it?.id,
				productId: it?.productId,
				reviewId: it?.myReview?.id,
				name: it?.name,
				rating: Number(it?.myReview?.rating) || 5,
				comment: String(it?.myReview?.comment || ""),
			})),
		});
	};

	const goToOrderDetail = (order) => {
		navigate(`/order-history/${order?.id}`);
	};

	const submitReview = async () => {
		const values = await reviewForm.validateFields();
		const items = Array.isArray(values?.items) ? values.items : [];
		if (!userId) {
			message.warning("Bạn cần đăng nhập để đánh giá.");
			return;
		}

		try {
			await saveReviews({ orderId: reviewOrder?.id, userId, items });

			message.success("Đã gửi đánh giá");
			setIsReviewOpen(false);
			setReviewOrder(null);
			reviewForm.resetFields();
		} catch {
			message.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
		}
	};

	return (
		<div className="container mx-auto px-4 py-10">
			<Space direction="vertical" size="large" className="w-full">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div>
						<Title level={2} className="!mb-1">
							Lịch sử đơn hàng
						</Title>
						<Text type="secondary">Danh sách đơn hàng của bạn.</Text>
					</div>
					<Space wrap>
						<Input
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onPressEnter={() => setAppliedSearch(searchInput)}
							placeholder="Tìm theo mã đơn hoặc tên sản phẩm"
							className="w-64"
							allowClear
						/>
						<Button
							icon={<SearchOutlined />}
							onClick={() => setAppliedSearch(searchInput)}
							aria-label="Tìm kiếm đơn hàng"
						/>
						<Link to="/products" className="hover:no-underline">
							<Button type="primary">Tiếp tục mua sắm</Button>
						</Link>
						<Link to="/profile" className="hover:no-underline">
							<Button>Về trang tài khoản</Button>
						</Link>
					</Space>
				</div>

				{isLoading ? (
						<Card variant="borderless" className="shadow-sm">
						<Text type="secondary">Đang tải dữ liệu...</Text>
					</Card>
				) : filteredOrders.length === 0 ? (
						<Card variant="borderless" className="shadow-sm">
						<Text type="secondary">Không có đơn hàng phù hợp.</Text>
					</Card>
				) : (
					<div className="space-y-4">
						{filteredOrders.map((order) => {
							const totals = getOrderTotals(order);
							const isCompleted = isCompletedOrder(order);
							const isCancelled = isCancelledOrder(order);
							const isReviewed = isCompleted && isOrderFullyReviewed(order);
							return (
								<Card
									key={order.id}
									hoverable
									className="shadow-sm cursor-pointer"
									variant="borderless"
									onClick={() => goToOrderDetail(order)}
									title={
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
											<div className="font-medium">{order.code}</div>
											<Text type="secondary">
												{formatDateTimeVi(order.createdAt)} • {order.status}
											</Text>
										</div>
									}
								>
									<div className="space-y-2">
										{Array.isArray(order.items) && order.items.length > 0 ? (
											<div className="space-y-2">
												{order.items.map((item) => (
													<div
														key={item.id}
														className="flex items-start justify-between gap-3"
													>
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
																			
																		</div>
																<Text type="secondary">
																	{formatVnd(item.price)} × {item.quantity}
																</Text>
															</div>
														</div>
														<div className="whitespace-nowrap">
															<Text>
																{formatVnd(
																	(Number(item.price) || 0) * (Number(item.quantity) || 0)
																)}
															</Text>
														</div>
													</div>
												))}
											</div>
										) : (
											<Text type="secondary">Không có sản phẩm trong đơn (mock).</Text>
										)}

										<div className="pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
											<Text type="secondary">
												{totals.itemCount} sản phẩm • {order.paymentMethod}
											</Text>
											<div className="flex items-center gap-2">
												<div className="font-semibold">Tổng: {formatVnd(totals.total)}</div>
												{isCompleted ? (
													<Button
														disabled={isReviewed}
														onClick={(e) => {
														e.stopPropagation();
														if (!isReviewed) openReviewModal(order);
													}}
													>
														{isReviewed ? "Đã đánh giá" : "Đánh giá"}
													</Button>
												) : isCancelled ? null : (
													<Button
														danger
														onClick={(e) => {
														e.stopPropagation();
														cancelOrder(order);
													}}
													>
														Hủy
													</Button>
												)}
											</div>
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				)}
			</Space>

			<Modal
				open={isReviewOpen}
				title={`Đánh giá đơn hàng ${reviewOrder?.code || ""}`}
				onCancel={() => {
					setIsReviewOpen(false);
					setReviewOrder(null);
					reviewForm.resetFields();
				}}
				onOk={submitReview}
				okText="Gửi đánh giá"
				cancelText="Đóng"
				destroyOnHidden
				width={720}
			>
				<Form form={reviewForm} layout="vertical">
					<Form.List name="items">
						{(fields) => (
							<div className="space-y-4">
								{fields.map((field, idx) => {
									const item = Array.isArray(reviewOrder?.items) ? reviewOrder.items[idx] : null;
									return (
										<Card key={field.key} size="small" bordered className="shadow-sm">
											<div className="font-medium mb-3">{item?.name || `Sản phẩm #${idx + 1}`}</div>
											<Form.Item
												name={[field.name, "rating"]}
												label="Đánh giá"
												rules={[{ required: true, message: "Vui lòng đánh giá số sao" }]}
											>
												<Rate allowClear={false} />
											</Form.Item>
											<Form.Item
												name={[field.name, "comment"]}
												label="Bình luận"
											>
												<Input.TextArea rows={3} placeholder="Nhập bình luận..." />
											</Form.Item>
										</Card>
									);
								})}
							</div>
						)}
					</Form.List>
				</Form>
			</Modal>
		</div>
	);
}
