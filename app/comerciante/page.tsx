'use client';

import { useStore } from '@/domains/comerciante/context/StoreContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isAuthInitialized, isLoading } = useStore();

  useEffect(() => {
    if (!isAuthInitialized || isLoading) return;
    router.replace(isAuthenticated ? '/comerciante/store-selection' : '/comerciante/login');
  }, [isAuthInitialized, isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-brand-neutral-light flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-brand-text-muted">
        <div className="w-8 h-8 border-2 border-brand-neutral-border border-t-brand-black rounded-full animate-spin"></div>
        <p className="text-[12px] font-bold uppercase tracking-widest">Cargando...</p>
      </div>
    </div>
  );
}
