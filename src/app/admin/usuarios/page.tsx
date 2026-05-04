'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UsuariosScreen } from '@/components/admin/UsuariosScreen';
import { MOCK_USERS, MOCK_STORES } from '@/mockData';

export default function UsuariosPage() {
  const router = useRouter();
  const [users, setUsers] = useState(MOCK_USERS);

  const handleCreateMerchant = () => {
    // Por ahora navega a la ruta, luego conectaremos con el backend
    router.push('/admin/usuarios/nuevo-comerciante');
  };

  return (
    <UsuariosScreen 
      users={users} 
      stores={MOCK_STORES} 
      onCreateMerchant={handleCreateMerchant} 
    />
  );
}