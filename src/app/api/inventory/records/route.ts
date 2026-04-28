import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RecordRow {
  id: number;
  product_id: number;
  product_name: string;
  type: 'in' | 'out';
  sub_type: string;
  quantity: number;
  operator: string;
  remark: string;
  created_at: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');

    let whereClause = 'WHERE 1=1';
    const params: (string | number)[] = [];

    if (productId) {
      whereClause += ' AND product_id = ?';
      params.push(productId);
    }

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    // 获取总数
    const countResult = await query<{ total: number }[]>(
      `SELECT COUNT(*) as total FROM stock_records ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // 获取列表
    const offset = (page - 1) * pageSize;
    const records = await query<RecordRow[]>(
      `SELECT * FROM stock_records ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    // 格式化数据
    const data = records.map((r) => ({
      id: r.id,
      product_id: r.product_id,
      product_name: r.product_name,
      type: r.type,
      sub_type: r.sub_type,
      quantity: r.quantity,
      operator: r.operator,
      remark: r.remark,
      created_at: r.created_at.toString(),
    }));

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: {
        list: data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
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
