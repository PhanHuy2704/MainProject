import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import { ConfigProvider, Layout, Menu, Button, Dropdown, Space, Typography, message } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  FacebookFilled,
  InstagramOutlined,
  TikTokOutlined,
} from "@ant-design/icons";

import Auth from "./AuthPage";
import HomePageCustomer from "./HomePageCustomer";

import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import ProductsPage from "./ProductPage/ProductsPage";
import ProductDetailPage from "./ProductPage/ProductDetailPage";
import ProfilePage from "./ProfilePage";
import CartPage from "./CartPage";
import OrderPage from "./OrderPage/OrderPage";
import OrderSuccess from "./OrderPage/OrderSuccess";
import OrderHistory from "./OrderPage/OrderHistory";
import OrderDetailPage from "./OrderPage/OrderDetailPage";

import RouterAdmin from "../admin/RouterAdmin";

import { AuthService } from "../../service/AuthService";
import { useAuth } from "../../hooks/customer/useAuth";
import { clearCartStorage } from "../../utils/cartStorage";

const { Header: AntHeader, Footer: AntFooter } = Layout;
const { Text } = Typography;

function isAdminUser(u) {
  const role = String(u?.role || "").toUpperCase();
  return role === "ADMIN" || role === "ROLE_ADMIN";
}

function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname, reason: "cart" }} />;
  }
  return children;
}

function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// HEADER COMPONENT
function CustomerHeader() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [logoutLoading, setLogoutLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await AuthService.logout();
      clearCartStorage();
    } finally {
      setLogoutLoading(false);
    }
  };

  const displayName =
    user?.username || user?.name || user?.fullName || user?.email || "Tài khoản";

  const menuItems = [
    { key: "/", label: <Link to="/" className="hover:no-underline">Trang chủ</Link> },
    { key: "/products", label: <Link to="/products" className="hover:no-underline">Sản phẩm</Link> },
    { key: "/contact", label: <Link to="/contact" className="hover:no-underline">Liên hệ</Link> },
  ];

  const userItems = isAuthenticated
    ? [
        {
          key: "profile",
          icon: <UserOutlined />,
          label: (
            <Link to="/profile" className="hover:no-underline">
              Tài khoản
            </Link>
          ),
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: logoutLoading ? "Đang đăng xuất..." : "Đăng xuất",
          onClick: handleLogout,
          disabled: logoutLoading,
        },
      ]
    : [];

  return (
    <AntHeader className="bg-[#020A2F] px-0 relative z-20" >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/assets/images/logo.svg"
            alt="Watch Store"
            className="h-10 mr-3"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <Link to="/" className="text-white font-bold text-lg hover:no-underline">
            Watch Store
          </Link>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="bg-transparent text-white border-0 flex-1 justify-center hidden md:flex"
          style={{ minWidth: 0 }}
        />
        
        <Space size="middle">
          {isAuthenticated && isAdminUser(user) ? (
				<Link to="/admin" className="hover:no-underline">
					<Button type="text" className="text-white hover:text-white" aria-label="Admin">
						<Space size={6}>
                  <span>Quản trị</span>
						</Space>
					</Button>
				</Link>
			) : null}

          <Link to="/cart" className="hover:no-underline">
            <Button type="text" className="text-white hover:text-white" aria-label="Giỏ hàng">
              <Space size={6}>
                <ShoppingCartOutlined />
                <span>Giỏ hàng</span>
              </Space>
            </Button>
          </Link>

          {isAuthenticated ? (
            <Dropdown menu={{ items: userItems }} trigger={["click"]}>
              <Button type="text" className="text-white hover:text-white">
                <Space>
                  <UserOutlined />
                  <span>{displayName}</span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <Link to="/auth" className="hover:no-underline">
              <Button type="text" className="text-white hover:text-white" aria-label="Đăng nhập">
                <Space>
                  <UserOutlined />
                  <span>Đăng nhập</span>
                </Space>
              </Button>
            </Link>
          )}
        </Space>
      </div>
    </AntHeader>
  );
}


// FOOTER COMPONENT
function CustomerFooter() {
  return (
    <AntFooter className="bg-[#020A2F] text-white p-0 relative z-20">
      <div className="py-10">
        <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0">
            <div className="md:pr-6">
              <div className="flex items-center mb-4">
                <img
                  src="/assets/images/logo.svg"
                  alt="Watch Store"
                  className="h-10 mr-3"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="text-white font-bold text-lg">Watch Store</div>
              </div>
              <Text className="text-white/80">
                Cửa hàng cung cấp đồng hồ chính hãng với giá cả cạnh tranh và dịch vụ hậu mãi.
              </Text>
            </div>

            <div className="md:px-6">
              <div className="text-white font-semibold mb-3">Theo dõi</div>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="text-white/80 hover:text-white"
                >
                  <FacebookFilled className="text-2xl" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-white/80 hover:text-white"
                >
                  <InstagramOutlined className="text-2xl" />
                </a>
                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="text-white/80 hover:text-white"
                >
                  <TikTokOutlined className="text-2xl" />
                </a>
              </div>
            </div>

            <div className="md:px-6">
              <div className="text-white font-semibold mb-3">Hỗ trợ</div>
              <ul className="list-none p-0 m-0 space-y-2">
                <li>
                  <Link to="/about" className="text-white/80 hover:text-white hover:no-underline">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/80 hover:text-white hover:no-underline">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:pl-6">
              <div className="text-white font-semibold mb-3">Liên hệ</div>
              <ul className="list-none p-0 m-0 space-y-2 text-white/80">
                <li>123 Đường Abc, Hà Nội</li>
                <li>+84 123 456 789</li>
                <li>Watch@watchstore.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AntFooter>
  );
}

function AuthRoute() {
  const navigate = useNavigate();
  const location = useLocation();
	const { token, user } = useAuth();
	const shownGuardMessageRef = React.useRef(false);

	const postLoginPath = (u) => (isAdminUser(u) ? "/admin" : "/");

  if (token) return <Navigate to={postLoginPath(user)} replace />;

  React.useEffect(() => {
    if (shownGuardMessageRef.current) return;
    const reason = location?.state?.reason;
    if (reason === "cart") {
      shownGuardMessageRef.current = true;
      message.warning("Bạn cần đăng nhập để xem giỏ hàng");
    }
  }, [location?.state]);

  return (
    <Auth
      onLoginSuccess={(data) => {
			const nextUser = data?.user || user;
      const from = location?.state?.from;
      if (from && isAdminUser(nextUser)) {
        navigate(from, { replace: true });
        return;
      }
      navigate(postLoginPath(nextUser), { replace: true });
      }}
    />
  );
}

function CustomerLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const disablePagePadding = isHome || location.pathname === "/auth";

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <CustomerHeader />
      <main
        className={
          disablePagePadding
            ? `flex-1 relative z-0 bg-slate-900${isHome ? " overflow-hidden" : ""}`
            : `flex-1 py-10 relative z-0 bg-slate-900${isHome ? " overflow-hidden" : ""}`
        }
      >
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}

export default function CustomerRouter() {
  const theme = {
    token: {
      colorPrimary: "#1E40AF",
      colorLink: "#1E40AF",
      borderRadius: 8,
      fontFamily: "Roboto, sans-serif",
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
			  <Route path="/admin/*" element={<AdminRoute><RouterAdmin /></AdminRoute>} />
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePageCustomer />} />
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/profile/*" element={<ProfilePage />} />
            <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-history/:id" element={<OrderDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
