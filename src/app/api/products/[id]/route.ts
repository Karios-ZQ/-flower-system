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

// GET - 获取商品详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await query<ProductRow[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

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
    };

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: product
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

// PUT - 更新商品
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      status
    } = body;

    // 构建更新语句
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (subcategory !== undefined) {
      updates.push('subcategory = ?');
      values.push(subcategory);
    }
    if (category_ids !== undefined) {
      updates.push('category_ids = ?');
      values.push(Array.isArray(category_ids) ? category_ids.join(',') : category_ids);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (market_price !== undefined) {
      updates.push('market_price = ?');
      values.push(market_price);
    }
    if (stock_quantity !== undefined) {
      updates.push('stock_quantity = ?');
      values.push(stock_quantity);
      // 同时更新库存表
      await query(
        'UPDATE inventory SET current_stock = ?, last_update_time = NOW() WHERE product_id = ?',
        [stock_quantity, id]
      );
    }
    if (unit !== undefined) {
      updates.push('unit = ?');
      values.push(unit);
    }
    if (images !== undefined) {
      updates.push('images = ?');
      values.push(JSON.stringify(images));
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (tags !== undefined) {
      updates.push('tags = ?');
      values.push(JSON.stringify(tags));
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      code: 200,
      message: '更新成功',
      data: null
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

// DELETE - 删除商品
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await query('DELETE FROM products WHERE id = ?', [id]);
    await query('DELETE FROM inventory WHERE product_id = ?', [id]);

    return NextResponse.json({
      code: 200,
      message: '删除成功',
      data: null
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
