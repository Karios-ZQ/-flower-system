import { NextRequest, NextResponse } from 'next/server';
import pool, { generateId } from '@/lib/db/mysql';

// 入库操作
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, subType = 'purchase', remark = '', operator = 'admin' } = body;

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({
        code: 400,
        message: '请提供商品ID和有效数量',
        data: null
      }, { status: 400 });
    }

    // 开启事务
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 更新库存
      await connection.query(
        `UPDATE inventory SET current_stock = current_stock + ?, last_update_time = NOW() WHERE product_id = ?`,
        [quantity, productId]
      );

      // 更新商品表库存
      await connection.query(
        `UPDATE products SET stock = stock + ? WHERE id = ?`,
        [quantity, productId]
      );

      // 记录出入库
      const recordId = generateId('record');
      await connection.query(
        `INSERT INTO stock_records (id, product_id, type, sub_type, quantity, operator, remark) VALUES (?, ?, 'in', ?, ?, ?, ?)`,
        [recordId, productId, subType, quantity, operator, remark]
      );

      // 获取更新后的库存
      const [rows] = await connection.query(
        'SELECT current_stock FROM inventory WHERE product_id = ?',
        [productId]
      );
      const inventory = rows as { current_stock: number }[];
      const currentStock = inventory.length > 0 ? inventory[0].current_stock : 0;

      await connection.commit();

      return NextResponse.json({
        code: 200,
        message: '入库成功',
        data: {
          productId,
          quantity,
          currentStock
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('入库失败:', error);
    return NextResponse.json({
      code: 500,
      message: '入库失败',
      data: null
    }, { status: 500 });
  }
}
