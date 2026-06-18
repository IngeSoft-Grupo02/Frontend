'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, MerchantResponseDTO, StoreCategoryResponse } from '@/domains/admin/lib/api';
import { ArrowLeft, Loader2, AlertCircle, X, Search, ChevronRight, Check } from 'lucide-react';
import { Button, Input, Card } from '@/domains/admin/components/UI';
import { motion } from 'motion/react';

const PRIMARY_COLORS = [
  { id:'ONYX_BLACK', name:'ONYX BLACK', code:'#000000' },
  { id:'DEEP_ZINC',  name:'DEEP ZINC',  code:'#1A1A1B' },
  { id:'MIDNIGHT',   name:'MIDNIGHT',   code:'#0D1120' },
  { id:'CHARCOAL',   name:'CHARCOAL',   code:'#333D4F' },
  { id:'ESPRESSO',   name:'ESPRESSO',   code:'#1F1C1B' },
];
const SECONDARY_COLORS = [
  { id:'OLIVE_DRAB', name:'OLIVE DRAB', code:'#5D634B' },
  { id:'SAGE',       name:'SAGE',       code:'#8B9E82' },
  { id:'SLATE',      name:'SLATE',      code:'#4A5568' },
  { id:'TERRA',      name:'TERRA',      code:'#A97C44' },
  { id:'DUSTY_RED',  name:'DUSTY RED',  code:'#A52222' },
];
const TERTIARY_COLORS = [
  { id:'RICH_CAMEL',  name:'RICH CAMEL',  code:'#B2956D' },
  { id:'RAW_GOLD',    name:'RAW GOLD',    code:'#C59D53' },
  { id:'SILVER_MIST', name:'SILVER MIST', code:'#9BA9BC' },
  { id:'COPPER',      name:'COPPER',      code:'#BC5610' },
  { id:'STONE',       name:'STONE',       code:'#CED1D6' },
];

