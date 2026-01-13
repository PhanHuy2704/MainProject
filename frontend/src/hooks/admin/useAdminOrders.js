import React from "react";

import { AdminOrderService } from "../../service/AdminOrderService";
import { AdminProductService } from "../../service/AdminProductService";
import { AdminUserService } from "../../service/AdminUserService";
import { parseDateTimeAny } from "../../utils/formatters";

const sortByCreatedAtDesc = (list) => {
	const safe = Array.isArray(list) ? list : [];
	const toMs = (v) => {
		const d = parseDateTimeAny(v);
		return d ? d.getTime() : 0;
	};
	return [...safe].sort((a, b) => {
		const diff = toMs(b?.createdAt) - toMs(a?.createdAt);
		if (diff !== 0) return diff;
		return (Number(b?.id) || 0) - (Number(a?.id) || 0);
	});
};

export function useAdminOrders() {
	const mountedRef = React.useRef(true);
	const [customers, setCustomers] = React.useState([]);
	const [products, setProducts] = React.useState([]);
	const [items, setItems] = React.useState([]);
	const [detailsByOrderId, setDetailsByOrderId] = React.useState({});
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const reload = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [customerList, productList, orderList] = await Promise.all([
				AdminUserService.getAll(),
				AdminProductService.getAll(),
				AdminOrderService.getAll(),
			]);

			const orders = sortByCreatedAtDesc(orderList);

			const results = await Promise.allSettled(
				orders.map(async (o) => ({ orderId: o.id, details: await AdminOrderService.getDetails(o.id) }))
			);
			const nextMap = {};
			results.forEach((r) => {
				if (r.status === "fulfilled") {
					nextMap[r.value.orderId] = Array.isArray(r.value.details) ? r.value.details : [];
				}
			});

			if (mountedRef.current) {
				setCustomers(Array.isArray(customerList) ? customerList : []);
				setProducts(Array.isArray(productList) ? productList : []);
				setItems(orders);
				setDetailsByOrderId(nextMap);
			}
		} catch (e) {
			if (mountedRef.current) {
				setCustomers([]);
				setProducts([]);
				setItems([]);
				setDetailsByOrderId({});
				setError(e);
			}
			throw e;
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		reload().catch(() => {});
	}, [reload]);

	const loadDetails = React.useCallback(async (orderId) => {
		const details = await AdminOrderService.getDetails(orderId);
		if (mountedRef.current) {
			setDetailsByOrderId((prev) => ({
				...prev,
				[orderId]: Array.isArray(details) ? details : [],
			}));
		}
		return Array.isArray(details) ? details : [];
	}, []);

	const save = React.useCallback(
		async ({ editingId, values }) => {
			const productById = new Map((Array.isArray(products) ? products : []).map((p) => [p.id, p]));

			const normalizedItems = (Array.isArray(values?.items) ? values.items : [])
				.filter((it) => it?.productId)
				.map((it) => {
					const product = productById.get(it.productId);
					const unitPrice = Number(it?.price) || Number(product?.price) || 0;
					return {
						id: it?.id,
						productId: it.productId,
						quantity: Number(it?.quantity) || 0,
						unitPrice,
					};
				});

			const subtotal = normalizedItems.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
			const discountAmount = Number(values?.discount) || 0;
			const finalPrice = Math.max(0, subtotal - discountAmount);

			const orderPayload = {
				code: values?.code,
				userId: values?.customerId,
				status: values?.status,
				receiverName: values?.receiverName,
				receiverPhone: values?.receiverPhone,
				shippingAddress: values?.shippingAddress,
				paymentMethod: values?.paymentMethod,
				finalPrice,
				discountId: null,
			};

			if (editingId != null) {
				await AdminOrderService.update(editingId, orderPayload);

				const existingDetails =
					detailsByOrderId?.[editingId] || (await AdminOrderService.getDetails(editingId));
				const existingIds = new Set(
					(Array.isArray(existingDetails) ? existingDetails : []).map((d) => d?.id ?? d?.orderDetailId)
				);
				const currentIds = new Set(normalizedItems.filter((i) => i.id != null).map((i) => i.id));

				await Promise.all(
					normalizedItems.map((it) => {
						const detailPayload = {
							productId: it.productId,
							quantity: it.quantity,
							unitPrice: it.unitPrice,
						};
						return it.id != null
							? AdminOrderService.updateDetail(it.id, detailPayload)
							: AdminOrderService.createDetail(editingId, detailPayload);
					})
				);

				const toDelete = [];
				existingIds.forEach((id) => {
					if (!currentIds.has(id)) toDelete.push(id);
				});
				if (toDelete.length) {
					await Promise.all(toDelete.map((id) => AdminOrderService.removeDetail(id)));
				}
			} else {
				const created = await AdminOrderService.create(orderPayload);
				await Promise.all(
					normalizedItems.map((it) =>
						AdminOrderService.createDetail(created.id, {
							productId: it.productId,
							quantity: it.quantity,
							unitPrice: it.unitPrice,
						})
					)
				);
			}

			await reload();
		},
		[products, detailsByOrderId, reload]
	);

	const remove = React.useCallback(
		async (id) => {
			await AdminOrderService.remove(id);
			await reload();
		},
		[reload]
	);

	return {
		customers,
		products,
		items,
		detailsByOrderId,
		loading,
		error,
		reload,
		loadDetails,
		save,
		remove,
	};
}
