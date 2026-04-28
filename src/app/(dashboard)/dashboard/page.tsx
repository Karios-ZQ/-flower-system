'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  Flower2,
  Loader2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardData {
  totalProducts: number;
  lowStockCount: number;
  todaySales: number;
  todayOrders: number;
  salesTrend: { date: string; amount: number }[];
  categoryDistribution: { name: string; value: number }[];
}

// Mock 数据用于无法连接数据库时
const mockDashboardData: DashboardData = {
  totalProducts: 22,
  lowStockCount: 3,
  todaySales: 3865.50,
  todayOrders: 18,
  salesTrend: [
    { date: '4/22', amount: 2850 },
    { date: '4/23', amount: 3200 },
    { date: '4/24', amount: 2950 },
    { date: '4/25', amount: 3600 },
    { date: '4/26', amount: 4100 },
    { date: '4/27', amount: 3780 },
    { date: '4/28', amount: 3865 },
  ],
  categoryDistribution: [
    { name: '玫瑰', value: 8 },
    { name: '百合', value: 3 },
    { name: '郁金香', value: 3 },
    { name: '康乃馨', value: 3 },
    { name: '向日葵', value: 3 },
    { name: '混搭', value: 2 },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      
      if (result.code === 200) {
        setData(result.data);
        setUsingMockData(false);
      } else {
        // 使用 mock 数据
        setData(mockDashboardData);
        setUsingMockData(true);
        setError(result.message);
      }
    } catch (err) {
      // 使用 mock 数据
      setData(mockDashboardData);
      setUsingMockData(true);
      setError('无法连接到数据库，使用演示数据');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  const COLORS = ['#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">数据概览</h1>
          <p className="text-slate-500 mt-1">实时监控花店运营数据</p>
        </div>
        {usingMockData && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
            演示数据模式
          </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">商品总数</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{data?.totalProducts || 0}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+12%</span>
            <span className="text-slate-400 ml-1">较上月</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">低库存预警</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{data?.lowStockCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500">需关注</span>
            <span className="text-slate-400 ml-1">库存状态</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">今日销售额</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">¥{data?.todaySales?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+8.5%</span>
            <span className="text-slate-400 ml-1">较昨日</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">今日订单</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{data?.todayOrders || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+15%</span>
            <span className="text-slate-400 ml-1">较昨日</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">销售趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.salesTrend || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`¥${value.toFixed(2)}`, '销售额']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#ec4899"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">商品分类分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.categoryDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data?.categoryDistribution?.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">快捷操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/products/add"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-100 hover:border-pink-200 hover:bg-pink-50 transition-colors"
          >
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Flower2 className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">添加商品</p>
              <p className="text-sm text-slate-500">新增鲜花商品</p>
            </div>
          </a>
          <a
            href="/inventory/monitor"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">库存监控</p>
              <p className="text-sm text-slate-500">查看库存状态</p>
            </div>
          </a>
          <a
            href="/inventory/record"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">出入库</p>
              <p className="text-sm text-slate-500">记录库存变动</p>
            </div>
          </a>
          <a
            href="/inventory/warning"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">预警管理</p>
              <p className="text-sm text-slate-500">处理库存预警</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
