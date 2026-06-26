/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Download, 
  MapPin, 
  CreditCard, 
  HelpCircle,
  Clock,
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Store, User, View, Order } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface OrderDetailProps {
  store: Store;
  user: User | null;
  order: Order;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  cartCount: number;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ store, user, order, onNavigate, onLogout, cartCount }) => {
  // Timeline steps
  const steps = [
    { label: 'Pago Exitoso', status: 'completed', date: '22 Abr, 2024 · 11:20 AM', icon: CreditCard },
    { label: 'En Proceso', status: order.status !== 'Pagado' ? 'completed' : 'pending', date: '23 Abr, 2024 · 09:15 AM', icon: Clock },
    { label: 'En Camino', status: (order.status === 'En camino' || order.status === 'Entregado') ? 'completed' : 'pending', date: '24 Abr, 2024 · 02:30 PM', icon: Truck },
    { label: 'Entregado', status: order.status === 'Entregado' ? 'completed' : 'pending', date: '25 Abr, 2024 · 10:00 AM', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen pb-20 transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.ORDER_DETAIL} />
      
      <div className="max-w-7xl mx-auto px-10 py-12">
        <button 
          onClick={() => onNavigate(View.MY_ORDERS)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-10 group cursor-pointer"
          style={{ color: '#475569' }}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] font-black uppercase tracking-widest">Volver a mis pedidos</span>
        </button>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header */}
            <div 
              className="rounded-[32px] border p-10 shadow-sm overflow-hidden relative"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <div className="flex flex-wrap justify-between items-start gap-6 relative z-10">
                <div>
                  <div className="flex flex-col gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-[32px] font-black tracking-tight leading-none" style={{ color: 'var(--text-on-secondary)' }}>Pedido #{order.id}</h2>
                    </div>
                    <div className="flex">
                      <Badge status={order.status} className="!py-2 !px-4 !text-[13px] font-black" />
                    </div>
                  </div>
                  <p className="font-bold opacity-70" style={{ color: 'var(--text-on-secondary)' }}>Realizado el {order.date}</p>
                </div>
                <div className="flex gap-3">
                   <Button 
                     variant="ghost" 
                     className="!px-6 flex items-center gap-2 text-[12px] font-black border hover:opacity-85"
                     style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.1)' }}
                   >
                      <Download size={16} /> Descargar Factura
                   </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            </div>
 
            {/* Tracking Timeline */}
            <div 
              className="rounded-[32px] border p-10 shadow-sm"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <h3 className="text-[14px] font-black uppercase tracking-widest mb-10 flex items-center gap-3" style={{ color: 'var(--text-on-secondary)' }}>
                <Truck size={20} style={{ color: 'var(--accent-on-secondary)' }} /> Seguimiento del pedido
              </h3>
              
              <div className="space-y-0 relative">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 pb-10 last:pb-0 relative">
                    {idx !== steps.length - 1 && (
                      <div className={`absolute left-5 top-10 bottom-0 w-0.5 ${step.status === 'completed' && steps[idx+1].status === 'completed' ? 'bg-emerald-600' : 'border-l-2 border-dashed'}`} style={{ borderColor: 'rgba(0,0,0,0.1)' }} />
                    )}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border"
                      style={{ 
                        backgroundColor: step.status === 'completed' ? 'var(--color-tertiary)' : 'var(--color-primary)', 
                        color: step.status === 'completed' ? 'var(--text-on-tertiary)' : 'var(--text-on-primary)',
                        borderColor: 'rgba(0,0,0,0.05)'
                      }}
                    >
                      <step.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-black" style={{ color: 'var(--text-on-secondary)', opacity: step.status === 'completed' ? 1 : 0.4 }}>{step.label}</h4>
                      <p className="text-[12px] font-bold" style={{ color: 'var(--text-on-secondary)', opacity: step.status === 'completed' ? 0.75 : 0.35 }}>{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Product Details */}
            <div 
              className="rounded-[32px] border p-10 shadow-sm"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
               <h3 className="text-[14px] font-black uppercase tracking-widest mb-8 flex items-center gap-3" style={{ color: 'var(--text-on-secondary)' }}>
                <Package size={20} style={{ color: 'var(--accent-on-secondary)' }} /> Detalle de artículos
              </h3>
              
              <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="py-6 first:pt-0 flex items-center gap-6">
                  <div 
                    className="w-24 h-24 rounded-2xl border flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--accent-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                  >
                    <Package size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[18px] font-black mb-1" style={{ color: 'var(--text-on-secondary)' }}>{order.productName}</h4>
                    <p className="text-[13px] font-bold mb-3 uppercase tracking-wider opacity-60" style={{ color: 'var(--text-on-secondary)' }}>SKU: PROD-{order.id}</p>
                    <div className="flex gap-3">
                      <span 
                        className="px-3 py-1 border rounded-lg text-[10px] font-black tracking-widest uppercase"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      >
                        Cantidad: 1
                      </span>
                      <span 
                        className="px-3 py-1 border rounded-lg text-[10px] font-black tracking-widest uppercase"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      >
                        Diseño: Personalizado
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-black" style={{ color: 'var(--text-on-secondary)' }}>S/ {order.amount.toFixed(2)}</div>
                    <div className="text-[12px] font-bold line-through opacity-50" style={{ color: 'var(--text-on-secondary)' }}>S/ {(order.amount * 1.2).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Payment & Summary */}
            <div 
              className="rounded-[32px] border p-8 shadow-sm"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <h3 className="text-[14px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--text-on-secondary)' }}>Resumen de cuenta</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[14px] font-bold">
                  <span className="opacity-60" style={{ color: 'var(--text-on-secondary)' }}>Subtotal</span>
                  <span style={{ color: 'var(--text-on-secondary)' }}>S/ {(order.amount / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold">
                  <span className="opacity-60" style={{ color: 'var(--text-on-secondary)' }}>Incremento Diseño</span>
                  <span style={{ color: 'var(--text-on-secondary)' }}>S/ 0.00</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold">
                  <span className="opacity-60" style={{ color: 'var(--text-on-secondary)' }}>IGV (18%)</span>
                  <span style={{ color: 'var(--text-on-secondary)' }}>S/ {(order.amount - (order.amount / 1.18)).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="text-[16px] font-black uppercase tracking-widest" style={{ color: 'var(--text-on-secondary)' }}>Total Pagado</span>
                  <span className="text-[28px] font-black leading-none" style={{ color: 'var(--accent-on-secondary)' }}>S/ {order.amount.toFixed(2)}</span>
                </div>
              </div>
 
              <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                    <CreditCard size={16} style={{ color: 'var(--accent-on-secondary)' }} />
                  </div>
                  <span className="text-[13px] font-black" style={{ color: 'var(--text-on-primary)' }}>Pago con Tarjeta VISA</span>
                </div>
                <p className="text-[11px] font-bold ml-11 opacity-60" style={{ color: 'var(--text-on-primary)' }}>Termina en **** 4567</p>
              </div>
            </div>
 
            {/* Shipping Info */}
            <div 
              className="rounded-[32px] border p-8 shadow-sm"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <h3 className="text-[14px] font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--text-on-secondary)' }}>
                <MapPin size={18} style={{ color: 'var(--accent-on-secondary)' }} /> Dirección de envío
              </h3>
              <div className="flex gap-4">
                <div className="space-y-1">
                  <p className="text-[14px] font-black" style={{ color: 'var(--text-on-secondary)' }}>Calle Los Olivos 456, Int. 203</p>
                  <p className="text-[13px] font-bold tracking-tight opacity-75" style={{ color: 'var(--text-on-secondary)' }}>Miraflores, Lima, Perú</p>
                  <p className="text-[12px] font-bold opacity-60" style={{ color: 'var(--text-on-secondary)' }}>Referencia: Frente al parque central.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
