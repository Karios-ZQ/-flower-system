import { pgTable, text, numeric, integer, timestamp, varchar } from 'drizzle-orm/pg-core';

// 商品表
export const products = pgTable('products', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  categoryId: varchar('category_id', { length: 50 }),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  marketPrice: numeric('market_price', { precision: 10, scale: 2 }),
  stock: integer('stock').default(0),
  unit: varchar('unit', { length: 20 }).default('束'),
  images: text('images'), // JSON string array
  description: text('description'),
  status: varchar('status', { length: 20 }).default('active'),
  tags: text('tags'), // JSON string array
  salesCount: integer('sales_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 商品分类表
export const categories = pgTable('categories', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  parentId: varchar('parent_id', { length: 50 }),
  level: integer('level').default(1),
  sort: integer('sort').default(0),
  icon: varchar('icon', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 库存表
export const inventory = pgTable('inventory', {
  id: varchar('id', { length: 50 }).primaryKey(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  currentStock: integer('current_stock').default(0),
  safeStock: integer('safe_stock').default(10),
  status: varchar('status', { length: 20 }).default('sufficient'),
  lastUpdateTime: timestamp('last_update_time').defaultNow(),
  aiThreshold: integer('ai_threshold'),
});

// 出入库记录表
export const stockRecords = pgTable('stock_records', {
  id: varchar('id', { length: 50 }).primaryKey(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  type: varchar('type', { length: 10 }).notNull(), // 'in' or 'out'
  subType: varchar('sub_type', { length: 50 }), // purchase, return, sale, damage
  quantity: integer('quantity').notNull(),
  operator: varchar('operator', { length: 100 }),
  remark: text('remark'),
  createdAt: timestamp('created_at').defaultNow(),
});
