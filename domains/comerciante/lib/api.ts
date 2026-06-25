import { Discount, Order, Product, Quote, Store, StoreCategory } from './types';
import { getColorLabel } from '@/domains/shared/colors';
import { translateErrorMessage } from '@/domains/shared/errors';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const TOKEN_KEY = 'mc_token';

type JsonValue = Record<string, any>;

export interface MerchantUser {
  id?: number;
  email: string;
  role: string;
  name: string;
  firstName?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  phone?: string;
}

export interface LoginResult {
  token: string;
  user: MerchantUser;
}

export interface BulkUploadResult {
  productsCreated: number;
  variantsProcessed: number;
  imagesUploaded: number;
  errors: string[];
}

export const merchantSession = {
  getToken: () => (typeof window === 'undefined' ? null : sessionStorage.getItem(TOKEN_KEY)),
  setToken: (token: string) => {
    if (typeof window !== 'undefined') sessionStorage.setItem(TOKEN_KEY, token);
  },
  clear: () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Devuelve true si el JWT está vencido, malformado o no se puede decodificar.
 * Un token sin payload válido o sin `exp` legible se trata como inválido.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

/** Limpia la sesión del comerciante y avisa al contexto que la sesión expiró. */
function handleSesionNoAutorizada() {
  if (typeof window === 'undefined') return;
  merchantSession.clear();
  window.dispatchEvent(new Event('merchant:session-expired'));
}

function normalizeMerchantErrorMessage(message: string, status: number): string {
  const normalized = message
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (
    status === 401 ||
    normalized.includes('invalid credentials') ||
    normalized.includes('bad_credentials') ||
    normalized.includes('contras')
  ) {
    return 'La contraseña ingresada es incorrecta.';
  }

  return message;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = merchantSession.getToken();
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error(`No se pudo conectar con el servidor. Verifica que el backend esté corriendo en ${API_BASE_URL}.`);
  }

  if (!response.ok) {
    // Sesión inválida/expirada en una request autenticada: limpiar y notificar.
    if (token && (response.status === 401 || response.status === 403)) {
      handleSesionNoAutorizada();
    }
    const raw = await response.text();
    let message = raw || `Error HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(raw);
      message = parsed.message || parsed.error || raw;
    } catch {
      // El helper final traduce errores backend conocidos y oculta mensajes técnicos.
    }
    throw new Error(normalizeMerchantErrorMessage(translateErrorMessage(message), response.status));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const withStore = (storeId?: string) => {
  const id = parseInt(storeId || '', 10);
  return Number.isFinite(id) ? `?storeId=${id}` : '';
};

const fullName = (user: Partial<MerchantUser>) =>
  [user.firstName, user.paternalSurname, user.maternalSurname].filter(Boolean).join(' ').trim();

const colorFromBackend = (color?: string) => {
  switch (color) {
    case 'BLACK': return 'Negro';
    case 'WHITE': return 'Blanco';
    case 'RED': return 'Rojo';
    case 'BLUE': return 'Azul';
    case 'GREEN': return 'Verde';
    default: return getColorLabel(color || 'Negro');
  }
};

const colorToBackend = (color?: string) => {
  switch ((color || '').toLowerCase()) {
    case 'negro': return 'BLACK';
    case 'blanco': return 'WHITE';
    case 'rojo': return 'RED';
    case 'azul': return 'BLUE';
    case 'verde': return 'GREEN';
    case 'amarillo': return 'YELLOW';
    case 'naranja': return 'ORANGE';
    case 'morado': return 'PURPLE';
    case 'rosado': return 'PINK';
    case 'gris': return 'GRAY';
    case 'marrón':
    case 'marron': return 'BROWN';
    case 'beige': return 'BEIGE';
    case 'azul marino': return 'NAVY';
    case 'dorado': return 'GOLD';
    case 'plateado': return 'SILVER';
    default: return 'BLACK';
  }
};

const activeFromStatus = (status?: Product['status'] | Discount['status']) =>
  status === 'Activo' || status === 'Activa';

const productStatusFromBackend = (rawStatus: unknown, active?: boolean): Product['status'] => {
  const normalized = String(rawStatus || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_\s-]+/g, ' ');

  if (normalized === 'draft' || normalized === 'borrador') return 'Borrador';
  if (normalized === 'out of stock' || normalized === 'sin stock' || normalized === 'fuera de stock') return 'Sin stock';
  if (normalized === 'inactive' || normalized === 'inactivo' || normalized === 'inactiva') return 'Inactivo';
  if (normalized === 'active' || normalized === 'activo' || normalized === 'activa') return 'Activo';
  return active === false ? 'Inactivo' : 'Activo';
};

const productStatusToBackend = (status?: Product['status']) => {
  switch (status) {
    case 'Borrador': return 'DRAFT';
    case 'Sin stock': return 'OUT_OF_STOCK';
    case 'Inactivo': return 'INACTIVE';
    case 'Activo':
    default: return 'ACTIVE';
  }
};

const isPersistableUrl = (value?: string) => {
  const url = (value || '').trim();
  return Boolean(url) && !url.startsWith('data:') && !url.startsWith('blob:');
};

const uniqueImageUrls = (urls: Array<string | undefined>) => {
  const seen = new Set<string>();
  return urls
    .map(url => (url || '').trim())
    .filter(url => {
      if (!isPersistableUrl(url) || seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .slice(0, 5);
};

const PRIMARY_COLOR_HEX: Record<string, string> = {
  ONYX_BLACK: '#0F1011',
  MIDNIGHT: '#1A2332',
  CHARCOAL: '#36454F',
  ESPRESSO: '#4B3621',
  ALABASTER: '#F9FAFB',
  WARM_CREAM: '#FDFBF7'
};

const SECONDARY_COLOR_HEX: Record<string, string> = {
  SLATE: '#475569',
  SAGE: '#8A9A86',
  TERRA: '#E2725B',
  DUSTY_RED: '#B25C5C',
  GHOST_WHITE: '#FFFFFF',
  SOFT_TAUPE: '#D5CEC4',
  BLUSH_PINK: '#F4C2C2',
  FROSTED_BLUE: '#B0E0E6'
};

const TERTIARY_COLOR_HEX: Record<string, string> = {
  RAW_GOLD: '#D4AF37',
  COPPER: '#B87333',
  COBALT_BLUE: '#2563EB',
  CORAL_PUNCH: '#FF5A5F',
  EMERALD: '#10B981',
  SUNFLOWER: '#FFC107',
  HOT_MAGENTA: '#FF00FF',
  VIOLET_POP: '#8B5CF6'
};

const colorHex = (value: unknown, palette: Record<string, string>, fallback: string) => {
  const key = String(value || '').toUpperCase();
  return palette[key] || fallback;
};

const colorEnum = (value: unknown, palette: Record<string, string>, fallback: string) => {
  const raw = String(value || '').trim();
  const key = raw.toUpperCase();
  if (palette[key]) return key;
  const byHex = Object.entries(palette).find(([, hex]) => hex.toLowerCase() === raw.toLowerCase());
  return byHex?.[0] || fallback;
};

const withSearch = (search?: string) => {
  const term = search?.trim();
  return term ? `?search=${encodeURIComponent(term)}` : '';
};

const logoUrlPayload = (store: Store | Omit<Store, 'id'>) => {
  const value = store.logoUrl || store.logo || '';
  if (!value || value.startsWith('data:') || value.startsWith('blob:')) return undefined;
  return value;
};

export const mapStore = (raw: JsonValue): Store => {
  const primaryColor = raw.primaryColor || raw.colors?.primary || 'ONYX_BLACK';
  const secondaryColor = raw.secondaryColor || raw.colors?.secondary || 'SLATE';
  const tertiaryColor = raw.tertiaryColor || raw.colors?.tertiary || 'RAW_GOLD';
  const categoryName = raw.categoryName || raw.category?.storeCategoryName || raw.type || '';

  return {
    id: String(raw.id),
    name: raw.name || 'Tienda',
    type: categoryName,
    categoryId: raw.categoryId ?? raw.category?.id,
    categoryName,
    status: raw.status === 'Inactiva' || raw.status === 'INACTIVE' ? 'Inactiva' : 'Activa',
    logo: raw.logoUrl,
    logoUrl: raw.logoUrl,
    palette: colorHex(primaryColor, PRIMARY_COLOR_HEX, raw.palette || '#000000'),
    description: raw.description || '',
    customizationIncrement: [5, 10, 15].includes(raw.customizationIncrement) ? raw.customizationIncrement : 10,
    contactEmail: raw.contactEmail || '',
    contactPhone: raw.contactPhone || '',
    address: raw.address || '',
    website: raw.website || '',
    colors: {
      primary: String(primaryColor),
      secondary: String(secondaryColor),
      tertiary: String(tertiaryColor)
    }
  };
};

export const mapStoreCategory = (raw: JsonValue): StoreCategory => ({
  id: Number(raw.id),
  name: raw.name || raw.storeCategoryName || raw.categoryName || 'Categoría'
});

export const mapProduct = (raw: JsonValue): Product => {
  const sizeColorStock: Record<string, Record<string, number>> = (raw.variants || []).reduce((acc: Record<string, Record<string, number>>, variant: JsonValue) => {
    const size = variant.size || 'Única';
    const color = colorFromBackend(variant.color);
    acc[size] = { ...(acc[size] || {}), [color]: Number(variant.stock || 0) };
    return acc;
  }, {});
  const sizes = Object.keys(sizeColorStock);
  const images = uniqueImageUrls(raw.imageUrls || []).map((url, index) => ({ name: `imagen-${index + 1}`, url }));

  return {
    id: String(raw.id),
    name: raw.name || 'Producto',
    description: raw.description || '',
    price: Number(raw.price || 0),
    stock: Number(raw.stock || 0),
    sizeColorStock,
    sizeStock: Object.fromEntries(
      sizes.map(size => [
        size,
        Object.values(sizeColorStock[size]).reduce((sum: number, value: number) => sum + value, 0)
      ])
    ) as Record<string, number>,
    status: productStatusFromBackend(raw.status, raw.active),
    variants: raw.variants?.length || 0,
    updatedAt: new Date().toISOString(),
    updatedBy: 'Backend',
    sizes,
    image: images[0]?.url,
    images
  };
};

export const productPayload = (product: Product | Omit<Product, 'id'>) => {
  const variants = Object.entries(product.sizeColorStock || {}).flatMap(([size, colors]) =>
    Object.entries(colors).map(([color, stock]) => ({
      size,
      color: colorToBackend(color),
      stock: Number(stock || 0)
    }))
  );
  const imageUrls = uniqueImageUrls([
    ...(product.images?.map(image => image.url) || []),
    product.image
  ]);

  return {
    name: product.name,
    description: product.description || '',
    price: Number(product.price || 0),
    costPrice: Math.max(Number(product.price || 0) * 0.7, 0),
    imageUrls,
    variants,
    active: activeFromStatus(product.status),
    status: productStatusToBackend(product.status)
  };
};

const normalizeDiscountAppliesTo = (value: unknown): Discount['appliesTo'] => {
  const text = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return text.includes('producto') ? 'Producto específico' : 'Todo el catálogo';
};

export const mapDiscount = (raw: JsonValue): Discount => ({
  id: String(raw.id),
  productId: raw.productId != null ? String(raw.productId) : undefined,
  productName: raw.productName,
  name: raw.name || raw.productName || 'Descuento',
  type: 'Porcentaje',
  value: Number(raw.value ?? raw.discountPercentage ?? 0),
  minUnits: Number(raw.minUnits ?? raw.minQuantity ?? 0),
  status: raw.status === 'Pausada' || raw.active === false ? 'Pausada' : 'Activa',
  usageCount: Number(raw.usageCount || 0),
  appliesTo: normalizeDiscountAppliesTo(raw.appliesTo)
});

export const discountPayload = (discount: Discount | Partial<Discount>) => ({
  name: discount.name,
  type: 'Porcentaje',
  value: Number(discount.value || 0),
  minUnits: Number(discount.minUnits || 0),
  minQuantity: Number(discount.minUnits || 0),
  maxQuantity: Number(discount.minUnits || 0),
  volumeType: 'UNIT',
  active: (discount.status || 'Activa') === 'Activa',
  status: discount.status || 'Activa',
  appliesTo: discount.appliesTo === 'Producto específico' ? 'Producto específico' : 'Todo el catálogo',
  productId: discount.appliesTo === 'Producto específico' && discount.productId ? Number(discount.productId) : null,
  usageCount: discount.usageCount || 0
});

const orderStatusFromBackend = (rawStatus: unknown, rawLabel: unknown): Order['status'] => {
  const normalized = String(rawLabel ?? rawStatus ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
  if (normalized === 'in_preparation' || normalized === 'en proceso') return 'En proceso';
  if (normalized === 'in_transit' || normalized === 'enviado') return 'Enviado';
  if (normalized === 'delivered' || normalized === 'entregado') return 'Entregado';
  if (normalized === 'cancelled' || normalized === 'canceled' || normalized === 'cancelado') return 'Cancelado';
  return 'Pagado'; // PAYMENT_CONFIRMED / Pagado
};

// Detecta enums internos del backend que no deben mostrarse como texto del cliente.
const INTERNAL_ENUM_TOKENS = /\b(APPROVED|PENDING|REJECTED|PAYMENT_CONFIRMED|IN_PREPARATION|IN_TRANSIT|DELIVERED|CANCELLED)\b/;

// Devuelve una descripci\u00f3n real del cliente o '' si est\u00e1 vac\u00eda / es texto t\u00e9cnico de seeds.
const cleanCustomerDescription = (value: unknown): string => {
  const text = String(value ?? '').trim();
  if (!text) return '';
  if (INTERNAL_ENUM_TOKENS.test(text)) return '';
  return text;
};

const mapOrderItemDetail = (item: JsonValue) => ({
  productId: item.productId != null ? String(item.productId) : undefined,
  productName: item.productName || undefined,
  productVariantId: item.productVariantId != null ? String(item.productVariantId) : undefined,
  size: item.size || undefined,
  color: item.color ? getColorLabel(item.color) : undefined,
  // ?? para no romper stock 0 (0 es válido); solo null/undefined cae a null.
  stock: (item.stockAvailable ?? item.stock ?? null) as number | null,
  quantity: Number(item.quantity || 0),
  unitPrice: Number(item.unitPrice ?? item.price ?? 0),
  subTotal: Number(item.subTotal ?? 0)
});

const mapShippingDetail = (raw: JsonValue): Order['shippingDetail'] => {
  const shipping = raw.shippingDetail;
  if (!shipping || typeof shipping !== 'object') return null;
  return {
    address: shipping.address || undefined,
    district: shipping.district || undefined,
    reference: shipping.reference || undefined,
    estimatedDeliveryDate: shipping.estimatedDeliveryDate || undefined,
    actualDeliveryDate: shipping.actualDeliveryDate || undefined
  };
};

export const mapOrder = (raw: JsonValue): Order => {
  const itemsDetail = Array.isArray(raw.itemsDetail) ? raw.itemsDetail.map(mapOrderItemDetail) : undefined;
  return {
    id: String(raw.id),
    storeId: String(raw.storeId || ''),
    customer: raw.customerName || raw.customer || 'Cliente',
    status: orderStatusFromBackend(raw.status, raw.statusLabel),
    items: Number(raw.items ?? (itemsDetail ? itemsDetail.length : 0)),
    total: Number(raw.finalTotal ?? raw.total ?? 0),
    date: raw.createdAt ? String(raw.createdAt).slice(0, 10) : new Date().toISOString().slice(0, 10),
    itemsDetail,
    customerEmail: raw.customerEmail || undefined,
    customerPhone: raw.customerPhone || undefined,
    documentType: raw.documentType || undefined,
    documentNumber: raw.documentNumber || undefined,
    shippingDetail: mapShippingDetail(raw),
    partialTotal: raw.partialTotal != null ? Number(raw.partialTotal) : undefined,
    totalDiscount: raw.totalDiscount != null ? Number(raw.totalDiscount) : undefined,
    finalTotal: raw.finalTotal != null ? Number(raw.finalTotal) : undefined,
    observations: cleanCustomerDescription(raw.observations) || undefined
  };
};

const quoteStatusFromBackend = (rawStatus: unknown, rawLabel: unknown): Quote['status'] => {
  const normalized = String(rawLabel ?? rawStatus ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
  if (normalized === 'approved' || normalized === 'aprobada' || normalized === 'aprobado') return 'Aprobada';
  if (normalized === 'rejected' || normalized === 'rechazada' || normalized === 'rechazado') return 'Rechazada';
  return 'Pendiente';
};

// Posibles campos de archivos/diseño que el backend podría enviar a futuro.
// Hoy el backend NO devuelve archivos en la cotización (ver brecha documentada),
// por lo que esto queda preparado para cuando exista el dato real.
const mapQuoteFiles = (raw: JsonValue): Quote['files'] => {
  const source = raw.files || raw.attachments || raw.designFiles || raw.customDesigns || raw.designs;
  if (!Array.isArray(source)) return undefined;
  return source
    .map((file: JsonValue) => {
      const url = String(file.url || file.fileUrl || file.designUrl || file.imageUrl || '').trim();
      const name = String(file.name || file.fileName || file.filename || 'archivo').trim();
      const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
      return { name, type: String(file.type || ext || 'file'), url };
    })
    .filter((file: { url: string }) => Boolean(file.url));
};

const mapQuoteItemStock = (item: JsonValue): number | null => {
  // El backend expone el stock como `stockAvailable`. Se prioriza ese nombre.
  // ?? para no romper stock 0 (0 es un valor válido, no "No registrado").
  const value = item.stockAvailable ?? item.stock ?? item.availableStock ?? item.variantStock ?? item.stockDisponible;
  return value == null ? null : Number(value);
};

const buildVariantLabel = (item: JsonValue): string => {
  if (item.variant) return String(item.variant);
  const parts = [item.size, item.color ? getColorLabel(item.color) : undefined].filter(Boolean);
  return parts.join(' · ');
};

export const mapQuote = (raw: JsonValue): Quote => ({
  id: String(raw.id),
  storeId: String(raw.storeId || ''),
  customer: raw.customerName || raw.customer || 'Cliente',
  status: quoteStatusFromBackend(raw.status, raw.statusLabel),
  total: Number(raw.totalAmount || 0),
  subtotal: Number(raw.subTotal || 0),
  date: raw.requestedAt ? String(raw.requestedAt).slice(0, 10) : new Date().toISOString().slice(0, 10),
  // responseAt es null mientras está pendiente; queda undefined para mostrar "Pendiente".
  responseDate: raw.responseAt ? String(raw.responseAt).slice(0, 10) : undefined,
  items: (raw.items || []).map((item: JsonValue) => ({
    product: item.productName || item.name || item.product || 'Producto sin nombre registrado',
    variant: buildVariantLabel(item),
    quantity: Number(item.quantity || 0),
    price: Number(item.unitPrice ?? item.price ?? 0),
    stock: mapQuoteItemStock(item),
    productId: item.productId != null ? String(item.productId) : undefined,
    productVariantId: item.productVariantId != null ? String(item.productVariantId) : undefined,
    size: item.size || undefined,
    color: item.color ? getColorLabel(item.color) : undefined,
    unitPrice: item.unitPrice != null ? Number(item.unitPrice) : undefined,
    subTotal: item.subTotal != null ? Number(item.subTotal) : undefined
  })),
  // "Requerimiento del cliente" usa solo description real (no observations ni texto técnico de seeds).
  message: cleanCustomerDescription(raw.description),
  observations: raw.observations || undefined,
  hasCustomization: raw.hasCustomization === true || undefined,
  files: mapQuoteFiles(raw),
  customerEmail: raw.customerEmail || undefined,
  customerPhone: raw.customerPhone || undefined,
  documentType: raw.documentType || undefined,
  documentNumber: raw.documentNumber || undefined
});

const ORDER_STATUS_TO_BACKEND: Record<Order['status'], string> = {
  'Pagado': 'PAYMENT_CONFIRMED',
  'En proceso': 'IN_PREPARATION',
  'Enviado': 'IN_TRANSIT',
  'Entregado': 'DELIVERED',
  'Cancelado': 'CANCELLED'
};

const QUOTE_STATUS_TO_BACKEND: Record<Quote['status'], string> = {
  'Pendiente': 'PENDING',
  'Aprobada': 'APPROVED',
  'Rechazada': 'REJECTED'
};

export const merchantApi = {
  async login(email: string, password: string): Promise<LoginResult> {
    const result = await request<JsonValue>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (result.role !== 'MERCHANT') {
      if (result.role === 'CUSTOMER') {
        throw new Error('Esta cuenta pertenece a cliente. Usa el acceso de cliente de tu tienda.');
      }
      if (result.role === 'SYSTEM_ADMIN') {
        throw new Error('Esta cuenta pertenece al panel administrador. Usa el acceso de administrador.');
      }
      throw new Error('Esta cuenta no pertenece al panel de comerciantes.');
    }
    if (!result.token) {
      throw new Error('No se recibió un token válido del servidor.');
    }
    merchantSession.setToken(result.token);
    return {
      token: result.token,
      user: {
        id: result.id,
        email: result.email,
        role: result.role || 'MERCHANT',
        name: result.email
      }
    };
  },
  profile: () => request<JsonValue>('/merchant/profile').then(raw => ({
    id: raw.id,
    email: raw.email,
    role: 'Comerciante',
    name: raw.name || fullName(raw) || raw.email,
    firstName: raw.firstName,
    paternalSurname: raw.paternalSurname,
    maternalSurname: raw.maternalSurname,
    phone: raw.phone
  }) as MerchantUser),
  updateProfile: (payload: Partial<MerchantUser>) => request<JsonValue>('/merchant/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }).then(raw => ({
    id: raw.id,
    email: raw.email,
    role: 'Comerciante',
    name: raw.name || fullName(raw) || raw.email,
    firstName: raw.firstName,
    paternalSurname: raw.paternalSurname,
    maternalSurname: raw.maternalSurname,
    phone: raw.phone
  }) as MerchantUser),
  updatePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    request<JsonValue>('/merchant/profile/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    }),
  categories: (search?: string) => request<JsonValue[]>(`/merchant/categories${withSearch(search)}`).then(list => list.map(mapStoreCategory)),
  uploadStoreLogo: (file: File) => {
    const data = new FormData();
    data.append('logo', file);
    return request<{ logoUrl: string }>('/merchant/stores/logo', {
      method: 'POST',
      body: data
    });
  },
  uploadProductImage: (file: File, storeId?: string) => {
    const data = new FormData();
    data.append('image', file);
    return request<{ imageUrl: string }>(`/merchant/products/images${withStore(storeId)}`, {
      method: 'POST',
      body: data
    });
  },
  stores: () => request<JsonValue[]>('/merchant/stores').then(list => list.map(mapStore)),
  createStore: (store: Omit<Store, 'id'>) => request<JsonValue>('/merchant/stores', {
    method: 'POST',
    body: JSON.stringify({
      name: store.name,
      description: store.description,
      categoryId: store.categoryId,
      primaryColor: colorEnum(store.colors?.primary || store.palette, PRIMARY_COLOR_HEX, 'ONYX_BLACK'),
      secondaryColor: colorEnum(store.colors?.secondary, SECONDARY_COLOR_HEX, 'SLATE'),
      tertiaryColor: colorEnum(store.colors?.tertiary, TERTIARY_COLOR_HEX, 'RAW_GOLD'),
      logoUrl: logoUrlPayload(store),
      status: store.status
    })
  }).then(mapStore),
  updateStore: (store: Store) => request<JsonValue>(`/merchant/stores/${store.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: store.name,
      description: store.description,
      categoryId: store.categoryId,
      primaryColor: colorEnum(store.colors?.primary || store.palette, PRIMARY_COLOR_HEX, 'ONYX_BLACK'),
      secondaryColor: colorEnum(store.colors?.secondary, SECONDARY_COLOR_HEX, 'SLATE'),
      tertiaryColor: colorEnum(store.colors?.tertiary, TERTIARY_COLOR_HEX, 'RAW_GOLD'),
      logoUrl: logoUrlPayload(store),
      status: store.status
    })
  }).then(mapStore),
  deleteStore: (id: string) => request<JsonValue>(`/merchant/stores/${id}`, { method: 'DELETE' }),
  products: (storeId?: string) => request<JsonValue[]>(`/merchant/products${withStore(storeId)}`).then(list => list.map(mapProduct)),
  createProduct: (product: Product | Omit<Product, 'id'>, storeId?: string) => request<JsonValue>(`/merchant/products${withStore(storeId)}`, {
    method: 'POST',
    body: JSON.stringify(productPayload(product))
  }).then(mapProduct),
  updateProduct: (product: Product, storeId?: string) => request<JsonValue>(`/merchant/products/${product.id}${withStore(storeId)}`, {
    method: 'PUT',
    body: JSON.stringify(productPayload(product))
  }).then(mapProduct),
  updateProductActive: (id: string, active: boolean, storeId?: string) => request<JsonValue>(`/merchant/products/${id}/active${withStore(storeId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ active })
  }).then(mapProduct),
  deleteProduct: (id: string, storeId?: string) => request<JsonValue>(`/merchant/products/${id}${withStore(storeId)}`, { method: 'DELETE' }),
  bulkProducts: (products: File, images?: File, storeId?: string) => {
    const data = new FormData();
    data.append('products', products);
    if (images) data.append('images', images);
    return request<BulkUploadResult>(`/merchant/products/bulk${withStore(storeId)}`, {
      method: 'POST',
      body: data
    });
  },
  discounts: (storeId?: string) => request<JsonValue[]>(`/merchant/discounts${withStore(storeId)}`).then(list => list.map(mapDiscount)),
  createDiscount: (discount: Discount, storeId?: string) => request<JsonValue>(`/merchant/discounts${withStore(storeId)}`, {
    method: 'POST',
    body: JSON.stringify(discountPayload(discount))
  }).then(mapDiscount),
  updateDiscount: (id: string, discount: Partial<Discount>, storeId?: string) => request<JsonValue>(`/merchant/discounts/${id}${withStore(storeId)}`, {
    method: 'PUT',
    body: JSON.stringify(discountPayload(discount))
  }).then(mapDiscount),
  deleteDiscount: (id: string, storeId?: string) => request<JsonValue>(`/merchant/discounts/${id}${withStore(storeId)}`, { method: 'DELETE' }),
  orders: (storeId?: string) => request<JsonValue[]>(`/merchant/orders${withStore(storeId)}`).then(list => list.map(mapOrder)),
  updateOrderStatus: (id: string, status: Order['status'], storeId?: string) => request<JsonValue>(`/merchant/orders/${id}/status${withStore(storeId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: ORDER_STATUS_TO_BACKEND[status] })
  }).then(mapOrder),
  quotes: (storeId?: string) => request<JsonValue[]>(`/merchant/quotations${withStore(storeId)}`).then(list => list.map(mapQuote)),
  updateQuoteStatus: (id: string, status: Quote['status'], observations?: string, storeId?: string) => request<JsonValue>(`/merchant/quotations/${id}/respond${withStore(storeId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: QUOTE_STATUS_TO_BACKEND[status], observations: observations ?? null })
  }).then(mapQuote)
};
