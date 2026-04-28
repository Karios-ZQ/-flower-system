'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Power,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import {
  mockProducts,
  mockCategories,
  formatCurrency,
} from '@/lib/mock-data';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchKeyword =
      !searchKeyword ||
      product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.status === 'active') ||
      (statusFilter === 'inactive' && product.status === 'inactive');
    const matchCategory =
      categoryFilter === 'all' ||
      product.categoryIds.includes(categoryFilter);
    return matchKeyword && matchStatus && matchCategory;
  });

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleBatchStatus = (status: 'active' | 'inactive') => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedProducts.includes(p.id) ? { ...p, status } : p
      )
    );
    setSelectedProducts([]);
  };

  const handleAIGenerate = () => {
    // Simulate AI generation
    setGeneratedDescription(
      `精选优质鲜花，精心搭配包装。花语寓意深刻，适合各种浪漫场合。\n\n🌸 花材介绍：采用当季最新鲜的花材，保证品质。\n\n✨ 养护技巧：保持水质清洁，避免阳光直射，适当修剪根部。\n\n🎁 适用场景：生日、纪念日、表白、探病等。\n\n💝 商品卖点：新鲜直达、包装精美、性价比高。`
    );
  };

  return (
    <DashboardLayout
      title="商品列表"
      breadcrumbs={[
        { label: '首页', href: '/dashboard' },
        { label: '商品管理' },
        { label: '商品列表' },
      ]}
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜索商品名称或标签..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">已上架</SelectItem>
                  <SelectItem value="inactive">已下架</SelectItem>
                </SelectContent>
              </Select>

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
          </div>

          {/* Batch Actions */}
          <div className="flex gap-3">
            {selectedProducts.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchStatus('active')}
                >
                  批量上架
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchStatus('inactive')}
                >
                  批量下架
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => setShowAIGenerate(true)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI 生成
            </Button>
            <a href="/products/add">
              <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                <Plus className="w-4 h-4" />
                新增商品
              </Button>
            </a>
          </div>
        </div>

        {/* Selected Info */}
        {selectedProducts.length > 0 && (
          <div className="bg-pink-50 border border-pink-100 rounded-lg px-4 py-2 text-sm text-pink-700">
            已选择 {selectedProducts.length} 件商品
          </div>
        )}

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredProducts.length > 0 &&
                        selectedProducts.length === filteredProducts.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>商品信息</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="text-right">
                    <button className="flex items-center gap-1 hover:text-slate-900">
                      价格
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">库存</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">销量</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="table-row-hover">
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=100&h=100&fit=crop';
                          }}
                        />
                        <div>
                          <p className="font-medium text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.categoryNames.slice(0, 2).map((name, index) => (
                          <Badge key={`${product.id}-${index}`} variant="secondary" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-medium text-slate-900">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-slate-400 line-through">
                        {formatCurrency(product.marketPrice)}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-medium">{product.stock}</p>
                      <p className="text-xs text-slate-400">{product.unit}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          product.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {product.status === 'active' ? '已上架' : '已下架'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-medium">{product.salesCount}</p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            编辑商品
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.id === product.id
                                    ? {
                                        ...p,
                                        status:
                                          p.status === 'active'
                                            ? 'inactive'
                                            : 'active',
                                      }
                                    : p
                                )
                              );
                            }}
                          >
                            <Power className="w-4 h-4 mr-2" />
                            {product.status === 'active' ? '下架' : '上架'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            删除商品
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">暂无商品数据</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            显示 {filteredProducts.length} 条，共 {products.length} 件商品
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm" disabled>
              下一页
            </Button>
          </div>
        </div>
      </div>

      {/* AI Generate Dialog */}
      <Dialog open={showAIGenerate} onOpenChange={setShowAIGenerate}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              AI 文案生成
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                输入关键词
              </label>
              <Input
                placeholder="例如：红玫瑰11朵、生日、礼盒包装..."
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-slate-400 mt-1">
                输入商品的核心特征，AI 将为您生成专业的商品描述
              </p>
            </div>
            <Button
              onClick={handleAIGenerate}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              disabled={!aiKeywords}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              生成文案
            </Button>
            {generatedDescription && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {generatedDescription}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    复制文案
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500">
                    应用到商品
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
