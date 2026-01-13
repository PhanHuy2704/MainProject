SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Reset data (safe for reseeding demo data)
TRUNCATE TABLE order_details;
TRUNCATE TABLE reviews;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE discounts;
TRUNCATE TABLE categories;
TRUNCATE TABLE brands;
TRUNCATE TABLE users;

-- USERS
-- NOTE: password_hash below is PLAINTEXT on purpose (dev convenience).
-- The backend will allow login and auto-upgrade to bcrypt after first successful login.
INSERT INTO users (id, role, created_at, updated_at, email, gender, name, password_hash, phone, address)
VALUES
  (1, 'ADMIN',    NOW(6), NULL, 'admin@watchstore.vn', 'MALE',   'Quản trị', '123456', '0900000000', 'Hà Nội'),
  (2, 'CUSTOMER', NOW(6), NULL, 'user@watchstore.vn',  'FEMALE', 'Khách hàng', '123456', '0911111111', 'Hà Nội');

-- BRANDS
INSERT INTO brands (id, name, status, description) VALUES
  (1, 'Rolex', 'ACTIVE', 'Rolex - thương hiệu đồng hồ cao cấp'),
  (2, 'Tudor', 'ACTIVE', 'Tudor - đồng hồ thể thao/đi biển'),
  (3, 'Tissot', 'ACTIVE', 'Tissot - đồng hồ Thụy Sĩ phổ biến'),
  (4, 'Cartier', 'ACTIVE', 'Cartier - đồng hồ thời trang cao cấp'),
  (5, 'Seiko', 'ACTIVE', 'Seiko - đồng hồ Nhật Bản');

-- CATEGORIES
INSERT INTO categories (id, name, status, description) VALUES
  (1, 'Luxury', 'ACTIVE', 'Đồng hồ cao cấp'),
  (2, 'Dive', 'ACTIVE', 'Đồng hồ lặn'),
  (3, 'Sport', 'ACTIVE', 'Đồng hồ thể thao'),
  (4, 'Dress', 'ACTIVE', 'Đồng hồ dress/thời trang'),
  (5, 'Automatic', 'ACTIVE', 'Đồng hồ cơ tự động');

-- PRODUCTS
-- image: Cloudinary URL (demo). Replace cloud name/folder with your own Cloudinary if needed.
-- Using Cloudinary "demo" account public images keeps the seed runnable without your credentials.
INSERT INTO products (product_id, name, brand_id, category_id, stock, sold_quantity, code, image, price, description, status) VALUES
  (1, 'Rolex Datejust 41', 1, 1, 10, 2, 'ROLEX-DJ41', 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/sample.jpg', 250000000.00, 'Thiết kế sang trọng, phù hợp nhiều dịp.', 'IN_STOCK'),
  (2, 'Tudor Black Bay 58', 2, 2, 8, 1, 'TUDOR-BB58', 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/balloons.jpg', 110000000.00, 'Phong cách diver cổ điển, độ hoàn thiện tốt.', 'IN_STOCK'),
  (3, 'Tissot PRX Powermatic 80', 3, 3, 25, 5, 'TISSOT-PRX', 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/surf.jpg', 17000000.00, 'Máy cơ, thiết kế thể thao, dễ phối đồ.', 'IN_STOCK'),
  (4, 'Cartier Tank Must', 4, 4, 6, 1, 'CARTIER-TANK', 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/couple.jpg', 90000000.00, 'Biểu tượng dress watch, thanh lịch.', 'IN_STOCK'),
  (5, 'Seiko Cocktail Time', 5, 4, 12, 3, 'SEIKO-CT', 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/coffee.jpg', 11000000.00, 'Mặt số đẹp, hợp đi làm và dự tiệc.', 'IN_STOCK');

-- DISCOUNTS
INSERT INTO discounts (discount_id, code, type, start_at, end_at, value, stock, used_quantity, status) VALUES
  (1, 'WELCOME100K', 'FIX', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 100000.00, 100, 0, 'ACTIVE'),
  (2, 'SALE10', 'PERCENT', NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 10.00, 200, 0, 'ACTIVE');

-- ORDERS
INSERT INTO orders (order_id, code, created_at, user_id, status, receiver_name, receiver_phone, shipping_address, receive_at, end_at, payment_method, final_price, discount_id)
VALUES
  (1, 'ORD-0001', NOW(), 2, 'CREATED', 'Khách hàng', '0911111111', 'Hà Nội', NULL, NULL, 'CASH', 16900000.00, 1);

-- ORDER DETAILS
INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 3, 1, 17000000.00);

-- REVIEWS
INSERT INTO reviews (review_id, product_id, user_id, rating, comment) VALUES
  (1, 3, 2, 5, 'Đeo rất đẹp, máy chạy ổn định.');

SET FOREIGN_KEY_CHECKS = 1;
