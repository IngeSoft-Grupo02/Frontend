'use client';
import { MerchantLayout } from '@/domains/comerciante/components/MerchantLayout';
import { Badge, Button, Card } from '@/domains/comerciante/components/ui';
import { useStore } from '@/domains/comerciante/context/StoreContext';
import { FileText, Package, Plus, ShoppingBag, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const StatCard = ({ title, value, icon: Icon, onClick }: any) => (
  <button onClick={onClick} className="bg-white rounded-2xl border border-brand-neutral-border p-6 card-shadow flex flex-col justify-between text-left hover:border-brand-black transition-all group">
    <div className="flex justify-between items-start">
      <div className="space-y-1"><p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider group-hover:text-brand-black transition-colors">{title}</p><h3 className="text-[32px] font-extrabold tracking-tight">{value}</h3></div>
      <div className="w-10 h-10 rounded-xl bg-brand-neutral-light flex items-center justify-center text-brand-black border border-brand-neutral-border group-hover:bg-brand-black group-hover:text-white transition-all"><Icon size={20} /></div>
    </div>
  </button>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, store, orders, quotes, products } = useStore();
  const stats = useMemo(() => {
    const storeQuotes = quotes.filter(q => q.storeId === store.id);
    const pendingOrders = orders.filter(o => o.status === 'Pagado' || o.status === 'En proceso' || o.status === 'Enviado').length;
    const pendingQuotes = storeQuotes.filter(q => q.status === 'Pendiente').length;
    const drafts = products.filter(p => p.status === 'Borrador').length;
    return { pendingOrders, pendingQuotes, drafts };
  }, [orders, quotes, products, store.id]);

  return (
    <MerchantLayout title="Panel" subtitle={`Resumen de actividad · ${store.name}`}>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2"><p className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Bienvenida de vuelta</p><h1 className="text-[48px] font-black tracking-tighter leading-none text-brand-black">Hola, {user?.firstName || 'Maria'}.</h1><p className="text-brand-text-muted text-[15px] font-bold">Esto es lo que pasó en {store.name} hoy.</p></div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <StatCard title="Pedidos Pendientes" value={stats.pendingOrders.toString().padStart(2, '0')} icon={ShoppingBag} onClick={() => router.push('/comerciante/orders')} />
          <StatCard title="Cotizaciones Pendientes" value={stats.pendingQuotes.toString().padStart(2, '0')} icon={FileText} onClick={() => router.push('/comerciante/quotes')} />
          <StatCard title="Borradores Pendientes" value={stats.drafts.toString().padStart(2, '0')} icon={Package} onClick={() => router.push('/comerciante/products')} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card title="Pedidos recientes">
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-left">
                  <thead><tr className="border-b border-brand-neutral-border"><th className="px-6 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.1em]">Número de Pedido</th><th className="px-6 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.1em]">Cliente</th><th className="px-6 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.1em]">Estado</th><th className="px-6 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.1em] text-right">Total</th></tr></thead>
                  <tbody className="divide-y divide-brand-neutral-border">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-brand-neutral-light transition-all group cursor-pointer" onClick={() => router.push('/comerciante/orders')}>
                        <td className="px-6 py-5 text-[14px] font-black text-brand-black">{order.id}</td>
                        <td className="px-6 py-5"><div className="flex flex-col"><span className="text-[14px] font-black text-brand-black">{order.customer}</span><span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-tight">Perú • Lima</span></div></td>
                        <td className="px-6 py-5"><Badge variant={order.status === 'Pagado' ? 'info' : order.status === 'En proceso' ? 'warning' : order.status === 'Enviado' ? 'secondary' : order.status === 'Entregado' ? 'success' : 'outline'}>{order.status}</Badge></td>
                        <td className="px-6 py-5 text-[14px] font-black text-right text-brand-black">S/ {order.total.toFixed(2)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (<tr><td colSpan={4} className="px-6 py-12 text-center text-brand-text-muted font-bold italic">No se encontraron pedidos recientes.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
          <div className="space-y-8">
            <Card title="Acciones Rápidas" subtitle="GESTIÓN INMEDIATA">
              <div className="flex flex-col gap-3 pt-2">
                <Button className="w-full h-14 gap-3 font-black text-[14px] shadow-xl shadow-brand-black/10" onClick={() => router.push('/comerciante/products/nuevo')}><Plus size={20} /> Nuevo Producto</Button>
                <Button variant="camel" className="w-full h-14 gap-3 font-black text-[14px]" onClick={() => router.push('/comerciante/carga-masiva')}><Upload size={20} /> Carga Masiva (CSV)</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}
