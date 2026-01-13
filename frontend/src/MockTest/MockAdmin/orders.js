// // Mock data: Orders (admin view) (frontend-only)

// export const mockOrdersAdmin = [
//   {
//     id: "order-1001",
//     code: "DH-1001",
//     customerId: "cus-0001",
//     createdAt: "2025-12-24",
//     status: "Hoàn thành",
//     paymentMethod: "Tiền mặt",
//     receiverName: "Nguyễn Văn A",
//     receiverPhone: "0987654321",
//     shippingAddress: "Cầu Giấy, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-1001-item-1",
//         productId: "prd-0001",
//         name: "Đồng hồ cơ Luxury Pro",
//         price: 12990000,
//         quantity: 1,
//       },
//       {
//         id: "order-1001-item-2",
//         productId: "prd-0004",
//         name: "Đồng hồ Vintage Classic",
//         price: 7490000,
//         quantity: 1,
//       },
//     ],
//   },
//   // Đơn hàng 1 ngày trước
//   {
//     id: "order-2025-12-28",
//     code: "DH-2025-12-28",
//     customerId: "cus-0002",
//     createdAt: "2025-12-28",
//     status: "Hoàn thành",
//     paymentMethod: "Tiền mặt",
//     receiverName: "Nguyễn Văn G",
//     receiverPhone: "0987777777",
//     shippingAddress: "Hà Đông, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-2025-12-28-item-1",
//         productId: "prd-0002",
//         name: "Đồng hồ thể thao Active",
//         price: 8990000,
//         quantity: 1,
//       },
//     ],
//   },
//   // Đơn hàng 2 ngày trước
//   {
//     id: "order-2025-12-27",
//     code: "DH-2025-12-27",
//     customerId: "cus-0003",
//     createdAt: "2025-12-27",
//     status: "Hoàn thành",
//     paymentMethod: "Chuyển khoản",
//     receiverName: "Trần Văn H",
//     receiverPhone: "0996666666",
//     shippingAddress: "Tây Hồ, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-2025-12-27-item-1",
//         productId: "prd-0003",
//         name: "Smartwatch Pro Health",
//         price: 6990000,
//         quantity: 1,
//       },
//     ],
//   },
//   // Đơn hàng 1 tháng trước (2025-11-29)
//   {
//     id: "order-2025-11-29",
//     code: "DH-2025-11-29",
//     customerId: "cus-0001",
//     createdAt: "2025-11-29",
//     status: "Hoàn thành",
//     paymentMethod: "Tiền mặt",
//     receiverName: "Nguyễn Văn I",
//     receiverPhone: "0985555555",
//     shippingAddress: "Hai Bà Trưng, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-2025-11-29-item-1",
//         productId: "prd-0001",
//         name: "Đồng hồ cơ Luxury Pro",
//         price: 12990000,
//         quantity: 1,
//       },
//     ],
//   },
//   // Đơn hàng 2 tháng trước (2025-10-29)
//   {
//     id: "order-2025-10-29",
//     code: "DH-2025-10-29",
//     customerId: "cus-0002",
//     createdAt: "2025-10-29",
//     status: "Hoàn thành",
//     paymentMethod: "Chuyển khoản",
//     receiverName: "Trần Thị J",
//     receiverPhone: "0912223333",
//     shippingAddress: "Cầu Giấy, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-2025-10-29-item-1",
//         productId: "prd-0004",
//         name: "Đồng hồ Vintage Classic",
//         price: 7490000,
//         quantity: 1,
//       },
//     ],
//   },
//   // Đơn hàng 2 năm trước (2024-12-29)
//   {
//     id: "order-2024-12-29",
//     code: "DH-2024-12-29",
//     customerId: "cus-0003",
//     createdAt: "2024-12-29",
//     status: "Hoàn thành",
//     paymentMethod: "Tiền mặt",
//     receiverName: "Lê Văn K",
//     receiverPhone: "0904444444",
//     shippingAddress: "Long Biên, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-2024-12-29-item-1",
//         productId: "prd-0003",
//         name: "Smartwatch Pro Health",
//         price: 6990000,
//         quantity: 1,
//       },
//     ],
//   },
//   // Đơn hàng 3 năm trước (2023-12-29)
//   {
//     id: "order-2023-12-29",
//     code: "DH-2023-12-29",
//     customerId: "cus-0001",
//     createdAt: "2023-12-29",
//     status: "Hoàn thành",
//     paymentMethod: "Chuyển khoản",
//     receiverName: "Nguyễn Thị L",
//     receiverPhone: "0983333333",
//     shippingAddress: "Đống Đa, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-2023-12-29-item-1",
//         productId: "prd-0002",
//         name: "Đồng hồ thể thao Active",
//         price: 8990000,
//         quantity: 1,
//       },
//     ],
//   },
//   {
//     id: "order-1002",
//     code: "DH-1002",
//     customerId: "cus-0002",
//     createdAt: "2025-12-25",
//     status: "Đang giao",
//     paymentMethod: "Chuyển khoản",
//     receiverName: "Trần Thị B",
//     receiverPhone: "0912345678",
//     shippingAddress: "Nam Từ Liêm, Hà Nội",
//     discount: 150000,
//     items: [
//       {
//         id: "order-1002-item-1",
//         productId: "prd-0003",
//         name: "Smartwatch Pro Health",
//         price: 6990000,
//         quantity: 1,
//       },
//     ],
//   },
//   {
//     id: "order-1003",
//     code: "DH-1003",
//     customerId: "cus-0003",
//     createdAt: "2025-12-26",
//     status: "Đang xử lý",
//     paymentMethod: "Tiền mặt",
//     receiverName: "Lê Văn C",
//     receiverPhone: "0909123456",
//     shippingAddress: "Hai Bà Trưng, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-1003-item-1",
//         productId: "prd-0002",
//         name: "Đồng hồ thể thao Active",
//         price: 8990000,
//         quantity: 2,
//       },
//     ],
//   },
//   // Đơn hàng hôm nay (gần nhất)
//   {
//     id: "order-2025-12-29",
//     code: "DH-2025-12-29",
//     customerId: "cus-0001",
//     createdAt: "2025-12-29",
//     status: "Hoàn thành",
//     paymentMethod: "Tiền mặt",
//     receiverName: "Nguyễn Văn D",
//     receiverPhone: "0988888888",
//     shippingAddress: "Ba Đình, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-2025-12-29-item-1",
//         productId: "prd-0006",
//         name: "Đồng hồ cơ mới nhất",
//         price: 15990000,
//         quantity: 1,
//       },
//     ],
//   },
//   // Đơn hàng đầu tháng
//   {
//     id: "order-2025-12-01",
//     code: "DH-2025-12-01",
//     customerId: "cus-0002",
//     createdAt: "2025-12-01",
//     status: "Hoàn thành",
//     paymentMethod: "Chuyển khoản",
//     receiverName: "Trần Thị E",
//     receiverPhone: "0911111111",
//     shippingAddress: "Đống Đa, Hà Nội",
//     discount: 100000,
//     items: [
//       {
//         id: "order-2025-12-01-item-1",
//         productId: "prd-0002",
//         name: "Đồng hồ thể thao Active",
//         price: 8990000,
//         quantity: 1,
//       },
//     ],
//   },
//   // Đơn hàng đầu năm
//   {
//     id: "order-2025-01-01",
//     code: "DH-2025-01-01",
//     customerId: "cus-0003",
//     createdAt: "2025-01-01",
//     status: "Hoàn thành",
//     paymentMethod: "Tiền mặt",
//     receiverName: "Lê Văn F",
//     receiverPhone: "0909999999",
//     shippingAddress: "Long Biên, Hà Nội",
//     discount: 0,
//     items: [
//       {
//         id: "order-2025-01-01-item-1",
//         productId: "prd-0003",
//         name: "Smartwatch Pro Health",
//         price: 6990000,
//         quantity: 1,
//       },
//     ],
//   },
// ];

// export const calcOrderTotal = (order) => {
//   const items = Array.isArray(order?.items) ? order.items : [];
//   const subtotal = items.reduce((sum, it) => sum + (Number(it?.price) || 0) * (Number(it?.quantity) || 0), 0);
//   const discount = Number(order?.discount) || 0;
//   return Math.max(0, subtotal - discount);
// };

// export default mockOrdersAdmin;
