'use client';

import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Save,
  Image as ImageIcon,
  Loader2,
  Wand2,
  Check,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { mockCategories, aiSceneConfigs, AISceneConfig, flowerFallbackImages } from '@/lib/mock-data';

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

  // AI Scene Generation States
  const [showAISceneDialog, setShowAISceneDialog] = useState(false);
  const [selectedScene, setSelectedScene] = useState<AISceneConfig | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<string | null>(null);
  const [generatedProductName, setGeneratedProductName] = useState('');

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
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: formData.name || '鲜花礼盒',
          category: getCategoryNames().join(' > ') || '鲜切花',
        }),
      });

      const data = await response.json();
      if (data.success && data.content) {
        setGeneratedDesc(data.content);
        setFormData((prev) => ({
          ...prev,
          description: data.content,
        }));
      } else {
        // Fallback to mock data if API fails
        setGeneratedDesc(`精选优质鲜花，精心搭配包装设计。

🌸 花材介绍：
采用当季最新鲜的花材，保证品质优良。

✨ 养护技巧：
1. 保持水质清洁
2. 避免阳光直射
3. 适当修剪根部

🎁 适用场景：
- 生日庆祝
- 纪念日
- 探病慰问
- 家居装饰

💝 商品卖点：
• 新鲜直达
• 包装精美
• 性价比高`);
        setFormData((prev) => ({
          ...prev,
          description: generatedDesc || `精选优质鲜花，精心搭配包装设计。花语寓意深刻，适合各种场合。`,
        }));
      }
    } catch {
      // Fallback to mock data
      setGeneratedDesc(`精选优质鲜花，精心搭配包装设计。

🌸 花材介绍：
采用当季最新鲜的花材，保证品质优良。

✨ 养护技巧：
1. 保持水质清洁
2. 避免阳光直射
3. 适当修剪根部

🎁 适用场景：
- 生日庆祝
- 纪念日
- 探病慰问
- 家居装饰

💝 商品卖点：
• 新鲜直达
• 包装精美
• 性价比高`);
      setFormData((prev) => ({
        ...prev,
        description: generatedDesc || `精选优质鲜花，精心搭配包装设计。花语寓意深刻，适合各种场合。`,
      }));
    }
    setIsGenerating(false);
  };

  // AI Scene Image Generation Functions
  const handleGenerateSceneImages = async () => {
    if (!selectedScene && !customPrompt) return;

    setIsGeneratingScene(true);
    setGeneratedImages([]);
    setSelectedGeneratedImage(null);

    try {
      // 构建更精确的prompt，确保生成鲜花图片
      const productName = formData.name || 'fresh flowers';
      let prompt: string;

      if (selectedScene) {
        prompt = `${productName}, ${selectedScene.prompt}`;
      } else {
        prompt = `${productName}, ${customPrompt}, professional product photography, high quality, 8K detail`;
      }

      const response = await fetch('/api/ai/generate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: productName,
          customPrompt: prompt,
        }),
      });

      const data = await response.json();

      if (data.success && data.imageUrls && data.imageUrls.length > 0) {
        setGeneratedImages(data.imageUrls);
        setGeneratedProductName(productName);
      } else {
        // Fallback: 使用可靠的鲜花图片
        const shuffled = [...flowerFallbackImages].sort(() => Math.random() - 0.5);
        setGeneratedImages(shuffled.slice(0, 3));
        setGeneratedProductName(productName);
      }
    } catch {
      // Fallback: 使用可靠的鲜花图片
      const shuffled = [...flowerFallbackImages].sort(() => Math.random() - 0.5);
      setGeneratedImages(shuffled.slice(0, 3));
      setGeneratedProductName(formData.name || '鲜花商品');
    }

    setIsGeneratingScene(false);
  };

  const handleSelectGeneratedImage = (imageUrl: string) => {
    setSelectedGeneratedImage(imageUrl);
  };

  const handleApplyGeneratedImage = () => {
    if (selectedGeneratedImage) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, selectedGeneratedImage],
      }));
      setShowAISceneDialog(false);
      setSelectedGeneratedImage(null);
      setGeneratedImages([]);
      setSelectedScene(null);
      setCustomPrompt('');
    }
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

  // Get the category names for display
  const getCategoryNames = () => {
    const names: string[] = [];
    formData.categoryIds.forEach((id) => {
      const category = mockCategories.find((c) => c.id === id);
      if (category) names.push(category.name);
    });
    return names;
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
                      <SelectTrigger className="bg-white">
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
                      <SelectTrigger className="bg-white">
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
                      <SelectTrigger className="bg-white">
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
                  {formData.categoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {getCategoryNames().map((name, index) => (
                        <Badge key={index} variant="secondary" className="bg-pink-50 text-pink-700 border-pink-200">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  )}
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
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="束">束</SelectItem>
                        <SelectItem value="盆">盆</SelectItem>
                        <SelectItem value="盒">盒</SelectItem>
                        <SelectItem value="支">支</SelectItem>
                        <SelectItem value="个">个</SelectItem>
                        <SelectItem value="对">对</SelectItem>
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/product${index}/400/400`;
                          }}
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
                    className="w-full gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:bg-purple-100"
                    onClick={() => setShowAISceneDialog(true)}
                  >
                    <Wand2 className="w-4 h-4 text-purple-500" />
                    使用千问AI生成场景图
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* AI Scene Image Generation Dialog */}
      <Dialog open={showAISceneDialog} onOpenChange={setShowAISceneDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              AI 场景图生成 - 千问大模型
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Scene Selection */}
            <div className="space-y-3">
              <Label>选择场景模板</Label>
              <div className="grid grid-cols-4 gap-3">
                {aiSceneConfigs.map((scene) => (
                  <button
                    key={scene.scene}
                    type="button"
                    onClick={() => setSelectedScene(scene)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedScene?.scene === scene.scene
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-medium text-sm text-slate-900">{scene.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-3">
              <Label htmlFor="customPrompt">
                自定义提示词（可选）
              </Label>
              <Textarea
                id="customPrompt"
                placeholder="输入自定义的场景描述，如：在一张白色大理石桌面上摆放的玫瑰花束，配以柔和的自然光..."
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  if (e.target.value) setSelectedScene(null);
                }}
                rows={3}
              />
              <p className="text-xs text-slate-400">
                如果输入自定义提示词，将优先使用您的描述生成图片
              </p>
            </div>

            {/* Product Name Reference */}
            <div className="space-y-2">
              <Label>参考商品名称</Label>
              <Input
                placeholder="输入商品名称，AI将结合商品特征生成场景图"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateSceneImages}
              disabled={isGeneratingScene || (!selectedScene && !customPrompt)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2"
            >
              {isGeneratingScene ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  正在生成中，请稍候...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  开始生成场景图
                </>
              )}
            </Button>

            {/* Generated Images */}
            {generatedImages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>生成结果</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateSceneImages}
                    disabled={isGeneratingScene}
                    className="gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    重新生成
                  </Button>
                </div>
                
                {/* Image Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {generatedImages.map((url, index) => (
                    <div
                      key={index}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedGeneratedImage === url
                          ? 'border-green-500 ring-2 ring-green-200'
                          : 'border-slate-200 hover:border-purple-300'
                      }`}
                      onClick={() => handleSelectGeneratedImage(url)}
                    >
                      <img
                        src={url}
                        alt={`生成的场景图 ${index + 1}`}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/scene${index}/400/400`;
                        }}
                      />
                      {selectedGeneratedImage === url && (
                        <div className="absolute top-2 right-2 p-1 bg-green-500 text-white rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setSelectedGeneratedImage(null)}
                  >
                    取消选择
                  </Button>
                  <Button
                    onClick={handleApplyGeneratedImage}
                    disabled={!selectedGeneratedImage}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 gap-2"
                  >
                    <Check className="w-4 h-4" />
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
