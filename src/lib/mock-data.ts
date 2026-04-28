import { Category, Product, Inventory, StockRecord, StockWarning, User, DashboardStats, SalesTrend, CategorySales, TopProduct } from './types';

// ==================== 模拟用户 ====================

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: '管理员',
    role: 'admin',
    email: 'admin@flowerisland.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-12-01T10:30:00Z',
  },
  {
    id: '2',
    username: 'operator',
    name: '运营人员',
    role: 'operator',
    email: 'operator@flowerisland.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=operator',
    createdAt: '2024-03-15T00:00:00Z',
    lastLoginAt: '2024-12-01T09:15:00Z',
  },
];

// ==================== 模拟分类数据 ====================

export const mockCategories: Category[] = [
  { id: 'c1', name: '鲜切花', parentId: undefined, level: 1 },
  { id: 'c2', name: '绿植盆栽', parentId: undefined, level: 1 },
  { id: 'c3', name: '永生花', parentId: undefined, level: 1 },
  { id: 'c4', name: '玫瑰', parentId: 'c1', level: 2 },
  { id: 'c5', name: '百合', parentId: 'c1', level: 2 },
  { id: 'c6', name: '康乃馨', parentId: 'c1', level: 2 },
  { id: 'c7', name: '郁金香', parentId: 'c1', level: 2 },
  { id: 'c8', name: '红玫瑰', parentId: 'c4', level: 3 },
  { id: 'c9', name: '粉玫瑰', parentId: 'c4', level: 3 },
  { id: 'c10', name: '白玫瑰', parentId: 'c4', level: 3 },
  { id: 'c11', name: '多肉植物', parentId: 'c2', level: 2 },
  { id: 'c12', name: '绿萝', parentId: 'c2', level: 2 },
];

