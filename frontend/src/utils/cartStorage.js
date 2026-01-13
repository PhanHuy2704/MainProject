const CART_KEY = "cartItems";
const COUPON_KEY = "cartCoupon";

const CART_CHANGED_EVENT = "cart-changed";

function notifyCartChanged() {
	try {
		if (typeof window === "undefined") return;
		window.dispatchEvent(new Event(CART_CHANGED_EVENT));
	} catch {
		// ignore
	}
}

export function safeParseJson(value, fallback) {
	try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
}

export function readCartItems() {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(CART_KEY);
	const parsed = safeParseJson(raw, []);
	const items = Array.isArray(parsed) ? parsed : [];

	return items.map((it) => {
		const legacyStock = it?.stockLeft;
		const stock = it?.stock ?? legacyStock;
		const { stockLeft: _stockLeft, ...rest } = it || {};
		return { ...rest, stock };
	});
}

export function writeCartItems(items) {
	if (typeof window === "undefined") return;
	const safeItems = Array.isArray(items) ? items : [];
	window.localStorage.setItem(CART_KEY, JSON.stringify(safeItems));
	notifyCartChanged();
}

export function readCartCoupon() {
	if (typeof window === "undefined") return null;
	const raw = window.localStorage.getItem(COUPON_KEY);
	const parsed = safeParseJson(raw, null);
	if (!parsed || typeof parsed !== "object") return null;
	const code = typeof parsed.code === "string" ? parsed.code : "";
	const type = typeof parsed.type === "string" ? parsed.type : null;
	const value = parsed.value;
	if (!code) return null;
	return { code, type, value };
}

export function writeCartCoupon(coupon) {
	if (typeof window === "undefined") return;
	if (!coupon) {
		window.localStorage.removeItem(COUPON_KEY);
		notifyCartChanged();
		return;
	}
	window.localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
	notifyCartChanged();
}

export function clearCartStorage() {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(CART_KEY);
		window.localStorage.removeItem(COUPON_KEY);
	} finally {
		notifyCartChanged();
	}
}

export function getCartTotals(items) {
	const safeItems = Array.isArray(items) ? items : [];
	const itemCount = safeItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
	const total = safeItems.reduce((sum, item) => {
		const price = Number(item.price) || 0;
		const quantity = Number(item.quantity) || 0;
		return sum + price * quantity;
	}, 0);

	return { itemCount, total };
}

export function clampQuantity(item, nextQuantity) {
	const stock = Number(item?.stock ?? item?.stockLeft);
	const minQ = 1;
	const maxQ = Number.isFinite(stock) && stock > 0 ? stock : Number.POSITIVE_INFINITY;
	const parsed = Number(nextQuantity);
	const safe = Number.isFinite(parsed) ? parsed : minQ;
	return Math.max(minQ, Math.min(safe, maxQ));
}

export function productToCartItem(product, quantity) {
	const productId = product?.id;
	return {
		id: `cart-${productId}`,
		productId,
		name: product?.name,
		price: product?.price,
		image: product?.image,
		category: product?.category,
		brand: product?.brand,
		status: product?.status,
		stock: product?.stock ?? product?.stockLeft,
		quantity: clampQuantity({ stock: product?.stock ?? product?.stockLeft }, quantity),
	};
}

export function addToCart(product, quantity = 1) {
	const items = readCartItems();
	const productId = product?.id;
	if (productId === undefined || productId === null) return items;

	const existingIndex = items.findIndex((it) => String(it?.productId) === String(productId));
	let next;

	if (existingIndex >= 0) {
		next = items.map((it, idx) => {
			if (idx !== existingIndex) return it;
			const merged = { ...it, ...productToCartItem(product, it.quantity) };
			return { ...merged, quantity: clampQuantity(merged, (Number(it.quantity) || 0) + quantity) };
		});
	} else {
		next = [...items, productToCartItem(product, quantity)];
	}

	writeCartItems(next);
	return next;
}

export function updateCartItemQuantityById(id, nextQuantity) {
	const items = readCartItems();
	const next = items.map((it) => {
		if (String(it?.id) !== String(id)) return it;
		return { ...it, quantity: clampQuantity(it, nextQuantity) };
	});
	writeCartItems(next);
	return next;
}

export function removeCartItemById(id) {
	const items = readCartItems();
	const next = items.filter((it) => String(it?.id) !== String(id));
	writeCartItems(next);
	return next;
}
