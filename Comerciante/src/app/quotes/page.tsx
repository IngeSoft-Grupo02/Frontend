'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { Quote } from '@/lib/types';
import {
    Check,
    Download,
    FileText,
    Layers,
    Mail,
    MessageSquare,
    Phone,
    Search,
    TrendingUp,
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const formatRequestDate = (value?: string) => {
  if (!value) return '';
  const parts = value.slice(0, 10).split('-');
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const StatCard = ({ title, value, icon: Icon, onClick }: any) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl border border-brand-neutral-border p-4 card-shadow flex flex-col justify-between text-left transition-all"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider transition-colors">{title}</p>
        <h3 className="text-[24px] font-extrabold tracking-tight">{value}</h3>
      </div>
      <div className="w-9 h-9 rounded-xl bg-brand-neutral-light flex items-center justify-center text-brand-black border border-brand-neutral-border transition-all">
        <Icon size={18} />
      </div>
    </div>
  </div>
);

export default function QuotesPage() {
  const { quotes, updateQuote, store } = useStore();
  const storeQuotes = useMemo(() =>
    quotes.filter(q => q.storeId === store.id),
    [quotes, store.id]
  );

  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (storeQuotes.length > 0 && (!selectedQuoteId || !storeQuotes.find(q => q.id === selectedQuoteId))) {
      setSelectedQuoteId(storeQuotes[0].id);
    } else if (storeQuotes.length === 0) {
      setSelectedQuoteId(null);
    }
  }, [storeQuotes, selectedQuoteId]);

  const [filter, setFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionError, setActionError] = useState('');
  const [sortOrder, setSortOrder] = useState<'recientes' | 'antiguas'>('recientes');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  const isInvalidRange = Boolean(dateFrom && dateTo && dateFrom > dateTo);

  const selectedQuote = useMemo(() =>
    storeQuotes.find(q => q.id === selectedQuoteId) || storeQuotes[0],
    [storeQuotes, selectedQuoteId]
  );

  const filteredQuotes = useMemo(() => {
    const result = storeQuotes.filter(q => {
      const matchesFilter = filter === 'Todas' || q.status === filter;
      const matchesSearch = q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customer.toLowerCase().includes(searchTerm.toLowerCase());
      // Rango de fechas: si el rango es inválido, no se aplica (se avisa en la UI).
      const matchesFrom = isInvalidRange || !dateFrom || q.date >= dateFrom;
      const matchesTo = isInvalidRange || !dateTo || q.date <= dateTo;
      return matchesFilter && matchesSearch && matchesFrom && matchesTo;
    });
    result.sort((a, b) =>
      sortOrder === 'recientes' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
    return result;
  }, [storeQuotes, filter, searchTerm, sortOrder, dateFrom, dateTo, isInvalidRange]);

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedQuotes = useMemo(
    () => filteredQuotes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredQuotes, currentPage]
  );

  // Vuelve a la primera página cuando cambian los filtros/orden.
  useEffect(() => {
    setPage(1);
  }, [filter, searchTerm, sortOrder, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const totalQuotes = storeQuotes.length;
    const totalAmount = storeQuotes.reduce((acc, q) => {
      const isCustomized = q.hasCustomization || (q.files && q.files.length > 0);
      const increment = isCustomized ? (store.customizationIncrement || 10) : 0;
      return acc + (q.total * (1 + increment / 100) * 1.18);
    }, 0);
    return {
      sent: totalQuotes,
      total: totalAmount
    };
  }, [storeQuotes, store.customizationIncrement]);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const handleStatusUpdate = async (status: Quote['status'], observations?: string) => {
    if (selectedQuoteId) {
      try {
        setActionError('');
        await updateQuote(selectedQuoteId, { status, observations });
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'No se pudo actualizar la cotización');
      }
    }
  };

  const handleOpenRejectModal = () => {
    setRejectReason('');
    setRejectError('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      setRejectError('Debes indicar un motivo de rechazo');
      return;
    }
    await handleStatusUpdate('Rechazada', reason);
    setIsRejectModalOpen(false);
    setRejectReason('');
    setRejectError('');
  };

  return (
    <MerchantLayout title="Cotizaciones" subtitle="Gestión de solicitudes especiales y ventas B2B">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Canal Especializado</p>
            <h1 className="text-[28px] font-black tracking-tighter text-brand-black leading-none uppercase">Tickets Recibidos</h1>
            <p className="text-brand-text-muted text-[13px] font-bold max-w-2xl leading-relaxed">
              Analiza los detalles, revisa los archivos de diseño y emite una respuesta formal para cada cliente.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Cotizaciones Enviadas" value={stats.sent.toString().padStart(2, '0')} icon={FileText} />
          <StatCard title="Total Solicitado" value={`S/ ${stats.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={TrendingUp} />
        </div>

        <div className="flex flex-col gap-3">
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
                {['Todas', 'Pendiente', 'Aprobada', 'Rechazada'].map(item => (
                  <option key={item} value={item}>{item === 'Todas' ? 'Ver Todas' : item}</option>
                ))}
              </select>
            </div>

            <div className="w-px h-8 bg-brand-neutral-border hidden md:block"></div>

            <div className="flex items-center gap-3 pl-4 pr-1">
              <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest whitespace-nowrap">Ordenar:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'recientes' | 'antiguas')}
                className="appearance-none bg-transparent h-10 px-4 text-[13px] font-bold text-brand-black outline-none cursor-pointer pr-10 min-w-[180px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right center',
                  backgroundSize: '1rem'
                }}
              >
                <option value="recientes">Más recientes primero</option>
                <option value="antiguas">Más antiguas primero</option>
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
          {/* List Section */}
          <div className="lg:col-span-4 h-full">
            <Card className="!p-0 h-full flex flex-col overflow-hidden shadow-2xl shadow-brand-black/5">
              <div className="p-6 border-b border-brand-neutral-border bg-brand-neutral-light/40">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                  <input
                    type="text"
                    placeholder="Buscar cliente o ticket..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white border border-brand-neutral-border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 divide-y divide-brand-neutral-border">
                {paginatedQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    onClick={() => setSelectedQuoteId(quote.id)}
                    className={`p-5 cursor-pointer transition-all flex flex-col gap-3 group relative ${
                      selectedQuoteId === quote.id ? 'bg-brand-neutral-light' : 'bg-white hover:bg-brand-neutral-light/30'
                    }`}
                  >
                    {selectedQuoteId === quote.id && <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-black"></div>}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.1em]">Número de Proforma</p>
                        <h5 className="text-[16px] font-black text-brand-black group-hover:translate-x-1 transition-transform tracking-tight">{quote.id}</h5>
                        <p className="text-[12px] font-bold text-brand-text-muted">{formatRequestDate(quote.date)}</p>
                      </div>
                      <Badge variant={quote.status === 'Pendiente' ? 'warning' : quote.status === 'Aprobada' ? 'success' : 'danger'}>
                        {quote.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 p-3 rounded-2xl border border-dotted border-brand-neutral-border">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-brand-text-muted uppercase">Total con IGV</span>
                        {(quote.hasCustomization || (quote.files && quote.files.length > 0)) && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-brand-camel uppercase">
                            <Layers size={10} /> +{store.customizationIncrement || 10}%
                          </div>
                        )}
                      </div>
                      <span className="text-[15px] font-black">
                        S/ {(quote.total * ((quote.hasCustomization || (quote.files && quote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 1.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredQuotes.length === 0 && (
                  <div className="p-16 text-center space-y-4">
                    <div className="w-14 h-14 bg-brand-neutral-mid rounded-full flex items-center justify-center mx-auto text-brand-text-muted opacity-30">
                      <FileText size={28} />
                    </div>
                    <p className="text-[14px] font-black text-brand-text-muted uppercase tracking-widest leading-relaxed">Bandeja Vacía</p>
                  </div>
                )}
              </div>

              {filteredQuotes.length > 0 && (
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

          {/* Detail Section */}
          <div className="lg:col-span-8">
            {selectedQuote ? (
              <Card className="flex flex-col !p-0 shadow-2xl shadow-brand-black/10 border-2 border-brand-neutral-border overflow-hidden">
                <div className="p-6 border-b border-brand-neutral-border bg-white flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-black text-white flex items-center justify-center font-black text-[18px] shadow-lg shadow-brand-black/20">
                      {selectedQuote.customer?.split(' ').map(n => n[0]).join('') || '?'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-[24px] font-black tracking-tighter text-brand-black leading-none">{selectedQuote.customer}</h2>
                        <Badge variant={selectedQuote.status === 'Pendiente' ? 'warning' : selectedQuote.status === 'Aprobada' ? 'success' : 'danger'} className="px-4 py-1 text-[11px]">
                          {selectedQuote.status}
                        </Badge>
                      </div>
                      <p className="text-[12px] font-black text-brand-text-muted uppercase tracking-[0.2em] font-mono">Número de Proforma • {selectedQuote.id}</p>
                      <p className="text-[12px] font-bold text-brand-text-muted">Fecha de solicitud: {formatRequestDate(selectedQuote.date)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 bg-brand-neutral-light p-4 rounded-2xl border border-brand-neutral-border md:min-w-[260px]">
                    <div className="flex items-center gap-2.5 text-brand-black font-bold text-[12px] text-left">
                      <Mail size={15} className="text-brand-text-muted shrink-0" /> {selectedQuote.customerEmail || 'No registrado'}
                    </div>
                    <div className="flex items-center gap-2.5 text-brand-black font-bold text-[12px] text-left">
                      <Phone size={15} className="text-brand-text-muted shrink-0" /> {selectedQuote.customerPhone || 'No registrado'}
                    </div>
                    <div className="flex items-center gap-2.5 text-brand-black font-bold text-[12px] text-left">
                      <FileText size={15} className="text-brand-text-muted shrink-0" /> {selectedQuote.documentNumber ? `${selectedQuote.documentType || 'Doc'}: ${selectedQuote.documentNumber}` : 'Documento no registrado'}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-10">
                  {/* Products List */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-brand-black rounded-full"></div>
                      <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Configuración de Artículos</h4>
                    </div>
                    <div className="bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[24px] overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-brand-neutral-mid/30 border-b border-brand-neutral-border">
                            <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider whitespace-nowrap">Producto</th>
                            <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider text-center whitespace-nowrap">Volumen</th>
                            <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider text-center whitespace-nowrap">Stock disponible</th>
                            <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider text-right whitespace-nowrap">P. Unitario</th>
                            <th className="px-4 py-3 text-[10px] font-black text-brand-text-muted uppercase tracking-wider text-right whitespace-nowrap">Calculado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y border-brand-neutral-border">
                          {selectedQuote.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-11 bg-brand-black rounded-xl flex items-center justify-center shrink-0">
                                    <TrendingUp size={16} className="text-white opacity-30" />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-[13px] font-black text-brand-black tracking-tight">{item.product}</h5>
                                    <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-tight">{item.variant}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-[13px] font-black whitespace-nowrap">{item.quantity} <span className="text-[10px] text-brand-text-muted uppercase font-bold ml-0.5">uds</span></td>
                              <td className="px-4 py-3 text-center text-[13px] font-black whitespace-nowrap">
                                {item.stock == null
                                  ? <span className="text-[11px] font-bold text-brand-text-muted opacity-50 normal-case">No registrado</span>
                                  : <span className={item.stock === 0 ? 'text-red-500' : item.stock <= 5 ? 'text-orange-500' : ''}>{item.stock} <span className="text-[10px] text-brand-text-muted uppercase font-bold ml-0.5">uds</span></span>}
                              </td>
                              <td className="px-4 py-3 text-right text-[13px] font-bold text-brand-text-muted whitespace-nowrap">S/ {item.price.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right text-[15px] font-black tracking-tight text-brand-black whitespace-nowrap">S/ {(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Breakdown */}
                    <div className="mt-5 flex justify-end">
                      <div className="w-full md:w-80 space-y-2.5">
                        <div className="flex justify-between items-center text-[12px] font-bold text-brand-text-muted uppercase tracking-wider whitespace-nowrap gap-3">
                          <span>Subtotal Base</span>
                          <span>S/ {selectedQuote.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {(selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) && (
                          <div className="flex justify-between items-center text-[12px] font-bold text-brand-camel uppercase tracking-wider whitespace-nowrap gap-3">
                            <div className="flex items-center gap-2">
                              <Layers size={13} />
                              <span>Personalización ({store.customizationIncrement || 10}%)</span>
                            </div>
                            <span>+ S/ {(selectedQuote.total * (store.customizationIncrement || 10) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[12px] font-bold text-brand-text-muted uppercase tracking-wider whitespace-nowrap gap-3">
                          <span>IGV (18%)</span>
                          <span>S/ {(selectedQuote.total * ((selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 0.18).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="pt-3 border-t-2 border-brand-neutral-border flex justify-between items-center gap-3">
                          <span className="text-[13px] font-black text-brand-black uppercase tracking-wider">Subtotal con IGV</span>
                          <span className="text-[18px] font-black text-brand-black tracking-tight whitespace-nowrap">
                            S/ {(selectedQuote.total * ((selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 1.18).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Graphics & Message Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="space-y-4">
                      <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Diseño</h4>
                      <div className="flex flex-col gap-4">
                        {selectedQuote.files?.map((file, idx) => {
                          const hasRealUrl = Boolean(file.url) && file.url !== '#' && !file.url.startsWith('blob:');
                          const isImage = /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name) || file.type === 'image';
                          return (
                            <div key={idx} className="bg-white border-2 border-brand-neutral-border rounded-[24px] p-6 flex items-center gap-5 hover:border-brand-black/20 transition-all group">
                              {hasRealUrl && isImage ? (
                                <img src={file.url} alt={file.name} className="w-14 h-14 rounded-2xl object-cover border border-brand-neutral-border" />
                              ) : (
                                <div className="w-12 h-12 bg-brand-neutral-light border border-brand-neutral-border rounded-2xl flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all shadow-sm">
                                  {file.type === 'svg' ? <Layers size={24} /> : <FileText size={24} />}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[14px] font-black text-brand-black truncate tracking-tight">{file.name}</h5>
                                <p className="text-[11px] font-black text-brand-text-muted uppercase opacity-60">{hasRealUrl ? 'Archivo adjunto' : 'Vista previa no disponible'}</p>
                              </div>
                              {hasRealUrl && (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-11 h-11 flex items-center justify-center bg-brand-neutral-light rounded-xl border border-brand-neutral-border hover:bg-brand-black hover:text-white transition-all"
                                  title="Ver o descargar"
                                >
                                  <Download size={20} />
                                </a>
                              )}
                            </div>
                          );
                        })}
                        {(!selectedQuote.files || selectedQuote.files.length === 0) && (
                          <div className="py-10 text-center border-2 border-dashed border-brand-neutral-border rounded-3xl">
                            <p className="text-[12px] font-black text-brand-text-muted uppercase tracking-widest opacity-40">No se adjuntaron archivos</p>
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Requerimiento del cliente</h4>
                      <div className="bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[20px] p-5 relative min-h-[100px] flex items-center shadow-inner">
                        <MessageSquare size={20} className="absolute left-[-10px] top-1/2 -translate-y-1/2 bg-brand-neutral-light text-brand-neutral-border p-1 border-2 border-brand-neutral-border rounded-full" />
                        {selectedQuote.message ? (
                          <p className="text-[13px] text-brand-black font-bold leading-relaxed pl-3">{selectedQuote.message}</p>
                        ) : (
                          <p className="text-[13px] text-brand-text-muted font-bold leading-relaxed pl-3">El cliente no dejó una descripción para esta cotización.</p>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Pricing Model Summary */}
                  <div className="bg-brand-black rounded-[24px] p-6 flex flex-col md:flex-row items-center justify-between gap-5 text-white shadow-xl shadow-brand-black/30 border border-white/10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">Presupuesto Final</p>
                      <h3 className="text-[30px] font-black tracking-tighter leading-none flex items-baseline gap-1.5">
                        <span className="text-[20px] opacity-60">S/</span>
                        {(selectedQuote.total * ((selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 1.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-white/70 uppercase tracking-[0.15em] pt-3">
                        <div className="flex flex-col">
                          <span className="text-white/70">Base de Cotización:</span>
                          <span className="text-white">S/ {selectedQuote.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {(selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) && (
                          <div className="flex flex-col">
                            <span className="text-white/70">Customización ({store.customizationIncrement || 10}%):</span>
                            <span className="text-brand-camel">S/ {(selectedQuote.total * (store.customizationIncrement || 10) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-white/70">IGV (18%):</span>
                          <span className="text-white">S/ {(selectedQuote.total * ((selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 0.18).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                    {selectedQuote.status === 'Pendiente' ? (
                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Button onClick={handleOpenRejectModal} variant="outline" className="h-12 px-6 !border-white/10 !bg-white/5 !text-white hover:!bg-red-500/20 hover:!border-red-500/50 hover:!text-red-400 gap-2 font-black uppercase tracking-widest !rounded-xl transition-all text-[12px]">
                          <X size={18} /> Rechazar
                        </Button>
                        <Button onClick={() => handleStatusUpdate('Aprobada')} variant="camel" className="h-12 px-8 gap-2 !rounded-xl font-black text-[13px] uppercase tracking-widest shadow-lg shadow-brand-camel/20 hover:scale-105 active:scale-95 transition-all">
                          <Check size={18} /> Aceptar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 w-full md:w-auto md:items-end md:max-w-xs">
                        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[13px] ${selectedQuote.status === 'Aprobada' ? 'bg-[#2D6A4F]/20 text-[#7BE0A6]' : 'bg-red-500/20 text-red-300'}`}>
                          {selectedQuote.status === 'Aprobada' ? <Check size={18} /> : <X size={18} />}
                          Cotización {selectedQuote.status}
                        </div>
                        {selectedQuote.observations && (
                          <div className="text-[11px] font-bold text-white/70 normal-case tracking-normal leading-relaxed md:text-right">
                            <span className="text-white/50 uppercase tracking-widest text-[10px] block mb-1">
                              {selectedQuote.status === 'Rechazada' ? 'Motivo del rechazo' : 'Observación'}
                            </span>
                            {selectedQuote.observations}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <div className="flex-1 h-full flex flex-col items-center justify-center text-center p-20 bg-brand-neutral-light/20 border-3 border-dashed border-brand-neutral-border rounded-[60px] opacity-40">
                <FileText size={80} className="mb-6 opacity-10" />
                <h3 className="text-[24px] font-black tracking-tighter uppercase mb-2">Selección Requerida</h3>
                <p className="text-[15px] font-bold max-w-[320px]">Activa una cotización para auditar los detalles técnicos y comerciales.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-brand-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-[36px] shadow-2xl border-4 border-white overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-brand-neutral-border flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Rechazar cotización</p>
                <h3 className="text-[28px] font-black tracking-tighter text-brand-black">Motivo del rechazo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="w-11 h-11 rounded-full border-2 border-brand-neutral-border flex items-center justify-center hover:bg-brand-neutral-light transition-all"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-bold text-brand-black uppercase tracking-wider">Motivo (obligatorio)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explica al cliente por qué se rechaza esta cotización..."
                  rows={4}
                  className={`bg-white border rounded-xl px-4 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black transition-all resize-none ${rejectError ? 'border-red-500' : 'border-brand-neutral-border'}`}
                  autoFocus
                />
                {rejectError && <span className="text-[10px] text-red-500 font-bold uppercase">{rejectError}</span>}
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="secondary" onClick={() => setIsRejectModalOpen(false)} className="h-12 px-6 font-black uppercase text-[13px] !rounded-xl">
                  Cancelar
                </Button>
                <Button onClick={handleConfirmReject} className="h-12 px-8 font-black uppercase text-[13px] !rounded-xl">
                  Confirmar rechazo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MerchantLayout>
  );
}
