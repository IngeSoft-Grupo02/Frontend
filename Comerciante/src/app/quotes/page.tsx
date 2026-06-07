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

const StatCard = ({ title, value, icon: Icon, onClick }: any) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl border border-brand-neutral-border p-6 card-shadow flex flex-col justify-between text-left transition-all"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider transition-colors">{title}</p>
        <h3 className="text-[32px] font-extrabold tracking-tight">{value}</h3>
      </div>
      <div className="w-10 h-10 rounded-xl bg-brand-neutral-light flex items-center justify-center text-brand-black border border-brand-neutral-border transition-all">
        <Icon size={20} />
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

  const selectedQuote = useMemo(() =>
    storeQuotes.find(q => q.id === selectedQuoteId) || storeQuotes[0],
    [storeQuotes, selectedQuoteId]
  );

  const filteredQuotes = useMemo(() => {
    return storeQuotes.filter(q => {
      const matchesFilter = filter === 'Todas' || q.status === filter;
      const matchesSearch = q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [storeQuotes, filter, searchTerm]);

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

  const handleStatusUpdate = (status: Quote['status']) => {
    if (selectedQuoteId) {
      updateQuote(selectedQuoteId, { status });
    }
  };

  return (
    <MerchantLayout title="Cotizaciones" subtitle="Gestión de solicitudes especiales y ventas B2B">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Canal Especializado</p>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">Tickets Recibidos</h1>
            <p className="text-brand-text-muted text-[15px] font-bold max-w-2xl leading-relaxed">
              Analiza los detalles, revisa los archivos de diseño y emite una respuesta formal para cada cliente.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Cotizaciones Enviadas" value={stats.sent.toString().padStart(2, '0')} icon={FileText} />
          <StatCard title="Total Solicitado" value={`S/ ${stats.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={TrendingUp} />
        </div>

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start min-h-[800px]">
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

              <div className="flex-1 overflow-y-auto max-h-[700px] divide-y divide-brand-neutral-border">
                {filteredQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    onClick={() => setSelectedQuoteId(quote.id)}
                    className={`p-7 cursor-pointer transition-all flex flex-col gap-4 group relative ${
                      selectedQuoteId === quote.id ? 'bg-brand-neutral-light' : 'bg-white hover:bg-brand-neutral-light/30'
                    }`}
                  >
                    {selectedQuoteId === quote.id && <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-brand-black"></div>}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.1em]">Número de Proforma</p>
                        <h5 className="text-[16px] font-black text-brand-black group-hover:translate-x-1 transition-transform tracking-tight">{quote.id}</h5>
                        <p className="text-[12px] font-bold text-brand-text-muted">{quote.date}</p>
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
            </Card>
          </div>

          {/* Detail Section */}
          <div className="lg:col-span-8">
            {selectedQuote ? (
              <Card className="flex flex-col !p-0 shadow-2xl shadow-brand-black/10 border-2 border-brand-neutral-border overflow-hidden">
                <div className="p-10 border-b border-brand-neutral-border bg-white flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-7">
                    <div className="w-20 h-20 rounded-[28px] bg-brand-black text-white flex items-center justify-center font-black text-[24px] shadow-2xl shadow-brand-black/20">
                      {selectedQuote.customer?.split(' ').map(n => n[0]).join('') || '?'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-4">
                        <h2 className="text-[40px] font-black tracking-tighter text-brand-black leading-none">{selectedQuote.customer}</h2>
                        <Badge variant={selectedQuote.status === 'Pendiente' ? 'warning' : selectedQuote.status === 'Aprobada' ? 'success' : 'danger'} className="px-5 py-1.5 text-[12px]">
                          {selectedQuote.status}
                        </Badge>
                      </div>
                      <p className="text-[13px] font-black text-brand-text-muted uppercase tracking-[0.3em] font-mono">Número de Proforma • {selectedQuote.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-3 bg-brand-neutral-light p-5 rounded-3xl border border-brand-neutral-border">
                    <div className="flex items-center gap-3 text-brand-black font-black text-[13px]">
                      <Mail size={16} className="text-brand-text-muted" /> {selectedQuote.customer.toLowerCase().replace(' ', '.')}@correo.pe
                    </div>
                    <div className="flex items-center gap-3 text-brand-black font-black text-[13px]">
                      <Phone size={16} className="text-brand-text-muted" /> +51 912 345 678
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-14">
                  {/* Products List */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-brand-black rounded-full"></div>
                      <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Configuración de Artículos</h4>
                    </div>
                    <div className="bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[32px] overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-brand-neutral-mid/30 border-b border-brand-neutral-border">
                            <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Base de Prenda</th>
                            <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest text-center">Volumen</th>
                            <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest text-right">P. Unitario</th>
                            <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest text-right">Calculado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y border-brand-neutral-border">
                          {selectedQuote.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-white transition-colors">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-5">
                                  <div className="w-14 h-16 bg-brand-black rounded-2xl flex items-center justify-center p-2 group overflow-hidden relative">
                                    <div className="w-full h-full rounded-full bg-white/10 border border-white/20 group-hover:scale-150 transition-transform duration-500"></div>
                                    <TrendingUp size={20} className="text-white relative z-10 opacity-30" />
                                  </div>
                                  <div>
                                    <h5 className="text-[15px] font-black text-brand-black tracking-tight">{item.product}</h5>
                                    <p className="text-[12px] text-brand-text-muted font-bold uppercase tracking-tighter">{item.variant}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-center text-[15px] font-black">{item.quantity} <span className="text-[11px] text-brand-text-muted uppercase font-bold ml-1">UDS</span></td>
                              <td className="px-8 py-6 text-right text-[15px] font-bold text-brand-text-muted opacity-60">S/ {item.price.toFixed(2)}</td>
                              <td className="px-8 py-6 text-right text-[18px] font-black tracking-tighter text-brand-black">S/ {(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Breakdown */}
                    <div className="mt-8 flex justify-end">
                      <div className="w-full md:w-96 space-y-4">
                        <div className="flex justify-between items-center text-[13px] font-bold text-brand-text-muted uppercase tracking-widest">
                          <span>Subtotal Base</span>
                          <span>S/ {selectedQuote.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {(selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) && (
                          <div className="flex justify-between items-center text-[13px] font-bold text-brand-camel uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                              <Layers size={14} />
                              <span>Incremento Personalización ({store.customizationIncrement || 10}%)</span>
                            </div>
                            <span>+ S/ {(selectedQuote.total * (store.customizationIncrement || 10) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[13px] font-bold text-brand-text-muted uppercase tracking-widest">
                          <span>IGV (18%)</span>
                          <span>S/ {(selectedQuote.total * ((selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 0.18).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="pt-4 border-t-2 border-brand-neutral-border flex justify-between items-center">
                          <span className="text-[14px] font-black text-brand-black uppercase tracking-widest">Subtotal con IGV</span>
                          <span className="text-[22px] font-black text-brand-black tracking-tighter">
                            S/ {(selectedQuote.total * ((selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 1.18).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Graphics & Message Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <section className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Assets de Diseño</h4>
                        <Badge variant="primary" className="!lowercase !font-extrabold !px-3 font-mono animate-pulse">FILES_ATTACHED</Badge>
                      </div>
                      <div className="flex flex-col gap-4">
                        {selectedQuote.files?.map((file, idx) => (
                          <div key={idx} className="bg-white border-2 border-brand-neutral-border rounded-[24px] p-6 flex items-center gap-5 hover:border-brand-black/20 transition-all group">
                            <div className="w-12 h-12 bg-brand-neutral-light border border-brand-neutral-border rounded-2xl flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-white transition-all shadow-sm">
                              {file.type === 'svg' ? <Layers size={24} /> : <FileText size={24} />}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-[14px] font-black text-brand-black truncate tracking-tight">{file.name}</h5>
                              <p className="text-[11px] font-black text-brand-text-muted uppercase opacity-60">Fichero Vectorial • 1.4 MB</p>
                            </div>
                            <button className="w-11 h-11 flex items-center justify-center bg-brand-neutral-light rounded-xl border border-brand-neutral-border hover:bg-brand-black hover:text-white transition-all">
                              <Download size={20} />
                            </button>
                          </div>
                        ))}
                        {(!selectedQuote.files || selectedQuote.files.length === 0) && (
                          <div className="py-10 text-center border-2 border-dashed border-brand-neutral-border rounded-3xl">
                            <p className="text-[12px] font-black text-brand-text-muted uppercase tracking-widest opacity-40">No se adjuntaron archivos</p>
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Requerimiento Especial</h4>
                      <div className="bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[32px] p-8 relative min-h-[140px] flex items-center shadow-inner">
                        <MessageSquare size={24} className="absolute left-[-12px] top-1/2 -translate-y-1/2 bg-brand-neutral-light text-brand-neutral-border p-1 border-2 border-brand-neutral-border rounded-full" />
                        <p className="text-[15px] text-brand-black font-bold leading-relaxed italic opacity-80 pl-4">
                          "{selectedQuote.message}"
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* Pricing Model Summary */}
                  <div className="bg-brand-black rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-brand-black/30 border border-white/10 ring-1 ring-white/5">
                    <div className="space-y-1 mb-8 md:mb-0">
                      <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em] mb-2">Presupuesto Final Sugerido</p>
                      <h3 className="text-[44px] font-black tracking-tighter leading-none flex items-baseline gap-2">
                        <span className="text-[28px] opacity-60">S/</span>
                        {(selectedQuote.total * ((selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 1.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h3>
                      <div className="flex flex-wrap items-center gap-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pt-4">
                        <div className="flex flex-col">
                          <span className="opacity-40">Base de Cotización:</span>
                          <span className="text-white/60">S/ {selectedQuote.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {(selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) && (
                          <div className="flex flex-col">
                            <span className="opacity-40">Customización ({store.customizationIncrement || 10}%):</span>
                            <span className="text-brand-camel">S/ {(selectedQuote.total * (store.customizationIncrement || 10) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="opacity-40">IGV (18%):</span>
                          <span className="text-white/60">S/ {(selectedQuote.total * ((selectedQuote.hasCustomization || (selectedQuote.files && selectedQuote.files.length > 0)) ? (1 + (store.customizationIncrement || 10) / 100) : 1) * 0.18).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <Badge variant="info" className="!bg-brand-camel !text-brand-black !border-0 font-black px-4 !py-0.5 mt-1">Acuerdo Directo</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <Button onClick={() => handleStatusUpdate('Rechazada')} variant="outline" className="h-14 px-8 !border-white/10 !bg-white/5 !text-white hover:!bg-red-500/20 hover:!border-red-500/50 hover:!text-red-400 gap-2 font-black uppercase tracking-widest !rounded-xl transition-all text-[13px]">
                        <X size={20} /> Rechazar
                      </Button>
                      <Button onClick={() => handleStatusUpdate('Aprobada')} variant="camel" className="h-14 px-10 gap-2 !rounded-xl font-black text-[14px] uppercase tracking-widest shadow-lg shadow-brand-camel/20 hover:scale-105 active:scale-95 transition-all">
                        <Check size={20} /> Aceptar
                      </Button>
                    </div>
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
    </MerchantLayout>
  );
}