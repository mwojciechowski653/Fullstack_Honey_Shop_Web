-- Użytkownicy
CREATE TABLE "USER" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adresy użytkowników
CREATE TABLE "USER_ADDRESS" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
    country VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    street VARCHAR(100) NOT NULL,
    street_number VARCHAR(20) NOT NULL,
    postal_code VARCHAR(20) NOT NULL
);

-- Produkty
CREATE TABLE "PRODUCT" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255),
    category VARCHAR(100),
    key_features TEXT,
    description TEXT,
    image_url TEXT
);

-- Opcje rozmiarów produktów
CREATE TABLE "SIZE_OPTION" (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES "PRODUCT"(id) ON DELETE CASCADE,
    size VARCHAR(3) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    regular_price NUMERIC(10,2) NOT NULL,
    is_discounted BOOLEAN DEFAULT FALSE,
    discounted_price NUMERIC(10,2)
);

-- Zamówienia
CREATE TABLE "ORDER" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Processing',
    invoice_id VARCHAR(50),
    order_value NUMERIC(10,2) NOT NULL
);

-- Produkty w zamówieniach
CREATE TABLE "ORDER_PRODUCT" (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES "ORDER"(id) ON DELETE CASCADE,
    size_option_id INT NOT NULL REFERENCES "SIZE_OPTION"(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

-- Statystyka logowań
CREATE TABLE monthly_sign_ins (
    month VARCHAR(7) PRIMARY KEY, -- np. 2025-08
    sign_in_count INT DEFAULT 0
);

-- DANE POCZĄTKOWE

-- Użytkownicy
-- Oboje mają zahaszowane hasło Pass123@
INSERT INTO "USER" (email, password, first_name, last_name, phone, is_admin) VALUES
('admin@honeyshop.com', '$2b$10$tFnnhQ0.akQsKgOV/hZjYeIhqJQ8yYvkPrT5h1DvXuJ9CFPl4Wna2', 'Anna', 'Admin', '+48123456789', TRUE),
('jan@kowalski.com', '$2b$10$tFnnhQ0.akQsKgOV/hZjYeIhqJQ8yYvkPrT5h1DvXuJ9CFPl4Wna2', 'Jan', 'Kowalski', '+48987654321', FALSE);

-- Adresy
INSERT INTO "USER_ADDRESS" (user_id, country, city, street, street_number, postal_code) VALUES
(1, 'Poland', 'Warsaw', 'Main Street', '1', '00-001'),
(2, 'Poland', 'Krakow', 'Honey Street', '10', '30-001');

-- Produkty
INSERT INTO "PRODUCT" (name, full_name, category, key_features, description, image_url) VALUES
('Acacia Honey', 'Premium Acacia Honey', 'Acacia', 'Light taste;Natural origin;boosts immunity system', 'Delicious honey from acacia flowers.', 'http://localhost:8080/images/AcaciaImage.jpg'),
('Buckwheat Honey', 'Strong Buckwheat Honey', 'Buckwheat', 'Intense aroma;High in minerals;Light taste', 'Rich taste and health benefits.', 'http://localhost:8080/images/BuckwheatImage.png');

-- Opcje rozmiarów
INSERT INTO "SIZE_OPTION" (product_id, size, stock, regular_price, is_discounted, discounted_price) VALUES
(1, '200', 100, 15.00, FALSE, NULL),
(1, '300', 50, 25.00, TRUE, 20.00),
(2, '900', 80, 12.00, FALSE, NULL);

-- Zamówienie przykładowe
INSERT INTO "ORDER" (user_id, status, order_value) VALUES
(2, 'Processing', 40.00);

-- Produkty w zamówieniu
INSERT INTO "ORDER_PRODUCT" (order_id, size_option_id, quantity, price) VALUES
(1, 1, 2, 15.00),
(1, 3, 1, 12.00);

-- Statystyka logowań
INSERT INTO monthly_sign_ins (month, sign_in_count) VALUES
('2025-08', 5),
('2025-07', 10);
