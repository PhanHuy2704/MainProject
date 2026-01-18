import React, { useCallback, useMemo, useState } from "react";
import {
	Breadcrumb,
	Button,
	Card,
	Checkbox,
	Col,
	Divider,
	Empty,
	Input,
	Pagination,
	Rate,
	Row,
	Select,
	Slider,
	Tag,
	Typography,
	message,
} from "antd";
import { PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import { useProductsCatalog } from "../../../hooks/customer/useProductsCatalog";
import { useAuth } from "../../../hooks/customer/useAuth";
import { useCart } from "../../../hooks/customer/useCart";
import { formatVnd } from "../../../utils/formatters";

const { Title, Paragraph, Text } = Typography;

const clampRating = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(5, value));
};

const getProductRating = (product) =>
  clampRating(
    product?.rating ??
      product?.averageRating ??
      product?.avgRating ??
      product?.ratingAvg ??
      product?.stars
  );

const getCategoryLabel = (category) => {
  const map = {
    mechanical: "Đồng hồ cơ",
    smart: "Đồng hồ thông minh",
    sport: "Đồng hồ thể thao",
    classic: "Đồng hồ cổ điển",
  };
  return map[category] || category || "-";
};

const ProductsPage = () => {
  const navigate = useNavigate();
  const { products, isLoading } = useProductsCatalog();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const fallbackImage = "/assets/images/logo.svg";

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const PAGE_SIZE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const searchInProduct = useCallback((product, term) => {
    if (!term) return true;

    const searchWords = term
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const productName = product?.name?.toLowerCase?.() || "";
    const categoryName = product?.category?.toLowerCase?.() || "";
    const brandName = product?.brand?.toLowerCase?.() || "";

    return searchWords.every(
      (word) =>
        productName.includes(word) ||
        categoryName.includes(word) ||
        brandName.includes(word)
    );
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((p) => searchInProduct(p, searchTerm));
    }

    filtered = filtered.filter(
      (p) => (p.price ?? 0) >= priceRange[0] && (p.price ?? 0) <= priceRange[1]
    );

    if (inStockOnly) {
      filtered = filtered.filter((p) => (Number(p?.stock) || 0) > 0);
    }

    return filtered;
  }, [products, searchInProduct, searchTerm, priceRange, inStockOnly]);

  const displayProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "priceAsc":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "priceDesc":
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "nameAsc":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "nameDesc":
        sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "rating":
        sorted.sort((a, b) => getProductRating(b) - getProductRating(a));
        break;
      default:
        // featured: sort by id descending
        sorted.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return displayProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [displayProducts, currentPage]);

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1000000000]);
    setInStockOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const applyFilters = () => {
    // purely client-side; state updates already apply filters
  };

  const { Search } = Input;

  return (
    <div className="container mx-auto px-4 py-6">
      

      <div className="mb-6">
        <Title level={2} className="!mb-1">
          Sản phẩm
        </Title>
        
      </div>

      {isLoading ? (
        <Card variant="borderless" className="shadow-sm">
          <Text type="secondary">Đang tải dữ liệu...</Text>
        </Card>
      ) : products.length === 0 ? (
        <Card variant="borderless" className="shadow-sm">
          <Empty description="Chưa có sản phẩm" />
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <Card className="filter-sidebar">
              <div className="flex justify-between items-center mb-4">
                <Title level={4} className="m-0">
                  Bộ lọc
                </Title>
                <Button onClick={resetFilters} size="small">
                  Đặt lại
                </Button>
              </div>

              <Divider />

              <div className="mb-4">
                <Text strong>Tìm kiếm sản phẩm</Text>
                <Search
                  placeholder="Tìm theo tên, danh mục, thương hiệu..."
                  allowClear
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  onSearch={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                  }}
                  enterButton
                  className="mt-2"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Tìm theo tên sản phẩm, danh mục hoặc thương hiệu
                </div>
              </div>

              <Divider />

              <div className="mb-4">
                <Text strong>Khoảng giá</Text>
                <Slider
                  range
                  min={0}
                  max={1000000000}
                  step={100000}
                  value={priceRange}
                  onChange={(next) => {
                    setPriceRange(next);
                    setCurrentPage(1);
                  }}
                  className="mt-2"
                />
                <div className="flex justify-between">
                  <Text>{priceRange[0].toLocaleString()} VNĐ</Text>
                  <Text>{priceRange[1].toLocaleString()} VNĐ</Text>
                </div>
              </div>

              <Divider />

              <Checkbox
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              >
                Chỉ hiện sản phẩm còn hàng
              </Checkbox>

              <Button type="primary" block className="mt-4" onClick={applyFilters}>
                Áp dụng bộ lọc
              </Button>
            </Card>
          </Col>

          <Col xs={24} lg={18}>
            <Card className="mb-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <Text className="mr-2">Hiển thị {displayProducts.length} sản phẩm</Text>
                  {searchTerm && (
                    <Tag closable onClose={() => setSearchTerm("")}>
                      Tìm kiếm: {searchTerm}
                    </Tag>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <Text className="mr-2">Sắp xếp:</Text>
                  <Select
                    value={sortBy}
                            onChange={(next) => {
                            setSortBy(next);
                            setCurrentPage(1);
                          }}
                    style={{ width: 170 }}
                    options={[
                      { value: "featured", label: "Nổi bật" },
                      { value: "priceAsc", label: "Giá tăng dần" },
                      { value: "priceDesc", label: "Giá giảm dần" },
                      { value: "nameAsc", label: "A-Z" },
                      { value: "nameDesc", label: "Z-A" },
                      { value: "rating", label: "Đánh giá cao" },
                    ]}
                  />
                </div>
              </div>
            </Card>

            {displayProducts.length === 0 ? (
              <Card variant="borderless" className="shadow-sm">
                <Empty description="Không tìm thấy sản phẩm phù hợp" />
              </Card>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {paginatedProducts.map((p) => {
                    const stock = Number(p?.stock) || 0;
                    const inStock = stock > 0;
                    const statusText = inStock ? "Còn hàng" : "Hết hàng";
                    const ratingValue = getProductRating(p);
					const reviewCount = Number(p?.reviewCount) || Number(p?.reviews) || 0;
                    const soldQuantity = Number(p?.soldQuantity) || 0;
                    const categoryLabel = getCategoryLabel(p?.category);

                    return (
                      <Col key={p.id} xs={24} sm={12} md={8} lg={6} className="flex">
                        <Card
                          hoverable
                          variant="borderless"
                          className="shadow-sm flex-1 flex flex-col"
                          styles={{
                            body: {
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            },
                          }}
                          cover={
                            <div className="bg-gray-50">
                              <Link to={`/products/${p.id}`} className="hover:no-underline">
                                <img
                                  src={p.image || fallbackImage}
                                  alt={p.name}
                                  className="w-full h-48 object-contain p-4"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = fallbackImage;
                                  }}
                                />
                              </Link>
                            </div>
                          }
                        >
                          <div className="flex items-start justify-between gap-2">
                            <Link to={`/products/${p.id}`} className="hover:no-underline">
                              <Title level={5} className="!mb-1">
                                {p.name}
                              </Title>
                            </Link>
                            <Tag color={inStock ? "green" : "red"}>{statusText}</Tag>
                          </div>

                          {p.brand ? (
                            <Text type="secondary" className="text-xs">Hãng: {p.brand}</Text>
                          ) : (
                            <Text type="secondary">&nbsp;</Text>
                          )}

                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <Text type="secondary" className="text-xs">
                              Danh mục: {categoryLabel}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              Còn lại: {stock}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              Đã bán: {soldQuantity}
                            </Text>

                            <span className="flex items-center gap-2 whitespace-nowrap">
                              <Rate allowHalf disabled value={ratingValue} style={{ fontSize: 12 }} />
                              <Text type="secondary" className="text-xs whitespace-nowrap">
								{ratingValue.toFixed(1)} ({reviewCount})
                              </Text>
                            </span>
                          </div>

                          <div className="mt-3">
                            <Text className="text-blue-800 font-semibold">
                              {formatVnd(p.price)}
                            </Text>
                          </div>

                          {p.description ? (
                            <Paragraph type="secondary" className="!mt-3 !mb-0" ellipsis={{ rows: 3 }}>
                              {p.description}
                            </Paragraph>
                          ) : null}

                          <div className="mt-auto pt-4">
                            {inStock ? (
                              <Button
                                type="primary"
                                block
                                icon={<PlusOutlined />}
                                onClick={() => {
                                  if (!isAuthenticated) {
                                    message.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
                                    navigate("/auth");
                                    return;
                                  }
                                  addToCart(p, 1);
                                  message.success("Đã thêm vào giỏ hàng");
                                }}
                              >
                                Thêm vào giỏ hàng
                              </Button>
                            ) : (
                              <Link to="/contact" className="hover:no-underline w-full block">
                                <Button type="primary" block icon={<PhoneOutlined />}>
                                  Liên hệ
                                </Button>
                              </Link>
                            )}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>

                <div className="flex justify-center mt-6">
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={displayProducts.length}
                    onChange={(page) => setCurrentPage(page)}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} / ${total} sản phẩm`
                    }
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ProductsPage;
