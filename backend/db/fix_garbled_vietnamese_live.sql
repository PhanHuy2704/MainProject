-- Fix garbled Vietnamese text caused by non-UTF8 client encoding
-- Apply directly to the live DB (mainproject).

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

START TRANSACTION;

-- brands
UPDATE brands SET description='Rolex - thương hiệu đồng hồ cao cấp' WHERE id=1;
UPDATE brands SET description='Tudor - thương hiệu thể thao/đồng hồ lặn' WHERE id=2;
UPDATE brands SET description='Tissot - thương hiệu Thụy Sĩ phổ biến' WHERE id=3;
UPDATE brands SET description='Cartier - thương hiệu thời trang cao cấp' WHERE id=4;
UPDATE brands SET description='Audemars Piguet - Haute Horlogerie' WHERE id=5;
UPDATE brands SET description='IWC - thương hiệu đồng hồ phi công' WHERE id=6;
UPDATE brands SET description='Fossil - thương hiệu thời trang' WHERE id=7;
UPDATE brands SET description='Seiko - thương hiệu Nhật Bản' WHERE id=8;

-- categories
UPDATE categories SET description='Đồng hồ cao cấp' WHERE id=1;
UPDATE categories SET description='Đồng hồ lặn' WHERE id=2;
UPDATE categories SET description='Đồng hồ thể thao' WHERE id=3;
UPDATE categories SET description='Đồng hồ dress/thời trang' WHERE id=4;
UPDATE categories SET description='Đồng hồ phi công' WHERE id=5;
UPDATE categories SET description='Đồng hồ cơ tự động' WHERE id=6;

-- products
UPDATE products SET description='Tudor Black Bay 58 - phong cách diver cổ điển.' WHERE product_id=2;
UPDATE products SET description='Tissot PRX Powermatic 80 - máy cơ, thiết kế thể thao.' WHERE product_id=3;
UPDATE products SET description='Cartier Tank Must - biểu tượng dress watch.' WHERE product_id=4;
UPDATE products SET description='Royal Oak 41 - thiết kế thể thao sang trọng.' WHERE product_id=5;
UPDATE products SET description='IWC Mark XVIII - phong cách phi công cổ điển.' WHERE product_id=6;
UPDATE products SET description='Fossil ME3260 - máy cơ, phù hợp hằng ngày.' WHERE product_id=7;
UPDATE products SET description='Fossil ME3268 - máy cơ, thiết kế trẻ trung.' WHERE product_id=8;
UPDATE products SET description='Seiko Cocktail Time - mặt số nổi bật, hợp dress.' WHERE product_id=9;

-- orders
UPDATE orders SET receiver_name='Khách hàng', shipping_address='Hà Nội' WHERE order_id IN (1,2);

-- reviews
UPDATE reviews SET comment='Đeo rất đẹp, máy chạy ổn định.' WHERE review_id=1;
UPDATE reviews SET comment='Chất lượng hoàn thiện tốt, rất hài lòng.' WHERE review_id=2;
UPDATE reviews SET comment='Giá tốt, phù hợp tầm tiền.' WHERE review_id=3;

-- users
UPDATE users SET address='Hà Nội' WHERE id IN (1,2);

COMMIT;

-- Quick verification (bytes should no longer contain 0x3F for Vietnamese letters)
SELECT id, description, HEX(description) AS hex FROM brands WHERE id=1;
SELECT order_id, shipping_address, HEX(shipping_address) AS hex FROM orders WHERE order_id=1;
SELECT review_id, comment, HEX(comment) AS hex FROM reviews WHERE review_id=1;
