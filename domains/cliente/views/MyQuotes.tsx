/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { FileSearch, ArrowRight, Loader2, AlertTriangle, CalendarDays } from 'lucide-react';
import { Store, User, Quote, View } from '../types';
import { fetchQuotations, toQuote } from '../lib/api';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { messageFromError } from '../../shared/errors';
import { useAutoRefresh } from '../../shared/hooks/useAutoRefresh';
import { money } from '../lib/pricing';

interface MyQuotesProps {
  store: Store;
  user: User | null;
  customerToken: string | null;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  onSelectQuote: (quote: Quote) => void;
  cartCount: number;
}

const quoteStatusFilters = ['Todas', 'Pendientes', 'Aprobadas', 'Rechazadas'] as const;
type QuoteStatusFilter = typeof quoteStatusFilters[number];

const dateTime = (value?: string | null): number => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const isWithinDateRange = (value: string | null | undefined, from: string, to: string): boolean => {
  const time = dateTime(value);
  if (!time) return false;
  if (from) {
    const fromTime = new Date(`${from}T00:00:00`).getTime();
    if (time < fromTime) return false;
  }
  if (to) {
    const toTime = new Date(`${to}T23:59:59.999`).getTime();
    if (time > toTime) return false;
  }
  return true;
};

export const MyQuotes: React.FC<MyQuotesProps> = ({ store, user, customerToken, onNavigate, onLogout, onSelectQuote, cartCount }) => {
  const [selectedStatus, setSelectedStatus] = React.useState<QuoteStatusFilter>('Todas');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const hasQuotesRef = React.useRef(false);

  const loadQuotes = React.useCallback(async (background = false) => {
    if (!store.slug || !customerToken) return;

    if (!background) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchQuotations(store.slug, customerToken);
      setQuotes(data.map(toQuote));
      hasQuotesRef.current = true;
      setError(null);
    } catch (err) {
      if (!background || !hasQuotesRef.current) {
        if (!background) {
          // Registramos solo el mensaje (string), no el objeto Error: pasar un Error
          // a console.error dispara el overlay de error de Next.js/Turbopack en desarrollo.
          console.warn('No se pudieron cargar las cotizaciones del cliente:', err instanceof Error ? err.message : String(err));
        }
        setError(messageFromError(err, 'No se pudieron cargar tus cotizaciones. Inténtalo nuevamente.'));
      }
    } finally {
      if (!background) setLoading(false);
    }
  }, [store.slug, customerToken]);

  React.useEffect(() => {
    void loadQuotes(false);
  }, [loadQuotes]);

  useAutoRefresh({
    enabled: Boolean(store.slug && customerToken),
    intervalMs: 9000,
    onRefresh: () => loadQuotes(true),
  });

  const filteredQuotes = React.useMemo(() => {
    return quotes
      .filter((quote) => {
        if (selectedStatus === 'Pendientes') return quote.status === 'Pendientes' || quote.status === 'En revision' || quote.status === 'En revisión' || quote.status === 'Propuesta enviada';
        if (selectedStatus === 'Aprobadas') return quote.status === 'Aprobadas';
        if (selectedStatus === 'Rechazadas') return quote.status === 'Rechazadas';
        return true;
      })
      .filter((quote) => (!dateFrom && !dateTo) || isWithinDateRange(quote.requestedAt, dateFrom, dateTo))
      .sort((a, b) => dateTime(b.requestedAt) - dateTime(a.requestedAt));
  }, [quotes, selectedStatus, dateFrom, dateTo]);
  const hasActiveFilters = selectedStatus !== 'Todas' || Boolean(dateFrom || dateTo);
  const emptyTitle = quotes.length === 0
    ? 'No hay cotizaciones por aquí'
    : 'No hay cotizaciones con estos filtros';
  const emptyMessage = quotes.length === 0
    ? 'Cuando solicites una cotización desde el catálogo, podrás revisar aquí su estado y respuesta de la tienda.'
    : 'Ajusta el estado o el rango de fechas para revisar otras solicitudes.';
  const emptyActionLabel = quotes.length === 0 ? 'Ver catálogo' : 'Limpiar filtros';

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.MY_QUOTES} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-[30px] sm:text-[34px] font-extrabold leading-tight mb-2" style={{ color: '#0F1011' }}>Mis cotizaciones</h2>
            <p className="text-[15px] font-medium opacity-75" style={{ color: '#475569' }}>Administra y revisa el estado de tus solicitudes en {store.name}.</p>
          </div>
        </header>

        <div className="rounded-2xl mb-6 border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
          <div className="p-3 flex gap-3 overflow-x-auto no-scrollbar">
            {quoteStatusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className="px-8 py-2.5 rounded-xl font-bold text-[12px] whitespace-nowrap transition-all cursor-pointer shadow-sm active:scale-95"
                style={selectedStatus === status ? { backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' } : { backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', border: '1px solid rgba(0,0,0,0.1)' }}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t p-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.08)' }}>
              <CalendarDays size={16} className="shrink-0 opacity-60" />
              <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Desde</span>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] font-bold outline-none" />
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.08)' }}>
              <CalendarDays size={16} className="shrink-0 opacity-60" />
              <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Hasta</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] font-bold outline-none" />
            </label>
          </div>
        </div>

        {loading && (
          <div className="py-24 flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="animate-spin" />
            <p className="font-bold">Cargando cotizaciones...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-24 flex flex-col items-center gap-3 text-red-600">
            <AlertTriangle />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && filteredQuotes.length > 0 && (
          <div className="rounded-[12px] border overflow-x-auto shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
            <table className="min-w-[820px] w-full border-collapse">
              <thead>
                <tr className="text-left border-b text-[11px] font-extrabold uppercase tracking-widest" style={{ backgroundColor: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.05)' }}>
                  <th className="px-10 py-6" style={{ color: 'var(--text-on-secondary)' }}>Código</th>
                  <th className="px-6 py-6" style={{ color: 'var(--text-on-secondary)' }}>Producto / Especificación</th>
                  <th className="px-6 py-6" style={{ color: 'var(--text-on-secondary)' }}>Fecha</th>
                  <th className="px-6 py-6" style={{ color: 'var(--text-on-secondary)' }}>Monto</th>
                  <th className="px-6 py-6" style={{ color: 'var(--text-on-secondary)' }}>Estado</th>
                  <th className="px-10 py-6 text-center" style={{ color: 'var(--text-on-secondary)' }}>Acción</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {filteredQuotes.map((quote, index) => {
                  const visibleAmount = Math.max(
                    0,
                    (quote.productSubtotal ?? quote.subTotal ?? quote.amount) + (quote.designFeeTotal ?? 0) - (quote.discountTotal ?? quote.discount ?? 0)
                  );
                  return (
                  <motion.tr key={quote.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border-b last:border-0 hover:bg-black/5 transition-colors" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <td className="px-10 py-6 font-extrabold" style={{ color: 'var(--text-on-secondary)' }}>{quote.id}</td>
                    <td className="px-6 py-6">
                      <div className="font-bold mb-1" style={{ color: 'var(--text-on-secondary)' }}>{quote.productName}</div>
                      <div className="flex items-center gap-3 text-[11px] font-medium whitespace-nowrap opacity-70" style={{ color: 'var(--text-on-secondary)' }}>
                        <span>{quote.quantity} unidades</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-medium opacity-80" style={{ color: 'var(--text-on-secondary)' }}>{quote.date}</td>
                    <td className="px-6 py-6 font-extrabold" style={{ color: 'var(--text-on-secondary)' }}>S/ {money(visibleAmount)}</td>
                    <td className="px-6 py-6"><div className="scale-110 origin-left"><Badge status={quote.status} /></div></td>
                    <td className="px-10 py-6 text-center">
                      <Button variant="primary" className="px-5 py-2 !text-[11px] flex items-center gap-2 mx-auto cursor-pointer font-black" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', borderColor: 'transparent' }} onClick={() => onSelectQuote(quote)}>
                        Ver resumen <ArrowRight size={14} />
                      </Button>
                    </td>
                  </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredQuotes.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 border rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-on-secondary)' }}>
              <FileSearch size={26} />
            </div>
            <h4 className="text-[20px] font-extrabold mb-2" style={{ color: '#0F1011' }}>{emptyTitle}</h4>
            <p className="text-[14px] max-w-md mx-auto mb-7 leading-relaxed" style={{ color: '#64748B' }}>{emptyMessage}</p>
            {(quotes.length === 0 || hasActiveFilters) && (
              <Button
                variant="primary"
                style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                onClick={() => {
                  if (quotes.length === 0) {
                    onNavigate(View.CATALOG);
                    return;
                  }
                  setSelectedStatus('Todas');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                {emptyActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
