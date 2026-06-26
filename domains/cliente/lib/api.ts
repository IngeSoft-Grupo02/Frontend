/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CartItem,
  CartItemRequestDTO,
  CartResponseDTO,
  CustomerUser,
  CustomDesignRequestDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  Order,
  OrderResponseDTO,
  PaymentPayload,
  PaymentResponseDTO,
  PrimaryColor,
  Product,
  ProductPublicDTO,
  QuotationCreatePayload,
  QuotationResponseDTO,
  Quote,
  RegisterCustomerDTO,
  SecondaryColor,
  Store,
  StorePublicDTO,
  TertiaryColor,
} from '../types';
import { getColorDisplay, getColorLabel } from '../../shared/colors';
import { translateErrorMessage } from '../../shared/errors';

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  } as Record<string, string>;
  const authorizationHeader = headers.Authorization || headers.authorization;
  const authPresent = Boolean(authorizationHeader);
  const tokenLength = typeof authorizationHeader === 'string'
    ? authorizationHeader.replace(/^Bearer\s+/i, '').length
    : 0;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch (networkError) {
    console.warn(
      `[API] ${method} ${path} -> sin respuesta (fetch falló):`,
      networkError instanceof Error ? networkError.message : String(networkError),
    );
    throw new ApiError('No se pudo conectar con el servidor. Intenta nuevamente.', 0);
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    // Diagnóstico no sensible (NO imprime el token, solo si se envió Authorization).
    console.warn(
      `[API] ${method} ${path} -> HTTP ${response.status} | Authorization: ${authPresent ? `sí (${tokenLength} chars)` : 'no'} | body: ${text ? text.slice(0, 200) : '(vacío)'}`,
    );

    // 401/403 en una request autenticada = token del cliente ausente/expirado/ inválido
    // (el token de cliente caduca a 1h). No es un error genérico: la sesión expiró.
    // Avisamos a la app para limpiar la sesión y volver a login, en vez de mostrar
    // "Ocurrió un error" mientras el usuario sigue "logueado" con un token muerto.
    if (authPresent && (response.status === 401 || response.status === 403)) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kc:session-expired'));
      }
      throw new ApiError('Tu sesión expiró. Vuelve a iniciar sesión.', response.status);
    }

    let message = `Error ${response.status}`;
    if (typeof data === 'string' && data.trim().length > 0) {
      message = data;
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (typeof obj.message === 'string') message = obj.message;
      else if (typeof obj.error === 'string') message = obj.error;
    }
    throw new ApiError(translateErrorMessage(message), response.status);
  }

  return data as T;
}

/** Convierte el nombre de un enum de color del backend (ej. "ONYX_BLACK") en su valor hex. */
function resolveColor(
  enumObj: Record<string, string>,
  key: string | null | undefined,
  fallback: string,
): string {
  if (key && key in enumObj) {
    return enumObj[key];
  }
  const trimmed = key?.trim();
  if (trimmed && (/^#[\da-f]{3,8}$/i.test(trimmed) || /^rgba?\(/i.test(trimmed))) {
    return trimmed;
  }
  // Cobertura completa de los enums del backend: el enum local de types.ts solo
  // mapea un subconjunto, así que para el resto (ej. RICH_CAMEL, OLIVE_DRAB,
  // DEEP_ZINC) consultamos el mapa compartido en vez de colapsar al fallback.
  if (trimmed) {
    const display = getColorDisplay(trimmed);
    if (display.mapped) {
      return display.swatch;
    }
  }
  return fallback;
}

function buildInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return initials || 'KS';
}

/** Adapta el DTO real de tienda pública al modelo Store usado por las vistas del prototipo. */
export function toStore(dto: StorePublicDTO): Store {
  const primaryColor = resolveColor(PrimaryColor as unknown as Record<string, string>, dto.primaryColor, PrimaryColor.ONYX_BLACK);
  const secondaryColor = resolveColor(SecondaryColor as unknown as Record<string, string>, dto.secondaryColor, SecondaryColor.SLATE);
  const tertiaryColor = resolveColor(TertiaryColor as unknown as Record<string, string>, dto.tertiaryColor, TertiaryColor.RAW_GOLD);

  return {
    id: dto.slug,
    slug: dto.slug,
    name: dto.storeName,
    storeName: dto.storeName,
    description: dto.description || '',
    category: dto.category || '',
    color: primaryColor,
    primaryColor,
    secondaryColor,
    tertiaryColor,
    logo: buildInitials(dto.storeName),
    logoUrl: dto.logoUrl,
    whatsapp: '',
  };
}

