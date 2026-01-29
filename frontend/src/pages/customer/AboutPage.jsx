


import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, Spin, Alert, Tag, Divider } from "antd";
import { Link } from "react-router-dom";
import { DiscountService } from "../../service/DiscountService";

const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    DiscountService.getAll()
      .then((data) => setCoupons(data))
      .catch((err) => setError(err?.message || "Lỗi tải mã giảm giá"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <img
          src="/assets/images/about-store.jpg"
          alt="Ưu đãi đồng hồ chính hãng"
          className="rounded-lg shadow-lg w-full md:w-2/5 object-cover"
          style={{ minHeight: 220, maxHeight: 320 }}
        />
        <div className="flex-1 flex flex-col justify-center">
          <Title level={2} className="!mb-2 text-blue-700">Ưu đãi đặc biệt tại WatchStore</Title>
          <Paragraph className="!mb-2 text-black text-justify" style={{ fontSize: 18, lineHeight: 1.8 }}>
            <b>WatchStore</b> tự hào là địa chỉ tin cậy chuyên cung cấp đồng hồ chính hãng từ các thương hiệu nổi tiếng thế giới. Chúng tôi cam kết mang đến trải nghiệm mua sắm hiện đại, minh bạch và dịch vụ hậu mãi tận tâm.<br/>
            <span className="block mt-2">Tại WatchStore, mỗi khách hàng đều được phục vụ như thượng đế. Chúng tôi không chỉ mang đến sản phẩm chất lượng mà còn chú trọng xây dựng niềm tin và sự hài lòng lâu dài. Hỗ trợ giao hàng nhanh chóng toàn quốc cùng với rất nhiều ưu đãi hấp dẫn mỗi ngày.</span>
          </Paragraph>
          <div className="flex flex-wrap gap-2 mb-2">
            <Tag color="gold" style={{ fontSize: 16, padding: '4px 14px' }}>Bảo hành 5 năm</Tag>
            <Tag color="blue" style={{ fontSize: 16, padding: '4px 14px' }}>Giao hàng toàn quốc</Tag>
            <Tag color="green" style={{ fontSize: 16, padding: '4px 14px' }}>Đổi trả 7 ngày</Tag>
            <Tag color="red" style={{ fontSize: 16, padding: '4px 14px' }}>Trả góp 0%</Tag>
            <Tag color="purple" style={{ fontSize: 16, padding: '4px 14px' }}>Quà tặng hấp dẫn</Tag>
            <Tag color="cyan" style={{ fontSize: 16, padding: '4px 14px' }}>Thương hiệu nổi tiếng</Tag>
            <Tag color="magenta" style={{ fontSize: 16, padding: '4px 14px' }}>Tư vấn tận tâm</Tag>
          </div>
          
        </div>
      </div>

      <Divider orientation="text-center" plain>
        <Title level={4} className="!mb-0">Danh sách mã giảm giá HOT</Title>
      </Divider>

      {loading ? (
        <div className="flex justify-center items-center min-h-[120px]">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : coupons.length === 0 ? (
        <Text type="secondary">Hiện chưa có mã giảm giá nào.</Text>
      ) : (
        <Row gutter={[24, 24]} className="mb-10">
          {coupons
            .filter((coupon) => {
              if (!coupon.endAt) return true;
              const now = new Date();
              const end = new Date(coupon.endAt);
              return end >= now;
            })
            .map((coupon) => (
              <Col xs={24} sm={12} md={8} key={coupon.code}>
                <div
                  className="rounded-2xl bg-white shadow-lg border border-blue-100 p-0 flex flex-col items-stretch min-h-[180px]"
                  style={{ boxShadow: '0 2px 12px 0 #b6e0fe33', margin: 8 }}
                >
                  <div className="flex items-center justify-between px-5 pt-4 pb-2 rounded-t-2xl bg-blue-50 border-b border-blue-100">
                    <span className="font-bold text-lg text-blue-600 tracking-wide">{coupon.code}</span>
                    {coupon.value > 0 ? (
                      <span className="bg-orange-50 text-orange-600 font-semibold rounded-full px-3 py-1 text-sm border border-orange-200" style={{marginLeft: 8}}>
                        {coupon.type === 'PERCENT' ? `${coupon.value}%` : `${coupon.value.toLocaleString()}₫`}
                      </span>
                    ) : (
                      <span className="bg-purple-50 text-purple-600 font-semibold rounded-full px-3 py-1 text-sm border border-purple-200" style={{marginLeft: 8}}>Đặc biệt</span>
                    )}
                  </div>
                  <div className="px-5 py-4 flex-1 flex flex-col justify-between">
                    <Paragraph className="mb-2 text-base text-gray-700">{coupon.description}</Paragraph>
                    
                    {coupon.value > 0 && (
                      <Text className="block mb-1 text-blue-700 font-semibold">
                        {coupon.type === 'PERCENT'
                          ? `Giảm giá ${coupon.value}% giá trị đơn hàng`
                          : `Giảm giá ${coupon.value >= 1000 ? (coupon.value/1000) : coupon.value}k cho đơn hàng`}
                      </Text>
                    )}
                    {coupon.endAt && (
                      <Text className="block mb-3 text-black font-medium">HSD: {new Date(coupon.endAt).toLocaleDateString()}</Text>
                    )}
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Link
                        to="/products"
                        className="border border-blue-400 text-blue-600 bg-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-50 transition"
                        style={{ textDecoration: 'none' }}
                      >
                        Dùng ngay
                      </Link>
                      <span className="border border-yellow-400 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium">Số lượng có hạn</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      )}

      <Divider orientation="text-center" plain>
        <Title level={4} className="!mb-0 ">Tại sao chọn WatchStore?</Title>
      </Divider>
      <Row gutter={[32, 32]} className="mb-10">
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full text-center shadow-sm">
            <Title level={5}>Sản phẩm chính hãng 100%</Title>
            <Paragraph>Cam kết xuất xứ rõ ràng, đầy đủ giấy tờ và bảo hành toàn cầu.</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full text-center shadow-sm">
            <Title level={5}>Giá tốt & Ưu đãi hấp dẫn</Title>
            <Paragraph>Giá cạnh tranh, nhiều chương trình khuyến mãi và mã giảm giá cập nhật liên tục.</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="h-full text-center shadow-sm">
            <Title level={5}>Dịch vụ tận tâm</Title>
            <Paragraph>Hỗ trợ tư vấn, đổi trả, bảo hành nhanh chóng, tận tình trước và sau bán hàng.</Paragraph>
          </Card>
        </Col>
      </Row>

      <div className=" text-center shadow-inner">
        <Title level={4} className="!mb-2">Mua ngay để tận dụng những ưu đãi mới nhất</Title>
        
      </div>
    </div>
  );
};

export default AboutPage;
