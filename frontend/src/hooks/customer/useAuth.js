import React from "react";

import { clearAuth, getToken, getUser, setToken, setUser } from "../../utils/authStorage";

const AUTH_CHANGED_EVENT = "auth-changed";

function readAuthSnapshot() {
	return {
		token: getToken(),
		user: getUser(),
	};
}

export function useAuth() {
	const [snapshot, setSnapshot] = React.useState(() => readAuthSnapshot());

	const reload = React.useCallback(() => {
		setSnapshot(readAuthSnapshot());
	}, []);

	React.useEffect(() => {
		const onStorage = (e) => {
			if (!e) return;
			if (e.storageArea !== window.localStorage) return;
			if (e.key !== "token" && e.key !== "user") return;
			reload();
		};
		const onAuthChanged = () => reload();

		window.addEventListener("storage", onStorage);
		window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
		return () => {
			window.removeEventListener("storage", onStorage);
			window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
		};
	}, [reload]);

	const updateToken = React.useCallback(
		(nextToken) => {
			if (!nextToken) return;
			setToken(nextToken);
			reload();
		},
		[reload]
	);

	const updateUser = React.useCallback(
		(nextUser) => {
			if (!nextUser) return;
			setUser(nextUser);
			reload();
		},
		[reload]
	);

	const logout = React.useCallback(() => {
		clearAuth();
		reload();
	}, [reload]);

	return {
		token: snapshot.token,
		user: snapshot.user,
		isAuthenticated: Boolean(snapshot.token),
		setToken: updateToken,
		setUser: updateUser,
		logout,
		reload,
	};
}

export const authEvents = {
	AUTH_CHANGED_EVENT,
};
