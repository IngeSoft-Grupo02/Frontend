'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PasswordRecovery } from '@/domains/cliente/components/PasswordRecovery';

function RecuperacionContent() {
  const searchParams = useSearchParams();
  return <PasswordRecovery token={searchParams.get('token')} />;
}

export default function RecuperacionPage() {
  return (
    <Suspense fallback={null}>
      <RecuperacionContent />
    </Suspense>
  );
}
