// 演示数据 - 当数据库不可用时使用

export interface Product {
  id: number;
  name: string;
  subcategory: string;
  category_ids: number[];
  category_names: string[];
  price: number;
  market_price: number;
  stock: number;
  unit: string;
  images: string[];
  description: string;
  tags: string[];
  sales_count: number;
  status: number;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  children?: Category[];
}

export const mockCategories: Category[] = [
  { id: 1, name: '玫瑰', parent_id: 0, level: 1, children: [
    { id: 6, name: '红玫瑰', parent_id: 1, level: 2 },
    { id: 7, name: '粉玫瑰', parent_id: 1, level: 2 },
    { id: 8, name: '白玫瑰', parent_id: 1, level: 2 },
    { id: 9, name: '香槟玫瑰', parent_id: 1, level: 2 },
  ]},
  { id: 2, name: '百合', parent_id: 0, level: 1, children: [
    { id: 10, name: '红百合', parent_id: 2, level: 2 },
    { id: 11, name: '白百合', parent_id: 2, level: 2 },
    { id: 12, name: '粉百合', parent_id: 2, level: 2 },
  ]},
  { id: 3, name: '郁金香', parent_id: 0, level: 1, children: [
    { id: 14, name: '红色郁金香', parent_id: 3, level: 2 },
    { id: 15, name: '粉色郁金香', parent_id: 3, level: 2 },
  ]},
  { id: 4, name: '康乃馨', parent_id: 0, level: 1, children: [
    { id: 18, name: '红色康乃馨', parent_id: 4, level: 2 },
    { id: 19, name: '粉色康乃馨', parent_id: 4, level: 2 },
  ]},
  { id: 5, name: '向日葵', parent_id: 0, level: 1, children: [
    { id: 21, name: '黄色向日葵', parent_id: 5, level: 2 },
    { id: 22, name: '混色向日葵', parent_id: 5, level: 2 },
  ]},
];

