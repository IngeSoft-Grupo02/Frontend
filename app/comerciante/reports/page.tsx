'use client';

import { MerchantLayout } from '@/domains/comerciante/components/MerchantLayout';
import { Badge, Button, Card } from '@/domains/comerciante/components/ui';
import { useStore } from '@/domains/comerciante/context/StoreContext';
import {
  buildTopProductSales,
  formatReportDate,
  formatReportMoney,
  generateMerchantSalesReport,
  getOrderTotal,
  getOrderUnits,
  isPaidOrderForReport,
} from '@/domains/comerciante/lib/reportDocuments';
import { Order } from '@/domains/comerciante/lib/types';
import { BarChart3, Download, FileText, Package, ReceiptText, ShoppingBag, TrendingUp } from 'lucide-react';
import { useMemo, useState, type ElementType } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'black';

const statusVariant = (status: Order['status']): BadgeVariant => {
  if (status === 'Entregado') return 'success';
  if (status === 'Cancelado') return 'danger';
  if (status === 'Pago pendiente') return 'warning';
  return 'info';
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: ElementType;
  label: string;
  value: string;
  helper: string;
}) => (
  <div className="rounded-2xl border border-brand-neutral-border bg-white p-5 card-shadow">
    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-black text-white">
      <Icon size={18} />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-text-muted">{label}</p>
    <p className="mt-2 text-[26px] font-black tracking-tight text-brand-black">{value}</p>
    <p className="mt-1 text-[12px] font-bold text-brand-text-muted">{helper}</p>
  </div>
);

export default function MerchantReportsPage() {
  const { orders, store, refreshData } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState('');

  const paidOrders = useMemo(
    () =>
      orders
        .filter(order => order.storeId === store.id && isPaidOrderForReport(order))
        .sort((first, second) => {
          const firstTime = Date.parse(first.createdAt || first.date || '');
          const secondTime = Date.parse(second.createdAt || second.date || '');
          return (Number.isNaN(secondTime) ? 0 : secondTime) - (Number.isNaN(firstTime) ? 0 : firstTime);
        }),
    [orders, store.id]
  );

  const topProducts = useMemo(() => buildTopProductSales(paidOrders, 5), [paidOrders]);

  const reportStats = useMemo(() => {
    const units = paidOrders.reduce((sum, order) => sum + getOrderUnits(order), 0);
    const amount = paidOrders.reduce((sum, order) => sum + getOrderTotal(order), 0);
    const productCount = topProducts.length;
    return {
      paidOrders: paidOrders.length,
      units,
      amount,
      productCount,
      topProduct: topProducts[0]?.name || 'Sin ventas registradas',
    };
  }, [paidOrders, topProducts]);

  const handleDownloadPdf = async () => {
    if (paidOrders.length === 0) return;
    try {
      setNotice('');
      setIsGenerating(true);
      generateMerchantSalesReport(store, paidOrders, topProducts);
    } catch {
      setNotice('No se pudo generar el PDF. Inténtalo nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MerchantLayout title="Reportes" subtitle="Indicadores descargables de ventas y pedidos pagados">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-brand-neutral-border bg-white p-6 card-shadow lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-muted">Resumen comercial</p>
            <h1 className="text-[32px] font-black tracking-tight text-brand-black">Reportes del comerciante</h1>
            <p className="mt-2 text-[14px] font-bold leading-relaxed text-brand-text-muted">
              Revisa los 5 productos más vendidos y las cotizaciones pagadas que ya se convirtieron en pedidos.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="gap-2 border border-brand-neutral-border bg-white"
              onClick={() => refreshData()}
            >
              <TrendingUp size={16} />
              Actualizar datos
            </Button>
            <Button
              type="button"
              variant="brand"
              size="lg"
              className="gap-2"
              onClick={handleDownloadPdf}
              disabled={isGenerating || paidOrders.length === 0}
            >
              <Download size={16} />
              {isGenerating ? 'Generando...' : 'Descargar PDF'}
            </Button>
          </div>
        </header>

        {notice && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-[13px] font-bold text-red-700">
            {notice}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={ReceiptText} label="Pedidos pagados" value={String(reportStats.paidOrders)} helper="Base del reporte PDF" />
          <StatCard icon={ShoppingBag} label="Unidades vendidas" value={String(reportStats.units)} helper="Suma de productos en pedidos" />
          <StatCard icon={FileText} label="Total facturado" value={formatReportMoney(reportStats.amount)} helper="Monto final de pedidos pagados" />
          <StatCard icon={Package} label="Productos vendidos" value={String(reportStats.productCount)} helper={reportStats.topProduct} />
        </section>

        {paidOrders.length === 0 ? (
          <Card className="min-h-[300px]">
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-neutral-mid text-brand-text-muted">
                <BarChart3 size={28} />
              </div>
              <h2 className="text-[22px] font-black text-brand-black">Aún no hay ventas para reportar</h2>
              <p className="mt-2 max-w-md text-[14px] font-bold leading-relaxed text-brand-text-muted">
                Cuando una cotización sea pagada y se convierta en pedido, aparecerá aquí y podrás descargar el PDF.
              </p>
            </div>
          </Card>
        ) : (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <Card title="Top 5 productos más vendidos" subtitle="Ordenado por unidades vendidas">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                  <thead>
                    <tr className="border-b border-brand-neutral-border text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted">
                      <th className="pb-3">#</th>
                      <th className="pb-3">Producto</th>
                      <th className="pb-3 text-right">Unidades</th>
                      <th className="pb-3 text-right">Pedidos</th>
                      <th className="pb-3 text-right">Vendido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-neutral-border">
                    {topProducts.map((item, index) => (
                      <tr key={item.key} className="text-[13px]">
                        <td className="py-4 font-black text-brand-text-muted">{index + 1}</td>
                        <td className="py-4 font-black text-brand-black">{item.name}</td>
                        <td className="py-4 text-right font-extrabold">{item.quantity}</td>
                        <td className="py-4 text-right font-bold text-brand-text-muted">{item.orderCount}</td>
                        <td className="py-4 text-right font-black">{formatReportMoney(item.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Cotizaciones pagadas" subtitle="Pedidos generados desde cotizaciones aceptadas">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead>
                    <tr className="border-b border-brand-neutral-border text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted">
                      <th className="pb-3">Pedido</th>
                      <th className="pb-3">Cliente</th>
                      <th className="pb-3">Fecha</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3 text-right">Unid.</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-neutral-border">
                    {paidOrders.slice(0, 8).map(order => (
                      <tr key={order.id} className="text-[13px]">
                        <td className="py-4 font-black text-brand-black">#{order.id}</td>
                        <td className="py-4 font-bold text-brand-black">{order.customer || 'Cliente sin nombre'}</td>
                        <td className="py-4 font-bold text-brand-text-muted">{formatReportDate(order.createdAt || order.date)}</td>
                        <td className="py-4">
                          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                        </td>
                        <td className="py-4 text-right font-extrabold">{getOrderUnits(order)}</td>
                        <td className="py-4 text-right font-black">{formatReportMoney(getOrderTotal(order))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {paidOrders.length > 8 && (
                <p className="mt-4 text-[12px] font-bold text-brand-text-muted">
                  Mostrando los 8 pedidos más recientes. El PDF incluye todos los pedidos pagados.
                </p>
              )}
            </Card>
          </section>
        )}
      </div>
    </MerchantLayout>
  );
}
