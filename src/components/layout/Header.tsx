'use client';

import { useState } from 'react';
import { Bell, Search, ChevronDown, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ title, breadcrumbs = [] }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: '1',
      title: '库存预警',
      message: '郁金香10朵混色库存不足，请及时补货',
      time: '5分钟前',
      unread: true,
    },
    {
      id: '2',
      title: 'AI 建议',
      message: '情人节临近，建议提前备货红玫瑰系列',
      time: '1小时前',
      unread: true,
    },
    {
      id: '3',
      title: '系统通知',
      message: '系统将于今晚23:00进行例行维护',
      time: '3小时前',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      {/* Left: Title & Breadcrumbs */}
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-slate-700">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-900 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {title && <h1 className="text-xl font-semibold text-slate-900">{title}</h1>}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索商品..."
            className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">通知中心</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors',
                        notification.unread && 'bg-pink-50/50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className={cn(!notification.unread && 'ml-5')}>
                          <p className="text-sm font-medium text-slate-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-slate-100">
                  <button className="w-full text-sm text-pink-600 hover:text-pink-700 font-medium">
                    查看全部通知
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="Avatar"
              className="w-8 h-8 rounded-full bg-slate-200"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-900">管理员</p>
              <p className="text-xs text-slate-500">admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-1">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">管理员</p>
                  <p className="text-xs text-slate-500">admin@flowerisland.com</p>
                </div>
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="w-4 h-4" />
                  系统设置
                </a>
                <a
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
