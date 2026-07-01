'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PasswordRecovery } from '@/domains/cliente/components/PasswordRecovery';
import { LoadingSpinner } from '@/domains/shared/components/LoadingSpinner';

function RecuperacionContent() {
  const searchParams = useSearchParams();
  return (
    <PasswordRecovery
      token={searchParams.get('token')}
      storeSlug={searchParams.get('store')}
    />
  );
}

export default function RecuperacionPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-warm-bg flex items-center justify-center p-8"><LoadingSpinner label="Cargando..." /></main>}>
      <RecuperacionContent />
    </Suspense>
  );
}
