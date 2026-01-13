import http from "./http";

async function getAll() {
	const res = await http.get("/api/admin/brands");
	return res.data;
}

async function create(payload) {
	const res = await http.post("/api/admin/brands", payload);
	return res.data;
}

async function update(id, payload) {
	const res = await http.put(`/api/admin/brands/${id}`, payload);
	return res.data;
}

async function remove(id) {
	await http.delete(`/api/admin/brands/${id}`);
	return true;
}

export const AdminBrandService = {
	getAll,
	create,
	update,
	remove,
};
