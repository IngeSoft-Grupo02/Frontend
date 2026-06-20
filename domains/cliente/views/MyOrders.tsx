/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Truck, PackageCheck, Clock, ArrowRight, Download, CheckCircle2, MessageCircle } from 'lucide-react';
import { Store, User, View, Order } from '../types';
import { ORDERS } from '../constants';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface MyOrdersProps {
  store: Store;
  user: User | null;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  onSelectOrder: (order: Order) => void;
  cartCount: number;
}

export const MyOrders: React.FC<MyOrdersProps> = ({ store, user, onNavigate, onLogout, onSelectOrder, cartCount }) => {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.MY_ORDERS} />
      
      <div className="max-w-7xl mx-auto px-10 py-12">
        <header className="mb-12">
          <h2 className="text-[34px] font-extrabold leading-tight mb-2" style={{ color: '#0F1011' }}>Mis pedidos</h2>
          <p className="text-[15px] font-medium opacity-75 animate-fade-in" style={{ color: '#475569' }}>Consulta el historial de tus compras y el progreso de tus órdenes activas.</p>
        </header>

        <div className="space-y-6">
          {ORDERS.map((order, i) => (
            <motion.div 
               key={order.id}
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               onClick={() => onSelectOrder(order)}
               className="rounded-2xl border p-8 flex flex-wrap lg:flex-nowrap items-center gap-10 group hover:shadow-lg transition-all cursor-pointer"
               style={{ 
                 backgroundColor: 'var(--color-secondary)', 
                 color: 'var(--text-on-secondary)',
                 borderColor: 'rgba(0,0,0,0.05)'
               }}
            >
              {/* Order Basic Info */}
              <div className="flex items-center gap-6 min-w-[280px]">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--text-on-primary)',
                    borderColor: 'rgba(0,0,0,0.05)'
                  }}
                >
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-widest mb-1 opacity-60">{order.id}</div>
                  <h4 className="text-[18px] font-extrabold mb-1" style={{ color: 'var(--text-on-secondary)' }}>{order.productName}</h4>
                  <div className="text-[13px] font-medium opacity-60">{order.date}</div>
                </div>
              </div>

              {/* Status Timeline Simulation */}
              <div className="flex-1 flex items-center gap-2 px-6 border-x mx-auto" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                 <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-md text-[var(--color-text-on-tertiary)]"
                      style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                    >
                      <PackageCheck size={16} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: 'var(--color-tertiary)' }}>Pagado</span>
                 </div>
                 
                 <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
                    <div className="h-full" style={{ backgroundColor: 'var(--color-tertiary)', width: order.status !== 'Pagado' ? '100%' : '0%' }} />
                 </div>
                 
                 <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={order.status !== 'Pagado' ? {
                        backgroundColor: 'var(--color-tertiary)',
                        color: 'var(--text-on-tertiary)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                      } : {
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)',
                        opacity: 0.3
                      }}
                    >
                      <Clock size={16} />
                    </div>
                    <span 
                      className="text-[9px] font-black uppercase tracking-tighter" 
                      style={order.status !== 'Pagado' ? { color: 'var(--color-tertiary)' } : { color: 'var(--text-on-secondary)', opacity: 0.4 }}
                    >
                      En proceso
                    </span>
                 </div>
                 
                 <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
                    <div className="h-full" style={{ backgroundColor: 'var(--color-tertiary)', width: order.status === 'En camino' || order.status === 'Entregado' ? '100%' : '0%' }} />
                 </div>
                 
                 <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={(order.status === 'En camino' || order.status === 'Entregado') ? {
                        backgroundColor: 'var(--color-tertiary)',
                        color: 'var(--text-on-tertiary)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                      } : {
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)',
                        opacity: 0.3
                      }}
                    >
                      <Truck size={16} />
                    </div>
                    <span 
                      className="text-[9px] font-black uppercase tracking-tighter"
                      style={(order.status === 'En camino' || order.status === 'Entregado') ? { color: 'var(--color-tertiary)' } : { color: 'var(--text-on-secondary)', opacity: 0.4 }}
                    >
                      En camino
                    </span>
                 </div>
                 
                 <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
                    <div className="h-full" style={{ backgroundColor: 'var(--color-tertiary)', width: order.status === 'Entregado' ? '100%' : '0%' }} />
                 </div>
                 
                 <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={order.status === 'Entregado' ? {
                        backgroundColor: 'var(--color-tertiary)',
                        color: 'var(--text-on-tertiary)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                      } : {
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)',
                        opacity: 0.3
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </div>
                    <span 
                      className="text-[9px] font-black uppercase tracking-tighter"
                      style={order.status === 'Entregado' ? { color: 'var(--color-tertiary)' } : { color: 'var(--text-on-secondary)', opacity: 0.4 }}
                    >
                      Entregado
                    </span>
                 </div>
              </div>

              {/* Amount & Status */}
              <div className="flex flex-col items-end gap-2 pr-4 min-w-[150px]">
                 <Badge status={order.status} />
                 <div className="text-[22px] font-extrabold" style={{ color: 'var(--text-on-secondary)' }}>S/ {order.amount.toFixed(2)}</div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3">
                 <Button 
                    variant="primary" 
                    className="!px-6 !py-2.5 !text-[11px] whitespace-nowrap flex items-center gap-2 cursor-pointer font-black"
                    style={{
                      backgroundColor: 'var(--color-tertiary)',
                      color: 'var(--text-on-tertiary)'
                    }}
                    onClick={(e) => { e.stopPropagation(); onSelectOrder(order); }}
                 >
                    Detalle de pedido <ArrowRight size={14} />
                 </Button>
                 <button 
                  style={{ color: 'var(--text-on-secondary)', opacity: 0.6 }}
                  className="flex items-center gap-2 text-[11px] font-bold hover:opacity-100 transition-colors justify-center cursor-pointer"
                 >
                    <Download size={14} /> Descargar factura
                 </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div 
          className="mt-20 p-12 rounded-3xl flex items-center justify-between overflow-hidden relative border shadow-sm"
          style={{ 
            backgroundColor: 'var(--color-secondary)', 
            color: 'var(--text-on-secondary)',
            borderColor: 'rgba(0,0,0,0.05)'
          }}
        >
           <div className="relative z-10 w-full md:w-auto">
              <h3 className="text-[28px] font-black mb-2 tracking-tight" style={{ color: 'var(--text-on-secondary)' }}>¿Necesitas ayuda con un pedido?</h3>
              <p className="font-bold mb-8 max-w-md opacity-75" style={{ color: 'var(--text-on-secondary)' }}>Nuestro equipo está listo para asistirte con cualquier duda sobre tus órdenes.</p>
              
              <div className="flex flex-wrap gap-6 items-center">
                 <div 
                    className="rounded-2xl p-4 px-6 border flex items-center gap-4 shadow-sm"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)',
                      borderColor: 'rgba(0,0,0,0.05)'
                    }}
                 >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--color-tertiary)' }}>
                       <MessageCircle size={20} style={{ color: 'var(--text-on-tertiary)' }} />
                    </div>
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-widest opacity-60">WhatsApp Tienda</div>
                       <div className="text-[18px] font-black">{store.whatsapp ? `+51 ${store.whatsapp}` : '+51 987 654 321'}</div>
                    </div>
                 </div>
              </div>
           </div>
           <ShoppingBag size={200} className="absolute -right-10 -bottom-10 opacity-5 rotate-12" />
        </div>
      </div>
    </div>
  );
};
