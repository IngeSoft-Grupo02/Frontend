import { Discount, Order, Product, Quote, Store, StoreCategory } from './types';

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
    const raw = await response.text();
    let message = raw || `Error HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(raw);
      message = parsed.message || parsed.error || raw;
    } catch {
      // Keep plain-text backend errors as-is.
    }
    throw new Error(message);
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
    default: return color || 'Negro';
  }
};

const colorToBackend = (color?: string) => {
  switch ((color || '').toLowerCase()) {
    case 'negro': return 'BLACK';
    case 'blanco': return 'WHITE';
    case 'rojo': return 'RED';
    case 'azul': return 'BLUE';
    case 'verde': return 'GREEN';
    default: return 'BLACK';
  }
};

const activeFromStatus = (status?: Product['status'] | Discount['status']) =>
  status !== 'Borrador' && status !== 'Inactivo' && status !== 'Pausada';

const isPersistableUrl = (value?: string) => {
  const url = (value || '').trim();
  return Boolean(url) && !url.startsWith('data:') && !url.startsWith('blob:');
};

const PRIMARY_COLOR_HEX: Record<string, string> = {
  ONYX_BLACK: '#000000',
  DEEP_ZINC: '#1A1A1B',
  MIDNIGHT: '#0D1120',
  CHARCOAL: '#333D4F',
  ESPRESSO: '#1F1C1B'
};

const SECONDARY_COLOR_HEX: Record<string, string> = {
  OLIVE_DRAB: '#5D634B',
  SAGE: '#8B9E82',
  SLATE: '#4A5568',
  TERRA: '#A97C44',
  DUSTY_RED: '#A52222'
};

const TERTIARY_COLOR_HEX: Record<string, string> = {
  RICH_CAMEL: '#B2956D',
  RAW_GOLD: '#C59D53',
  SILVER_MIST: '#9BA9BC',
  COPPER: '#BC5610',
  STONE: '#CED1D6'
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
  const secondaryColor = raw.secondaryColor || raw.colors?.secondary || 'OLIVE_DRAB';
  const tertiaryColor = raw.tertiaryColor || raw.colors?.tertiary || 'RICH_CAMEL';
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
  name: raw.name || raw.storeCategoryName || raw.categoryName || 'Categoria'
});

export const mapProduct = (raw: JsonValue): Product => {
  const sizeColorStock: Record<string, Record<string, number>> = (raw.variants || []).reduce((acc: Record<string, Record<string, number>>, variant: JsonValue) => {
    const size = variant.size || 'Única';
    const color = colorFromBackend(variant.color);
    acc[size] = { ...(acc[size] || {}), [color]: Number(variant.stock || 0) };
    return acc;
  }, {});
  const sizes = Object.keys(sizeColorStock);
  const images = (raw.imageUrls || []).map((url: string, index: number) => ({ name: `imagen-${index + 1}`, url }));

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
    status: raw.status || (raw.active === false ? 'Inactivo' : 'Activo'),
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
  const imageUrls = [
    ...(product.images?.map(image => image.url).filter(isPersistableUrl) || []),
    ...(isPersistableUrl(product.image) ? [product.image as string] : [])
  ].slice(0, 5);

  return {
    name: product.name,
    description: product.description || '',
    price: Number(product.price || 0),
    costPrice: Math.max(Number(product.price || 0) * 0.7, 0),
    material: 'COTTON',
    imageUrls,
    variants,
    active: activeFromStatus(product.status)
  };
};

const normalizeDiscountAppliesTo = (value: unknown): Discount['appliesTo'] => {
  const text = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return text.includes('producto') ? 'Producto especifico' : 'Todo el catalogo';
};

export const mapDiscount = (raw: JsonValue): Discount => ({
  id: String(raw.id),
  productId: raw.productId != null ? String(raw.productId) : undefined,
  productName: raw.productName,
  name: raw.name || raw.productName || 'Descuento',
  type: raw.type === 'Monto Fijo' ? 'Monto Fijo' : 'Porcentaje',
  value: Number(raw.value ?? raw.discountPercentage ?? 0),
  minUnits: Number(raw.minUnits ?? raw.minQuantity ?? 0),
  status: raw.status === 'Pausada' || raw.active === false ? 'Pausada' : 'Activa',
  usageCount: Number(raw.usageCount || 0),
  appliesTo: normalizeDiscountAppliesTo(raw.appliesTo)
});

export const discountPayload = (discount: Discount | Partial<Discount>) => ({
  name: discount.name,
  type: discount.type || 'Porcentaje',
  value: Number(discount.value || 0),
  minUnits: Number(discount.minUnits || 0),
  minQuantity: Number(discount.minUnits || 0),
  maxQuantity: Number(discount.minUnits || 0),
  volumeType: 'UNIT',
  active: (discount.status || 'Activa') === 'Activa',
  status: discount.status || 'Activa',
  appliesTo: discount.appliesTo === 'Producto especifico' ? 'Producto especifico' : 'Todo el catalogo',
  productId: discount.appliesTo === 'Producto especifico' && discount.productId ? Number(discount.productId) : null,
  usageCount: discount.usageCount || 0
});

export const mapOrder = (raw: JsonValue): Order => ({
  id: String(raw.id),
  storeId: String(raw.storeId || ''),
  customer: raw.customer || 'Cliente',
  status: raw.statusLabel || 'Aprobado',
  items: Number(raw.items || 0),
  total: Number(raw.total || 0),
  date: raw.createdAt ? String(raw.createdAt).slice(0, 10) : new Date().toISOString().slice(0, 10)
});

export const mapQuote = (raw: JsonValue): Quote => ({
  id: String(raw.id),
  storeId: String(raw.storeId || ''),
  customer: raw.customer || 'Cliente',
  status: raw.statusLabel || 'Pendiente',
  total: Number(raw.totalAmount || 0),
  subtotal: Number(raw.subTotal || 0),
  date: raw.requestedAt ? String(raw.requestedAt).slice(0, 10) : new Date().toISOString().slice(0, 10),
  items: (raw.items || []).map((item: JsonValue) => ({
    product: item.product || 'Producto',
    variant: item.variant || '',
    quantity: Number(item.quantity || 0),
    price: Number(item.price || 0)
  })),
  message: raw.description || raw.observations || ''
});

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
      secondaryColor: colorEnum(store.colors?.secondary, SECONDARY_COLOR_HEX, 'OLIVE_DRAB'),
      tertiaryColor: colorEnum(store.colors?.tertiary, TERTIARY_COLOR_HEX, 'RICH_CAMEL'),
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
      secondaryColor: colorEnum(store.colors?.secondary, SECONDARY_COLOR_HEX, 'OLIVE_DRAB'),
      tertiaryColor: colorEnum(store.colors?.tertiary, TERTIARY_COLOR_HEX, 'RICH_CAMEL'),
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
    body: JSON.stringify({ status })
  }).then(mapOrder),
  quotes: (storeId?: string) => request<JsonValue[]>(`/merchant/quotations${withStore(storeId)}`).then(list => list.map(mapQuote)),
  updateQuoteStatus: (id: string, status: Quote['status'], storeId?: string) => request<JsonValue>(`/merchant/quotations/${id}/respond${withStore(storeId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }).then(mapQuote)
};

