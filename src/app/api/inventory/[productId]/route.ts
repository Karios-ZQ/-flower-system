import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db/mysql';

// 获取库存详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const [rows] = await pool.query(
      `SELECT i.*, p.name as product_name, p.price, p.images 
       FROM inventory i 
       LEFT JOIN products p ON i.product_id = p.id 
       WHERE i.product_id = ?`,
      [productId]
    );

    const inventory = rows as Record<string, unknown>[];

    if (inventory.length === 0) {
      return NextResponse.json({
        code: 404,
        message: '库存记录不存在',
        data: null
      }, { status: 404 });
    }

    const i = inventory[0];
    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: {
        id: i.id,
        productId: i.product_id,
        productName: i.product_name,
        price: i.price ? parseFloat(i.price as string) : null,
        images: i.images,
        currentStock: i.current_stock,
        safeStock: i.safe_stock,
        status: i.status,
        lastUpdateTime: i.last_update_time,
        aiThreshold: i.ai_threshold,
      }
    });
  } catch (error) {
    console.error('获取库存详情失败:', error);
    return NextResponse.json({
      code: 500,
      message: '获取失败',
      data: null
    }, { status: 500 });
  }
}

// 更新预警阈值
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json();
    const { safeStock, aiThreshold } = body;

    const updates: string[] = [];
    const values: unknown[] = [];

    if (safeStock !== undefined) {
      updates.push('safe_stock = ?');
      values.push(safeStock);
    }
    if (aiThreshold !== undefined) {
      updates.push('ai_threshold = ?');
      values.push(aiThreshold);
    }

    if (updates.length === 0) {
      return NextResponse.json({
        code: 400,
        message: '请提供要更新的字段',
        data: null
      }, { status: 400 });
    }

    updates.push('last_update_time = NOW()');
    values.push(productId);

    await pool.query(
      `UPDATE inventory SET ${updates.join(', ')} WHERE product_id = ?`,
      values
    );

    return NextResponse.json({
      code: 200,
      message: '更新成功',
      data: { productId }
    });
  } catch (error) {
    console.error('更新库存阈值失败:', error);
    return NextResponse.json({
      code: 500,
      message: '更新失败',
      data: null
    }, { status: 500 });
  }
}
