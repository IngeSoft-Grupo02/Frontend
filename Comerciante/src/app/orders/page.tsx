'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/lib/types';
import {
    ArrowRight,
    Box,
    Check,
    CheckCircle2,
    FileText,
    Layers,
    MapPin,
    Package as PackageIcon,
    Printer,
    Search,
    ShoppingBag,
    Truck,
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function OrdersPage() {
  const { orders, updateOrder, store } = useStore();
  const storeOrders = useMemo(() =>
    orders.filter(o => o.storeId === store.id),
    [orders, store.id]
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Sync selected order when store changes or storeOrders update
  useEffect(() => {
    if (storeOrders.length > 0 && (!selectedOrderId || !storeOrders.find(o => o.id === selectedOrderId))) {
      setSelectedOrderId(storeOrders[0].id);
    } else if (storeOrders.length === 0) {
      setSelectedOrderId(null);
    }
  }, [storeOrders, selectedOrderId]);

  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionError, setActionError] = useState('');

  const selectedOrder = useMemo(() =>
    storeOrders.find(o => o.id === selectedOrderId) || storeOrders[0],
    [storeOrders, selectedOrderId]
  );

  const filteredOrders = useMemo(() => {
    return storeOrders.filter(o => {
      const matchesFilter = filter === 'Todos' || o.status === filter;
      const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [storeOrders, filter, searchTerm]);

  const nextStatusMap: Record<Order['status'], Order['status'] | null> = {
    'Aprobado': 'Pagado',
    'Pagado': 'En proceso',
    'En proceso': 'Enviado',
    'Enviado': 'Entregado',
    'Entregado': null,
    'Cancelado': null
  };

  const handleNextStatus = async () => {
    if (selectedOrder) {
      const next = nextStatusMap[selectedOrder.status];
      if (next) {
        try {
          setActionError('');
          await updateOrder(selectedOrder.id, { status: next });
        } catch (error) {
          setActionError(error instanceof Error ? error.message : 'No se pudo actualizar el pedido');
        }
      }
    }
  };

  const handleStepClick = async (stepLabel: string) => {
    const statusMap: Record<string, Order['status']> = {
      'Aprobado': 'Aprobado',
      'Pagado': 'Pagado',
      'En proceso': 'En proceso',
      'Enviado': 'Enviado',
      'Entregado': 'Entregado'
    };
    const newStatus = statusMap[stepLabel];
    if (newStatus && selectedOrder) {
      try {
        setActionError('');
        await updateOrder(selectedOrder.id, { status: newStatus });
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'No se pudo actualizar el pedido');
      }
    }
  };

  const getStatusSteps = (status: Order['status']) => {
    const allSteps = ['Aprobado', 'Pagado', 'En proceso', 'Enviado', 'Entregado'];
    const currentIdx = allSteps.indexOf(status);
    return [
      { label: 'Aprobado', icon: Check, completed: currentIdx >= 0, active: status === 'Aprobado' },
      { label: 'Pagado', icon: Check, completed: currentIdx >= 1, active: status === 'Pagado' },
      { label: 'En proceso', icon: PackageIcon, completed: currentIdx >= 2, active: status === 'En proceso' },
      { label: 'Enviado', icon: Truck, completed: currentIdx >= 3, active: status === 'Enviado' },
      { label: 'Entregado', icon: ShoppingBag, completed: currentIdx >= 4, active: status === 'Entregado' },
    ];
  };

  const handleCancel = async () => {
    if (selectedOrder && selectedOrder.status !== 'Cancelado' && selectedOrder.status !== 'Entregado') {
      try {
        setActionError('');
        await updateOrder(selectedOrder.id, { status: 'Cancelado' });
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'No se pudo cancelar el pedido');
      }
    }
  };

  const currentSteps = selectedOrder ? getStatusSteps(selectedOrder.status) : [];

  return (
    <MerchantLayout title="Pedidos" subtitle="Gestión operativa y seguimiento de entregas">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Flujo logístico</p>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">Ventas y Envíos</h1>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-4 bg-brand-neutral-mid/20 p-2 rounded-[24px] border border-brand-neutral-border w-fit">
          <div className="flex items-center gap-3 pl-4 pr-1">
            <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest whitespace-nowrap">Estado:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-transparent h-10 px-4 text-[13px] font-bold text-brand-black outline-none cursor-pointer pr-10 min-w-[140px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right center',
                backgroundSize: '1rem'
              }}
            >
              {['Todos', 'Aprobado', 'Pagado', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'].map(item => (
                <option key={item} value={item}>{item === 'Todos' ? 'Ver Todos' : item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[750px]">
          {actionError && (
            <div className="lg:col-span-12 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-[13px] font-bold">
              {actionError}
            </div>
          )}
          {/* Sidebar Orders List */}
          <div className="lg:col-span-4 h-full">
            <Card className="!p-0 h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-brand-neutral-border bg-brand-neutral-light/30">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                  <input
                    type="text"
                    placeholder="ID de pedido o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white border border-brand-neutral-border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[600px] divide-y divide-brand-neutral-border">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-6 cursor-pointer transition-all flex flex-col gap-4 group relative ${
                      selectedOrderId === order.id ? 'bg-brand-neutral-light' : 'bg-white hover:bg-brand-neutral-light/40'
                    }`}
                  >
                    {selectedOrderId === order.id && <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-black"></div>}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h5 className="text-[13px] font-black text-brand-black group-hover:translate-x-1 transition-transform tracking-tight">{order.id}</h5>
                        <h6 className="text-[15px] font-black text-brand-black leading-none">{order.customer}</h6>
                        <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">{order.date}</p>
                      </div>
                      <Badge variant={
                        order.status === 'Aprobado' ? 'info' :
                        order.status === 'Pagado' ? 'success' :
                        order.status === 'En proceso' ? 'warning' :
                        order.status === 'Enviado' ? 'secondary' :
                        order.status === 'Entregado' ? 'success' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center bg-white/50 p-2 rounded-xl border border-dotted border-brand-neutral-border">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-brand-text-muted uppercase">{order.items} artículos</span>
                        {order.hasCustomization && (
                          <div className="flex items-center gap-1 text-[9px] font-black text-brand-camel uppercase">
                            <Layers size={10} /> +{store.customizationIncrement || 10}%
                          </div>
                        )}
                      </div>
                      <span className="text-[14px] font-black">
                        S/ {(order.total * (order.hasCustomization ? (1 + (store.customizationIncrement || 10) / 100) : 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredOrders.length === 0 && (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-brand-neutral-mid rounded-full flex items-center justify-center mx-auto text-brand-text-muted opacity-40">
                      <Box size={24} />
                    </div>
                    <p className="text-[13px] font-bold text-brand-text-muted uppercase tracking-widest leading-relaxed">No hay pedidos<br />con estos filtros</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Detailed Order View */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {selectedOrder ? (
              <>
                <Card className="!p-0 overflow-hidden shadow-2xl shadow-brand-black/5 border-2 border-brand-neutral-border">
                  {/* Detail Header */}
                  <div className="p-8 border-b border-brand-neutral-border bg-white flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-[12px] font-black text-brand-text-muted uppercase tracking-[0.2em]">{selectedOrder.id} • {selectedOrder.date}</p>
                        {selectedOrder.status === 'Aprobado' && (
                          <Badge variant="danger" className="animate-pulse !py-1 !px-3 font-black">NUEVO PEDIDO</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-[40px] font-black tracking-tighter text-brand-black leading-none">{selectedOrder.customer}</h2>
                        <div className="flex items-center gap-4 pt-1">
                          <Badge variant={
                            selectedOrder.status === 'Aprobado' ? 'info' :
                            selectedOrder.status === 'Pagado' ? 'success' :
                            selectedOrder.status === 'En proceso' ? 'warning' :
                            selectedOrder.status === 'Enviado' ? 'secondary' :
                            selectedOrder.status === 'Entregado' ? 'success' : 'outline'
                          } className="px-5 py-1.5 text-[12px]">
                            {selectedOrder.status}
                          </Badge>
                          <span className="text-[14px] font-bold text-brand-text-muted tracking-tight">
                            Total Facturado: S/ {(selectedOrder.total * (selectedOrder.hasCustomization ? (1 + (store.customizationIncrement || 10) / 100) : 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.status !== 'Cancelado' && selectedOrder.status !== 'Entregado' && (
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-5 py-3 text-red-500 font-black text-[13px] hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 uppercase tracking-widest"
                      >
                        <X size={18} /> Cancelar Operación
                      </button>
                    )}
                  </div>

                  {/* Tracking Section */}
                  <div className="p-8 space-y-12">
                    <section className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Trayectoria del Pedido</h4>
                        {selectedOrder.status === 'Entregado' && (
                          <div className="flex items-center gap-2 text-green-600 font-black text-[12px]">
                            <CheckCircle2 size={16} /> ENTREGADO EXITOSAMENTE
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between relative">
                        <div className="absolute left-[5%] right-[5%] top-[20px] h-[3px] bg-brand-neutral-mid z-0"></div>
                        <div
                          className="absolute left-[5%] top-[20px] h-[3px] bg-brand-black z-0 transition-all duration-700"
                          style={{
                            width: selectedOrder.status === 'Aprobado' ? '0%' :
                              selectedOrder.status === 'Pagado' ? '25%' :
                              selectedOrder.status === 'En proceso' ? '50%' :
                              selectedOrder.status === 'Enviado' ? '75%' : '95%'
                          }}
                        ></div>
                        {currentSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-4 z-10 w-1/5 cursor-pointer group"
                            onClick={() => handleStepClick(step.label)}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                              step.completed ? 'bg-brand-black border-brand-black text-white shadow-xl shadow-brand-black/20' :
                              step.active ? 'bg-white border-brand-camel text-brand-camel shadow-xl shadow-brand-camel/20 scale-110' :
                              'bg-white border-brand-neutral-border text-brand-neutral-border hover:border-brand-camel/30'
                            }`}>
                              <step.icon size={22} strokeWidth={step.active || step.completed ? 3 : 2} />
                            </div>
                            <div className="text-center">
                              <h5 className={`text-[13px] font-black transition-colors ${step.active ? 'text-brand-black' : 'text-brand-text-muted opacity-60 group-hover:opacity-100 group-hover:text-brand-camel'}`}>{step.label}</h5>
                            </div>
                          </div>
                        ))}
                      </div>

                      {nextStatusMap[selectedOrder.status] && (
                        <div className="bg-brand-black rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-brand-black/40 animate-in zoom-in-95 duration-500">
                          <div className="flex items-center gap-8 mb-6 md:mb-0">
                            <div className="w-2 h-16 bg-brand-camel rounded-full opacity-60"></div>
                            <div className="space-y-1">
                              <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.3em]">Siguiente paso</p>
                              <h4 className="text-[36px] font-black tracking-tighter leading-none">{nextStatusMap[selectedOrder.status]}</h4>
                            </div>
                          </div>
                          <Button
                            onClick={handleNextStatus}
                            variant="camel"
                            className="px-12 h-20 gap-6 !rounded-full font-black text-[20px] shadow-2xl shadow-brand-camel/20 transform active:scale-95 transition-all group lg:min-w-[280px]"
                          >
                            <div className="flex flex-col items-center leading-none">
                              <span className="text-[14px] uppercase opacity-80 mb-0.5">Confirmar</span>
                              <span>{nextStatusMap[selectedOrder.status]}</span>
                            </div>
                            <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                          </Button>
                        </div>
                      )}
                    </section>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[32px] space-y-6">
                        <div className="flex items-center gap-3 text-brand-text-muted">
                          <FileText size={18} />
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Ficha de Cliente</h4>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-[18px] font-black text-brand-black">{selectedOrder.customer}</h5>
                            <p className="text-[14px] font-bold text-brand-text-muted">{selectedOrder.customer.toLowerCase().replace(' ', '.')}@comprador.pe</p>
                          </div>
                          <p className="text-[15px] font-black bg-white inline-block px-4 py-1 rounded-lg border border-brand-neutral-border shadow-sm">+51 900 800 700</p>
                        </div>
                      </div>

                      <div className="p-8 bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[32px] space-y-6">
                        <div className="flex items-center gap-3 text-brand-text-muted">
                          <MapPin size={18} />
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Destino Final</h4>
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-[18px] font-black text-brand-black">Lima Central</h5>
                          <p className="text-[14px] font-bold text-brand-text-muted leading-relaxed">Av. Petit Thouars 1234, Oficina 501<br />San Isidro, Lima, L15</p>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <section className="space-y-6">
                      <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Detalle de Compra • {selectedOrder.items} ítems</h4>
                      <div className="bg-white border-2 border-brand-neutral-border rounded-[32px] overflow-hidden">
                        {[1, 2].map((_, idx) => (
                          <div key={idx} className="p-6 flex items-center justify-between border-b border-brand-neutral-border last:border-0 hover:bg-brand-neutral-light transition-colors">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-20 bg-brand-black rounded-2xl flex items-center justify-center p-2">
                                <div className="w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                  <Box size={24} className="text-white/20" />
                                </div>
                              </div>
                              <div>
                                <h5 className="text-[16px] font-black text-brand-black">Polo Oversized {idx === 0 ? 'Onyx' : 'Vintage Black'}</h5>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[11px] font-black bg-brand-neutral-mid px-2 py-0.5 rounded text-brand-black">M</span>
                                  <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">Jersey Algodón • 240gsm</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[12px] font-black text-brand-text-muted">1 × S/ 89.00</span>
                              <p className="text-[18px] font-black text-brand-black">S/ 89.00</p>
                            </div>
                          </div>
                        ))}

                        <div className="p-8 space-y-3 bg-brand-neutral-light border-t-2 border-brand-neutral-border">
                          <span className="text-[14px] font-black uppercase tracking-[0.3em] text-brand-black">Total Transacción</span>
                          <div className="flex justify-between items-center text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em]">
                            <span>Subtotal de Productos</span>
                            <span>S/ {selectedOrder.total.toFixed(2)}</span>
                          </div>
                          {selectedOrder.hasCustomization && (
                            <div className="flex justify-between items-center text-[11px] font-black text-brand-camel uppercase tracking-[0.2em]">
                              <div className="flex items-center gap-1.5">
                                <Layers size={14} className="opacity-60" />
                                <span>Incremento por Personalización ({store.customizationIncrement || 10}%)</span>
                              </div>
                              <span>+ S/ {(selectedOrder.total * (store.customizationIncrement || 10) / 100).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="pt-4 border-t border-brand-neutral-border flex justify-between items-center">
                            <span className="text-[14px] font-black uppercase tracking-[0.3em] text-brand-black">Total Transacción</span>
                            <h3 className="text-[36px] font-black tracking-tighter text-brand-black">
                              S/ {(selectedOrder.total * (selectedOrder.hasCustomization ? (1 + (store.customizationIncrement || 10) / 100) : 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 pb-12">
                  <Button variant="secondary" className="flex-1 h-14 gap-3 font-black text-brand-black/60 !rounded-[20px] bg-brand-neutral-mid/30 border-2 border-brand-neutral-border">
                    <Printer size={20} /> Guía de Despacho
                  </Button>
                  <Button variant="secondary" className="flex-1 h-14 gap-3 font-black text-brand-black/60 !rounded-[20px] bg-brand-neutral-mid/30 border-2 border-brand-neutral-border">
                    <FileText size={20} /> Generar comprobante de pago
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-brand-neutral-light/30 border-2 border-dashed border-brand-neutral-border rounded-[40px]">
                <div className="w-20 h-20 bg-brand-neutral-mid rounded-full flex items-center justify-center text-brand-text-muted opacity-20 mb-6">
                  <ShoppingBag size={40} />
                </div>
                <h3 className="text-[20px] font-black text-brand-black mb-2 uppercase tracking-tighter">Selecciona un pedido</h3>
                <p className="text-[14px] font-bold text-brand-text-muted max-w-[300px]">Usa la lista de la izquierda para gestionar un pedido específico.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}
