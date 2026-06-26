import type { Store } from '../types';
import { API_BASE_URL } from './api';

export function resolveStoreLogoUrl(store: Store | null | undefined): string | null {
  const value = store?.logoUrl?.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${API_BASE_URL}${value}`;
  return value;
}
