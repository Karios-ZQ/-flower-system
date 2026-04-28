import { NextRequest, NextResponse } from 'next/server';
import pool, { generateId } from '@/lib/db/mysql';

// 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories ORDER BY level, sort, created_at'
    );

    const categories = (rows as Record<string, unknown>[]).map(c => ({
      id: c.id,
      name: c.name,
      parentId: c.parent_id,
      level: c.level,
      sort: c.sort,
      icon: c.icon,
      createdAt: c.created_at,
    }));

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: categories
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return NextResponse.json({
      code: 500,
      message: '获取失败',
      data: null
    }, { status: 500 });
  }
}

// 创建分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, parentId = null, level = 1, sort = 0, icon = '' } = body;

    if (!name) {
      return NextResponse.json({
        code: 400,
        message: '请填写分类名称',
        data: null
      }, { status: 400 });
    }

    const id = generateId('cat');

    await pool.query(
      `INSERT INTO categories (id, name, parent_id, level, sort, icon) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, parentId, level, sort, icon]
    );

    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: { id }
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json({
      code: 500,
      message: '创建失败',
      data: null
    }, { status: 500 });
  }
}
