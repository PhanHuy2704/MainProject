import http from "./http";

async function getAll() {
	const res = await http.get("/api/orders");
	return res.data;
}

async function getById(id) {
	const res = await http.get(`/api/orders/${id}`);
	return res.data;
}

async function getDetails(orderId) {
	const res = await http.get(`/api/orders/${orderId}/details`);
	return res.data;
}

async function update(id, payload) {
	const res = await http.put(`/api/orders/${id}`, payload);
	return res.data;
}

async function checkout(payload) {
	const res = await http.post("/api/orders/checkout", payload);
	return res.data;
}

export const OrderService = {
	getAll,
	getById,
	getDetails,
	update,
	checkout,
};
