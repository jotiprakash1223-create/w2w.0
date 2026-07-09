-- Database schema for Waste2Wealth Flask & MySQL backend
CREATE DATABASE IF NOT EXISTS waste2wealth;
USE waste2wealth;

-- Users table storing both regular users and recyclers
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    role ENUM('user', 'recycler') NOT NULL DEFAULT 'user',
    reward_points INT DEFAULT 0,
    co2_saved DECIMAL(10, 2) DEFAULT 0.00, -- In kg
    trees_planted INT DEFAULT 0,
    water_saved DECIMAL(10, 2) DEFAULT 0.00, -- In Liters
    company_name VARCHAR(255) DEFAULT NULL, -- Only for recyclers
    rating DECIMAL(3, 2) DEFAULT 5.00, -- Only for recyclers
    earnings DECIMAL(10, 2) DEFAULT 0.00, -- Only for recyclers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Waste requests scheduled by users
CREATE TABLE IF NOT EXISTS waste_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    waste_type VARCHAR(100) NOT NULL, -- Plastic, Paper, Glass, Metal, E-Waste, Mixed
    quantity DECIMAL(10, 2) NOT NULL, -- In kg
    pickup_address TEXT NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    preferred_pickup_date DATE NOT NULL,
    status ENUM('Pending', 'Accepted', 'Collected', 'Completed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance on analytical queries
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_request_status ON waste_requests(status);
CREATE INDEX idx_request_user ON waste_requests(user_id);
