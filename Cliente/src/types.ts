/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TipoDocumento {
  DNI = 'DNI',
  CE = 'CE',
  RUC = 'RUC'
}

export enum View {
  DIRECTORY = 'DIRECTORY',
  STOREFRONT_PUBLIC = 'STOREFRONT_PUBLIC',
  STOREFRONT_PRIVATE = 'STOREFRONT_PRIVATE',
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_REGISTER = 'AUTH_REGISTER',
  AUTH_FORGOT_PASSWORD = 'AUTH_FORGOT_PASSWORD',
  AUTH_VERIFICATION = 'AUTH_VERIFICATION',
  AUTH_RESET_PASSWORD = 'AUTH_RESET_PASSWORD',
  CATALOG = 'CATALOG',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  REQUEST_QUOTE = 'REQUEST_QUOTE',
  MY_QUOTES = 'MY_QUOTES',
  QUOTE_DETAIL = 'QUOTE_DETAIL',
  MY_ORDERS = 'MY_ORDERS',
  ORDER_DETAIL = 'ORDER_DETAIL',
  CART = 'CART',
  PAYMENT = 'PAYMENT',
  PROFILE = 'PROFILE'
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  specs: string;
  hasDesign: boolean;
  price: number;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  logo: string;
  whatsapp: string;
  designFeePercentage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  material: string;
  tag?: string;
  description: string;
  image?: string;
  category: string;
  colors: string[];
  sizes: string[];
  storeId?: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  documentType?: TipoDocumento;
  documentId?: string;
  storeId: string;
}

export interface Quote {
  id: string;
  productName: string;
  quantity: number;
  date: string;
  amount: number;
  status: 'Pendientes' | 'En revisión' | 'Propuesta enviada' | 'Aprobadas' | 'Rechazadas';
  hasDesign: boolean;
}

export interface Order {
  id: string;
  productName: string;
  date: string;
  amount: number;
  status: 'Pagado' | 'En proceso' | 'En camino' | 'Entregado';
}

export enum PrimaryColor {
  ONYX_BLACK = '#0F1011',
  MIDNIGHT = '#1A2332',
  ESPRESSO = '#4B3621',
  ALABASTER = '#F9FAFB',
  WARM_CREAM = '#FDFBF7'
}

export enum SecondaryColor {
  SLATE = '#475569',
  SAGE = '#8A9A86',
  TERRA = '#E2725B',
  GHOST_WHITE = '#FFFFFF',
  SOFT_TAUPE = '#D5CEC4'
}

export enum TertiaryColor {
  RAW_GOLD = '#D4AF37',
  COPPER = '#B87333',
  COBALT_BLUE = '#2563EB',
  CORAL_PUNCH = '#FF5A5F',
  EMERALD = '#10B981'
}

