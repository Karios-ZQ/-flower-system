# 花屿鲜花智能选购系统 - AGENTS.md

## 1. 项目概述

**花屿鲜花智能选购系统** 是一个基于 Next.js 16 + React 19 的鲜花零售智能管理系统，深度集成 AI 技术实现智能化运营。

### 核心功能
- 商品管理（增删改查、分类管理、状态控制）
- 库存管理（实时监控、预警管理、出入库记录）
- 用户认证与权限控制

## 2. 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **数据库**: MySQL (通过 mysql2/promise)
- **图表**: Recharts

## 3. 目录结构

```
src/
├── app/
│   ├── (dashboard)/         # 仪表盘路由组
│   │   ├── dashboard/        # 数据概览
│   │   ├── products/         # 商品管理
│   │   │   ├── page.tsx     # 商品列表
│   │   │   ├── add/         # 新增商品
│   │   │   └── [id]/        # 商品详情
│   │   └── inventory/        # 库存管理
│   │       ├── monitor/      # 实时监控
│   │       ├── warning/      # 预警管理
│   │       └── record/       # 出入库记录
│   ├── api/                  # API 路由
│   │   ├── auth/login/       # 登录认证
│   │   ├── products/         # 商品 API
│   │   ├── categories/       # 分类 API
│   │   ├── inventory/        # 库存 API
│   │   ├── dashboard/         # 仪表盘数据 API
│   │   └── db/               # 数据库管理
│   │       ├── init/         # 初始化表结构
│   │       └── seed/         # 种子数据
│   ├── login/                # 登录页
│   └── init/                 # 数据库初始化向导
├── components/
│   ├── layout/              # 布局组件
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── DashboardLayout.tsx
│   └── ui/                  # shadcn/ui 组件
├── lib/
│   ├── db.ts                # 数据库连接池
│   ├── types.ts             # 类型定义
│   └── utils.ts             # 工具函数
└── context/                 # React Context
```

## 4. 数据库配置

### 环境变量
在项目根目录创建 `.env.local` 文件：

```env
DB_HOST=你的云数据库地址
DB_PORT=3306
DB_NAME=Flower
DB_USER=root
DB_PASSWORD=你的密码
```

### 数据库表结构
- `admins` - 管理员账号表
- `categories` - 商品分类表
- `products` - 商品表
- `inventory` - 库存表
- `stock_records` - 出入库记录表
- `operation_logs` - 操作日志表

### 初始化步骤
1. 配置 `.env.local` 环境变量
2. 访问 `/api/db/init` 创建数据库表
3. 访问 `/api/db/seed` 插入演示数据

## 5. 演示账号

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 管理员 |
| operator | operator123 | 运营人员 |

## 6. API 列表

### 认证接口
- `POST /api/auth/login` - 用户登录

### 商品接口
- `GET /api/products` - 获取商品列表
- `POST /api/products` - 创建商品
- `GET /api/products/[id]` - 获取商品详情
- `PUT /api/products/[id]` - 更新商品
- `DELETE /api/products/[id]` - 删除商品

### 分类接口
- `GET /api/categories` - 获取分类树
- `POST /api/categories` - 创建分类

### 库存接口
- `GET /api/inventory` - 获取库存列表
- `GET /api/inventory/warning` - 获取预警列表
- `POST /api/inventory/in` - 入库操作
- `POST /api/inventory/out` - 出库操作
- `GET /api/inventory/records` - 出入库记录
- `PUT /api/inventory/[id]/threshold` - 更新预警阈值

### 数据接口
- `GET /api/dashboard` - 仪表盘数据

### 数据库管理
- `GET /api/db/init` - 测试数据库连接
- `POST /api/db/init` - 初始化数据库表
- `POST /api/db/seed` - 插入演示数据

## 7. 开发命令

```bash
pnpm install          # 安装依赖
pnpm dev             # 启动开发服务器
pnpm build           # 构建生产版本
pnpm lint            # 代码检查
pnpm ts-check         # TypeScript 类型检查
```

## 8. 注意事项

- 数据库连接需要在 `.env.local` 中配置
- localhost 在沙箱环境中无法连接外部数据库，需要使用云数据库公网地址
- 密码使用 MD5 加密存储
- 所有 API 返回统一格式 `{ code, message, data }`
