'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Warehouse,
  DollarSign,
  Bell,
  ArrowRight,
  Flame,
} from 'lucide-react';
import {
  mockDashboardStats,
  mockSalesTrend,
  mockCategorySales,
  mockTopProducts,
  mockStockWarnings,
  formatCurrency,
} from '@/lib/mock-data';
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
  Cell,
} from 'recharts';

const stats = [
  {
    title: '商品总数',
    value: mockDashboardStats.totalProducts,
    subValue: `活跃 ${mockDashboardStats.activeProducts}`,
    icon: Package,
    color: 'bg-gradient-primary',
    trend: '+12%',
    trendUp: true,
  },
  {
    title: '今日销售额',
    value: formatCurrency(mockDashboardStats.todaySales),
    subValue: `${mockDashboardStats.todayOrders} 笔订单`,
    icon: DollarSign,
    color: 'bg-gradient-success',
    trend: '+8.5%',
    trendUp: true,
  },
  {
    title: '库存预警',
    value: mockDashboardStats.warningCount,
    subValue: `${mockDashboardStats.lowStockProducts} 低库存`,
    icon: AlertTriangle,
    color: 'bg-gradient-warning',
    trend: '需关注',
    trendUp: false,
  },
  {
    title: '库存总值',
    value: formatCurrency(mockDashboardStats.inventoryValue),
    subValue: '当前库存',
    icon: Warehouse,
    color: 'bg-gradient-info',
    trend: '-2.3%',
    trendUp: false,
  },
];

const COLORS = ['#ec4899', '#10b981', '#f59e0b'];

export default function DashboardPage() {
  return (
    <DashboardLayout title="仪表盘" breadcrumbs={[{ label: '首页' }]}>
      <div className="space-y-6 animate-fadeIn">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{stat.subValue}</span>
                      <Badge
                        variant={stat.trendUp ? 'default' : 'secondary'}
                        className={`text-xs ${
                          stat.trendUp
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {stat.trendUp ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {stat.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">销售趋势</CardTitle>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-500">
                  <option>近7天</option>
                  <option>近30天</option>
                  <option>近90天</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSalesTrend}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `¥${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: number) => [formatCurrency(value), '销售额']}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#ec4899"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Sales Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">品类销售占比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategorySales}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="sales"
                    >
                      {mockCategorySales.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {mockCategorySales.map((item, index) => (
                  <div key={`category-${index}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-slate-600">{item.categoryName}</span>
                    </div>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  热销商品
                </CardTitle>
                <a
                  href="/products"
                  className="text-sm text-pink-600 hover:text-pink-700 flex items-center gap-1"
                >
                  查看全部
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockTopProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-lg font-bold text-pink-600">
                        {product.sales}
                        <span className="text-xs font-normal text-slate-400 ml-1">
                          销量
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stock Warnings */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  库存预警
                </CardTitle>
                <a
                  href="/inventory/warnings"
                  className="text-sm text-pink-600 hover:text-pink-700 flex items-center gap-1"
                >
                  处理
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockStockWarnings
                  .filter((w) => w.status === 'pending')
                  .map((warning) => (
                    <div
                      key={warning.id}
                      className="p-3 bg-amber-50 border border-amber-100 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {warning.productName}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            当前库存: {warning.currentStock} | 安全库存:{' '}
                            {warning.safeStock}
                          </p>
                          <p className="text-xs text-amber-600 mt-1">
                            {warning.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {mockStockWarnings.filter((w) => w.status === 'pending').length ===
                  0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">暂无待处理预警</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
