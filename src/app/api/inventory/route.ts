import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface InventoryRow {
  product_id: number;
  product_name: string;
  current_stock: number;
  safe_stock: number;
  unit: string;
  status: 'sufficient' | 'low' | 'out' | 'empty';
  stock_ratio: number;
  last_update_time: Date;
}

export async function GET() {
  try {
    const result = await query<InventoryRow[]>(`
      SELECT 
        p.id as product_id,
        p.name as product_name,
        COALESCE(i.current_stock, p.stock_quantity) as current_stock,
        COALESCE(i.safe_stock, FLOOR(p.initial_stock * 0.2)) as safe_stock,
        p.unit,
        CASE 
          WHEN COALESCE(i.current_stock, p.stock_quantity) <= 0 THEN 'empty'
          WHEN COALESCE(i.current_stock, p.stock_quantity) <= FLOOR(p.initial_stock * 0.1) THEN 'out'
          WHEN COALESCE(i.current_stock, p.stock_quantity) <= COALESCE(i.safe_stock, FLOOR(p.initial_stock * 0.2)) THEN 'low'
          ELSE 'sufficient'
        END as status,
        CASE 
          WHEN p.initial_stock > 0 THEN 
            LEAST(100, ROUND(COALESCE(i.current_stock, p.stock_quantity) / p.initial_stock * 100))
          ELSE 0
        END as stock_ratio,
        COALESCE(i.last_update_time, p.updated_at) as last_update_time
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.status = 1
      ORDER BY 
        CASE 
          WHEN COALESCE(i.current_stock, p.stock_quantity) <= FLOOR(p.initial_stock * 0.1) THEN 1
          WHEN COALESCE(i.current_stock, p.stock_quantity) <= COALESCE(i.safe_stock, FLOOR(p.initial_stock * 0.2)) THEN 2
          ELSE 3
        END,
        current_stock ASC
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
