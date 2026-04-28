'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flower2, ArrowRight, Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 直接跳转到初始化页面
    router.replace('/init');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <Flower2 className="w-12 h-12 text-pink-500 mx-auto animate-pulse" />
        <p className="mt-4 text-slate-500 flex items-center gap-2 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          加载中...
        </p>
      </div>
    </div>
  );
}
