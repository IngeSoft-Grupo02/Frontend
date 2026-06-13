import { jsPDF } from 'jspdf';
import { Order, Store } from './types';

const NA = 'No disponible';

const formatDate = (value?: string) => {
  if (!value) return NA;
  const parts = value.slice(0, 10).split('-');
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const money = (value: number) =>
  `S/ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
        // toDataURL lanza si el canvas quedó "tainted" por CORS.
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = url;
  });

const billedTotal = (order: Order, increment: number) =>
  order.total * (order.hasCustomization ? 1 + increment / 100 : 1);

/** Resultado de la generación: indica si el logo se pudo incrustar (para avisar al usuario). */
export interface DocumentResult {
  logoEmbedded: boolean;
}

const drawWatermark = (doc: jsPDF, logo: LoadedLogo | null) => {
  if (!logo) return;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const targetWidth = 110;
  const ratio = logo.height / logo.width;
  const targetHeight = targetWidth * ratio;
  const x = (pageWidth - targetWidth) / 2;
  const y = (pageHeight - targetHeight) / 2;
  try {
    doc.saveGraphicsState();
    // @ts-expect-error GState existe en runtime de jsPDF
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.addImage(logo.dataUrl, 'PNG', x, y, targetWidth, targetHeight);
    doc.restoreGraphicsState();
  } catch {
    // Si el motor no soporta opacidad, no dibujamos la marca de agua para no tapar el texto.
  }
};

const drawHeader = (doc: jsPDF, store: Store, logo: LoadedLogo | null, docTitle: string) => {
  const margin = 14;
  let cursorY = 18;

  if (logo) {
    const logoWidth = 26;
    const logoHeight = logoWidth * (logo.height / logo.width);
    try {
      doc.addImage(logo.dataUrl, 'PNG', margin, cursorY - 4, logoWidth, logoHeight);
    } catch {
      // Ignorar fallo de incrustación del encabezado.
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(store.name || NA, logo ? margin + 32 : margin, cursorY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(docTitle, logo ? margin + 32 : margin, cursorY + 11);
  doc.setTextColor(0);

  cursorY += 20;
  doc.setDrawColor(210);
  doc.line(margin, cursorY, doc.internal.pageSize.getWidth() - margin, cursorY);
  return cursorY + 8;
};

const labelValueRows = (doc: jsPDF, startY: number, rows: Array<[string, string]>) => {
  const margin = 14;
  let y = startY;
  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(90);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.text(value, margin + 55, y);
    y += 7;
  });
  return y;
};

/** Guía de Despacho — usa solo datos reales disponibles, con fallback "No disponible". */
export const generateDispatchGuide = async (
  order: Order,
  store: Store,
  increment: number
): Promise<DocumentResult> => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const logo = await loadStoreLogo(store.logoUrl || store.logo);
  drawWatermark(doc, logo);
  let y = drawHeader(doc, store, logo, 'Guía de Despacho');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Datos del pedido', 14, y);
  y += 8;

  y = labelValueRows(doc, y, [
    ['Número de pedido', order.id || NA],
    ['Fecha del pedido', formatDate(order.date)],
    ['Estado del pedido', order.status || NA],
  ]);

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Datos del cliente', 14, y);
  y += 8;

  y = labelValueRows(doc, y, [
    ['Cliente', order.customer || NA],
    ['Documento', NA],
    ['Teléfono', NA],
    ['Correo', NA],
    ['Dirección de envío', NA],
  ]);

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Detalle de ítems', 14, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  // La API entrega solo la cantidad de ítems, no el detalle por producto.
  doc.text(`Cantidad de ítems: ${order.items ?? NA}`, 14, y);
  y += 7;
  doc.setTextColor(120);
  doc.text('Detalle por producto (nombre, variante, precio): no disponible desde la API.', 14, y);
  doc.setTextColor(0);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total: ${money(billedTotal(order, increment))}`, 14, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Observaciones: ${NA}`, 14, y);
  doc.setTextColor(0);

  doc.save(`guia-despacho-${order.id || 'pedido'}.pdf`);
  return { logoEmbedded: Boolean(logo) };
};

/** Comprobante de pago — datos reales disponibles, con IGV calculado (incluido). */
export const generatePaymentReceipt = async (
  order: Order,
  store: Store,
  increment: number
): Promise<DocumentResult> => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const logo = await loadStoreLogo(store.logoUrl || store.logo);
  drawWatermark(doc, logo);
  let y = drawHeader(doc, store, logo, 'Comprobante de Pago');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Datos del comprobante', 14, y);
  y += 8;

  y = labelValueRows(doc, y, [
    ['Tienda', store.name || NA],
    ['Cliente', order.customer || NA],
    ['Número de pedido', order.id || NA],
    ['Fecha', formatDate(order.date)],
    ['Estado', order.status || NA],
    ['Cantidad de ítems', String(order.items ?? NA)],
  ]);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text('Detalle por producto: no disponible desde la API.', 14, y);
  doc.setTextColor(0);
  y += 10;

  const base = order.total;
  const customization = order.hasCustomization ? base * (increment / 100) : 0;
  const billed = base + customization;
  // El total mostrado en pantalla no agrega IGV; lo presentamos como incluido para no inflar el monto.
  const subtotalSinIgv = billed / 1.18;
  const igvIncluido = billed - subtotalSinIgv;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Resumen de montos', 14, y);
  y += 8;

  const amountRows: Array<[string, string]> = [
    ['Subtotal de productos', money(base)],
  ];
  if (order.hasCustomization) {
    amountRows.push([`Personalización (${increment}%)`, money(customization)]);
  }
  amountRows.push(['Descuento', NA]);
  amountRows.push(['Subtotal sin IGV', money(subtotalSinIgv)]);
  amountRows.push(['IGV (18%) incluido', money(igvIncluido)]);

  y = labelValueRows(doc, y, amountRows);

  y += 2;
  doc.setDrawColor(210);
  doc.line(14, y, doc.internal.pageSize.getWidth() - 14, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Total a pagar: ${money(billed)}`, 14, y);

  doc.save(`comprobante-pago-${order.id || 'pedido'}.pdf`);
  return { logoEmbedded: Boolean(logo) };
};
