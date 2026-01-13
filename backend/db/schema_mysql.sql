SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  role ENUM('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  created_at DATETIME(6) NOT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  email VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NULL,
  address VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS brands (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  description TEXT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  description TEXT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  product_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  brand_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  sold_quantity INT NOT NULL DEFAULT 0,
  code VARCHAR(100) NOT NULL,
  image VARCHAR(500) NULL,
  price DECIMAL(19,2) NOT NULL,
  description TEXT,
  status ENUM('IN_STOCK','OUT_OF_STOCK') NOT NULL DEFAULT 'IN_STOCK',
  PRIMARY KEY (product_id),
  UNIQUE KEY uk_products_code (code),
  KEY idx_products_brand_id (brand_id),
  KEY idx_products_category_id (category_id),
  CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS discounts (
  discount_id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL,
  type ENUM('FIX','PERCENT') NOT NULL,
  start_at TIMESTAMP NOT NULL,
  end_at TIMESTAMP NOT NULL,
  value DECIMAL(19,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  used_quantity INT NOT NULL DEFAULT 0,
  status ENUM('ACTIVE','INACTIVE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (discount_id),
  UNIQUE KEY uk_discounts_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  order_id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT NOT NULL,
  status ENUM('CREATED','SHIPPING','COMPLETED','CANCELED') NOT NULL DEFAULT 'CREATED',
  receiver_name VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(50) NOT NULL,
  shipping_address VARCHAR(500) NOT NULL,
  receive_at TIMESTAMP NULL DEFAULT NULL,
  end_at TIMESTAMP NULL DEFAULT NULL,
  payment_method ENUM('BANK_TRANSFER','CASH') NOT NULL,
  final_price DECIMAL(19,2) NOT NULL,
  discount_id BIGINT NULL,
  PRIMARY KEY (order_id),
  UNIQUE KEY uk_orders_code (code),
  KEY idx_orders_user_id (user_id),
  KEY idx_orders_discount_id (discount_id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_orders_discount FOREIGN KEY (discount_id) REFERENCES discounts(discount_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_details (
  order_detail_id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(19,2) NOT NULL,
  PRIMARY KEY (order_detail_id),
  UNIQUE KEY uk_order_details_order_product (order_id, product_id),
  KEY idx_order_details_order_id (order_id),
  KEY idx_order_details_product_id (product_id),
  CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  review_id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NULL,
  PRIMARY KEY (review_id),
  KEY idx_reviews_product_id (product_id),
  KEY idx_reviews_user_id (user_id),
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