export const mockProducts: Product[] = [
  {
    id: 1, name: '红玫瑰 11 朵', subcategory: '爱情',
    category_ids: [1, 6], category_names: ['玫瑰', '红玫瑰'],
    price: 99.00, market_price: 129.00, stock: 200, unit: '枝',
    images: ['https://images.unsplash.com/photo-1518882605630-8eb639dcc4fb?w=400&q=80'],
    description: '红玫瑰是最经典的爱情之花，代表热烈的爱意。11朵寓意"一心一意"的爱。',
    tags: ['浪漫', '爱情', '表白'], sales_count: 150, status: 1
  },
  {
    id: 2, name: '红玫瑰 19 朵', subcategory: '经典',
    category_ids: [1, 6], category_names: ['玫瑰', '红玫瑰'],
    price: 159.00, market_price: 199.00, stock: 150, unit: '枝',
    images: ['https://images.unsplash.com/photo-1518882605630-8eb639dcc4fb?w=400&q=80'],
    description: '19朵红玫瑰代表"爱你长久"，是最浪漫的告白花束。',
    tags: ['浪漫', '爱情', '求婚'], sales_count: 120, status: 1
  },
  {
    id: 3, name: '红玫瑰 99 朵', subcategory: '永恒',
    category_ids: [1, 6], category_names: ['玫瑰', '红玫瑰'],
    price: 599.00, market_price: 799.00, stock: 50, unit: '枝',
    images: ['https://images.unsplash.com/photo-1518882605630-8eb639dcc4fb?w=400&q=80'],
    description: '99朵红玫瑰代表"长长久久"，是最隆重的爱情宣言。',
    tags: ['浪漫', '爱情', '求婚', '婚礼'], sales_count: 45, status: 1
  },
  {
    id: 4, name: '粉玫瑰 11 朵', subcategory: '温馨',
    category_ids: [1, 7], category_names: ['玫瑰', '粉玫瑰'],
    price: 89.00, market_price: 119.00, stock: 180, unit: '枝',
    images: ['https://images.unsplash.com/photo-1518882605630-8eb639dcc4fb?w=400&q=80'],
    description: '粉玫瑰代表温柔的喜欢，适合送给心仪的女孩或好朋友。',
    tags: ['浪漫', '友情', '感恩'], sales_count: 110, status: 1
  },
  {
    id: 5, name: '白玫瑰 11 朵', subcategory: '纯洁',
    category_ids: [1, 8], category_names: ['玫瑰', '白玫瑰'],
    price: 95.00, market_price: 125.00, stock: 160, unit: '枝',
    images: ['https://images.unsplash.com/photo-1518882605630-8eb639dcc4fb?w=400&q=80'],
    description: '白玫瑰代表纯洁无瑕的爱，是婚礼和新娘捧花的首选。',
    tags: ['浪漫', '爱情', '婚礼'], sales_count: 95, status: 1
  },
  {
    id: 6, name: '白百合 3 朵', subcategory: '纯洁',
    category_ids: [2, 11], category_names: ['百合', '白百合'],
    price: 79.00, market_price: 99.00, stock: 200, unit: '枝',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80'],
    description: '白百合象征纯洁、庄严，代表着完美无缺的爱。',
    tags: ['婚礼', '家居', '送长辈'], sales_count: 180, status: 1
  },
  {
    id: 7, name: '粉百合 3 朵', subcategory: '温馨',
    category_ids: [2, 12], category_names: ['百合', '粉百合'],
    price: 69.00, market_price: 89.00, stock: 180, unit: '枝',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80'],
    description: '粉百合计温柔浪漫，适合送给亲密的人。',
    tags: ['祝福', '爱情', '生日'], sales_count: 150, status: 1
  },
  {
    id: 8, name: '红色郁金香 10 枝', subcategory: '真爱',
    category_ids: [3, 14], category_names: ['郁金香', '红色郁金香'],
    price: 89.00, market_price: 119.00, stock: 150, unit: '枝',
    images: ['https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&q=80'],
    description: '红色郁金香的花语是"爱的告白"，象征着完美的爱情。',
    tags: ['爱情', '表白', '送恋人'], sales_count: 100, status: 1
  },
  {
    id: 9, name: '粉色郁金香 10 枝', subcategory: '温馨',
    category_ids: [3, 15], category_names: ['郁金香', '粉色郁金香'],
    price: 79.00, market_price: 109.00, stock: 160, unit: '枝',
    images: ['https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&q=80'],
    description: '粉色郁金香代表幸福和温馨，适合送与好友。',
    tags: ['友情', '祝福', '送朋友'], sales_count: 110, status: 1
  },
  {
    id: 10, name: '红色康乃馨 20 枝', subcategory: '热情',
    category_ids: [4, 18], category_names: ['康乃馨', '红色康乃馨'],
    price: 69.00, market_price: 89.00, stock: 200, unit: '枝',
    images: ['https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80'],
    description: '红色康乃馨代表热情、祝福，是母亲节的首选礼物。',
    tags: ['送长辈', '母亲节', '祝福'], sales_count: 180, status: 1
  },
  {
    id: 11, name: '向日葵 5 朵', subcategory: '阳光',
    category_ids: [5, 21], category_names: ['向日葵', '黄色向日葵'],
    price: 59.00, market_price: 79.00, stock: 180, unit: '枝',
    images: ['https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80'],
    description: '向日葵象征着积极向上、阳光开朗的生活态度。',
    tags: ['送朋友', '鼓励', '商务'], sales_count: 140, status: 1
  },
  {
    id: 12, name: '玫瑰混搭 20 枝', subcategory: '浪漫',
    category_ids: [1, 6, 7, 8], category_names: ['玫瑰', '混搭'],
    price: 139.00, market_price: 179.00, stock: 120, unit: '枝',
    images: ['https://images.unsplash.com/photo-1518882605630-8eb639dcc4fb?w=400&q=80'],
    description: '红、粉、白玫瑰混搭，色彩斑斓，浪漫满分。',
    tags: ['爱情', '生日', '纪念日'], sales_count: 90, status: 1
  },
];

export const mockInventory = mockProducts.map(p => ({
  product_id: p.id,
  product_name: p.name,
  current_stock: p.stock,
  safe_stock: Math.floor(p.stock * 0.2),
  unit: p.unit,
  status: p.stock >= 100 ? 'sufficient' as const : p.stock >= 20 ? 'low' as const : 'out' as const,
  stock_ratio: Math.min(100, Math.floor((p.stock / 200) * 100)),
  last_update_time: new Date().toISOString(),
}));
