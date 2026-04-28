import mysql from 'mysql2/promise';

// 数据库连接配置
// 注意：在沙箱环境中，localhost 可能无法直接连接外部 MySQL
// 如果连接失败，请提供云数据库的公网地址
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'Flower',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 创建连接池
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: dbConfig.waitForConnections,
      connectionLimit: dbConfig.connectionLimit,
      queueLimit: dbConfig.queueLimit,
    });
  }
  return pool;
}

// 执行查询
export async function query<T = unknown>(sql: string, params?: (string | number)[]): Promise<T> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

// 获取连接测试
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return { success: true, message: '数据库连接成功' };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: `数据库连接失败: ${err.message}` };
  }
}

export default { getPool, query, testConnection };
