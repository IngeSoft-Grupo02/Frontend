'use client';

import { MerchantLayout } from '@/domains/comerciante/components/MerchantLayout';
import { Badge, Button, Card } from '@/domains/comerciante/components/ui';
import { useStore } from '@/domains/comerciante/context/StoreContext';
import {
  buildPaidOrderItemRows,
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
  const paidOrderItems = useMemo(() => buildPaidOrderItemRows(paidOrders), [paidOrders]);

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
              Revisa los 5 productos más vendidos y los pedidos pagados de la tienda.
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
          <>
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <Card title="Gráfico de productos más vendidos" subtitle="Top 5 por unidades vendidas">
                {topProducts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-brand-neutral-border p-8 text-center">
                    <p className="text-[14px] font-black text-brand-black">Aún no hay detalle de productos para graficar.</p>
                    <p className="mt-1 text-[12px] font-bold text-brand-text-muted">Cuando los pedidos incluyan artículos, el ranking aparecerá aquí.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {topProducts.map((item, index) => {
                      const maxQuantity = Math.max(...topProducts.map(product => product.quantity), 1);
                      const width = Math.max(8, Math.round((item.quantity / maxQuantity) * 100));
                      return (
                        <div key={item.key} className="grid grid-cols-[32px_minmax(0,1fr)_86px] items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-black text-[12px] font-black text-white">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <span className="truncate text-[13px] font-black text-brand-black">{item.name}</span>
                              <span className="shrink-0 text-[11px] font-black text-brand-text-muted">{item.orderCount} pedidos</span>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-brand-neutral-mid">
                              <div
                                className="h-full rounded-full bg-brand-black"
                                style={{ width: `${width}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[16px] font-black leading-none text-brand-black">{item.quantity}</p>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-brand-text-muted">unid.</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              <Card title="Detalle del top 5" subtitle="Unidades, pedidos y monto vendido">
                {topProducts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-brand-neutral-border p-8 text-center text-[12px] font-bold text-brand-text-muted">
                    Sin productos vendidos para mostrar.
                  </div>
                ) : (
                  <div className="divide-y divide-brand-neutral-border">
                    {topProducts.map((item, index) => (
                      <div key={item.key} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 py-4 first:pt-0 last:pb-0">
                        <span className="text-[13px] font-black text-brand-text-muted">{index + 1}</span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-black text-brand-black">{item.name}</p>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-black text-brand-text-muted">
                            <span>{item.quantity} unid.</span>
                            <span>{item.orderCount} pedidos</span>
                            <span className="text-right text-brand-black">{formatReportMoney(item.revenue)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            <Card title="Pedidos pagados" subtitle="Pedidos generados luego de aceptar y pagar la cotización">
              <div className="hidden divide-y divide-brand-neutral-border md:block">
                <div className="grid grid-cols-[90px_minmax(0,1fr)_104px_126px_70px_118px] gap-3 pb-3 text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted">
                  <span>Pedido</span>
                  <span>Cliente</span>
                  <span>Fecha</span>
                  <span>Estado</span>
                  <span className="text-right">Unid.</span>
                  <span className="text-right">Total</span>
                </div>
                {paidOrders.slice(0, 8).map(order => (
                  <div key={order.id} className="grid grid-cols-[90px_minmax(0,1fr)_104px_126px_70px_118px] items-center gap-3 py-4 text-[13px]">
                    <span className="font-black text-brand-black">#{order.id}</span>
                    <span className="min-w-0 truncate font-bold text-brand-black">{order.customer || 'Cliente sin nombre'}</span>
                    <span className="font-bold text-brand-text-muted">{formatReportDate(order.createdAt || order.date)}</span>
                    <span>
                      <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                    </span>
                    <span className="text-right font-extrabold">{getOrderUnits(order)}</span>
                    <span className="text-right font-black">{formatReportMoney(getOrderTotal(order))}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 md:hidden">
                {paidOrders.slice(0, 8).map(order => (
                  <div key={order.id} className="rounded-2xl border border-brand-neutral-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-black text-brand-black">Pedido #{order.id}</p>
                        <p className="mt-1 truncate text-[12px] font-bold text-brand-text-muted">{order.customer || 'Cliente sin nombre'}</p>
                      </div>
                      <span className="shrink-0">
                          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] font-black text-brand-text-muted">
                      <div>
                        <p className="uppercase tracking-wider">Fecha</p>
                        <p className="mt-1 text-brand-black">{formatReportDate(order.createdAt || order.date)}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wider">Unid.</p>
                        <p className="mt-1 text-brand-black">{getOrderUnits(order)}</p>
                      </div>
                      <div className="text-right">
                        <p className="uppercase tracking-wider">Total</p>
                        <p className="mt-1 text-brand-black">{formatReportMoney(getOrderTotal(order))}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {paidOrders.length > 8 && (
                <p className="mt-4 text-[12px] font-bold text-brand-text-muted">
                  Mostrando los 8 pedidos más recientes. El PDF incluye todos los pedidos pagados.
                </p>
              )}
            </Card>

            <Card title="Detalle de items pagados" subtitle="Productos, tallas, colores y subtotales de cada pedido pagado">
              <div className="space-y-3">
                {paidOrderItems.map(item => (
                  <div
                    key={item.key}
                    className={`rounded-2xl border p-4 ${
                      item.missingDetail ? 'border-amber-200 bg-amber-50' : 'border-brand-neutral-border bg-white'
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[90px_minmax(0,1fr)_minmax(0,0.8fr)_78px_110px_118px] lg:items-center">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted">Pedido</p>
                        <p className="mt-1 text-[13px] font-black text-brand-black">#{item.orderId}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted">Producto</p>
                        <p className="mt-1 truncate text-[13px] font-black text-brand-black">{item.productName}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted">Talla / color</p>
                        <p className="mt-1 truncate text-[12px] font-bold text-brand-text-muted">{item.variant}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted lg:text-right">Cant.</p>
                        <p className="mt-1 text-[13px] font-black text-brand-black lg:text-right">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted lg:text-right">P. unitario</p>
                        <p className="mt-1 text-[13px] font-black text-brand-black lg:text-right">
                          {item.missingDetail ? '-' : formatReportMoney(item.unitPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-text-muted lg:text-right">Subtotal</p>
                        <p className="mt-1 text-[13px] font-black text-brand-black lg:text-right">{formatReportMoney(item.subtotal)}</p>
                      </div>
                    </div>
                    {item.missingDetail && (
                      <p className="mt-3 text-[12px] font-bold text-amber-700">
                        Este pedido pagado no tiene detalle de productos en la respuesta actual.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </MerchantLayout>
  );
}
