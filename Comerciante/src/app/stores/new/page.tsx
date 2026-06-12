'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card, Input } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { merchantApi, merchantSession } from '@/lib/api';
import { Store as StoreType, StoreCategory } from '@/lib/types';
import { AlertCircle, ArrowLeft, Check, ImageIcon, Search, Tag, Trash2, Upload, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useMemo, useState } from 'react';

type ColorOption = { name: string; value: string; hex: string };

const PRIMARY_COLORS: ColorOption[] = [
  { name: 'ONYX BLACK', value: 'ONYX_BLACK', hex: '#0F1011' },
  { name: 'MIDNIGHT', value: 'MIDNIGHT', hex: '#1A2332' },
  { name: 'CHARCOAL', value: 'CHARCOAL', hex: '#36454F' },
  { name: 'ESPRESSO', value: 'ESPRESSO', hex: '#4B3621' },
  { name: 'ALABASTER', value: 'ALABASTER', hex: '#F9FAFB' },
  { name: 'WARM CREAM', value: 'WARM_CREAM', hex: '#FDFBF7' }
];

const SECONDARY_COLORS: ColorOption[] = [
  { name: 'SLATE', value: 'SLATE', hex: '#475569' },
  { name: 'SAGE', value: 'SAGE', hex: '#8A9A86' },
  { name: 'TERRA', value: 'TERRA', hex: '#E2725B' },
  { name: 'DUSTY RED', value: 'DUSTY_RED', hex: '#B25C5C' },
  { name: 'GHOST WHITE', value: 'GHOST_WHITE', hex: '#FFFFFF' },
  { name: 'SOFT TAUPE', value: 'SOFT_TAUPE', hex: '#D5CEC4' },
  { name: 'BLUSH PINK', value: 'BLUSH_PINK', hex: '#F4C2C2' },
  { name: 'FROSTED BLUE', value: 'FROSTED_BLUE', hex: '#B0E0E6' }
];

const TERTIARY_COLORS: ColorOption[] = [
  { name: 'RAW GOLD', value: 'RAW_GOLD', hex: '#D4AF37' },
  { name: 'COPPER', value: 'COPPER', hex: '#B87333' },
  { name: 'COBALT BLUE', value: 'COBALT_BLUE', hex: '#2563EB' },
  { name: 'CORAL PUNCH', value: 'CORAL_PUNCH', hex: '#FF5A5F' },
  { name: 'EMERALD', value: 'EMERALD', hex: '#10B981' },
  { name: 'SUNFLOWER', value: 'SUNFLOWER', hex: '#FFC107' },
  { name: 'HOT MAGENTA', value: 'HOT_MAGENTA', hex: '#FF00FF' },
  { name: 'VIOLET POP', value: 'VIOLET_POP', hex: '#8B5CF6' }
];

const FALLBACK_CATEGORIES: StoreCategory[] = [
  { id: 1, name: 'Moda' },
  { id: 2, name: 'Ropa' },
  { id: 3, name: 'Accesorios' }
];

const LOGO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const LOGO_MAX_SIZE_BYTES = 2 * 1024 * 1024;
const STORE_LOGO_UPLOAD_MODE = process.env.NEXT_PUBLIC_STORE_LOGO_UPLOAD_MODE || 'local';

