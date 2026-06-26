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
  quoteDescription?: string | null;
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
  slug?: string;
  storeName?: string;
  logoUrl?: string | null;
}

// DTO real expuesto por GET /stores/public y GET /stores/public/{slug}
export interface StorePublicDTO {
  id: number;
  storeName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  category: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  tertiaryColor: string | null;
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
  imageUrls?: string[];
  variants?: ProductVariant[];
  discounts?: DiscountPublic[];
  stock?: number;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  stock: number;
}

export interface DiscountPublic {
  id: number;
  name: string;
  volumeType: string;
  minQuantity: number;
  maxQuantity: number;
  discountPercentage: number;
}

// DTO real expuesto por GET /stores/public/{slug}/products
export interface ProductPublicDTO {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrls: string[] | null;
  variants: ProductVariant[] | null;
  discounts: DiscountPublic[] | null;
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

// Perfil real devuelto por GET /stores/{slug}/customers/me
export interface CustomerUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  role: string;
  storeSlug: string;
}

// Body de POST /stores/{slug}/auth/login
export interface LoginRequestDTO {
  email: string;
  password: string;
}

// Respuesta de POST /stores/{slug}/auth/login
export interface LoginResponseDTO {
  id: number;
  email: string;
  role: string;
  storeSlug: string;
  token: string;
}

// Body de POST /stores/{slug}/customers/register
export interface RegisterCustomerDTO {
  email: string;
  password: string;
  documentNumber: string;
  documentType: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  birthDate: string;
  phone: string;
  gender: string;
}

export interface Quote {
  id: string;
  productName: string;
  quantity: number;
  date: string;
  amount: number;
  status: 'Pendientes' | 'En revisión' | 'En revision' | 'Propuesta enviada' | 'Aprobadas' | 'Rechazadas';
  hasDesign: boolean;
  rawStatus?: string;
  subTotal?: number;
  discount?: number;
  description?: string | null;
  observations?: string | null;
  items?: QuotationItemResponseDTO[];
  files?: QuotationDesignDTO[];
}

export interface CartResponseDTO {
  id: number;
  items: CartItemResponseDTO[];
  subTotal: number;
  discount: number;
  totalAmount: number;
}

export interface CartItemResponseDTO {
  id: number;
  productVariantId: number;
  productName: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
  discountApplied: number;
  customDesign: CartCustomDesignResponseDTO | null;
}

export interface CartCustomDesignResponseDTO {
  id: number;
  imageUrl: string | null;
  description: string | null;
  observations: string | null;
  sentAt: string | null;
}

export interface CartItemRequestDTO {
  productVariantId?: number;
  quantity: number;
}

export interface CustomDesignRequestDTO {
  imageUrl?: string | null;
  description?: string | null;
}

export interface QuotationResponseDTO {
  id: number;
  customer: string;
  status: string;
  statusLabel: string;
  subTotal: number;
  discount: number;
  totalAmount: number;
  requestedAt: string | null;
  responseAt: string | null;
  description: string | null;
  observations: string | null;
  storeId: number;
  items: QuotationItemResponseDTO[];
  designs?: QuotationDesignDTO[];
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  documentType?: string | null;
  documentNumber?: string | null;
}

export interface QuotationDesignDTO {
  id: number;
  fileName: string;
  url: string;
  contentType: string;
  sizeBytes: number;
}

export interface QuotationItemResponseDTO {
  productId: number;
  productName: string;
  productVariantId: number;
  size: string;
  color: string;
  stockAvailable: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  product?: string;
  variant?: string;
  price?: number;
}

export interface OrderItemResponseDTO {
  productId: number | null;
  productName: string | null;
  productVariantId: number | null;
  size: string | null;
  color: string | null;
  stockAvailable: number | null;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface OrderShippingResponseDTO {
  address: string | null;
  district: string | null;
  reference: string | null;
  estimatedDeliveryDate: string | null;
  actualDeliveryDate: string | null;
}

export interface OrderResponseDTO {
  id: number;
  customer: string;
  status: string;
  statusLabel: string;
  items: number;
  total: number | null;
  createdAt: string | null;
  storeId: number;
  itemsDetail: OrderItemResponseDTO[];
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  documentType: string | null;
  documentNumber: string | null;
  shippingDetail: OrderShippingResponseDTO | null;
  partialTotal: number | null;
  totalDiscount: number | null;
  finalTotal: number | null;
  observations: string | null;
}

export interface PaymentPayload {
  ruc?: string;
  paymentMethod: 'VIRTUAL' | 'CASH_ON_DELIVERY';
  receiptType: 'BOLETA' | 'FACTURA';
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface QuotationCreatePayload {
  description?: string | null;
  designs?: File[];
}

export interface PaymentResponseDTO {
  message: string;
  receiptId: number;
  orderId: number;
  total: number;
  paymentStatus: string;
}

export interface Order {
  id: string;
  realId?: number;
  productName: string;
  date: string;
  amount: number;
  status: 'Pago pendiente' | 'Pagado' | 'En proceso' | 'En camino' | 'Entregado' | 'Cancelado';
  rawStatus?: string;
  itemsDetail?: OrderItemResponseDTO[];
  finalTotal?: number;
  partialTotal?: number;
  totalDiscount?: number;
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
