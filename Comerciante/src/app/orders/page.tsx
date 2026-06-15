'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { generateDispatchGuide, generatePaymentReceipt } from '@/lib/orderDocuments';
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

const formatOrderDate = (value?: string) => {
  if (!value) return 'No disponible';
  const parts = value.slice(0, 10).split('-');
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

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
  const [sortOrder, setSortOrder] = useState<'recientes' | 'antiguos'>('recientes');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [docNotice, setDocNotice] = useState('');
  const [generatingDoc, setGeneratingDoc] = useState<'guia' | 'comprobante' | null>(null);

  const PAGE_SIZE = 5;
  const isInvalidRange = Boolean(dateFrom && dateTo && dateFrom > dateTo);

  const selectedOrder = useMemo(() =>
    storeOrders.find(o => o.id === selectedOrderId) || storeOrders[0],
    [storeOrders, selectedOrderId]
  );

  const filteredOrders = useMemo(() => {
    const result = storeOrders.filter(o => {
      const matchesFilter = filter === 'Todos' || o.status === filter;
      const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchTerm.toLowerCase());
      // Rango de fechas: si el rango es inválido no se aplica (se avisa en la UI).
      const matchesFrom = isInvalidRange || !dateFrom || o.date >= dateFrom;
      const matchesTo = isInvalidRange || !dateTo || o.date <= dateTo;
      return matchesFilter && matchesSearch && matchesFrom && matchesTo;
    });
    result.sort((a, b) =>
      sortOrder === 'recientes' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
    return result;
  }, [storeOrders, filter, searchTerm, sortOrder, dateFrom, dateTo, isInvalidRange]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = useMemo(
    () => filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredOrders, currentPage]
  );

  // Vuelve a la primera página cuando cambian filtros/orden/búsqueda.
  useEffect(() => {
    setPage(1);
  }, [filter, searchTerm, sortOrder, dateFrom, dateTo]);

  const handleGenerateDispatchGuide = async () => {
    if (!selectedOrder) return;
    try {
      setDocNotice('');
      setGeneratingDoc('guia');
      const result = await generateDispatchGuide(selectedOrder, store, store.customizationIncrement || 10);
      if (!result.logoEmbedded && (store.logoUrl || store.logo)) {
        setDocNotice('La guía se generó, pero no se pudo incrustar el logo (posible restricción CORS). Se usó el nombre de la tienda.');
      }
    } catch (error) {
      setDocNotice(error instanceof Error ? error.message : 'No se pudo generar la guía de despacho');
    } finally {
      setGeneratingDoc(null);
    }
  };

  const handleGeneratePaymentReceipt = async () => {
    if (!selectedOrder) return;
    try {
      setDocNotice('');
      setGeneratingDoc('comprobante');
      const result = await generatePaymentReceipt(selectedOrder, store, store.customizationIncrement || 10);
      if (!result.logoEmbedded && (store.logoUrl || store.logo)) {
        setDocNotice('El comprobante se generó, pero no se pudo incrustar el logo (posible restricción CORS). Se usó el nombre de la tienda.');
      }
    } catch (error) {
      setDocNotice(error instanceof Error ? error.message : 'No se pudo generar el comprobante de pago');
    } finally {
      setGeneratingDoc(null);
    }
  };

  const nextStatusMap: Record<Order['status'], Order['status'] | null> = {
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
    const allSteps = ['Pagado', 'En proceso', 'Enviado', 'Entregado'];
    const currentIdx = allSteps.indexOf(status);
    return [
      { label: 'Pagado', icon: Check, completed: currentIdx >= 0, active: status === 'Pagado' },
      { label: 'En proceso', icon: PackageIcon, completed: currentIdx >= 1, active: status === 'En proceso' },
      { label: 'Enviado', icon: Truck, completed: currentIdx >= 2, active: status === 'Enviado' },
      { label: 'Entregado', icon: ShoppingBag, completed: currentIdx >= 3, active: status === 'Entregado' },
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
      <div className="flex flex-col gap-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Flujo logístico</p>
            <h1 className="text-[28px] font-black tracking-tighter text-brand-black leading-none uppercase">Ventas y Envíos</h1>
          </div>
        </header>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
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
                {['Todos', 'Pagado', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'].map(item => (
                  <option key={item} value={item}>{item === 'Todos' ? 'Ver Todos' : item}</option>
                ))}
              </select>
            </div>

            <div className="w-px h-8 bg-brand-neutral-border hidden md:block"></div>

            <div className="flex items-center gap-3 pl-4 pr-1">
              <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest whitespace-nowrap">Ordenar:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'recientes' | 'antiguos')}
                className="appearance-none bg-transparent h-10 px-4 text-[13px] font-bold text-brand-black outline-none cursor-pointer pr-10 min-w-[180px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right center',
                  backgroundSize: '1rem'
                }}
              >
                <option value="recientes">Más recientes primero</option>
                <option value="antiguos">Más antiguos primero</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4 bg-brand-neutral-mid/20 p-3 rounded-[24px] border border-brand-neutral-border w-fit">
            <div className="flex flex-col gap-1 px-2">
              <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Fecha desde</label>
              <input
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-10 px-3 bg-white border border-brand-neutral-border rounded-xl text-[13px] font-bold text-brand-black outline-none focus:border-brand-black transition-all"
              />
            </div>
            <div className="flex flex-col gap-1 px-2">
              <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Fecha hasta</label>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-10 px-3 bg-white border border-brand-neutral-border rounded-xl text-[13px] font-bold text-brand-black outline-none focus:border-brand-black transition-all"
              />
            </div>
            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={() => { setDateFrom(''); setDateTo(''); }}
                className="h-10 px-4 text-[12px] font-bold text-brand-text-muted hover:text-brand-black border border-brand-neutral-border rounded-xl transition-all"
              >
                Limpiar fechas
              </button>
            )}
          </div>
          </div>

          {isInvalidRange && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-2xl text-[12px] font-bold w-fit">
              La fecha "desde" no puede ser mayor que la fecha "hasta".
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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

              <div className="flex-1 divide-y divide-brand-neutral-border">
                {paginatedOrders.map((order) => (
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
                        <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">{formatOrderDate(order.date)}</p>
                      </div>
                      <Badge variant={
                        order.status === 'Pagado' ? 'info' :
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

              {filteredOrders.length > 0 && (
                <div className="p-5 border-t border-brand-neutral-border bg-brand-neutral-light/30 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="h-10 px-4 flex items-center justify-center rounded-xl border border-brand-neutral-border text-brand-text-muted font-bold text-[12px] transition-all hover:bg-brand-neutral-light disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Anterior
                  </button>
                  <span className="text-[12px] font-black text-brand-black uppercase tracking-widest">
                    Página {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="h-10 px-4 flex items-center justify-center rounded-xl border border-brand-neutral-border text-brand-text-muted font-bold text-[12px] transition-all hover:bg-brand-neutral-light disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </Card>
          </div>

          {/* Detailed Order View */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {selectedOrder ? (
              <>
                <Card className="!p-0 overflow-hidden shadow-2xl shadow-brand-black/5 border-2 border-brand-neutral-border">
                  {/* Detail Header */}
                  <div className="p-6 border-b border-brand-neutral-border bg-white flex flex-col md:flex-row md:items-start justify-between gap-5">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em]">{selectedOrder.id} • Fecha del pedido: {formatOrderDate(selectedOrder.date)}</p>
                        {selectedOrder.status === 'Pagado' && (
                          <Badge variant="danger" className="animate-pulse !py-1 !px-3 font-black">NUEVO PEDIDO</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-[26px] font-black tracking-tighter text-brand-black leading-none">{selectedOrder.customer}</h2>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <Badge variant={
                            selectedOrder.status === 'Pagado' ? 'info' :
                            selectedOrder.status === 'En proceso' ? 'warning' :
                            selectedOrder.status === 'Enviado' ? 'secondary' :
                            selectedOrder.status === 'Entregado' ? 'success' : 'outline'
                          } className="px-4 py-1 text-[11px]">
                            {selectedOrder.status}
                          </Badge>
                          <span className="text-[13px] font-bold text-brand-text-muted tracking-tight whitespace-nowrap">
                            Total Facturado: S/ {(selectedOrder.total * (selectedOrder.hasCustomization ? (1 + (store.customizationIncrement || 10) / 100) : 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.status !== 'Cancelado' && selectedOrder.status !== 'Entregado' && (
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2.5 text-red-500 font-black text-[12px] hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 uppercase tracking-widest"
                      >
                        <X size={16} /> Cancelar Operación
                      </button>
                    )}
                  </div>

                  {/* Tracking Section */}
                  <div className="p-6 space-y-8">
                    <section className="space-y-6">
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
                            width: selectedOrder.status === 'Pagado' ? '0%' :
                              selectedOrder.status === 'En proceso' ? '33%' :
                              selectedOrder.status === 'Enviado' ? '66%' : '95%'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="p-5 bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[20px] space-y-3">
                        <div className="flex items-center gap-2.5 text-brand-text-muted">
                          <FileText size={16} />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Ficha de Cliente</h4>
                        </div>
                        <div className="space-y-1.5 text-left">
                          <h5 className="text-[15px] font-black text-brand-black">{selectedOrder.customer}</h5>
                          <p className="text-[12px] font-bold text-brand-text-muted">Correo: {selectedOrder.customerEmail || 'No registrado'}</p>
                          <p className="text-[12px] font-bold text-brand-text-muted">Teléfono: {selectedOrder.customerPhone || 'No registrado'}</p>
                          <p className="text-[12px] font-bold text-brand-text-muted">
                            Documento: {selectedOrder.documentNumber ? `${selectedOrder.documentType || 'Doc'} ${selectedOrder.documentNumber}` : 'No registrado'}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[20px] space-y-3">
                        <div className="flex items-center gap-2.5 text-brand-text-muted">
                          <MapPin size={16} />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Destino Final</h4>
                        </div>
                        <div className="space-y-1 text-left">
                          <h5 className="text-[15px] font-black text-brand-black">Dirección de envío</h5>
                          {selectedOrder.shippingDetail?.address ? (
                            <p className="text-[12px] font-bold text-brand-text-muted leading-relaxed">
                              {selectedOrder.shippingDetail.address}
                              {selectedOrder.shippingDetail.district ? ` · ${selectedOrder.shippingDetail.district.replace(/_/g, ' ')}` : ''}
                              {selectedOrder.shippingDetail.reference ? <><br />Referencia: {selectedOrder.shippingDetail.reference}</> : null}
                            </p>
                          ) : (
                            <p className="text-[12px] font-bold text-brand-text-muted leading-relaxed">No registrada</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <section className="space-y-4">
                      <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Detalle de Compra • {selectedOrder.items} {selectedOrder.items === 1 ? 'ítem' : 'ítems'}</h4>
                      <div className="bg-white border-2 border-brand-neutral-border rounded-[20px] overflow-x-auto">
                        {selectedOrder.itemsDetail && selectedOrder.itemsDetail.length > 0 ? (
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-brand-neutral-mid/30 border-b border-brand-neutral-border">
                                <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider whitespace-nowrap">Producto</th>
                                <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider text-center whitespace-nowrap">Cantidad</th>
                                <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider text-center whitespace-nowrap">Stock disponible</th>
                                <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider text-right whitespace-nowrap">P. Unitario</th>
                                <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider text-right whitespace-nowrap">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y border-brand-neutral-border">
                              {selectedOrder.itemsDetail.map((item, idx) => {
                                const variantLabel = [item.size, item.color].filter(Boolean).join(' · ');
                                return (
                                  <tr key={idx} className="hover:bg-brand-neutral-light/40 transition-colors">
                                    <td className="px-4 py-3">
                                      <h5 className="text-[13px] font-black text-brand-black tracking-tight">{item.productName || 'Producto sin nombre registrado'}</h5>
                                      {variantLabel && <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-tight">{variantLabel}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[13px] font-black whitespace-nowrap">{item.quantity}</td>
                                    <td className="px-4 py-3 text-center text-[13px] font-black whitespace-nowrap">
                                      {item.stock == null
                                        ? <span className="text-[11px] font-bold text-brand-text-muted opacity-50 normal-case">No registrado</span>
                                        : <span className={item.stock === 0 ? 'text-red-500' : item.stock <= 5 ? 'text-orange-500' : ''}>{item.stock} <span className="text-[10px] text-brand-text-muted uppercase font-bold ml-0.5">uds</span></span>}
                                    </td>
                                    <td className="px-4 py-3 text-right text-[13px] font-bold text-brand-text-muted whitespace-nowrap">S/ {item.unitPrice.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right text-[13px] font-black text-brand-black whitespace-nowrap">S/ {item.subTotal.toFixed(2)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-6 text-center">
                            <p className="text-[12px] font-bold text-brand-text-muted">La información del detalle no se encuentra registrada.</p>
                          </div>
                        )}

                        <div className="p-5 space-y-2 bg-brand-neutral-light border-t-2 border-brand-neutral-border">
                          <div className="flex justify-between items-center text-[11px] font-black text-brand-text-muted uppercase tracking-wider whitespace-nowrap gap-3">
                            <span>Subtotal de Productos</span>
                            <span>S/ {(selectedOrder.partialTotal ?? selectedOrder.total).toFixed(2)}</span>
                          </div>
                          {(selectedOrder.totalDiscount ?? 0) > 0 && (
                            <div className="flex justify-between items-center text-[11px] font-black text-brand-text-muted uppercase tracking-wider whitespace-nowrap gap-3">
                              <span>Descuento</span>
                              <span>- S/ {(selectedOrder.totalDiscount ?? 0).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="pt-3 border-t border-brand-neutral-border flex justify-between items-center gap-3">
                            <span className="text-[13px] font-black uppercase tracking-wider text-brand-black">Total</span>
                            <h3 className="text-[24px] font-black tracking-tight text-brand-black whitespace-nowrap">
                              S/ {(selectedOrder.finalTotal ?? selectedOrder.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </Card>

                <div className="flex flex-col gap-3 pb-6">
                  {docNotice && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-2xl text-[12px] font-bold">
                      {docNotice}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="secondary"
                      onClick={handleGenerateDispatchGuide}
                      disabled={generatingDoc !== null}
                      className="flex-1 h-12 gap-2.5 font-black text-brand-black/70 !rounded-[16px] bg-brand-neutral-mid/30 border-2 border-brand-neutral-border disabled:opacity-50"
                    >
                      <Printer size={18} /> {generatingDoc === 'guia' ? 'Generando…' : 'Guía de despacho'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleGeneratePaymentReceipt}
                      disabled={generatingDoc !== null}
                      className="flex-1 h-12 gap-2.5 font-black text-brand-black/70 !rounded-[16px] bg-brand-neutral-mid/30 border-2 border-brand-neutral-border disabled:opacity-50"
                    >
                      <FileText size={18} /> {generatingDoc === 'comprobante' ? 'Generando…' : 'Comprobante de pago'}
                    </Button>
                  </div>
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
