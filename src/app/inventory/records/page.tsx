'use client';

import { useState, useEffect } from 'react';
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
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Package,
  Loader2,
} from 'lucide-react';
import {
  formatDate,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface StockRecord {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  subType: string;
  quantity: number;
  operator: string;
  remark: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
}

const typeConfig = {
  in: { label: '入库', color: 'text-green-600', bgColor: 'bg-green-100', icon: ArrowDownLeft },
  out: { label: '出库', color: 'text-red-600', bgColor: 'bg-red-100', icon: ArrowUpRight },
};

const subTypeMap = {
  purchase: { label: '采购入库', type: 'in' as const },
  return: { label: '退货入库', type: 'in' as const },
  count_in: { label: '盘盈入库', type: 'in' as const },
  sale: { label: '销售出库', type: 'out' as const },
  damage: { label: '报损出库', type: 'out' as const },
  count_out: { label: '盘亏出库', type: 'out' as const },
};

export default function InventoryRecordsPage() {
  const [records, setRecords] = useState<StockRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addType, setAddType] = useState<'in' | 'out'>('in');
  const [newRecord, setNewRecord] = useState({
    productId: '',
    quantity: '',
    subType: '',
    remark: '',
  });

  // 获取记录列表
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      
      const res = await fetch(`/api/inventory/records?${params}`);
      const data = await res.json();
      if (data.code === 200) {
        setRecords(data.data.list || []);
      }
    } catch (error) {
      console.error('获取记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取商品列表
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?pageSize=100');
      const data = await res.json();
      if (data.code === 200) {
        setProducts(data.data.list || []);
      }
    } catch (error) {
      console.error('获取商品失败:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchProducts();
  }, [typeFilter]);

  const handleAddRecord = async () => {
    if (!newRecord.productId || !newRecord.quantity || !newRecord.subType) return;

    setSubmitting(true);
    try {
      const api = addType === 'in' ? '/api/inventory/in' : '/api/inventory/out';
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: newRecord.productId,
          quantity: parseInt(newRecord.quantity),
          subType: newRecord.subType,
          remark: newRecord.remark,
          operator: 'admin',
        }),
      });
      const data = await res.json();
      if (data.code === 200) {
        setShowAddDialog(false);
        setNewRecord({ productId: '', quantity: '', subType: '', remark: '' });
        fetchRecords();
        fetchProducts();
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchKeyword =
      !searchKeyword ||
      (record.productName && record.productName.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (record.operator && record.operator.toLowerCase().includes(searchKeyword.toLowerCase()));
    return matchKeyword;
  });

  return (
    <DashboardLayout
      title="出入库记录"
      breadcrumbs={[
        { label: '首页', href: '/dashboard' },
        { label: '库存管理' },
        { label: '出入库记录' },
      ]}
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜索商品或操作人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="in">入库记录</SelectItem>
                <SelectItem value="out">出库记录</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              导出
            </Button>
            <Button
              onClick={() => {
                setAddType('in');
                setNewRecord((prev) => ({ ...prev, subType: 'purchase' }));
                setShowAddDialog(true);
              }}
              className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              <ArrowDownLeft className="w-4 h-4" />
              入库
            </Button>
            <Button
              onClick={() => {
                setAddType('out');
                setNewRecord((prev) => ({ ...prev, subType: 'sale' }));
                setShowAddDialog(true);
              }}
              className="gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
            >
              <ArrowUpRight className="w-4 h-4" />
              出库
            </Button>
          </div>
        </div>

        {/* Records Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>流水号</TableHead>
                    <TableHead>商品信息</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead>操作人</TableHead>
                    <TableHead>时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => {
                    const config = typeConfig[record.type];
                    const subTypeInfo = subTypeMap[record.subType as keyof typeof subTypeMap] || { label: record.subType };
                    return (
                      <TableRow key={record.id} className="table-row-hover">
                        <TableCell>
                          <p className="font-mono text-sm text-slate-500">{record.id.slice(0, 12)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-900">{record.productName || '-'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(config.bgColor, config.color)}>
                            {subTypeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className={cn('text-right font-medium', config.color)}>
                          {record.type === 'in' ? '+' : '-'}{record.quantity}
                        </TableCell>
                        <TableCell>
                          <p className="text-slate-600">{record.operator || 'admin'}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-slate-500">{formatDate(record.createdAt)}</p>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}

            {filteredRecords.length === 0 && !loading && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400">暂无记录</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            显示 {filteredRecords.length} 条，共 {records.length} 条记录
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

      {/* Add Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {addType === 'in' ? '商品入库' : '商品出库'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                选择商品 <span className="text-red-500">*</span>
              </label>
              <Select
                value={newRecord.productId}
                onValueChange={(value) => setNewRecord({ ...newRecord, productId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择商品" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (库存: {product.stock || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                操作类型 <span className="text-red-500">*</span>
              </label>
              <Select
                value={newRecord.subType}
                onValueChange={(value) => setNewRecord({ ...newRecord, subType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择操作类型" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(subTypeMap)
                    .filter(([_, info]) => info.type === addType)
                    .map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                数量 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="请输入数量"
                value={newRecord.quantity}
                onChange={(e) => setNewRecord({ ...newRecord, quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">备注</label>
              <Input
                placeholder="请输入备注信息（可选）"
                value={newRecord.remark}
                onChange={(e) => setNewRecord({ ...newRecord, remark: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleAddRecord}
              disabled={submitting}
              className={cn(
                addType === 'in'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600'
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                `确认${addType === 'in' ? '入库' : '出库'}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
