-- 创建数据库（如果不存在）
-- CREATE DATABASE IF NOT EXISTS flower;
-- USE flower;

-- 商品分类表
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id VARCHAR(50),
  level INT DEFAULT 1,
  sort INT DEFAULT 0,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category_id VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  market_price DECIMAL(10, 2),
  stock INT DEFAULT 0,
  unit VARCHAR(20) DEFAULT '束',
  images TEXT,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  tags TEXT,
  sales_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 库存表
CREATE TABLE IF NOT EXISTS inventory (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  current_stock INT DEFAULT 0,
  safe_stock INT DEFAULT 10,
  status VARCHAR(20) DEFAULT 'sufficient',
  last_update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ai_threshold INT
);

-- 出入库记录表
CREATE TABLE IF NOT EXISTS stock_records (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  type VARCHAR(10) NOT NULL,
  sub_type VARCHAR(50),
  quantity INT NOT NULL,
  operator VARCHAR(100),
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例分类数据
INSERT INTO categories (id, name, parent_id, level, sort) VALUES
('cat-1', '玫瑰', NULL, 1, 1),
('cat-2', '康乃馨', NULL, 1, 2),
('cat-3', '百合', NULL, 1, 3),
('cat-4', '满天星', NULL, 1, 4),
('cat-5', '向日葵', NULL, 1, 5),
('cat-6', '郁金香', NULL, 1, 6),
('cat-7', '绿植盆栽', NULL, 1, 7),
('cat-1-1', '红玫瑰', 'cat-1', 2, 1),
('cat-1-2', '粉玫瑰', 'cat-1', 2, 2),
('cat-1-3', '白玫瑰', 'cat-1', 2, 3),
('cat-1-4', '香槟玫瑰', 'cat-1', 2, 4),
('cat-2-1', '红色康乃馨', 'cat-2', 2, 1),
('cat-2-2', '粉色康乃馨', 'cat-2', 2, 2),
('cat-3-1', '白百合', 'cat-3', 2, 1),
('cat-3-2', '黄百合', 'cat-3', 2, 2);

-- 插入示例商品数据
INSERT INTO products (id, name, category_id, price, market_price, stock, unit, images, description, status, tags, sales_count) VALUES
('prod-1', '红玫瑰50枝', 'cat-1-1', 199.00, 259.00, 100, '束', '["https://images.unsplash.com/photo-1518882605630-8eb259d文4a?w=400"]', '云南昆明空运A级红玫瑰，50枝装，新鲜保水，适合表白求婚', 'active', '["热销","表白","求婚"]', 520),
('prod-2', '粉玫瑰30枝', 'cat-1-2', 129.00, 169.00, 80, '束', '["https://images.unsplash.com/photo-1607077640495-0e59f27a75ec?w=400"]', '粉玫瑰30枝，象征初恋与温馨，适合送女友', 'active', '["推荐","送女友"]', 320),
('prod-3', '白玫瑰20枝', 'cat-1-3', 99.00, 129.00, 60, '束', '["https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400"]', '白玫瑰20枝，纯洁高雅，适合婚礼或道歉', 'active', '["婚礼","道歉"]', 180),
('prod-4', '香槟玫瑰11枝', 'cat-1-4', 159.00, 199.00, 50, '束', '["https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400"]', '香槟玫瑰11枝，唯一最爱，适合纪念日', 'active', '["纪念日","浪漫"]', 280),
('prod-5', '康乃馨19枝', 'cat-2-1', 89.00, 109.00, 120, '束', '["https://images.unsplash.com/photo-1522543558187-768b6df7c25c?w=400"]', '红色康乃馨19枝，送给母亲长辈的最佳选择', 'active', '["送母亲","长辈"]', 450),
('prod-6', '百合花5枝', 'cat-3-1', 79.00, 99.00, 40, '束', '["https://images.unsplash.com/photo-1527871017347-8a4c52dc7247?w=400"]', '白百合5枝，百年好合，适合新婚祝福', 'active', '["新婚","祝福"]', 200),
('prod-7', '满天星200g', 'cat-4', 49.00, 69.00, 200, '份', '["https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400"]', '满天星干花200g，可做配花或单独瓶插', 'active', '["配花","干花"]', 380),
('prod-8', '向日葵5枝', 'cat-5', 59.00, 79.00, 70, '束', '["https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400"]', '向日葵5枝，阳光开朗，适合送朋友或开业', 'active', '["送朋友","开业"]', 160),
('prod-9', '郁金香10枝', 'cat-6', 139.00, 179.00, 35, '束', '["https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400"]', '荷兰进口郁金香10枝，高贵典雅', 'active', '["进口","高典雅"]', 90),
('prod-10', '绿萝盆栽', 'cat-7', 39.00, 49.00, 150, '盆', '["https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400"]', '绿萝小盆栽，净化空气，易养活', 'active', '["绿植","净化空气"]', 620);

-- 插入库存数据
INSERT INTO inventory (id, product_id, current_stock, safe_stock, status) VALUES
('inv-1', 'prod-1', 100, 20, 'sufficient'),
('inv-2', 'prod-2', 80, 15, 'sufficient'),
('inv-3', 'prod-3', 60, 10, 'sufficient'),
('inv-4', 'prod-4', 50, 10, 'sufficient'),
('inv-5', 'prod-5', 120, 30, 'sufficient'),
('inv-6', 'prod-6', 40, 8, 'sufficient'),
('inv-7', 'prod-7', 200, 50, 'sufficient'),
('inv-8', 'prod-8', 70, 15, 'sufficient'),
('inv-9', 'prod-9', 35, 8, 'low'),
('inv-10', 'prod-10', 150, 30, 'sufficient');

-- 插入出入库记录
INSERT INTO stock_records (id, product_id, type, sub_type, quantity, operator, remark) VALUES
('record-1', 'prod-1', 'in', 'purchase', 100, 'admin', '批量采购入库'),
('record-2', 'prod-2', 'in', 'purchase', 80, 'admin', '供应商直发'),
('record-3', 'prod-5', 'in', 'purchase', 120, 'admin', '节日备货'),
('record-4', 'prod-1', 'out', 'sale', 5, '店员小李', '顾客购买'),
('record-5', 'prod-5', 'out', 'sale', 3, '店员小王', '母亲节订单'),
('record-6', 'prod-10', 'in', 'purchase', 150, 'admin', '绿植供应商供货');
