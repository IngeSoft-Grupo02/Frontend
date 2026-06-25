/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, FileText, Info, Loader2, AlertTriangle } from 'lucide-react';
import { Store, User, CartItem, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';

interface CartProps {
  store: Store;
  user: User | null;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCreateQuotation: () => void;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  isSubmitting?: boolean;
  cartError?: string | null;
  cartAlreadySubmitted?: boolean;
}

export const Cart: React.FC<CartProps> = ({ store, user, items, onRemoveItem, onCreateQuotation, onNavigate, onLogout, isSubmitting = false, cartError, cartAlreadySubmitted = false }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={items.length} currentView={View.CART} />

      <div className="max-w-5xl mx-auto px-10 py-12">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-[34px] font-extrabold mb-2" style={{ color: '#0F1011' }}>Detalle del Carrito</h1>
            <p className="font-medium opacity-75" style={{ color: '#475569' }}>Revisa tus productos elegidos antes de enviar la cotización final.</p>
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

        {/* Banner de error — visible independientemente del estado del carrito */}
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

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List of items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border rounded-[12px] p-6 flex items-center gap-6 group"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                >
                  <div className="w-20 h-20 rounded-[8px] flex items-center justify-center border" style={{ backgroundColor: i % 3 === 0 ? 'var(--color-primary)' : i % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)', color: i % 3 === 0 ? 'var(--color-text-on-primary)' : i % 3 === 1 ? 'var(--color-text-on-secondary)' : 'var(--color-text-on-tertiary)', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <ShoppingCart size={32} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[16px] font-extrabold mb-1" style={{ color: '#0F1011' }}>{item.productName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-medium opacity-75">
                      <span>Cantidad: <strong style={{ color: '#0F1011' }}>{item.quantity}</strong></span>
                      <span>Diseño: <strong style={{ color: 'var(--color-tertiary-text)' }}>{item.hasDesign ? 'Adjunto' : 'Pendiente'}</strong></span>
                    </div>
                    {item.specs && (
                      <p className="text-[11px] mt-2 truncate max-w-[300px] italic opacity-60">"{item.specs}"</p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-[18px] font-extrabold mb-2" style={{ color: '#0F1011' }}>
                      S/ {(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="transition-colors p-2 cursor-pointer hover:text-red-500"
                      style={{ color: '#0F1011', opacity: 0.6 }}
                      title="Eliminar del carrito"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary / Final Quote button */}
            <aside>
              <div className="border rounded-[12px] p-8 sticky top-[100px] shadow-sm" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
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
                  <div className="border-t pt-4 flex justify-between items-end" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <span className="font-bold text-[12px] uppercase opacity-60">Monto Total Estimado</span>
                    <span className="text-[24px] font-extrabold leading-tight" style={{ color: '#0F1011' }}>
                      S/ {totalAmount.toLocaleString()}
                    </span>
                  </div>
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
          <div className="text-center py-24 rounded-[16px] border-2 border-dashed" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.08)' }}>
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-[22px] font-extrabold mb-2">Tu carrito está vacío</h2>
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
