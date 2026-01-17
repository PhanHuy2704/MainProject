
import React from "react";
import { Button, Card, Divider, Empty, Input, List, Space, Tag, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { DiscountService } from "../../service/DiscountService";
import { useCart } from "../../hooks/customer/useCart";
import { formatVnd } from "../../utils/formatters";


const { Title, Text } = Typography;


export default function Cart() {
  const {
    items,
    totals,
    coupon: appliedCoupon,
    updateQuantity,
    removeItem,
    setCoupon: setAppliedCoupon,
    clearCoupon: clearAppliedCoupon,
  } = useCart();

  const { itemCount, total } = totals;
  const { discount, displayDiscount, grandTotal } = useCart();
  const fallbackImage = "/assets/images/logo.svg";

  const [couponInput, setCouponInput] = React.useState("");

  const onRemoveItem = (id) => {
    removeItem(id);
    message.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const applyCoupon = async () => {
    const raw = String(couponInput || "").trim();
    const normalized = raw.replace(/\s+/g, "").toUpperCase();

    if (!normalized) {
      message.warning("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const found = await DiscountService.getValidByCode(normalized);
      const type = String(found?.type || "").toUpperCase();
      const value = found?.value;
      const nextCoupon = { code: normalized, type, value };
      setAppliedCoupon(nextCoupon);

      const nextDiscount = (() => {
        const valueNum = Number(value);
        if (!Number.isFinite(valueNum) || valueNum <= 0) return 0;
        if (type === "FIX") return Math.min(Math.max(0, valueNum), total);
        if (type === "PERCENT") return Math.min(Math.max(0, Math.round((total * valueNum) / 100)), total);
        return 0;
      })();

      message.success(`Đã áp dụng mã ${normalized} (-${formatVnd(nextDiscount)})`);
    } catch (e) {
      message.error(e?.response?.data?.message || "Mã giảm giá không hợp lệ");
    }
  };

  const clearCoupon = () => {
    clearAppliedCoupon();
    setCouponInput("");
    message.info("Đã bỏ mã giảm giá");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <Title level={2} className="!mb-1">
            Giỏ hàng
          </Title>
          <Text type="secondary">
            {items.length === 0 ? "" : `${itemCount} sản phẩm`}
          </Text>
        </div>

        {items.length === 0 ? (
          <Card bordered={false} className="shadow-sm">
            <Empty description="Chưa có sản phẩm trong giỏ hàng" />
            <div className="text-center mt-4">
              <Link to="/products" className="hover:no-underline">
                <Button type="primary">Tiếp tục mua sắm</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <Card bordered={false} className="shadow-sm">
              <Text type="secondary">Mã giảm giá</Text>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  onPressEnter={applyCoupon}
                />
                <Button onClick={applyCoupon}>Áp dụng</Button>
              </div>

              {appliedCoupon?.code ? (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Text type="secondary">
                    Đã áp dụng: <Text strong>{appliedCoupon.code}</Text>
                  </Text>
                  <Button type="link" size="small" className="px-0" onClick={clearCoupon}>
                    Bỏ mã
                  </Button>
                </div>
              ) : null}
            </Card>

            <Card bordered={false} className="shadow-sm">
              <List
                itemLayout="horizontal"
                dataSource={items}
                renderItem={(item) => {
                  const quantity = Number(item.quantity) || 0;
                  const stock = Number(item.stock);
                  const inStock = !Number.isFinite(stock) || stock > 0;
                  const statusText = inStock ? "Còn hàng" : "Hết hàng";
                  const canDec = quantity > 1;
                  const canInc = !Number.isFinite(stock) || quantity < stock;
                  const lineTotal = (Number(item.price) || 0) * quantity;

                  return (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        avatar={
                          <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image || fallbackImage}
                              alt={item.name}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackImage;
                              }}
                            />
                          </div>
                        }
                        title={
                          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-x-3 gap-y-2">
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                              <span className="truncate">{item.name}</span>
                              <Tag color={inStock ? "green" : "red"}>{statusText}</Tag>
                            </div>

                            <div className="flex items-center">
                              <Button
                                size="small"
                                className="w-8"
                                onClick={() => updateQuantity(item.id, quantity - 1)}
                                disabled={!canDec}
                                aria-label="Giảm số lượng"
                              >
                                -
                              </Button>
                              <Text strong className="inline-block w-8 text-center tabular-nums">
                                {quantity}
                              </Text>
                              <Button
                                size="small"
                                className="w-8"
                                onClick={() => updateQuantity(item.id, quantity + 1)}
                                disabled={!canInc}
                                aria-label="Tăng số lượng"
                              >
                                +
                              </Button>
                            </div>

                            <Text strong className="min-w-[120px] text-right tabular-nums">
                              {formatVnd(lineTotal)}
                            </Text>

                            <Button
                              type="link"
                              danger
                              size="small"
                              className="px-0"
                              onClick={() => onRemoveItem(item.id)}
                              aria-label="Xóa sản phẩm"
                            >
                              Xóa
                            </Button>
                          </div>
                        }
                        description={
                          <Space direction="vertical" size={2}>
                            
                            {item.brand ? <Text type="secondary">Hãng: {item.brand}</Text> : null}
                            <Text type="secondary">
                              Đơn giá: {formatVnd(item.price)}
                            </Text>
                            {Number.isFinite(stock) ? (
                              <Text type="secondary">Số lượng sản phẩm còn lại: {stock}</Text>
                            ) : null}
                          </Space>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>

            <Card bordered={false} className="shadow-sm">
              <div className="flex items-center justify-between">
                <Text type="secondary">Tạm tính</Text>
                <Text strong>{formatVnd(total)}</Text>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Text type="secondary">Giảm giá</Text>
                <Text strong>
                  {displayDiscount > 0 ? `-${formatVnd(displayDiscount)}` : formatVnd(0)}
                </Text>
              </div>

              <Divider className="my-3" />
              <div className="flex items-center justify-between">
                <Text strong>Tổng cộng</Text>
                <Text strong className="text-blue-800">
                  {formatVnd(grandTotal)}
                </Text>
              </div>

              <div className="mt-4 flex justify-end">
                <Link to="/order" className="hover:no-underline">
                  <Button type="primary">Đặt hàng</Button>
                </Link>
              </div>
            </Card>
          </>
        )}
      </Space>
    </div>
  );
}
