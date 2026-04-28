import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ProductRow {
  id: number;
  name: string;
  subcategory: string;
  category_ids: string;
  price: number;
  market_price: number;
  stock_quantity: number;
  unit: string;
  images: string;
  description: string;
  tags: string;
  sales_count: number;
  status: number;
  created_at: Date;
  updated_at: Date;
}

interface Product {
  id: number;
  name: string;
  subcategory: string;
  category_ids: number[];
  price: number;
  market_price: number;
  stock: number;
  unit: string;
  images: string[];
  description: string;
  tags: string[];
  sales_count: number;
  status: number;
  created_at: string;
  updated_at: string;
}

// GET - 获取商品列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const keyword = searchParams.get('keyword');

    let whereClause = 'WHERE 1=1';
    const params: (string | number)[] = [];

    if (category) {
      whereClause += ' AND FIND_IN_SET(?, category_ids)';
      params.push(category);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status === 'active' ? 1 : 0);
    }

    if (keyword) {
      whereClause += ' AND (name LIKE ? OR subcategory LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 获取总数
    const countResult = await query<{ total: number }[]>(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // 获取列表
    const offset = (page - 1) * pageSize;
    const products = await query<ProductRow[]>(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    // 转换数据格式
    const data: Product[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      subcategory: p.subcategory,
      category_ids: p.category_ids ? p.category_ids.split(',').map(Number) : [],
      price: p.price,
      market_price: p.market_price,
      stock: p.stock_quantity,
      unit: p.unit,
      images: p.images ? JSON.parse(p.images) : [],
      description: p.description,
      tags: p.tags ? JSON.parse(p.tags) : [],
      sales_count: p.sales_count,
      status: p.status,
      created_at: p.created_at.toString(),
      updated_at: p.updated_at.toString(),
    }));

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: {
        list: data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      code: 500,
      message: err.message,
      data: null
    }, { status: 500 });
  }
}

// POST - 创建商品
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      subcategory,
      category_ids,
      price,
      market_price,
      stock_quantity,
      unit,
      images,
      description,
      tags,
      status = 1
    } = body;

    if (!name || !price) {
      return NextResponse.json({
        code: 400,
        message: '商品名称和价格不能为空',
        data: null
      }, { status: 400 });
    }

    const result = await query<{ insertId: number }>(
      `INSERT INTO products (
        name, subcategory, category_ids, price, market_price, 
        stock_quantity, unit, images, description, tags, 
        initial_stock, sales_count, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NOW(), NOW())`,
      [
        name,
        subcategory || '',
        Array.isArray(category_ids) ? category_ids.join(',') : category_ids || '',
        price,
        market_price || price,
        stock_quantity || 0,
        unit || '枝',
        images ? JSON.stringify(images) : '[]',
        description || '',
        tags ? JSON.stringify(tags) : '[]',
        stock_quantity || 0,
        status
      ]
    );

    // 同时在库存表中创建记录
    await query(
      `INSERT INTO inventory (product_id, current_stock, safe_stock, status, last_update_time)
       VALUES (?, ?, ?, 'sufficient', NOW())`,
      [result.insertId, stock_quantity || 0, Math.floor((stock_quantity || 0) * 0.2)]
    );

    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: { id: result.insertId }
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      code: 500,
      message: err.message,
      data: null
    }, { status: 500 });
  }
}
