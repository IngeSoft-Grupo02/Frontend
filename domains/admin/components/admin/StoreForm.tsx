'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Check, ChevronRight, Loader2, Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Button, Card, Input } from '@/domains/admin/components/UI';
import { api, MerchantResponseDTO, StoreCategoryResponse } from '@/domains/admin/lib/api';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';
import { getColorLabel } from '@/domains/shared/colors';
import { messageFromError } from '@/domains/shared/errors';

type ColorOption = { id: string; name: string; code: string };

export const PRIMARY_COLORS: ColorOption[] = [
  { id: 'ONYX_BLACK', name: 'ONYX BLACK', code: '#0F1011' },
  { id: 'MIDNIGHT', name: 'MIDNIGHT', code: '#1A2332' },
  { id: 'CHARCOAL', name: 'CHARCOAL', code: '#36454F' },
  { id: 'ESPRESSO', name: 'ESPRESSO', code: '#4B3621' },
  { id: 'ALABASTER', name: 'ALABASTER', code: '#F9FAFB' },
  { id: 'WARM_CREAM', name: 'WARM CREAM', code: '#FDFBF7' },
];

export const SECONDARY_COLORS: ColorOption[] = [
  { id: 'SLATE', name: 'SLATE', code: '#475569' },
  { id: 'SAGE', name: 'SAGE', code: '#8A9A86' },
  { id: 'TERRA', name: 'TERRA', code: '#E2725B' },
  { id: 'DUSTY_RED', name: 'DUSTY RED', code: '#B25C5C' },
  { id: 'GHOST_WHITE', name: 'GHOST WHITE', code: '#FFFFFF' },
  { id: 'SOFT_TAUPE', name: 'SOFT TAUPE', code: '#D5CEC4' },
  { id: 'BLUSH_PINK', name: 'BLUSH PINK', code: '#F4C2C2' },
  { id: 'FROSTED_BLUE', name: 'FROSTED BLUE', code: '#B0E0E6' },
];

export const TERTIARY_COLORS: ColorOption[] = [
  { id: 'RAW_GOLD', name: 'RAW GOLD', code: '#D4AF37' },
  { id: 'COPPER', name: 'COPPER', code: '#B87333' },
  { id: 'COBALT_BLUE', name: 'COBALT BLUE', code: '#2563EB' },
  { id: 'CORAL_PUNCH', name: 'CORAL PUNCH', code: '#FF5A5F' },
  { id: 'EMERALD', name: 'EMERALD', code: '#10B981' },
  { id: 'SUNFLOWER', name: 'SUNFLOWER', code: '#FFC107' },
  { id: 'HOT_MAGENTA', name: 'HOT MAGENTA', code: '#FF00FF' },
  { id: 'VIOLET_POP', name: 'VIOLET POP', code: '#8B5CF6' },
];

