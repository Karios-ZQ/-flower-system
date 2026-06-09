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
  // 一级分类
  { id: 'c1', name: '鲜切花', parentId: undefined, level: 1 },
  { id: 'c2', name: '绿植盆栽', parentId: undefined, level: 1 },
  { id: 'c3', name: '永生花', parentId: undefined, level: 1 },
  { id: 'c4', name: '花艺周边', parentId: undefined, level: 1 },
  { id: 'c5', name: '婚礼花艺', parentId: undefined, level: 1 },
  { id: 'c6', name: '商务定制', parentId: undefined, level: 1 },
  
  // 鲜切花 - 二级分类
  { id: 'c11', name: '玫瑰', parentId: 'c1', level: 2 },
  { id: 'c12', name: '百合', parentId: 'c1', level: 2 },
  { id: 'c13', name: '康乃馨', parentId: 'c1', level: 2 },
  { id: 'c14', name: '郁金香', parentId: 'c1', level: 2 },
  { id: 'c15', name: '向日葵', parentId: 'c1', level: 2 },
  { id: 'c16', name: '洋桔梗', parentId: 'c1', level: 2 },
  { id: 'c17', name: '绣球', parentId: 'c1', level: 2 },
  { id: 'c18', name: '满天星', parentId: 'c1', level: 2 },
  { id: 'c19', name: '紫罗兰', parentId: 'c1', level: 2 },
  { id: 'c110', name: '菊花', parentId: 'c1', level: 2 },
  
  // 玫瑰 - 三级分类
  { id: 'c111', name: '红玫瑰', parentId: 'c11', level: 3 },
  { id: 'c112', name: '粉玫瑰', parentId: 'c11', level: 3 },
  { id: 'c113', name: '白玫瑰', parentId: 'c11', level: 3 },
  { id: 'c114', name: '香槟玫瑰', parentId: 'c11', level: 3 },
  { id: 'c115', name: '紫玫瑰', parentId: 'c11', level: 3 },
  { id: 'c116', name: '黄玫瑰', parentId: 'c11', level: 3 },
  { id: 'c117', name: '蓝玫瑰', parentId: 'c11', level: 3 },
  { id: 'c118', name: '彩虹玫瑰', parentId: 'c11', level: 3 },
  
  // 百合 - 三级分类
  { id: 'c121', name: '白百合', parentId: 'c12', level: 3 },
  { id: 'c122', name: '粉百合', parentId: 'c12', level: 3 },
  { id: 'c123', name: '黄百合', parentId: 'c12', level: 3 },
  { id: 'c124', name: 'OT百合', parentId: 'c12', level: 3 },
  { id: 'c125', name: '亚百合', parentId: 'c12', level: 3 },
  
  // 绿植盆栽 - 二级分类
  { id: 'c21', name: '多肉植物', parentId: 'c2', level: 2 },
  { id: 'c22', name: '观叶植物', parentId: 'c2', level: 2 },
  { id: 'c23', name: '小型盆栽', parentId: 'c2', level: 2 },
  { id: 'c24', name: '大型绿植', parentId: 'c2', level: 2 },
  { id: 'c25', name: '水培植物', parentId: 'c2', level: 2 },
  
  // 多肉 - 三级分类
  { id: 'c211', name: '景天科', parentId: 'c21', level: 3 },
  { id: 'c212', name: '十二卷属', parentId: 'c21', level: 3 },
  { id: 'c213', name: '仙人掌科', parentId: 'c21', level: 3 },
  { id: 'c214', name: '番杏科', parentId: 'c21', level: 3 },
  { id: 'c215', name: '莲花掌属', parentId: 'c21', level: 3 },
  
  // 永生花 - 二级分类
  { id: 'c31', name: '永生玫瑰', parentId: 'c3', level: 2 },
  { id: 'c32', name: '永生盒花', parentId: 'c3', level: 2 },
  { id: 'c33', name: '永生花瓶', parentId: 'c3', level: 2 },
  { id: 'c34', name: '永生花束', parentId: 'c3', level: 2 },
  { id: 'c35', name: '香薰永生花', parentId: 'c3', level: 2 },
  
  // 花艺周边 - 二级分类
  { id: 'c41', name: '花瓶花器', parentId: 'c4', level: 2 },
  { id: 'c42', name: '包装材料', parentId: 'c4', level: 2 },
  { id: 'c43', name: '工具辅材', parentId: 'c4', level: 2 },
  { id: 'c44', name: '营养液肥', parentId: 'c4', level: 2 },
  { id: 'c45', name: '贺卡丝带', parentId: 'c4', level: 2 },
  
  // 婚礼花艺 - 二级分类
  { id: 'c51', name: '手捧花', parentId: 'c5', level: 2 },
  { id: 'c52', name: '胸花腕花', parentId: 'c5', level: 2 },
  { id: 'c53', name: '婚车花艺', parentId: 'c5', level: 2 },
  { id: 'c54', name: '拱门花艺', parentId: 'c5', level: 2 },
  { id: 'c55', name: '桌花布置', parentId: 'c5', level: 2 },
  
  // 商务定制 - 二级分类
  { id: 'c61', name: '开业花篮', parentId: 'c6', level: 2 },
  { id: 'c62', name: '会议桌花', parentId: 'c6', level: 2 },
  { id: 'c63', name: '绿植租摆', parentId: 'c6', level: 2 },
  { id: 'c64', name: '企业定制', parentId: 'c6', level: 2 },
  { id: 'c65', name: '节日花艺', parentId: 'c6', level: 2 },
];

