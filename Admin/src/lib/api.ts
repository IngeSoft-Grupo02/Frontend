export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface LoginResponse {
  id: number;
  email: string;
  role: 'SYSTEM_ADMIN' | 'MERCHANT' | 'CUSTOMER';
  storeSlug?: string | null;
  token: string;
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

function authToken() {
  if (typeof window === 'undefined') return null;
  const token = window.localStorage.getItem('adminToken');
  return token ? `Bearer ${token}` : null;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...restOptions } = options;
  const url = new URL(`${API_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const headers = new Headers(restOptions.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = authToken();
  if (token) {
    headers.set('Authorization', token);
  }

  const response = await fetch(url.toString(), {
    ...restOptions,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Error ${response.status}: ${endpoint}`);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) => fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  },
  stores: {
    getAll: (filters?: any) => fetchApi('/admin/stores', { params: filters }),
    getById: (id: string) => fetchApi(`/admin/stores/${id}`),
    create: (data: any) => fetchApi('/admin/stores', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/admin/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/admin/stores/${id}`, { method: 'DELETE' }),
  },
  users: {
    getAll: (filters?: any) => fetchApi('/admin/users', { params: filters }),
    create: (data: any) => fetchApi('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  audit: {
    getLogs: (filters?: any) => fetchApi('/admin/audit', { params: filters }),
  },
  system: {
    getConfig: () => fetchApi('/admin/system/config'),
    updateConfig: (data: any) => fetchApi('/admin/system/config', { method: 'PUT', body: JSON.stringify(data) }),
  },
};
