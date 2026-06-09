import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db/mysql';
import { mockStockRecords } from '@/lib/mock-data';

// 获取出入库记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const productId = searchParams.get('productId') || '';
    const type = searchParams.get('type') || '';

    try {
      const offset = (page - 1) * pageSize;
      let whereClause = '1=1';
      const params: (string | number)[] = [];

      if (productId) { whereClause += ' AND r.product_id = ?'; params.push(productId); }
      if (type) { whereClause += ' AND r.type = ?'; params.push(type); }

      const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM stock_records r WHERE ${whereClause}`, params);
      const total = (countResult as { total: number }[])[0].total;

      const [rows] = await pool.query(
        `SELECT r.*, p.name as product_name FROM stock_records r LEFT JOIN products p ON r.product_id = p.id WHERE ${whereClause} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
        [...params, pageSize, offset]
      );

      const records = (rows as Record<string, unknown>[]).map(r => ({
        id: r.id, productId: r.product_id, productName: r.product_name,
        type: r.type, subType: r.sub_type, quantity: r.quantity,
        operator: r.operator, remark: r.remark, createdAt: r.created_at,
      }));

      return NextResponse.json({ code: 200, message: '获取成功', data: { list: records, total, page, pageSize } });
    } catch (dbError) {
      // Fallback to mock
      let filtered = [...mockStockRecords];
      if (type) filtered = filtered.filter(r => r.type === type);
      return NextResponse.json({
        code: 200, message: '获取成功（模拟）', data: {
          list: filtered.slice(0, pageSize).map(r => ({
            id: r.id, productId: r.productId, productName: r.productName,
            type: r.type, subType: r.subType, quantity: r.quantity,
            operator: r.operator, remark: r.remark, createdAt: r.createdAt,
          })), total: filtered.length, page, pageSize
        }
      });
    }
  } catch (error) {
    console.error('获取出入库记录失败:', error);
    return NextResponse.json({ code: 500, message: '获取失败', data: null }, { status: 500 });
  }
}