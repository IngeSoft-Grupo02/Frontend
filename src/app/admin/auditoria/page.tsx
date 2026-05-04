'use client';

import { useState } from 'react';
import { AuditoriaScreen } from '@/components/admin/AuditoriaScreen';
import { MOCK_AUDIT } from '@/mockData';

export default function AuditoriaPage() {
  const [logs] = useState(MOCK_AUDIT);

  return <AuditoriaScreen logs={logs} />;
}