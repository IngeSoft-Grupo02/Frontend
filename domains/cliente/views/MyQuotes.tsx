/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { FileSearch, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { Store, User, Quote, View } from '../types';
import { ApiError, fetchQuotations, toQuote } from '../lib/api';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface MyQuotesProps {
  store: Store;
  user: User | null;
  customerToken: string | null;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  onSelectQuote: (quote: Quote) => void;
  cartCount: number;
}

export const MyQuotes: React.FC<MyQuotesProps> = ({ store, user, customerToken, onNavigate, onLogout, onSelectQuote, cartCount }) => {
  const [selectedStatus, setSelectedStatus] = React.useState('Todas');
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!store.slug || !customerToken) return;
    let active = true;
    setLoading(true);
    setError(null);

    fetchQuotations(store.slug, customerToken)
      .then((data) => {
        if (!active) return;
        setQuotes(data.map(toQuote));
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar tus cotizaciones.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [store.slug, customerToken]);

  const filteredQuotes = selectedStatus === 'Todas'
    ? quotes
    : quotes.filter((quote) => {
        if (selectedStatus === 'Pendientes') return quote.status === 'Pendientes' || quote.status === 'En revision' || quote.status === 'En revisión' || quote.status === 'Propuesta enviada';
        if (selectedStatus === 'Aprobadas') return quote.status === 'Aprobadas';
        if (selectedStatus === 'Rechazadas') return quote.status === 'Rechazadas';
        return true;
      });

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.MY_QUOTES} />

      <div className="max-w-7xl mx-auto px-10 py-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[34px] font-extrabold leading-tight mb-2" style={{ color: '#0F1011' }}>Mis cotizaciones</h2>
            <p className="text-[15px] font-medium opacity-75" style={{ color: '#475569' }}>Administra y revisa el estado de tus solicitudes en {store.name}.</p>
          </div>
        </header>

        <div className="p-3 rounded-2xl mb-8 flex gap-3 overflow-x-auto no-scrollbar border shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
          {['Todas', 'Pendientes', 'Aprobadas', 'Rechazadas'].map((status) => (
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
          <div className="rounded-[12px] border overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
            <table className="w-full border-collapse">
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
                {filteredQuotes.map((quote, index) => (
                  <motion.tr key={quote.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border-b last:border-0 hover:bg-black/5 transition-colors" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <td className="px-10 py-6 font-extrabold" style={{ color: 'var(--text-on-secondary)' }}>{quote.id}</td>
                    <td className="px-6 py-6">
                      <div className="font-bold mb-1" style={{ color: 'var(--text-on-secondary)' }}>{quote.productName}</div>
                      <div className="flex items-center gap-3 text-[11px] font-medium whitespace-nowrap opacity-70" style={{ color: 'var(--text-on-secondary)' }}>
                        <span>{quote.quantity} unidades</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-medium opacity-80" style={{ color: 'var(--text-on-secondary)' }}>{quote.date}</td>
                    <td className="px-6 py-6 font-extrabold" style={{ color: 'var(--text-on-secondary)' }}>S/ {quote.amount.toLocaleString()}</td>
                    <td className="px-6 py-6"><div className="scale-110 origin-left"><Badge status={quote.status} /></div></td>
                    <td className="px-10 py-6 text-center">
                      <Button variant="primary" className="px-5 py-2 !text-[11px] flex items-center gap-2 mx-auto cursor-pointer font-black" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', borderColor: 'transparent' }} onClick={() => onSelectQuote(quote)}>
                        Ver detalle <ArrowRight size={14} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredQuotes.length === 0 && (
          <div className="py-32 text-center" style={{ color: 'var(--text-on-primary)' }}>
            <div className="w-20 h-20 border rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-on-secondary)' }}>
              <FileSearch size={32} />
            </div>
            <h4 className="text-[20px] font-extrabold mb-2" style={{ color: 'var(--text-on-primary)' }}>No hay cotizaciones para este filtro</h4>
            <p className="opacity-75 text-[14px] max-w-sm mx-auto mb-10" style={{ color: 'var(--text-on-primary)' }}>Cuando envíes una cotización desde el carrito, aparecerá aquí.</p>
            <Button variant="primary" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }} onClick={() => onNavigate(View.CATALOG)}>
              Ver catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
