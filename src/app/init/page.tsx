'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flower2, ArrowRight, Database, CheckCircle, Info } from 'lucide-react';

export default function DatabaseInitPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg mb-4">
            <Flower2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">花屿鲜花系统</h1>
          <p className="text-slate-500 mt-2">花店智能选购管理平台</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-lg">系统已准备就绪</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-2">演示模式已启用</p>
                  <p>系统将使用内置的演示数据，无需配置数据库即可体验完整功能。</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">后续配置数据库</p>
                  <p className="mb-2">如需连接真实数据库，在项目根目录创建 <code className="bg-blue-100 px-1 rounded">.env.local</code> 文件：</p>
                  <pre className="bg-blue-100 p-2 rounded text-xs overflow-x-auto">
{`DB_HOST=你的云数据库地址
DB_PORT=3306
DB_NAME=Flower
DB_USER=root
DB_PASSWORD=你的密码`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-slate-700">演示账号</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">管理员</p>
                  <p className="text-slate-500">admin / admin123</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">运营人员</p>
                  <p className="text-slate-500">operator / operator123</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              onClick={() => router.push('/login')}
            >
              进入登录页
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-white/50 rounded-lg">
          <h3 className="font-medium text-slate-700 mb-2">主要功能</h3>
          <ul className="text-sm text-slate-500 space-y-1">
            <li>• 商品管理 - 添加、编辑、上下架商品</li>
            <li>• 库存监控 - 实时查看库存状态</li>
            <li>• 预警管理 - 库存不足自动预警</li>
            <li>• 出入库记录 - 记录库存变动明细</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
