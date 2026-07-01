/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, FileText, Info, Loader2, AlertTriangle, Upload, X } from 'lucide-react';
import { Store, User, CartItem, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { DESIGN_FEE_RATE, money } from '../lib/pricing';

interface CartProps {
  store: Store;
  user: User | null;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCreateQuotation: (description?: string) => void;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  isSubmitting?: boolean;
  isLoading?: boolean;
  cartError?: string | null;
  cartAlreadySubmitted?: boolean;
  quotationDescription?: string;
  onQuotationDescriptionChange?: (description: string) => void;
  quotationFiles?: File[];
  onQuotationFilesChange?: (files: File[]) => void;
  itemDesignFiles?: Record<string, File[]>;
  onItemDesignFilesChange?: (itemId: string, files: File[]) => void;
  onItemDesignDescriptionChange?: (itemId: string, description: string) => void;
}

const ProductThumbnail: React.FC<{ item: CartItem; index: number }> = ({ item, index }) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const showImage = Boolean(item.productImageUrl && !imageFailed);
  const fallbackColor = index % 3 === 0 ? 'var(--color-primary)' : index % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)';
  const fallbackTextColor = index % 3 === 0 ? 'var(--color-text-on-primary)' : index % 3 === 1 ? 'var(--color-text-on-secondary)' : 'var(--color-text-on-tertiary)';

  return (
    <div
      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[10px] border"
      style={{ backgroundColor: showImage ? '#F8FAFC' : fallbackColor, color: fallbackTextColor, borderColor: 'rgba(0,0,0,0.08)' }}
    >
      {showImage ? (
        <img
          src={item.productImageUrl!}
          alt={item.productName}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="grid h-full w-full place-items-center">
          <ShoppingCart size={32} />
        </div>
      )}
    </div>
  );
};