export default function EditarTiendaPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = Number(params.id);

  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [globalError,   setGlobalError]   = useState<string|null>(null);
  const [categories,    setCategories]    = useState<StoreCategoryResponse[]>([]);
  const [merchants,     setMerchants]     = useState<MerchantResponseDTO[]>([]);
  const [merchantSearch, setMerchantSearch] = useState('');
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [loadingMerchants,  setLoadingMerchants]  = useState(false);
  const [selectedMerchant,  setSelectedMerchant]  = useState<MerchantResponseDTO|null>(null);

  const [form, setForm] = useState({
    storeName:     '',
    slug:          '',
    description:   '',
    categoryId:    '' as string,
    primaryColor:  'ONYX_BLACK',
    secondaryColor:'OLIVE_DRAB',
    tertiaryColor: 'RICH_CAMEL',
  });
  const [errors, setErrors] = useState<Record<string,string>>({});

  // Cargar datos de la tienda
  useEffect(() => {
    Promise.all([
      api.stores.getById(storeId),
      api.categories.getAll(),
    ]).then(([store, cats]) => {
      setForm({
        storeName:      store.storeName,
        slug:           store.slug,
        description:    store.description ?? '',
        categoryId:     store.category?.id?.toString() ?? '',
        primaryColor:   store.primaryColor  ?? 'ONYX_BLACK',
        secondaryColor: store.secondaryColor ?? 'OLIVE_DRAB',
        tertiaryColor:  store.tertiaryColor  ?? 'RICH_CAMEL',
      });
      if (store.merchant) {
        setSelectedMerchant({
          id:             store.merchant.id,
          email:          store.merchant.userAccount?.email ?? '',
          firstName:      store.merchant.firstName,
          paternalSurname:store.merchant.paternalSurname,
          ruc:            store.merchant.ruc,
        });
      }
      setCategories(cats.filter(c => c.active));
    }).catch(e => setGlobalError(e.message))
        .finally(() => setLoading(false));
  }, [storeId]);

  const openMerchantModal = () => {
    setLoadingMerchants(true);
    api.users.getMerchants().then(setMerchants).finally(() => setLoadingMerchants(false));
    setShowMerchantModal(true);
  };

  const filteredMerchants = merchants.filter(m =>
      `${m.firstName} ${m.paternalSurname} ${m.email}`.toLowerCase().includes(merchantSearch.toLowerCase())
  );

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.storeName.trim())    e.storeName  = 'El nombre es obligatorio.';
    if (form.storeName.length>100) e.storeName  = 'Máximo 100 caracteres.';
    if (!form.slug.trim())         e.slug       = 'El slug es obligatorio.';
    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Solo minúsculas, números y guiones.';
    if (!form.categoryId)          e.categoryId = 'La categoría es obligatoria.';
    if (!selectedMerchant)         e.merchant   = 'El comerciante es obligatorio.';
    return e;
  };

  // El botón guardar solo se habilita cuando el formulario es válido
  const isFormReady = () =>
      form.storeName.trim() !== '' &&
      form.slug.trim() !== '' &&
      form.categoryId !== '' &&
      selectedMerchant !== null;

  const handleSave = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true); setGlobalError(null);
    try {
      await api.stores.update(storeId, {
        storeName:     form.storeName.trim(),
        slug:          form.slug.trim(),
        description:   form.description.trim() || undefined,
        categoryId:    Number(form.categoryId),
        primaryColor:  form.primaryColor,
        secondaryColor:form.secondaryColor,
        tertiaryColor: form.tertiaryColor,
        merchantId:    selectedMerchant!.id,
      });
      router.push('/admin/tiendas');
    } catch (err:any) { setGlobalError(err.message); } finally { setSaving(false); }
  };

  const pc = PRIMARY_COLORS.find(c=>c.id===form.primaryColor)?.code   ?? '#000';
  const sc = SECONDARY_COLORS.find(c=>c.id===form.secondaryColor)?.code ?? '#5D634B';
  const tc = TERTIARY_COLORS.find(c=>c.id===form.tertiaryColor)?.code  ?? '#B2956D';

  if (loading) return (
      <div className="flex items-center justify-center h-[60vh] gap-3 text-neutral-400">
        <Loader2 size={24} className="animate-spin"/> Cargando tienda...
      </div>
  );

  return (
      <div className="space-y-12 animate-in slide-in-from-right duration-500 max-w-[1400px] mx-auto">
        <div>
          <button onClick={() => router.push('/admin/tiendas')}
                  className="flex items-center gap-2 text-brand-camel font-bold text-[14px] mb-4 hover:underline">
            <ArrowLeft size={16}/> Volver al listado
          </button>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Editar tienda</h2>
          <p className="text-[14px] font-medium text-neutral-400">Modifica los parámetros de la tienda</p>
        </div>

        {globalError && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle size={18} className="text-red-600 shrink-0"/>
              <p className="text-[14px] text-red-800 font-medium">{globalError}</p>
            </div>
        )}

        <Card className="p-10 space-y-10">
          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Nombre de la tienda *" placeholder="Canvas Lab" value={form.storeName}
                   error={errors.storeName}
                   onChange={e => { setForm({...form,storeName:e.target.value}); setErrors(p=>({...p,storeName:''})); }}/>
            <Input label="Slug único *" placeholder="canvas-lab" value={form.slug}
                   error={errors.slug}
                   onChange={e => { setForm({...form,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')}); setErrors(p=>({...p,slug:''})); }}/>

            {/* Categoría */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Categoría *</label>
              <select value={form.categoryId}
                      onChange={e => { setForm({...form,categoryId:e.target.value}); setErrors(p=>({...p,categoryId:''})); }}
                      className={`w-full px-5 py-3.5 bg-white border ${errors.categoryId?'border-red-400':'border-neutral-200'} rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors`}>
                <option value="">Seleccionar categoría...</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.storeCategoryName}</option>)}
              </select>
              {errors.categoryId && <p className="text-[12px] text-red-500 font-bold mt-1 ml-1">{errors.categoryId}</p>}
            </div>

            <div className="md:col-span-1">
              <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Observaciones</label>
              <textarea className="w-full h-[110px] px-6 py-4 bg-white border border-neutral-200 rounded-[32px] text-[14px] outline-none focus:border-brand-camel resize-none"
                        placeholder="Observaciones..." value={form.description}
                        onChange={e => setForm({...form,description:e.target.value})}/>
            </div>
          </div>

          {/* Comerciante */}
          <div className="bg-brand-beige-light p-8 rounded-[32px] border border-neutral-100">
            <h4 className="text-[11px] font-bold text-neutral-500 mb-6 uppercase ml-1 tracking-widest">Comerciante asociado (Obligatorio)</h4>
            <div className="flex items-center justify-between">
              {selectedMerchant ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-camel text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {selectedMerchant.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[16px] font-extrabold text-neutral-900">{selectedMerchant.firstName} {selectedMerchant.paternalSurname}</p>
                      <p className="text-[12px] font-medium text-neutral-400">{selectedMerchant.email}</p>
                    </div>
                  </div>
              ) : <p className="text-[14px] font-medium text-neutral-400 italic">Ningún comerciante seleccionado</p>}
              <Button variant="secondary" className="rounded-full px-6" onClick={openMerchantModal}>
                {selectedMerchant ? 'Cambiar comerciante' : 'Asociar comerciante'}
              </Button>
            </div>
            {errors.merchant && (
                <p className="text-[12px] text-red-500 font-bold mt-4 flex items-center gap-1">
                  <AlertCircle size={12}/> {errors.merchant}
                </p>
            )}
          </div>

          {/* Colores */}
          <div>
            <h4 className="text-[11px] font-bold text-neutral-500 mb-2 uppercase ml-1 tracking-widest">Configuración de marca</h4>
            <p className="text-[14px] font-medium text-neutral-400 mb-8 ml-1">Personaliza la identidad visual seleccionando entre nuestras opciones.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10">
              {[
                { label:'Color Principal', desc:'Botones y títulos', colors:PRIMARY_COLORS, field:'primaryColor' as const },
                { label:'Color Secundario', desc:'Acentos y soporte', colors:SECONDARY_COLORS, field:'secondaryColor' as const },
                { label:'Color Terciario', desc:'Detalles y realce', colors:TERTIARY_COLORS, field:'tertiaryColor' as const },
              ].map(group => (
                  <div key={group.field} className="space-y-4">
                    <h5 className="text-[13px] font-extrabold text-neutral-900 uppercase tracking-wide">{group.label}</h5>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{group.desc}</p>
                    <div className="space-y-3">
                      {group.colors.map(c => (
                          <button key={c.id} onClick={() => setForm({...form,[group.field]:c.id})}
                                  className={`w-full flex items-center justify-between p-3 rounded-[20px] border-2 transition-all ${form[group.field]===c.id?'border-brand-black bg-white shadow-md':'border-neutral-100 hover:border-neutral-200'}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full shadow-inner border border-neutral-100" style={{backgroundColor:c.code}}/>
                              <span className="text-[12px] font-extrabold text-neutral-900 tracking-wider uppercase">{c.name}</span>
                            </div>
                            {form[group.field]===c.id && <Check size={16} className="text-brand-black"/>}
                          </button>
                      ))}
                    </div>
                  </div>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-16 pt-16 border-t border-neutral-100 flex flex-col items-center">
              <h5 className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] mb-10">Resultado de tu combinación</h5>
              <div className="bg-neutral-50/50 p-10 rounded-[40px] border border-neutral-100 shadow-sm flex items-center gap-12">
                <div className="flex items-center">
                  <div className="w-20 h-24 rounded-[24px] shadow-xl border-4 border-white" style={{backgroundColor:pc}}/>
                  <div className="w-16 h-20 rounded-[20px] shadow-lg border-4 border-white -ml-4 z-10" style={{backgroundColor:sc}}/>
                  <div className="w-16 h-20 rounded-[20px] shadow-lg border-4 border-white -ml-8 z-20" style={{backgroundColor:tc}}/>
                </div>
                <div>
                  <h6 className="text-[18px] font-display font-extrabold tracking-tight mb-2 uppercase">Paleta personalizada</h6>
                  <div className="flex gap-3 text-[10px] font-mono font-bold text-neutral-400 uppercase">
                    <span>{pc}</span><span>{sc}</span><span>{tc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-10">
            <Button variant="secondary" className="rounded-full px-10" onClick={() => router.push('/admin/tiendas')}>Cancelar</Button>
            <Button className={`rounded-full px-10 transition-opacity ${!isFormReady() ? 'opacity-40 cursor-not-allowed' : ''}`}
                    onClick={handleSave} disabled={saving || !isFormReady()}>
              {saving ? <><Loader2 size={16} className="animate-spin mr-2"/>Guardando...</> : 'Guardar cambios'}
            </Button>
          </div>
        </Card>

        {/* Modal comerciante */}
        {showMerchantModal && (
            <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
              <motion.div initial={{opacity:0,scale:0.97,y:10}} animate={{opacity:1,scale:1,y:0}}
                          transition={{duration:0.15}}
                          className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-[28px] font-display font-extrabold tracking-tight">Asociar comerciante</h3>
                      <p className="text-[14px] font-medium text-neutral-400">Selecciona el responsable de esta tienda</p>
                    </div>
                    <button onClick={() => setShowMerchantModal(false)} className="p-2 hover:bg-neutral-100 rounded-full"><X size={24}/></button>
                  </div>
                  <div className="relative mb-4">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                    <input placeholder="Nombre, apellido o correo..." value={merchantSearch}
                           onChange={e => setMerchantSearch(e.target.value)}
                           className="w-full pl-10 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel"/>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2">
                    {loadingMerchants ? (
                        <div className="flex items-center justify-center py-12 gap-2 text-neutral-400"><Loader2 size={18} className="animate-spin"/> Cargando...</div>
                    ) : filteredMerchants.map(m=>(
                        <button key={m.id}
                                onClick={() => { setSelectedMerchant(m); setShowMerchantModal(false); setErrors(p=>({...p,merchant:''})); }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-brand-camel hover:bg-brand-camel/5 transition-all text-left">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">{m.firstName.charAt(0)}</div>
                            <div>
                              <p className="font-extrabold text-neutral-900">{m.firstName} {m.paternalSurname}</p>
                              <p className="text-[12px] text-neutral-400">{m.email}</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-neutral-300"/>
                        </button>
                    ))}
                    {!loadingMerchants && filteredMerchants.length===0 && (
                        <div className="py-20 text-center text-neutral-400 italic">No se encontraron comerciantes.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
        )}
      </div>
  );
}
