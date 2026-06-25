/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Store, User, Quote, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Badge } from '../components/ui/Badge';
import { getColorLabel } from '../../shared/colors';

interface QuoteDetailProps {
  store: Store;
  user: User | null;
  quote: Quote;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  cartCount: number;
}

export const QuoteDetail: React.FC<QuoteDetailProps> = ({ store, user, quote, onNavigate, onLogout, cartCount }) => {
  const items = quote.items || [];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <button onClick={() => onNavigate(View.MY_QUOTES)} className="flex items-center gap-2 text-[12px] font-bold transition-colors mb-10 group cursor-pointer" style={{ color: '#475569' }}>
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Volver a mis cotizaciones
        </button>

        <header className="flex flex-wrap justify-between items-start gap-8 mb-12">
          <div>
            <div className="flex items-center gap-8 mb-4">
              <h2 className="text-[48px] md:text-[56px] font-black leading-tight tracking-tighter" style={{ color: '#0F1011' }}>{quote.id}</h2>
              <div className="scale-125 md:scale-150 origin-left ml-4"><Badge status={quote.status} /></div>
            </div>
            <p className="font-bold text-[15px] opacity-75" style={{ color: '#475569' }}>Solicitada el {quote.date} para {store.name}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
            <div className="rounded-[24px] border p-8 md:p-10 shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
              <h3 className="text-[20px] font-black mb-8 flex items-center gap-3" style={{ color: 'var(--text-on-secondary)' }}>
                <FileText size={22} style={{ color: 'var(--color-tertiary)' }} /> Detalle de la cotización
              </h3>

              <div className="space-y-0 text-[15px]">
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Producto principal</span>
                  <span className="font-black" style={{ color: 'var(--text-on-secondary)' }}>{quote.productName}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Cantidad total</span>
                  <span className="font-black" style={{ color: 'var(--text-on-secondary)' }}>{quote.quantity} unidades</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Subtotal</span>
                  <span className="font-black text-[18px]" style={{ color: 'var(--text-on-secondary)' }}>S/ {(quote.subTotal ?? quote.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Descuento</span>
                  <span className="font-black text-[18px]" style={{ color: 'var(--color-tertiary)' }}>S/ {(quote.discount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Monto total</span>
                  <span className="font-black text-[24px] tracking-tight" style={{ color: 'var(--text-on-secondary)' }}>S/ {quote.amount.toLocaleString()}</span>
                </div>

                {items.length > 0 && (
                  <div className="py-8">
                    <span className="font-bold uppercase tracking-widest text-[11px] opacity-60 block mb-4">Ítems</span>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={`${item.productVariantId}-${item.size}-${item.color}`} className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                          <div>
                            <div className="font-black text-[13px]">{item.productName || item.product}</div>
                            <div className="text-[11px] font-bold opacity-70">{item.size} / {getColorLabel(item.color)} · Stock al solicitar: {item.stockAvailable}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[12px] font-bold">{item.quantity} u. x S/ {(item.unitPrice || item.price || 0).toFixed(2)}</div>
                            <div className="text-[14px] font-black">S/ {item.subTotal.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(quote.description || quote.observations) && (
                  <div className="py-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <span className="font-bold uppercase tracking-widest text-[11px] opacity-60 block mb-3">Detalle adicional</span>
                    <p className="text-[13px] font-bold whitespace-pre-line opacity-80">{quote.description || quote.observations}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-12 xl:col-span-4 space-y-8">
            <div className="rounded-[24px] p-8 border relative overflow-hidden group shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] mb-6 opacity-60">Asistencia directa</h4>
              <p className="text-[16px] mb-8 leading-relaxed font-bold" style={{ color: 'var(--text-on-secondary)' }}>Si tienes dudas sobre esta cotización, comunícate con la tienda.</p>
              <div className="rounded-2xl p-7 text-center shadow-md" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)' }}>
                <div className="font-extrabold text-[24px] mb-1 tracking-tighter" style={{ color: 'var(--text-on-primary)' }}>{store.whatsapp ? `+51 ${store.whatsapp}` : 'Contacto de tienda'}</div>
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-tertiary)' }}>Contacto directo</div>
              </div>
            </div>

            <div className="rounded-[24px] border p-8 shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
              <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 block opacity-60">Siguiente paso</h4>
              {quote.status === 'Aprobadas' ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary)', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--color-tertiary)' }} />
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed" style={{ color: 'var(--text-on-secondary)' }}>
                      Tu cotización fue aprobada. Ve a <strong>Mis pedidos</strong> para realizar el pago.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate(View.MY_ORDERS)}
                    className="w-full py-4 rounded-2xl font-black text-[14px] text-center transition-all hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                  >
                    Ir a Mis pedidos para pagar
                  </button>
                </div>
              ) : quote.status === 'Propuesta enviada' ? (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-tertiary)' }} />
                  </div>
                  <p className="text-[14px] font-bold leading-relaxed" style={{ color: 'var(--text-on-secondary)' }}>La tienda ha enviado una propuesta. Revisa los detalles y espera la aprobación final.</p>
                </div>
              ) : quote.status === 'Rechazadas' ? (
                <p className="text-[14px] font-bold opacity-75">Esta cotización fue rechazada por la tienda.</p>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <AlertCircle size={20} style={{ color: 'var(--color-tertiary)' }} />
                  </div>
                  <p className="text-[14px] font-bold leading-relaxed" style={{ color: 'var(--text-on-secondary)' }}>La tienda está revisando stock y condiciones. Verás la respuesta en esta pantalla cuando esté disponible.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