export const Cart: React.FC<CartProps> = ({ store, user, items, onRemoveItem, onCreateQuotation, onNavigate, onLogout, isSubmitting = false, isLoading = false, cartError, cartAlreadySubmitted = false, quotationDescription = '', onQuotationDescriptionChange, quotationFiles = [], onQuotationFilesChange, itemDesignFiles = {}, onItemDesignFilesChange, onItemDesignDescriptionChange }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const pricedItems = items.map((item) => {
    const localDesignFiles = item.localDesignFiles || itemDesignFiles[item.id] || [];
    const hasDesign = item.hasDesign || item.hasDesignFee || localDesignFiles.length > 0;
    const hasDesignCharge = Boolean(item.hasDesignFee) || localDesignFiles.length > 0;
    const baseSubtotal = item.baseSubtotal ?? item.price * item.quantity;
    const discountAmount = item.discountAmount ?? 0;
    const designFeeAmount = hasDesignCharge ? baseSubtotal * DESIGN_FEE_RATE : 0;
    const lineTotal = baseSubtotal - discountAmount + designFeeAmount;
    return {
      ...item,
      hasDesign,
      localDesignFiles,
      baseSubtotal,
      discountAmount,
      designFeeAmount,
      lineTotal,
    };
  });
  const productsSubtotal = pricedItems.reduce((sum, item) => sum + item.baseSubtotal, 0);
  const discountTotal = pricedItems.reduce((sum, item) => sum + item.discountAmount, 0);
  const designFeeTotal = pricedItems.reduce((sum, item) => sum + item.designFeeAmount, 0);
  const totalAmount = productsSubtotal - discountTotal + designFeeTotal;
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const allowedFileTypes = React.useMemo(() => new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']), []);
  const maxFileSizeBytes = 10 * 1024 * 1024;

  const fileSizeLabel = (file: File) => {
    if (file.size < 1024 * 1024) return `${Math.max(1, Math.round(file.size / 1024))} KB`;
    return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (selected.length === 0) return;

    const remainingSlots = 5 - quotationFiles.length;
    if (remainingSlots <= 0) {
      setFileError('Máximo 5 archivos permitidos.');
      return;
    }

    const accepted: File[] = [];
    for (const file of selected.slice(0, remainingSlots)) {
      if (file.size === 0) {
        setFileError('El archivo está vacío.');
        return;
      }
      if (file.size > maxFileSizeBytes) {
        setFileError('El archivo supera el tamaño máximo permitido.');
        return;
      }
      if (!allowedFileTypes.has(file.type)) {
        setFileError('Formato de archivo no permitido.');
        return;
      }
      accepted.push(file);
    }

    onQuotationFilesChange?.([...quotationFiles, ...accepted]);
    setFileError(null);
  };

  const removeFile = (index: number) => {
    onQuotationFilesChange?.(quotationFiles.filter((_, currentIndex) => currentIndex !== index));
    setFileError(null);
  };

  const handleItemFileSelection = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (selected.length === 0) return;

    const currentFiles = itemDesignFiles[itemId] || [];
    const remainingSlots = 5 - currentFiles.length;
    if (remainingSlots <= 0) {
      setFileError('Máximo 5 archivos por producto.');
      return;
    }

    const accepted: File[] = [];
    for (const file of selected.slice(0, remainingSlots)) {
      if (file.size === 0) {
        setFileError('El archivo está vacío.');
        return;
      }
      if (file.size > maxFileSizeBytes) {
        setFileError('El archivo supera el tamaño máximo permitido.');
        return;
      }
      if (!allowedFileTypes.has(file.type)) {
        setFileError('Formato de archivo no permitido.');
        return;
      }
      accepted.push(file);
    }

    onItemDesignFilesChange?.(itemId, [...currentFiles, ...accepted]);
    setFileError(null);
  };

  const removeItemFile = (itemId: string, index: number) => {
    const currentFiles = itemDesignFiles[itemId] || [];
    onItemDesignFilesChange?.(
      itemId,
      currentFiles.filter((_, currentIndex) => currentIndex !== index),
    );
    setFileError(null);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={items.length} currentView={View.CART} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-[34px] font-extrabold mb-2" style={{ color: '#0F1011' }}>Detalle de Cotización</h1>
            <p className="font-medium opacity-75" style={{ color: '#475569' }}>Revisa tus productos elegidos antes de solicitar la cotización final.</p>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 border font-bold text-[13px] hover:opacity-85 shadow-sm"
            onClick={() => onNavigate(View.CATALOG)}
            style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
          >
            <ArrowLeft size={16} /> Seguir explorando
          </Button>
        </header>

        {/* Banner de error — visible independientemente del estado del detalle de cotización */}
        {cartError && (
          <div className="mb-6 p-4 rounded-2xl flex items-start gap-3 border text-[13px] font-bold" style={{ backgroundColor: '#fef2f2', borderColor: 'rgba(239,68,68,0.3)', color: '#b91c1c' }}>
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p>{cartError}</p>
              {cartAlreadySubmitted && (
                <button
                  onClick={() => onNavigate(View.MY_QUOTES)}
                  className="mt-2 underline font-black text-[12px] cursor-pointer hover:opacity-75 transition-opacity"
                >
                  Ver mis cotizaciones →
                </button>
              )}
            </div>
          </div>
        )}

        {isLoading && items.length === 0 ? (
          <div className="text-center py-24 rounded-[16px] border-2 border-dashed flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
            <Loader2 size={32} className="animate-spin opacity-60" />
            <p className="text-[14px] font-bold opacity-60">Cargando...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
            {/* List of items */}
            <div className="space-y-4">
              {pricedItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border rounded-[12px] p-5 group"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                >
                  <div className="flex items-start gap-4">
                    <ProductThumbnail item={item} index={i} />

                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-[16px] font-extrabold leading-tight mb-2"
                        style={{
                          color: '#0F1011',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.productName}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-medium opacity-75">
                        <span>Cantidad: <strong style={{ color: '#0F1011' }}>{item.quantity}</strong></span>
                        <span>Diseño: <strong style={{ color: 'var(--color-tertiary-text)' }}>{item.hasDesign ? 'Adjunto' : 'Pendiente'}</strong></span>
                      </div>
                      {item.specs && (
                        <p className="text-[11px] mt-2 truncate max-w-full italic opacity-60">"{item.specs}"</p>
                      )}
                      {item.quoteDescription && (
                        <p className="text-[10px] mt-1 truncate max-w-full font-bold opacity-50">Indicaciones: {item.quoteDescription}</p>
                      )}
                      {item.localDesignFiles.length > 0 && (
                        <p className="text-[10px] mt-1 font-bold opacity-50">
                          {item.localDesignFiles.length} archivo(s) de diseño adjunto(s)
                        </p>
                      )}
                      {item.discountAmount > 0 && (
                        <p className="text-[10px] mt-1 font-bold text-emerald-600">
                          {item.discountRuleLabel || `Descuento por volumen: -S/ ${money(item.discountAmount)}`}
                        </p>
                      )}
                      {item.designFeeAmount > 0 && (
                        <p className="text-[10px] mt-1 font-bold opacity-60">
                          Cargo por diseño: +S/ {money(item.designFeeAmount)}
                        </p>
                      )}
                    </div>

                    <div className="w-28 shrink-0 text-right">
                      <div className="text-[18px] font-extrabold mb-1 whitespace-nowrap tabular-nums" style={{ color: '#0F1011' }}>
                        S/ {money(item.lineTotal)}
                      </div>
                      <div className="text-[10px] font-bold opacity-50 mb-3 whitespace-nowrap tabular-nums">
                        Base S/ {money(item.baseSubtotal)}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-auto grid h-8 w-8 place-items-center rounded-lg transition-colors cursor-pointer hover:bg-red-50 hover:text-red-500"
                        style={{ color: '#0F1011', opacity: 0.6 }}
                        title="Quitar del detalle de cotización"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <label className="text-[10px] font-black uppercase tracking-wider opacity-60">
                      Diseño específico de este producto
                    </label>
                    <textarea
                      defaultValue={item.quoteDescription || ''}
                      onBlur={(event) => onItemDesignDescriptionChange?.(item.id, event.currentTarget.value)}
                      placeholder="Comentario para este producto: logo, ubicación, acabado, referencia..."
                      rows={2}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-xl border text-[12px] font-medium resize-none focus:outline-none"
                      style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        className="px-3 py-2 rounded-xl border inline-flex items-center gap-2 text-[11px] font-black cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                      >
                        <Upload size={14} /> Adjuntar diseño al producto
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          className="hidden"
                          onChange={(event) => handleItemFileSelection(item.id, event)}
                        />
                      </label>
                      <span className="text-[10px] font-bold opacity-50">PNG, JPG, WEBP o PDF. Máximo 5.</span>
                    </div>
                    {item.localDesignFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.localDesignFiles.map((file, index) => (
                          <div key={`${item.id}-${file.name}-${file.size}-${index}`} className="rounded-xl border px-3 py-2 flex items-center gap-2 max-w-full" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                            <FileText size={14} className="shrink-0 opacity-70" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-black truncate max-w-[160px]">{file.name}</p>
                              <p className="text-[9px] opacity-55 font-bold">{fileSizeLabel(file)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItemFile(item.id, index)}
                              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                              title="Quitar archivo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary / Final Quote button */}
            <aside className="self-start lg:sticky lg:top-6">
              <div className="border rounded-[12px] p-8 shadow-sm" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                <h3 className="text-[18px] font-extrabold mb-6 flex items-center gap-2">
                  <FileText size={20} style={{ color: 'var(--accent-on-light)' }} /> Resumen de Solicitud
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[14px]">
                    <span className="font-medium opacity-75">Total de productos:</span>
                    <span className="font-bold">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="font-medium opacity-75">Total de unidades:</span>
                    <span className="font-bold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="font-medium opacity-75">Subtotal productos:</span>
                    <span className="font-bold">S/ {money(productsSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="font-medium opacity-75">Descuento aplicado:</span>
                    <span className="font-bold text-emerald-600">- S/ {money(discountTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="font-medium opacity-75">Cargo extra por diseño:</span>
                    <span className="font-bold">+ S/ {money(designFeeTotal)}</span>
                  </div>
                  {designFeeTotal > 0 && (
                    <div className="rounded-xl border px-3 py-2 text-[11px] font-bold opacity-75" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                      Diseño aplicado a: {pricedItems.filter((item) => item.designFeeAmount > 0).map((item) => item.productName).join(', ')}
                    </div>
                  )}
                  {discountTotal > 0 && (
                    <div className="rounded-xl border px-3 py-2 text-[11px] font-bold opacity-75" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                      Descuentos: {pricedItems.filter((item) => item.discountAmount > 0).map((item) => item.discountRuleLabel || item.productName).join(', ')}
                    </div>
                  )}
                  <div className="border-t pt-4 flex justify-between items-end" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <span className="font-bold text-[12px] uppercase opacity-60">Total final</span>
                    <span className="text-[24px] font-extrabold leading-tight" style={{ color: '#0F1011' }}>
                      S/ {money(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="mb-8 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                    Descripción para la tienda
                  </label>
                  <textarea
                    value={quotationDescription}
                    onChange={(event) => onQuotationDescriptionChange?.(event.target.value)}
                    placeholder="Indica detalles, fechas, acabados o comentarios para esta cotización."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl border text-[13px] font-medium resize-none focus:outline-none"
                    style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                  />
                  <p className="text-[10px] text-right opacity-50 font-bold">{quotationDescription.length}/500</p>
                </div>

                <div className="mb-8 space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleFileSelection}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 rounded-xl border flex items-center justify-center gap-2 text-[12px] font-black cursor-pointer hover:opacity-85 transition-opacity"
                    style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                  >
                    <Upload size={16} /> Adjuntar archivos generales
                  </button>
                  <p className="text-[10px] opacity-55 font-bold text-center">PNG, JPG, WEBP o PDF. Máximo 5 archivos.</p>
                  {fileError && (
                    <p className="text-[11px] font-bold text-red-600">{fileError}</p>
                  )}
                  {quotationFiles.length > 0 && (
                    <div className="space-y-2">
                      {quotationFiles.map((file, index) => (
                        <div key={`${file.name}-${file.size}-${index}`} className="rounded-xl border px-3 py-2 flex items-center gap-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                          <FileText size={15} className="shrink-0 opacity-70" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-black truncate">{file.name}</p>
                            <p className="text-[10px] opacity-55 font-bold">{fileSizeLabel(file)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                            title="Quitar archivo"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!user && (
                   <div className="p-4 rounded-xl mb-6 flex items-start gap-3 border text-[11px] font-medium" style={{ backgroundColor: '#FDFBF7', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#0F1011' }}>
                    <Info size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <p>Debes iniciar sesión para procesar la cotización.</p>
                  </div>
                )}

                <Button
                  variant="primary"
                  fullWidth
                  className="flex items-center justify-center gap-2 mb-4 font-black text-[14px] py-4 cursor-pointer"
                  disabled={items.length === 0 || isSubmitting}
                  style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', opacity: isSubmitting ? 0.7 : 1 }}
                  onClick={() => {
                    if (!user) {
                      onNavigate(View.AUTH_LOGIN);
                    } else {
                      onCreateQuotation(quotationDescription);
                    }
                  }}
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Enviando cotización...</>
                  ) : (
                    <>Solicitar Cotización <ArrowRight size={18} /></>
                  )}
                </Button>

                <p className="text-[11px] text-center leading-relaxed opacity-60">
                  Al enviar, un asesor de <strong>{store.name}</strong> revisará los documentos adjuntos y validará el stock disponible.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="text-center py-24 rounded-[16px] border-2 border-dashed" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.08)' }}>
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-[22px] font-extrabold mb-2">Tu detalle de cotización está vacío</h2>
            <p className="max-w-sm mx-auto mb-10 font-medium opacity-65 text-[15px]">
              Aún no has agregado productos para cotizar. Explora nuestro catálogo para empezar.
            </p>
            <Button
              variant="primary"
              className="px-10 font-black cursor-pointer shadow-sm"
              style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
              onClick={() => onNavigate(View.CATALOG)}
            >
              Ver Catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
