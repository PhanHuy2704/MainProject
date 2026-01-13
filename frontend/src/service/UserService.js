import http from "./http";

async function getMe() {
	const res = await http.get("/api/users/me");
	return res.data;
}

async function updateMe(payload) {
	const res = await http.put("/api/users/me", payload);
	return res.data;
}

async function changePassword(payload) {
	await http.put("/api/users/me/password", payload);
	return true;
}

export const UserService = {
	getMe,
	updateMe,
	changePassword,
};
