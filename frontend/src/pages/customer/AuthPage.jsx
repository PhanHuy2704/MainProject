import React from "react";
import { Card, Tabs, Form, Input, Button, Typography, message, Radio } from "antd";
import { AuthService } from "../../service/AuthService";

const { Title, Text } = Typography;

function Auth({ onLoginSuccess }) {
  const [msgApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [registerLoading, setRegisterLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("login");
  const [registerForm] = Form.useForm();

  const showHttpError = (err, fallbackMessage) => {
    const status = err?.response?.status;
    const data = err?.response?.data;

    if (!err?.response) {
      msgApi.error(
        "Không thể kết nối máy chủ. Vui lòng kiểm tra backend (http://localhost:8080) và thử lại."
      );
      return;
    }

    // Ưu tiên các lỗi phổ biến
    if (status === 401) {
      msgApi.error("Sai email hoặc mật khẩu.");
      return;
    }
    if (status === 404) {
      msgApi.error("Không tìm thấy tài khoản với email này.");
      return;
    }
    if (status === 409) {
      msgApi.error("Email đã tồn tại. Vui lòng dùng email khác.");
      return;
    }
    if (status === 400 && typeof data === "object" && data?.message?.toLowerCase().includes("email")) {
      msgApi.error("Email không hợp lệ hoặc đã được sử dụng.");
      return;
    }

    if (typeof data === "string" && data.trim()) {
      msgApi.error(data);
      return;
    }

    if (data && typeof data === "object") {
      const messageFromObject =
        data.message ||
        data.error ||
        (Array.isArray(data.errors) && data.errors[0]) ||
        (Array.isArray(data.details) && data.details[0]);
      if (typeof messageFromObject === "string" && messageFromObject.trim()) {
        msgApi.error(messageFromObject);
        return;
      }
      msgApi.error(`${fallbackMessage} (HTTP ${status}).`);
      return;
    }

    msgApi.error(fallbackMessage);
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const data = await AuthService.login({
        email: values.email,
        password: values.password,
      });

      msgApi.success("Đăng nhập thành công.");
      onLoginSuccess?.(data);
    } catch (err) {
      showHttpError(err, "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setRegisterLoading(true);
    try {
      await AuthService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
      });

      msgApi.success("Đăng ký thành công. Vui lòng đăng nhập.");
      registerForm.resetFields();
      setActiveTab("login");
    } catch (err) {
      showHttpError(err, "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const items = [
    {
      key: "login",
      label: "Đăng nhập",
      children: (
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form>
      ),
    },
    {
      key: "register",
      label: "Đăng ký",
      children: (
        <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
          <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 1, message: "Mật khẩu tối thiểu 1 ký tự" },
            ]}
          >
            <Input placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
          >
            <Input placeholder="Nhập số điện thoại (tùy chọn)" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
          >
            <Input placeholder="Nhập địa chỉ (tùy chọn)" />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={registerLoading}>
            Đăng ký
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      {contextHolder}
      <Card className="w-full max-w-[520px] shadow-sm" variant="borderless">
        <div className="text-center mb-6">
          <Title level={2} className="!mb-1">Chào mừng</Title>
          <Text type="secondary">Đăng nhập hoặc tạo tài khoản mới</Text>
        </div>
        <div className="max-w-[420px] mx-auto">
          <Tabs
            centered
            items={items}
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
            }}
          />
        </div>
      </Card>
    </div>
  );
}

export default Auth;
