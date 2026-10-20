-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS LOCAL MYSQL
-- Proyecto Web Vanilla + MySQL
-- ============================================================================

-- 1. Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS proyecto_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- 2. Seleccionar la base de datos
USE proyecto_db;

-- 3. Crear tabla de ejemplo: users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Insertar datos de prueba iniciales
INSERT INTO users (name, email, password) VALUES
  ('Ana García', 'ana.garcia@example.com', '$2y$12$K2866.OhTb17LBr9Tw.hq.uIBy6CLEvNYSce8T7XhMnc/7h26KKme'),
  ('Carlos Mendoza', 'carlos.mendoza@example.com', '$2y$12$K2866.OhTb17LBr9Tw.hq.uIBy6CLEvNYSce8T7XhMnc/7h26KKme'),
  ('Sofía López', 'sofia.lopez@example.com', '$2y$12$K2866.OhTb17LBr9Tw.hq.uIBy6CLEvNYSce8T7XhMnc/7h26KKme')
ON DUPLICATE KEY UPDATE name = VALUES(name);
