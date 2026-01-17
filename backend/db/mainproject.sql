-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 15, 2026 lúc 03:47 PM
-- Phiên bản máy phục vụ: 8.0.44
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `mainproject`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`id`, `name`, `status`, `created_at`, `updated_at`, `description`) VALUES
(1, 'Rolex', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Rolex - thương hiệu đồng hồ cao cấp'),
(2, 'Tudor', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Tudor - thương hiệu thể thao/đồng hồ lặn'),
(3, 'Tissot', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Tissot - thương hiệu Thụy Sĩ phổ biến'),
(4, 'Cartier', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Cartier - thương hiệu thời trang cao cấp'),
(5, 'Audemars Piguet', 'ACTIVE', '2026-01-10 18:52:30', NULL, 'Audemars Piguet - Haute Horlogerie'),
(6, 'IWC', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'IWC - thương hiệu đồng hồ phi công'),
(7, 'Fossil', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Fossil - thương hiệu thời trang'),
(8, 'Seiko', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Seiko - thương hiệu Nhật Bản'),
(9, 'brand', 'ACTIVE', '2026-01-12 18:30:27', NULL, '123456');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `status`, `created_at`, `updated_at`, `description`) VALUES
(1, 'Luxury', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Đồng hồ cao cấp'),
(2, 'Dive', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Đồng hồ lặn'),
(3, 'Sport', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Đồng hồ thể thao'),
(4, 'Dress', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Đồng hồ dress/thời trang'),
(5, 'Pilot', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Đồng hồ phi công'),
(6, 'Automatic', 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 21:03:43', 'Đồng hồ cơ tự động');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `discounts`
--

CREATE TABLE `discounts` (
  `discount_id` bigint NOT NULL,
  `code` varchar(255) NOT NULL,
  `type` enum('FIX','PERCENT') NOT NULL,
  `start_at` timestamp NOT NULL,
  `end_at` timestamp NOT NULL,
  `value` decimal(38,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `used_quantity` int NOT NULL DEFAULT '0',
  `status` enum('ACTIVE','INACTIVE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `discounts`
--

INSERT INTO `discounts` (`discount_id`, `code`, `type`, `start_at`, `end_at`, `value`, `stock`, `used_quantity`, `status`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME100K', 'FIX', '2026-01-11 17:00:00', '2026-01-15 17:00:00', 100000.00, 100, 2, 'ACTIVE', '2026-01-10 18:52:30', '2026-01-12 20:10:29'),
(2, 'SALE10', 'PERCENT', '2026-01-10 17:00:00', '2026-01-21 17:00:00', 10.00, 5, 3, 'ACTIVE', '2026-01-10 18:52:30', '2026-01-13 13:13:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint NOT NULL,
  `code` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` bigint NOT NULL,
  `status` enum('CREATED','SHIPPING','COMPLETED','CANCELED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'CREATED',
  `receiver_name` varchar(255) NOT NULL,
  `receiver_phone` varchar(50) NOT NULL,
  `shipping_address` varchar(500) NOT NULL,
  `payment_method` enum('BANK_TRANSFER','CASH') NOT NULL,
  `final_price` decimal(38,2) NOT NULL,
  `discount_id` bigint DEFAULT NULL,
  `end_at` datetime(6) DEFAULT NULL,
  `receive_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`order_id`, `code`, `created_at`, `user_id`, `status`, `receiver_name`, `receiver_phone`, `shipping_address`, `payment_method`, `final_price`, `discount_id`, `end_at`, `receive_at`) VALUES
(1, 'ORD-0001', '2026-01-10 18:52:30', 2, 'SHIPPING', 'Khách hàng', '0911111111', 'Hà Nội', 'CASH', 17000000.00, 1, NULL, NULL),
(2, 'ORD-0002', '2026-01-10 18:52:30', 2, 'COMPLETED', 'Khách hàng', '0911111111', 'Hà Nội', 'BANK_TRANSFER', 116500000.00, NULL, '2026-01-12 19:21:04.004000', NULL),
(3, 'WELCOME100K', '2026-01-12 19:03:27', 1, 'CREATED', '3454326', '2547245', 'srhjtjtjt', 'CASH', 163546.00, NULL, NULL, NULL),
(4, 'ORD-003', '2026-01-12 19:21:59', 1, 'COMPLETED', '3454326', '2547245', 'srhjtjtjt', 'CASH', 123456.00, NULL, '2026-01-12 19:21:59.187000', NULL),
(5, 'ORD-D6E787AB9B', '2026-01-12 20:00:13', 4, 'COMPLETED', '3454326', '2547245', '5ediiiikd7yko', 'CASH', 34000000.00, 1, '2026-01-12 20:00:59.193000', NULL),
(6, 'ORD-A5ABECF97F', '2026-01-12 20:02:35', 4, 'CANCELED', 'ci658', '6585675', 'ci66', 'BANK_TRANSFER', 6000000.00, NULL, NULL, NULL),
(7, 'ORD-1FF8FE858D', '2026-01-12 20:04:55', 4, 'COMPLETED', 'ci658', '6585675', 'hrbneaw', 'BANK_TRANSFER', 6500000.00, NULL, '2026-01-12 20:08:33.730000', NULL),
(8, 'ORD-3E6A2806BD', '2026-01-12 20:10:29', 4, 'COMPLETED', '123456', '123456', '123456', 'BANK_TRANSFER', 17500000.00, 1, '2026-01-12 20:11:01.826000', NULL),
(11, 'ORD-5FF6E202B9', '2026-01-13 13:13:33', 4, 'COMPLETED', 'user000', '123456', '123456', 'BANK_TRANSFER', 180000000.00, 2, '2026-01-13 13:14:15.919000', NULL),
(12, 'ORD-2E011B4380', '2026-01-14 08:04:39', 3, 'SHIPPING', 'user', '123456', '123456', 'CASH', 28000000.00, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_details`
--

CREATE TABLE `order_details` (
  `order_detail_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(38,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `order_details`
--

INSERT INTO `order_details` (`order_detail_id`, `order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 3, 1, 17000000.00),
(2, 2, 2, 1, 110000000.00),
(3, 2, 7, 1, 6500000.00),
(7, 3, 2, 1, 163546.00),
(16, 4, 2, 1, 123456.00),
(17, 5, 3, 2, 17000000.00),
(21, 6, 7, 1, 6000000.00),
(22, 7, 8, 1, 6500000.00),
(30, 8, 8, 1, 6500000.00),
(31, 8, 9, 1, 11000000.00),
(36, 11, 2, 1, 110000000.00),
(37, 11, 4, 1, 90000000.00),
(38, 12, 7, 1, 6000000.00),
(39, 12, 9, 2, 11000000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `product_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `sold_quantity` int NOT NULL DEFAULT '0',
  `code` varchar(255) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `description` text,
  `status` enum('IN_STOCK','OUT_OF_STOCK') NOT NULL DEFAULT 'IN_STOCK'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `name`, `brand_id`, `category_id`, `stock`, `sold_quantity`, `code`, `image`, `price`, `description`, `status`) VALUES
(2, 'Tudor Black Bay Fifty-Eight', 2, 2, 5, 4, 'TUDOR-BB58', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252207/mainproject/products/17810501_1.avif', 110000000.00, 'Tudor Black Bay 58 - phong cách diver cổ điển.', 'IN_STOCK'),
(3, 'Tissot PRX Powermatic 80 35mm', 3, 3, 23, 7, 'TISSOT-PRX35', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252205/mainproject/products/17631295_1.avif', 17000000.00, 'Tissot PRX Powermatic 80 - máy cơ, thiết kế thể thao.', 'IN_STOCK'),
(4, 'Cartier Tank Must Small', 4, 4, 3, 4, 'CARTIER-TANK', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252224/mainproject/products/m126334-0014.avif', 90000000.00, 'Cartier Tank Must - biểu tượng dress watch.', 'IN_STOCK'),
(5, 'Audemars Piguet Royal Oak 41', 5, 1, 2, 0, 'AP-RO41', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252222/mainproject/products/h69439411.avif', 950000000.00, 'Royal Oak 41 - thiết kế thể thao sang trọng.', 'IN_STOCK'),
(6, 'IWC Pilot Mark XVIII', 6, 5, 7, 1, 'IWC-MARK18', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252207/mainproject/products/17810501_1.avif', 120000000.00, 'IWC Mark XVIII - phong cách phi công cổ điển.', 'IN_STOCK'),
(7, 'Fossil ME3260', 7, 6, 28, 12, 'FOSSIL-ME3260', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252226/mainproject/products/ME3260_main.jpg', 6000000.00, 'Fossil ME3260 - máy cơ, phù hợp hằng ngày.', 'IN_STOCK'),
(8, 'Fossil ME3268', 7, 6, 18, 10, 'FOSSIL-ME3268', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252228/mainproject/products/ME3268_main.jpg', 6500000.00, 'Fossil ME3268 - máy cơ, thiết kế trẻ trung.', 'IN_STOCK'),
(9, 'Seiko Cocktail Time', 8, 4, 9, 6, 'SEIKO-CT', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252205/mainproject/products/17631295_1.avif', 11000000.00, 'Seiko Cocktail Time - mặt số nổi bật, hợp dress.', 'IN_STOCK'),
(12, 'Rolex Submariner Date', 1, 2, 5, 1, 'ROLEX-SUB-DATE', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252205/mainproject/products/17631295_1.avif', 320000000.00, 'Rolex Submariner Date - biểu tượng diver, bền bỉ và sang trọng.', 'IN_STOCK'),
(13, 'Rolex Datejust 36', 1, 1, 4, 0, 'ROLEX-DATEJUST-36', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252207/mainproject/products/17810501_1.avif', 280000000.00, 'Rolex Datejust 36 - thanh lịch, phù hợp đi làm và sự kiện.', 'IN_STOCK'),
(14, 'Tudor Pelagos', 2, 2, 7, 2, 'TUDOR-PELAGOS', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252207/mainproject/products/17810501_1.avif', 125000000.00, 'Tudor Pelagos - diver tool-watch, mạnh mẽ, dễ đeo hằng ngày.', 'IN_STOCK'),
(15, 'Tissot Le Locle Powermatic 80', 3, 4, 20, 6, 'TISSOT-LELOCLE', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252224/mainproject/products/m126334-0014.avif', 14500000.00, 'Tissot Le Locle - dress watch phổ biến, máy Powermatic 80.', 'IN_STOCK'),
(16, 'Cartier Santos Medium', 4, 4, 3, 0, 'CARTIER-SANTOS', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252222/mainproject/products/h69439411.avif', 185000000.00, 'Cartier Santos - thiết kế vuông cổ điển, sang trọng.', 'IN_STOCK'),
(17, 'IWC Big Pilot', 6, 5, 2, 0, 'IWC-BIGPILOT', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252207/mainproject/products/17810501_1.avif', 260000000.00, 'IWC Big Pilot - phong cách phi công đặc trưng, mặt số dễ đọc.', 'IN_STOCK'),
(18, 'Seiko 5 Sports', 8, 3, 50, 15, 'SEIKO-5-SPORTS', 'https://res.cloudinary.com/djdretugz/image/upload/v1768252205/mainproject/products/17631295_1.avif', 6500000.00, 'Seiko 5 Sports - lựa chọn thể thao, bền bỉ, dễ tiếp cận.', 'IN_STOCK');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `review_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `rating` int NOT NULL,
  `comment` text
) ;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`review_id`, `product_id`, `user_id`, `rating`, `comment`) VALUES
(1, 3, 2, 5, 'Đeo rất đẹp, máy chạy ổn định.'),
(2, 2, 2, 5, 'Chất lượng hoàn thiện tốt, rất hài lòng.'),
(3, 7, 2, 4, 'Giá tốt, phù hợp tầm tiền.'),
(8, 8, 4, 5, 'abc');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `role` enum('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `created_at` datetime(6) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `role`, `created_at`, `updated_at`, `email`, `gender`, `name`, `password_hash`, `phone`, `address`) VALUES
(1, 'ADMIN', '2026-01-11 01:52:30.836479', '2026-01-12 21:03:43', 'admin@watchstore.vn', 'MALE', 'Admin', '$2a$10$z.crOeYOJVC/o26OIf8lU.jH46.z.OANbhLV7HV7c1/.uPOTA7WiG', '0900000000', 'Hà Nội'),
(2, 'CUSTOMER', '2026-01-11 01:52:30.836479', '2026-01-12 21:03:43', 'user@watchstore.vn', 'FEMALE', 'Khách hàng', '123456', '0911111111', 'Hà Nội'),
(3, 'CUSTOMER', '2026-01-12 11:45:04.898336', NULL, 'user@gmail.com', 'male', 'user', '$2a$10$A5slMHyXkaNVy2o7/TJ7sO/6qjzyfcPSorfJ2H7ehnqQ2B4xZ3kLC', NULL, NULL),
(4, 'ADMIN', '2026-01-12 11:52:42.679320', NULL, 'admin@gmail.com', NULL, 'admin', '$2a$10$4b.pQt6kpTx5sIVMV7Ql0OzKaS/UQQN1dptaWPHDOTVPB4xCGl112', NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`discount_id`),
  ADD UNIQUE KEY `uk_discounts_code` (`code`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `uk_orders_code` (`code`),
  ADD KEY `idx_orders_user_id` (`user_id`),
  ADD KEY `idx_orders_discount_id` (`discount_id`);

--
-- Chỉ mục cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`order_detail_id`),
  ADD UNIQUE KEY `uk_order_details_order_product` (`order_id`,`product_id`),
  ADD KEY `idx_order_details_product_id` (`product_id`),
  ADD KEY `idx_order_details_order_id` (`order_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `uk_products_code` (`code`),
  ADD KEY `idx_products_brand_id` (`brand_id`),
  ADD KEY `idx_products_category_id` (`category_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `idx_reviews_product_id` (`product_id`),
  ADD KEY `idx_reviews_user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `discounts`
--
ALTER TABLE `discounts`
  MODIFY `discount_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `order_details`
--
ALTER TABLE `order_details`
  MODIFY `order_detail_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_discount` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`discount_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `fk_order_details_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_details_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
