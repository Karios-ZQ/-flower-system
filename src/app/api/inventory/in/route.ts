import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface StockResult {
  insertId: number;
}

interface InventoryResult {
  current_stock: number;
}

interface ProductResult {
  name: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, quantity, remark, sub_type = 'purchase' } = body;

    if (!product_id || !quantity) {
      return NextResponse.json({
        code: 400,
        message: '请提供商品ID和数量',
        data: null
      }, { status: 400 });
    }

    // 获取当前库存
    const inventoryResult = await query<InventoryResult[]>(
      'SELECT current_stock FROM inventory WHERE product_id = ?',
      [product_id]
    );

    const currentStock = inventoryResult[0]?.current_stock || 0;

    // 更新库存
    await query(`
      INSERT INTO inventory (product_id, current_stock, last_update_time)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE current_stock = current_stock + ?, last_update_time = NOW()
    `, [product_id, quantity, quantity]);

    // 获取新的库存值
    const newStockResult = await query<InventoryResult[]>(
      'SELECT current_stock FROM inventory WHERE product_id = ?',
      [product_id]
    );
    const newStock = newStockResult[0]?.current_stock || (currentStock + quantity);

    // 获取商品名称
    const productResult = await query<ProductResult[]>(
      'SELECT name FROM products WHERE id = ?',
      [product_id]
    );
    const productName = productResult[0]?.name || '';

    // 插入出入库记录
    await query(`
      INSERT INTO stock_records (product_id, product_name, type, sub_type, quantity, operator, remark)
      VALUES (?, ?, 'in', ?, ?, '系统管理员', ?)
    `, [product_id, productName, sub_type, quantity, remark || '']);

    // 更新商品表中的库存字段
    await query(
      'UPDATE products SET stock_quantity = ? WHERE id = ?',
      [newStock, product_id]
    );

    return NextResponse.json({
      code: 200,
      message: '入库成功',
      data: {
        product_id,
        product_name: productName,
        quantity,
        current_stock: newStock
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
