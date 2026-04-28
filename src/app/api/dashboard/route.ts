import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  todaySales: number;
  todayOrders: number;
  salesTrend: { date: string; amount: number }[];
  categoryDistribution: { name: string; value: number }[];
}

interface CountRow {
  count: number;
}

interface CategoryCountRow {
  name: string;
  value: number;
}

// GET - 获取仪表盘数据
export async function GET() {
  try {
    // 获取商品总数
    const productResult = await query<CountRow[]>(
      'SELECT COUNT(*) as count FROM products WHERE status = 1'
    );
    const totalProducts = productResult[0]?.count || 0;

    // 获取低库存商品数量
    const lowStockResult = await query<CountRow[]>(
      `SELECT COUNT(*) as count FROM inventory 
       WHERE current_stock <= safe_stock AND current_stock > 0`
    );
    const lowStockCount = lowStockResult[0]?.count || 0;

    // 获取今日销售额（模拟数据，实际应该查询订单表）
    const todaySales = Math.random() * 5000 + 1000;

    // 获取今日订单数（模拟数据）
    const todayOrders = Math.floor(Math.random() * 30) + 10;

    // 获取销售趋势数据（最近7天，模拟数据）
    const salesTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      salesTrend.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        amount: Math.floor(Math.random() * 3000) + 2000
      });
    }

    // 获取分类分布数据
    const categoryResult = await query<CategoryCountRow[]>(`
      SELECT c.name, COUNT(p.id) as value 
      FROM categories c 
      LEFT JOIN products p ON FIND_IN_SET(c.id, p.category_ids) > 0 AND p.status = 1
      WHERE c.parent_id = 0 
      GROUP BY c.id, c.name 
      ORDER BY value DESC
    `);

    const categoryDistribution = categoryResult.map((item) => ({
      name: item.name,
      value: item.value || 0
    }));

    const data: DashboardStats = {
      totalProducts,
      lowStockCount,
      todaySales,
      todayOrders,
      salesTrend,
      categoryDistribution
    };

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data
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
