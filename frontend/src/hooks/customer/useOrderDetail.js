import React from "react";

import { OrderService } from "../../service/OrderService";
import { ProductService } from "../../service/ProductService";
import { ReviewService } from "../../service/ReviewService";
import { useAuth } from "./useAuth";
import { formatDateTimeVi } from "../../utils/formatters";
import { mapOrderStatusToVi, mapPaymentMethodToVi } from "../../utils/orderMappings";

export function useOrderDetail({
	orderId,
	userId,
	enabled = true,
	onAuthRequired,
}) {
	const { token } = useAuth();
	const mountedRef = React.useRef(true);
	const [order, setOrder] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(Boolean(enabled));
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const load = React.useCallback(async () => {
		if (!enabled || !orderId) return;

		if (!token) {
			onAuthRequired?.({ reason: "missing_token" });
			if (mountedRef.current) {
				setOrder(null);
				setIsLoading(false);
			}
			return;
		}

		if (mountedRef.current) {
			setIsLoading(true);
			setError(null);
		}

		try {
			const [rawOrder, details, products] = await Promise.all([
				OrderService.getById(orderId),
				OrderService.getDetails(orderId),
				ProductService.getAll(),
			]);

			const productById = new Map(
				(Array.isArray(products) ? products : []).map((p) => [String(p.id), p])
			);

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

			const uniqueProductIds = Array.from(
				new Set(
					items
						.map((it) => it?.productId)
						.filter((pid) => pid != null)
						.map((pid) => String(pid))
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

			const enriched = {
				...rawOrder,
				createdAt: formatDateTimeVi(rawOrder?.createdAt),
				status: mapOrderStatusToVi(rawOrder?.status),
				paymentMethod: mapPaymentMethodToVi(rawOrder?.paymentMethod),
				items: items.map((it) => ({
					...it,
					myReview:
						it?.productId != null
							? myReviewByProductId.get(String(it.productId)) || null
							: null,
				})),
			};

			if (mountedRef.current) setOrder(enriched);
		} catch (err) {
			if (mountedRef.current) {
				setOrder(null);
				setError(err);
			}
			if (err?.response?.status === 401) {
				onAuthRequired?.({ reason: "unauthorized", error: err });
			}
		} finally {
			if (mountedRef.current) setIsLoading(false);
		}
	}, [enabled, orderId, userId, onAuthRequired, token]);

	React.useEffect(() => {
		load();
	}, [load]);

	return { order, isLoading, error, reload: load };
}
