import http from "./http";

async function getByProductId(productId) {
	const res = await http.get(`/api/reviews/product/${productId}`);
	return res.data;
}

async function create(payload) {
	const res = await http.post("/api/reviews", payload);
	return res.data;
}

async function update(id, payload) {
	const res = await http.put(`/api/reviews/${id}`, payload);
	return res.data;
}

export const ReviewService = {
	getByProductId,
	create,
	update,
};
