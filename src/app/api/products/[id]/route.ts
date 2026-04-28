import { NextRequest, NextResponse } from 'next/server';
import pool, { parseJsonField } from '@/lib/db/mysql';

// 获取商品详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    const products = rows as Record<string, unknown>[];

    if (products.length === 0) {
      return NextResponse.json({
        code: 404,
        message: '商品不存在',
        data: null
      }, { status: 404 });
    }

    const p = products[0];
    const product = {
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
    };

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: product
    });
  } catch (error) {
    console.error('获取商品详情失败:', error);
    return NextResponse.json({
      code: 500,
      message: '获取失败',
      data: null
    }, { status: 500 });
  }
}

// 更新商品
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      categoryId,
      price,
      marketPrice,
      stock,
      unit,
      images,
      description,
      tags,
      status
    } = body;

    const updates: string[] = [];
    const values: unknown[] = [];

    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (categoryId !== undefined) { updates.push('category_id = ?'); values.push(categoryId); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (marketPrice !== undefined) { updates.push('market_price = ?'); values.push(marketPrice); }
    if (stock !== undefined) { updates.push('stock = ?'); values.push(stock); }
    if (unit !== undefined) { updates.push('unit = ?'); values.push(unit); }
    if (images !== undefined) { updates.push('images = ?'); values.push(JSON.stringify(images)); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (tags !== undefined) { updates.push('tags = ?'); values.push(JSON.stringify(tags)); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }

    updates.push('updated_at = NOW()');
    values.push(id);

    await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      code: 200,
      message: '更新成功',
      data: { id }
    });
  } catch (error) {
    console.error('更新商品失败:', error);
    return NextResponse.json({
      code: 500,
      message: '更新失败',
      data: null
    }, { status: 500 });
  }
}

// 删除商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('删除商品失败:', error);
    return NextResponse.json({
      code: 500,
      message: '删除失败',
      data: null
    }, { status: 500 });
  }
}
