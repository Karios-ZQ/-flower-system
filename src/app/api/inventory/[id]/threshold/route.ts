import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const productId = parseInt(id);

    if (body.threshold !== undefined) {
      // 更新预警阈值
      const threshold = parseInt(body.threshold);
      
      await query(`
        INSERT INTO inventory (product_id, ai_threshold, last_update_time)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE ai_threshold = ?, last_update_time = NOW()
      `, [productId, threshold, threshold]);
    }

    if (body.enabled !== undefined) {
      // 更新预警启用状态
      await query(`
        INSERT INTO inventory (product_id, warning_enabled, last_update_time)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE warning_enabled = ?, last_update_time = NOW()
      `, [productId, body.enabled ? 1 : 0, body.enabled ? 1 : 0]);
    }

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
