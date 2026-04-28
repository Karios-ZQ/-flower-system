'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import { mockCategories } from '@/lib/mock-data';

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryIds: [] as string[],
    price: '',
    marketPrice: '',
    stock: '',
    unit: '束',
    images: [] as string[],
    description: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');

  const handleCategoryChange = (level: number, value: string) => {
    const newCategories = [...formData.categoryIds];
    // Keep categories up to the selected level
    newCategories[level - 1] = value;
    // Remove categories below selected level
    if (level < 3) {
      newCategories.length = level;
    }
    setFormData({ ...formData, categoryIds: newCategories });
  };

  const getCategoryOptions = (level: number, parentId?: string) => {
    return mockCategories.filter((c) => c.level === level && c.parentId === parentId);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedDesc(`精选优质红玫瑰，搭配精美礼盒包装，象征热烈的爱情与美好的祝福。

🌸 花材介绍：
采用厄瓜多尔进口红玫瑰，花瓣饱满、色泽艳丽，每一朵都经过精心挑选，保证最佳品质。

✨ 养护技巧：
1. 收到花束后，请立即去除底部保水棉
2. 斜剪花茎45度，增加吸水面积
3. 保持水质清洁，每2天换水一次
4. 避免阳光直射，远离空调出风口
5. 室温保持在15-25℃最佳

🎁 适用场景：
- 生日祝福：传递真挚的生日祝愿
- 情人节：表达热烈的爱意
- 纪念日：见证爱情的重要时刻
- 告白求婚：浪漫的表白神器

💝 商品卖点：
• 进口厄瓜多尔玫瑰，品质卓越
• 保鲜期长达7天，超长待机
• 专业花艺师精心包装
• 当日配送，新鲜直达`);
      setFormData({
        ...formData,
        description: generatedDesc || `精选优质红玫瑰，搭配精美礼盒包装，象征热烈的爱情与美好的祝福。`,
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/products');
    }, 1500);
  };

  return (
    <DashboardLayout
      title="新增商品"
      breadcrumbs={[
        { label: '首页', href: '/dashboard' },
        { label: '商品管理', href: '/products' },
        { label: '新增商品' },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
        {/* Top Actions */}
        <div className="flex items-center justify-between">
          <a href="/products">
            <Button variant="ghost" type="button" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
          </a>
          <div className="flex gap-3">
            <Button variant="outline" type="button">
              保存草稿
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? '保存中...' : '保存并上架'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    商品名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="请输入商品名称"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-4">
                  <Label>
                    商品分类 <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Select
                      value={formData.categoryIds[0] || ''}
                      onValueChange={(value) => handleCategoryChange(1, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择一级分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategoryOptions(1).map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.categoryIds[1] || ''}
                      onValueChange={(value) => handleCategoryChange(2, value)}
                      disabled={!formData.categoryIds[0]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择二级分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategoryOptions(2, formData.categoryIds[0]).map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.categoryIds[2] || ''}
                      onValueChange={(value) => handleCategoryChange(3, value)}
                      disabled={!formData.categoryIds[1]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择三级分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategoryOptions(3, formData.categoryIds[1]).map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      销售价格 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        ¥
                      </span>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marketPrice">市场价格</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        ¥
                      </span>
                      <Input
                        id="marketPrice"
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.marketPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, marketPrice: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      初始库存 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">库存单位</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) =>
                        setFormData({ ...formData, unit: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="束">束</SelectItem>
                        <SelectItem value="盆">盆</SelectItem>
                        <SelectItem value="盒">盒</SelectItem>
                        <SelectItem value="支">支</SelectItem>
                        <SelectItem value="个">个</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>商品详情</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? 'AI 生成中...' : 'AI 生成文案'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="请输入商品详细描述..."
                  rows={8}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <p className="text-xs text-slate-400 mt-2">
                  建议包含：花材介绍、养护技巧、适用场景、商品卖点等
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>商品标签</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="输入标签后按回车添加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    添加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-slate-200 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Images */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>商品图片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {formData.images.length > 0 ? (
                    formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`商品图片 ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== index),
                            })
                          }
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-pink-500 text-white text-xs rounded">
                            主图
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                      <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm text-slate-400">
                        点击下方按钮上传商品图片
                      </p>
                    </div>
                  )}
                </div>

                <Button type="button" variant="outline" className="w-full gap-2">
                  <Upload className="w-4 h-4" />
                  上传图片
                </Button>

                <p className="text-xs text-slate-400">
                  支持 JPG、PNG、WEBP 格式，单张不超过 5MB，最多上传 9 张
                </p>

                {/* AI Image Generation */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    AI 场景图生成
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {}}
                  >
                    <Sparkles className="w-4 h-4" />
                    生成场景图
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
