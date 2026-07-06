/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, FileText, ImageIcon, Info, Loader2, AlertTriangle, Upload, X, Move } from 'lucide-react';
import { Store, User, CartItem, View, DesignOverlay } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { DESIGN_FEE_RATE, money } from '../lib/pricing';
import { resolveStoreLogoUrl } from '../lib/storeLogo';

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
  itemDesignFiles?: Record<string, File[]>;
  onItemDesignFilesChange?: (itemId: string, files: File[]) => void;
  onItemDesignDescriptionChange?: (itemId: string, description: string) => void;
  onItemDesignOverlayChange?: (itemId: string, overlay: DesignOverlay | null) => void;
}

const DEFAULT_DESIGN_OVERLAY: DesignOverlay = { x: 50, y: 42, width: 24, height: 18 };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const roundOverlay = (overlay: DesignOverlay): DesignOverlay => ({
  x: Number(overlay.x.toFixed(2)),
  y: Number(overlay.y.toFixed(2)),
  width: Number(overlay.width.toFixed(2)),
  height: Number(overlay.height.toFixed(2)),
});
const escapeSvgText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const createStoreLogoPlaceholderUrl = (store: Store) => {
  const label = escapeSvgText((store.logo || store.name || 'KS').trim().slice(0, 3).toUpperCase());
  const background = store.primaryColor || store.color || '#0F1011';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
      <rect width="420" height="420" rx="72" fill="${background}"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="128" font-weight="900" fill="#FFFFFF">${label}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

type PreviewInteraction = 'move' | 'resize' | null;

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

const itemAllowsCustomization = (item: CartItem) => (
  (item as CartItem & { customizable?: boolean }).customizable !== false
);

const CartItemDesignPreview: React.FC<{
  item: CartItem;
  file?: File;
  designImageUrl?: string;
  isStoreLogo?: boolean;
  storeName: string;
  onStoreLogoError?: () => void;
  onOverlayChange?: (overlay: DesignOverlay) => void;
}> = ({ item, file, designImageUrl, isStoreLogo = false, storeName, onStoreLogoError, onOverlayChange }) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [overlay, setOverlay] = React.useState<DesignOverlay>(item.designOverlay || DEFAULT_DESIGN_OVERLAY);
  const [interaction, setInteraction] = React.useState<PreviewInteraction>(null);
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<DesignOverlay>(overlay);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(designImageUrl || '');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, designImageUrl]);

  React.useEffect(() => {
    const next = item.designOverlay || DEFAULT_DESIGN_OVERLAY;
    setOverlay(next);
    overlayRef.current = next;
  }, [item.id, item.designOverlay?.x, item.designOverlay?.y, item.designOverlay?.width, item.designOverlay?.height]);

  const updateOverlay = (nextOverlay: DesignOverlay) => {
    const rounded = roundOverlay(nextOverlay);
    overlayRef.current = rounded;
    setOverlay(rounded);
    onOverlayChange?.(rounded);
  };

  const pointerPosition = (event: React.PointerEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 6, 94),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 6, 94),
    };
  };

  const updateFromPointer = (event: React.PointerEvent, mode: PreviewInteraction) => {
    const point = pointerPosition(event);
    if (!point) return;
    const current = overlayRef.current;
    if (mode === 'move') {
      updateOverlay({ ...current, x: point.x, y: point.y });
      return;
    }
    if (mode === 'resize') {
      updateOverlay({
        ...current,
        width: clamp(Math.abs(point.x - current.x) * 2, 10, 72),
        height: clamp(Math.abs(point.y - current.y) * 2, 10, 72),
      });
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    frameRef.current?.setPointerCapture(event.pointerId);
    setInteraction('move');
    updateFromPointer(event, 'move');
  };

  const handleResizePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    frameRef.current?.setPointerCapture(event.pointerId);
    setInteraction('resize');
    updateFromPointer(event, 'resize');
  };

  const stopInteraction = (event?: React.PointerEvent<HTMLDivElement>) => {
    if (event && frameRef.current?.hasPointerCapture(event.pointerId)) {
      frameRef.current.releasePointerCapture(event.pointerId);
    }
    setInteraction(null);
  };

  return (
    <div className="rounded-2xl border p-4" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-wider">
            <Move size={14} /> Vista previa del diseño
          </h4>
          <p className="mt-1 text-[11px] font-bold opacity-60">
            {isStoreLogo
              ? `Se usará el logo de ${storeName}. Puedes moverlo o ajustar su tamaño.`
              : 'Arrastra la imagen y toma la esquina para ajustar el tamaño.'}
          </p>
        </div>
        <span className="rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-wider opacity-70" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          Referencial
        </span>
      </div>
      <div
        ref={frameRef}
        className="relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-2xl border bg-white touch-none"
        style={{ borderColor: 'rgba(0,0,0,0.08)' }}
        onPointerMove={(event) => {
          if (interaction) updateFromPointer(event, interaction);
        }}
        onPointerUp={stopInteraction}
        onPointerCancel={stopInteraction}
        onPointerLeave={() => setInteraction(null)}
      >
        {item.productImageUrl && !imageFailed ? (
          <img
            src={item.productImageUrl}
            alt={item.productName}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-neutral-400">
            <ImageIcon size={32} />
            <p className="text-[11px] font-bold">Producto sin imagen disponible.</p>
          </div>
        )}

        {previewUrl && item.productImageUrl && !imageFailed && (
          <div
            role="presentation"
            onPointerDown={handlePointerDown}
            className="absolute z-10 select-none rounded-md border-2 border-black/80 bg-white/20 shadow-xl touch-none"
            style={{
              left: `${overlay.x}%`,
              top: `${overlay.y}%`,
              width: `${overlay.width}%`,
              height: `${overlay.height}%`,
              transform: 'translate(-50%, -50%)',
              cursor: interaction === 'move' ? 'grabbing' : 'grab',
            }}
          >
            <img
              src={previewUrl}
              alt={isStoreLogo ? `Logo de ${storeName} ubicado sobre el producto` : 'Diseño ubicado sobre el producto'}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => {
                if (isStoreLogo) onStoreLogoError?.();
              }}
              className="h-full w-full rounded-md object-contain"
            />
            <button
              type="button"
              aria-label="Cambiar tamaño"
              title="Cambiar tamaño"
              onPointerDown={handleResizePointerDown}
              className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full border-2 border-white bg-black shadow-md cursor-nwse-resize"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const Cart: React.FC<CartProps> = ({ store, user, items, onRemoveItem, onCreateQuotation, onNavigate, onLogout, isSubmitting = false, isLoading = false, cartError, cartAlreadySubmitted = false, itemDesignFiles = {}, onItemDesignFilesChange, onItemDesignDescriptionChange, onItemDesignOverlayChange }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const pricedItems = items.map((item) => {
    const allowsCustomization = itemAllowsCustomization(item);
    const localDesignFiles = allowsCustomization ? item.localDesignFiles || itemDesignFiles[item.id] || [] : [];
    const hasDesign = allowsCustomization
      ? item.hasDesign || item.hasDesignFee || localDesignFiles.length > 0
      : Boolean(item.quoteDescription);
    const hasDesignCharge = allowsCustomization && (Boolean(item.hasDesignFee) || localDesignFiles.length > 0);
    const baseSubtotal = item.baseSubtotal ?? item.price * item.quantity;
    const designFeeAmount = hasDesignCharge ? baseSubtotal * DESIGN_FEE_RATE : 0;
    const lineTotal = baseSubtotal + designFeeAmount;
    return {
      ...item,
      hasDesign,
      localDesignFiles,
      baseSubtotal,
      designFeeAmount,
      lineTotal,
    };
  });
  const productsSubtotal = pricedItems.reduce((sum, item) => sum + item.baseSubtotal, 0);
  const designFeeTotal = pricedItems.reduce((sum, item) => sum + item.designFeeAmount, 0);
  const totalAmount = productsSubtotal + designFeeTotal;
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [storeLogoFailed, setStoreLogoFailed] = React.useState(false);
  const allowedFileTypes = React.useMemo(() => new Set(['image/jpeg', 'image/png', 'image/webp']), []);
  const maxFileSizeBytes = 10 * 1024 * 1024;
  const storeLogoUrl = React.useMemo(() => resolveStoreLogoUrl(store), [store]);
  const generatedStoreLogoUrl = React.useMemo(() => createStoreLogoPlaceholderUrl(store), [store]);
  const defaultDesignPreviewUrl = !storeLogoFailed && storeLogoUrl ? storeLogoUrl : generatedStoreLogoUrl;

  React.useEffect(() => {
    setStoreLogoFailed(false);
  }, [storeLogoUrl]);

  const fileSizeLabel = (file: File) => {
    if (file.size < 1024 * 1024) return `${Math.max(1, Math.round(file.size / 1024))} KB`;
    return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleItemFileSelection = (item: CartItem, event: React.ChangeEvent<HTMLInputElement>) => {
    const itemId = item.id;
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (selected.length === 0) return;

    if (selected.length > 1) {
      setFileError('Solo puedes adjuntar una imagen por producto.');
      return;
    }

    const accepted: File[] = [];
    for (const file of selected.slice(0, 1)) {
      if (file.size === 0) {
        setFileError('La imagen está vacía.');
        return;
      }
      if (file.size > maxFileSizeBytes) {
        setFileError('La imagen supera el tamaño máximo permitido.');
        return;
      }
      if (!allowedFileTypes.has(file.type)) {
        setFileError('Solo puedes adjuntar imágenes PNG, JPG, JPEG o WEBP.');
        return;
      }
      accepted.push(file);
    }

    onItemDesignFilesChange?.(itemId, accepted);
    if (accepted.length > 0) {
      onItemDesignOverlayChange?.(itemId, item.designOverlay || DEFAULT_DESIGN_OVERLAY);
    }
    setFileError(null);
  };

  const removeItemFile = (itemId: string, index: number) => {
    const currentFiles = itemDesignFiles[itemId] || [];
    const nextFiles = currentFiles.filter((_, currentIndex) => currentIndex !== index);
    onItemDesignFilesChange?.(itemId, nextFiles);
    if (nextFiles.length === 0) {
      onItemDesignOverlayChange?.(itemId, null);
    }
    setFileError(null);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={items.length} currentView={View.CART} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10">
          <div>
            <h1 className="text-[30px] sm:text-[34px] font-extrabold mb-2" style={{ color: '#0F1011' }}>Detalle de Cotización</h1>
            <p className="font-medium opacity-75" style={{ color: '#475569' }}>Revisa tus productos elegidos antes de solicitar la cotización final.</p>
          </div>
          <Button
            variant="ghost"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border font-bold text-[13px] hover:opacity-85 shadow-sm"
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
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8">
            {/* List of items */}
            <div className="space-y-4">
              {pricedItems.map((item, i) => {
                const allowsCustomization = itemAllowsCustomization(item);
                return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border rounded-[12px] p-4 sm:p-5 group"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
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
                        {allowsCustomization ? (
                          item.localDesignFiles.length > 0 ? (
                            <span>Diseño: <strong style={{ color: 'var(--color-tertiary-text)' }}>Imagen adjunta</strong></span>
                          ) : (
                            <span>Diseño: <strong style={{ color: 'var(--color-tertiary-text)' }}>Logo de tienda</strong></span>
                          )
                        ) : item.quoteDescription ? (
                          <span>Comentarios: <strong style={{ color: 'var(--color-tertiary-text)' }}>Agregados</strong></span>
                        ) : (
                          <span>Personalización: <strong style={{ color: 'var(--color-tertiary-text)' }}>No aplica</strong></span>
                        )}
                      </div>
                      {item.specs && (
                        <p className="text-[11px] mt-2 truncate max-w-full italic opacity-60">"{item.specs}"</p>
                      )}
                      {item.quoteDescription && (
                        <p className="text-[10px] mt-1 truncate max-w-full font-bold opacity-50">Indicaciones: {item.quoteDescription}</p>
                      )}
                      {item.localDesignFiles.length > 0 && (
                        <p className="text-[10px] mt-1 font-bold opacity-50">
                          {item.localDesignFiles.length} imagen de diseño adjunta
                        </p>
                      )}
                      {item.designFeeAmount > 0 && (
                        <p className="text-[10px] mt-1 font-bold opacity-60">
                          Cargo por diseño: +S/ {money(item.designFeeAmount)}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full shrink-0 items-start justify-between gap-3 text-left sm:w-28 sm:block sm:text-right">
                      <div>
                      <div className="text-[18px] font-extrabold mb-1 whitespace-nowrap tabular-nums" style={{ color: '#0F1011' }}>
                        S/ {money(item.lineTotal)}
                      </div>
                      <div className="text-[10px] font-bold opacity-50 mb-3 whitespace-nowrap tabular-nums">
                        Base S/ {money(item.baseSubtotal)}
                      </div>
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
                      {allowsCustomization ? 'Diseño específico de este producto' : 'Comentarios para este producto'}
                    </label>
                    <textarea
                      defaultValue={item.quoteDescription || ''}
                      onBlur={(event) => onItemDesignDescriptionChange?.(item.id, event.currentTarget.value)}
                      placeholder={allowsCustomization ? 'Comentario para este producto: logo, ubicación, acabado, referencia...' : 'Comentario para este producto: fecha de entrega, empaque, observaciones...'}
                      rows={2}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-xl border text-[12px] font-medium resize-none focus:outline-none"
                      style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                    />
                    {allowsCustomization && (
                      <div className="space-y-3">
                        {item.localDesignFiles.length === 0 && (
                          <div className="rounded-xl border px-3 py-2 text-[11px] font-bold opacity-75" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                            Si no adjuntas una imagen, se usará el logo de <strong>{store.name}</strong> como diseño predeterminado. Puedes revisarlo en la vista previa.
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            className="px-3 py-2 rounded-xl border inline-flex items-center gap-2 text-[11px] font-black cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                          >
                            <Upload size={14} /> {item.localDesignFiles.length > 0 ? 'Cambiar imagen del diseño' : 'Adjuntar imagen del diseño'}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(event) => handleItemFileSelection(item, event)}
                            />
                          </label>
                          <span className="text-[10px] font-bold opacity-50">PNG, JPG, JPEG o WEBP.</span>
                        </div>
                      </div>
                    )}
                    {allowsCustomization && item.localDesignFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.localDesignFiles.map((file, index) => (
                          <div key={`${item.id}-${file.name}-${file.size}-${index}`} className="rounded-xl border px-3 py-2 flex items-center gap-2 max-w-full" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                            <ImageIcon size={14} className="shrink-0 opacity-70" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-black truncate max-w-[160px]">{file.name}</p>
                              <p className="text-[9px] opacity-55 font-bold">{fileSizeLabel(file)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItemFile(item.id, index)}
                              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                              title="Quitar imagen"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {allowsCustomization && (
                      <CartItemDesignPreview
                        item={item}
                        file={item.localDesignFiles[0]}
                        designImageUrl={item.localDesignFiles.length > 0 ? undefined : defaultDesignPreviewUrl}
                        isStoreLogo={item.localDesignFiles.length === 0}
                        storeName={store.name}
                        onStoreLogoError={() => setStoreLogoFailed(true)}
                        onOverlayChange={(overlay) => onItemDesignOverlayChange?.(item.id, overlay)}
                      />
                    )}
                  </div>
                </motion.div>
                );
              })}
            </div>

            {/* Summary / Final Quote button */}
            <aside className="self-start lg:sticky lg:top-6">
              <div className="border rounded-[12px] p-5 sm:p-8 shadow-sm" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
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
                    <span className="font-medium opacity-75">Cargo extra por diseño:</span>
                    <span className="font-bold">+ S/ {money(designFeeTotal)}</span>
                  </div>
                  {designFeeTotal > 0 && (
                    <div className="rounded-xl border px-3 py-2 text-[11px] font-bold opacity-75" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                      Diseño aplicado a: {pricedItems.filter((item) => item.designFeeAmount > 0).map((item) => item.productName).join(', ')}
                    </div>
                  )}
                  <div className="border-t pt-4 flex justify-between items-end" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <span className="font-bold text-[12px] uppercase opacity-60">Total final</span>
                    <span className="text-[24px] font-extrabold leading-tight" style={{ color: '#0F1011' }}>
                      S/ {money(totalAmount)}
                    </span>
                  </div>
                </div>

                {fileError && (
                  <p className="mb-6 text-[11px] font-bold text-red-600">{fileError}</p>
                )}

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
                      onCreateQuotation();
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
          <div className="text-center py-16 sm:py-24 px-5 rounded-[16px] border-2 border-dashed" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 border" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.08)' }}>
              <ShoppingCart size={34} />
            </div>
            <h2 className="text-[22px] font-extrabold mb-2">Tu detalle de cotización está vacío</h2>
            <p className="max-w-sm mx-auto mb-10 font-medium opacity-65 text-[15px]">
              Aún no has agregado productos para cotizar. Explora nuestro catálogo para empezar.
            </p>
            <Button
              variant="primary"
              className="w-full sm:w-auto sm:px-10 font-black cursor-pointer shadow-sm"
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
