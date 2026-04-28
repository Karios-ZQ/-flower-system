'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Loader2,
  ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockProducts, mockCategories, Product, Category } from '@/lib/mock-data';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (result.code === 200 && result.data.list) {
        // 使用真实数据
        const productsWithCategories = result.data.list.map((product: Product) => ({
          ...product,
          category_names: product.category_ids?.map((id: number) => {
            const cat = findCategoryById(categories, id);
            return cat?.name || '';
          }).filter(Boolean) || [],
        }));
        setProducts(productsWithCategories);
        setUsingMockData(false);
      } else {
        // 使用 mock 数据
        setProducts(mockProducts);
        setUsingMockData(true);
      }
    } catch {
      // 使用 mock 数据
      setProducts(mockProducts);
      setCategories(mockCategories);
      setUsingMockData(true);
    } finally {
      setCategories(mockCategories);
      setIsLoading(false);
    }
  };

  const findCategoryById = (cats: Category[], id: number): Category | null => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      product.category_ids?.includes(parseInt(selectedCategory));
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' ? product.status === 1 : product.status === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusChange = (product: Product) => {
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, status: p.status === 1 ? 0 : 1 } : p
    ));
  };

  const handleDelete = () => {
    if (!deleteProduct) return;
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
    setDeleteProduct(null);
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">上架</Badge>
    ) : (
      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100">下架</Badge>
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="text-red-600 font-medium">缺货</span>;
    } else if (stock < 20) {
      return <span className="text-amber-600 font-medium">库存紧张 ({stock})</span>;
    }
    return <span className="text-slate-600">{stock}</span>;
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map((cat) => (
      <div key={cat.id}>
        <SelectItem value={cat.id.toString()}>
          {'　'.repeat(level)}{cat.name}
        </SelectItem>
        {cat.children && renderCategoryTree(cat.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">商品管理</h1>
          <p className="text-slate-500 mt-1">管理您的鲜花商品库存</p>
        </div>
        <div className="flex items-center gap-3">
          {usingMockData && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
              演示数据
            </span>
          )}
          <Button
            onClick={() => router.push('/products/add')}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加商品
          </Button>
        </div>
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {renderCategoryTree(categories)}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">上架</SelectItem>
                <SelectItem value="inactive">下架</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
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
                  <TableHead className="w-[100px]">商品图片</TableHead>
                  <TableHead>商品名称</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="text-right">价格</TableHead>
                  <TableHead className="text-right">市场价</TableHead>
                  <TableHead className="text-right">库存</TableHead>
                  <TableHead className="text-right">销量</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                      暂无商品数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500 truncate max-w-[200px]">
                            {product.subcategory}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.category_names?.slice(0, 2).map((name, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-pink-600">
                        ¥{product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-slate-500">
                        ¥{product.market_price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getStockStatus(product.stock)}
                        <span className="text-slate-400 ml-1">{product.unit}</span>
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {product.sales_count}
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/products/${product.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/products/edit/${product.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(product)}>
                              {product.status === 1 ? (
                                <>
                                  <ToggleLeft className="w-4 h-4 mr-2" />
                                  下架
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="w-4 h-4 mr-2" />
                                  上架
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteProduct(product)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除商品 &quot;{deleteProduct?.name}&quot; 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProduct(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
