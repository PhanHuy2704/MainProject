// // Mock data for order history

// export const formatVnd = (value) => {
// 	const numberValue = Number(value) || 0;
// 	return new Intl.NumberFormat("vi-VN", {
// 		style: "currency",
// 		currency: "VND",
// 	}).format(numberValue);
// };

// export const getOrderTotals = (order) => {
// 	const items = Array.isArray(order?.items) ? order.items : [];
// 	const itemsSubtotal = items.reduce((sum, item) => {
// 		const price = Number(item?.price) || 0;
// 		const quantity = Number(item?.quantity) || 0;
// 		return sum + price * quantity;
// 	}, 0);

// 	const discount = Number(order?.discount) || 0;
// 	const total = Math.max(0, itemsSubtotal - discount);
// 	const itemCount = items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);

// 	return { itemsSubtotal, discount, total, itemCount };
// };

// export const mockOrders = [
// 	{
// 		id: "order-1001",
// 		code: "DH-1001",
// 		createdAt: "2025-12-24",
// 		status: "Hoàn thành",
// 		paymentMethod: "Tiền mặt",
// 		RecieverName: "Nguyễn Văn A",
// 		RecieverPhone: "0987654321",
// 		shippingAddress: "Cầu Giấy, Hà Nội",
// 		discount: 0,
// 		items: [
// 			{
// 				id: "order-1001-item-1",
// 				productId: 1,
// 				name: "Đồng hồ cơ Luxury Pro",
// 				price: 12990000,
// 				image: "/assets/images/products/watch.jpg",
// 				quantity: 1,
// 			},
// 			{
// 				id: "order-1001-item-2",
// 				productId: 4,
// 				name: "Đồng hồ Vintage Classic",
// 				price: 7490000,
// 				image: "/assets/images/products/watch.jpg",
// 				quantity: 1,
// 			},
// 		],
// 	},
// 	{
// 		id: "order-1002",
// 		code: "DH-1002",
// 		createdAt: "2025-12-25",
// 		status: "Đang giao",
// 		paymentMethod: "Chuyển khoản",
// 		RecieverName: "Trần Thị B",
// 		RecieverPhone: "0912345678",
// 		shippingAddress: "Nam Từ Liêm, Hà Nội",
// 		discount: 150000,
// 		items: [
// 			{
// 				id: "order-1002-item-1",
// 				productId: 8,
// 				name: "Đồng hồ Smart Sport",
// 				price: 3990000,
// 				image: "/assets/images/products/watch.jpg",
// 				quantity: 2,
// 			},
// 		],
// 	},
// 	{
// 		id: "order-1003",
// 		code: "DH-1003",
// 		createdAt: "2025-12-26",
// 		status: "Đang xử lý",
// 		paymentMethod: "Tiền mặt",
// 		RecieverName: "Lê Văn C",
// 		RecieverPhone: "0909123456",
// 		shippingAddress: "Hai Bà Trưng, Hà Nội",
// 		discount: 0,
// 		items: [
// 			{
// 				id: "order-1003-item-1",
// 				productId: 12,
// 				name: "Đồng hồ Minimal Black",
// 				price: 2190000,
// 				image: "/assets/images/products/watch.jpg",
// 				quantity: 1,
// 			},
// 			{
// 				id: "order-1003-item-2",
// 				productId: 3,
// 				name: "Đồng hồ Sport Chrono",
// 				price: 9590000,
// 				image: "/assets/images/products/watch.jpg",
// 				quantity: 1,
// 			},
// 		],
// 	},
// 	{
// 		id: "order-1004",
// 		code: "DH-1004",
// 		createdAt: "2025-12-20",
// 		status: "Đã hủy",
// 		paymentMethod: "Tiền mặt",
// 		RecieverName: "Phạm Thị D",
// 		RecieverPhone: "0977001122",
// 		shippingAddress: "Thanh Xuân, Hà Nội",
// 		discount: 0,
// 		items: [
// 			{
// 				id: "order-1004-item-1",
// 				productId: 6,
// 				name: "Đồng hồ Classic Leather",
// 				price: 5290000,
// 				image: "/assets/images/products/watch.jpg",
// 				quantity: 1,
// 			},
// 		],
// 	},
// 	{
// 		id: "order-1005",
// 		code: "DH-1005",
// 		createdAt: "2025-12-18",
// 		status: "Hoàn thành",
// 		paymentMethod: "Chuyển khoản",
// 		RecieverName: "Hoàng Văn E",
// 		RecieverPhone: "0933555777",
// 		shippingAddress: "Đống Đa, Hà Nội",
// 		discount: 50000,
// 		items: [
// 			{
// 				id: "order-1005-item-1",
// 				productId: 10,
// 				name: "Đồng hồ Elegant Silver",
// 				price: 6890000,
// 				image: "/assets/images/products/watch.jpg",
// 				quantity: 1,
// 			},
// 			{
// 				id: "order-1005-item-2",
// 				productId: 2,
// 				name: "Đồng hồ Automatic Premium",
// 				price: 15990000,
// 				image: "/assets/images/products/watch.jpg",
// 				quantity: 1,
// 			},
// 		],
// 	},
// ];

// export default mockOrders;
