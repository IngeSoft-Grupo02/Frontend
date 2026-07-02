/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, Info, CheckCircle2, ChevronRight, FileText, ImageIcon, X, Plus, Loader2, AlertTriangle, Move } from 'lucide-react';
import { Store, User, Product, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { getColorLabel, getColorSwatchStyle } from '../../shared/colors';
import { DESIGN_FEE_RATE, bestDiscount, discountRuleLabel, money } from '../lib/pricing';

interface RequestQuoteProps {
  store: Store;
  user: User | null;
  product: Product | null;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  onAddToCart: (item: any) => Promise<void>;
  cartCount: number;
}

export const RequestQuote: React.FC<RequestQuoteProps> = ({ store, user, product, onNavigate, onLogout, onAddToCart, cartCount }) => {
  const [step, setStep] = useState(1);
  const [designMode, setDesignMode] = useState<'none' | 'custom'>('none');
  const [specs, setSpecs] = useState('');
  const [rows, setRows] = useState<{id: string, size: string, color: string, quantity: number}[]>([
    { id: '1', size: 'S', color: 'BLANCO', quantity: 0 }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [designOverlay, setDesignOverlay] = useState({ x: 50, y: 42, width: 24, height: 18 });
  const [isDraggingDesign, setIsDraggingDesign] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const previewFrameRef = React.useRef<HTMLDivElement | null>(null);

  const availableVariants = product?.variants || [];
  const SIZES = Array.from(new Set(availableVariants.map((variant) => variant.size))).filter(Boolean);
  const colorsForSize = React.useCallback((size: string) => {
    return availableVariants
      .filter((variant) => variant.size === size && Number(variant.stock || 0) > 0)
      .map((variant) => String(variant.color));
  }, [availableVariants]);
  const variantForRow = React.useCallback((row: { size: string; color: string }) => {
    return availableVariants.find(
      (variant) => variant.size === row.size && String(variant.color) === String(row.color),
    );
  }, [availableVariants]);

  React.useEffect(() => {
    const firstVariant = availableVariants[0];
    if (firstVariant) {
      setRows([{ id: '1', size: firstVariant.size, color: String(firstVariant.color), quantity: 0 }]);
    }
  }, [product?.id]);

  const addRow = () => {
    const firstVariant = availableVariants[0];
    setRows(prev => [...prev, { id: Date.now().toString(), size: firstVariant?.size || '', color: firstVariant ? String(firstVariant.color) : '', quantity: 0 }]);
  };

  const updateRow = (id: string, field: string, value: any) => {
    setRows(prev => prev.map(row => {
      if (row.id !== id) return row;
      const next = { ...row, [field]: value };
      if (field === 'size') {
        const nextColors = colorsForSize(value);
        next.color = nextColors.includes(next.color) ? next.color : (nextColors[0] || '');
      }
      return next;
    }));
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (selected.length === 0) return;

    const remainingSlots = 5 - uploadedFiles.length;
    if (remainingSlots <= 0) {
      setAddError('Máximo 5 archivos permitidos.');
      return;
    }

    const allowedFileTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
    const maxFileSizeBytes = 10 * 1024 * 1024;
    const accepted: File[] = [];

    for (const file of selected.slice(0, remainingSlots)) {
      if (file.size === 0) {
        setAddError('El archivo está vacío.');
        return;
      }
      if (file.size > maxFileSizeBytes) {
        setAddError('El archivo supera el tamaño máximo permitido.');
        return;
      }
      if (!allowedFileTypes.has(file.type)) {
        setAddError('Formato de archivo no permitido.');
        return;
      }
      accepted.push(file);
    }

    setUploadedFiles(prev => [...prev, ...accepted]);
    setAddError(null);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const selectDesignMode = (mode: 'none' | 'custom') => {
    setDesignMode(mode);
    if (mode === 'none') {
      setUploadedFiles([]);
      setSpecs('');
      setDesignOverlay({ x: 50, y: 42, width: 24, height: 18 });
    }
    setAddError(null);
  };

  const fileSizeLabel = (file: File) => {
    if (file.size < 1024 * 1024) return `${Math.max(1, Math.round(file.size / 1024))} KB`;
    return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const quantity = rows.reduce((acc, row) => acc + (row.quantity || 0), 0);
  const productImageUrl = product?.image || product?.imageUrls?.[0] || null;
  const previewDesignFile = React.useMemo(
    () => uploadedFiles.find((file) => file.type.startsWith('image/')) || null,
    [uploadedFiles],
  );
  const [designPreviewUrl, setDesignPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (!previewDesignFile) {
      setDesignPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(previewDesignFile);
    setDesignPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [previewDesignFile]);

  const clampPercent = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

  const updateOverlayPositionFromPointer = (event: React.PointerEvent<HTMLElement>) => {
    const rect = previewFrameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setDesignOverlay((current) => ({
      ...current,
      x: clampPercent(x, 6, 94),
      y: clampPercent(y, 6, 94),
    }));
  };

  const handleOverlayPointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDraggingDesign(true);
    updateOverlayPositionFromPointer(event);
  };

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    const activeFiles = designMode === 'custom' ? uploadedFiles : [];
    const activeSpecs = designMode === 'custom' ? specs.trim() : '';
    const invalidRows = rows.filter((row) => row.quantity > 0 && !variantForRow(row));
    if (invalidRows.length > 0) {
      setAddError('Selecciona combinaciones de talla y color disponibles para este producto.');
      return;
    }
    setAddError(null);
    setIsAddingToCart(true);
    try {
      const hasVisualOverlay = activeFiles.some((file) => file.type.startsWith('image/')) && Boolean(productImageUrl);
      await onAddToCart({
        productId: product.id,
        productName: product.name,
        quantity,
        specs: activeSpecs,
        rows,
        hasDesign: activeFiles.length > 0 || activeSpecs.length > 0,
        files: activeFiles,
        designOverlay: hasVisualOverlay ? designOverlay : null,
        price: product.price
      });
    } catch (err: unknown) {
      const { messageFromError } = await import('../../shared/errors');
      setAddError(messageFromError(err, 'No se pudo agregar el producto al detalle de cotización.'));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const basePrice = product?.price || 28;
  const subtotal = basePrice * quantity;

  const activeDesignFiles = designMode === 'custom' ? uploadedFiles : [];
  const designFeeAmount = activeDesignFiles.length > 0 ? subtotal * DESIGN_FEE_RATE : 0;
  const applicableDiscount = bestDiscount(product?.discounts || [], quantity);
  const discountRate = Number(applicableDiscount?.discountPercentage || 0) / 100;
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount + designFeeAmount;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} showSearch={false} cartCount={cartCount} currentView={View.REQUEST_QUOTE} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12">
        <button
          type="button"
          onClick={() => onNavigate(product ? View.PRODUCT_DETAIL : View.CATALOG)}
          className="mb-8 sm:mb-10 flex items-center gap-2 text-[13px] font-bold transition-colors cursor-pointer"
          style={{ color: '#475569' }}
        >
          <ArrowLeft size={16} /> {product ? 'Volver al producto' : 'Volver al catálogo'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-12 flex flex-col xl:flex-row gap-8 xl:gap-12">
        <main className="min-w-0 flex-1">
          <header className="mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest mb-5 sm:mb-6 opacity-60">
              <span style={step >= 1 ? { color: 'var(--accent-on-light)' } : {}} className="font-extrabold">Configuración</span>
              <ChevronRight size={14} />
              <span style={step >= 2 ? { color: 'var(--accent-on-light)' } : {}} className="font-extrabold">Diseño</span>
              <ChevronRight size={14} />
              <span style={step >= 3 ? { color: 'var(--accent-on-light)' } : {}} className="font-extrabold">Resumen</span>
            </div>
            <h2 className="text-[30px] sm:text-[34px] font-extrabold leading-tight mb-2" style={{ color: '#0F1011' }}>Solicitar cotización</h2>
            <p className="font-medium text-[15px] opacity-75" style={{ color: '#475569' }}>Personaliza tu pedido por volumen. El equipo de {store.name} revisará tu solicitud.</p>
          </header>

          <div className="space-y-8">
            {/* Step 1: Configuration */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="rounded-2xl border p-5 sm:p-8 lg:p-10"
               style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-start gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-[18px]" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--accent-on-primary)', border: '1px solid var(--border-on-primary)' }}>1</div>
                <div>
                  <h3 className="text-[20px] font-extrabold mb-1" style={{ color: 'var(--text-on-secondary)' }}>Detalles del Producto</h3>
                  <p className="text-[14px] opacity-60">Selecciona las características técnicas para la producción.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[12px] font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Producto</label>
                  <div className="w-full px-5 py-3.5 rounded-xl font-bold text-[14px] border" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                    {product?.name || 'Selecciona un producto'}
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <label className="text-[12px] font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Distribución por Tallas y Colores</label>
                  <Button
                    variant="ghost"
                    className="text-[11px] h-8 px-3 flex items-center gap-2 font-black cursor-pointer"
                    style={{ color: 'var(--accent-on-secondary)' }}
                    onClick={addRow}
                  >
                    <Plus size={14} /> Agregar combinación
                  </Button>
                </div>

                <div className="space-y-4">
                  {rows.map((row) => {
                    const availableColors = colorsForSize(row.size);
                    const selectedVariant = variantForRow(row);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={row.id}
                        className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[1fr_1.2fr_120px_auto] sm:items-end sm:gap-5 sm:p-6 rounded-2xl border"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] font-black tracking-widest uppercase opacity-60">Talla</label>
                          <select
                            value={row.size}
                            onChange={(e) => updateRow(row.id, 'size', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border font-black text-[14px] focus:outline-none transition-all appearance-none cursor-pointer"
                            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.1)' }}
                          >
                            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black tracking-widest uppercase opacity-60">Color disponible</label>
                          <select
                            value={row.color}
                            onChange={(e) => updateRow(row.id, 'color', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border font-black text-[14px] focus:outline-none transition-all appearance-none cursor-pointer"
                            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.1)' }}
                          >
                            {availableColors.map(c => <option key={c} value={c}>{getColorLabel(c)}</option>)}
                          </select>
                          <div className="flex items-center gap-2 text-[11px] font-bold opacity-70">
                            <span className="h-3 w-3 rounded-full border" style={getColorSwatchStyle(row.color)} />
                            Stock referencial: {selectedVariant?.stock ?? 0}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black tracking-widest uppercase opacity-60">Cantidad</label>
                          <input
                            type="number"
                            min="0"
                            value={row.quantity || ''}
                            onChange={(e) => updateRow(row.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 rounded-xl border font-black text-[14px] focus:outline-none transition-all"
                            placeholder="0"
                            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.1)' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="p-3 hover:text-red-500 rounded-xl transition-all mb-0.5 cursor-pointer"
                          style={{ color: 'var(--text-on-primary)', opacity: 0.5 }}
                          disabled={rows.length === 1}
                          title="Eliminar combinación"
                        >
                          <X size={20} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="text-[12px] font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Total calculado</label>
                <div
                  className="w-full px-5 py-3.5 rounded-xl font-black text-[18px] border transition-colors"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'rgba(0,0,0,0.05)',
                    color: quantity <= 0 ? 'var(--error-on-primary)' : 'var(--accent-on-primary)'
                  }}
                >
                  {quantity} unidades
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold">
                  {quantity <= 0 ? (
                    <span className="flex items-center gap-1" style={{ color: 'var(--error-on-secondary)' }}><Info size={12} /> Ingresa la cantidad en la distribución por talla y color.</span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--success-on-secondary)' }}><CheckCircle2 size={12} /> Total calculado desde las combinaciones</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Step 2: Design */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="rounded-2xl border p-5 sm:p-8 lg:p-10"
               style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-start gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-[18px]" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--accent-on-primary)', border: '1px solid var(--border-on-primary)' }}>2</div>
                <div>
                  <h3 className="text-[20px] font-extrabold mb-1" style={{ color: 'var(--text-on-secondary)' }}>Diseño o personalización</h3>
                  <p className="text-[14px] opacity-60">Si quieres agregar un logo, imagen, texto o ejemplo, adjúntalo aquí.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { mode: 'none' as const, title: 'Sin diseño personalizado', description: 'Solo cotizar la prenda seleccionada.' },
                  { mode: 'custom' as const, title: 'Con diseño o referencia', description: 'Adjuntar logo, imagen, PDF o comentario.' },
                ].map(option => (
                  <button
                    key={option.mode}
                    type="button"
                    onClick={() => selectDesignMode(option.mode)}
                    className="text-left rounded-2xl border-2 p-5 transition-all cursor-pointer"
                    style={{
                      backgroundColor: designMode === option.mode ? 'var(--color-primary)' : 'transparent',
                      borderColor: designMode === option.mode ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.08)',
                      color: designMode === option.mode ? 'var(--text-on-primary)' : 'var(--text-on-secondary)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border" style={{ borderColor: 'currentColor' }}>
                        {designMode === option.mode && <CheckCircle2 size={16} />}
                      </span>
                      <span>
                        <span className="block text-[14px] font-black mb-1">{option.title}</span>
                        <span className="block text-[12px] font-bold opacity-65 leading-relaxed">{option.description}</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {designMode === 'custom' ? (
                <>
                  <div className="border-2 rounded-2xl p-5 sm:p-8 mb-8 sm:mb-10 flex items-start gap-4 sm:gap-5 shadow-sm" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-tertiary)', color: 'var(--text-on-primary)' }}>
                    <Info size={24} style={{ color: 'var(--accent-on-primary)' }} className="shrink-0 mt-1" />
                    <p className="text-[15px] font-bold leading-relaxed">
                      <span className="uppercase tracking-[0.25em] text-[11px] block mb-2 opacity-65" style={{ color: 'var(--accent-on-primary)' }}>Importante</span>
                      Puedes enviar un comentario, archivos o ambos. El incremento de 10% se aplica solo si adjuntas archivos de diseño para este producto.
                    </p>
                  </div>

                  <div
                    className="border-2 border-dashed rounded-2xl p-8 sm:p-12 lg:p-16 text-center group transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.1)' }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={handleFileSelection}
                    />
                    <div className="w-16 h-16 rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)' }}>
                      <Upload size={24} style={{ color: 'var(--accent-on-secondary)' }} />
                    </div>
                    <h4 className="text-[16px] font-extrabold mb-2" style={{ color: 'var(--text-on-primary)' }}>
                      {uploadedFiles.length >= 5 ? 'Ya agregaste el máximo de archivos' : 'Adjuntar archivos del diseño'}
                    </h4>
                    <p className="text-[13px] opacity-60 font-medium mb-6 sm:mb-8">Formatos permitidos: PNG, JPG, JPEG, WEBP y PDF. Máximo 5 archivos.</p>
                    <div className="flex justify-center gap-3">
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm border" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                        <ImageIcon size={12} /> Logo, foto o PDF
                      </span>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-8 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[12px] font-black uppercase tracking-wider opacity-85" style={{ color: 'var(--text-on-secondary)' }}>Archivos adjuntos ({uploadedFiles.length}/5)</label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploadedFiles.map((file, idx) => (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={idx}
                            className="flex items-center justify-between p-4 rounded-xl border group"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                                <FileText size={16} style={{ color: 'var(--accent-on-secondary)' }} />
                              </div>
                              <div className="overflow-hidden">
                                <div className="text-[12px] font-black truncate" style={{ color: 'var(--text-on-primary)' }}>{file.name}</div>
                                <div className="text-[10px] opacity-60 font-bold">{fileSizeLabel(file)}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                              className="p-2 hover:text-red-500 transition-colors cursor-pointer"
                              style={{ color: 'var(--muted-on-primary)' }}
                            >
                              <X size={16} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {designPreviewUrl && productImageUrl && (
                    <div className="mt-8 rounded-2xl border p-5 sm:p-6" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.08)' }}>
                      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="text-[15px] font-black flex items-center gap-2">
                            <Move size={16} /> Ubicación del diseño
                          </h4>
                          <p className="mt-1 text-[12px] font-bold opacity-60">
                            Arrastra la imagen sobre la prenda para indicar dónde debe ir el diseño.
                          </p>
                        </div>
                        <span className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider opacity-70" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                          Vista referencial
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                        <div
                          ref={previewFrameRef}
                          className="relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-2xl border bg-white touch-none"
                          style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                          onPointerMove={(event) => {
                            if (isDraggingDesign) updateOverlayPositionFromPointer(event);
                          }}
                          onPointerUp={() => setIsDraggingDesign(false)}
                          onPointerCancel={() => setIsDraggingDesign(false)}
                          onPointerLeave={() => setIsDraggingDesign(false)}
                        >
                          <img
                            src={productImageUrl}
                            alt={product?.name || 'Producto'}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 h-full w-full object-contain"
                          />
                          <img
                            src={designPreviewUrl}
                            alt="Diseño ubicado sobre el producto"
                            draggable={false}
                            onPointerDown={handleOverlayPointerDown}
                            className="absolute z-10 select-none rounded-md border border-white/80 object-contain shadow-lg touch-none"
                            style={{
                              left: `${designOverlay.x}%`,
                              top: `${designOverlay.y}%`,
                              width: `${designOverlay.width}%`,
                              height: `${designOverlay.height}%`,
                              transform: 'translate(-50%, -50%)',
                              cursor: isDraggingDesign ? 'grabbing' : 'grab',
                              backgroundColor: 'rgba(255,255,255,0.18)',
                            }}
                          />
                        </div>

                        <div className="space-y-4 rounded-2xl border p-4" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider opacity-70">
                              <span>Horizontal</span>
                              <span>{Math.round(designOverlay.x)}%</span>
                            </div>
                            <input
                              type="range"
                              min={6}
                              max={94}
                              value={designOverlay.x}
                              onChange={(event) => setDesignOverlay((current) => ({ ...current, x: Number(event.target.value) }))}
                              className="w-full accent-black"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider opacity-70">
                              <span>Vertical</span>
                              <span>{Math.round(designOverlay.y)}%</span>
                            </div>
                            <input
                              type="range"
                              min={6}
                              max={94}
                              value={designOverlay.y}
                              onChange={(event) => setDesignOverlay((current) => ({ ...current, y: Number(event.target.value) }))}
                              className="w-full accent-black"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <div className="text-[11px] font-black uppercase tracking-wider opacity-70">Ancho</div>
                              <input
                                type="number"
                                min={8}
                                max={60}
                                value={Math.round(designOverlay.width)}
                                onChange={(event) => setDesignOverlay((current) => ({ ...current, width: clampPercent(Number(event.target.value) || 8, 8, 60) }))}
                                className="w-full rounded-xl border px-3 py-2 text-[12px] font-black focus:outline-none"
                                style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.08)' }}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="text-[11px] font-black uppercase tracking-wider opacity-70">Alto</div>
                              <input
                                type="number"
                                min={8}
                                max={60}
                                value={Math.round(designOverlay.height)}
                                onChange={(event) => setDesignOverlay((current) => ({ ...current, height: clampPercent(Number(event.target.value) || 8, 8, 60) }))}
                                className="w-full rounded-xl border px-3 py-2 text-[12px] font-black focus:outline-none"
                                style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.08)' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadedFiles.length > 0 && !designPreviewUrl && (
                    <div className="mt-8 rounded-2xl border p-4 text-[12px] font-bold opacity-75" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.08)' }}>
                      Adjuntaste referencias, pero no hay una imagen para ubicar sobre el producto. Los PDF se enviarán como archivo de referencia.
                    </div>
                  )}

                  <div className="mt-8 space-y-3">
                     <label className="text-[12px] font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Comentarios para la tienda</label>
                     <textarea
                        placeholder="Ejemplo: colocar el logo en el pecho, usar letras blancas, enviar antes del viernes..."
                        className="w-full px-5 py-4 rounded-xl font-medium text-[14px] border focus:outline-none min-h-[120px]"
                        value={specs}
                        onChange={(e) => setSpecs(e.target.value)}
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                     />
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border p-5 sm:p-6 flex items-start gap-4" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                  <CheckCircle2 size={22} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-on-primary)' }} />
                  <div>
                    <h4 className="text-[15px] font-black mb-1">Se cotizará sin archivos de diseño</h4>
                    <p className="text-[13px] font-bold opacity-65 leading-relaxed">
                      Esta opción guarda solo la prenda, talla, color y cantidad. Puedes cambiar a "Con diseño" si necesitas adjuntar logo, imagen, PDF o instrucciones especiales.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {addError && (
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-[13px] font-bold">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>{addError}</p>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-6 pt-6">
               <Button variant="ghost" className="w-full sm:w-auto" onClick={() => onNavigate(View.CATALOG)} style={{ color: '#475569' }}>Cancelar</Button>
               <Button
                variant="primary"
                className="w-full sm:w-auto sm:px-16 cursor-pointer font-black flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={quantity <= 0 || availableVariants.length === 0 || isAddingToCart}
                style={{
                  backgroundColor: 'var(--color-tertiary)',
                  color: 'var(--text-on-tertiary)',
                  opacity: isAddingToCart ? 0.7 : 1,
                }}
              >
                {isAddingToCart ? <><Loader2 size={16} className="animate-spin" /> Agregando...</> : 'Añadir al detalle de cotización'}
              </Button>
            </div>
          </div>
        </main>

        {/* Sidebar Summary */}
        <aside className="w-full xl:w-[380px] flex-shrink-0">
          <div className="rounded-2xl border p-5 sm:p-8 xl:p-10 xl:sticky xl:top-28 shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
            <h4 className="text-[15px] font-black uppercase tracking-widest mb-8 pb-4 border-b-2" style={{ color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.1)' }}>
              Resumen
            </h4>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-[14px] shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)' }}>
                      {quantity}
                   </div>
                   <div>
                      <div className="text-[13px] font-black" style={{ color: 'var(--text-on-primary)' }}>{product?.name || 'Producto'}</div>
                      <div className="text-[11px] font-bold opacity-60" style={{ color: 'var(--text-on-primary)' }}>S/ {basePrice.toFixed(2)} c/u</div>
                   </div>
                </div>
                <div className="shrink-0 whitespace-nowrap text-right text-[14px] font-black tabular-nums" style={{ color: 'var(--text-on-primary)' }}>S/ {money(subtotal)}</div>
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-[13px]" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="min-w-0 flex-1 font-bold" style={{ color: 'var(--text-on-primary)' }}>
                  <div className="flex items-start gap-2">
                    <ImageIcon size={16} className="mt-0.5 shrink-0" />
                    <span className="leading-tight">
                      {designMode === 'custom' ? 'Incremento por diseño (10%)' : 'Sin diseño personalizado'}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 whitespace-nowrap text-right text-[14px] font-black tabular-nums" style={{ color: 'var(--accent-on-primary)' }}>
                  {designFeeAmount > 0 ? `+ S/ ${money(designFeeAmount)}` : 'S/ 0.00'}
                </div>
              </div>

              {discountRate > 0 && (
                <div className="flex justify-between items-center px-4 py-3 rounded-xl border text-[13px]" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--text-on-secondary)' }}>
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {applicableDiscount ? discountRuleLabel(applicableDiscount) : 'Descuento vol.'}
                  </div>
                  <div className="shrink-0 whitespace-nowrap text-right text-[14px] font-black tabular-nums text-emerald-500">- S/ {money(discountAmount)}</div>
                </div>
              )}
            </div>

            <div className="space-y-6 pt-6 border-t-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
               <div className="flex justify-between items-end">
                  <div className="text-[14px] font-black uppercase tracking-widest opacity-60">Total</div>
                  <div className="text-right">
                     <div className="whitespace-nowrap text-[32px] font-black leading-none mb-1 tracking-tighter tabular-nums" style={{ color: 'var(--text-on-secondary)' }}>S/ {money(total)}</div>
                     <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Monto final sujeto a revisión</div>
                  </div>
               </div>
            </div>

             {!user && (
              <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="p-4 rounded-xl mb-6 flex items-start gap-3 text-left border" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--text-on-primary)' }}>
                  <Info size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] font-medium leading-relaxed">Debes tener una cuenta en **{store.name}** para poder enviar esta cotización. Por favor, inicia sesión o regístrate.</p>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  className="py-4 cursor-pointer font-black text-[13px]"
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                    color: 'var(--text-on-tertiary)'
                  }}
                  onClick={() => onNavigate(View.AUTH_LOGIN)}
                >
                   Ingresar ahora
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
