'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Lock,
  Bell,
  Database,
  Shield,
  Save,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '管理员',
    email: 'admin@flowerisland.com',
    phone: '138****8888',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    // Simulate save
    alert('个人信息已保存');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('密码长度至少8位');
      return;
    }
    alert('密码修改成功');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <DashboardLayout
      title="系统设置"
      breadcrumbs={[
        { label: '首页', href: '/dashboard' },
        { label: '系统设置' },
      ]}
    >
      <div className="animate-fadeIn">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              个人信息
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              安全设置
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              通知设置
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Database className="w-4 h-4" />
              系统设置
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>个人信息</CardTitle>
                    <CardDescription>管理您的账号基本信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                          alt="Avatar"
                          className="w-24 h-24 rounded-full bg-slate-200"
                        />
                        <button className="absolute bottom-0 right-0 p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">上传新头像</p>
                        <p className="text-sm text-slate-500">支持 JPG、PNG 格式，文件小于 2MB</p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">姓名</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">手机号</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>角色</Label>
                        <div className="h-10 px-3 flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <Badge className="bg-pink-100 text-pink-700">超级管理员</Badge>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 gap-2"
                    >
                      <Save className="w-4 h-4" />
                      保存修改
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">账号信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">用户名</span>
                      <span className="font-medium">admin</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">注册时间</span>
                      <span className="text-sm">2024-01-01</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">最后登录</span>
                      <span className="text-sm">2024-12-01 10:30</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-pink-500" />
                    修改密码
                  </CardTitle>
                  <CardDescription>
                    为了保障您的账号安全，建议定期更换密码
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">当前密码</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <p className="text-xs text-slate-400">
                      密码长度至少8位，且包含字母和数字
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认新密码</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  >
                    修改密码
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-pink-500" />
                    安全设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">双因素认证</p>
                      <p className="text-sm text-slate-500">启用后登录需要输入手机验证码</p>
                    </div>
                    <Button variant="outline" size="sm">
                      未启用
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">登录设备管理</p>
                      <p className="text-sm text-slate-500">查看并管理已登录的设备</p>
                    </div>
                    <Button variant="outline" size="sm">
                      查看
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900">会话超时</p>
                      <p className="text-sm text-slate-500">无操作后自动退出登录的时间</p>
                    </div>
                    <Badge>30 分钟</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>通知偏好设置</CardTitle>
                <CardDescription>管理您希望接收的通知类型</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: '库存预警通知', desc: '当商品库存低于安全阈值时', enabled: true },
                  { title: 'AI 分析报告', desc: '定期接收 AI 生成的库存和销售分析', enabled: true },
                  { title: '系统公告', desc: '接收系统更新和维护通知', enabled: true },
                  { title: '订单提醒', desc: '新订单和订单状态变更通知', enabled: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <Button
                      variant={item.enabled ? 'default' : 'outline'}
                      size="sm"
                      className={cn(item.enabled && 'bg-pink-500 hover:bg-pink-600')}
                    >
                      {item.enabled ? '已开启' : '未开启'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>系统信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">系统版本</span>
                    <Badge>v1.0.0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">数据库版本</span>
                    <span className="text-sm">MySQL 8.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">运行环境</span>
                    <span className="text-sm">Node.js 18</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>数据管理</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    数据备份
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    数据恢复
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Database className="w-4 h-4 mr-2" />
                    清除缓存
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
