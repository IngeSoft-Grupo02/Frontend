import { LoadingSpinner } from '@/domains/shared/components/LoadingSpinner';

export default function Loading() {
  return (
    <main className="min-h-screen bg-warm-bg flex items-center justify-center p-8">
      <LoadingSpinner label="Cargando..." />
    </main>
  );
}
