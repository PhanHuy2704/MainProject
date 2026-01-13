import http from "./http";

async function getAll() {
	const res = await http.get("/api/admin/orders");
	return res.data;
}

async function create(payload) {
	const res = await http.post("/api/admin/orders", payload);
	return res.data;
}

async function getById(id) {
	const res = await http.get(`/api/admin/orders/${id}`);
	return res.data;
}

async function update(id, payload) {
	const res = await http.put(`/api/admin/orders/${id}`, payload);
	return res.data;
}

async function remove(id) {
	await http.delete(`/api/admin/orders/${id}`);
	return true;
}

async function getDetails(orderId) {
	const res = await http.get(`/api/admin/orders/${orderId}/details`);
	const list = Array.isArray(res.data) ? res.data : [];
	return list.map((d) => ({
		...d,
		id: d?.id ?? d?.orderDetailId,
	}));
}

async function createDetail(orderId, payload) {
	const res = await http.post(`/api/admin/orders/${orderId}/details`, payload);
	return res.data;
}

async function updateDetail(id, payload) {
	const res = await http.put(`/api/admin/orders/details/${id}`, payload);
	return res.data;
}

async function removeDetail(id) {
	await http.delete(`/api/admin/orders/details/${id}`);
	return true;
}

export const AdminOrderService = {
	getAll,
	getById,
	create,
	update,
	remove,
	getDetails,
	createDetail,
	updateDetail,
	removeDetail,
};
