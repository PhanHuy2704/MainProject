import http from "./http";

async function getAll() {
	const res = await http.get("/api/admin/users");
	return res.data;
}

async function getById(id) {
	const res = await http.get(`/api/admin/users/${id}`);
	return res.data;
}


async function update(id, data) {
	const res = await http.put(`/api/admin/users/${id}`, data);
	return res.data;
}

async function remove(id) {
	await http.delete(`/api/admin/users/${id}`);
	return true;
}

export const AdminUserService = {
	getAll,
	getById,
	update,
	remove,
};