// ==================== 模拟商品数据 ====================

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '红玫瑰11朵礼盒',
    categoryIds: ['c1', 'c4', 'c8'],
    categoryNames: ['鲜切花', '玫瑰', '红玫瑰'],
    price: 199,
    marketPrice: 259,
    stock: 50,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1518882605630-8eb704f77a0f?w=400&q=80',
      'https://images.unsplash.com/photo-1548092990-5e0ba7a55f93?w=400&q=80',
    ],
    description: '精选厄瓜多尔红玫瑰11朵，搭配精美礼盒包装，适合生日、情人节、纪念日等浪漫场合。',
    status: 'active',
    tags: ['玫瑰', '红玫瑰', '礼盒', '浪漫', '生日'],
    salesCount: 328,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-11-20T15:30:00Z',
  },
  {
    id: 'p2',
    name: '粉色康乃馨16朵',
    categoryIds: ['c1', 'c6'],
    categoryNames: ['鲜切花', '康乃馨'],
    price: 128,
    marketPrice: 158,
    stock: 80,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=400',
    ],
    description: '粉色康乃馨16朵，象征母爱与温馨，适合母亲节、生日礼物、探病慰问。',
    status: 'active',
    tags: ['康乃馨', '粉色', '母亲节', '温馨'],
    salesCount: 256,
    createdAt: '2024-06-05T10:00:00Z',
    updatedAt: '2024-11-18T11:20:00Z',
  },
  {
    id: 'p3',
    name: '白百合3朵+满天星',
    categoryIds: ['c1', 'c5'],
    categoryNames: ['鲜切花', '百合'],
    price: 158,
    marketPrice: 198,
    stock: 35,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1616638775683-93c8f2d0a8c2?w=400&q=80',
    ],
    description: '精选白百合3朵搭配满天星，清新淡雅，适合开业、乔迁、家居装饰。',
    status: 'active',
    tags: ['百合', '白色', '满天星', '清新'],
    salesCount: 189,
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2024-11-15T09:45:00Z',
  },
  {
    id: 'p4',
    name: '郁金香10朵混色',
    categoryIds: ['c1', 'c7'],
    categoryNames: ['鲜切花', '郁金香'],
    price: 188,
    marketPrice: 228,
    stock: 5,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&q=80',
    ],
    description: '荷兰进口郁金香10朵，多色混搭，高贵优雅，适合高端礼品、婚礼装饰。',
    status: 'active',
    tags: ['郁金香', '混色', '进口', '高端'],
    salesCount: 98,
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-11-12T14:20:00Z',
  },
  {
    id: 'p5',
    name: '粉玫瑰19朵礼盒',
    categoryIds: ['c1', 'c4', 'c9'],
    categoryNames: ['鲜切花', '玫瑰', '粉玫瑰'],
    price: 268,
    marketPrice: 328,
    stock: 0,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80',
    ],
    description: '粉色玫瑰19朵，精美礼盒包装，表达深深的爱意与祝福，适合表白、求婚。',
    status: 'inactive',
    tags: ['玫瑰', '粉玫瑰', '礼盒', '表白', '求婚'],
    salesCount: 412,
    createdAt: '2024-05-20T10:00:00Z',
    updatedAt: '2024-10-30T16:00:00Z',
  },
  {
    id: 'p6',
    name: '多肉植物拼盘',
    categoryIds: ['c2', 'c11'],
    categoryNames: ['绿植盆栽', '多肉植物'],
    price: 88,
    marketPrice: 108,
    stock: 120,
    unit: '盆',
    images: [
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&q=80',
    ],
    description: '精选5种多肉植物组合拼盘，易养护，适合办公室桌摆、窗台装饰。',
    status: 'active',
    tags: ['多肉', '绿植', '拼盘', '易养'],
    salesCount: 567,
    createdAt: '2024-04-15T10:00:00Z',
    updatedAt: '2024-11-22T10:10:00Z',
  },
  {
    id: 'p7',
    name: '绿萝盆栽中号',
    categoryIds: ['c2', 'c12'],
    categoryNames: ['绿植盆栽', '绿萝'],
    price: 68,
    marketPrice: 88,
    stock: 45,
    unit: '盆',
    images: [
      'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400&q=80',
    ],
    description: '净化空气首选绿萝，中号盆栽，适合新居装修、办公室净化空气。',
    status: 'active',
    tags: ['绿萝', '净化空气', '盆栽', '易养'],
    salesCount: 423,
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-11-21T11:30:00Z',
  },
  {
    id: 'p8',
    name: '永生花玫瑰礼盒',
    categoryIds: ['c3'],
    categoryNames: ['永生花'],
    price: 388,
    marketPrice: 488,
    stock: 25,
    unit: '盒',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
    ],
    description: '进口永生花玫瑰，保存3-5年不变色，精致礼盒包装，适合送女友、送长辈。',
    status: 'active',
    tags: ['永生花', '玫瑰', '礼盒', '长期保存'],
    salesCount: 156,
    createdAt: '2024-06-20T10:00:00Z',
    updatedAt: '2024-11-19T13:45:00Z',
  },
];

// ==================== 模拟库存数据 ====================

export const mockInventories: Inventory[] = mockProducts.map((product, index) => {
  const status = index === 4 ? 'empty' : index === 3 ? 'low' : index === 2 ? 'low' : 'sufficient';
  const safeStock = Math.ceil(product.stock * 0.3);
  
  return {
    productId: product.id,
    productName: product.name,
    categoryName: product.categoryNames.join(' > '),
    currentStock: product.stock,
    safeStock: safeStock,
    status: status,
    lastUpdateTime: product.updatedAt,
    aiThreshold: Math.ceil(safeStock * 1.2),
  };
});

// ==================== 模拟出入库记录 ====================

