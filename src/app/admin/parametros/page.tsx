'use client';

import { useState } from 'react';
import { ParametrosScreen } from '@/components/admin/ParametrosScreen';

export default function ParametrosPage() {
  const [params, setParams] = useState({
    maxImagesPerStore: 100,
    maxProductsPerCategory: 500,
    allowedImageExtensions: 'jpg,png,webp',
    defaultTenantStatus: 'Activa',
    enableAuditLogs: true,
    sessionTimeoutMinutes: 60,
    maintenanceMode: false,
  });

  const handleSave = (updatedParams: any) => {
    console.log('💾 Guardando parámetros:', updatedParams);
    setParams(updatedParams);
    // 🔌 TODO: await fetch('/api/system/config', { method: 'PUT', body: JSON.stringify(updatedParams) })
  };

  return <ParametrosScreen initialParams={params} onSave={handleSave} />;
}