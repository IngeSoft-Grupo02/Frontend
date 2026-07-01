/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Truck, PackageCheck, Clock, ArrowRight, CheckCircle2, MessageCircle, Loader2, AlertTriangle, CreditCard } from 'lucide-react';
import { Store, User, View, Order } from '../types';
import { fetchOrders, toOrder } from '../lib/api';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { messageFromError } from '../../shared/errors';
import { useAutoRefresh } from '../../shared/hooks/useAutoRefresh';

interface MyOrdersProps {
  store: Store;
  user: User | null;
  customerToken: string | null;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  onSelectOrder: (order: Order) => void;
  onPayOrder: (order: Order) => void;
  cartCount: number;
}

export const MyOrders: React.FC<MyOrdersProps> = ({
  store,
  user,
  customerToken,
  onNavigate,
  onLogout,
  onSelectOrder,
  onPayOrder,
  cartCount,
}) => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const hasOrdersRef = React.useRef(false);

  const loadOrders = React.useCallback(async (background = false) => {
    if (!store.slug || !customerToken) return;

    if (!background) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchOrders(store.slug, customerToken);
      setOrders(data.map(toOrder));
      hasOrdersRef.current = true;
      setError(null);
    } catch (err) {
      if (!background || !hasOrdersRef.current) {
        if (!background) {
          // Registramos solo el mensaje (string), no el objeto Error: pasar un Error
          // a console.error dispara el overlay de error de Next.js/Turbopack en desarrollo.
          console.warn('No se pudieron cargar los pedidos del cliente:', err instanceof Error ? err.message : String(err));
        }
        setError(messageFromError(err, 'No se pudieron cargar tus pedidos. Inténtalo nuevamente.'));
      }
    } finally {
      if (!background) setLoading(false);
    }
  }, [store.slug, customerToken]);

  React.useEffect(() => {
    void loadOrders(false);
  }, [loadOrders]);

  useAutoRefresh({
    enabled: Boolean(store.slug && customerToken),
    intervalMs: 9000,
    onRefresh: () => loadOrders(true),
  });

  const statusStep = (status: Order['status']): number => {
    const steps: Order['status'][] = ['Pagado', 'En proceso', 'En camino', 'Entregado'];
    const idx = steps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.MY_ORDERS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <header className="mb-8">
          <h2 className="text-[30px] sm:text-[34px] font-extrabold leading-tight mb-2" style={{ color: '#0F1011' }}>Mis pedidos</h2>
          <p className="text-[15px] font-medium opacity-75" style={{ color: '#475569' }}>
            Consulta el historial de tus compras y el progreso de tus órdenes activas.
          </p>
        </header>

        {loading && (
          <div className="py-24 flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="animate-spin" />
            <p className="font-bold">Cargando pedidos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-24 flex flex-col items-center gap-3 text-red-600">
            <AlertTriangle />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 border rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-on-secondary)' }}>
              <ShoppingBag size={26} />
            </div>
            <h4 className="text-[20px] font-extrabold mb-2" style={{ color: '#0F1011' }}>No hay pedidos activos por aquí</h4>
            <p className="text-[14px] max-w-md mx-auto mb-7 leading-relaxed" style={{ color: '#64748B' }}>
              Cuando la tienda apruebe una cotización y se genere un pedido, podrás ver aquí su avance y los pasos para pagarlo.
            </p>
            <Button
              variant="primary"
              style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
              onClick={() => onNavigate(View.MY_QUOTES)}
            >
              Ver mis cotizaciones
            </Button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order, i) => {
              const step = statusStep(order.status);
              const canPay = order.rawStatus === 'PAYMENT_CONFIRMED';

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row lg:flex-nowrap lg:items-center gap-6 lg:gap-10 group hover:shadow-lg transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--text-on-secondary)',
                    borderColor: 'rgba(0,0,0,0.05)',
                  }}
                  onClick={() => onSelectOrder(order)}
                >
                  {/* Info básica */}
                  <div className="flex w-full items-center gap-4 sm:gap-6 lg:min-w-[280px] lg:w-auto">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                    >
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold uppercase tracking-widest mb-1 opacity-60">Pedido #{order.id}</div>
                      <h4 className="text-[17px] font-extrabold mb-1" style={{ color: 'var(--text-on-secondary)' }}>{order.productName}</h4>
                      <div className="text-[13px] font-medium opacity-60">{order.date}</div>
                    </div>
                  </div>

                  {/* Timeline de estado */}
                  <div className="w-full flex-1 flex items-center gap-2 overflow-x-auto px-0 py-4 no-scrollbar lg:px-6 lg:py-0 lg:border-x lg:mx-auto" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    {[
                      { label: 'Pagado', icon: CreditCard },
                      { label: 'En proceso', icon: Clock },
                      { label: 'En camino', icon: Truck },
                      { label: 'Entregado', icon: CheckCircle2 },
                    ].map((s, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex flex-col items-center gap-1 min-w-[56px]">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                            style={
                              step >= idx
                                ? { backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }
                                : { backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', opacity: 0.3 }
                            }
                          >
                            <s.icon size={15} />
                          </div>
                          <span
                            className="text-[9px] font-black uppercase tracking-tighter"
                            style={step >= idx ? { color: 'var(--accent-on-secondary)' } : { color: 'var(--text-on-secondary)', opacity: 0.35 }}
                          >
                            {s.label}
                          </span>
                        </div>
                        {idx < 3 && (
                          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
                            <div className="h-full" style={{ backgroundColor: 'var(--color-tertiary)', width: step > idx ? '100%' : '0%', transition: 'width 0.4s' }} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Monto y estado */}
                  <div className="flex w-full flex-row items-center justify-between gap-2 pr-0 lg:w-auto lg:min-w-[150px] lg:flex-col lg:items-end lg:pr-4">
                    <Badge status={order.status} />
                    <div className="text-[22px] font-extrabold" style={{ color: 'var(--text-on-secondary)' }}>
                      S/ {order.amount.toFixed(2)}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex w-full flex-col gap-3 sm:w-auto" onClick={(e) => e.stopPropagation()}>
                    {canPay && (
                      <Button
                        variant="primary"
                        className="!px-6 !py-2.5 !text-[11px] whitespace-nowrap flex items-center gap-2 cursor-pointer font-black"
                        style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                        onClick={() => onPayOrder(order)}
                      >
                        <CreditCard size={14} /> Pagar ahora
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      className="!px-6 !py-2.5 !text-[11px] whitespace-nowrap flex items-center gap-2 cursor-pointer font-black"
                      style={canPay
                        ? { backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', border: '1px solid rgba(0,0,0,0.1)' }
                        : { backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }
                      }
                      onClick={() => onSelectOrder(order)}
                    >
                      Ver detalle <ArrowRight size={14} />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div
          className="mt-12 sm:mt-20 p-6 sm:p-8 lg:p-12 rounded-3xl flex items-center justify-between overflow-hidden relative border shadow-sm"
          style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
        >
          <div className="relative z-10 w-full md:w-auto">
            <h3 className="text-[24px] sm:text-[28px] font-black mb-2 tracking-tight" style={{ color: 'var(--text-on-secondary)' }}>¿Necesitas ayuda con un pedido?</h3>
            <p className="font-bold mb-8 max-w-md opacity-75" style={{ color: 'var(--text-on-secondary)' }}>
              Nuestro equipo está listo para asistirte con cualquier duda sobre tus órdenes.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <div
                className="w-full rounded-2xl p-4 sm:px-6 border flex items-center gap-4 shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}>
                  <MessageCircle size={20} style={{ color: 'var(--text-on-tertiary)' }} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">WhatsApp Tienda</div>
                  <div className="text-[18px] font-black">{store.whatsapp ? `+51 ${store.whatsapp}` : '+51 987 654 321'}</div>
                </div>
              </div>
            </div>
          </div>
          <ShoppingBag size={160} className="absolute -right-10 -bottom-10 opacity-5 rotate-12 sm:size-[200px]" />
        </div>
      </div>
    </div>
  );
};
