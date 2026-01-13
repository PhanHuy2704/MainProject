import http from "./http";

async function uploadImage(file, { folder } = {}) {
	const form = new FormData();
	form.append("file", file);
	if (folder) form.append("folder", folder);

	const res = await http.post("/api/admin/media/upload", form);
	return res.data;
}

export const AdminMediaService = {
	uploadImage,
};
