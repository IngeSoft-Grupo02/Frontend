'use client';

import { MerchantLayout } from '@/domains/comerciante/components/MerchantLayout';
import { Badge, Button, Card, Input } from '@/domains/comerciante/components/ui';
import { useStore } from '@/domains/comerciante/context/StoreContext';
import { getColorLabel } from '@/domains/shared/colors';
import { messageFromError } from '@/domains/shared/errors';
import { AlertCircle, Check, ImageIcon, RotateCcw, Save, Upload, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

type ColorOption = { name: string; value: string; hex: string };

const INCREMENT_VALUES = [5, 10, 15] as const;
const LOGO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const LOGO_MAX_SIZE_BYTES = 2 * 1024 * 1024;

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

const colorValue = (value: string | undefined, options: ColorOption[], fallback: string) => {
  if (!value) return fallback;
  return options.find(option => option.value === value || option.hex.toLowerCase() === value.toLowerCase())?.value || fallback;
};

const colorHex = (value: string, options: ColorOption[]) =>
  options.find(option => option.value === value)?.hex || options[0].hex;

const colorName = (value: string, options: ColorOption[]) =>
  getColorLabel(options.find(option => option.value === value)?.value || value);

const getInitials = (name: string) => {
  if (!name.trim()) return 'S';
  return name.split(' ').filter(Boolean).map(part => part[0]).join('').toUpperCase().substring(0, 2);
};

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

export default function SettingsPage() {
  const { store, saveStore } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [storeName, setStoreName] = useState(store.name);
  const [storeDescription, setStoreDescription] = useState(store.description || '');
  const [customizationIncrement, setCustomizationIncrement] = useState<5 | 10 | 15>(store.customizationIncrement || 10);
  const [primaryColor, setPrimaryColor] = useState(colorValue(store.colors?.primary || store.palette, PRIMARY_COLORS, 'ONYX_BLACK'));
  const [secondaryColor, setSecondaryColor] = useState(colorValue(store.colors?.secondary, SECONDARY_COLORS, 'SLATE'));
  const [tertiaryColor, setTertiaryColor] = useState(colorValue(store.colors?.tertiary, TERTIARY_COLORS, 'RAW_GOLD'));
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(store.logoUrl || store.logo || '');
  const [logoFileName, setLogoFileName] = useState('');

  const categoryLabel = store.categoryName || store.type || 'Sin categoría asignada';
  const selectedPrimaryHex = colorHex(primaryColor, PRIMARY_COLORS);
  const selectedSecondaryHex = colorHex(secondaryColor, SECONDARY_COLORS);
  const selectedTertiaryHex = colorHex(tertiaryColor, TERTIARY_COLORS);

  const hasChanges = useMemo(() => {
    return storeName !== store.name
      || storeDescription !== (store.description || '')
      || customizationIncrement !== (store.customizationIncrement || 10)
      || primaryColor !== colorValue(store.colors?.primary || store.palette, PRIMARY_COLORS, 'ONYX_BLACK')
      || secondaryColor !== colorValue(store.colors?.secondary, SECONDARY_COLORS, 'SLATE')
      || tertiaryColor !== colorValue(store.colors?.tertiary, TERTIARY_COLORS, 'RAW_GOLD')
      || logoPreviewUrl !== (store.logoUrl || store.logo || '');
  }, [customizationIncrement, logoPreviewUrl, primaryColor, secondaryColor, store, storeDescription, storeName, tertiaryColor]);

  useEffect(() => {
    setStoreName(store.name);
    setStoreDescription(store.description || '');
    setCustomizationIncrement(store.customizationIncrement || 10);
    setPrimaryColor(colorValue(store.colors?.primary || store.palette, PRIMARY_COLORS, 'ONYX_BLACK'));
    setSecondaryColor(colorValue(store.colors?.secondary, SECONDARY_COLORS, 'SLATE'));
    setTertiaryColor(colorValue(store.colors?.tertiary, TERTIARY_COLORS, 'RAW_GOLD'));
    setLogoPreviewUrl(store.logoUrl || store.logo || '');
    setLogoFileName('');
    setErrors({});
  }, [store]);

  const handleLogoFile = (file?: File | null) => {
    if (!file) return;
    if (!isAllowedLogo(file)) {
      setErrors(prev => ({ ...prev, logo: 'Solo se permiten imágenes JPG, PNG o WEBP' }));
      return;
    }
    if (file.size > LOGO_MAX_SIZE_BYTES) {
      setErrors(prev => ({ ...prev, logo: 'El logo no puede superar 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreviewUrl(String(reader.result || ''));
      setLogoFileName(`${file.name} · ${formatFileSize(file.size)}`);
      setErrors(prev => ({ ...prev, logo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const resetChanges = () => {
    setStoreName(store.name);
    setStoreDescription(store.description || '');
    setCustomizationIncrement(store.customizationIncrement || 10);
    setPrimaryColor(colorValue(store.colors?.primary || store.palette, PRIMARY_COLORS, 'ONYX_BLACK'));
    setSecondaryColor(colorValue(store.colors?.secondary, SECONDARY_COLORS, 'SLATE'));
    setTertiaryColor(colorValue(store.colors?.tertiary, TERTIARY_COLORS, 'RAW_GOLD'));
    setLogoPreviewUrl(store.logoUrl || store.logo || '');
    setLogoFileName('');
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!storeName.trim()) newErrors.storeName = 'El nombre de la tienda es obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await saveStore({
        ...store,
        name: storeName.trim(),
        type: store.type,
        categoryId: store.categoryId,
        categoryName: store.categoryName,
        description: storeDescription.trim(),
        customizationIncrement,
        palette: selectedPrimaryHex,
        logo: logoPreviewUrl || undefined,
        logoUrl: logoPreviewUrl || undefined,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          tertiary: tertiaryColor
        }
      });

      setErrors({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors({ storeName: messageFromError(error, 'No se pudo guardar la tienda') });
    }
  };

  const renderColorColumn = (
    title: string,
    helper: string,
    options: ColorOption[],
    selected: string,
    onSelect: (value: string) => void
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
            onClick={() => onSelect(color.value)}
            className={`w-full flex items-center justify-between p-3 rounded-[20px] border-2 transition-all ${selected === color.value ? 'border-brand-black bg-white shadow-md' : 'border-brand-neutral-border hover:border-brand-black/30'}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full shadow-inner border border-brand-neutral-border shrink-0" style={{ backgroundColor: color.hex }} />
              <span className="text-[12px] font-extrabold text-brand-black tracking-wider uppercase truncate">{color.name}</span>
            </div>
            {selected === color.value && <Check size={16} className="text-brand-black shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <MerchantLayout title="Configuración" subtitle="Personaliza la operación y la identidad visual de tu tienda">
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Ajustes de tienda</p>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">Configuración de tienda</h1>
            <p className="text-brand-text-muted text-[15px] font-bold max-w-2xl leading-relaxed">
              Edita la información operativa que controla el comerciante. La categoría es administrada desde el panel de administración.
            </p>
          </div>
        </header>

        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 flex items-center gap-4 animate-in slide-in-from-top duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <Check size={24} />
            </div>
            <div>
              <h4 className="text-[16px] font-black text-green-800">Cambios guardados exitosamente</h4>
              <p className="text-[13px] font-bold text-green-700">La configuración de la tienda se actualizó correctamente.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8 space-y-8">
            <Card title="Información de la tienda" subtitle="Datos básicos visibles en el catálogo">
              <div className="space-y-6">
                <Input
                  label="Nombre de la tienda *"
                  value={storeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setStoreName(e.target.value);
                    if (errors.storeName) setErrors({ ...errors, storeName: '' });
                  }}
                  error={errors.storeName}
                  className="h-14 rounded-2xl font-bold"
                />

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em]">Categoría de la tienda</label>
                  <div className="h-14 rounded-2xl border border-brand-neutral-border bg-brand-neutral-light px-5 flex items-center justify-between">
                    <span className="text-[14px] font-black text-brand-black">{categoryLabel}</span>
                    <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">Solo admin</Badge>
                  </div>
                  <p className="text-[11px] font-bold text-brand-text-muted">La categoría se asigna y modifica únicamente desde administración.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em]">Descripción</label>
                  <textarea
                    value={storeDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStoreDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe tu tienda..."
                    className="w-full bg-white border border-brand-neutral-border rounded-2xl px-5 py-4 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all resize-none"
                  />
                </div>
              </div>
            </Card>

            <Card title="Incremento por personalización" subtitle="Porcentaje adicional para pedidos personalizados">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {INCREMENT_VALUES.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setCustomizationIncrement(val)}
                      className={`p-8 border-2 rounded-[28px] text-center transition-all ${customizationIncrement === val ? 'border-brand-black bg-brand-neutral-mid shadow-inner' : 'border-brand-neutral-border hover:border-brand-black'}`}
                    >
                      <h4 className="text-[32px] font-black">{val}%</h4>
                      <p className="text-[10px] font-black text-brand-text-muted uppercase mt-1">Incremento</p>
                    </button>
                  ))}
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-[12px] font-bold text-blue-800 leading-relaxed">
                    Este porcentaje se aplicará automáticamente a los pedidos que incluyan personalización o archivos adjuntos.
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Branding" subtitle="Logo y colores de la tienda">
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 items-center">
                  <div className="w-36 h-36 rounded-[32px] bg-brand-neutral-light border-2 border-dashed border-brand-neutral-border flex items-center justify-center overflow-hidden">
                    {logoPreviewUrl ? (
                      <img src={logoPreviewUrl} alt="Logo de la tienda" className="w-full h-full object-contain p-3" />
                    ) : (
                      <div className="text-center space-y-2">
                        <ImageIcon size={34} className="mx-auto text-brand-text-muted opacity-40" />
                        <span className="text-[28px] font-black text-brand-black">{getInitials(storeName)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[13px] font-black text-brand-black uppercase tracking-widest">Logo de la tienda</h4>
                      <p className="text-[12px] font-bold text-brand-text-muted mt-1">Subida simulada en local. JPG, PNG o WEBP hasta 2MB.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-brand-black text-white text-[12px] font-extrabold cursor-pointer hover:bg-brand-black/90 transition-colors">
                        <Upload size={16} /> {logoPreviewUrl ? 'Cambiar logo' : 'Subir logo'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(event) => handleLogoFile(event.target.files?.[0])}
                        />
                      </label>
                      {logoPreviewUrl && (
                        <Button type="button" variant="ghost" className="h-11 px-5 rounded-xl text-red-500" onClick={() => { setLogoPreviewUrl(''); setLogoFileName(''); }}>
                          <X size={16} /> Quitar
                        </Button>
                      )}
                    </div>
                    {logoFileName && <p className="text-[11px] font-bold text-brand-text-muted">{logoFileName}</p>}
                    {errors.logo && <p className="text-[11px] font-bold text-red-500">{errors.logo}</p>}
                  </div>
                </div>

                <div className="border-t border-brand-neutral-border pt-8 space-y-8">
                  <div>
                    <h4 className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2">Paleta de colores</h4>
                    <p className="text-[13px] font-bold text-brand-text-muted">Selecciona los colores permitidos por el modelo de tienda, igual que en administración.</p>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {renderColorColumn('Color principal', 'Botones y títulos', PRIMARY_COLORS, primaryColor, setPrimaryColor)}
                    {renderColorColumn('Color secundario', 'Acentos y soporte', SECONDARY_COLORS, secondaryColor, setSecondaryColor)}
                    {renderColorColumn('Color terciario', 'Detalles y realce', TERTIARY_COLORS, tertiaryColor, setTertiaryColor)}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <aside className="xl:col-span-4 xl:sticky xl:top-24 space-y-8">
            <Card title="Control de cambios" subtitle="Guardar sin volver arriba">
              <div className="space-y-4">
                <div className="rounded-3xl border border-brand-neutral-border overflow-hidden bg-brand-neutral-light">
                  <div className="h-20 flex items-center justify-center" style={{ backgroundColor: selectedPrimaryHex }}>
                    <div className="w-14 h-14 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                      {logoPreviewUrl ? (
                        <img src={logoPreviewUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="text-[18px] font-black" style={{ color: selectedPrimaryHex }}>{getInitials(storeName)}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Vista previa</p>
                      <h3 className="text-[16px] font-black text-brand-black truncate">{storeName || 'Tienda'}</h3>
                      <p className="text-[12px] font-bold text-brand-text-muted truncate">{categoryLabel}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {[selectedPrimaryHex, selectedSecondaryHex, selectedTertiaryHex].map(color => (
                        <div key={color} className="w-7 h-7 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] font-bold text-brand-text-muted">
                  <div className="flex items-center justify-between gap-4">
                    <span className="uppercase tracking-widest">Principal</span>
                    <span className="text-brand-black text-right">{colorName(primaryColor, PRIMARY_COLORS)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="uppercase tracking-widest">Secundario</span>
                    <span className="text-brand-black text-right">{colorName(secondaryColor, SECONDARY_COLORS)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="uppercase tracking-widest">Terciario</span>
                    <span className="text-brand-black text-right">{colorName(tertiaryColor, TERTIARY_COLORS)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-neutral-border space-y-3">
                  <Button onClick={handleSave} disabled={!hasChanges} className="w-full h-12 gap-3 rounded-2xl font-black shadow-xl shadow-brand-black/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save size={20} /> Guardar cambios
                  </Button>
                  <Button type="button" variant="outline" onClick={resetChanges} disabled={!hasChanges} className="w-full h-12 gap-3 rounded-2xl font-black disabled:opacity-50 disabled:cursor-not-allowed">
                    <RotateCcw size={18} /> Descartar cambios
                  </Button>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </MerchantLayout>
  );
}
