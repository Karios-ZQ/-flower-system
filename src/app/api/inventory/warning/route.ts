import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface WarningRow {
  product_id: number;
  product_name: string;
  current_stock: number;
  safe_stock: number;
  threshold: number;
  unit: string;
  shortage: number;
  level: 'critical' | 'warning';
  created_at: Date;
}

export async function GET() {
  try {
    // 获取所有低库存商品及其预警信息
    const result = await query<WarningRow[]>(`
      SELECT 
        p.id as product_id,
        p.name as product_name,
        COALESCE(i.current_stock, p.stock_quantity) as current_stock,
        COALESCE(i.safe_stock, FLOOR(p.initial_stock * 0.2)) as safe_stock,
        COALESCE(i.ai_threshold, FLOOR(p.initial_stock * 0.2)) as threshold,
        p.unit,
        CASE 
          WHEN COALESCE(i.current_stock, p.stock_quantity) <= 0 THEN (COALESCE(i.safe_stock, FLOOR(p.initial_stock * 0.2)) * -1)
          ELSE (COALESCE(i.safe_stock, FLOOR(p.initial_stock * 0.2)) - COALESCE(i.current_stock, p.stock_quantity))
        END as shortage,
        CASE 
          WHEN COALESCE(i.current_stock, p.stock_quantity) <= 0 THEN 'critical'
          WHEN COALESCE(i.current_stock, p.stock_quantity) <= COALESCE(i.safe_stock, FLOOR(p.initial_stock * 0.2)) * 0.5 THEN 'critical'
          ELSE 'warning'
        END as level,
        COALESCE(i.last_update_time, p.updated_at) as created_at
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.status = 1
        AND COALESCE(i.current_stock, p.stock_quantity) <= COALESCE(i.safe_stock, FLOOR(p.initial_stock * 0.2))
      ORDER BY level DESC, current_stock ASC
    `);

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: result
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
