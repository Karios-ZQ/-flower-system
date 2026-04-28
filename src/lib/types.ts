// ==================== 用户与认证 ====================

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'operator';
  email?: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ==================== 商品管理 ====================

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  level: 1 | 2 | 3;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  categoryIds: string[];
  categoryNames: string[];
  price: number;
  marketPrice: number;
  stock: number;
  unit: string;
  images: string[];
  description: string;
  status: 'active' | 'inactive';
  tags: string[];
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  categoryIds: string[];
  price: number;
  marketPrice: number;
  stock: number;
  unit: string;
  images: string[];
  description: string;
  tags: string[];
}

export interface ProductQuery {
  keyword?: string;
  categoryId?: string;
  status?: 'active' | 'inactive' | 'all';
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// ==================== 库存管理 ====================

export type StockStatus = 'sufficient' | 'low' | 'out' | 'empty';

export interface Inventory {
  productId: string;
  productName: string;
  categoryName: string;
  currentStock: number;
  safeStock: number;
  status: StockStatus;
  lastUpdateTime: string;
  aiThreshold?: number;
}

export interface InventoryQuery {
  status?: StockStatus | 'all';
  categoryId?: string;
  keyword?: string;
  page: number;
  pageSize: number;
}

export interface StockRecord {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  subType: 'purchase' | 'return' | 'count_in' | 'sale' | 'damage' | 'count_out';
  quantity: number;
  beforeStock: number;
  afterStock: number;
  operator: string;
  remark?: string;
  createdAt: string;
}

export interface StockRecordQuery {
  productId?: string;
  type?: 'in' | 'out' | 'all';
  startDate?: string;
  endDate?: string;
  operator?: string;
  page: number;
  pageSize: number;
}

export interface StockWarning {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  safeStock: number;
  suggestedStock: number;
  reason: string;
  status: 'pending' | 'processed' | 'ignored';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

// ==================== AI 功能 ====================

export interface AIGenerateRequest {
  keywords: string;
  type: 'description' | 'tags';
}

export interface AIGenerateResponse {
  content: string;
  tags?: string[];
  confidence?: number;
}

export interface AIClassifyRequest {
  name: string;
  description: string;
  imageUrl?: string;
}

export interface AIClassifyResponse {
  categoryIds: string[];
  categoryNames: string[];
  confidence: number;
  tags: string[];
}

export interface SalesPredictRequest {
  productId: string;
  days: number;
}

export interface SalesPredictResponse {
  productId: string;
  productName: string;
  predictions: {
    date: string;
    predictedSales: number;
    confidence: number;
  }[];
  peakDays: {
    date: string;
    reason: string;
  }[];
}

export interface AnomalyDetectRequest {
  productId: string;
}

export interface AnomalyDetectResponse {
  productId: string;
  hasAnomaly: boolean;
  anomalyType?: 'surge' | 'drop' | 'static' | 'negative';
  description?: string;
  suggestedAction?: string;
}

// ==================== 统计数据 ====================

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  todaySales: number;
  todayOrders: number;
  inventoryValue: number;
  warningCount: number;
}

export interface SalesTrend {
  date: string;
  sales: number;
  orders: number;
}

export interface CategorySales {
  categoryName: string;
  sales: number;
  percentage: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  image: string;
}

// ==================== 通用响应 ====================

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
