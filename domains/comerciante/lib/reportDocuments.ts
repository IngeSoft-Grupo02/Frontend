import { jsPDF } from 'jspdf';
import { Order, Store } from './types';

const MARGIN = 14;
const NR = 'No registrado';

export interface ProductSalesSummary {
  key: string;
  name: string;
  quantity: number;
  revenue: number;
  orderCount: number;
}

export interface PaidOrderItemReportRow {
  key: string;
  orderId: string;
  productName: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  missingDetail?: boolean;
}

export const isPaidOrderForReport = (order: Order) =>
  order.status !== 'Pago pendiente' && order.status !== 'Cancelado';

export const getOrderUnits = (order: Order) =>
  order.itemsDetail?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) ?? order.items ?? 0;

export const getOrderTotal = (order: Order) => Number(order.finalTotal ?? order.total ?? 0);

export const formatReportMoney = (value: number) =>
  `S/ ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatReportDate = (value?: string) => {
  if (!value) return NR;
  const timestamp = Date.parse(value);
  if (!Number.isNaN(timestamp)) {
    return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(timestamp));
  }
  const parts = value.slice(0, 10).split('-');
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

export const buildTopProductSales = (orders: Order[], limit = 5): ProductSalesSummary[] => {
  const sales = new Map<string, ProductSalesSummary & { orderIds: Set<string> }>();

  orders.forEach((order) => {
    order.itemsDetail?.forEach((item) => {
      const key = item.productId || item.productVariantId || item.productName || 'producto-sin-id';
      const current = sales.get(key) || {
        key,
        name: item.productName || 'Producto sin nombre',
        quantity: 0,
        revenue: 0,
        orderCount: 0,
        orderIds: new Set<string>(),
      };
      current.quantity += Number(item.quantity) || 0;
      current.revenue += Number(item.subTotal ?? (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)) || 0;
      current.orderIds.add(order.id);
      current.orderCount = current.orderIds.size;
      sales.set(key, current);
    });
  });

  return Array.from(sales.values())
    .sort((first, second) => second.quantity - first.quantity || second.revenue - first.revenue)
    .slice(0, limit)
    .map(({ orderIds, ...item }) => item);
};

const variantText = (size?: string, color?: string) => {
  const parts = [size, color].filter(Boolean);
  return parts.length > 0 ? parts.join(' / ') : NR;
};

export const buildPaidOrderItemRows = (orders: Order[]): PaidOrderItemReportRow[] =>
  orders.flatMap((order) => {
    if (!order.itemsDetail || order.itemsDetail.length === 0) {
      return [
        {
          key: `${order.id}-sin-detalle`,
          orderId: order.id,
          productName: 'Detalle de productos no registrado',
          variant: 'Revisar el detalle del pedido',
          quantity: getOrderUnits(order),
          unitPrice: 0,
          subtotal: getOrderTotal(order),
          missingDetail: true,
        },
      ];
    }

    return order.itemsDetail.map((item, index) => ({
      key: `${order.id}-${item.productVariantId || item.productId || index}`,
      orderId: order.id,
      productName: item.productName || 'Producto sin nombre',
      variant: variantText(item.size, item.color),
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      subtotal: Number(item.subTotal) || 0,
    }));
  });

const safeFileName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'tienda';

const shortText = (doc: jsPDF, text: string, maxWidth: number) => {
  const lines = doc.splitTextToSize(text || NR, maxWidth) as string[];
  if (lines.length <= 1) return lines[0] || NR;
  return `${lines[0].replace(/\s+$/g, '')}...`;
};

const drawHeader = (doc: jsPDF, store: Store) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('Reporte comercial', MARGIN, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(105);
  doc.text(store.name || NR, MARGIN, y);
  const generatedAt = new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());
  doc.text(`Generado: ${generatedAt}`, pageWidth - MARGIN, y, { align: 'right' });
  y += 8;

  doc.setDrawColor(220);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  return y + 10;
};

const drawMetric = (doc: jsPDF, x: number, y: number, width: number, label: string, value: string) => {
  doc.setDrawColor(224);
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(x, y, width, 18, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(110);
  doc.text(label.toUpperCase(), x + 4, y + 6);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(value, x + 4, y + 14);
};

const ensureSpace = (doc: jsPDF, y: number, height: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + height <= pageHeight - MARGIN) return y;
  doc.addPage();
  return MARGIN;
};

const drawSectionTitle = (doc: jsPDF, y: number, title: string) => {
  y = ensureSpace(doc, y, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(title, MARGIN, y);
  return y + 7;
};

const drawTopProductsTable = (doc: jsPDF, y: number, topProducts: ProductSalesSummary[]) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - MARGIN;
  y = drawSectionTitle(doc, y, 'Top 5 productos mas vendidos');

  if (topProducts.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text('Aun no hay productos vendidos para construir este ranking.', MARGIN, y);
    return y + 10;
  }

  y = ensureSpace(doc, y, 12);
  doc.setFillColor(238, 236, 229);
  doc.rect(MARGIN, y - 5, right - MARGIN, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text('#', MARGIN + 2, y);
  doc.text('Producto', MARGIN + 12, y);
  doc.text('Unidades', right - 62, y, { align: 'right' });
  doc.text('Pedidos', right - 35, y, { align: 'right' });
  doc.text('Vendido', right, y, { align: 'right' });
  y += 7;

  topProducts.forEach((item, index) => {
    y = ensureSpace(doc, y, 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(String(index + 1), MARGIN + 2, y);
    doc.text(shortText(doc, item.name, 82), MARGIN + 12, y);
    doc.text(String(item.quantity), right - 62, y, { align: 'right' });
    doc.text(String(item.orderCount), right - 35, y, { align: 'right' });
    doc.text(formatReportMoney(item.revenue), right, y, { align: 'right' });
    y += 7;
  });

  doc.setDrawColor(220);
  doc.line(MARGIN, y - 2, right, y - 2);
  return y + 7;
};

const drawTopProductsChart = (doc: jsPDF, y: number, topProducts: ProductSalesSummary[]) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - MARGIN;
  y = drawSectionTitle(doc, y, 'Grafico de productos mas vendidos');

  if (topProducts.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text('Aun no hay ventas para graficar.', MARGIN, y);
    return y + 10;
  }

  const maxQuantity = Math.max(...topProducts.map(item => item.quantity), 1);
  const labelX = MARGIN;
  const barX = MARGIN + 66;
  const barWidth = right - barX - 18;

  topProducts.forEach((item, index) => {
    y = ensureSpace(doc, y, 12);
    const currentBarWidth = Math.max(5, (item.quantity / maxQuantity) * barWidth);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text(`${index + 1}. ${shortText(doc, item.name, 58)}`, labelX, y + 3);
    doc.setFillColor(238, 236, 229);
    doc.roundedRect(barX, y - 2, barWidth, 6, 2, 2, 'F');
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(barX, y - 2, currentBarWidth, 6, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(String(item.quantity), right, y + 3, { align: 'right' });
    y += 10;
  });

  return y + 4;
};

const drawPaidOrdersTable = (doc: jsPDF, y: number, orders: Order[]) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - MARGIN;
  y = drawSectionTitle(doc, y, 'Pedidos pagados');

  if (orders.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text('Aun no hay pedidos pagados en esta tienda.', MARGIN, y);
    return y + 10;
  }

  y = ensureSpace(doc, y, 12);
  doc.setFillColor(238, 236, 229);
  doc.rect(MARGIN, y - 5, right - MARGIN, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text('Pedido', MARGIN + 2, y);
  doc.text('Cliente', MARGIN + 28, y);
  doc.text('Fecha', MARGIN + 86, y);
  doc.text('Estado', MARGIN + 116, y);
  doc.text('Unid.', right - 31, y, { align: 'right' });
  doc.text('Total', right, y, { align: 'right' });
  y += 7;

  orders.forEach((order) => {
    y = ensureSpace(doc, y, 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0);
    doc.text(`#${order.id}`, MARGIN + 2, y);
    doc.text(shortText(doc, order.customer || NR, 54), MARGIN + 28, y);
    doc.text(formatReportDate(order.createdAt || order.date), MARGIN + 86, y);
    doc.text(order.status, MARGIN + 116, y);
    doc.text(String(getOrderUnits(order)), right - 31, y, { align: 'right' });
    doc.text(formatReportMoney(getOrderTotal(order)), right, y, { align: 'right' });
    y += 7;
  });

  return y + 4;
};

