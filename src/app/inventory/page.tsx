'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  ArrowUpDown,
  Eye,
  Settings2,
  ArrowRight,
} from 'lucide-react';
import {
  mockInventories,
  mockCategories,
  getStockStatusLabel,
  getStockStatusColor,
  formatDate,
} from '@/lib/mock-data';
import { Inventory, StockStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<StockStatus, { label: string; color: string; bgColor: string }> = {
  sufficient: { label: '充足', color: 'text-green-600', bgColor: 'bg-green-100' },
  low: { label: '不足', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  out: { label: '缺货', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  empty: { label: '断货', color: 'text-red-600', bgColor: 'bg-red-100' },
};

export default function InventoryPage() {
  const [inventories, setInventories] = useState<Inventory[]>(mockInventories);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showThresholdDialog, setShowThresholdDialog] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [newThreshold, setNewThreshold] = useState('');

  const filteredInventories = inventories.filter((inv) => {
    const matchKeyword =
      !searchKeyword ||
      inv.productName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      inv.status === statusFilter ||
      (statusFilter === 'warning' && (inv.status === 'low' || inv.status === 'out' || inv.status === 'empty'));
    const matchCategory =
      categoryFilter === 'all' ||
      inv.categoryName.includes(mockCategories.find(c => c.id === categoryFilter)?.name || '');
    return matchKeyword && matchStatus && matchCategory;
  });

  const stats = {
    total: inventories.length,
    sufficient: inventories.filter((i) => i.status === 'sufficient').length,
    low: inventories.filter((i) => i.status === 'low').length,
    out: inventories.filter((i) => i.status === 'out' || i.status === 'empty').length,
  };

  const handleUpdateThreshold = () => {
    if (selectedInventory && newThreshold) {
      setInventories((prev) =>
        prev.map((inv) =>
          inv.productId === selectedInventory.productId
            ? { ...inv, safeStock: parseInt(newThreshold) }
            : inv
        )
      );
      setShowThresholdDialog(false);
      setSelectedInventory(null);
      setNewThreshold('');
    }
  };

  return (
    <DashboardLayout
      title="实时库存监控"
      breadcrumbs={[
        { label: '首页', href: '/dashboard' },
        { label: '库存管理' },
        { label: '实时监控' },
      ]}
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className={cn(
              'cursor-pointer transition-all',
              statusFilter === 'all' && 'ring-2 ring-pink-500'
            )}
            onClick={() => setStatusFilter('all')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">全部商品</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'cursor-pointer transition-all',
              statusFilter === 'sufficient' && 'ring-2 ring-green-500'
            )}
            onClick={() => setStatusFilter('sufficient')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">库存充足</p>
                  <p className="text-2xl font-bold text-green-600">{stats.sufficient}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'cursor-pointer transition-all',
              statusFilter === 'low' && 'ring-2 ring-yellow-500'
            )}
            onClick={() => setStatusFilter('low')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">库存不足</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.low}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'cursor-pointer transition-all',
              statusFilter === 'warning' && 'ring-2 ring-red-500'
            )}
            onClick={() => setStatusFilter('warning')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">缺货/断货</p>
                  <p className="text-2xl font-bold text-red-600">{stats.out}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜索商品..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {mockCategories
                  .filter((c) => c.level === 1)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              刷新
            </Button>
            <a href="/inventory/records">
              <Button variant="outline" className="gap-2">
                出入库记录
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>商品信息</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="text-right">
                    <button className="flex items-center gap-1 hover:text-slate-900">
                      当前库存
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">安全库存</TableHead>
                  <TableHead>AI建议阈值</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventories.map((inv) => (
                  <TableRow key={inv.productId} className="table-row-hover">
                    <TableCell>
                      <p className="font-medium text-slate-900">{inv.productName}</p>
                      <p className="text-xs text-slate-400">ID: {inv.productId}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-600">{inv.categoryName}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-medium text-slate-900">{inv.currentStock}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="text-slate-600">{inv.safeStock}</p>
                    </TableCell>
                    <TableCell>
                      {inv.aiThreshold && inv.aiThreshold !== inv.safeStock && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-pink-600 border-pink-200 bg-pink-50">
                            {inv.aiThreshold}
                          </Badge>
                          <span className="text-xs text-slate-400">AI建议</span>
                        </div>
                      )}
                      {!inv.aiThreshold || inv.aiThreshold === inv.safeStock ? (
                        <span className="text-xs text-slate-400">-</span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(statusConfig[inv.status].bgColor, statusConfig[inv.status].color)}>
                        {statusConfig[inv.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-500">{formatDate(inv.lastUpdateTime)}</p>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedInventory(inv);
                          setNewThreshold(inv.safeStock.toString());
                          setShowThresholdDialog(true);
                        }}
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredInventories.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400">暂无库存数据</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            显示 {filteredInventories.length} 条，共 {inventories.length} 件商品
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              下一页
            </Button>
          </div>
        </div>
      </div>

      {/* Threshold Dialog */}
      <Dialog open={showThresholdDialog} onOpenChange={setShowThresholdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>设置安全库存阈值</DialogTitle>
          </DialogHeader>
          {selectedInventory && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900">{selectedInventory.productName}</p>
                <p className="text-sm text-slate-500 mt-1">
                  当前库存：{selectedInventory.currentStock} | 安全库存：{selectedInventory.safeStock}
                </p>
              </div>

              {selectedInventory.aiThreshold && (
                <div className="p-3 bg-pink-50 border border-pink-100 rounded-lg">
                  <div className="flex items-center gap-2 text-pink-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">AI 建议阈值</span>
                  </div>
                  <p className="text-sm text-pink-600 mt-1">
                    基于历史数据分析，建议将安全库存设置为 {selectedInventory.aiThreshold}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  新的安全库存阈值
                </label>
                <Input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  placeholder="请输入新的阈值"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowThresholdDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleUpdateThreshold}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
