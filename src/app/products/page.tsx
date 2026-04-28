'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import {
  mockCategories,
  formatCurrency,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  categoryId: string | null;
  price: number;
  marketPrice: number | null;
  stock: number;
  unit: string;
  images: string[];
  description: string;
  status: string;
  tags: string[];
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [generating, setGenerating] = useState(false);

  // 从数据库获取商品列表
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchKeyword) params.append('keyword', searchKeyword);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('categoryId', categoryFilter);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.code === 200) {
        setProducts(data.data.list || []);
      }
    } catch (error) {
      console.error('获取商品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchKeyword, statusFilter, categoryFilter]);

  // 更新商品状态
  const updateProductStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.code === 200) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  // 删除商品
  const deleteProduct = async (id: string) => {
    if (!confirm('确定要删除这个商品吗？')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.code === 200) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 批量更新状态
  const handleBatchStatus = async (status: 'active' | 'inactive') => {
    for (const id of selectedProducts) {
      await updateProductStatus(id, status);
    }
    setSelectedProducts([]);
  };

  const handleAIGenerate = async () => {
    if (!aiKeywords.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: aiKeywords }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedDescription(data.description);
      } else {
        setGeneratedDescription('精选优质鲜花，精心搭配包装。\n\n🌸 花材介绍：采用当季最新鲜的花材，保证品质。\n\n✨ 养护技巧：保持水质清洁，避免阳光直射。\n\n💝 商品卖点：新鲜直达、包装精美、性价比高。');
      }
    } catch {
      setGeneratedDescription('精选优质鲜花，精心搭配包装。\n\n🌸 花材介绍：采用当季最新鲜的花材，保证品质。\n\n✨ 养护技巧：保持水质清洁，避免阳光直射。\n\n💝 商品卖点：新鲜直达、包装精美、性价比高。');
    } finally {
      setGenerating(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchKeyword =
      !searchKeyword ||
      product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    return matchKeyword;
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

  const getCategoryNames = (categoryId: string | null): string[] => {
    if (!categoryId) return [];
    const category = mockCategories.find((c) => c.id === categoryId);
    if (!category) return [];
    const names = [category.name];
    if (category.parentId) {
      const parent = mockCategories.find((c) => c.id === category.parentId);
      if (parent) names.unshift(parent.name);
    }
    return names;
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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜索商品名称或标签..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
              </div>
            ) : (
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
                            src={product.images[0] || 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=100&h=100&fit=crop'}
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
                          {getCategoryNames(product.categoryId).slice(0, 2).map((name, index) => (
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
                        {product.marketPrice && (
                          <p className="text-xs text-slate-400 line-through">
                            {formatCurrency(product.marketPrice)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <p className="font-medium">{product.stock || 0}</p>
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
                        <p className="font-medium">{product.salesCount || 0}</p>
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
                              onClick={() => updateProductStatus(
                                product.id,
                                product.status === 'active' ? 'inactive' : 'active'
                              )}
                            >
                              <Power className="w-4 h-4 mr-2" />
                              {product.status === 'active' ? '下架' : '上架'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deleteProduct(product.id)}
                            >
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
            )}

            {filteredProducts.length === 0 && !loading && (
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
                placeholder="例如：红玫瑰、生日、浪漫..."
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAIGenerate} 
              disabled={generating || !aiKeywords.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  生成文案
                </>
              )}
            </Button>
            {generatedDescription && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="whitespace-pre-wrap text-sm text-slate-700">
                  {generatedDescription}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
