'use client';

import { DashboardScreen } from '@/components/admin/DashboardScreen';
import { MOCK_STORES } from '@/mockData';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stores] = useState(MOCK_STORES);

  const handleCreateStore = () => {
    router.push('/admin/tiendas/nueva');
  };

  return <DashboardScreen stores={stores} onCreateStore={handleCreateStore} />;
}