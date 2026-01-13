export const mapOrderStatusToVi = (status) => {
	const key = String(status || "").toUpperCase();
	switch (key) {
		case "CREATED":
			return "Đã tạo";
		case "SHIPPING":
			return "Đang giao";
		case "COMPLETED":
			return "Hoàn thành";
		case "CANCELED":
			return "Đã hủy";
		default:
			return status ? String(status) : "-";
	}
};

export const mapPaymentMethodToVi = (method) => {
	const key = String(method || "").toUpperCase();
	switch (key) {
		case "BANK_TRANSFER":
			return "Chuyển khoản";
		case "CASH":
			return "Tiền mặt";
		default:
			return method ? String(method) : "-";
	}
};
