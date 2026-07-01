'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Input, Card } from '@/domains/admin/components/UI';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';
import { api } from '@/domains/admin/lib/api';
import { messageFromError } from '@/domains/shared/errors';

export default function NuevaCategoriaPage() {
  const router = useRouter();

  const [catName, setCatName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!catName) return;
    setSaving(true);
    setError(null);
    try {
      await api.categories.create({ storeCategoryName: catName.trim() });
      router.push(ADMIN_ROUTES.categories);
    } catch (err) {
      setError(messageFromError(err, 'No se pudo crear la categoría.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fadeIn duration-500 max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-brand-camel font-bold text-[14px] hover:underline">
          <ArrowLeft size={16} /> Volver a categorías
        </button>
        <h2 className="text-[28px] font-display font-extrabold tracking-tight">
          Nueva categoría
        </h2>
        <p className="text-[14px] font-medium text-neutral-400">Define los parámetros de la categoría global</p>
      </div>

      <Card className="p-10 border-2 border-brand-camel shadow-xl">
        <div className="space-y-8">
          <Input 
            label="Nombre de categoría" 
            placeholder="Ej. Accesorios" 
            value={catName} 
            onChange={e => { setCatName(e.target.value); setError(null); }}
          />
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <p className="text-[13px] text-red-800 font-medium">{error}</p>
            </div>
          )}

          <div className="pt-8 flex gap-4">
            <Button variant="secondary" className="flex-1 h-14 rounded-2xl" onClick={() => router.back()}>Cancelar</Button>
            <Button className="flex-1 h-14 rounded-2xl shadow-lg inline-flex items-center justify-center gap-2" onClick={handleSave} disabled={saving || !catName.trim()}>
              {saving ? <><Loader2 size={16} className="animate-spin" /> Cargando...</> : 'Crear categoría'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