// ==================== 模拟商品数据 ====================

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '红玫瑰11朵礼盒',
    categoryIds: ['c1', 'c11', 'c111'],
    categoryNames: ['鲜切花', '玫瑰', '红玫瑰'],
    price: 199,
    marketPrice: 259,
    stock: 50,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400&h=400&fit=crop',
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
    categoryIds: ['c1', 'c13'],
    categoryNames: ['鲜切花', '康乃馨'],
    price: 128,
    marketPrice: 158,
    stock: 80,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=400&fit=crop',
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
    categoryIds: ['c1', 'c12', 'c121'],
    categoryNames: ['鲜切花', '百合', '白百合'],
    price: 158,
    marketPrice: 198,
    stock: 35,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&h=400&fit=crop',
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
    categoryIds: ['c1', 'c14'],
    categoryNames: ['鲜切花', '郁金香'],
    price: 188,
    marketPrice: 228,
    stock: 5,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&h=400&fit=crop',
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
    categoryIds: ['c1', 'c11', 'c112'],
    categoryNames: ['鲜切花', '玫瑰', '粉玫瑰'],
    price: 268,
    marketPrice: 328,
    stock: 0,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop',
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
    categoryIds: ['c2', 'c21', 'c211'],
    categoryNames: ['绿植盆栽', '多肉植物', '景天科'],
    price: 88,
    marketPrice: 108,
    stock: 120,
    unit: '盆',
    images: [
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop',
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
    categoryIds: ['c2', 'c22'],
    categoryNames: ['绿植盆栽', '观叶植物'],
    price: 68,
    marketPrice: 88,
    stock: 45,
    unit: '盆',
    images: [
      'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=400&fit=crop',
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
    categoryIds: ['c3', 'c31'],
    categoryNames: ['永生花', '永生玫瑰'],
    price: 388,
    marketPrice: 488,
    stock: 25,
    unit: '盒',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&h=400&fit=crop',
    ],
    description: '进口永生花玫瑰，保存3-5年不变色，精致礼盒包装，适合送女友、送长辈。',
    status: 'active',
    tags: ['永生花', '玫瑰', '礼盒', '长期保存'],
    salesCount: 156,
    createdAt: '2024-06-20T10:00:00Z',
    updatedAt: '2024-11-19T13:45:00Z',
  },
  {
    id: 'p9',
    name: '向日葵6朵阳光礼盒',
    categoryIds: ['c1', 'c15'],
    categoryNames: ['鲜切花', '向日葵'],
    price: 168,
    marketPrice: 198,
    stock: 60,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=400&fit=crop',
    ],
    description: '灿烂向日葵6朵，阳光般温暖，适合送给朋友、高考祝福、毕业季。',
    status: 'active',
    tags: ['向日葵', '阳光', '祝福', '毕业'],
    salesCount: 234,
    createdAt: '2024-07-15T10:00:00Z',
    updatedAt: '2024-11-20T10:00:00Z',
  },
  {
    id: 'p10',
    name: '绣球花束混色',
    categoryIds: ['c1', 'c17'],
    categoryNames: ['鲜切花', '绣球'],
    price: 258,
    marketPrice: 318,
    stock: 20,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=400&fit=crop',
    ],
    description: '进口绣球花，多色混搭，饱满圆润，适合新娘手捧、家居摆设。',
    status: 'active',
    tags: ['绣球', '混色', '进口', '高端'],
    salesCount: 145,
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-11-18T14:00:00Z',
  },
  {
    id: 'p11',
    name: '开业花篮大号',
    categoryIds: ['c6', 'c61'],
    categoryNames: ['商务定制', '开业花篮'],
    price: 388,
    marketPrice: 458,
    stock: 30,
    unit: '对',
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop',
    ],
    description: '双层开业花篮，喜庆大气，适合新店开业、乔迁之喜、庆典活动。',
    status: 'active',
    tags: ['开业', '花篮', '喜庆', '商务'],
    salesCount: 89,
    createdAt: '2024-08-10T10:00:00Z',
    updatedAt: '2024-11-15T09:00:00Z',
  },
  {
    id: 'p12',
    name: '洋桔梗粉色束',
    categoryIds: ['c1', 'c16'],
    categoryNames: ['鲜切花', '洋桔梗'],
    price: 138,
    marketPrice: 168,
    stock: 40,
    unit: '束',
    images: [
      'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop',
    ],
    description: '粉色洋桔梗，线条优美，花期长久，适合日常插花、家居装饰。',
    status: 'active',
    tags: ['洋桔梗', '粉色', '日常', '花期长'],
    salesCount: 198,
    createdAt: '2024-08-20T10:00:00Z',
    updatedAt: '2024-11-12T11:00:00Z',
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
  totalProducts: 12,
  activeProducts: 11,
  lowStockProducts: 2,
  outOfStockProducts: 1,
  todaySales: 3560,
  todayOrders: 28,
  inventoryValue: 52800,
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
  { categoryName: '鲜切花', sales: 18680, percentage: 52 },
  { categoryName: '绿植盆栽', sales: 8920, percentage: 25 },
  { categoryName: '永生花', sales: 5420, percentage: 15 },
  { categoryName: '商务定制', sales: 2900, percentage: 8 },
];

