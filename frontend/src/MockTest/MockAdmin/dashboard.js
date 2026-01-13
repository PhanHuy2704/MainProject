// // Mock data: Dashboard stats (frontend-only)

// import mockProductsAdmin from "./products";
// import mockOrdersAdmin, { calcOrderTotal } from "./orders";
// import mockCustomers from "./customers";

// export const getDashboardStats = () => {
//   const products = Array.isArray(mockProductsAdmin) ? mockProductsAdmin : [];
//   const orders = Array.isArray(mockOrdersAdmin) ? mockOrdersAdmin : [];
//   const customers = Array.isArray(mockCustomers) ? mockCustomers : [];

//   const activeProducts = products.filter((p) => {
//     const s = String(p?.status || "");
//     return s === "Hoạt động" || s === "active";
//   });
//   const outOfStock = products.filter((p) => (Number(p?.stock) || 0) <= 0);

//   const revenue = orders
//     .filter((o) => String(o?.status || "").toLowerCase() === "hoàn thành")
//     .reduce((sum, o) => sum + calcOrderTotal(o), 0);

//   return {
//     totalProducts: products.length,
//     activeProducts: activeProducts.length,
//     outOfStockProducts: outOfStock.length,
//     totalOrders: orders.length,
//     totalCustomers: customers.length,
//     revenue,
//   };
// };

// export default getDashboardStats;
