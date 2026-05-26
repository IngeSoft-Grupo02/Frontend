'use client';

import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar - z-50 para estar siempre encima */}
      <div className="z-50">
        <Sidebar />
      </div>
      
      {/* Wrapper del contenido principal */}
      <div className="flex-1 flex flex-col pl-[280px] relative">
        
        {/* TopBar - z-40 para estar encima del contenido pero debajo del sidebar si se solapan */}
        <div className="z-40">
          <TopBar />
        </div>
        
        {/* Contenido - pt-24 (96px) para dar espacio suficiente debajo de la topbar (h-20 = 80px) */}
        <main className="flex-1 pt-24 p-8">
          <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}