export const mockTopProducts: TopProduct[] = [
  { id: 'p6', name: '多肉植物拼盘', sales: 567, image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200&h=200&fit=crop' },
  { id: 'p7', name: '绿萝盆栽中号', sales: 423, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop' },
  { id: 'p5', name: '粉玫瑰19朵礼盒', sales: 412, image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop' },
  { id: 'p1', name: '红玫瑰11朵礼盒', sales: 328, image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=200&h=200&fit=crop' },
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

// ==================== AI 场景图生成配置 ====================

export interface AISceneConfig {
  scene: string;
  description: string;
  prompt: string;
}

export const aiSceneConfigs: AISceneConfig[] = [
  {
    scene: 'gift',
    description: '礼物场景',
    prompt: 'Fresh rose bouquet gift box with elegant wrapping paper and ribbon, on a white marble table, soft studio lighting, romantic pink background, professional product photography, high detail, 8K quality',
  },
  {
    scene: 'home',
    description: '家居场景',
    prompt: 'Fresh flowers in an elegant glass vase on a wooden Scandinavian style coffee table, warm cozy living room background with natural sunlight streaming through window, minimalist interior design, professional photography',
  },
  {
    scene: 'wedding',
    description: '婚礼场景',
    prompt: 'Elegant white rose and peony wedding floral arrangement with greenery, romantic outdoor garden ceremony background, soft natural golden hour lighting, dreamy bokeh effect, professional wedding photography',
  },
  {
    scene: 'office',
    description: '办公场景',
    prompt: 'Fresh potted orchid plant on a clean modern office desk, minimal white workspace background, bright natural window light, professional product photography, fresh green leaves',
  },
  {
    scene: 'celebration',
    description: '庆典场景',
    prompt: 'Colorful mixed flower arrangement with roses, lilies and sunflowers in an elegant vase, festive celebration background with warm golden lighting, professional event photography',
  },
  {
    scene: 'valentine',
    description: '情人节场景',
    prompt: 'Luxurious red rose heart-shaped bouquet with black wrapping paper and LED lights, romantic candlelit dinner table background, Valentine\'s Day atmosphere, intimate mood lighting, professional photography',
  },
  {
    scene: 'birthday',
    description: '生日场景',
    prompt: 'Beautiful pink and white flower arrangement with hydrangeas and roses as birthday gift, festive background with soft bokeh lights, celebration cake nearby, joyful warm atmosphere',
  },
  {
    scene: 'commercial',
    description: '商业场景',
    prompt: 'Luxury flower shop display with premium fresh cut roses and exotic flowers in crystal vases, elegant upscale boutique background, sophisticated warm ambient lighting, professional commercial photography',
  },
];

// Fallback鲜花图片 - 使用可靠的鲜花图片
export const flowerFallbackImages: string[] = [
  'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800&h=600&fit=crop', // 粉玫瑰
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop', // 彩色鲜花
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=600&fit=crop', // 粉玫瑰
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&h=600&fit=crop', // 白色鲜花
  'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=600&fit=crop', // 向日葵
  'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&h=600&fit=crop', // 郁金香
];
