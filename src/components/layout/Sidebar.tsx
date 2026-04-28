'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Settings,
  LogOut,
  Flower2,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    title: '仪表盘',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '商品管理',
    href: '/products',
    icon: Package,
    children: [
      { title: '商品列表', href: '/products' },
      { title: '新增商品', href: '/products/add' },
      { title: '商品分类', href: '/products/categories' },
    ],
  },
  {
    title: '库存管理',
    href: '/inventory',
    icon: Warehouse,
    children: [
      { title: '实时监控', href: '/inventory' },
      { title: '预警管理', href: '/inventory/warnings' },
      { title: '出入库记录', href: '/inventory/records' },
    ],
  },
  {
    title: 'AI 智能',
    href: '/ai',
    icon: Flower2,
    children: [
      { title: '文案生成', href: '/ai/generate' },
      { title: '智能分类', href: '/ai/classify' },
      { title: '销售预测', href: '/ai/predict' },
    ],
  },
  {
    title: '系统设置',
    href: '/settings',
    icon: Settings,
    children: [
      { title: '基础设置', href: '/settings' },
      { title: '操作日志', href: '/settings/logs' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['商品管理', '库存管理']);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">花屿鲜花</h1>
            <p className="text-xs text-slate-400">智能选购系统</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors',
                    'hover:bg-slate-800',
                    pathname.startsWith(item.href) && 'bg-slate-800 text-pink-400'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      expandedItems.includes(item.title) && 'rotate-180'
                    )}
                  />
                </button>
                {expandedItems.includes(item.title) && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2 rounded-lg text-sm transition-colors',
                          isActive(child.href)
                            ? 'bg-pink-500/20 text-pink-400'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                  'hover:bg-slate-800',
                  isActive(item.href) && 'bg-slate-800 text-pink-400'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Warning indicator */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/inventory/warnings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="flex-1">库存预警</span>
          <span className="px-2 py-0.5 bg-amber-500 text-amber-900 text-xs font-medium rounded-full">
            2
          </span>
        </Link>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </Link>
      </div>
    </aside>
  );
}
