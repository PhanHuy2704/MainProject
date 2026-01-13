import React from "react";
import { Link } from "react-router-dom";
import { Button, Carousel, Col, Divider, Row, Space, Tag, Typography } from "antd";
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  TagOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HomePageCustomer = () => {
  // ===== BANNER DATA =====
  const bannerItems = [
    {
      key: "1",
      title: "Đẳng Cấp Vượt Trội",
      subtitle: "Bộ sưu tập đồng hồ cao cấp",
      description: "Thiết kế độc quyền, thể hiện đẳng cấp và phong cách của bạn",
      image: "/assets/images/banners/banner1.jpg",
      buttonText: "Khám phá ngay",
      buttonLink: "/products",
    },
    {
      key: "2",
      title: "Ưu đãi ngập tràn",
      subtitle: "Giảm giá sâu nhiều mặt hàng",
      description: "Cơ hội sở hữu đồng hồ chất lượng với giá tốt nhất",
      image: "/assets/images/banners/banner2.jpg",
      buttonText: "Mua ngay",
      buttonLink: "/products",
    },
  ];

  return (
    <div className="home-page">
      {/* ======================= */}
      {/* Banner / Carousel */}
      {/* ======================= */}
      <Carousel autoplay effect="fade" className="banner-carousel">
        {bannerItems.map((item) => (
          <div key={item.key} className="relative">
            <div className="banner-slide relative h-[520px] md:h-[600px] overflow-hidden">
              <div className="absolute inset-0 bg-blue-900" />
              <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                  backgroundImage: `url(${item.image})`,
                  filter: "brightness(0.7)",
                }}
              />

              <div className="absolute inset-0 flex items-center z-10">
                <div className="container mx-auto px-4 md:px-10">
                  <div className="max-w-xl">
                    <Tag color="blue" className="mb-4">
                      {item.subtitle}
                    </Tag>
                    <Title level={1} className="text-white mb-4 banner-text-outline">
                      {item.title}
                    </Title>
                    <Paragraph className="text-white text-lg mb-8 banner-text-outline">
                      {item.description}
                    </Paragraph>
                    <Link to={item.buttonLink} className="hover:no-underline">
                      <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                        {item.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* ======================= */}
      {/* USP / Lý do chọn chúng tôi */}
      {/* ======================= */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Row gutter={[24, 24]} className="text-center">
            <Col xs={24} sm={12} md={6}>
              <div className="p-4">
                <ClockCircleOutlined className="text-4xl text-blue-600 mb-3" />
                <Title level={4}>Hàng Chính Hãng</Title>
                <Text type="secondary">Toàn bộ sản phẩm đều có giấy chứng nhận xuất xứ đầy đủ</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="p-4">
                <TagOutlined className="text-4xl text-blue-600 mb-3" />
                <Title level={4}>Rẻ Vô Địch</Title>
                <Text type="secondary">Rất nhiều chương trình ưu đãi đang chờ đợi bạn</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="p-4">
                <TrophyOutlined className="text-4xl text-blue-600 mb-3" />
                <Title level={4}>Giao Hàng Nhanh Chóng</Title>
                <Text type="secondary">Hỗ trợ giao hàng nhanh chóng và đúng hẹn trên toàn quốc</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="p-4">
                <SafetyCertificateOutlined className="text-4xl text-blue-600 mb-3" />
                <Title level={4}>An Tâm Nhận Hàng</Title>
                <Text type="secondary">Chỉ thanh toán khi bạn đã cầm trên tay sản phẩm đúng chất lượng</Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* ======================= */}
      {/* About / Về Watch Store */}
      {/* ======================= */}
      <div className="py-16 container mx-auto px-4">
        <Row gutter={[48, 24]} align="middle">
          <Col xs={24} lg={12}>
            <div className="about-image relative">
              <img
                src="/assets/images/about-store.jpg"
                alt="Watch Store"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <Title level={2}>Về Watch Store</Title>
            <Title level={5} className="text-blue-600 font-normal mb-6">
              "Watch Store – Nơi thời gian trở thành giá trị!"
            </Title>
            <Paragraph className="text-lg">
              Watch Store là hệ thống phân phối đồng hồ chính hãng 100%, chuyên cung cấp các mẫu đồng hồ đến từ những thương hiệu uy tín trên thế giới. Mỗi sản phẩm là tuyên ngôn về phong cách, đẳng cấp và cá tính của người đeo.
            </Paragraph>
            <Paragraph className="text-lg mb-8">
              Chúng tôi cam kết nguồn gốc minh bạch, giao hàng nhanh chóng và mức giá cạnh tranh nhất thị trường. Sự hài lòng của khách hàng chính là thành công lớn nhất của chúng tôi.
            </Paragraph>
            <Link to="/about" className="hover:no-underline">
              <Button type="primary" size="large">
                Tìm hiểu thêm
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      {/* ======================= */}
      {/* Promo / Ưu đãi đặc biệt */}
      {/* ======================= */}
      <div className="bg-gray-50 py-12" id="promo">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="!mb-3 text-slate-800">
            Ưu Đãi Đặc Biệt
          </Title>
          <Paragraph className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Đăng ký nhận thông tin để không bỏ lỡ những ưu đãi độc quyền và bộ sưu tập mới nhất từ Watch Store
          </Paragraph>
          <Space direction="horizontal" size="large">
            
          </Space>
        </div>
      </div>
    </div>
  );
};

export default HomePageCustomer;
