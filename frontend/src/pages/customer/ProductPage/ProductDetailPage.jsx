import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
	Alert,
	Breadcrumb,
	Button,
	Card,
	Col,
	Descriptions,
	Empty,
	List,
	Rate,
	Row,
	Tag,
	Typography,
	message,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { useProductDetail } from "../../../hooks/customer/useProductDetail";
import { useAuth } from "../../../hooks/customer/useAuth";
import { useCart } from "../../../hooks/customer/useCart";
import { ReviewService } from "../../../service/ReviewService";
import { formatVnd } from "../../../utils/formatters";

const { Title, Paragraph, Text } = Typography;

const clampRating = (value) => {
	const n = Number(value);
	if (!Number.isFinite(n)) return 0;
	return Math.max(0, Math.min(5, n));
};

const aggregateReviews = (reviews) => {
	const list = Array.isArray(reviews) ? reviews : [];
	const ratings = list
		.map((r) => Number(r?.rating))
		.filter((n) => Number.isFinite(n) && n > 0);
	const reviewCount = ratings.length;
	const avg = reviewCount ? ratings.reduce((sum, n) => sum + n, 0) / reviewCount : 0;
	return { rating: clampRating(avg), reviewCount };
};

const getCategoryName = (product) => {
	return product?.category || "Đồng hồ";
};

