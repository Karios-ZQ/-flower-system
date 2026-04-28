'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Database, CheckCircle, XCircle, ArrowRight, Flower2, AlertCircle } from 'lucide-react';

export default function DatabaseInitPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const checkConnection = async () => {
    setIsChecking(true);
    setMessage('');
    setConnectionStatus('idle');

    try {
      const response = await fetch('/api/db/init');
      const result = await response.json();
      
      if (result.code === 200) {
        setConnectionStatus('success');
        setMessage(result.message);
      } else {
        setConnectionStatus('error');
        setMessage(result.message || '数据库连接失败');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setConnectionStatus('error');
      setMessage(`连接失败: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg mb-4">
            <Flower2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">花屿鲜花系统</h1>
          <p className="text-slate-500 mt-2">数据库初始化向导</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-lg">数据库配置说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">主机地址:</span>
                <span>{process.env.DB_HOST || 'localhost'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">端口:</span>
                <span>{process.env.DB_PORT || '3306'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">数据库名:</span>
                <span>{process.env.DB_NAME || 'Flower'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">用户名:</span>
                <span>{process.env.DB_USER || 'root'}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">配置数据库连接</p>
                  <p className="mb-2">在项目根目录创建 <code className="bg-blue-100 px-1 rounded">.env.local</code> 文件，配置以下环境变量：</p>
                  <pre className="bg-blue-100 p-2 rounded text-xs overflow-x-auto">
{`DB_HOST=你的云数据库地址
DB_PORT=3306
DB_NAME=Flower
DB_USER=root
DB_PASSWORD=你的密码`}
                  </pre>
                  <p className="mt-2">配置完成后重新启动服务即可。</p>
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                connectionStatus === 'success'
                  ? 'bg-green-50 text-green-600 border border-green-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                <div className="flex items-center gap-2">
                  {connectionStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {message}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={checkConnection}
                disabled={isChecking}
              >
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                测试连接
              </Button>
            </div>

            {connectionStatus === 'success' && (
              <Button
                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                onClick={() => router.push('/init')}
              >
                初始化数据库
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-white/50 rounded-lg">
          <h3 className="font-medium text-slate-700 mb-2">快速开始</h3>
          <ol className="text-sm text-slate-500 space-y-1 list-decimal list-inside">
            <li>准备好 MySQL 数据库（本地或云端）</li>
            <li>创建名为 <code className="bg-slate-100 px-1 rounded">Flower</code> 的数据库</li>
            <li>配置 .env.local 环境变量</li>
            <li>点击&quot;测试连接&quot;验证连接</li>
            <li>初始化数据库表和演示数据</li>
            <li>使用演示账号登录系统</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-white/50 rounded-lg">
          <h3 className="font-medium text-slate-700 mb-2">演示账号</h3>
          <div className="text-sm text-slate-500 space-y-1">
            <p>管理员: admin / admin123</p>
            <p>运营人员: operator / operator123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
