import { jsPDF } from 'jspdf';
import { Order, OrderItemDetail, Store } from './types';

const NR = 'No registrado';

const formatDate = (value?: string) => {
  if (!value) return NR;
  const parts = value.slice(0, 10).split('-');
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const money = (value: number) =>
  `S/ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const variantLabel = (item: OrderItemDetail) =>
  [item.size, item.color].filter(Boolean).join(' / ') || '—';

interface LoadedLogo {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Carga el logo de la tienda como dataURL para incrustarlo en el PDF.
 * Devuelve null si no hay logo o si no se puede cargar (p. ej. CORS en una URL externa).
 */
const loadStoreLogo = (url?: string): Promise<LoadedLogo | null> =>
  new Promise((resolve) => {
    if (!url || url.startsWith('blob:')) {
      resolve(null);
      return;
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(image, 0, 0);
        resolve({ dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height });
      } catch {
        // toDataURL lanza si el canvas quedó "tainted" por una imagen de otro origen.
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = url;
  });

/** Resultado de la generación: indica si el logo se pudo incrustar (para avisar al usuario). */
export interface DocumentResult {
  logoEmbedded: boolean;
}

const MARGIN = 14;

const drawWatermark = (doc: jsPDF, logo: LoadedLogo | null) => {
  if (!logo) return;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const targetWidth = 110;
  const targetHeight = targetWidth * (logo.height / logo.width);
  const x = (pageWidth - targetWidth) / 2;
  const y = (pageHeight - targetHeight) / 2;
  try {
    doc.saveGraphicsState();
    // @ts-expect-error GState existe en runtime de jsPDF
    doc.setGState(new doc.GState({ opacity: 0.07 }));
    doc.addImage(logo.dataUrl, 'PNG', x, y, targetWidth, targetHeight);
    doc.restoreGraphicsState();
  } catch {
    // Si el motor no soporta opacidad, no dibujamos la marca de agua para no tapar el texto.
  }
};

const drawHeader = (doc: jsPDF, store: Store, logo: LoadedLogo | null, docTitle: string) => {
  let cursorY = 18;
  if (logo) {
    const logoWidth = 24;
    const logoHeight = logoWidth * (logo.height / logo.width);
    try {
      doc.addImage(logo.dataUrl, 'PNG', MARGIN, cursorY - 4, logoWidth, logoHeight);
    } catch {
      // Ignorar fallo de incrustación del encabezado.
    }
  }
  const textX = logo ? MARGIN + 30 : MARGIN;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(store.name || NR, textX, cursorY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(docTitle, textX, cursorY + 11);
  doc.setTextColor(0);

  cursorY += 20;
  doc.setDrawColor(210);
  doc.line(MARGIN, cursorY, doc.internal.pageSize.getWidth() - MARGIN, cursorY);
  return cursorY + 8;
};

const sectionTitle = (doc: jsPDF, y: number, title: string) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(title, MARGIN, y);
  return y + 7;
};

const labelValueRows = (doc: jsPDF, startY: number, rows: Array<[string, string]>) => {
  let y = startY;
  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(90);
    doc.text(label, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.text(String(value ?? NR), MARGIN + 55, y);
    y += 7;
  });
  return y;
};

/** Dibuja una tabla de ítems con columnas: Producto, Variante, Cant., P. Unit., Subtotal. */
const drawItemsTable = (doc: jsPDF, startY: number, items: OrderItemDetail[]) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - MARGIN;
  // Posiciones de columnas.
  const colProduct = MARGIN;
  const colVariant = MARGIN + 70;
  const colQty = MARGIN + 110;
  const colUnit = right - 35;
  const colSub = right;

  let y = startY;
  doc.setFillColor(238, 238, 238);
  doc.rect(MARGIN, y - 4, right - MARGIN, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text('Producto', colProduct + 1, y);
  doc.text('Variante', colVariant, y);
  doc.text('Cant.', colQty, y, { align: 'right' });
  doc.text('P. Unitario', colUnit, y, { align: 'right' });
  doc.text('Subtotal', colSub, y, { align: 'right' });
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  items.forEach((item) => {
    const name = item.productName || 'Producto sin nombre registrado';
    const nameLines = doc.splitTextToSize(name, 66) as string[];
    doc.text(nameLines, colProduct + 1, y);
    doc.text(variantLabel(item), colVariant, y);
    doc.text(String(item.quantity ?? 0), colQty, y, { align: 'right' });
    doc.text(money(item.unitPrice ?? 0), colUnit, y, { align: 'right' });
    doc.text(money(item.subTotal ?? 0), colSub, y, { align: 'right' });
    y += Math.max(6, nameLines.length * 5);
    if (y > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = 20;
    }
  });

  doc.setDrawColor(210);
  doc.line(MARGIN, y, right, y);
  return y + 7;
};

/** Guía de Despacho — datos reales del pedido, con fallback "No registrado". */
export const generateDispatchGuide = async (
  order: Order,
  store: Store,
  increment: number
): Promise<DocumentResult> => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const logo = await loadStoreLogo(store.logoUrl || store.logo);
  drawWatermark(doc, logo);
  let y = drawHeader(doc, store, logo, 'Guía de Despacho');

  y = sectionTitle(doc, y, 'Datos del pedido');
  y = labelValueRows(doc, y, [
    ['Número de pedido', order.id || NR],
    ['Fecha del pedido', formatDate(order.date)],
    ['Estado del pedido', order.status || NR],
  ]);

  y += 3;
  y = sectionTitle(doc, y, 'Datos del cliente');
  const docLabel = order.documentNumber
    ? `${order.documentType || 'Documento'} ${order.documentNumber}`
    : NR;
  y = labelValueRows(doc, y, [
    ['Cliente', order.customer || NR],
    ['Documento', docLabel],
    ['Teléfono', order.customerPhone || NR],
    ['Correo', order.customerEmail || NR],
    ['Dirección de envío', shippingText(order)],
  ]);

  y += 3;
  y = sectionTitle(doc, y, 'Productos');
  if (order.itemsDetail && order.itemsDetail.length > 0) {
    y = drawItemsTable(doc, y + 2, order.itemsDetail);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text('La información del detalle no se encuentra registrada.', MARGIN, y);
    doc.setTextColor(0);
    y += 8;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total: ${money(order.finalTotal ?? order.total ?? 0)}`, MARGIN, y + 2);
  y += 10;

  if (order.observations) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Observaciones:', MARGIN, y);
    doc.setFont('helvetica', 'normal');
    const obs = doc.splitTextToSize(order.observations, doc.internal.pageSize.getWidth() - MARGIN * 2) as string[];
    doc.text(obs, MARGIN, y + 6);
  }

  doc.save(`guia-despacho-${order.id || 'pedido'}.pdf`);
  return { logoEmbedded: Boolean(logo) };
};

