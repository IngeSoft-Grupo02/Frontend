'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Ban,
  Edit2,
  Loader2,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  UploadCloud,
  X,
} from 'lucide-react';
import { Badge, Button, Card, Input, Select } from '@/domains/admin/components/UI';
import {
  PRIMARY_COLORS,
  SECONDARY_COLORS,
  TERTIARY_COLORS,
} from '@/domains/admin/components/admin/StoreForm';
import { api, StoreCategoryResponse, StoreResponse } from '@/domains/admin/lib/api';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';

const STATUS_MAP: Record<string, string> = {
  ACTIVE: 'Activa',
  SUSPENDED: 'Suspendida',
  DEACTIVATED: 'Desactivada',
  INACTIVE: 'Inactiva',
};

const PRIMARY_MAP = Object.fromEntries(PRIMARY_COLORS.map(color => [color.id, color.code]));
const SECONDARY_MAP = Object.fromEntries(SECONDARY_COLORS.map(color => [color.id, color.code]));
const TERTIARY_MAP = Object.fromEntries(TERTIARY_COLORS.map(color => [color.id, color.code]));

function mapStatus(status: string) {
  return STATUS_MAP[status] ?? status;
}

function getStatusVariant(status: string): 'active' | 'suspended' | 'inactive' | 'neutral' {
  const normalized = status.toUpperCase();
  if (normalized === 'ACTIVE') return 'active';
  if (normalized === 'SUSPENDED') return 'suspended';
  if (normalized === 'INACTIVE') return 'inactive';
  return 'neutral';
}

function formatDate(value: string | null) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('es-PE');
  } catch {
    return value;
  }
}

type StoreAction = 'suspend' | 'reactivate' | 'deactivate';

