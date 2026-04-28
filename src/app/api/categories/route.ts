import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface CategoryRow {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  sort_order: number;
  created_at: Date;
}

interface Category {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  sort_order: number;
  children?: Category[];
}

// GET - 获取分类列表
export async function GET() {
  try {
    const categories = await query<CategoryRow[]>(
      'SELECT * FROM categories ORDER BY level, sort_order, id'
    );

    // 构建分类树
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // 先创建所有分类节点
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // 再构建树形结构
    categories.forEach((cat) => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id === 0) {
        rootCategories.push(category);
      } else {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(category);
        }
      }
    });

    return NextResponse.json({
      code: 200,
      message: '获取成功',
      data: rootCategories
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

// POST - 创建分类
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parent_id = 0, sort_order = 0 } = body;
    let level = 1;

    if (!name) {
      return NextResponse.json({
        code: 400,
        message: '分类名称不能为空',
        data: null
      }, { status: 400 });
    }

    // 获取父分类
    if (parent_id > 0) {
      const parents = await query<CategoryRow[]>(
        'SELECT * FROM categories WHERE id = ?',
        [parent_id]
      );
      if (parents.length > 0) {
        level = parents[0].level + 1;
      }
    }

    // 获取最大排序值
    const maxSort = await query<{ max_sort: number }[]>(
      'SELECT COALESCE(MAX(sort_order), 0) as max_sort FROM categories WHERE parent_id = ?',
      [parent_id]
    );
    const newSortOrder = (maxSort[0]?.max_sort || 0) + 1;

    // 插入新分类
    const result = await query<{ insertId: number }>(
      'INSERT INTO categories (name, parent_id, level, sort_order, created_at) VALUES (?, ?, ?, ?, NOW())',
      [name, parent_id, level, newSortOrder]
    );

    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: { id: result.insertId, name, parent_id, level, sort_order: newSortOrder }
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
