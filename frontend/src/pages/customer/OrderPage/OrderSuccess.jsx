import React from "react";
import { Button, Card, Result } from "antd";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
	return (
		<div className="container mx-auto px-4 py-10">
			<Card bordered={false} className="shadow-sm">
				<Result
					status="success"
					title="Đặt hàng thành công"
					subTitle="Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ để xác nhận và giao hàng sớm nhất."
					extra={[
						<Link key="history" to="/order-history" className="hover:no-underline">
							<Button>Xem lịch sử đơn hàng</Button>
						</Link>,
						<Link key="shopping" to="/products" className="hover:no-underline">
							<Button type="primary">Tiếp tục mua sắm</Button>
						</Link>,
					]}
				/>
			</Card>
		</div>
	);
}