export default function TiendasPage() {
  const router = useRouter();
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [categories, setCategories] = useState<StoreCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState<StoreResponse | null>(null);
  const [actionLoading, setActionLoading] = useState<{ id: number; action: StoreAction } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('Más reciente');

  const loadStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.stores.getAll({ search: searchTerm || undefined, status: filterStatus || undefined });
      setStores(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar las tiendas.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => { loadStores(); }, [loadStores]);

  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('updated') === '1') {
      setSuccessMessage('La tienda se actualizó correctamente.');
      router.replace(ADMIN_ROUTES.stores, { scroll: false });
    }
  }, [router]);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = window.setTimeout(() => setSuccessMessage(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const visibleStores = [...stores]
    .filter(store => !filterCategory || store.category?.id === Number(filterCategory))
    .sort((first, second) => {
      if (sortOrder === 'A-Z') return first.storeName.localeCompare(second.storeName);
      if (sortOrder === 'Z-A') return second.storeName.localeCompare(first.storeName);
      if (sortOrder === 'Más antiguo') return (first.createdAt ?? '').localeCompare(second.createdAt ?? '');
      return (second.createdAt ?? '').localeCompare(first.createdAt ?? '');
    });

  const handleAction = async (action: StoreAction, store: StoreResponse) => {
    const question = {
      suspend: '¿Suspender',
      reactivate: '¿Reactivar',
      deactivate: '¿Desactivar',
    }[action];
    if (!window.confirm(`${question} "${store.storeName}"?`)) return;

    setActionLoading({ id: store.id, action });
    try {
      if (action === 'suspend') await api.stores.suspend(store.id);
      if (action === 'reactivate') await api.stores.reactivate(store.id);
      if (action === 'deactivate') await api.stores.deactivate(store.id);
      setShowDetail(null);
      setSuccessMessage(`La tienda se ${action === 'suspend' ? 'suspendió' : action === 'reactivate' ? 'reactivó' : 'desactivó'} correctamente.`);
      await loadStores();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'No se pudo actualizar el estado de la tienda.');
    } finally {
      setActionLoading(null);
    }
  };

  const actionIsLoading = (storeId: number, action: StoreAction) =>
    actionLoading?.id === storeId && actionLoading.action === action;

  return (
    <div className="space-y-8 relative max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Directorio de tiendas</h2>
          <p className="text-[14px] font-medium text-neutral-400">Gestión de activos y configuración de marca</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="secondary" className="rounded-full shadow-sm px-6" onClick={() => router.push(ADMIN_ROUTES.bulk)}>
            <UploadCloud size={14} className="mr-2" /> Carga masiva
          </Button>
          <Button onClick={() => router.push(ADMIN_ROUTES.newStore)} className="rounded-full px-6">
            <Plus size={14} className="mr-2" /> Nueva tienda
          </Button>
        </div>
      </div>

      {successMessage && (
        <div role="status" className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-[14px] font-bold text-green-800">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <Input label="Buscar tienda" placeholder="Nombre o slug" icon={Search} value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
        <div>
          <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Categoría</label>
          <select value={filterCategory} onChange={event => setFilterCategory(event.target.value)}
                  className="w-full px-5 py-3.5 bg-white border border-neutral-200 rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel">
            <option value="">Todas</option>
            {categories.map(category => <option key={category.id} value={category.id}>{category.storeCategoryName}</option>)}
          </select>
        </div>
        <Select label="Estado" value={filterStatus} onChange={event => setFilterStatus(event.target.value)}>
          <option value="">Todos</option>
          <option value="ACTIVE">Activa</option>
          <option value="SUSPENDED">Suspendida</option>
          <option value="INACTIVE">Desactivada</option>
        </Select>
        <Select label="Orden" value={sortOrder} onChange={event => setSortOrder(event.target.value)}>
          <option>Más reciente</option><option>Más antiguo</option><option>A-Z</option><option>Z-A</option>
        </Select>
      </div>

      <Card className="px-0 py-2 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-neutral-400"><Loader2 size={20} className="animate-spin" /> Cargando tiendas...</div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-red-600 px-6 text-center">
            <div className="flex items-center gap-3"><AlertCircle size={20} /> {error}</div>
            <Button type="button" variant="secondary" onClick={loadStores}>Reintentar</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[980px]">
              <thead className="bg-[#f1ede4]">
                <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-8">Nombre</th>
                  <th className="py-4 px-4">Categoría</th>
                  <th className="py-4 px-4">Comerciante</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4 text-center w-[136px]">Acciones</th>
                  <th className="py-4 px-8 text-right">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {visibleStores.map(store => (
                  <tr key={store.id} className="text-[13px] hover:bg-neutral-50 cursor-pointer transition-colors" onClick={() => setShowDetail(store)}>
                    <td className="py-5 px-8 font-extrabold text-neutral-900">{store.storeName}</td>
                    <td className="py-5 px-4 font-medium text-neutral-600">{store.category?.storeCategoryName ?? <span className="text-neutral-300 italic">Sin categoría</span>}</td>
                    <td className="py-5 px-4 font-mono text-[12px] text-neutral-500">{store.merchant?.userAccount?.email ?? '—'}</td>
                    <td className="py-5 px-4"><Badge variant={getStatusVariant(store.storeStatus)}>{mapStatus(store.storeStatus)}</Badge></td>
                    <td className="py-5 px-4" onClick={event => event.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2 min-h-10">
                        <button type="button" aria-label={`Editar ${store.storeName}`} title="Editar tienda"
                                onClick={() => router.push(ADMIN_ROUTES.editStore(store.id))}
                                className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:border-brand-camel hover:text-brand-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-camel disabled:opacity-50">
                          <Edit2 size={17} />
                        </button>
                        {store.storeStatus === 'ACTIVE' && (
                          <button type="button" aria-label={`Suspender ${store.storeName}`} title="Suspender tienda"
                                  disabled={actionLoading !== null} onClick={() => handleAction('suspend', store)}
                                  className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-amber-700 hover:border-amber-400 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionIsLoading(store.id, 'suspend') ? <Loader2 size={17} className="animate-spin" /> : <PauseCircle size={17} />}
                          </button>
                        )}
                        {store.storeStatus === 'SUSPENDED' && (
                          <button type="button" aria-label={`Reactivar ${store.storeName}`} title="Reactivar tienda"
                                  disabled={actionLoading !== null} onClick={() => handleAction('reactivate', store)}
                                  className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-green-700 hover:border-green-400 hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            {actionIsLoading(store.id, 'reactivate') ? <Loader2 size={17} className="animate-spin" /> : <PlayCircle size={17} />}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right font-medium text-neutral-500">{formatDate(store.createdAt)}</td>
                  </tr>
                ))}
                {visibleStores.length === 0 && <tr><td colSpan={6} className="py-20 text-center text-neutral-400 italic">No se encontraron tiendas.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {showDetail && (
          <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-lg bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-6 sm:p-10">
                <div className="flex justify-between items-start gap-4 mb-8">
                  <div>
                    <h3 className="text-[26px] sm:text-[28px] font-display font-extrabold">Detalle de tienda</h3>
                    <p className="text-[14px] text-neutral-400">ID: {showDetail.id} · {showDetail.slug}</p>
                  </div>
                  <button type="button" aria-label="Cerrar detalle" title="Cerrar" onClick={() => setShowDetail(null)}
                          className="w-10 h-10 shrink-0 inline-flex items-center justify-center hover:bg-neutral-100 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-camel">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5 mb-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div><p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Nombre</p><p className="font-extrabold text-neutral-900">{showDetail.storeName}</p></div>
                    <div><p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Estado</p><Badge variant={getStatusVariant(showDetail.storeStatus)}>{mapStatus(showDetail.storeStatus)}</Badge></div>
                  </div>
                  <div><p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Categoría</p><p className="font-bold text-neutral-700">{showDetail.category?.storeCategoryName ?? '—'}</p></div>
                  <div><p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Comerciante</p><p className="font-bold text-neutral-700">{showDetail.merchant?.userAccount?.email ?? 'Sin asignar'}</p></div>
                  {showDetail.description && <div><p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Descripción</p><p className="text-[14px] text-neutral-500">{showDetail.description}</p></div>}
                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase mb-2">Paleta</p>
                    <div className="flex items-center gap-2">
                      {[PRIMARY_MAP[showDetail.primaryColor ?? ''], SECONDARY_MAP[showDetail.secondaryColor ?? ''], TERTIARY_MAP[showDetail.tertiaryColor ?? '']]
                        .filter(Boolean).map((color, index) => <div key={index} className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="secondary" className="h-12 rounded-2xl" onClick={() => router.push(ADMIN_ROUTES.editStore(showDetail.id))}>
                    <Edit2 size={16} className="mr-2" /> Editar
                  </Button>
                  {showDetail.storeStatus === 'ACTIVE' && (
                    <Button type="button" className="h-12 rounded-2xl bg-brand-camel hover:bg-brand-camel-dark" disabled={actionLoading !== null} onClick={() => handleAction('suspend', showDetail)}>
                      <PauseCircle size={16} className="mr-2" /> Suspender
                    </Button>
                  )}
                  {showDetail.storeStatus === 'SUSPENDED' && (
                    <Button type="button" className="h-12 rounded-2xl" disabled={actionLoading !== null} onClick={() => handleAction('reactivate', showDetail)}>
                      <PlayCircle size={16} className="mr-2" /> Reactivar
                    </Button>
                  )}
                  {showDetail.storeStatus !== 'INACTIVE' && (
                    <Button type="button" variant="secondary" className="col-span-2 h-12 rounded-2xl text-red-600 border-red-100 hover:bg-red-50" disabled={actionLoading !== null} onClick={() => handleAction('deactivate', showDetail)}>
                      <Ban size={16} className="mr-2" /> Deshabilitar tienda
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