export default function ProductDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const fallbackImage = "/assets/images/logo.svg";
	const { isAuthenticated, user } = useAuth();
	const { addToCart } = useCart();
	const [reviews, setReviews] = React.useState([]);
	const [reviewsLoading, setReviewsLoading] = React.useState(false);
	const [reviewsError, setReviewsError] = React.useState(null);
	const ratingStats = React.useMemo(() => aggregateReviews(reviews), [reviews]);
	const displayReviews = React.useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);


	const { product, isLoading, error: loadError } = useProductDetail({ productId: id, enabled: Boolean(id) });

	React.useEffect(() => {
		let cancelled = false;
		if (!id) return;

		(async () => {
			try {
				setReviewsLoading(true);
				setReviewsError(null);
				const data = await ReviewService.getByProductId(id);
				const list = Array.isArray(data) ? data : [];
				if (!cancelled) setReviews(list);
			} catch (e) {
				if (!cancelled) {
					setReviews([]);
					setReviewsError(e);
				}
			} finally {
				if (!cancelled) setReviewsLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [id]);

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
				<Alert
					message="Lỗi"
					description="Không tải được sản phẩm. Vui lòng thử lại."
					type="error"
					showIcon
				/>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Empty description="Không tìm thấy sản phẩm" />
				<div className="mt-4">
					<Link to="/products" className="hover:no-underline">
						<Button type="primary">Quay lại danh sách sản phẩm</Button>
					</Link>
				</div>
			</div>
		);
	}

	const stock = Number(product?.stock) || 0;
	const inStock = stock > 0;
	const statusText = inStock ? "Còn hàng" : "Hết hàng";
	const categoryName = getCategoryName(product);
	const soldQuantity = Number(product?.soldQuantity) || 0;
	const avgRating = ratingStats?.rating ?? 0;
	const reviewCount = ratingStats?.reviewCount ?? 0;

	return (
		<div className="container mx-auto px-4 py-8">
			<Breadcrumb className="mb-6">
				<Breadcrumb.Item>
					<Link to="/" className="hover:no-underline">
						<HomeOutlined /> Trang chủ
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link to="/products" className="hover:no-underline">
						Sản phẩm
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link to="/products" className="hover:no-underline">
						{categoryName}
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{product.name}</Breadcrumb.Item>
			</Breadcrumb>

			<Row gutter={[32, 32]} className="items-stretch">
				<Col xs={24} lg={6} className="flex">
					<Card
						bordered={false}
						className="shadow-sm w-full h-full"
						styles={{ body: { height: "100%", padding: 0 } }}
					>
						<div className="bg-gray-50 h-full flex items-center justify-center overflow-hidden">
							<img
								src={product.image || fallbackImage}
								alt={product.name}
								className="max-w-full max-h-full object-contain p-6"
								onError={(e) => {
									e.currentTarget.onerror = null;
									e.currentTarget.src = fallbackImage;
								}}
							/>
						</div>
					</Card>
				</Col>

				<Col xs={24} lg={18} className="flex">
					<Card bordered={false} className="shadow-sm w-full h-full">
						<div className="flex items-start justify-between gap-3">
							<Title level={3} className="!mb-1">
								{product.name}
							</Title>
							<Tag color={inStock ? "green" : "red"}>{statusText}</Tag>
						</div>

						{product.brand ? (
							<Text type="secondary" className="text-sm">
								Thương hiệu: {product.brand}
							</Text>
						) : (
							<Text type="secondary" className="text-sm">
								&nbsp;
							</Text>
						)}

						<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
							<Text type="secondary" className="text-sm">
								Số lượng còn lại: {stock}
							</Text>
							<Text type="secondary" className="text-sm">
								Đã bán: {soldQuantity}
							</Text>
						</div>

						<div className="mt-4">
							<Text className="text-blue-800 font-semibold" style={{ fontSize: 22 }}>
								{formatVnd(product.price)}
							</Text>
						</div>

						{product.description ? (
							<Paragraph
								type="secondary"
								className="!mt-3 !mb-0 text-sm"
								ellipsis={{ rows: 3 }}
							>
								{product.description}
							</Paragraph>
						) : null}

						<div className="mt-6 flex flex-wrap gap-2">
							{inStock ? (
								<Button
									type="primary"
									onClick={() => {
										if (!isAuthenticated) {
											message.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
											navigate("/auth");
											return;
										}
										addToCart(product, 1);
										message.success("Đã thêm vào giỏ hàng");
									}}
								>
									Thêm vào giỏ hàng
								</Button>
							) : (
								<Link to="/contact" className="hover:no-underline">
									<Button type="primary">Liên hệ</Button>
								</Link>
							)}
							<Link to="/products" className="hover:no-underline">
								<Button>Quay lại</Button>
							</Link>
						</div>
					</Card>
				</Col>
			</Row>

			<div className="mt-12">
				<Card bordered={false} className="shadow-sm">
					<Title level={4} className="!mb-2 !text-base">
						Mô tả chi tiết
					</Title>
					<Paragraph className="!mb-0 text-sm">
						{product.description || "Chưa có mô tả cho sản phẩm này."}
					</Paragraph>

					<div className="mt-6">
						<Title level={4} className="!mb-2 !text-base">
							Thông số kỹ thuật
						</Title>
						<Descriptions column={1} size="small" className="text-sm">
							<Descriptions.Item label="Danh mục">{categoryName}</Descriptions.Item>
							<Descriptions.Item label="Thương hiệu">{product.brand || "-"}</Descriptions.Item>
							<Descriptions.Item label="Tình trạng">{statusText}</Descriptions.Item>
							<Descriptions.Item label="Số lượng còn lại">
								{Number.isFinite(stock) ? stock : "-"}
							</Descriptions.Item>
							<Descriptions.Item label="Đã bán">{soldQuantity}</Descriptions.Item>
							<Descriptions.Item label="Đánh giá">
								{reviewCount ? `${avgRating.toFixed(1)}/5` : "-"}
							</Descriptions.Item>
							<Descriptions.Item label="Lượt đánh giá">
								{reviewCount}
							</Descriptions.Item>
						</Descriptions>
					</div>
				</Card>
			</div>

			<div className="mt-6">
				<Card bordered={false} className="shadow-sm">
					<Title level={4} className="!mb-2 !text-base">
						Đánh giá của khách hàng
					</Title>

					{reviewsLoading ? (
						<Text type="secondary">Đang tải đánh giá...</Text>
					) : reviewsError ? (
						<Text type="danger">Không tải được đánh giá.</Text>
					) : displayReviews.length === 0 ? (
						<Empty description="Chưa có đánh giá" />
					) : (
						<List
							itemLayout="vertical"
							dataSource={displayReviews}
							renderItem={(rv) => {
								const userName = rv?.userName || (rv?.userId != null ? `Người dùng #${rv.userId}` : "Người dùng");
								const ratingValue = Number(rv?.rating) || 0;
								return (
									<List.Item>
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<Text strong className="block truncate">
													{userName}
												</Text>
											</div>

											<Rate allowHalf disabled value={ratingValue} />
										</div>

										{rv?.comment ? (
											<Paragraph className="!mt-2 !mb-0 text-sm">{rv.comment}</Paragraph>
										) : (
											<Text type="secondary" className="text-sm">
												(Không có bình luận)
											</Text>
										)}
									</List.Item>
								);
							}}
						/>
					)}
				</Card>
			</div>
		</div>
	);
}
