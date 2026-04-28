import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db/mysql';

// 获取库存列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    let whereClause = '1=1';
    const params: string[] = [];

    if (status) {
      whereClause += ' AND i.status = ?';
      params.push(status);
    }

    const [rows] = await pool.query(
      `SELECT i.*, p.name as product_name, p.price, p.images 
       FROM inventory i 
       LEFT JOIN products p ON i.product_id = p.id 
       WHERE ${whereClause}
       ORDER BY i.last_update_time DESC`,
      params
    );

    const inventory = (rows as Record<string, unknown>[]).map(i => ({
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
    }));

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: inventory
    });
  } catch (error) {
    console.error('获取库存列表失败:', error);
    return NextResponse.json({
      code: 500,
      message: '获取失败',
      data: null
    }, { status: 500 });
  }
}
