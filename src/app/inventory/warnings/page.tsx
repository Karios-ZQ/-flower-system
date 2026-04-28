'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Settings2,
  RefreshCw,
} from 'lucide-react';
import {
  mockStockWarnings,
  formatDate,
} from '@/lib/mock-data';
import { StockWarning } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: '待处理', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  processed: { label: '已处理', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2 },
  ignored: { label: '已忽略', color: 'text-slate-600', bgColor: 'bg-slate-100', icon: XCircle },
};

export default function InventoryWarningsPage() {
  const [warnings, setWarnings] = useState<StockWarning[]>(mockStockWarnings);

  const stats = {
    total: warnings.length,
    pending: warnings.filter((w) => w.status === 'pending').length,
    processed: warnings.filter((w) => w.status === 'processed').length,
    ignored: warnings.filter((w) => w.status === 'ignored').length,
  };

  const handleProcess = (id: string) => {
    setWarnings((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: 'processed' as const, processedAt: new Date().toISOString(), processedBy: '管理员' }
          : w
      )
    );
  };

  const handleIgnore = (id: string) => {
    setWarnings((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: 'ignored' as const, processedAt: new Date().toISOString(), processedBy: '管理员' }
          : w
      )
    );
  };

  return (
    <DashboardLayout
      title="库存预警管理"
      breadcrumbs={[
        { label: '首页', href: '/dashboard' },
        { label: '库存管理' },
        { label: '预警管理' },
      ]}
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">预警总数</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">待处理</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">已处理</p>
                  <p className="text-2xl font-bold text-green-600">{stats.processed}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">已忽略</p>
                  <p className="text-2xl font-bold text-slate-600">{stats.ignored}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                  <XCircle className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              刷新预警
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings2 className="w-4 h-4" />
              预警规则设置
            </Button>
          </div>
          <a href="/inventory/records">
            <Button variant="outline" className="gap-2">
              查看出入库记录
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Warnings Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>商品信息</TableHead>
                  <TableHead className="text-right">当前库存</TableHead>
                  <TableHead className="text-right">安全库存</TableHead>
                  <TableHead className="text-right">建议库存</TableHead>
                  <TableHead>预警原因</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warnings.map((warning) => {
                  const config = statusConfig[warning.status];
                  return (
                    <TableRow key={warning.id} className="table-row-hover">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {warning.status === 'pending' && (
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          )}
                          <p className="font-medium text-slate-900">{warning.productName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <p className={cn(
                          'font-medium',
                          warning.currentStock === 0 ? 'text-red-600' : 'text-slate-900'
                        )}>
                          {warning.currentStock}
                        </p>
                      </TableCell>
                      <TableCell className="text-right text-slate-500">
                        {warning.safeStock}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-pink-600 border-pink-200 bg-pink-50">
                          {warning.suggestedStock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-600 max-w-xs truncate">
                          {warning.reason}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(config.bgColor, config.color)}>
                          <config.icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-500">{formatDate(warning.createdAt)}</p>
                      </TableCell>
                      <TableCell>
                        {warning.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleProcess(warning.id)}
                            >
                              处理
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-slate-500 hover:text-slate-600"
                              onClick={() => handleIgnore(warning.id)}
                            >
                              忽略
                            </Button>
                          </div>
                        )}
                        {warning.status !== 'pending' && (
                          <p className="text-xs text-slate-400">
                            {warning.processedBy}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {warnings.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400">暂无预警信息</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-pink-500" />
              AI 智能分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-pink-50 border border-pink-100 rounded-xl">
                <p className="text-sm font-medium text-pink-700 mb-2">销售高峰期预测</p>
                <p className="text-xs text-pink-600">
                  情人节（2月14日）即将来临，建议提前7天备货红玫瑰系列，预计销量增长200%。
                </p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-sm font-medium text-amber-700 mb-2">库存优化建议</p>
                <p className="text-xs text-amber-600">
                  郁金香系列近期损耗率偏高（12%），建议降低单次采购量，增加采购频次。
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                <p className="text-sm font-medium text-green-700 mb-2">季节性调整</p>
                <p className="text-xs text-green-600">
                  冬季来临，绿萝盆栽需求上升，建议将安全库存阈值上调20%。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
