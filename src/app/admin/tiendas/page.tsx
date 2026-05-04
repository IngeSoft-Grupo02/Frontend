'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TiendasScreen } from '@/components/admin/TiendasScreen';
import { MOCK_STORES } from '@/mockData';

export default function TiendasPage() {
  const router = useRouter();
  const [stores, setStores] = useState(MOCK_STORES);

  const handleCreateStore = () => {
    router.push('/admin/tiendas/nueva');
  };

  const handleNavigateToBulk = () => {
    router.push('/admin/carga-masiva');
  };

  const handleUpdateStore = (id: string, updates: any) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleEditStore = (store: any) => {
    // Por ahora redirige a crear nueva, luego haremos la ruta dinámica /editar
    router.push('/admin/tiendas/nueva'); 
  };

  return (
    <TiendasScreen
      stores={stores}
      onCreateStore={handleCreateStore}
      onNavigateToBulk={handleNavigateToBulk}
      onUpdateStore={handleUpdateStore}
      onEditStore={handleEditStore}
    />
  );
}