import http from "./http";

async function getAll() {
	const res = await http.get("/api/admin/categories");
	return res.data;
}

async function create(payload) {
	const res = await http.post("/api/admin/categories", payload);
	return res.data;
}

async function update(id, payload) {
	const res = await http.put(`/api/admin/categories/${id}`, payload);
	return res.data;
}

async function remove(id) {
	await http.delete(`/api/admin/categories/${id}`);
	return true;
}

export const AdminCategoryService = {
	getAll,
	create,
	update,
	remove,
};
