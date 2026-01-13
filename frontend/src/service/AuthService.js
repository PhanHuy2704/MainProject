import http from "./http";
import { clearAuth, setToken, setUser } from "../utils/authStorage";

async function register(payload) {
	const res = await http.post("/api/auth/register", payload);
	return res.data;
}

async function login(payload) {
	const res = await http.post("/api/auth/login", payload);
	const data = res.data;
	if (data?.token) setToken(data.token);
	if (data?.user) setUser(data.user);
	return data;
}

async function logout() {
	try {
		await http.post("/api/auth/logout");
	} finally {
		clearAuth();
	}
}

export const AuthService = {
	register,
	login,
	logout,
};
