# 花屿鲜花智能选购系统 - 项目文档

## 1. 项目概述

### 项目名称
**花屿鲜花商城** (Flower Island Mall)

### 项目定位
基于 SpringBoot+Vue 架构的鲜花零售智能管理系统，聚焦商品管理与库存管理两大核心模块，深度融合 AI 技术实现智能化运营。

### 核心功能
- **商品管理**：商品信息管理、查询筛选、状态控制、分类管理、图片管理、AI 文案生成、AI 智能分类、AI 销售预测
- **库存管理**：实时库存监控、预警管理、出入库记录、库存盘点、AI 异常检测、AI 动态阈值调整
- **系统基础**：登录认证、权限控制、操作日志、个人中心

## 2. 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **状态管理**: React Context + LocalStorage
- **图表**: Recharts

## 3. 目录结构

```
src/
├── app/
│   ├── (auth)/           # 认证相关页面
│   │   └── login/        # 登录页
│   ├── (dashboard)/      # 仪表盘布局
│   │   ├── layout.tsx    # 仪表盘布局
│   │   ├── dashboard/    # 仪表盘首页
│   │   ├── products/     # 商品管理
│   │   │   ├── list/     # 商品列表
│   │   │   ├── add/      # 新增商品
│   │   │   └── [id]/     # 商品详情
│   │   ├── inventory/    # 库存管理
│   │   │   ├── monitor/  # 实时监控
│   │   │   ├── warning/  # 预警管理
│   │   │   └── record/   # 出入库记录
│   │   └── settings/     # 系统设置
│   ├── api/              # API 路由
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/           # 布局组件
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── DashboardLayout.tsx
│   ├── products/         # 商品管理组件
│   ├── inventory/       # 库存管理组件
│   └── ui/              # shadcn/ui 组件
├── hooks/               # 自定义 Hooks
├── lib/                 # 工具库
│   ├── types.ts         # 类型定义
│   └── mock-data.ts     # 模拟数据
└── context/             # React Context
```

## 4. 功能模块

### 4.1 商品管理模块

| 功能 | 描述 | AI 集成 |
|------|------|---------|
| 商品信息管理 | 商品增删改查、价格管理、上下架 | AI 文案自动生成 |
| 商品查询筛选 | 多条件组合查询、分页、排序 | AI 智能推荐 |
| 商品状态控制 | 单个/批量上下架 | AI 销售预测 |
| 商品分类管理 | 三级分类维护、属性配置 | AI 自动分类与标签提取 |
| 商品图片管理 | 图片上传、预览、缩略图 | AI 图像优化与场景生成 |

### 4.2 库存管理模块

| 功能 | 描述 | AI 集成 |
|------|------|---------|
| 实时库存监控 | 库存状态展示、快速筛选 | AI 异常波动检测 |
| 库存预警管理 | 阈值设置、补货提醒 | AI 动态阈值调整 |
| 出入库记录 | 入库/出库登记、流水查询 | AI 文本智能分析 |
| 库存盘点统计 | 盘点任务、差异核对 | AI 数据挖掘分析 |

### 4.3 系统基础模块

| 功能 | 描述 |
|------|------|
| 登录认证 | 用户名密码认证、JWT 令牌 |
| 权限控制 | 角色分级、菜单权限、按钮权限 |
| 操作日志 | 详细操作记录、审计追溯 |
| 个人中心 | 信息查看、密码修改 |

## 5. 数据模型

### 5.1 商品 (Product)
```typescript
interface Product {
  id: string;
  name: string;
  category: string[];
  price: number;
  marketPrice: number;
  stock: number;
  unit: string;
  images: string[];
  description: string;
  status: 'active' | 'inactive';
  tags: string[];
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.2 库存 (Inventory)
```typescript
interface Inventory {
  productId: string;
  currentStock: number;
  safeStock: number;
  status: 'sufficient' | 'low' | 'out' | 'empty';
  lastUpdateTime: Date;
  aiThreshold?: number;
}
```

### 5.3 出入库记录 (StockRecord)
```typescript
interface StockRecord {
  id: string;
  productId: string;
  type: 'in' | 'out';
  subType: 'purchase' | 'return' | 'count_in' | 'sale' | 'damage' | 'count_out';
  quantity: number;
  operator: string;
  remark?: string;
  createdAt: Date;
}
```

## 6. API 规范

### 认证接口
- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 获取当前用户信息

### 商品接口
- `GET /api/products` - 获取商品列表
- `POST /api/products` - 新增商品
- `GET /api/products/:id` - 获取商品详情
- `PUT /api/products/:id` - 更新商品
- `DELETE /api/products/:id` - 删除商品
- `POST /api/products/batch-status` - 批量更新状态

### 库存接口
- `GET /api/inventory` - 获取库存列表
- `GET /api/inventory/:productId` - 获取库存详情
- `PUT /api/inventory/:productId/threshold` - 更新预警阈值
- `GET /api/inventory/records` - 获取出入库记录
- `POST /api/inventory/in` - 入库操作
- `POST /api/inventory/out` - 出库操作

### AI 接口
- `POST /api/ai/generate-description` - AI 生成文案
- `POST /api/ai/classify` - AI 智能分类
- `POST /api/ai/predict-sales` - AI 销售预测
- `POST /api/ai/detect-anomaly` - AI 异常检测

## 7. 开发规范

### 7.1 页面开发规范
- 所有页面组件放在 `src/app/(dashboard)/` 目录下
- 使用 shadcn/ui 组件库
- 响应式设计，适配桌面和移动端
- 使用 Tailwind CSS 样式

### 7.2 API 开发规范
- 使用 Next.js App Router 的 Server Actions
- 返回统一格式 `{ code, message, data }`
- 错误处理统一返回 4xx 或 5xx

### 7.3 状态管理规范
- 简单的全局状态使用 React Context
- 页面级状态使用 useState + useEffect
- 不使用 Redux 等复杂状态管理库

## 8. 环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `COZE_WORKSPACE_PATH` | 项目工作目录 | `/workspace/projects/` |
| `COZE_PROJECT_DOMAIN_DEFAULT` | 对外访问域名 | `https://xxx.dev.coze.site` |
| `DEPLOY_RUN_PORT` | 服务监听端口 | `5000` |

## 9. 启动命令

- 开发环境：`pnpm dev`
- 生产构建：`pnpm build`
- 生产启动：`pnpm start`
