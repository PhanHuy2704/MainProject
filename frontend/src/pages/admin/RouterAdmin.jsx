import React from "react";
import { Navigate, Route, Routes, Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Layout, Menu, Button, Typography, Dropdown, Space, Badge } from "antd";
import {
	DashboardOutlined,
	ShoppingOutlined,
	UserOutlined,
	TagOutlined,
	SettingOutlined,
	LogoutOutlined,
	ShoppingCartOutlined,
	AppstoreAddOutlined,
	TrademarkOutlined,
	SearchOutlined,
	DownOutlined,
	BellOutlined,
} from "@ant-design/icons";

import BrandPage from "./BrandPage";
import CategoryPage from "./CategoryPage";
import DashboardPage from "./DashboardPage";
import ProductManage from "./ProductManage";
import OrderManagePage from "./OrderManagePage";
import CustomerManagePage from "./CustomerManagePage";
import DiscountPage from "./DiscountPage";

import { AuthService } from "../../service/AuthService";
import { clearCartStorage } from "../../utils/cartStorage";
import { AdminOrderService } from "../../service/AdminOrderService";
import { useAuth } from "../../hooks/customer/useAuth";
import { parseDateTimeAny } from "../../utils/formatters";

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

const SIDEBAR_WIDTH = 200;

function AdminSettingsPage() {
	return (
		<div className="container mx-auto px-4 py-6">
			<h1 className="text-xl font-semibold">Cài đặt / Cập nhật thông tin</h1>
		</div>
	);
}

const NAV_ITEMS = [
	{ path: "dashboard", label: "Tổng quan", icon: <DashboardOutlined />, element: <DashboardPage /> },
	{ path: "products", label: "Sản phẩm", icon: <ShoppingOutlined />, element: <ProductManage /> },
	{ path: "categories", label: "Danh mục", icon: <AppstoreAddOutlined />, element: <CategoryPage /> },
	{ path: "brands", label: "Thương hiệu", icon: <TrademarkOutlined />, element: <BrandPage /> },
	{ path: "discounts", label: "Giảm giá", icon: <TagOutlined />, element: <DiscountPage /> },
	{ path: "orders", label: "Đơn hàng", icon: <ShoppingCartOutlined />, element: <OrderManagePage /> },
	{ path: "customers", label: "Khách hàng", icon: <UserOutlined />, element: <CustomerManagePage /> },
	{ path: "settings", label: "Cài đặt", icon: <SettingOutlined />, element: <AdminSettingsPage /> },
];

//SIDEBAR
function AdminSidebar() {
	const location = useLocation();

	const menuItems = NAV_ITEMS.map((item) => ({
		key: `/admin/${item.path}`,
		icon: item.icon,
		label: <Link to={`/admin/${item.path}`}>{item.label}</Link>,
	}));

	return (
		<Sider
			trigger={null}
			theme="dark"
			className="shadow-md"
			width={SIDEBAR_WIDTH}
			style={{
				overflow: "auto",
				height: "100vh",
				position: "fixed",
				left: 0,
				top: 0,
				bottom: 0,
				zIndex: 10,
				backgroundColor: "#020A2F",
				transition: "none",
			}}
		>
			<div className="h-16 px-4 flex items-center border-b border-slate-800">
				<Link to="/admin/dashboard" className="flex items-center gap-2 min-w-0">
					<img
						src="/assets/images/logo.svg"
						alt="Watch Store Admin"
						className="h-8 w-8"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src =
								"https://via.placeholder.com/32x32/1E40AF/FFFFFF?text=WS";
						}}
					/>
					<Title level={4} className="text-white" style={{ margin: 0, lineHeight: 1 }}>
						Quản trị viên
					</Title>
				</Link>
			</div>

			<Menu
				mode="inline"
				theme="dark"
				selectedKeys={[location.pathname]}
				className="border-0 mt-2"
				style={{ background: "transparent" }}
				items={menuItems}
			/>
		</Sider>
	);
}

