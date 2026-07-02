/**
@license
SPDX-License-Identifier: Apache-2.0
*/
export interface StoreCategory {
  id: number;
  name: string;
}

export interface Store {
  id: string;
  name: string;
  type: string;
  categoryId?: number;
  categoryName?: string;
  status: 'Activa' | 'Inactiva';
  logo?: string;
  logoUrl?: string;
  palette?: string;
  description?: string;
  customizationIncrement?: 5 | 10 | 15;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
}

export type OrderStatus = 'Pagado' | 'En proceso' | 'Enviado' | 'Entregado' | 'Cancelado';

export interface OrderItemDetail {
  productId?: string;
  productName?: string;
  productVariantId?: string;
  size?: string;
  color?: string;
  stock?: number | null;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface ShippingInfo {
  address?: string;
  district?: string;
  reference?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
}

export interface Order {
  id: string;
  storeId: string;
  customer: string;
  status: OrderStatus;
  items: number;
  total: number;
  date: string;
  createdAt?: string;
  isUrgent?: boolean;
  hasCustomization?: boolean;
  // Datos reales expuestos por el backend (contrato Comerciante).
  itemsDetail?: OrderItemDetail[];
  customerEmail?: string;
  customerPhone?: string;
  documentType?: string;
  documentNumber?: string;
  shippingDetail?: ShippingInfo | null;
  partialTotal?: number;
  totalDiscount?: number;
  finalTotal?: number;
  observations?: string;
}

export type QuoteStatus = 'Pendiente' | 'Aprobada' | 'Rechazada';

export interface Quote {
  id: string;
  storeId: string;
  customer: string;
  status: QuoteStatus;
  total: number;
  subtotal: number;
  date: string;
  requestedAt?: string;
  responseDate?: string;
  responseAt?: string;
  items: {
    id?: string;
    product: string;
    variant: string;
    quantity: number;
    price: number;
    stock?: number | null;
    productId?: string;
    productImageUrl?: string;
    productVariantId?: string;
    size?: string;
    color?: string;
    unitPrice?: number;
    subTotal?: number;
    customerDescription?: string | null;
    designs?: { name: string; type: string; url: string; quotationItemId?: number | null }[];
  }[];
  message?: string;
  observations?: string;
  hasCustomization?: boolean;
  files?: {
    name: string;
    type: string;
    url: string;
  }[];
  // Datos reales del cliente expuestos por el backend.
  customerEmail?: string;
  customerPhone?: string;
  documentType?: string;
  documentNumber?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sizeStock?: Record<string, number>;
  sizeColorStock?: Record<string, Record<string, number>>;
  status: 'Activo' | 'Borrador' | 'Sin stock' | 'Inactivo';
  variants?: number;
  updatedAt: string;
  updatedBy: string;
  sku?: string;
  sizes?: string[];
  image?: string;
  images?: { name: string; url: string }[];
}

export interface Discount {
  id: string;
  productId?: string;
  productName?: string;
  name: string;
  type?: 'Porcentaje';
  value: number;
  minUnits: number;
  status: 'Activa' | 'Pausada';
  usageCount: number;
  appliesTo: 'Todo el catálogo' | 'Producto específico';
}
