import http from "./http";

async function getAll() {
	const res = await http.get("/api/categories");
	return res.data;
}

async function getById(id) {
	const res = await http.get(`/api/categories/${id}`);
	return res.data;
}

export const CategoryService = {
	getAll,
	getById,
};