//HEADER
function AdminTopHeader() {
	const navigate = useNavigate();
	const location = useLocation();
	const [newOrdersCount, setNewOrdersCount] = React.useState(0);
	const { user } = useAuth();

	const prevPathRef = React.useRef(location.pathname);
	const LAST_SEEN_KEY = "admin:lastSeenOrdersAt";
	const readLastSeenMs = () => {
		try {
			const v = Number(localStorage.getItem(LAST_SEEN_KEY));
			return Number.isFinite(v) ? v : 0;
		} catch {
			return 0;
		}
	};
	const writeLastSeenMs = (ms) => {
		try {
			localStorage.setItem(LAST_SEEN_KEY, String(Number(ms) || Date.now()));
		} catch {
			// ignore
		}
	};

	const displayName =
		user?.username || user?.name || user?.fullName || user?.email || "Admin";

	React.useEffect(() => {
		let canceled = false;
		const prevPath = prevPathRef.current;
		const wasOnOrders = String(prevPath || "").startsWith("/admin/orders");
		const isOnOrders = String(location.pathname || "").startsWith("/admin/orders");

		// When on OrderManagePage, always mark as seen and show 0
		// (covers initial load directly on /admin/orders as well)
		if (isOnOrders) {
			(async () => {
				try {
					const orders = await AdminOrderService.getAll();
					const list = Array.isArray(orders) ? orders : [];
					const maxCreatedAtMs = list.reduce((max, o) => {
						const d = parseDateTimeAny(o?.createdAt);
						const ms = d ? d.getTime() : 0;
						return ms > max ? ms : max;
					}, 0);
					writeLastSeenMs(Math.max(Date.now(), maxCreatedAtMs));
					if (!canceled) setNewOrdersCount(0);
				} catch {
					writeLastSeenMs(Date.now());
					if (!canceled) setNewOrdersCount(0);
				}
			})();
			prevPathRef.current = location.pathname;
			return () => {
				canceled = true;
			};
		}

		// Mark notifications as seen when leaving OrderManagePage
		if (wasOnOrders && !isOnOrders) {
			(async () => {
				try {
					const orders = await AdminOrderService.getAll();
					const list = Array.isArray(orders) ? orders : [];
					const maxCreatedAtMs = list.reduce((max, o) => {
						const d = parseDateTimeAny(o?.createdAt);
						const ms = d ? d.getTime() : 0;
						return ms > max ? ms : max;
					}, 0);
					writeLastSeenMs(Math.max(Date.now(), maxCreatedAtMs));
					if (!canceled) setNewOrdersCount(0);
				} catch {
					writeLastSeenMs(Date.now());
					if (!canceled) setNewOrdersCount(0);
				}
			})();
			prevPathRef.current = location.pathname;
			return () => {
				canceled = true;
			};
		}

		(async () => {
			try {
				const orders = await AdminOrderService.getAll();
				const list = Array.isArray(orders) ? orders : [];
				const lastSeenMs = readLastSeenMs();
				const count = list.filter((o) => {
					if (String(o?.status || "").toUpperCase() !== "CREATED") return false;
					const d = parseDateTimeAny(o?.createdAt);
					if (!d) return false;
					return d.getTime() > lastSeenMs;
				}).length;
				if (!canceled) setNewOrdersCount(count);
			} catch {
				if (!canceled) setNewOrdersCount(0);
			}
		})();
		return () => {
			canceled = true;
		};
	}, [location.pathname]);

	React.useEffect(() => {
		prevPathRef.current = location.pathname;
	}, [location.pathname]);

	const adminMenuItems = [
		{
			key: "settings",
			icon: <SettingOutlined />,
			label: "Cập nhật thông tin",
			onClick: () => navigate("/admin/settings"),
		},
		{
			key: "logout",
			icon: <LogoutOutlined />,
			label: "Đăng xuất",
			onClick: async () => {
				try {
					await AuthService.logout();
					clearCartStorage();
				} finally {
					navigate("/", { replace: true });
				}
			},
		},
	];

	return (
		<Header
			className="bg-[#020A2F] border-b border-slate-800 shadow-sm p-0 flex items-center justify-between z-50"
			style={{
				position: "sticky",
				top: 0,
				height: 64,
				paddingLeft: 16,
				paddingRight: 24,
				transition: "none",
			}}
		>
			<div className="w-full h-full flex items-center justify-between">
				<div className="flex items-center">
					{/* search removed as requested */}
				</div>

				<Space size={16} align="center">
					<Link to="/" className="hover:no-underline">
						<Button type="text" className="text-white/90 hover:text-white h-10 flex items-center">
							Trang chủ
						</Button>
					</Link>

					<Space size={8} align="center">
						<Badge count={newOrdersCount} size="small" overflowCount={999}>
							<BellOutlined className="text-white/90" style={{ fontSize: 18 }} />
						</Badge>
						<span className="text-white/90">Có {newOrdersCount} đơn hàng mới</span>
					</Space>

					<Dropdown menu={{ items: adminMenuItems }} trigger={["click"]} placement="bottomRight">
						<Button type="text" className="text-white/90 hover:text-white h-10 flex items-center">
							<Space size={6} align="center">
								<UserOutlined />
								<span className="leading-none">{displayName}</span>
								<DownOutlined />
							</Space>
						</Button>
					</Dropdown>
				</Space>
			</div>
		</Header>
	);
}

function AdminShell() {
       return (
	       <Layout style={{ minHeight: "100vh", transition: "none", background: "#0f172a" }}>
		       <AdminSidebar />
		       <Layout style={{ marginLeft: SIDEBAR_WIDTH, transition: "none", background: "#0f172a" }}>
			       <AdminTopHeader />
			       <Content className="p-6 bg-slate-900" style={{ background: "#0f172a" }}>
				       <Outlet />
			       </Content>
		       </Layout>
	       </Layout>
       );
}

export default function RouterAdmin() {
	return (
		<Routes>
			<Route element={<AdminShell />}>
				<Route index element={<Navigate to="/admin/dashboard" replace />} />
				{NAV_ITEMS.map((item) => (
					<Route key={item.path} path={item.path} element={item.element} />
				))}
			</Route>
			<Route path="*" element={<Navigate to="/admin" replace />} />
		</Routes>
	);
}