export interface StoreFormValues {
  storeName: string;
  slug: string;
  description: string;
  categoryId: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

export const EMPTY_STORE_FORM: StoreFormValues = {
  storeName: '',
  slug: '',
  description: '',
  categoryId: '',
  primaryColor: 'ONYX_BLACK',
  secondaryColor: 'SLATE',
  tertiaryColor: 'RAW_GOLD',
};

interface StoreFormProps {
  mode: 'create' | 'edit';
  initialValues?: StoreFormValues;
  initialMerchant?: MerchantResponseDTO | null;
  onSubmit: (values: StoreFormValues, merchant: MerchantResponseDTO) => Promise<void>;
}

export function StoreForm({ mode, initialValues, initialMerchant = null, onSubmit }: StoreFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<StoreFormValues>(() => ({ ...(initialValues ?? EMPTY_STORE_FORM) }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantResponseDTO | null>(initialMerchant);
  const [categories, setCategories] = useState<StoreCategoryResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [merchants, setMerchants] = useState<MerchantResponseDTO[]>([]);
  const [merchantSearch, setMerchantSearch] = useState('');
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setCategoriesLoading(true);
    api.categories.getAll()
      .then(data => {
        if (active) {
          setCategories(data.filter(category =>
            category.active || (mode === 'edit' && String(category.id) === initialValues?.categoryId)
          ));
        }
      })
      .catch(error => {
        if (active) setCategoriesError(messageFromError(error, 'No se pudieron cargar las categorías.'));
      })
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });
    return () => { active = false; };
  }, [initialValues?.categoryId, mode]);

  const openMerchantModal = () => {
    setLoadingMerchants(true);
    setShowMerchantModal(true);
    api.users.getMerchants()
      .then(setMerchants)
      .catch(error => setSubmitError(messageFromError(error, 'No se pudieron cargar los comerciantes.')))
      .finally(() => setLoadingMerchants(false));
  };

  const filteredMerchants = useMemo(() => {
    const search = merchantSearch.toLowerCase();
    return merchants.filter(merchant =>
      `${merchant.firstName} ${merchant.paternalSurname} ${merchant.email}`.toLowerCase().includes(search)
    );
  }, [merchantSearch, merchants]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.storeName.trim()) nextErrors.storeName = 'El nombre es obligatorio.';
    if (form.storeName.length > 100) nextErrors.storeName = 'Máximo 100 caracteres.';
    if (!form.slug.trim()) nextErrors.slug = 'El slug es obligatorio.';
    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) nextErrors.slug = 'Solo minúsculas, números y guiones.';
    if (!form.categoryId) nextErrors.categoryId = 'La categoría es obligatoria.';
    if (!selectedMerchant) nextErrors.merchant = 'El comerciante es obligatorio.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !selectedMerchant) return;
    setSaving(true);
    setSubmitError(null);
    try {
      await onSubmit(form, selectedMerchant);
    } catch (error) {
      setSubmitError(messageFromError(error, 'No se pudo guardar la tienda.'));
    } finally {
      setSaving(false);
    }
  };

  const primaryHex = PRIMARY_COLORS.find(color => color.id === form.primaryColor)?.code ?? '#0F1011';
  const secondaryHex = SECONDARY_COLORS.find(color => color.id === form.secondaryColor)?.code ?? '#475569';
  const tertiaryHex = TERTIARY_COLORS.find(color => color.id === form.tertiaryColor)?.code ?? '#D4AF37';
  const title = mode === 'create' ? 'Crear tienda' : 'Editar tienda';

  return (
    <div className="space-y-10 animate-in slide-in-from-right duration-500 max-w-[1400px] mx-auto">
      <div>
        <button type="button" onClick={() => router.push(ADMIN_ROUTES.stores)}
                className="flex items-center gap-2 text-brand-camel font-bold text-[14px] mb-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-camel rounded-lg">
          <ArrowLeft size={16} /> Volver al listado
        </button>
        <h2 className="text-[28px] font-display font-extrabold tracking-tight">{title}</h2>
        <p className="text-[14px] font-medium text-neutral-400">
          {mode === 'create' ? 'Define los valores de marca y configuración.' : 'Modifica los datos actuales de la tienda.'}
        </p>
      </div>

      {(submitError || categoriesError) && (
        <div role="alert" className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-[14px] text-red-800 font-medium">{submitError || categoriesError}</p>
        </div>
      )}

      <Card className="p-5 sm:p-8 lg:p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <Input label="Nombre de la tienda *" placeholder="Canvas Lab" value={form.storeName} error={errors.storeName}
                 onChange={event => {
                   setForm(current => ({ ...current, storeName: event.target.value }));
                   setErrors(current => ({ ...current, storeName: '' }));
                 }} />
          <Input label="Slug único *" placeholder="canvas-lab" value={form.slug} error={errors.slug}
                 onChange={event => {
                   setForm(current => ({ ...current, slug: event.target.value.toLowerCase().replace(/\s+/g, '-') }));
                   setErrors(current => ({ ...current, slug: '' }));
                 }} />

          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Categoría *</label>
            <select value={form.categoryId} disabled={categoriesLoading}
                    onChange={event => {
                      setForm(current => ({ ...current, categoryId: event.target.value }));
                      setErrors(current => ({ ...current, categoryId: '' }));
                    }}
                    className={`w-full px-5 py-3.5 bg-white border ${errors.categoryId ? 'border-red-400' : 'border-neutral-200'} rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel disabled:bg-neutral-50 disabled:text-neutral-400`}>
              <option value="">{categoriesLoading ? 'Cargando categorías...' : 'Seleccionar categoría...'}</option>
              {categories.map(category => <option key={category.id} value={category.id}>{category.storeCategoryName}</option>)}
            </select>
            {errors.categoryId && <p className="text-[12px] text-red-500 font-bold mt-1 ml-1">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Descripción</label>
            <textarea className="w-full h-[110px] px-6 py-4 bg-white border border-neutral-200 rounded-[28px] text-[14px] outline-none focus:border-brand-camel resize-none"
                      placeholder="Descripción de la tienda..." value={form.description}
                      onChange={event => setForm(current => ({ ...current, description: event.target.value }))} />
          </div>
        </div>

        <div className="bg-brand-beige-light p-5 sm:p-8 rounded-[28px] border border-neutral-100">
          <h3 className="text-[11px] font-bold text-neutral-500 mb-6 uppercase tracking-widest">Comerciante asociado (obligatorio)</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {selectedMerchant ? (
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 shrink-0 bg-brand-camel text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {selectedMerchant.firstName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-[16px] font-extrabold text-neutral-900 truncate">{selectedMerchant.firstName} {selectedMerchant.paternalSurname}</p>
                  <p className="text-[12px] font-medium text-neutral-400 truncate">{selectedMerchant.email}</p>
                </div>
              </div>
            ) : <p className="text-[14px] font-medium text-neutral-400 italic">Ningún comerciante seleccionado</p>}
            <Button type="button" variant="secondary" className="rounded-full px-6 shrink-0" onClick={openMerchantModal}>
              {selectedMerchant ? 'Cambiar comerciante' : 'Asociar comerciante'}
            </Button>
          </div>
          {errors.merchant && <p className="text-[12px] text-red-500 font-bold mt-4 flex items-center gap-1"><AlertCircle size={12} /> {errors.merchant}</p>}
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-neutral-500 mb-2 uppercase tracking-widest">Configuración de marca</h3>
          <p className="text-[14px] font-medium text-neutral-400 mb-8">Selecciona los colores de la identidad visual.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-10">
            {[
              { label: 'Color principal', description: 'Botones y títulos', colors: PRIMARY_COLORS, field: 'primaryColor' as const },
              { label: 'Color secundario', description: 'Acentos y soporte', colors: SECONDARY_COLORS, field: 'secondaryColor' as const },
              { label: 'Color terciario', description: 'Detalles y realce', colors: TERTIARY_COLORS, field: 'tertiaryColor' as const },
            ].map(group => (
              <div key={group.field} className="space-y-4">
                <h4 className="text-[13px] font-extrabold text-neutral-900 uppercase tracking-wide">{group.label}</h4>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{group.description}</p>
                <div className="space-y-3">
                  {group.colors.map(color => (
                    <button type="button" key={color.id}
                            onClick={() => setForm(current => ({ ...current, [group.field]: color.id }))}
                            className={`w-full flex items-center justify-between p-3 rounded-[20px] border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-camel ${form[group.field] === color.id ? 'border-brand-black bg-white shadow-md' : 'border-neutral-100 hover:border-neutral-300'}`}>
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full shadow-inner border border-neutral-200" style={{ backgroundColor: color.code }} />
                        <span className="text-[12px] font-extrabold text-neutral-900 tracking-wider uppercase">{getColorLabel(color.id)}</span>
                      </div>
                      {form[group.field] === color.id && <Check size={16} className="text-brand-black" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 lg:mt-16 pt-10 lg:pt-16 border-t border-neutral-100 flex flex-col items-center">
            <h4 className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] mb-8">Resultado de tu combinación</h4>
            <div className="w-full sm:w-auto bg-neutral-50/50 p-6 sm:p-10 rounded-[32px] border border-neutral-100 shadow-sm flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
              <div className="flex items-center">
                <div className="w-20 h-24 rounded-[24px] shadow-xl border-4 border-white" style={{ backgroundColor: primaryHex }} />
                <div className="w-16 h-20 rounded-[20px] shadow-lg border-4 border-white -ml-4 z-10" style={{ backgroundColor: secondaryHex }} />
                <div className="w-16 h-20 rounded-[20px] shadow-lg border-4 border-white -ml-8 z-20" style={{ backgroundColor: tertiaryHex }} />
              </div>
              <div className="text-center sm:text-left">
                <h5 className="text-[18px] font-display font-extrabold tracking-tight mb-2 uppercase">Paleta personalizada</h5>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-[10px] font-mono font-bold text-neutral-400 uppercase">
                  <span>{primaryHex}</span><span>{secondaryHex}</span><span>{tertiaryHex}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-neutral-100 pt-8">
          <Button type="button" variant="secondary" className="rounded-full px-10" onClick={() => router.push(ADMIN_ROUTES.stores)}>Cancelar</Button>
          <Button type="button" className="rounded-full px-10" onClick={handleSave} disabled={saving || categoriesLoading}>
            {saving ? <><Loader2 size={16} className="animate-spin mr-2" />Guardando...</> : mode === 'create' ? 'Crear tienda' : 'Guardar cambios'}
          </Button>
        </div>
      </Card>

      {showMerchantModal && (
        <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 sm:p-10">
              <div className="flex justify-between items-start gap-5 mb-8">
                <div>
                  <h3 className="text-[24px] sm:text-[28px] font-display font-extrabold tracking-tight">Asociar comerciante</h3>
                  <p className="text-[14px] font-medium text-neutral-400">Selecciona el responsable de esta tienda</p>
                </div>
                <button type="button" aria-label="Cerrar selector de comerciante" title="Cerrar"
                        onClick={() => setShowMerchantModal(false)} className="w-10 h-10 shrink-0 inline-flex items-center justify-center hover:bg-neutral-100 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-camel">
                  <X size={20} />
                </button>
              </div>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input aria-label="Buscar comerciante" placeholder="Nombre, apellido o correo..." value={merchantSearch}
                       onChange={event => setMerchantSearch(event.target.value)}
                       className="w-full pl-10 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel" />
              </div>
              <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2">
                {loadingMerchants ? (
                  <div className="flex items-center justify-center py-12 gap-2 text-neutral-400"><Loader2 size={18} className="animate-spin" /> Cargando...</div>
                ) : filteredMerchants.map(merchant => (
                  <button type="button" key={merchant.id}
                          onClick={() => {
                            setSelectedMerchant(merchant);
                            setShowMerchantModal(false);
                            setErrors(current => ({ ...current, merchant: '' }));
                          }}
                          className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-brand-camel hover:bg-brand-camel/5 focus-visible:outline-none focus-visible:border-brand-camel transition-all text-left">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 shrink-0 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">{merchant.firstName.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-neutral-900 truncate">{merchant.firstName} {merchant.paternalSurname}</p>
                        <p className="text-[12px] text-neutral-400 truncate">{merchant.email}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-neutral-300 shrink-0" />
                  </button>
                ))}
                {!loadingMerchants && filteredMerchants.length === 0 && <div className="py-16 text-center text-neutral-400 italic">No se encontraron comerciantes.</div>}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
