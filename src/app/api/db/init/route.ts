import { NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';

// GET - 测试数据库连接
export async function GET() {
  const result = await testConnection();
  
  if (result.success) {
    return NextResponse.json({
      code: 200,
      message: result.message,
      data: null
    });
  } else {
    return NextResponse.json({
      code: 500,
      message: result.message,
      data: null
    }, { status: 500 });
  }
}

// POST - 初始化数据库表
export async function POST() {
  try {
    // 创建 Flower 数据库（如果不存在）
    try {
      await query('CREATE DATABASE IF NOT EXISTS Flower');
    } catch (e) {
      // 忽略数据库已存在的错误
    }

    // 切换到 Flower 数据库
    await query('USE Flower');

    // 创建管理员表
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        name VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'operator',
        email VARCHAR(100),
        avatar VARCHAR(255),
        last_login_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // 创建分类表
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        parent_id INT NOT NULL DEFAULT 0,
        level INT NOT NULL DEFAULT 1,
        sort_order INT NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_parent (parent_id),
        INDEX idx_level (level)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // 创建商品表
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        subcategory VARCHAR(50) NOT NULL DEFAULT '',
        category_ids VARCHAR(255) NOT NULL DEFAULT '',
        price DECIMAL(10, 2) NOT NULL,
        market_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        stock_quantity INT NOT NULL DEFAULT 0,
        initial_stock INT NOT NULL DEFAULT 0,
        unit VARCHAR(20) NOT NULL DEFAULT '枝',
        images TEXT,
        description TEXT,
        tags TEXT,
        sales_count INT NOT NULL DEFAULT 0,
        status TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category_ids),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // 创建库存表
    await query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL UNIQUE,
        current_stock INT NOT NULL DEFAULT 0,
        safe_stock INT NOT NULL DEFAULT 0,
        ai_threshold INT DEFAULT NULL,
        warning_enabled TINYINT DEFAULT 1,
        status VARCHAR(20) NOT NULL DEFAULT 'sufficient',
        last_update_time DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_product (product_id),
        INDEX idx_status (status),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // 创建出入库记录表
    await query(`
      CREATE TABLE IF NOT EXISTS stock_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        type VARCHAR(10) NOT NULL,
        sub_type VARCHAR(20) NOT NULL,
        quantity INT NOT NULL,
        operator VARCHAR(50) NOT NULL,
        remark VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_product (product_id),
        INDEX idx_type (type),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // 创建操作日志表
    await query(`
      CREATE TABLE IF NOT EXISTS operation_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        username VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        target_type VARCHAR(50),
        target_id INT,
        detail TEXT,
        ip_address VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_action (action),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    return NextResponse.json({
      code: 200,
      message: '数据库表初始化成功',
      data: {
        tables: ['admins', 'categories', 'products', 'inventory', 'stock_records', 'operation_logs']
      }
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      code: 500,
      message: `初始化失败: ${err.message}`,
      data: null
    }, { status: 500 });
  }
}
