import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 硬编码的演示账号（当数据库不可用时使用）
const DEMO_USERS = [
  {
    id: 1,
    username: 'admin',
    password: crypto.createHash('md5').update('admin123').digest('hex'),
    name: '系统管理员',
    role: 'admin',
    email: 'admin@flower.com',
  },
  {
    id: 2,
    username: 'operator',
    password: crypto.createHash('md5').update('operator123').digest('hex'),
    name: '运营人员',
    role: 'operator',
    email: 'operator@flower.com',
  },
];

// POST - 登录
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({
        code: 400,
        message: '请输入用户名和密码',
        data: null
      }, { status: 400 });
    }

    // 计算密码的 MD5
    const md5Password = crypto.createHash('md5').update(password).digest('hex');

    // 尝试从数据库验证（如果可用）
    let user: typeof DEMO_USERS[0] | null = null;
    try {
      const { query } = await import('@/lib/db');
      const users = await query<Array<{
        id: number;
        username: string;
        password: string;
        name: string;
        role: string;
        email: string;
      }>>(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );
      if (users.length > 0) {
        const dbUser = users[0];
        if (dbUser.password === md5Password || dbUser.password === password) {
          user = dbUser;
        }
      }
    } catch (dbError) {
      // 数据库不可用，使用硬编码账号
    }

    // 如果数据库没有该用户，使用硬编码账号验证
    if (!user) {
      user = DEMO_USERS.find(
        u => u.username === username && u.password === md5Password
      );
    }

    if (!user) {
      return NextResponse.json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      }, { status: 401 });
    }

    // 生成简单的 token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
        }
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