export function fetchPublicStores(): Promise<StorePublicDTO[]> {
  return request<StorePublicDTO[]>('/stores/public');
}

export function fetchPublicStore(slug: string): Promise<StorePublicDTO> {
  return request<StorePublicDTO>(`/stores/public/${encodeURIComponent(slug)}`);
}

export function registerCustomer(slug: string, dto: RegisterCustomerDTO): Promise<string> {
  return request<string>(`/stores/${encodeURIComponent(slug)}/customers/register`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function loginCustomer(slug: string, credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
  return request<LoginResponseDTO>(`/stores/${encodeURIComponent(slug)}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function fetchCustomerMe(slug: string, token: string): Promise<CustomerUser> {
  return request<CustomerUser>(`/stores/${encodeURIComponent(slug)}/customers/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

/** Adapta el DTO público de producto al modelo usado por las vistas del cliente. */
export function toProduct(dto: ProductPublicDTO, storeSlug: string): Product {
  const variants = dto.variants || [];
  const imageUrls = dto.imageUrls || [];
  const colors = unique(variants.map((variant) => String(variant.color)));
  const sizes = unique(variants.map((variant) => variant.size));

  return {
    id: String(dto.id),
    name: dto.name,
    price: dto.basePrice,
    material: '',
    description: dto.description || 'Producto disponible para cotización.',
    image: imageUrls[0],
    imageUrls,
    category: sizes.length > 0 ? `${sizes.length} tallas disponibles` : 'Catálogo',
    colors,
    sizes,
    variants,
    discounts: dto.discounts || [],
    storeId: storeSlug,
    createdAt: Number(dto.id),
    stock: variants.reduce((sum, variant) => sum + (variant.stock || 0), 0),
  };
}

export function toCartItems(dto: CartResponseDTO): CartItem[] {
  return (dto.items || []).map((item) => ({
    id: String(item.id),
    productId: String(item.productVariantId),
    productName: item.productName,
    quantity: item.quantity,
    specs: [item.size, item.color ? getColorLabel(item.color) : ''].filter(Boolean).join(' / '),
    hasDesign: Boolean(item.customDesign),
    price: item.price,
    quoteDescription: item.customDesign?.description ?? null,
  }));
}

function toQuoteStatus(dto: QuotationResponseDTO): Quote['status'] {
  const raw = String(dto.status || '').toUpperCase();
  const label = String(dto.statusLabel || '').toLowerCase();
  if (raw.includes('APPROV') || label.includes('aprob')) return 'Aprobadas';
  if (raw.includes('REJECT') || raw.includes('DECLIN') || label.includes('rechaz')) return 'Rechazadas';
  if (raw.includes('RESPOND') || raw.includes('PROPOS') || label.includes('propuesta')) return 'Propuesta enviada';
  if (raw.includes('REVIEW') || label.includes('revisi')) return 'En revisión' as Quote['status'];
  return 'Pendientes';
}

function formatDate(value: string | null): string {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function toQuote(dto: QuotationResponseDTO): Quote {
  const items = dto.items || [];
  const firstItem = items[0];
  return {
    id: String(dto.id),
    productName: firstItem?.productName || firstItem?.product || `Cotización ${dto.id}`,
    quantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    date: formatDate(dto.requestedAt),
    amount: dto.totalAmount ?? 0,
    status: toQuoteStatus(dto),
    hasDesign: Boolean(dto.description || dto.observations || dto.designs?.length),
    rawStatus: dto.status,
    subTotal: dto.subTotal ?? 0,
    discount: dto.discount ?? 0,
    description: dto.description,
    observations: dto.observations,
    items,
    files: dto.designs || [],
  };
}

export function fetchPublicProducts(slug: string, search?: string): Promise<ProductPublicDTO[]> {
  const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  return request<ProductPublicDTO[]>(`/stores/public/${encodeURIComponent(slug)}/products${query}`);
}

export function fetchPublicProduct(slug: string, productId: string | number): Promise<ProductPublicDTO> {
  return request<ProductPublicDTO>(`/stores/public/${encodeURIComponent(slug)}/products/${encodeURIComponent(String(productId))}`);
}

export function fetchCart(slug: string, token: string): Promise<CartResponseDTO> {
  return request<CartResponseDTO>(`/stores/${encodeURIComponent(slug)}/cart`, {
    headers: authHeaders(token),
  });
}

export function addCartItem(slug: string, token: string, dto: CartItemRequestDTO): Promise<CartResponseDTO> {
  return request<CartResponseDTO>(`/stores/${encodeURIComponent(slug)}/cart/items`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dto),
  });
}

export function updateCartItem(slug: string, token: string, itemId: string | number, dto: CartItemRequestDTO): Promise<CartResponseDTO> {
  return request<CartResponseDTO>(`/stores/${encodeURIComponent(slug)}/cart/items/${encodeURIComponent(String(itemId))}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(dto),
  });
}

export function removeCartItem(slug: string, token: string, itemId: string | number): Promise<CartResponseDTO> {
  return request<CartResponseDTO>(`/stores/${encodeURIComponent(slug)}/cart/items/${encodeURIComponent(String(itemId))}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export function addCartDesign(
  slug: string,
  token: string,
  itemId: string | number,
  dto: CustomDesignRequestDTO,
): Promise<CartResponseDTO> {
  return request<CartResponseDTO>(`/stores/${encodeURIComponent(slug)}/cart/items/${encodeURIComponent(String(itemId))}/design`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(dto),
  });
}

export function createQuotation(slug: string, token: string, payload: QuotationCreatePayload = {}): Promise<QuotationResponseDTO> {
  const description = payload.description?.trim() ? payload.description.trim() : null;
  const designs = payload.designs || [];
  if (designs.length > 0) {
    const body = new FormData();
    if (description) body.append('description', description);
    designs.forEach((file) => body.append('designs', file));
    return request<QuotationResponseDTO>(`/stores/${encodeURIComponent(slug)}/quotations`, {
      method: 'POST',
      headers: authHeaders(token),
      body,
    });
  }

  const body = { description };
  return request<QuotationResponseDTO>(`/stores/${encodeURIComponent(slug)}/quotations`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export function fetchQuotations(slug: string, token: string): Promise<QuotationResponseDTO[]> {
  return request<QuotationResponseDTO[]>(`/stores/${encodeURIComponent(slug)}/quotations`, {
    headers: authHeaders(token),
  });
}

export function fetchQuotation(slug: string, token: string, quoteId: string | number): Promise<QuotationResponseDTO> {
  return request<QuotationResponseDTO>(`/stores/${encodeURIComponent(slug)}/quotations/${encodeURIComponent(String(quoteId))}`, {
    headers: authHeaders(token),
  });
}

function orderStatusLabel(rawStatus: string): Order['status'] {
  const map: Record<string, Order['status']> = {
    PAYMENT_CONFIRMED: 'Pagado',
    IN_PREPARATION: 'En proceso',
    IN_TRANSIT: 'En camino',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };
  return map[rawStatus] ?? 'Pago pendiente';
}

export function toOrder(dto: OrderResponseDTO): Order {
  const firstItem = dto.itemsDetail?.[0];
  return {
    id: String(dto.id),
    realId: dto.id,
    productName: firstItem?.productName || `Pedido ${dto.id}`,
    date: formatDate(dto.createdAt),
    amount: dto.finalTotal ?? dto.total ?? 0,
    status: orderStatusLabel(dto.status),
    rawStatus: dto.status,
    itemsDetail: dto.itemsDetail,
    finalTotal: dto.finalTotal ?? undefined,
    partialTotal: dto.partialTotal ?? undefined,
    totalDiscount: dto.totalDiscount ?? undefined,
  };
}

export function fetchOrders(slug: string, token: string): Promise<OrderResponseDTO[]> {
  return request<OrderResponseDTO[]>(`/stores/${encodeURIComponent(slug)}/orders`, {
    headers: authHeaders(token),
  });
}

export function fetchOrder(slug: string, token: string, orderId: number): Promise<OrderResponseDTO> {
  return request<OrderResponseDTO>(`/stores/${encodeURIComponent(slug)}/orders/${orderId}`, {
    headers: authHeaders(token),
  });
}

export function payOrder(slug: string, token: string, orderId: number, payload: PaymentPayload): Promise<PaymentResponseDTO> {
  return request<PaymentResponseDTO>(`/stores/${encodeURIComponent(slug)}/orders/${orderId}/payment`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}
