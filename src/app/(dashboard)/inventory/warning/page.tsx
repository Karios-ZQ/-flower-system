'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Settings,
  Loader2,
  Bell,
  BellOff,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WarningItem {
  product_id: number;
  product_name: string;
  current_stock: number;
  safe_stock: number;
  threshold: number;
  unit: string;
  shortage: number;
  level: 'critical' | 'warning';
  created_at: string;
}

export default function InventoryWarningPage() {
  const [warnings, setWarnings] = useState<WarningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingThreshold, setEditingThreshold] = useState<WarningItem | null>(null);
  const [newThreshold, setNewThreshold] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inventory/warning');
      const result = await response.json();
      if (result.code === 200) {
        setWarnings(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch warnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateThreshold = async () => {
    if (!editingThreshold) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/inventory/${editingThreshold.product_id}/threshold`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: parseInt(newThreshold) }),
      });
      const result = await response.json();
      if (result.code === 200) {
        fetchWarnings();
      }
    } catch (error) {
      console.error('Failed to update threshold:', error);
    } finally {
      setIsSaving(false);
      setEditingThreshold(null);
    }
  };

  const handleEnableWarning = async (productId: number) => {
    try {
      await fetch(`/api/inventory/${productId}/threshold`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: true }),
      });
      fetchWarnings();
    } catch (error) {
      console.error('Failed to enable warning:', error);
    }
  };

  const handleDisableWarning = async (productId: number) => {
    try {
      await fetch(`/api/inventory/${productId}/threshold`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: false }),
      });
      fetchWarnings();
    } catch (error) {
      console.error('Failed to disable warning:', error);
    }
  };

  const stats = {
    total: warnings.length,
    critical: warnings.filter((w) => w.level === 'critical').length,
    warning: warnings.filter((w) => w.level === 'warning').length,
    handled: warnings.filter((w) => w.current_stock > w.threshold).length,
  };

  const openEditDialog = (item: WarningItem) => {
    setEditingThreshold(item);
    setNewThreshold(item.threshold.toString());
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">库存预警管理</h1>
          <p className="text-slate-500 mt-1">管理库存预警阈值和处理预警</p>
        </div>
        <Button onClick={fetchWarnings} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新数据
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">预警总数</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">紧急预警</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.critical}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">一般预警</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.warning}</p>
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
                <p className="text-sm text-slate-500">已处理</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.handled}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warnings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">预警列表</CardTitle>
        </CardHeader>
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
                  <TableHead className="text-center">预警阈值</TableHead>
                  <TableHead className="text-center">缺口</TableHead>
                  <TableHead className="text-center">预警等级</TableHead>
                  <TableHead className="text-center">预警状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warnings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      <div className="flex flex-col items-center">
                        <Package className="w-12 h-12 text-slate-300 mb-2" />
                        <p>暂无预警数据</p>
                        <p className="text-sm">所有商品库存状态良好</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  warnings.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell className="text-center">
                        <span className={item.current_stock === 0 ? 'text-red-600 font-medium' : 'text-amber-600'}>
                          {item.current_stock}
                        </span>
                        <span className="text-slate-400 ml-1">{item.unit}</span>
                      </TableCell>
                      <TableCell className="text-center text-slate-600">
                        {item.threshold} {item.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.shortage > 0 ? (
                          <span className="text-red-600 font-medium">
                            -{item.shortage} {item.unit}
                          </span>
                        ) : (
                          <span className="text-green-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.level === 'critical' ? (
                          <Badge className="bg-red-100 text-red-700">紧急</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700">一般</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.current_stock <= item.threshold ? (
                          <Badge className="bg-red-100 text-red-700">触发中</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">已处理</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Threshold Dialog */}
      <Dialog open={!!editingThreshold} onOpenChange={() => setEditingThreshold(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改预警阈值</DialogTitle>
            <DialogDescription>
              设置商品 &quot;{editingThreshold?.product_name}&quot; 的库存预警阈值
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">预警阈值</label>
            <Input
              type="number"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              placeholder="请输入预警阈值"
            />
            <p className="text-sm text-slate-500 mt-2">
              当库存低于此阈值时将触发预警
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingThreshold(null)}>
              取消
            </Button>
            <Button
              onClick={handleUpdateThreshold}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
