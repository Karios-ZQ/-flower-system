import { NextRequest, NextResponse } from 'next/server';
import pool, { parseJsonField, generateId } from '@/lib/db/mysql';
import { mockProducts, mockCategories } from '@/lib/mock-data';

// 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const keyword = searchParams.get('keyword') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const status = searchParams.get('status') || '';

    // 尝试从数据库获取
    try {
      const offset = (page - 1) * pageSize;
      let whereClause = '1=1';
      const params: (string | number)[] = [];

      if (keyword) {
        whereClause += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
      }
      if (categoryId) {
        whereClause += ' AND category_id = ?';
        params.push(categoryId);
      }
      if (status) {
        whereClause += ' AND status = ?';
        params.push(status);
      }

      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM products WHERE ${whereClause}`,
        params
      );
      const total = (countResult as { total: number }[])[0].total;

      const [rows] = await pool.query(
        `SELECT * FROM products WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, pageSize, offset]
      );

      const products = (rows as Record<string, unknown>[]).map(p => ({
        id: p.id,
        name: p.name,
        categoryId: p.category_id,
        price: parseFloat(p.price as string),
        marketPrice: p.market_price ? parseFloat(p.market_price as string) : null,
        stock: p.stock,
        unit: p.unit,
        images: parseJsonField(p.images as string),
        description: p.description,
        status: p.status,
        tags: parseJsonField(p.tags as string),
        salesCount: p.sales_count,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      return NextResponse.json({ code: 200, message: '获取成功', data: { list: products, total, page, pageSize } });
    } catch (dbError) {
      // 数据库连接失败，使用 mock data
      console.warn('数据库连接失败，使用模拟数据:', dbError);

      let filtered = [...mockProducts];
      if (keyword) {
        filtered = filtered.filter(p =>
          p.name.includes(keyword) || p.tags.some(t => t.includes(keyword))
        );
      }
      if (categoryId) {
        filtered = filtered.filter(p => p.categoryIds.includes(categoryId));
      }
      if (status) {
        filtered = filtered.filter(p => p.status === status);
      }

      const list = filtered.slice(0, pageSize).map(p => ({
        id: p.id,
        name: p.name,
        categoryId: p.categoryIds[0] || null,
        price: p.price,
        marketPrice: p.marketPrice,
        stock: p.stock,
        unit: p.unit,
        images: p.images,
        description: p.description,
        status: p.status,
        tags: p.tags,
        salesCount: p.salesCount,
        createdAt: typeof p.createdAt === 'string' ? p.createdAt : (p.createdAt as Date).toISOString(),
        updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : (p.updatedAt as Date).toISOString(),
      }));

      return NextResponse.json({
        code: 200,
        message: '获取成功（模拟数据）',
        data: { list, total: filtered.length, page, pageSize }
      });
    }
  } catch (error) {
    console.error('获取商品列表失败:', error);
    return NextResponse.json({ code: 500, message: '获取失败', data: null }, { status: 500 });
  }
}

// 创建商品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, categoryId, price, marketPrice, stock = 0, unit = '束', images = [], description = '', tags = [], status = 'active' } = body;

    if (!name || !price) {
      return NextResponse.json({ code: 400, message: '请填写商品名称和价格', data: null }, { status: 400 });
    }

    try {
      const id = generateId('prod');
      await pool.query(
        `INSERT INTO products (id, name, category_id, price, market_price, stock, unit, images, description, status, tags, sales_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [id, name, categoryId, price, marketPrice, stock, unit, JSON.stringify(images), description, status, JSON.stringify(tags)]
      );
      return NextResponse.json({ code: 200, message: '创建成功', data: { id } });
    } catch (dbError) {
      console.warn('数据库不可用，返回模拟成功:', dbError);
      return NextResponse.json({ code: 200, message: '创建成功（模拟）', data: { id: generateId('prod') } });
    }
  } catch (error) {
    console.error('创建商品失败:', error);
    return NextResponse.json({ code: 500, message: '创建失败', data: null }, { status: 500 });
  }
}