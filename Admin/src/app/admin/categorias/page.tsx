'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Badge, Button, Card, Input } from '@/components/UI';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Search, Edit2, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Category { id: number; storeCategoryName: string; active: boolean; }

const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

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
              <Button className="flex-1 rounded-2xl h-14" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 size={16} className="animate-spin mr-2"/>Guardando...</> : isEdit ? 'Guardar cambios' : 'Crear categoría'}
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

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const data = await api.categories.getAll({ search: searchTerm || undefined });
      setCategories(data);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, [searchTerm]);

  useEffect(() => { loadCategories(); }, [loadCategories]);

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
    } catch (e: any) { alert(e.message); } finally { setActionLoading(null); }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`¿Eliminar "${cat.storeCategoryName}"?`)) return;
    setActionLoading(cat.id);
    try {
      await api.categories.delete(cat.id);
      showSuccess(`"${cat.storeCategoryName}" eliminada.`);
      await loadCategories();
    } catch (e: any) { alert(e.message); } finally { setActionLoading(null); }
  };

  const filtered = categories.filter(c => {
    if (filterStatus === 'active')   return c.active;
    if (filterStatus === 'inactive') return !c.active;
    return true;
  });

  return (
      <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">Categorías</h2>
            <p className="text-[14px] font-medium text-neutral-400">Maestro global de categorías de tiendas</p>
          </div>
          <Button onClick={() => { setEditTarget(null); setShowModal(true); }} className="rounded-full px-6 h-12">
            <Plus size={16} className="mr-2"/> Nueva categoría
          </Button>
        </div>

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

        <Card className="px-0 py-2 overflow-hidden">
          <div className="px-8 py-4 mb-2 flex items-center justify-between">
            <h3 className="text-[18px] font-display font-extrabold text-brand-black">Listado de categorías</h3>
            <span className="text-[12px] font-bold text-neutral-400">{filtered.length} categoría{filtered.length !== 1 ? 's' : ''}</span>
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
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-[#f1ede4]">
                  <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-4 px-8">Nombre</th>
                    <th className="py-4 px-4">Estado</th>
                    <th className="py-4 px-8 text-right">Acciones</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                  {filtered.map(cat => (
                      <tr key={cat.id} className="text-[13px] hover:bg-neutral-50 transition-colors">
                        <td className="py-5 px-8 font-extrabold text-neutral-900">{cat.storeCategoryName}</td>
                        <td className="py-5 px-4">
                          <Badge variant={cat.active ? 'active' : 'inactive'}>
                            {cat.active ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </td>
                        <td className="py-5 px-8">
                          {/* Fila de acciones alineada a la derecha con todos los items en una línea */}
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { setEditTarget(cat); setShowModal(true); }}
                                    className="p-2 hover:bg-brand-camel/10 rounded-lg transition-colors text-brand-camel"
                                    title="Editar">
                              <Edit2 size={15}/>
                            </button>
                            <button onClick={() => handleToggleStatus(cat)}
                                    disabled={actionLoading === cat.id}
                                    className="px-3 py-1.5 text-[11px] font-bold hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500 disabled:opacity-50 whitespace-nowrap">
                              {actionLoading === cat.id
                                  ? <Loader2 size={14} className="animate-spin"/>
                                  : cat.active ? 'Desactivar' : 'Activar'}
                            </button>
                            <button onClick={() => handleDelete(cat)}
                                    disabled={actionLoading === cat.id}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 disabled:opacity-50"
                                    title="Eliminar">
                              <X size={15}/>
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
