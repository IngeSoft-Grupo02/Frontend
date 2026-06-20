// src/lib/api.ts — Cliente HTTP centralizado Kingstore Admin

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function handleUnauthorized() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('adminUser');
  window.dispatchEvent(new Event('admin:session-expired'));
}

function shouldClearSession(status: number): boolean {
  if (status === 401) return true;
  if (status !== 403 || typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !token || isTokenExpired(token);
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function readErrorMessage(response: Response, endpoint: string): Promise<string> {
  const text = await response.text().catch(() => '');
  if (text) {
    try {
      const payload = JSON.parse(text) as { message?: string; error?: string; code?: string };
      return payload.message || payload.error || payload.code || text;
    } catch {
      return text;
    }
  }
  return `Error ${response.status}: ${endpoint}`;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, auth = true, headers, ...rest } = options;
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, String(v));
    });
  }
  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json', ...(auth ? getAuthHeader() : {}), ...headers },
    ...rest,
  });
  if (!response.ok) {
    // Un 403 puede ser una regla de autorización o negocio. Solo cerramos la
    // sesión si falta el JWT o si el propio token ya está vencido.
    if (auth && shouldClearSession(response.status)) handleUnauthorized();
    throw new ApiError(await readErrorMessage(response, endpoint), response.status, endpoint);
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

async function requestMultipart<T>(endpoint: string, body: FormData): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST', headers: { ...getAuthHeader() }, body,
  });
  if (!response.ok) {
    if (shouldClearSession(response.status)) handleUnauthorized();
    throw new ApiError(await readErrorMessage(response, endpoint), response.status, endpoint);
  }
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

// ── Tipos ─────────────────────────────────────────────────────────

export interface StoreCategoryResponse {
  id: number; storeCategoryName: string; active: boolean;
}

export interface StoreResponse {
  id: number; storeName: string; slug: string; description: string | null;
  logoUrl: string | null;
  primaryColor: string | null; secondaryColor: string | null; tertiaryColor: string | null;
  storeStatus: string; createdAt: string;
  category?: StoreCategoryResponse | null;
  merchant?: { id: number; ruc: string; firstName: string; paternalSurname: string;
    userAccount?: { id: number; email: string } } | null;
}

export interface StoreMutationRequest {
  storeName: string;
  slug: string;
  description?: string;
  categoryId: number;
  merchantId: number;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

export interface UserResponseDTO {
  id: number; email: string; active: boolean; role: string;
  firstName: string; paternalSurname: string; maternalSurname: string;
  documentNumber: string; documentType: string; phone: string;
  ruc?: string; storeName?: string; storeId?: number;
}

export interface MerchantResponseDTO {
  id: number; email: string; firstName: string; paternalSurname: string; ruc: string;
}

export interface AuditLogResponse {
  id: number; timestamp: string; userEmail: string; role: string;
  tenantSlug: string; httpMethod: string; endpoint: string;
  statusCode: number; level: string; description: string;
}

// ── API ───────────────────────────────────────────────────────────

export const api = {
  auth: {
    login: (email: string, password: string) =>
        request<{ id: number; email: string; role: string; storeSlug: string | null; token: string }>(
            '/auth/login', { method: 'POST', auth: false, body: JSON.stringify({ email, password }) }
        ),
  },
  stores: {
    getAll:     (params?: { search?: string; status?: string }) => request<StoreResponse[]>('/admin/stores', { params }),
    getById:    (id: number)             => request<StoreResponse>(`/admin/stores/${id}`),
    create:     (data: StoreMutationRequest)             => request<StoreResponse>('/admin/stores', { method: 'POST', body: JSON.stringify(data) }),
    update:     (id: number, data: StoreMutationRequest) => request<StoreResponse>(`/admin/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    suspend:    (id: number)             => request<string>(`/admin/stores/${id}/suspend`, { method: 'PATCH' }),
    reactivate: (id: number)             => request<string>(`/admin/stores/${id}/reactivate`, { method: 'PATCH' }),
    deactivate: (id: number)             => request<string>(`/admin/stores/${id}/deactivate`, { method: 'PATCH' }),
    getMetrics: ()                       => request<any>('/admin/stores/metrics'),
  },
  users: {
    getAll:     (params?: { search?: string }) => request<UserResponseDTO[]>('/admin/users', { params }),
    getById:    (id: number)             => request<UserResponseDTO>(`/admin/users/${id}`),
    create:     (data: any)              => request<UserResponseDTO>('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    update:     (id: number, data: any)  => request<UserResponseDTO>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deactivate: (id: number)             => request<string>(`/admin/users/${id}/deactivate`, { method: 'PATCH' }),
    reactivate: (id: number)             => request<string>(`/admin/users/${id}/reactivate`, { method: 'PATCH' }),
    getMerchants: (params?: { search?: string }) => request<MerchantResponseDTO[]>('/admin/users/merchants', { params }),
  },
  audit: {
    getAll: (params?: { level?: string; userEmail?: string; tenantSlug?: string; range?: string }) =>
        request<AuditLogResponse[]>('/admin/audit', { params }),
  },
  categories: {
    getAll:     (params?: { search?: string }) => request<{ id: number; storeCategoryName: string; active: boolean }[]>('/admin/categories', { params }),
    create:     (data: { storeCategoryName: string }) => request<{ id: number; storeCategoryName: string }>('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
    update:     (id: number, data: { storeCategoryName: string }) => request<{ id: number; storeCategoryName: string }>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deactivate: (id: number) => request<string>(`/admin/categories/${id}/deactivate`, { method: 'PATCH' }),
    reactivate: (id: number) => request<string>(`/admin/categories/${id}/reactivate`, { method: 'PATCH' }),
    delete:     (id: number) => request<string>(`/admin/categories/${id}`, { method: 'DELETE' }),
  },
  bulk: {
    upload: (merchants?: File, stores?: File, logos?: File) => {
      const fd = new FormData();
      if (merchants) fd.append('merchants', merchants);
      if (stores)    fd.append('stores',    stores);
      if (logos)     fd.append('logos',     logos);
      return requestMultipart<any>('/admin/bulk/upload', fd);
    },
    existingEmails: () => request<string[]>('/admin/bulk/existing-emails'),
    existingStores: () => request<{ storeNames: string[]; merchantEmails: string[] }>('/admin/bulk/existing-stores'),
  },
};
