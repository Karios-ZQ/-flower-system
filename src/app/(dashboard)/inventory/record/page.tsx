'use client';

import { useEffect, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
  Search,
  Filter,
  Loader2,
  Package,
  History,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StockRecord {
  id: number;
  product_id: number;
  product_name: string;
  type: 'in' | 'out';
  sub_type: string;
  quantity: number;
  operator: string;
  remark: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  unit: string;
}

export default function InventoryRecordPage() {
  const [records, setRecords] = useState<StockRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dialogType, setDialogType] = useState<'in' | 'out' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState('');
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRecords();
    fetchProducts();
  }, []);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inventory/records');
      const result = await response.json();
      if (result.code === 200) {
        setRecords(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      if (result.code === 200) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity) return;

    try {
      setIsSubmitting(true);
      const endpoint = dialogType === 'in' ? '/api/inventory/in' : '/api/inventory/out';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: parseInt(selectedProduct),
          quantity: parseInt(quantity),
          remark,
        }),
      });
      const result = await response.json();
      if (result.code === 200) {
        setDialogType(null);
        setSelectedProduct('');
        setQuantity('');
        setRemark('');
        fetchRecords();
      }
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const stats = {
    totalIn: records.filter((r) => r.type === 'in').reduce((sum, r) => sum + r.quantity, 0),
    totalOut: records.filter((r) => r.type === 'out').reduce((sum, r) => sum + r.quantity, 0),
    recordCount: records.length,
  };

  const getSubTypeLabel = (subType: string) => {
    const labels: Record<string, string> = {
      purchase: '采购入库',
      return: '退货入库',
      count_in: '盘点入库',
      sale: '销售出库',
      damage: '损耗出库',
      count_out: '盘点出库',
    };
    return labels[subType] || subType;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">出入库记录</h1>
          <p className="text-slate-500 mt-1">管理商品入库和出库操作</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
            onClick={() => setDialogType('in')}
          >
            <ArrowDownToLine className="w-4 h-4 mr-2" />
            入库
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setDialogType('out')}
          >
            <ArrowUpFromLine className="w-4 h-4 mr-2" />
            出库
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">总入库量</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.totalIn}</p>
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
                <p className="text-sm text-slate-500">总出库量</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.totalOut}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">记录总数</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.recordCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <History className="w-6 h-6 text-blue-600" />
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
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="in">入库</SelectItem>
                <SelectItem value="out">出库</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
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
                  <TableHead>时间</TableHead>
                  <TableHead>商品名称</TableHead>
                  <TableHead className="text-center">类型</TableHead>
                  <TableHead className="text-center">子类型</TableHead>
                  <TableHead className="text-right">数量</TableHead>
                  <TableHead>操作员</TableHead>
                  <TableHead>备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      <div className="flex flex-col items-center">
                        <Package className="w-12 h-12 text-slate-300 mb-2" />
                        <p>暂无出入库记录</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-slate-500 text-sm">
                        {new Date(record.created_at).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell className="font-medium">{record.product_name}</TableCell>
                      <TableCell className="text-center">
                        {record.type === 'in' ? (
                          <Badge className="bg-green-100 text-green-700">
                            <ArrowDownToLine className="w-3 h-3 mr-1" />
                            入库
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            <ArrowUpFromLine className="w-3 h-3 mr-1" />
                            出库
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-slate-600">
                        {getSubTypeLabel(record.sub_type)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        record.type === 'in' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.type === 'in' ? '+' : '-'}{record.quantity}
                      </TableCell>
                      <TableCell className="text-slate-600">{record.operator}</TableCell>
                      <TableCell className="text-slate-500 text-sm max-w-[200px] truncate">
                        {record.remark || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* In/Out Dialog */}
      <Dialog open={!!dialogType} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'in' ? '商品入库' : '商品出库'}
            </DialogTitle>
            <DialogDescription>
              填写{dialogType === 'in' ? '入库' : '出库'}信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>选择商品</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择商品" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} (当前库存: {product.stock} {product.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>数量</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="请输入数量"
              />
            </div>
            <div className="space-y-2">
              <Label>备注</Label>
              <Input
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="请输入备注（可选）"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedProduct || !quantity}
              className={dialogType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              确认{dialogType === 'in' ? '入库' : '出库'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
