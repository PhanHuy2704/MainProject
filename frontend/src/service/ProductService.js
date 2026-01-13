import http from "./http";

async function getAll() {
	const res = await http.get("/api/products");
	return res.data;
}

async function getById(id) {
	const res = await http.get(`/api/products/${id}`);
	return res.data;
}

export const ProductService = {
	getAll,
	getById,
};
