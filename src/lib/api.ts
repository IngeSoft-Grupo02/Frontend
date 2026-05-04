const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function fetchApi<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...restOptions } = options;
  
  // Construir URL con query params si existen
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...restOptions.headers,
    },
    ...restOptions,
  };

  const response = await fetch(url.toString(), config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: ${endpoint}`);
  }

  return data as T;
}

// 📦 Endpoints listos para usar
export const api = {
  // Stores
  stores: {
    getAll: (filters?: any) => fetchApi('/stores', { params: filters }),
    getById: (id: string) => fetchApi(`/stores/${id}`),
    create: (data: any) => fetchApi('/stores', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/stores/${id}`, { method: 'DELETE' }),
  },
  // Users
  users: {
    getAll: (filters?: any) => fetchApi('/users', { params: filters }),
    create: (data: any) => fetchApi('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  // Audit
  audit: {
    getLogs: (filters?: any) => fetchApi('/audit/logs', { params: filters }),
  },
  // Config
  system: {
    getConfig: () => fetchApi('/system/config'),
    updateConfig: (data: any) => fetchApi('/system/config', { method: 'PUT', body: JSON.stringify(data) }),
  }
};