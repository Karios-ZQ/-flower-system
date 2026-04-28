import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

interface DbUser {
  id: number;
  username: string;
  password: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

// 简单的密码加密（实际项目中应使用 bcrypt）
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

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

    // 查询用户（支持 MD5 加密的密码）
    const md5Password = crypto.createHash('md5').update(password).digest('hex');
    
    const users = await query<DbUser[]>(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return NextResponse.json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      }, { status: 401 });
    }

    const user = users[0];
    
    // 验证密码（支持 MD5 或简单哈希）
    const isValid = user.password === md5Password || user.password === simpleHash(password);
    
    if (!isValid) {
      return NextResponse.json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      }, { status: 401 });
    }

    // 更新最后登录时间
    await query(
      'UPDATE admins SET last_login_at = NOW() WHERE id = ?',
      [user.id]
    );

    // 生成简单的 token（实际项目中应使用 JWT）
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
          avatar: user.avatar,
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