const getInitials = (name: string) => {
  if (!name.trim()) return 'S';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const colorValue = (value: string | undefined, options: ColorOption[], fallback: string) => {
  if (!value) return fallback;
  return options.find(option => option.value === value || option.hex.toLowerCase() === value.toLowerCase())?.value || fallback;
};

const colorHex = (value: string, options: ColorOption[]) =>
  options.find(option => option.value === value)?.hex || options[0].hex;

const colorName = (value: string, options: ColorOption[]) =>
  options.find(option => option.value === value)?.name || value;

const isAllowedLogo = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const validExtension = LOGO_EXTENSIONS.includes(extension);
  const validMime = file.type === '' || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  return validExtension && validMime;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function StoreFormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { stores, addStore, setStore, saveStore } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '' as number | '',
    categoryName: '',
    description: '',
    primaryColor: 'ONYX_BLACK',
    secondaryColor: 'SLATE',
    tertiaryColor: 'RAW_GOLD'
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');
  const [existingLogoUrl, setExistingLogoUrl] = useState('');
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryLoadError, setCategoryLoadError] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryLoadError('');
      try {
        const loaded = await merchantApi.categories();
        if (isMounted) setCategories(loaded);
      } catch (error) {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : 'No se pudieron cargar las categorías';
        if (merchantSession.getToken()) {
          setCategoryLoadError(message);
          setCategories([]);
        } else {
          if (message.includes('403')) {
            setCategoryLoadError('');
          }
          setCategories(FALLBACK_CATEGORIES);
        }
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    };

    loadCategories();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!editId) return;
    const store = stores.find(s => s.id === editId);
    if (!store) return;

    setFormData({
      name: store.name,
      categoryId: store.categoryId || '',
      categoryName: store.categoryName || store.type || '',
      description: store.description || '',
      primaryColor: colorValue(store.colors?.primary || store.palette, PRIMARY_COLORS, 'ONYX_BLACK'),
      secondaryColor: colorValue(store.colors?.secondary, SECONDARY_COLORS, 'SLATE'),
      tertiaryColor: colorValue(store.colors?.tertiary, TERTIARY_COLORS, 'RAW_GOLD')
    });
    const logoUrl = store.logoUrl || store.logo || '';
    setExistingLogoUrl(logoUrl);
    setLogoPreviewUrl(logoUrl);
    setLogoFile(null);
  }, [editId, stores]);

  useEffect(() => {
    if (!formData.categoryId && formData.categoryName && categories.length > 0) {
      const matchedCategory = categories.find(category => category.name.toLowerCase() === formData.categoryName.toLowerCase());
      if (matchedCategory) {
        setFormData(prev => ({ ...prev, categoryId: matchedCategory.id, categoryName: matchedCategory.name }));
      }
    }
  }, [categories, formData.categoryId, formData.categoryName]);

  const filteredCategories = useMemo(() => {
    const term = categorySearch.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter(category => category.name.toLowerCase().includes(term));
  }, [categories, categorySearch]);

  const selectedPrimaryHex = colorHex(formData.primaryColor, PRIMARY_COLORS);
  const selectedSecondaryHex = colorHex(formData.secondaryColor, SECONDARY_COLORS);
  const selectedTertiaryHex = colorHex(formData.tertiaryColor, TERTIARY_COLORS);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'El nombre de la tienda es obligatorio';
    if (!formData.categoryId) nextErrors.categoryId = 'Selecciona una categoría existente';
    if (!PRIMARY_COLORS.some(color => color.value === formData.primaryColor)) nextErrors.primaryColor = 'Color principal inválido';
    if (!SECONDARY_COLORS.some(color => color.value === formData.secondaryColor)) nextErrors.secondaryColor = 'Color secundario inválido';
    if (!TERTIARY_COLORS.some(color => color.value === formData.tertiaryColor)) nextErrors.tertiaryColor = 'Color terciario inválido';
    return nextErrors;
  };

  const handleLogoChange = (file?: File) => {
    if (!file) return;
    if (!isAllowedLogo(file)) {
      setErrors(prev => ({ ...prev, logo: 'Solo se permiten logos JPG, PNG o WEBP' }));
      return;
    }
    if (file.size > LOGO_MAX_SIZE_BYTES) {
      setErrors(prev => ({ ...prev, logo: 'El logo no puede pesar más de 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoFile(file);
      setLogoPreviewUrl(String(reader.result || ''));
      setErrors(prev => ({ ...prev, logo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreviewUrl('');
    setExistingLogoUrl('');
    setErrors(prev => ({ ...prev, logo: '' }));
  };

  const handleSelectCategory = (category: StoreCategory) => {
    setFormData(prev => ({ ...prev, categoryId: category.id, categoryName: category.name }));
    setErrors(prev => ({ ...prev, categoryId: '' }));
    setShowCategoryModal(false);
    setCategorySearch('');
  };

  const handleSave = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      let logoUrl = existingLogoUrl;
      if (logoFile) {
        logoUrl = STORE_LOGO_UPLOAD_MODE === 'api' && merchantSession.getToken()
          ? (await merchantApi.uploadStoreLogo(logoFile)).logoUrl
          : logoPreviewUrl;
      }

      const payload = {
        name: formData.name.trim(),
        type: formData.categoryName,
        categoryId: Number(formData.categoryId),
        categoryName: formData.categoryName,
        description: formData.description.trim(),
        logo: logoUrl || undefined,
        logoUrl: logoUrl || undefined,
        palette: selectedPrimaryHex,
        status: 'Activa' as const,
        colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor,
          tertiary: formData.tertiaryColor
        }
      };

      if (editId) {
        const currentStore = stores.find(s => s.id === editId);
        if (!currentStore) throw new Error('No se encontró la tienda a editar');
        const updatedStore = await saveStore({ ...currentStore, ...payload });
        if (updatedStore) setStore(updatedStore);
      } else {
        const created = await addStore(payload as Omit<StoreType, 'id'>);
        if (created) setStore(created);
      }

      router.push('/store-selection');
    } catch (error) {
      setErrors({ name: error instanceof Error ? error.message : 'No se pudo guardar la tienda' });
    }
  };

  const renderColorColumn = (
    title: string,
    helper: string,
    options: ColorOption[],
    selected: string,
    field: 'primaryColor' | 'secondaryColor' | 'tertiaryColor',
    error?: string
  ) => (
    <div className="space-y-4">
      <div>
        <h5 className="text-[13px] font-extrabold text-brand-black uppercase tracking-wide">{title}</h5>
        <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-tight mt-1">{helper}</p>
      </div>
      <div className="space-y-3">
        {options.map(color => (
          <button
            type="button"
            key={color.value}
            onClick={() => {
              setFormData(prev => ({ ...prev, [field]: color.value }));
              if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
            }}
            className={`w-full flex items-center justify-between p-3 rounded-[20px] border-2 transition-all ${selected === color.value ? 'border-brand-black bg-white shadow-md' : 'border-brand-neutral-border hover:border-brand-black/30'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full shadow-inner border border-brand-neutral-border" style={{ backgroundColor: color.hex }} />
              <span className="text-[12px] font-extrabold text-brand-black tracking-wider uppercase">{color.name}</span>
            </div>
            {selected === color.value && <Check size={16} className="text-brand-black" />}
          </button>
        ))}
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold uppercase">{error}</p>}
    </div>
  );

  return (
    <MerchantLayout title={editId ? 'Editar Tienda' : 'Crear Tienda'} subtitle="Configuración de unidad de negocio" noSidebar={true}>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[11px] font-extrabold text-brand-text-muted hover:text-brand-black transition-all group uppercase tracking-[0.2em] leading-none"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Volver
            </button>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">
              {editId ? 'Editar' : 'Crear'} Tienda
            </h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="h-12 px-8 font-extrabold" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button className="gap-2 h-12 px-10 font-extrabold shadow-xl shadow-brand-black/20" onClick={handleSave}>
              <Check size={20} /> {editId ? 'Actualizar' : 'Crear'} tienda
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <Card title="Información básica" subtitle="01 - MODELO DE TIENDA">
              <div className="space-y-6">
                <Input
                  label="Nombre de la tienda *"
                  placeholder="Ej: Studio 47"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  error={errors.name}
                  className="h-14 rounded-2xl font-bold"
                />

                <div>
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2 block">Categoría *</label>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className={`w-full min-h-14 bg-white border rounded-2xl px-5 py-4 text-left outline-none focus:ring-4 focus:ring-brand-black/5 transition-all flex items-center justify-between ${errors.categoryId ? 'border-red-500' : 'border-brand-neutral-border hover:border-brand-black'}`}
                  >
                    <span className={`text-[14px] font-bold ${formData.categoryName ? 'text-brand-black' : 'text-brand-text-muted'}`}>
                      {formData.categoryName || 'Selecciona una categoría existente'}
                    </span>
                    <Search size={18} className="text-brand-text-muted" />
                  </button>
                  {errors.categoryId && <p className="text-[10px] text-red-500 font-bold uppercase mt-1.5">{errors.categoryId}</p>}
                  {categoryLoadError && (
                    <p className="text-[11px] text-red-500 font-bold mt-2 flex items-center gap-1">
                      <AlertCircle size={12} /> {categoryLoadError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2 block">Logo de la tienda</label>
                  <div className={`rounded-3xl border-2 ${errors.logo ? 'border-red-500 bg-red-50' : 'border-brand-neutral-border bg-brand-neutral-light'} p-5`}>
                    <div className="flex flex-col md:flex-row gap-5 md:items-center">
                      <div className="w-28 h-28 rounded-3xl bg-white border border-brand-neutral-border flex items-center justify-center overflow-hidden shrink-0">
                        {logoPreviewUrl ? (
                          <img src={logoPreviewUrl} alt="Logo de la tienda" className="w-full h-full object-contain p-3" />
                        ) : (
                          <ImageIcon size={36} className="text-brand-text-muted opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-[13px] font-black text-brand-black uppercase tracking-wide">Sube el archivo del logo</p>
                          <p className="text-[11px] font-bold text-brand-text-muted mt-1">
                            Formatos permitidos: JPG, PNG o WEBP. Peso máximo: 2MB.
                          </p>
                          {logoFile && (
                            <p className="text-[11px] font-black text-brand-black mt-2">
                              {logoFile.name} - {formatFileSize(logoFile.size)}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <label className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-brand-black text-white text-[12px] font-extrabold cursor-pointer hover:bg-brand-black/90 transition-colors">
                            <Upload size={16} /> {logoPreviewUrl ? 'Cambiar logo' : 'Subir logo'}
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              className="hidden"
                              onChange={(e) => {
                                handleLogoChange(e.target.files?.[0]);
                                e.target.value = '';
                              }}
                            />
                          </label>
                          {logoPreviewUrl && (
                            <Button type="button" variant="ghost" className="h-11 gap-2 text-red-500 hover:text-red-600" onClick={handleRemoveLogo}>
                              <Trash2 size={16} /> Quitar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors.logo && <p className="text-[10px] text-red-500 font-bold uppercase mt-1.5">{errors.logo}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2 block">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe el enfoque y estilo de tu tienda..."
                    className="w-full bg-white border border-brand-neutral-border rounded-2xl px-5 py-4 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all resize-none"
                  />
                </div>
              </div>
            </Card>

            <Card title="Paleta de colores" subtitle="02 - IDENTIDAD VISUAL">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2">Configuración de marca</h4>
                  <p className="text-[13px] font-bold text-brand-text-muted">Selecciona los colores permitidos por el modelo de tienda. Estos valores se guardan como enums del backend.</p>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {renderColorColumn('Color principal', 'Botones y titulos', PRIMARY_COLORS, formData.primaryColor, 'primaryColor', errors.primaryColor)}
                  {renderColorColumn('Color secundario', 'Acentos y soporte', SECONDARY_COLORS, formData.secondaryColor, 'secondaryColor', errors.secondaryColor)}
                  {renderColorColumn('Color terciario', 'Detalles y realce', TERTIARY_COLORS, formData.tertiaryColor, 'tertiaryColor', errors.tertiaryColor)}
                </div>
                <div className="pt-8 border-t border-brand-neutral-border flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex items-center">
                    <div className="w-20 h-24 rounded-[24px] shadow-xl border-4 border-white" style={{ backgroundColor: selectedPrimaryHex }} />
                    <div className="w-16 h-20 rounded-[20px] shadow-lg border-4 border-white -ml-4 z-10" style={{ backgroundColor: selectedSecondaryHex }} />
                    <div className="w-16 h-20 rounded-[20px] shadow-lg border-4 border-white -ml-8 z-20" style={{ backgroundColor: selectedTertiaryHex }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] mb-2">Resultado de combinacion</p>
                    <div className="flex flex-wrap gap-3 text-[11px] font-mono font-black text-brand-black uppercase">
                      <span>{selectedPrimaryHex}</span>
                      <span>{selectedSecondaryHex}</span>
                      <span>{selectedTertiaryHex}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8 sticky top-28">
            <Card title="Vista previa de la tienda">
              <div className="bg-brand-neutral-light rounded-[32px] border border-brand-neutral-border overflow-hidden shadow-2xl">
                <div className="h-40 flex items-center justify-center relative" style={{ backgroundColor: selectedPrimaryHex }}>
                  <div className="absolute top-4 left-4">
                    <Badge variant="black" className="!px-4 !py-1.5 font-black text-[11px]">
                      {formData.categoryName || 'Categoría'}
                    </Badge>
                  </div>
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
                    {logoPreviewUrl ? (
                      <img src={logoPreviewUrl} alt="Logo de la tienda" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-[28px] font-black" style={{ color: selectedPrimaryHex }}>
                        {getInitials(formData.name)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-[22px] font-black text-brand-black leading-none mb-1">{formData.name || 'Nombre de la tienda'}</h3>
                    <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">{formData.categoryName || 'Sin categoría'}</p>
                  </div>
                  <p className="text-[13px] font-medium text-brand-text-muted leading-relaxed">
                    {formData.description || 'Sin descripción disponible para esta tienda.'}
                  </p>
                  <div className="pt-4 border-t border-brand-neutral-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-brand-text-muted uppercase tracking-widest">Estado</span>
                      <Badge variant="success" className="font-black">Activa</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-brand-text-muted uppercase tracking-widest">Colores</span>
                      <div className="flex -space-x-2">
                        {[selectedPrimaryHex, selectedSecondaryHex, selectedTertiaryHex].map(color => (
                          <div key={color} className="w-7 h-7 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Resumen de configuración">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Nombre</span>
                  <span className="text-[13px] font-black text-brand-black text-right">{formData.name || 'Sin nombre'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Categoría</span>
                  <span className="text-[13px] font-black text-brand-black text-right">{formData.categoryName || 'Sin categoría'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Principal</span>
                  <span className="text-[12px] font-black text-brand-black text-right">{colorName(formData.primaryColor, PRIMARY_COLORS)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Secundario</span>
                  <span className="text-[12px] font-black text-brand-black text-right">{colorName(formData.secondaryColor, SECONDARY_COLORS)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Terciario</span>
                  <span className="text-[12px] font-black text-brand-black text-right">{colorName(formData.tertiaryColor, TERTIARY_COLORS)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] bg-brand-black/30 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden border border-brand-neutral-border">
            <div className="p-8 border-b border-brand-neutral-border flex items-start justify-between gap-6">
              <div>
                <h3 className="text-[26px] font-black text-brand-black tracking-tight">Seleccionar categoría</h3>
                <p className="text-[13px] font-bold text-brand-text-muted mt-1">Busca una categoría existente en la base de datos.</p>
              </div>
              <button type="button" onClick={() => setShowCategoryModal(false)} className="p-2 rounded-full hover:bg-brand-neutral-mid transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <Input
                label="Buscar categoría"
                placeholder="Nombre de categoría..."
                value={categorySearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategorySearch(e.target.value)}
                className="h-12 rounded-2xl font-bold"
              />
              <div className="max-h-[360px] overflow-y-auto space-y-2 pr-2">
                {isLoadingCategories && <p className="py-12 text-center text-brand-text-muted font-bold">Cargando categorías...</p>}
                {!isLoadingCategories && filteredCategories.map(category => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => handleSelectCategory(category)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-brand-black hover:bg-brand-neutral-light transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-brand-neutral-mid rounded-xl flex items-center justify-center text-brand-black">
                        <Tag size={18} />
                      </div>
                      <div>
                        <p className="font-black text-brand-black">{category.name}</p>
                      </div>
                    </div>
                    {formData.categoryId === category.id && <Check size={18} className="text-brand-black" />}
                  </button>
                ))}
                {!isLoadingCategories && filteredCategories.length === 0 && (
                  <div className="py-16 text-center text-brand-text-muted font-bold italic">
                    No se encontraron categorías.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </MerchantLayout>
  );
}

export default function StoreFormPage() {
  return (
    <Suspense fallback={null}>
      <StoreFormPageContent />
    </Suspense>
  );
}