export const mockStockRecords: StockRecord[] = [
  {
    id: 'r1',
    productId: 'p1',
    productName: '红玫瑰11朵礼盒',
    type: 'in',
    subType: 'purchase',
    quantity: 50,
    beforeStock: 30,
    afterStock: 80,
    operator: '张三',
    remark: '供应商：云南花语鲜花批发部，批次：20241201',
    createdAt: '2024-12-01T09:00:00Z',
  },
  {
    id: 'r2',
    productId: 'p2',
    productName: '粉色康乃馨16朵',
    type: 'out',
    subType: 'sale',
    quantity: 5,
    beforeStock: 85,
    afterStock: 80,
    operator: '李四',
    remark: '订单号：ORD20241201001',
    createdAt: '2024-12-01T10:30:00Z',
  },
  {
    id: 'r3',
    productId: 'p4',
    productName: '郁金香10朵混色',
    type: 'out',
    subType: 'damage',
    quantity: 3,
    beforeStock: 8,
    afterStock: 5,
    operator: '王五',
    remark: '运输途中损坏，已报损',
    createdAt: '2024-12-01T11:45:00Z',
  },
  {
    id: 'r4',
    productId: 'p6',
    productName: '多肉植物拼盘',
    type: 'in',
    subType: 'purchase',
    quantity: 100,
    beforeStock: 50,
    afterStock: 150,
    operator: '张三',
    remark: '新到货，补货',
    createdAt: '2024-11-30T14:00:00Z',
  },
  {
    id: 'r5',
    productId: 'p3',
    productName: '白百合3朵+满天星',
    type: 'out',
    subType: 'sale',
    quantity: 10,
    beforeStock: 45,
    afterStock: 35,
    operator: '李四',
    remark: '客户采购，批发价',
    createdAt: '2024-11-30T16:20:00Z',
  },
  {
    id: 'r6',
    productId: 'p5',
    productName: '粉玫瑰19朵礼盒',
    type: 'out',
    subType: 'count_out',
    quantity: 20,
    beforeStock: 20,
    afterStock: 0,
    operator: '管理员',
    remark: '库存盘点差异，商品已售完',
    createdAt: '2024-11-28T09:00:00Z',
  },
];

// ==================== 模拟预警数据 ====================

export const mockStockWarnings: StockWarning[] = [
  {
    id: 'w1',
    productId: 'p4',
    productName: '郁金香10朵混色',
    currentStock: 5,
    safeStock: 15,
    suggestedStock: 50,
    reason: '库存低于安全阈值，且临近节假日销售高峰',
    status: 'pending',
    createdAt: '2024-12-01T12:00:00Z',
  },
  {
    id: 'w2',
    productId: 'p3',
    productName: '白百合3朵+满天星',
    currentStock: 35,
    safeStock: 25,
    suggestedStock: 60,
    reason: '近期销量增长30%，建议提高库存',
    status: 'pending',
    createdAt: '2024-12-01T08:00:00Z',
  },
  {
    id: 'w3',
    productId: 'p5',
    productName: '粉玫瑰19朵礼盒',
    currentStock: 0,
    safeStock: 30,
    suggestedStock: 80,
    reason: '库存已售完，商品已下架',
    status: 'processed',
    createdAt: '2024-11-28T09:30:00Z',
    processedAt: '2024-11-28T10:00:00Z',
    processedBy: '管理员',
  },
];

// ==================== 模拟统计数据 ====================

export const mockDashboardStats: DashboardStats = {
  totalProducts: 8,
  activeProducts: 7,
  lowStockProducts: 2,
  outOfStockProducts: 1,
  todaySales: 2860,
  todayOrders: 23,
  inventoryValue: 45800,
  warningCount: 2,
};

export const mockSalesTrend: SalesTrend[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return {
    date: date.toISOString().split('T')[0],
    sales: Math.floor(Math.random() * 5000) + 2000,
    orders: Math.floor(Math.random() * 30) + 10,
  };
});

export const mockCategorySales: CategorySales[] = [
  { categoryName: '鲜切花', sales: 15680, percentage: 52 },
  { categoryName: '绿植盆栽', sales: 8920, percentage: 30 },
  { categoryName: '永生花', sales: 5420, percentage: 18 },
];

export const mockTopProducts: TopProduct[] = [
  { id: 'p6', name: '多肉植物拼盘', sales: 567, image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200' },
  { id: 'p7', name: '绿萝盆栽中号', sales: 423, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=200' },
  { id: 'p5', name: '粉玫瑰19朵礼盒', sales: 412, image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=200' },
  { id: 'p1', name: '红玫瑰11朵礼盒', sales: 328, image: 'https://images.unsplash.com/photo-1518882605630-8eb704f77a0f?w=200' },
];

// ==================== 工具函数 ====================

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toFixed(2)}`;
};

export const getStockStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    sufficient: '充足',
    low: '不足',
    out: '缺货',
    empty: '断货',
  };
  return labels[status] || status;
};

export const getStockStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    sufficient: 'text-green-600 bg-green-50',
    low: 'text-yellow-600 bg-yellow-50',
    out: 'text-orange-600 bg-orange-50',
    empty: 'text-red-600 bg-red-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
};
