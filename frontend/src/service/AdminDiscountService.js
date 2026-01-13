import http from "./http";

async function getAll() {
	const res = await http.get("/api/admin/discounts");
	return res.data;
}

async function create(payload) {
	const res = await http.post("/api/admin/discounts", payload);
	return res.data;
}

async function update(id, payload) {
	const res = await http.put(`/api/admin/discounts/${id}`, payload);
	return res.data;
}

async function remove(id) {
	await http.delete(`/api/admin/discounts/${id}`);
	return true;
}

export const AdminDiscountService = {
	getAll,
	create,
	update,
	remove,
};
