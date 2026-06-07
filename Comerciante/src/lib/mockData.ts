/**
@license
SPDX-License-Identifier: Apache-2.0
*/
import { Discount, Order, Product, Quote, Store } from './types';

export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Studio 47',
    type: 'Urbano',
    status: 'Activa',
    palette: '#000000',
    description: 'Polos y camisetas premium de algodón orgánico con corte moderno.',
    customizationIncrement: 10
  },
  {
    id: '2',
    name: 'Urban Roots',
    type: 'Casual',
    status: 'Activa',
    palette: '#5D634B',
    description: 'Vestidos y colecciones femeninas exclusivas para el día a día.',
    customizationIncrement: 5
  },
  {
    id: '3',
    name: 'Denim Factory',
    type: 'Casual',
    status: 'Activa',
    palette: '#B2956D',
    description: 'Expertos en pantalones y mezclilla industrial de alta gama.',
    customizationIncrement: 15
  }
];

export const mockOrders: Order[] = [
  { id: '#P-00241', storeId: '1', customer: 'Jorge Mendoza', status: 'Aprobado', items: 3, total: 267.00, date: '2026-05-10', hasCustomization: true },
  { id: '#P-00240', storeId: '1', customer: 'Carmen Ríos', status: 'En proceso', items: 12, total: 912.00, date: '2026-05-10', isUrgent: true },
  { id: '#P-00239', storeId: '2', customer: 'Luis Apaza', status: 'Enviado', items: 2, total: 178.00, date: '2026-05-09', hasCustomization: true },
  { id: '#P-00238', storeId: '2', customer: 'Daniel Ortiz', status: 'Aprobado', items: 1, total: 89.00, date: '2026-05-09' },
  { id: '#P-00237', storeId: '3', customer: 'Ana Bravo', status: 'Entregado', items: 5, total: 423.00, date: '2026-05-08' },
  { id: '#P-00236', storeId: '3', customer: 'Rafael Soto', status: 'En proceso', items: 8, total: 672.00, date: '2026-05-08' }
];

