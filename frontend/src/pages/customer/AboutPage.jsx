import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <Title level={2}>Về chúng tôi</Title>
      <Paragraph type="secondary">
        Watch Store cung cấp đồng hồ chính hãng với trải nghiệm mua sắm hiện đại, minh bạch và hậu mãi tận tâm.
      </Paragraph>
    </div>
  );
};

export default AboutPage;
