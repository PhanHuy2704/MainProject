const TOKEN_KEY = "token";
const USER_KEY = "user";

const AUTH_CHANGED_EVENT = "auth-changed";

function notifyAuthChanged() {
	try {
		if (typeof window === "undefined") return;
		window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
	} catch {
		// ignore
	}
}

export function getToken() {
	try {
		return window.localStorage.getItem(TOKEN_KEY);
	} catch {
		return null;
	}
}

export function setToken(token) {
	try {
		if (!token) return;
		window.localStorage.setItem(TOKEN_KEY, String(token));
		notifyAuthChanged();
	} catch {
		// ignore
	}
}

export function clearToken() {
	try {
		window.localStorage.removeItem(TOKEN_KEY);
		notifyAuthChanged();
	} catch {
		// ignore
	}
}

export function getUser() {
	try {
		const raw = window.localStorage.getItem(USER_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function setUser(user) {
	try {
		if (!user) return;
		window.localStorage.setItem(USER_KEY, JSON.stringify(user));
		notifyAuthChanged();
	} catch {
		// ignore
	}
}

export function clearUser() {
	try {
		window.localStorage.removeItem(USER_KEY);
		notifyAuthChanged();
	} catch {
		// ignore
	}
}

export function clearAuth() {
	clearToken();
	clearUser();
	notifyAuthChanged();
}

export const authStorageKeys = {
	TOKEN_KEY,
	USER_KEY,
};
