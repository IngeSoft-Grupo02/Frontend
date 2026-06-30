/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Ruler, Shield, RefreshCw, FileText, ImageIcon, PackageCheck, AlertTriangle } from 'lucide-react';
import { Store, User, Product, View } from '../types';
import { ApiError, fetchPublicProduct, toProduct } from '../lib/api';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { getColorLabel, getColorSwatchStyle } from '../../shared/colors';
import { useAutoRefresh } from '../../shared/hooks/useAutoRefresh';
import { discountRuleLabel } from '../lib/pricing';

interface ProductDetailProps {
  store: Store;
  user: User | null;
  product: Product;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  cartCount: number;
  onProductUpdated?: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ store, user, product, onNavigate, onLogout, cartCount, onProductUpdated }) => {
  const [latestProduct, setLatestProduct] = React.useState(product);
  const [imageFailed, setImageFailed] = React.useState(false);
  const [productUnavailable, setProductUnavailable] = React.useState(false);

  React.useEffect(() => {
    setLatestProduct(product);
    setImageFailed(false);
    setProductUnavailable(false);
  }, [product]);

  const refreshProduct = React.useCallback(async () => {
    if (!store.slug || !product.id) return;
    const data = await fetchPublicProduct(store.slug, product.id);
    const mapped = toProduct(data, store.slug || store.id);
    setLatestProduct(mapped);
    setProductUnavailable(false);
    onProductUpdated?.(mapped);
  }, [store.id, store.slug, product.id, onProductUpdated]);

  useAutoRefresh({
    enabled: Boolean(store.slug && product.id),
    intervalMs: 15000,
    onRefresh: refreshProduct,
    onError: (error) => {
      if (error instanceof ApiError && error.status === 404) {
        setProductUnavailable(true);
      }
    },
  });

  const imageUrl = latestProduct.image || latestProduct.imageUrls?.[0];
  const gallery = latestProduct.imageUrls?.length ? latestProduct.imageUrls : [];
  const stock = latestProduct.stock ?? latestProduct.variants?.reduce((sum, variant) => sum + variant.stock, 0) ?? 0;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} showSearch={false} cartCount={cartCount} currentView={View.PRODUCT_DETAIL} />

      <div className="max-w-7xl mx-auto px-10 py-16">
        <button
          type="button"
          onClick={() => onNavigate(View.CATALOG)}
          className="mb-10 flex items-center gap-2 text-[13px] font-bold transition-colors cursor-pointer"
          style={{ color: '#475569' }}
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </button>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-3xl flex items-center justify-center border overflow-hidden relative"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.08)' }}
            >
              {imageUrl && !imageFailed ? (
                <img src={imageUrl} alt={latestProduct.name} referrerPolicy="no-referrer" onError={() => setImageFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <ImageIcon size={150} />
                  <span className="text-[12px] font-black uppercase tracking-widest">Imagen pendiente</span>
                </div>
              )}
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {(gallery.length ? gallery.slice(0, 4) : [null, null, null, null]).map((url, index) => (
                <div key={`${url || 'fallback'}-${index}`} className="aspect-square border rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: index % 3 === 0 ? 'var(--color-primary)' : index % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)', borderColor: 'rgba(0,0,0,0.08)' }}>
                  {url ? <img src={url} alt={`${latestProduct.name} ${index + 1}`} referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.display = 'none'; }} className="h-full w-full object-cover" /> : <FileText size={22} className="opacity-40" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)' }}>
                {store.name}
              </span>
              <span className="opacity-40">/</span>
              <span className="text-[12px] font-medium uppercase tracking-widest opacity-60">Producto {latestProduct.id}</span>
            </div>

            <h1 className="text-[42px] font-extrabold leading-tight mb-4" style={{ color: '#0F1011' }}>{latestProduct.name}</h1>
            <p className="text-[18px] font-medium mb-10 leading-relaxed" style={{ color: '#475569' }}>{latestProduct.description}</p>

            <div className="rounded-2xl border p-8 mb-10 space-y-8" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
              <div className="flex justify-between items-end border-b pb-6" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest block mb-1 opacity-60">Precio base por unidad</span>
                  <span className="text-[32px] font-extrabold" style={{ color: 'var(--text-on-secondary)' }}>S/ {latestProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-black" style={{ color: 'var(--accent-on-secondary)' }}>
                  <PackageCheck size={18} /> Stock: {stock}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest block mb-3 opacity-60">Tallas disponibles</span>
                  <div className="flex flex-wrap gap-2">
                    {latestProduct.sizes.length > 0 ? latestProduct.sizes.map((size) => (
                      <span key={size} className="w-10 h-10 rounded-lg border flex items-center justify-center text-[12px] font-black" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>{size}</span>
                    )) : <span className="text-[12px] font-bold opacity-60">Sin tallas registradas</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest block mb-3 opacity-60">Colores disponibles</span>
                  <div className="flex flex-wrap gap-2">
                    {latestProduct.colors.length > 0 ? latestProduct.colors.map((color) => (
                      <div key={color} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                        <div className="w-3 h-3 rounded-full border" style={getColorSwatchStyle(color)} />
                        <span className="text-[10px] font-black uppercase">{getColorLabel(color)}</span>
                      </div>
                    )) : <span className="text-[12px] font-bold opacity-60">Sin colores registrados</span>}
                  </div>
                </div>
              </div>

              {latestProduct.discounts && latestProduct.discounts.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest block mb-3 opacity-60">Descuentos por volumen</span>
                  <div className="space-y-2">
                    {latestProduct.discounts.map((discount) => (
                      <div key={discount.id} className="flex justify-between items-center px-4 py-3 rounded-xl border text-[12px] font-bold" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                        <span>{discount.name} ({discountRuleLabel(discount)})</span>
                        <span style={{ color: 'var(--accent-on-primary)' }}>{discount.discountPercentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center"><Ruler size={20} style={{ color: 'var(--text-on-secondary)', opacity: 0.6 }} /></div>
                  <div><div className="text-[12px] font-bold mb-1">Guía de tallas</div><p className="text-[11px] opacity-75">Según variantes disponibles</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center"><Shield size={20} style={{ color: 'var(--text-on-secondary)', opacity: 0.6 }} /></div>
                  <div><div className="text-[12px] font-bold mb-1">Stock</div><p className="text-[11px] opacity-75">Referencial; el comerciante confirma disponibilidad</p></div>
                </div>
              </div>
            </div>

            {productUnavailable && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p className="text-[12px] font-bold">Este producto ya no está disponible. Vuelve al catálogo para elegir otra opción.</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="primary"
                className={`flex-1 py-5 font-black transition-all ${productUnavailable ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', borderColor: 'transparent' }}
                onClick={() => {
                  if (productUnavailable) return;
                  if (!user) onNavigate(View.AUTH_LOGIN);
                  else onNavigate(View.REQUEST_QUOTE);
                }}
              >
                Solicitar cotización
              </Button>
            </div>

            <div className="mt-12 space-y-6 pt-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
              <div className="flex gap-4">
                <RefreshCw size={20} className="shrink-0 opacity-45" />
                <p className="text-[13px] font-medium" style={{ color: '#475569' }}>Producción por demanda: el comerciante revisará stock y condiciones antes de aprobar la cotización.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
