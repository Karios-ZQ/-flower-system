'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  XCircle,
  Loader2,
  Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { mockInventory } from '@/lib/mock-data';

interface InventoryItem {
  product_id: number;
  product_name: string;
  current_stock: number;
  safe_stock: number;
  unit: string;
  status: 'sufficient' | 'low' | 'out' | 'empty';
  stock_ratio: number;
  last_update_time: string;
}

export default function InventoryMonitorPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inventory');
      const result = await response.json();
      
      if (result.code === 200) {
        setInventory(result.data);
        setUsingMockData(false);
      } else {
        setInventory(mockInventory);
        setUsingMockData(true);
      }
    } catch {
      setInventory(mockInventory);
      setUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: inventory.length,
    sufficient: inventory.filter((i) => i.status === 'sufficient').length,
    low: inventory.filter((i) => i.status === 'low').length,
    out: inventory.filter((i) => i.status === 'out' || i.status === 'empty').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sufficient':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'low':
        return <TrendingDown className="w-5 h-5 text-amber-500" />;
      case 'out':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'empty':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sufficient':
        return <Badge className="bg-green-100 text-green-700">充足</Badge>;
      case 'low':
        return <Badge className="bg-amber-100 text-amber-700">偏低</Badge>;
      case 'out':
        return <Badge className="bg-red-100 text-red-700">缺货</Badge>;
      case 'empty':
        return <Badge className="bg-red-200 text-red-800">耗尽</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">实时库存监控</h1>
          <p className="text-slate-500 mt-1">实时监控商品库存状态</p>
        </div>
        {usingMockData && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
            演示数据
          </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">监控商品</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">库存充足</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.sufficient}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">库存偏低</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.low}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">缺货/耗尽</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.out}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="搜索商品名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="sufficient">库存充足</SelectItem>
                <SelectItem value="low">库存偏低</SelectItem>
                <SelectItem value="out">缺货</SelectItem>
                <SelectItem value="empty">耗尽</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品名称</TableHead>
                  <TableHead className="text-center">当前库存</TableHead>
                  <TableHead className="text-center">安全库存</TableHead>
                  <TableHead className="w-[300px]">库存占比</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead className="text-right">更新时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      暂无库存数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <span className="font-medium">{item.product_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {item.current_stock} {item.unit}
                      </TableCell>
                      <TableCell className="text-center text-slate-500">
                        {item.safe_stock} {item.unit}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress
                            value={item.stock_ratio}
                            className={`h-2 ${
                              item.status === 'sufficient'
                                ? '[&>div]:bg-green-500'
                                : item.status === 'low'
                                ? '[&>div]:bg-amber-500'
                                : '[&>div]:bg-red-500'
                            }`}
                          />
                          <p className="text-xs text-slate-500 text-right">
                            {item.stock_ratio}%
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="text-right text-slate-500 text-sm">
                        {new Date(item.last_update_time).toLocaleString('zh-CN')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
