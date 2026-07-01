'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Badge, Button, Card, Input } from '@/domains/admin/components/UI';
import { api } from '@/domains/admin/lib/api';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';
import { messageFromError } from '@/domains/shared/errors';

type Category = { id: number; storeCategoryName: string; active: boolean };

export default function EditarCategoriaPage() {
  const router = useRouter();
  const params = useParams();
  const categoryName = decodeURIComponent(params.name as string);

  const [category, setCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categories = await api.categories.getAll({ search: categoryName });
      const found = categories.find(item => item.storeCategoryName === categoryName) ?? null;
      setCategory(found);
      setCatName(found?.storeCategoryName ?? '');
    } catch (err) {
      setError(messageFromError(err, 'No se pudo cargar la categoría.'));
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => { loadCategory(); }, [loadCategory]);

  const handleSave = async () => {
    if (!category || !catName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await api.categories.update(category.id, { storeCategoryName: catName.trim() });
      router.push(ADMIN_ROUTES.categories);
    } catch (err) {
      setError(messageFromError(err, 'No se pudo actualizar la categoría.'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!category) return;
    setSaving(true);
    setError(null);
    try {
      if (category.active) await api.categories.deactivate(category.id);
      else await api.categories.reactivate(category.id);
      await loadCategory();
    } catch (err) {
      setError(messageFromError(err, 'No se pudo cambiar el estado de la categoría.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] gap-3 text-neutral-400">
        <Loader2 size={20} className="animate-spin" /> Cargando categoría...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-xl font-bold text-neutral-400">Categoría no encontrada</p>
        <Button onClick={() => router.push(ADMIN_ROUTES.categories)}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fadeIn duration-500 max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <button onClick={() => router.push(ADMIN_ROUTES.categories)} className="flex items-center gap-2 text-brand-camel font-bold text-[14px] hover:underline">
          <ArrowLeft size={16} /> Volver a categorías
        </button>
        <h2 className="text-[28px] font-display font-extrabold tracking-tight">
          Editar categoría
        </h2>
        <p className="text-[14px] font-medium text-neutral-400">Actualiza la categoría registrada en la plataforma</p>
      </div>

      <Card className="p-10 border-2 border-brand-camel shadow-xl">
        <div className="space-y-8">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 border border-neutral-100 px-5 py-4">
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase">Estado actual</p>
              <Badge variant={category.active ? 'active' : 'inactive'}>{category.active ? 'Activa' : 'Inactiva'}</Badge>
            </div>
            <Button variant="secondary" className="rounded-full border border-neutral-200 whitespace-nowrap" onClick={handleToggleStatus} disabled={saving}>
              {category.active ? 'Desactivar' : 'Activar'}
            </Button>
          </div>

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
            <Button variant="secondary" className="flex-1 h-14 rounded-2xl" onClick={() => router.push(ADMIN_ROUTES.categories)}>Cancelar</Button>
            <Button className="flex-1 h-14 rounded-2xl shadow-lg inline-flex items-center justify-center gap-2" onClick={handleSave} disabled={saving || !catName.trim()}>
              {saving ? <><Loader2 size={16} className="animate-spin" /> Cargando...</> : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