export const mockQuotes: Quote[] = [
  {
    id: '#CT-0128',
    storeId: '1',
    customer: 'Helena Vega',
    status: 'Pendiente',
    total: 1070.50,
    subtotal: 907.20,
    date: '2026-05-10',
    items: [
      { product: 'Polo Slim Fit Pima', variant: 'Talla M · Negro · Algodón', quantity: 16, price: 42.00 },
      { product: 'Polo Slim Fit Pima', variant: 'Talla L · Negro · Algodón', quantity: 8, price: 42.00 }
    ],
    message: 'Hola Studio 47, necesito una proforma para 24 polos corporativos con logo bordado.',
    hasCustomization: true,
    files: [
      { name: 'logo-empresa.svg', type: 'svg', url: '#' }
    ]
  },
  {
    id: '#CT-0127',
    storeId: '1',
    customer: 'Óscar Mamani',
    status: 'Pendiente',
    total: 2040.00,
    subtotal: 1728.81,
    date: '2026-05-10',
    items: [
      { product: 'Polo Oversize', variant: 'Talla XL · Blanco', quantity: 60, price: 34.00 }
    ],
    message: 'Pedido por volumen para tienda retail.'
  },
  {
    id: '#CT-0126',
    storeId: '1',
    customer: 'Patricia Luna',
    status: 'Pendiente',
    total: 1700.00,
    subtotal: 1440.68,
    date: '2026-05-10',
    items: [
      { product: 'Polo Clásico', variant: 'Talla M · Azul', quantity: 50, price: 34.00 }
    ],
    message: 'Requiere envío a Arequipa.'
  },
  {
    id: '#CT-0129',
    storeId: '2',
    customer: 'Roberto Carlos',
    status: 'Pendiente',
    total: 850.00,
    subtotal: 720.00,
    date: '2026-05-11',
    items: [
      { product: 'Vestido Verano', variant: 'Talla M · Floral', quantity: 5, price: 170.00 }
    ],
    message: 'Consulta sobre tallas XS.'
  },
  {
    id: '#CT-0130',
    storeId: '3',
    customer: 'Sandra Rojas',
    status: 'Pendiente',
    total: 3500.00,
    subtotal: 2966.10,
    date: '2026-05-12',
    items: [
      { product: 'Jeans Industrial', variant: 'Talla 32 · Azul', quantity: 50, price: 70.00 }
    ],
    message: 'Licitación para uniformes de planta.'
  },
  {
    id: '#CT-0131',
    storeId: '1',
    customer: 'Andrés Gil',
    status: 'Pendiente',
    total: 820.00,
    subtotal: 694.92,
    date: '2026-05-13',
    items: [
      { product: 'Polo Básico', variant: 'Talla S · Gris', quantity: 20, price: 41.00 }
    ],
    message: 'Urgente para este viernes.'
  },
  {
    id: '#CT-0132',
    storeId: '2',
    customer: 'Lucía Méndez',
    status: 'Pendiente',
    total: 1250.00,
    subtotal: 1059.32,
    date: '2026-05-13',
    items: [
      { product: 'Blusa Seda', variant: 'Talla S · Marfil', quantity: 10, price: 125.00 }
    ],
    message: 'Necesito 10 unidades para showroom.'
  },
  {
    id: '#CT-0133',
    storeId: '2',
    customer: 'Carlos Ruiz',
    status: 'Pendiente',
    total: 3200.00,
    subtotal: 2711.86,
    date: '2026-05-14',
    items: [
      { product: 'Vestido Gala', variant: 'Talla L · Rojo', quantity: 8, price: 400.00 }
    ],
    message: 'Telas premium solamente.'
  },
  {
    id: '#CT-0134',
    storeId: '3',
    customer: 'Valentina Paredes',
    status: 'Pendiente',
    total: 2100.00,
    subtotal: 1779.66,
    date: '2026-05-14',
    items: [
      { product: 'Chaqueta Denim', variant: 'Talla M · Vintage', quantity: 15, price: 140.00 }
    ],
    message: 'Personalización con láser en espalda.'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Polo Oversized Onyx',
    sku: 'POL-ONX-O',
    description: 'Fit relajado · algodón orgánico premium',
    price: 89.00,
    stock: 84,
    status: 'Activo',
    variants: 12,
    updatedAt: '2026-04-24T10:00:00Z',
    updatedBy: 'María C.',
    sizeColorStock: {
      'M': { 'Blanco': 10, 'Negro': 20, 'Rojo': 5, 'Azul': 5, 'Verde': 0 },
      'L': { 'Blanco': 5, 'Negro': 25, 'Rojo': 4, 'Azul': 10, 'Verde': 0 },
    }
  },
  {
    id: '2',
    name: 'Polo Técnico Sand',
    sku: 'POL-SND-T',
    description: 'Fit regular · jersey técnico',
    price: 79.00,
    stock: 56,
    status: 'Activo',
    variants: 10,
    updatedAt: '2026-04-23T15:00:00Z',
    updatedBy: 'María C.',
    sizeColorStock: {
      'S': { 'Blanco': 5, 'Negro': 10, 'Rojo': 0, 'Azul': 5, 'Verde': 0 },
      'M': { 'Blanco': 10, 'Negro': 15, 'Rojo': 5, 'Azul': 5, 'Verde': 1 },
    }
  },
  {
    id: '3',
    name: 'Polo Clásico Olivo',
    sku: 'POL-CLS-O',
    description: 'Fit slim · piqué premium',
    price: 69.00,
    stock: 112,
    status: 'Activo',
    variants: 20,
    updatedAt: '2026-04-22T09:00:00Z',
    updatedBy: 'María C.',
    sizeColorStock: {
      'M': { 'Blanco': 10, 'Negro': 10, 'Rojo': 10, 'Azul': 10, 'Verde': 10 },
      'L': { 'Blanco': 15, 'Negro': 15, 'Rojo': 12, 'Azul': 10, 'Verde': 10 },
    }
  }
];

export const mockDiscounts: Discount[] = [
  { id: '1', name: 'Compra por mayor • 20+ polos', type: 'Porcentaje', value: 10, minUnits: 20, status: 'Activa', usageCount: 22, appliesTo: 'Todo el catálogo' },
  { id: '2', name: 'Volumen alto • 50+ polos', type: 'Porcentaje', value: 25, minUnits: 50, status: 'Activa', usageCount: 8, appliesTo: 'Todo el catálogo' },
  { id: '3', name: 'Bulk corporate • 100+', type: 'Porcentaje', value: 50, minUnits: 100, status: 'Activa', usageCount: 3, appliesTo: 'Todo el catálogo' },
  { id: '4', name: 'Descuento fijo • Polo Onyx', type: 'Monto Fijo', value: 15, minUnits: 10, status: 'Activa', usageCount: 5, appliesTo: 'Producto específico' },
  { id: '5', name: 'Promo fin de mes • básicos', type: 'Porcentaje', value: 10, minUnits: 12, status: 'Pausada', usageCount: 0, appliesTo: 'Categoría' },
  { id: '6', name: 'Descuento aniversario', type: 'Porcentaje', value: 5, minUnits: 5, status: 'Pausada', usageCount: 0, appliesTo: 'Todo el catálogo' }
];