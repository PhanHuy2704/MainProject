import React from "react";

import {
	addToCart as addToCartStorage,
	getCartTotals,
	readCartCoupon,
	readCartItems,
	removeCartItemById,
	updateCartItemQuantityById,
	writeCartCoupon,
	writeCartItems,
} from "../../utils/cartStorage";

const CART_CHANGED_EVENT = "cart-changed";

function readCartSnapshot() {
	const items = readCartItems();
	const coupon = readCartCoupon();
	return { items, coupon };
}

export function useCart() {
	const [{ items, coupon }, setSnapshot] = React.useState(() => readCartSnapshot());

	const reload = React.useCallback(() => {
		setSnapshot(readCartSnapshot());
	}, []);

	React.useEffect(() => {
		const onStorage = (e) => {
			if (!e) return;
			if (e.storageArea !== window.localStorage) return;
			if (e.key !== "cartItems" && e.key !== "cartCoupon") return;
			reload();
		};
		const onCartChanged = () => reload();

		window.addEventListener("storage", onStorage);
		window.addEventListener(CART_CHANGED_EVENT, onCartChanged);
		return () => {
			window.removeEventListener("storage", onStorage);
			window.removeEventListener(CART_CHANGED_EVENT, onCartChanged);
		};
	}, [reload]);

	const totals = React.useMemo(() => getCartTotals(items), [items]);

	const addToCart = React.useCallback(
		(product, quantity = 1) => {
			const next = addToCartStorage(product, quantity);
			setSnapshot((prev) => ({ ...prev, items: next }));
			return next;
		},
		[]
	);

	const updateQuantity = React.useCallback((id, nextQuantity) => {
		const next = updateCartItemQuantityById(id, nextQuantity);
		setSnapshot((prev) => ({ ...prev, items: next }));
		return next;
	}, []);

	const removeItem = React.useCallback((id) => {
		const next = removeCartItemById(id);
		setSnapshot((prev) => ({ ...prev, items: next }));
		return next;
	}, []);

	const clearCart = React.useCallback(() => {
		writeCartItems([]);
		reload();
	}, [reload]);

	const setCoupon = React.useCallback(
		(nextCoupon) => {
			writeCartCoupon(nextCoupon);
			reload();
		},
		[reload]
	);

	const clearCoupon = React.useCallback(() => {
		writeCartCoupon(null);
		reload();
	}, [reload]);

	return {
		items,
		coupon,
		totals,
		addToCart,
		updateQuantity,
		removeItem,
		clearCart,
		setCoupon,
		clearCoupon,
		reload,
	};
}

export const cartEvents = {
	CART_CHANGED_EVENT,
};
