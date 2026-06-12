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

export interface Order {
  id: string;
  storeId: string;
  customer: string;
  status: OrderStatus;
  items: number;
  total: number;
  date: string;
  isUrgent?: boolean;
  hasCustomization?: boolean;
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
  items: {
    product: string;
    variant: string;
    quantity: number;
    price: number;
  }[];
  message?: string;
  observations?: string;
  hasCustomization?: boolean;
  files?: {
    name: string;
    type: string;
    url: string;
  }[];
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