const shippingText = (order: Order): string => {
  const s = order.shippingDetail;
  if (!s || !s.address) return NR;
  const district = s.district ? s.district.replace(/_/g, ' ') : '';
  return [s.address, district].filter(Boolean).join(', ');
};

/** Comprobante de pago — datos reales, con detalle por producto e IGV incluido. */
export const generatePaymentReceipt = async (
  order: Order,
  store: Store,
  increment: number
): Promise<DocumentResult> => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const logo = await loadStoreLogo(store.logoUrl || store.logo);
  drawWatermark(doc, logo);
  let y = drawHeader(doc, store, logo, 'Comprobante de Pago');

  y = sectionTitle(doc, y, 'Datos del comprobante');
  y = labelValueRows(doc, y, [
    ['Tienda', store.name || NR],
    ['Cliente', order.customer || NR],
    ['Número de pedido', order.id || NR],
    ['Fecha', formatDate(order.date)],
    ['Estado', order.status || NR],
  ]);

  y += 3;
  y = sectionTitle(doc, y, 'Detalle por producto');
  if (order.itemsDetail && order.itemsDetail.length > 0) {
    y = drawItemsTable(doc, y + 2, order.itemsDetail);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text('La información del detalle no se encuentra registrada.', MARGIN, y);
    doc.setTextColor(0);
    y += 8;
  }

  // Montos reales del backend. El total no incluye IGV explícito en pantalla,
  // por lo que el IGV se presenta como incluido para no inflar el monto.
  const partial = order.partialTotal ?? order.total ?? 0;
  const discount = order.totalDiscount ?? 0;
  const finalTotal = order.finalTotal ?? (partial - discount);
  const subtotalSinIgv = finalTotal / 1.18;
  const igvIncluido = finalTotal - subtotalSinIgv;

  y = sectionTitle(doc, y + 2, 'Resumen de montos');
  const amountRows: Array<[string, string]> = [
    ['Subtotal de productos', money(partial)],
    ['Descuento', discount > 0 ? `- ${money(discount)}` : money(0)],
    ['Subtotal sin IGV', money(subtotalSinIgv)],
    ['IGV (18%) incluido', money(igvIncluido)],
  ];
  y = labelValueRows(doc, y, amountRows);

  y += 2;
  doc.setDrawColor(210);
  doc.line(MARGIN, y, doc.internal.pageSize.getWidth() - MARGIN, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Total a pagar: ${money(finalTotal)}`, MARGIN, y);

  doc.save(`comprobante-pago-${order.id || 'pedido'}.pdf`);
  return { logoEmbedded: Boolean(logo) };
};
