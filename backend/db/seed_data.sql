SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Reset data
TRUNCATE TABLE order_details;
TRUNCATE TABLE reviews;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE discounts;
TRUNCATE TABLE categories;
TRUNCATE TABLE brands;
TRUNCATE TABLE users;

-- USERS
INSERT INTO users (id, role, created_at, updated_at, email, gender, name, password_hash, phone, address)
VALUES
  (1, 'ADMIN',    NOW(6), NULL, 'admin@watchstore.vn', 'MALE',   'Admin', 'admin123', '0900000000', 'Hà Nội'),
  (2, 'CUSTOMER', NOW(6), NULL, 'user@watchstore.vn',  'FEMALE', 'Khách hàng', '123456', '0911111111', 'Hà Nội');

-- BRANDS
INSERT INTO brands (id, name, status, description) VALUES
  (1, 'Rolex', 'ACTIVE', 'Rolex - thương hiệu đồng hồ cao cấp'),
  (2, 'Tudor', 'ACTIVE', 'Tudor - đồng hồ thể thao/đi biển'),
  (3, 'Tissot', 'ACTIVE', 'Tissot - đồng hồ Thụy Sĩ phổ biến'),
  (4, 'Cartier', 'ACTIVE', 'Cartier - đồng hồ thời trang cao cấp'),
  (5, 'Audemars Piguet', 'ACTIVE', 'Audemars Piguet - Haute Horlogerie'),
  (6, 'IWC', 'ACTIVE', 'IWC - đồng hồ phi công'),
  (7, 'Fossil', 'ACTIVE', 'Fossil - đồng hồ thời trang'),
  (8, 'Seiko', 'ACTIVE', 'Seiko - đồng hồ Nhật Bản');

-- CATEGORIES
INSERT INTO categories (id, name, status, description) VALUES
  (1, 'Luxury', 'ACTIVE', 'Đồng hồ cao cấp'),
  (2, 'Dive', 'ACTIVE', 'Đồng hồ lặn'),
  (3, 'Sport', 'ACTIVE', 'Đồng hồ thể thao'),
  (4, 'Dress', 'ACTIVE', 'Đồng hồ dress/thời trang'),
  (5, 'Pilot', 'ACTIVE', 'Đồng hồ phi công'),
  (6, 'Automatic', 'ACTIVE', 'Đồng hồ cơ tự động');

-- PRODUCTS 
INSERT INTO products (product_id, name, brand_id, category_id, stock, sold_quantity, code, image, price, description, status) VALUES
  (1, 'Rolex Datejust 41', 1, 1, 10, 2, 'ROLEX-DJ41', '/assets/images/products/m126334-0014.avif', 250000000.00, 'Rolex Datejust 41 - thiết kế sang trọng, phù hợp nhiều dịp.', 'IN_STOCK'),
  (2, 'Tudor Black Bay Fifty-Eight', 2, 2, 8, 1, 'TUDOR-BB58', '/assets/images/products/m79030n-0001-tudor-black-bay-fifty-eight-tdr0119547.png', 110000000.00, 'Tudor Black Bay 58 - phong cách diver cổ điển.', 'IN_STOCK'),
  (3, 'Tissot PRX Powermatic 80 35mm', 3, 3, 25, 5, 'TISSOT-PRX35', '/assets/images/products/tissot-watches-tissot-prx-powermatic-80-35mm-ss-champagne-dial-unisex-watch-t137.207.33.021.00__35088.jpg', 17000000.00, 'Tissot PRX Powermatic 80 - máy cơ, thiết kế thể thao.', 'IN_STOCK'),
  (4, 'Cartier Tank Must Small', 4, 4, 6, 1, 'CARTIER-TANK', '/assets/images/products/cartier-tank-must-small-size-quartz-white-dial-unisex-watch-wsta0110.jpg', 90000000.00, 'Cartier Tank Must - biểu tượng dress watch.', 'IN_STOCK'),
  (5, 'Audemars Piguet Royal Oak 41', 5, 1, 2, 0, 'AP-RO41', '/assets/images/products/WatchGuyNYC_APO48_Audemars_Piguet_Royal_Oak_41mm_Silver-toned_Dial_Stainless_Steel_Bracelet_Men_s_Watch_15400ST.OO.1220ST.02.webp', 950000000.00, 'Royal Oak 41 - thiết kế thể thao sang trọng.', 'IN_STOCK'),
  (6, 'IWC Pilot Mark XVIII', 6, 5, 7, 1, 'IWC-MARK18', '/assets/images/products/IW0083_IWC_Pilot_s_Watch_Mark_XVIII_Antoine_de_Saint_Exupery_in_Steel_on_Strap_with_White_Dial_IW327017_large.webp', 120000000.00, 'IWC Mark XVIII - phong cách phi công cổ điển.', 'IN_STOCK'),
  (7, 'Fossil ME3260', 7, 6, 30, 10, 'FOSSIL-ME3260', '/assets/images/products/ME3260_main.jfif', 6000000.00, 'Fossil ME3260 - máy cơ, phù hợp hằng ngày.', 'IN_STOCK'),
  (8, 'Fossil ME3268', 7, 6, 20, 8, 'FOSSIL-ME3268', '/assets/images/products/ME3268_main.jfif', 6500000.00, 'Fossil ME3268 - máy cơ, thiết kế trẻ trung.', 'IN_STOCK'),
  (9, 'Seiko Cocktail Time', 8, 4, 12, 3, 'SEIKO-CT', '/assets/images/products/cocktailtime_mega.png', 11000000.00, 'Seiko Cocktail Time - mặt số đẹp, hợp dress.', 'IN_STOCK');

-- DISCOUNTS
INSERT INTO discounts (discount_id, code, type, start_at, end_at, value, stock, used_quantity, status) VALUES
  (1, 'WELCOME100K', 'FIX', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 100000.00, 100, 0, 'ACTIVE'),
  (2, 'SALE10', 'PERCENT', NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 10.00, 200, 0, 'ACTIVE');

-- ORDERS
INSERT INTO orders (order_id, code, created_at, user_id, status, receiver_name, receiver_phone, shipping_address, receive_at, end_at, payment_method, final_price, discount_id)
VALUES
  (1, 'ORD-0001', NOW(), 2, 'CREATED', 'Khách hàng', '0911111111', 'Hà Nội', NULL, NULL, 'CASH', 16900000.00, 1),
  (2, 'ORD-0002', NOW(), 2, 'COMPLETED', 'Khách hàng', '0911111111', 'Hà Nội', NOW(), NOW(), 'BANK_TRANSFER', 116500000.00, NULL);

-- ORDER DETAILS
INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 3, 1, 17000000.00),
  (2, 2, 2, 1, 110000000.00),
  (3, 2, 7, 1, 6500000.00);

-- REVIEWS
INSERT INTO reviews (review_id, product_id, user_id, rating, comment) VALUES
  (1, 3, 2, 5, 'Đeo rất đẹp, máy chạy ổn định.'),
  (2, 2, 2, 5, 'Chất lượng hoàn thiện tốt, rất hài lòng.'),
  (3, 7, 2, 4, 'Giá tốt, phù hợp tầm tiền.');

SET FOREIGN_KEY_CHECKS = 1;
