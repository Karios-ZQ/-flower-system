'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Flower2,
  Package,
  AlertTriangle,
  History,
  Settings,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserInfo {
  id: number;
  username: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

const navigation = [
  { name: '数据概览', href: '/dashboard', icon: LayoutDashboard },
  { name: '商品管理', href: '/products', icon: Flower2, children: [
    { name: '商品列表', href: '/products' },
    { name: '添加商品', href: '/products/add' },
  ]},
  { name: '库存管理', href: '/inventory', icon: Package, children: [
    { name: '实时监控', href: '/inventory/monitor' },
    { name: '预警管理', href: '/inventory/warning' },
    { name: '出入库记录', href: '/inventory/record' },
  ]},
  { name: '系统设置', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    }
  }, []);

  useEffect(() => {
    // 自动展开当前路径的父菜单
    const currentNav = navigation.find(item => 
      pathname === item.href || 
      (item.children?.some(child => pathname === child.href))
    );
    if (currentNav && currentNav.children) {
      setExpandedItems(prev => 
        prev.includes(currentNav.href) ? prev : [...prev, currentNav.href]
      );
    }
  }, [pathname]);

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <Flower2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">花屿鲜花</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.href)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-pink-50 text-pink-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        expandedItems.includes(item.href) && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedItems.includes(item.href) && (
                    <ul className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.href}
                            className={cn(
                              'block px-3 py-2 rounded-lg text-sm transition-colors',
                              pathname === child.href
                                ? 'bg-pink-50 text-pink-600 font-medium'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            )}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-pink-50 text-pink-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10 bg-pink-100">
            <AvatarFallback className="text-pink-600 font-medium">
              {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.name || user?.username || '用户'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.role === 'admin' ? '管理员' : '运营人员'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </div>
  );
}
