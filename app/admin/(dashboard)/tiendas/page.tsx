'use client';

import { Badge, Button, Card, Input, Select } from '@/domains/admin/components/UI';
import { api, StoreResponse, MerchantResponseDTO, StoreCategoryResponse } from '@/domains/admin/lib/api';
import { Plus, Search, UploadCloud, X, Loader2, AlertCircle, ChevronRight, Edit2, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

// ── Helpers ────────────────────────────────────────────────────────
const STATUS_MAP: Record<string,string> = {
  ACTIVE:'Activa', SUSPENDED:'Suspendida', DEACTIVATED:'Desactivada', INACTIVE:'Inactiva',
};
function mapStatus(s:string) { return STATUS_MAP[s] ?? s; }
function getStatusVariant(s:string) {
  const u = s.toUpperCase();
  if (u==='ACTIVE') return 'active'; if (u==='SUSPENDED') return 'suspended';
  if (u==='INACTIVE') return 'inactive'; return 'neutral';
}
function formatDate(iso:string|null) {
  if (!iso) return '—'; try { return new Date(iso).toLocaleDateString('es-PE'); } catch { return iso; }
}

const PRIMARY_MAP: Record<string,string>   = { ONYX_BLACK:'#000000', DEEP_ZINC:'#1A1A1B', MIDNIGHT:'#0D1120', CHARCOAL:'#333D4F', ESPRESSO:'#1F1C1B' };
const SECONDARY_MAP: Record<string,string> = { OLIVE_DRAB:'#5D634B', SAGE:'#8B9E82', SLATE:'#4A5568', TERRA:'#A97C44', DUSTY_RED:'#A52222' };
const TERTIARY_MAP: Record<string,string>  = { RICH_CAMEL:'#B2956D', RAW_GOLD:'#C59D53', SILVER_MIST:'#9BA9BC', COPPER:'#BC5610', STONE:'#CED1D6' };

const PRIMARY_COLORS   = Object.entries(PRIMARY_MAP).map(([k,v])=>({ id:k, name:k.replace('_',' '), code:v }));
const SECONDARY_COLORS = Object.entries(SECONDARY_MAP).map(([k,v])=>({ id:k, name:k.replace('_',' '), code:v }));
const TERTIARY_COLORS  = Object.entries(TERTIARY_MAP).map(([k,v])=>({ id:k, name:k.replace('_',' '), code:v }));

// ── Selector de comerciante ────────────────────────────────────────
function MerchantSelector({ onSelect, onClose }: {
  onSelect:(m:MerchantResponseDTO)=>void; onClose:()=>void;
}) {
  const [search, setSearch] = useState('');
  const [merchants, setMerchants] = useState<MerchantResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.users.getMerchants().then(setMerchants).finally(()=>setLoading(false)); }, []);
  const filtered = merchants.filter(m =>
      `${m.firstName} ${m.paternalSurname} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
      <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-md z-[200] flex items-center justify-center p-6">
        <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}}
                    className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="p-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[28px] font-display font-extrabold">Asociar comerciante</h3>
                <p className="text-[14px] text-neutral-400">Selecciona el responsable de esta tienda</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X size={24}/></button>
            </div>
            <Input label="Buscar" placeholder="Nombre, apellido o correo..." icon={Search}
                   value={search} onChange={e=>setSearch(e.target.value)} />
            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {loading ? <div className="flex items-center justify-center py-12 gap-2 text-neutral-400"><Loader2 size={18} className="animate-spin"/> Cargando...</div>
                  : filtered.length === 0 ? <div className="py-12 text-center text-neutral-400 italic">No se encontraron comerciantes.</div>
                      : filtered.map(m => (
                          <button key={m.id} onClick={()=>onSelect(m)}
                                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-brand-camel hover:bg-brand-camel/5 transition-all text-left">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">{m.firstName.charAt(0)}</div>
                              <div>
                                <p className="font-extrabold text-neutral-900">{m.firstName} {m.paternalSurname}</p>
                                <p className="text-[12px] text-neutral-400 font-mono">{m.email}</p>
                              </div>
                            </div>
                            <ChevronRight size={18} className="text-neutral-300"/>
                          </button>
                      ))}
            </div>
          </div>
        </motion.div>
      </div>
  );
}

// ── Modal Editar tienda ────────────────────────────────────────────
function EditStoreModal({ store, categories, onClose, onSaved }: {
  store:StoreResponse; categories:StoreCategoryResponse[];
  onClose:()=>void; onSaved:()=>void;
}) {
  const [form, setForm] = useState({
    storeName:    store.storeName,
    slug:         store.slug,
    description:  store.description ?? '',
    categoryId:   store.category?.id as number|undefined,
    primaryColor:   (store.primaryColor  ?? 'ONYX_BLACK') as string,
    secondaryColor: (store.secondaryColor ?? 'OLIVE_DRAB') as string,
    tertiaryColor:  (store.tertiaryColor  ?? 'RICH_CAMEL') as string,
    merchantId:   store.merchant?.id as number|undefined,
  });
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantResponseDTO|null>(
      store.merchant ? { id:store.merchant.id, email:store.merchant.userAccount?.email??'',
        firstName:store.merchant.firstName, paternalSurname:store.merchant.paternalSurname, ruc:store.merchant.ruc } : null
  );
  const [showMerchantPicker, setShowMerchantPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [apiError, setApiError] = useState<string|null>(null);

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.storeName.trim()) e.storeName = 'El nombre es obligatorio.';
    if (!form.categoryId)       e.categoryId = 'La categoría es obligatoria.';
    if (!selectedMerchant)      e.merchant   = 'El comerciante es obligatorio.';
    return e;
  };

  const handleSave = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true); setApiError(null);
    try {
      await api.stores.update(store.id, {
        ...form, merchantId: selectedMerchant?.id,
      });
      onSaved();
    } catch (err:any) { setApiError(err.message); } finally { setSaving(false); }
  };

  const pc = PRIMARY_MAP[form.primaryColor]   ?? '#000';
  const sc = SECONDARY_MAP[form.secondaryColor] ?? '#5D634B';
  const tc = TERTIARY_MAP[form.tertiaryColor]  ?? '#B2956D';

  return (
      <>
        <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}}
                      className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-[28px] font-display font-extrabold">Editar tienda</h4>
                  <p className="text-[14px] text-neutral-400">Modifica los parámetros de {store.storeName}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X size={24}/></button>
              </div>

              {apiError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px]">{apiError}</div>}

              <div className="space-y-6">
                {/* Nombre y slug */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input label="Nombre de la tienda *" value={form.storeName} error={errors.storeName}
                           onChange={e=>setForm({...form,storeName:e.target.value})} />
                  </div>
                  <div>
                    <Input label="Slug" value={form.slug}
                           onChange={e=>setForm({...form,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} />
                  </div>
                </div>

                {/* Categoría — OBLIGATORIA */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">
                    Categoría *
                  </label>
                  <select
                      value={form.categoryId ?? ''}
                      onChange={e => { setForm({...form,categoryId:Number(e.target.value)||undefined}); setErrors(p=>({...p,categoryId:''})); }}
                      className={`w-full px-5 py-3.5 bg-white border ${errors.categoryId?'border-red-400':'border-neutral-200'} rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors`}>
                    <option value="">Seleccionar categoría...</option>
                    {categories.filter(c=>c.active).map(c=>(
                        <option key={c.id} value={c.id}>{c.storeCategoryName}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-[12px] text-red-500 font-bold mt-1 ml-1">{errors.categoryId}</p>}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Descripción</label>
                  <textarea className="w-full h-20 px-5 py-4 bg-white border border-neutral-200 rounded-2xl text-[14px] outline-none focus:border-brand-camel resize-none"
                            value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
                </div>

                {/* Colores */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-3 ml-1 uppercase">Colores</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2">Principal</p>
                      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                        {PRIMARY_COLORS.map(c=>(
                            <button key={c.id} onClick={()=>setForm({...form,primaryColor:c.id})}
                                    className={`w-full flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${form.primaryColor===c.id?'border-brand-black':'border-neutral-100 hover:border-neutral-200'}`}>
                              <div className="w-6 h-6 rounded-full shrink-0" style={{backgroundColor:c.code}}/>
                              <span className="text-[10px] font-bold uppercase truncate">{c.name}</span>
                              {form.primaryColor===c.id && <Check size={12} className="ml-auto shrink-0"/>}
                            </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2">Secundario</p>
                      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                        {SECONDARY_COLORS.map(c=>(
                            <button key={c.id} onClick={()=>setForm({...form,secondaryColor:c.id})}
                                    className={`w-full flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${form.secondaryColor===c.id?'border-brand-black':'border-neutral-100 hover:border-neutral-200'}`}>
                              <div className="w-6 h-6 rounded-full shrink-0" style={{backgroundColor:c.code}}/>
                              <span className="text-[10px] font-bold uppercase truncate">{c.name}</span>
                              {form.secondaryColor===c.id && <Check size={12} className="ml-auto shrink-0"/>}
                            </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2">Terciario</p>
                      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                        {TERTIARY_COLORS.map(c=>(
                            <button key={c.id} onClick={()=>setForm({...form,tertiaryColor:c.id})}
                                    className={`w-full flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${form.tertiaryColor===c.id?'border-brand-black':'border-neutral-100 hover:border-neutral-200'}`}>
                              <div className="w-6 h-6 rounded-full shrink-0" style={{backgroundColor:c.code}}/>
                              <span className="text-[10px] font-bold uppercase truncate">{c.name}</span>
                              {form.tertiaryColor===c.id && <Check size={12} className="ml-auto shrink-0"/>}
                            </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="mt-4 p-4 bg-neutral-50 rounded-2xl flex items-center gap-4">
                    <div className="flex items-center">
                      <div className="w-10 h-12 rounded-xl shadow-md" style={{backgroundColor:pc}}/>
                      <div className="w-9 h-10 rounded-xl shadow-md -ml-2 z-10" style={{backgroundColor:sc}}/>
                      <div className="w-9 h-10 rounded-xl shadow-md -ml-4 z-20" style={{backgroundColor:tc}}/>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-400">{pc} · {sc} · {tc}</p>
                  </div>
                </div>

                {/* Comerciante — OBLIGATORIO */}
                <div className="bg-brand-beige-light p-5 rounded-2xl">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase mb-3">Comerciante asociado *</p>
                  <div className="flex items-center justify-between">
                    {selectedMerchant ? (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-brand-camel text-white rounded-full flex items-center justify-center font-bold">{selectedMerchant.firstName.charAt(0)}</div>
                          <div>
                            <p className="font-bold text-neutral-900 text-[13px]">{selectedMerchant.firstName} {selectedMerchant.paternalSurname}</p>
                            <p className="text-[11px] text-neutral-400">{selectedMerchant.email}</p>
                          </div>
                        </div>
                    ) : <p className="text-[13px] text-neutral-400 italic">Sin comerciante</p>}
                    <Button variant="secondary" className="rounded-full px-4 text-[12px]" onClick={()=>setShowMerchantPicker(true)}>
                      {selectedMerchant ? 'Cambiar' : 'Asociar'}
                    </Button>
                  </div>
                  {errors.merchant && <p className="text-[12px] text-red-500 font-bold mt-2">{errors.merchant}</p>}
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-neutral-100">
                <Button variant="secondary" className="flex-1 rounded-2xl h-12" onClick={onClose}>Cancelar</Button>
                <Button className="flex-1 rounded-2xl h-12" onClick={handleSave} disabled={saving}>
                  {saving ? <><Loader2 size={14} className="animate-spin mr-2"/>Guardando...</> : 'Guardar cambios'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        {showMerchantPicker && (
            <MerchantSelector onSelect={m=>{setSelectedMerchant(m);setShowMerchantPicker(false);}} onClose={()=>setShowMerchantPicker(false)}/>
        )}
      </>
  );
}

// ── Página principal ───────────────────────────────────────────────
export default function TiendasPage() {
  const router = useRouter();
  const [stores,        setStores]        = useState<StoreResponse[]>([]);
  const [categories,    setCategories]    = useState<StoreCategoryResponse[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string|null>(null);
  const [showDetail,    setShowDetail]    = useState<StoreResponse|null>(null);
  const [showEdit,      setShowEdit]      = useState<StoreResponse|null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filtros
  const [searchTerm,   setSearchTerm]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCat,    setFilterCat]    = useState('');
  const [sortOrder,    setSortOrder]    = useState('Más reciente');

  const loadStores = useCallback(async () => {
    try { setLoading(true); setError(null);
      const data = await api.stores.getAll({ search:searchTerm||undefined, status:filterStatus||undefined });
      setStores(data);
    } catch (e:any) { setError(e.message); } finally { setLoading(false); }
  }, [searchTerm, filterStatus]);

  useEffect(() => { loadStores(); }, [loadStores]);

  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(()=>setCategories([]));
  }, []);

  // Filtro de categoría en cliente (ya tenemos los datos)
  const sorted = [...stores]
      .filter(s => !filterCat || s.category?.id === Number(filterCat))
      .sort((a,b) => {
        if (sortOrder==='A-Z') return a.storeName.localeCompare(b.storeName);
        if (sortOrder==='Z-A') return b.storeName.localeCompare(a.storeName);
        if (sortOrder==='Más antiguo') return (a.createdAt??'').localeCompare(b.createdAt??'');
        return (b.createdAt??'').localeCompare(a.createdAt??'');
      });

  const handleAction = async (action:'suspend'|'reactivate'|'deactivate', s:StoreResponse) => {
    const labels = { suspend:'¿Suspender', reactivate:'¿Reactivar', deactivate:'¿Desactivar' };
    if (!window.confirm(`${labels[action]} "${s.storeName}"?`)) return;
    setActionLoading(true);
    try {
      if (action==='suspend')    await api.stores.suspend(s.id);
      if (action==='reactivate') await api.stores.reactivate(s.id);
      if (action==='deactivate') await api.stores.deactivate(s.id);
      setShowDetail(null); await loadStores();
    } catch (e:any) { alert(e.message); } finally { setActionLoading(false); }
  };

  return (
      <div className="space-y-8 relative max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-[28px] font-display font-extrabold tracking-tight">Directorio de tiendas</h2>
            <p className="text-[14px] font-medium text-neutral-400">Gestión de activos y configuración de marca</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="secondary" className="flex-1 md:flex-none rounded-full shadow-sm px-6"
                    onClick={()=>router.push('/admin/carga-masiva')}>
              <UploadCloud size={14} className="mr-2"/> Carga masiva
            </Button>
            <Button onClick={()=>router.push('/admin/tiendas/nueva')} className="flex-1 md:flex-none rounded-full px-6">
              <Plus size={14} className="mr-2"/> Nueva tienda
            </Button>
          </div>
        </div>

        {/* Filtros en tiempo real */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <Input label="Buscar tienda" placeholder="Nombre o slug" icon={Search}
                 value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Categoría</label>
            <select value={filterCat} onChange={e=>setFilterCat(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white border border-neutral-200 rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors">
              <option value="">Todas</option>
              {categories.map(c=><option key={c.id} value={c.id}>{c.storeCategoryName}</option>)}
            </select>
          </div>
          <Select label="Estado" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="ACTIVE">Activa</option>
            <option value="SUSPENDED">Suspendida</option>
            <option value="INACTIVE">Desactivada</option>
          </Select>
          <Select label="Orden" value={sortOrder} onChange={e=>setSortOrder(e.target.value)}>
            <option>Más reciente</option><option>Más antiguo</option>
            <option>A-Z</option><option>Z-A</option>
          </Select>
        </div>

        {/* Tabla */}
        <Card className="px-0 py-2 overflow-hidden">
          {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-neutral-400">
                <Loader2 size={20} className="animate-spin"/> Cargando tiendas...
              </div>
          ) : error ? (
              <div className="flex items-center justify-center py-20 gap-3 text-red-500">
                <AlertCircle size={20}/> {error}
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead className="bg-[#f1ede4]">
                  <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-4 px-8">Nombre</th>
                    <th className="py-4 px-4">Categoría</th>
                    <th className="py-4 px-4">Comerciante</th>
                    <th className="py-4 px-4">Estado</th>
                    <th className="py-4 px-8 text-right">Registro</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                  {sorted.map(s=>(
                      <tr key={s.id} className="text-[13px] hover:bg-neutral-50 cursor-pointer transition-colors"
                          onClick={()=>setShowDetail(s)}>
                        <td className="py-5 px-8 font-extrabold text-neutral-900">{s.storeName}</td>
                        <td className="py-5 px-4 font-medium text-neutral-600">
                          {s.category?.storeCategoryName ?? <span className="text-neutral-300 italic">Sin categoría</span>}
                        </td>
                        <td className="py-5 px-4 font-mono text-[12px] text-neutral-500">
                          {s.merchant?.userAccount?.email ?? '—'}
                        </td>
                        <td className="py-5 px-4">
                          <Badge variant={getStatusVariant(s.storeStatus) as any}>{mapStatus(s.storeStatus)}</Badge>
                        </td>
                        <td className="py-5 px-8 text-right font-medium text-neutral-500">{formatDate(s.createdAt)}</td>
                      </tr>
                  ))}
                  {sorted.length === 0 && (
                      <tr><td colSpan={5} className="py-20 text-center text-neutral-400 italic">No se encontraron tiendas.</td></tr>
                  )}
                  </tbody>
                </table>
              </div>
          )}
        </Card>

        {/* Modal Detalle */}
        <AnimatePresence>
          {showDetail && !showEdit && (
              <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}}
                            className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden">
                  <div className="p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h4 className="text-[28px] font-display font-extrabold">Detalle de tienda</h4>
                        <p className="text-[14px] text-neutral-400">ID: {showDetail.id} · {showDetail.slug}</p>
                      </div>
                      <button onClick={()=>setShowDetail(null)} className="p-2 hover:bg-neutral-100 rounded-full"><X size={24}/></button>
                    </div>
                    <div className="space-y-5 mb-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Nombre</p>
                          <p className="font-extrabold text-neutral-900">{showDetail.storeName}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Estado</p>
                          <Badge variant={getStatusVariant(showDetail.storeStatus) as any}>{mapStatus(showDetail.storeStatus)}</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Categoría</p>
                        <p className="font-bold text-neutral-700">{showDetail.category?.storeCategoryName ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Comerciante</p>
                        <p className="font-bold text-neutral-700">{showDetail.merchant?.userAccount?.email ?? 'Sin asignar'}</p>
                      </div>
                      {showDetail.description && (
                          <div>
                            <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Descripción</p>
                            <p className="text-[14px] text-neutral-500">{showDetail.description}</p>
                          </div>
                      )}
                      {/* Preview colores */}
                      {(showDetail.primaryColor || showDetail.secondaryColor) && (
                          <div>
                            <p className="text-[11px] font-bold text-neutral-400 uppercase mb-2">Paleta</p>
                            <div className="flex items-center gap-2">
                              {[PRIMARY_MAP[showDetail.primaryColor??''], SECONDARY_MAP[showDetail.secondaryColor??''], TERTIARY_MAP[showDetail.tertiaryColor??'']].filter(Boolean).map((c,i)=>(
                                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white shadow" style={{backgroundColor:c}}/>
                              ))}
                            </div>
                          </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        {showDetail.storeStatus==='ACTIVE' && (
                            <Button className="flex-1 rounded-2xl h-14 bg-brand-camel hover:bg-brand-camel-dark"
                                    onClick={()=>handleAction('suspend',showDetail)} disabled={actionLoading}>
                              {actionLoading?<Loader2 size={16} className="animate-spin"/>:'Suspender'}
                            </Button>
                        )}
                        {showDetail.storeStatus==='SUSPENDED' && (
                            <Button className="flex-1 rounded-2xl h-14"
                                    onClick={()=>handleAction('reactivate',showDetail)} disabled={actionLoading}>
                              {actionLoading?<Loader2 size={16} className="animate-spin"/>:'Reactivar'}
                            </Button>
                        )}
                        <Button variant="secondary" className="flex-1 rounded-2xl h-14" onClick={()=>setShowEdit(showDetail)}>
                          <Edit2 size={16} className="mr-2"/> Editar
                        </Button>
                      </div>
                      {showDetail.storeStatus!=='INACTIVE' && (
                          <Button variant="secondary" className="w-full rounded-2xl h-12 text-red-500 border-red-100 hover:bg-red-50"
                                  onClick={()=>handleAction('deactivate',showDetail)} disabled={actionLoading}>
                            Deshabilitar tienda
                          </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>

        {/* Modal Editar */}
        <AnimatePresence>
          {showEdit && (
              <EditStoreModal
                  store={showEdit} categories={categories}
                  onClose={()=>setShowEdit(null)}
                  onSaved={()=>{ setShowEdit(null); setShowDetail(null); loadStores(); }}
              />
          )}
        </AnimatePresence>
      </div>
  );
}
