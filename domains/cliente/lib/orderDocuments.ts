/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { Order, OrderItemResponseDTO, Store, User } from '../types';

const NR = 'No registrado';
const MARGIN = 14;

const money = (value: number) =>
  `S/ ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (value?: string) => {
  if (!value) return NR;
  const datePart = value.slice(0, 10);
  const parts = datePart.split('-');
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const itemVariant = (item: OrderItemResponseDTO) =>
  [item.size, item.color].filter(Boolean).join(' / ') || '-';

const drawSectionTitle = (doc: jsPDF, y: number, title: string) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(40);
  doc.text(title, MARGIN, y);
  doc.setDrawColor(220);
  doc.line(MARGIN, y + 3, doc.internal.pageSize.getWidth() - MARGIN, y + 3);
  doc.setTextColor(0);
  return y + 10;
};

const drawRows = (doc: jsPDF, y: number, rows: Array<[string, string]>) => {
  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(90);
    doc.text(label, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.text(value || NR, MARGIN + 52, y);
    y += 7;
  });
  return y;
};

const drawItems = (doc: jsPDF, y: number, items: OrderItemResponseDTO[]) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - MARGIN;
  const colProduct = MARGIN;
  const colVariant = MARGIN + 68;
  const colQty = MARGIN + 108;
  const colUnit = right - 35;
  const colSub = right;

  doc.setFillColor(240, 240, 240);
  doc.rect(MARGIN, y - 5, right - MARGIN, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(60);
  doc.text('Producto', colProduct + 1, y);
  doc.text('Talla / color', colVariant, y);
  doc.text('Cant.', colQty, y, { align: 'right' });
  doc.text('P. unitario', colUnit, y, { align: 'right' });
  doc.text('Subtotal', colSub, y, { align: 'right' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  items.forEach((item) => {
    if (y > doc.internal.pageSize.getHeight() - 25) {
      doc.addPage();
      y = 20;
    }
    const nameLines = doc.splitTextToSize(item.productName || 'Producto sin nombre', 62) as string[];
    doc.text(nameLines, colProduct + 1, y);
    doc.text(itemVariant(item), colVariant, y);
    doc.text(String(item.quantity ?? 0), colQty, y, { align: 'right' });
    doc.text(money(item.unitPrice ?? 0), colUnit, y, { align: 'right' });
    doc.text(money(item.subTotal ?? 0), colSub, y, { align: 'right' });
    y += Math.max(7, nameLines.length * 5);
  });

  doc.setDrawColor(220);
  doc.line(MARGIN, y, right, y);
  return y + 8;
};

export const generateCustomerInvoice = (order: Order, store: Store, user: User | null) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - MARGIN;
  const items = order.itemsDetail || [];
  const itemsSubtotal = items.reduce((sum, item) => sum + (item.subTotal || 0), 0);
  const subtotal = order.partialTotal ?? (itemsSubtotal || order.amount);
  const discount = order.totalDiscount ?? Math.max(0, subtotal - order.amount);
  const total = order.finalTotal ?? order.amount;
  const taxableBase = total / 1.18;
  const igv = total - taxableBase;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Factura', MARGIN, 22);
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(`Pedido #${order.id}`, MARGIN, 30);
  doc.setTextColor(0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(store.name || 'Kingstore', right, 22, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90);
  doc.text(store.whatsapp ? `Contacto: ${store.whatsapp}` : 'Contacto no registrado', right, 29, { align: 'right' });
  doc.setTextColor(0);

  let y = 44;
  y = drawSectionTitle(doc, y, 'Datos del cliente');
  y = drawRows(doc, y, [
    ['Cliente', user?.name || NR],
    ['Correo', user?.email || NR],
    ['Documento', user?.documentId ? `${user.documentType || 'Documento'} ${user.documentId}` : NR],
    ['Fecha del pedido', formatDate(order.createdAt)],
    ['Estado', order.status],
  ]);

  y = drawSectionTitle(doc, y + 5, 'Detalle de productos');
  if (items.length > 0) {
    y = drawItems(doc, y, items);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(order.productName || 'Producto no registrado', MARGIN, y);
    doc.text(money(total), right, y, { align: 'right' });
    doc.setTextColor(0);
    y += 9;
  }

  y = drawSectionTitle(doc, y + 4, 'Resumen de pago');
  y = drawRows(doc, y, [
    ['Subtotal productos', money(subtotal)],
    ['Descuento aplicado', discount > 0 ? `- ${money(discount)}` : money(0)],
    ['Subtotal sin IGV', money(taxableBase)],
    ['IGV (18%)', money(igv)],
  ]);

  doc.setDrawColor(30);
  doc.line(MARGIN, y + 2, right, y + 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(0);
  doc.text('Total pagado', MARGIN, y + 12);
  doc.text(money(total), right, y + 12, { align: 'right' });

  doc.save(`factura-pedido-${order.id}.pdf`);
};
