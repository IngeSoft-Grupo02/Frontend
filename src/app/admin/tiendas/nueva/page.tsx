'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrarTiendaScreen } from '@/components/admin/RegistrarTiendaScreen';
import { MOCK_STORES, MOCK_USERS } from '@/mockData';

export default function NuevaTiendaPage() {
  const router = useRouter();
  const [stores, setStores] = useState(MOCK_STORES);
  const [merchants] = useState(MOCK_USERS.filter(u => u.role === 'Comerciante'));

  const handleSaveStore = (newStore: any) => {
    // TODO: Aquí irá la llamada a la API POST /api/stores
    console.log('Guardando tienda:', newStore);
    
    // Simular guardado y volver a la lista
    setStores(prev => [...prev, { 
      ...newStore, 
      id: `tenant-00${prev.length + 1}`,
      registrationDate: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }]);
    router.push('/admin/tiendas');
  };

  return (
    <RegistrarTiendaScreen
      merchants={merchants}
      onBack={() => router.push('/admin/tiendas')}
      onSave={handleSaveStore}
      onNavigateToBulk={() => router.push('/admin/carga-masiva')}
      initialData={null}
    />
  );
}