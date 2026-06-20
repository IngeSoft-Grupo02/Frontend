/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CustomerUser,
  LoginRequestDTO,
  LoginResponseDTO,
  PrimaryColor,
  RegisterCustomerDTO,
  SecondaryColor,
  Store,
  StorePublicDTO,
  TertiaryColor,
} from '../types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch {
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
    let message = `Error ${response.status}`;
    if (typeof data === 'string' && data.trim().length > 0) {
      message = data;
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (typeof obj.message === 'string') message = obj.message;
      else if (typeof obj.error === 'string') message = obj.error;
    }
    throw new ApiError(message, response.status);
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
  if (key && (/^#[\da-f]{3,8}$/i.test(key.trim()) || /^rgba?\(/i.test(key.trim()))) {
    return key.trim();
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
