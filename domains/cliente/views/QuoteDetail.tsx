/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Store, User, Quote, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface QuoteDetailProps {
  store: Store;
  user: User | null;
  quote: Quote;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  cartCount: number;
}

export const QuoteDetail: React.FC<QuoteDetailProps> = ({ store, user, quote, onNavigate, onLogout, cartCount }) => {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {/* Back Link */}
        <button 
          onClick={() => onNavigate(View.MY_QUOTES)}
          className="flex items-center gap-2 text-[12px] font-bold transition-colors mb-10 group cursor-pointer"
          style={{ color: '#475569' }}
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Volver a mis cotizaciones
        </button>

        <header className="flex flex-wrap justify-between items-start gap-8 mb-12">
          <div>
            <div className="flex items-center gap-8 mb-4">
              <h2 className="text-[48px] md:text-[56px] font-black leading-tight tracking-tighter" style={{ color: '#0F1011' }}>{quote.id}</h2>
              <div className="scale-125 md:scale-150 origin-left ml-4">
                <Badge status={quote.status} />
              </div>
            </div>
            <p className="font-bold text-[15px] opacity-75" style={{ color: '#475569' }}>Solicitada el {quote.date} para {store.name}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Info */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
            <div 
              className="rounded-[24px] border p-8 md:p-10 shadow-sm transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <h3 className="text-[20px] font-black mb-8 flex items-center gap-3" style={{ color: 'var(--text-on-secondary)' }}>
                <FileText size={22} style={{ color: 'var(--color-tertiary)' }} /> Detalle del Pedido
              </h3>
              
              <div className="space-y-0 text-[15px]">
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Producto</span>
                  <span className="font-black" style={{ color: 'var(--text-on-secondary)' }}>{quote.productName}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Cantidad Total</span>
                  <span className="font-black" style={{ color: 'var(--text-on-secondary)' }}>{quote.quantity} unidades</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Precio por unidad</span>
                  <span className="font-black text-[18px]" style={{ color: 'var(--color-tertiary)' }}>S/ {(quote.amount / quote.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Monto</span>
                  <span className="font-black text-[24px] tracking-tight" style={{ color: 'var(--text-on-secondary)' }}>S/ {quote.amount.toLocaleString()}</span>
                </div>
                <div className="flex flex-col py-8">
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-bold uppercase tracking-widest text-[11px] opacity-60">Archivos de Diseño</span>
                    <span className="font-black" style={{ color: 'var(--color-tertiary)' }}>
                      {quote.hasDesign ? '2 archivos adjuntos' : 'No adjunto'}
                    </span>
                  </div>
                  
                  {quote.hasDesign && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                      <div 
                        className="aspect-video sm:aspect-square rounded-2xl border overflow-hidden group cursor-zoom-in relative"
                        style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400" 
                          alt="Layout 1" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/95 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md text-[#1a1a1a]">Logo_Front.png</div>
                      </div>
                      <div 
                        className="aspect-video sm:aspect-square rounded-2xl border overflow-hidden group cursor-zoom-in relative"
                        style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=400" 
                          alt="Layout 2" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/95 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md text-[#1a1a1a]">Mockup_Back.jpg</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Actions */}
          <aside className="lg:col-span-12 xl:col-span-4 space-y-8">
            <div 
              className="rounded-[24px] p-8 border relative overflow-hidden group shadow-sm animate-pulse-subtle"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 blur-3xl opacity-10 transition-all group-hover:scale-125 duration-700" style={{ backgroundColor: 'var(--color-tertiary)' }} />
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] mb-6 opacity-60">Asistencia Directa</h4>
              <p className="text-[16px] mb-8 leading-relaxed font-bold" style={{ color: 'var(--text-on-secondary)' }}>
                ¿Tienes dudas sobre esta cotización? Comunícate con nuestro gestor asignado:
              </p>
              
              <div 
                className="rounded-2xl p-7 text-center shadow-md transform transition-all group-hover:-translate-y-1"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)' }}
              >
                <div className="font-extrabold text-[24px] mb-1 tracking-tighter" style={{ color: 'var(--text-on-primary)' }}>{store.whatsapp ? `+51 ${store.whatsapp}` : '+51 987 654 321'}</div>
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-tertiary)' }}>Contacto Directo</div>
              </div>
            </div>

            <div 
              className="rounded-[24px] border p-8 shadow-sm"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 block opacity-60">Siguiente Paso</h4>
              
              {quote.status === 'Pendientes' || quote.status === 'En revisión' ? (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <AlertCircle size={20} style={{ color: 'var(--color-tertiary)' }} />
                  </div>
                  <p className="text-[14px] font-bold leading-relaxed" style={{ color: 'var(--text-on-secondary)' }}>
                    Estamos validando el stock y los archivos de diseño. Recibirás una respuesta en menos de 24 horas.
                  </p>
                </div>
              ) : quote.status === 'Aprobadas' || quote.status === 'Propuesta enviada' ? (
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary)', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--color-tertiary)' }} />
                    </div>
                    <p className="text-[14px] font-bold leading-relaxed" style={{ color: 'var(--text-on-secondary)' }}>
                      ¡Cotización aprobada! Acepta los términos para proceder con el pago e iniciar producción.
                    </p>
                  </div>
                  
                  <div 
                    className="p-6 rounded-2xl border group transition-colors"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                  >
                    <label className="flex items-start gap-4 cursor-pointer">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="w-5 h-5 cursor-pointer rounded-md accent-[var(--color-tertiary)]" id="accept-terms" />
                      </div>
                      <span className="text-[12px] font-bold leading-normal opacity-85" style={{ color: 'var(--text-on-primary)' }}>
                        Acepto los términos y condiciones, y los tiempos de entrega de 3 a 5 días hábiles.
                      </span>
                    </label>
                  </div>

                  <Button 
                    variant="primary" 
                    fullWidth 
                    className="py-5 font-black text-[15px] tracking-tight transform transition-transform active:scale-[0.98] cursor-pointer shadow-md"
                    style={{
                      backgroundColor: 'var(--color-tertiary)',
                      color: 'var(--text-on-tertiary)'
                    }}
                    onClick={() => {
                      const cb = document.getElementById('accept-terms') as HTMLInputElement;
                      if (cb && cb.checked) {
                        onNavigate(View.PAYMENT);
                      } else {
                        alert('Por favor, acepta los términos y condiciones para continuar.');
                      }
                    }}
                  >
                    Ir a pagar ahora
                  </Button>
                </div>
              ) : (
                <p className="text-[14px] font-bold opacity-75">No hay acciones pendientes.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
