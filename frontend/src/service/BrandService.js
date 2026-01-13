import http from "./http";

async function getAll() {
	const res = await http.get("/api/brands");
	return res.data;
}

async function getById(id) {
	const res = await http.get(`/api/brands/${id}`);
	return res.data;
}

export const BrandService = {
	getAll,
	getById,
};
