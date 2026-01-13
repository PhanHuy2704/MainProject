import axios from "axios";

import { getToken } from "../utils/authStorage";

const baseURL = import.meta.env.DEV
	? ""
	: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const http = axios.create({
	baseURL,
});

http.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default http;
