import http from "./http";

async function getAll() {
	const res = await http.get("/api/admin/products");
	return res.data;
}

async function create(payload) {
	const res = await http.post("/api/admin/products", payload);
	return res.data;
}

async function update(id, payload) {
	const res = await http.put(`/api/admin/products/${id}`, payload);
	return res.data;
}

async function remove(id) {
	await http.delete(`/api/admin/products/${id}`);
	return true;
}

export const AdminProductService = {
	getAll,
	create,
	update,
	remove,
};
