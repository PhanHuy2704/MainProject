import React from "react";

import { OrderService } from "../../service/OrderService";
import { ProductService } from "../../service/ProductService";
import { ReviewService } from "../../service/ReviewService";
import { useAuth } from "./useAuth";
import { formatDateTimeVi } from "../../utils/formatters";
import { mapOrderStatusToVi, mapPaymentMethodToVi } from "../../utils/orderMappings";

export function useOrderHistory({ userId, enabled = true, onAuthRequired }) {
	const { token } = useAuth();
	const mountedRef = React.useRef(true);
	const [orders, setOrders] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(Boolean(enabled));
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const load = React.useCallback(async () => {
		if (!enabled) return;

		if (!token) {
			onAuthRequired?.({ reason: "missing_token" });
			if (mountedRef.current) {
				setOrders([]);
				setIsLoading(false);
			}
			return;
		}

		if (mountedRef.current) {
			setIsLoading(true);
			setError(null);
		}

		try {
			const [rawOrders, products] = await Promise.all([
				OrderService.getAll(),
				ProductService.getAll(),
			]);

			const productById = new Map(
				(Array.isArray(products) ? products : []).map((p) => [String(p.id), p])
			);

			const withDetails = await Promise.all(
				(Array.isArray(rawOrders) ? rawOrders : []).map(async (o) => {
					const details = await OrderService.getDetails(o.id);
					const items = (Array.isArray(details) ? details : []).map((d) => {
						const p = d?.productId != null ? productById.get(String(d.productId)) : null;
						return {
							id: d?.orderDetailId,
							productId: d?.productId,
							name: p?.name || `Sản phẩm #${d?.productId ?? ""}`,
							image: p?.image,
							price: d?.unitPrice,
							quantity: d?.quantity,
							myReview: null,
						};
					});

					return {
						...o,
						createdAt: formatDateTimeVi(o?.createdAt),
						status: mapOrderStatusToVi(o?.status),
						paymentMethod: mapPaymentMethodToVi(o?.paymentMethod),
						items,
					};
				})
			);

			const uniqueProductIds = Array.from(
				new Set(
					withDetails
						.flatMap((o) => (Array.isArray(o.items) ? o.items : []))
						.map((it) => it?.productId)
						.filter((id) => id != null)
						.map((id) => String(id))
				)
			);

			const reviewLists = await Promise.all(
				uniqueProductIds.map(async (pid) => {
					try {
						const list = await ReviewService.getByProductId(pid);
						return [pid, Array.isArray(list) ? list : []];
					} catch {
						return [pid, []];
					}
				})
			);

			const myReviewByProductId = new Map();
			reviewLists.forEach(([pid, list]) => {
				if (!userId) return;
				const mine = list.find((r) => String(r?.userId) === String(userId)) || null;
				if (mine) myReviewByProductId.set(String(pid), mine);
			});

			const enrichedOrders = withDetails.map((o) => ({
				...o,
				items: (Array.isArray(o.items) ? o.items : []).map((it) => ({
					...it,
					myReview:
						it?.productId != null
							? myReviewByProductId.get(String(it.productId)) || null
							: null,
				})),
			}));

			if (mountedRef.current) setOrders(enrichedOrders);
		} catch (err) {
			if (mountedRef.current) {
				setOrders([]);
				setError(err);
			}
			if (err?.response?.status === 401) {
				onAuthRequired?.({ reason: "unauthorized", error: err });
			}
		} finally {
			if (mountedRef.current) setIsLoading(false);
		}
	}, [enabled, userId, onAuthRequired, token]);

	React.useEffect(() => {
		load();
	}, [load]);

	const cancelOrder = React.useCallback(async (orderId) => {
		await OrderService.update(orderId, { status: "CANCELED" });
		setOrders((prev) =>
			prev.map((o) =>
				String(o?.id) === String(orderId) ? { ...o, status: mapOrderStatusToVi("CANCELED") } : o
			)
		);
	}, []);

	const saveReviews = React.useCallback(
		async ({ orderId, userId: reviewerId, items }) => {
			if (!reviewerId) throw new Error("Missing userId");

			const safeItems = Array.isArray(items) ? items : [];
			const results = await Promise.all(
				safeItems.map(async (it) => {
					const payload = {
						productId: it?.productId,
						userId: reviewerId,
						rating: Number(it?.rating) || 0,
						comment: String(it?.comment || ""),
					};

					if (it?.reviewId) {
						return ReviewService.update(it.reviewId, payload);
					}
					return ReviewService.create(payload);
				})
			);

			setOrders((prev) =>
				prev.map((o) => {
					if (String(o?.id) !== String(orderId)) return o;
					const byProduct = new Map(results.map((r) => [String(r?.productId), r]));
					return {
						...o,
						items: (Array.isArray(o.items) ? o.items : []).map((oldItem) => ({
							...oldItem,
							myReview:
								oldItem?.productId != null
									? byProduct.get(String(oldItem.productId)) || oldItem.myReview
									: oldItem.myReview,
						})),
					};
				})
			);

			return results;
		},
		[]
	);

	return {
		orders,
		isLoading,
		error,
		reload: load,
		cancelOrder,
		saveReviews,
	};
}
