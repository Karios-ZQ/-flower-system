'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  GripVertical,
  Sparkles,
  FolderTree,
} from 'lucide-react';
import { mockCategories, generateId } from '@/lib/mock-data';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [expandedIds, setExpandedIds] = useState<string[]>(['c1', 'c2', 'c4']);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentId, setParentId] = useState<string | undefined>(undefined);

  const getChildCategories = (parentId?: string) => {
    return categories.filter((c) => c.parentId === parentId);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getLevelConfig = (level: number) => {
    const configs = [
      { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
      { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    ];
    return configs[level - 1] || configs[0];
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const parent = parentId ? categories.find((c) => c.id === parentId) : undefined;
    const level = parent ? (parent.level + 1) as 1 | 2 | 3 : 1;

    const newCategory: Category = {
      id: generateId(),
      name: newCategoryName,
      parentId,
      level: level as 1 | 2 | 3,
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCategoryName('');
    setParentId(undefined);
    setShowAddDialog(false);
  };

  const handleEditCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) return;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCategory.id ? { ...c, name: newCategoryName } : c
      )
    );
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm('确定要删除该分类吗？')) return;

    // Check if has children
    const hasChildren = categories.some((c) => c.parentId === id);
    if (hasChildren) {
      alert('该分类下存在子分类，请先删除子分类');
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const renderCategoryTree = (parentId?: string, depth = 0) => {
    const children = getChildCategories(parentId);

    return children.map((category) => {
      const hasChildren = categories.some((c) => c.parentId === category.id);
      const isExpanded = expandedIds.includes(category.id);
      const config = getLevelConfig(category.level);

      return (
        <div key={category.id}>
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50',
              depth > 0 && 'ml-8'
            )}
          >
            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />

            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-0.5 hover:bg-slate-200 rounded transition-colors"
              >
                <ChevronRight
                  className={cn(
                    'w-4 h-4 text-slate-400 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              </button>
            )}

            {!hasChildren && <div className="w-5" />}

            <Badge className={cn(config.bg, config.text)}>
              {category.level === 1 ? '一级' : category.level === 2 ? '二级' : '三级'}
            </Badge>

            <span className="flex-1 font-medium text-slate-900">{category.name}</span>

            <span className="text-sm text-slate-400">
              {getChildCategories(category.id).length} 个子分类
            </span>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setEditingCategory(category);
                  setNewCategoryName(category.name);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {hasChildren && isExpanded && renderCategoryTree(category.id, depth + 1)}
        </div>
      );
    });
  };

  return (
    <DashboardLayout
      title="商品分类管理"
      breadcrumbs={[
        { label: '首页', href: '/dashboard' },
        { label: '商品管理' },
        { label: '商品分类' },
      ]}
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setParentId(undefined);
                setShowAddDialog(true);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              新增一级分类
            </Button>
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              alert('AI 智能分类功能：系统将自动分析商品特征，为商品推荐合适的分类路径');
            }}
          >
            <Sparkles className="w-4 h-4" />
            AI 智能分类
          </Button>
        </div>

        {/* Category Tree */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-pink-500" />
              分类结构
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">{renderCategoryTree(undefined)}</div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <FolderTree className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400">暂无分类数据</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  新增第一个分类
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            if (!open) {
              setShowAddDialog(false);
              setNewCategoryName('');
              setParentId(undefined);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                新增{parentId ? '子' : '一级'}分类
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {parentId && (
                <div className="p-3 bg-slate-50 rounded-lg text-sm">
                  上级分类：{categories.find((c) => c.id === parentId)?.name}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  分类名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="请输入分类名称"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                />
              </div>

              {!parentId && categories.filter((c) => c.level === 1).length >= 3 && (
                <p className="text-sm text-amber-600">
                  提示：一级分类最多支持3个，当前已有{categories.filter((c) => c.level === 1).length}个
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                取消
              </Button>
              <Button
                onClick={handleAddCategory}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                确认添加
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingCategory}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCategory(null);
              setNewCategoryName('');
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑分类</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editingCategory && (
                <div className="p-3 bg-slate-50 rounded-lg text-sm">
                  当前分类：{editingCategory.name}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  新的分类名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="请输入新的分类名称"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                取消
              </Button>
              <Button
                onClick={handleEditCategory}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                保存修改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