const drawPaidOrderItemsTable = (doc: jsPDF, y: number, rows: PaidOrderItemReportRow[]) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - MARGIN;
  y = drawSectionTitle(doc, y, 'Detalle de items pagados');

  if (rows.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text('Aun no hay items pagados para mostrar.', MARGIN, y);
    return y + 10;
  }

  y = ensureSpace(doc, y, 12);
  doc.setFillColor(238, 236, 229);
  doc.rect(MARGIN, y - 5, right - MARGIN, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text('Pedido', MARGIN + 2, y);
  doc.text('Producto', MARGIN + 24, y);
  doc.text('Variante', MARGIN + 86, y);
  doc.text('Cant.', right - 55, y, { align: 'right' });
  doc.text('P. unit.', right - 26, y, { align: 'right' });
  doc.text('Subtotal', right, y, { align: 'right' });
  y += 7;

  rows.forEach((row) => {
    y = ensureSpace(doc, y, 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(row.missingDetail ? 150 : 0);
    doc.text(`#${row.orderId}`, MARGIN + 2, y);
    doc.text(shortText(doc, row.productName, 58), MARGIN + 24, y);
    doc.text(shortText(doc, row.variant, 42), MARGIN + 86, y);
    doc.text(String(row.quantity), right - 55, y, { align: 'right' });
    doc.text(row.missingDetail ? '-' : formatReportMoney(row.unitPrice), right - 26, y, { align: 'right' });
    doc.text(formatReportMoney(row.subtotal), right, y, { align: 'right' });
    y += 7;
  });

  return y + 4;
};

export const generateMerchantSalesReport = (store: Store, paidOrders: Order[], topProducts: ProductSalesSummary[]) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const sortedPaidOrders = [...paidOrders].sort((first, second) => {
    const firstTime = Date.parse(first.createdAt || first.date || '');
    const secondTime = Date.parse(second.createdAt || second.date || '');
    return (Number.isNaN(secondTime) ? 0 : secondTime) - (Number.isNaN(firstTime) ? 0 : firstTime);
  });
  const paidOrderItems = buildPaidOrderItemRows(sortedPaidOrders);

  const totalUnits = sortedPaidOrders.reduce((sum, order) => sum + getOrderUnits(order), 0);
  const totalAmount = sortedPaidOrders.reduce((sum, order) => sum + getOrderTotal(order), 0);
  const topProduct = topProducts[0]?.name || 'Sin ventas registradas';

  let y = drawHeader(doc, store);
  const pageWidth = doc.internal.pageSize.getWidth();
  const metricGap = 4;
  const metricWidth = (pageWidth - MARGIN * 2 - metricGap * 3) / 4;
  drawMetric(doc, MARGIN, y, metricWidth, 'Pedidos pagados', String(sortedPaidOrders.length));
  drawMetric(doc, MARGIN + (metricWidth + metricGap), y, metricWidth, 'Unidades', String(totalUnits));
  drawMetric(doc, MARGIN + (metricWidth + metricGap) * 2, y, metricWidth, 'Total facturado', formatReportMoney(totalAmount));
  drawMetric(doc, MARGIN + (metricWidth + metricGap) * 3, y, metricWidth, 'Top producto', shortText(doc, topProduct, metricWidth - 8));
  y += 28;

  y = drawTopProductsChart(doc, y, topProducts);
  y = drawTopProductsTable(doc, y, topProducts);
  y = drawPaidOrdersTable(doc, y, sortedPaidOrders);
  drawPaidOrderItemsTable(doc, y, paidOrderItems);

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130);
    doc.text(`Pagina ${page} de ${pageCount}`, pageWidth - MARGIN, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
  }

  doc.save(`reporte-comercial-${safeFileName(store.name)}.pdf`);
};
