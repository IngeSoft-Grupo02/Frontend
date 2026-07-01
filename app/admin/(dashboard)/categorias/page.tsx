'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/domains/admin/lib/api';
import { Badge, Button, Card, Input } from '@/domains/admin/components/UI';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Search, Edit2, X, Loader2, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import { useAutoRefresh } from '@/domains/shared/hooks/useAutoRefresh';

interface Category { id: number; storeCategoryName: string; active: boolean; }

const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const CATEGORIES_PAGE_SIZE = 6;

// ── Modal crear / editar ──────────────────────────────────────────
function CategoryModal({ category, onClose, onSaved }: {
  category: Category | null; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = category !== null;
  const [name,     setName]     = useState(category?.storeCategoryName ?? '');
  const [error,    setError]    = useState('');
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState<string|null>(null);

  const handleChange = (val: string) => {
    // Solo letras y espacios
    const clean = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    setName(clean);
    setError('');
  };

  const handleSave = async () => {
    if (!name.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!SOLO_LETRAS.test(name.trim())) { setError('Solo se permiten letras y espacios.'); return; }
    setSaving(true); setApiError(null);
    try {
      if (isEdit) await api.categories.update(category!.id, { storeCategoryName: name.trim() });
      else        await api.categories.create({ storeCategoryName: name.trim() });
      onSaved();
    } catch (e: any) { setApiError(e.message); } finally { setSaving(false); }
  };

  return (
      <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
        <motion.div initial={{ opacity:0, scale:0.97, y:10 }} animate={{ opacity:1, scale:1, y:0 }}
                    exit={{ opacity:0, scale:0.97, y:10 }} transition={{ duration:0.15 }}
                    className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden">
          <div className="p-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-[28px] font-display font-extrabold tracking-tight text-brand-black">
                  {isEdit ? 'Editar categoría' : 'Nueva categoría'}
                </h3>
                <p className="text-[14px] font-medium text-neutral-400">
                  {isEdit ? 'Modifica el nombre' : 'Crea una categoría global de tiendas'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X size={24}/></button>
            </div>
            {apiError && (
                <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <AlertCircle size={16} className="text-red-600 shrink-0"/>
                  <p className="text-[13px] text-red-800 font-medium">{apiError}</p>
                </div>
            )}
            <div className="space-y-2 mb-8">
              <Input label="Nombre de la categoría *" placeholder="Ej: Polos, Gorras, Casacas..."
                     value={name} onChange={e => handleChange(e.target.value)}
                     onBlur={() => !name.trim() && setError('El nombre es obligatorio.')}
                     error={error}/>
              <p className="text-[11px] text-neutral-400 ml-1">Solo letras y espacios, sin números ni símbolos.</p>
            </div>
            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <Button variant="secondary" className="flex-1 rounded-2xl h-14" onClick={onClose}>Cancelar</Button>
              <Button className="flex-1 rounded-2xl h-14 inline-flex items-center justify-center gap-2 whitespace-nowrap" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 size={16} className="animate-spin"/>Cargando...</> : isEdit ? 'Guardar cambios' : 'Crear categoría'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function CategoriasPage() {
  const [categories,    setCategories]    = useState<Category[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string|null>(null);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [filterStatus,  setFilterStatus]  = useState<'all'|'active'|'inactive'>('all');
  const [showModal,     setShowModal]     = useState(false);
  const [editTarget,    setEditTarget]    = useState<Category|null>(null);
  const [actionLoading, setActionLoading] = useState<number|null>(null);
  const [successMsg,    setSuccessMsg]    = useState<string|null>(null);
  const hasLoadedCategoriesRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadCategories = useCallback(async (background = false) => {
    try {
      if (!background) {
        setLoading(true); setError(null);
      }
      const data = await api.categories.getAll({ search: searchTerm || undefined });
      setCategories(data);
      hasLoadedCategoriesRef.current = true;
    } catch (e: any) {
      if (!background || !hasLoadedCategoriesRef.current) setError(e.message);
    } finally {
      if (!background) setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  useAutoRefresh({
    enabled: true,
    intervalMs: 30000,
    onRefresh: () => loadCategories(true),
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleToggleStatus = async (cat: Category) => {
    setActionLoading(cat.id);
    try {
      if (cat.active) await api.categories.deactivate(cat.id);
      else            await api.categories.reactivate(cat.id);
      showSuccess(`"${cat.storeCategoryName}" ${cat.active ? 'desactivada' : 'reactivada'}.`);
      await loadCategories();
    } catch (e: any) { setError(e.message); } finally { setActionLoading(null); }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`¿Eliminar "${cat.storeCategoryName}"?`)) return;
    setActionLoading(cat.id);
    try {
      await api.categories.delete(cat.id);
      showSuccess(`"${cat.storeCategoryName}" eliminada.`);
      await loadCategories();
    } catch (e: any) { setError(e.message); } finally { setActionLoading(null); }
  };

  const filtered = categories.filter(c => {
    if (filterStatus === 'active')   return c.active;
    if (filterStatus === 'inactive') return !c.active;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / CATEGORIES_PAGE_SIZE));
  const pageStart = (currentPage - 1) * CATEGORIES_PAGE_SIZE;
  const pageEnd = Math.min(pageStart + CATEGORIES_PAGE_SIZE, filtered.length);
  const paginatedCategories = filtered.slice(pageStart, pageEnd);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    setCurrentPage(page => Math.min(page, totalPages));
  }, [totalPages]);

  return (
      <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <AnimatePresence>
          {successMsg && (
              <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                          transition={{ duration:0.15 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                <CheckCircle2 size={18} className="text-green-600 shrink-0"/>
                <p className="text-[14px] text-green-800 font-medium">{successMsg}</p>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <Input label="Buscar categoría" placeholder="Nombre de la categoría" icon={Search}
                 value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Estado</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
                    className="w-full px-5 py-3.5 bg-white border border-neutral-200 rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors">
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>
        </div>

        <Card className="px-0 py-0 overflow-hidden">
          <div className="px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <h3 className="text-[18px] font-display font-extrabold text-brand-black">Listado de categorías</h3>
              <span className="inline-flex items-center rounded-full bg-brand-beige-light px-3 py-1 text-[12px] font-bold text-neutral-500">
                {filtered.length} categoría{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <Button onClick={() => { setEditTarget(null); setShowModal(true); }} className="rounded-full px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <Plus size={16}/> Nueva categoría
            </Button>
          </div>
          {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-neutral-400">
                <Loader2 size={20} className="animate-spin"/> Cargando...
              </div>
          ) : error ? (
              <div className="flex items-center justify-center py-20 gap-3 text-red-500">
                <AlertCircle size={20}/> {error}
              </div>
          ) : (
              <>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-[#f1ede4]">
                  <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-4 px-8">Nombre</th>
                    <th className="py-4 px-4">Estado</th>
                    <th className="py-4 px-8 text-center w-[168px]">Acciones</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                  {paginatedCategories.map(cat => (
                      <tr key={cat.id} className="text-[13px] hover:bg-neutral-50 transition-colors">
                        <td className="py-5 px-8 font-extrabold text-neutral-900">{cat.storeCategoryName}</td>
                        <td className="py-5 px-4">
                          <Badge variant={cat.active ? 'active' : 'inactive'}>
                            {cat.active ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex items-center justify-center gap-2 min-h-10">
                            <button type="button"
                                    aria-label={`Editar ${cat.storeCategoryName}`}
                                    title="Editar categoría"
                                    onClick={() => { setEditTarget(cat); setShowModal(true); }}
                                    className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:border-brand-camel hover:text-brand-camel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-camel disabled:opacity-50">
                              <Edit2 size={17}/>
                            </button>
                            <button type="button"
                                    aria-label={`${cat.active ? 'Desactivar' : 'Activar'} ${cat.storeCategoryName}`}
                                    title={cat.active ? 'Desactivar categoría' : 'Activar categoría'}
                                    onClick={() => handleToggleStatus(cat)}
                                    disabled={actionLoading === cat.id}
                                    className={`w-10 h-10 inline-flex items-center justify-center rounded-xl border bg-white focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                        cat.active
                                            ? 'border-neutral-200 text-amber-700 hover:border-amber-400 hover:bg-amber-50 focus-visible:ring-amber-500'
                                            : 'border-green-200 text-green-700 hover:border-green-400 hover:bg-green-50 focus-visible:ring-green-500'
                                    }`}>
                              {actionLoading === cat.id
                                  ? <Loader2 size={17} className="animate-spin"/>
                                  : cat.active ? <PauseCircle size={17}/> : <PlayCircle size={17}/>}
                            </button>
                            <button type="button"
                                    aria-label={`Eliminar ${cat.storeCategoryName}`}
                                    title="Eliminar categoría"
                                    onClick={() => handleDelete(cat)}
                                    disabled={actionLoading === cat.id}
                                    className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed">
                              <Trash2 size={17}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  {filtered.length === 0 && (
                      <tr><td colSpan={3} className="py-20 text-center text-neutral-400 italic">
                        {categories.length === 0 ? 'No hay categorías registradas.' : 'No se encontraron categorías.'}
                      </td></tr>
                  )}
                  </tbody>
                </table>
              </div>
              {filtered.length > CATEGORIES_PAGE_SIZE && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100 px-6 py-4">
                    <p className="text-[12px] font-bold text-neutral-400">
                      Mostrando {pageStart + 1}-{pageEnd} de {filtered.length} categorías
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                          className="rounded-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={14} /> Anterior
                      </Button>
                      <span className="min-w-[92px] text-center text-[12px] font-black text-neutral-500">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                          className="rounded-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Siguiente <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
              )}
              </>
          )}
        </Card>

        <AnimatePresence mode="wait">
          {showModal && (
              <CategoryModal category={editTarget} onClose={() => { setShowModal(false); setEditTarget(null); }}
                             onSaved={() => {
                               setShowModal(false); setEditTarget(null);
                               showSuccess(editTarget ? 'Categoría actualizada.' : 'Categoría creada.');
                               loadCategories();
                             }}/>
          )}
        </AnimatePresence>
      </div>
  );
}
