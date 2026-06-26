/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, User } from '../types';

// Keys propias del Cliente (kc_*). No deben colisionar con
// las usadas por Admin (token, adminUser) ni Comerciante (mc_user, mc_token, mc_store).
export const CUSTOMER_TOKEN_KEY = 'kc_customer_token';
export const CUSTOMER_USER_KEY = 'kc_customer_user';
export const CUSTOMER_STORE_KEY = 'kc_customer_store';
const CUSTOMER_SESSION_EXPIRED_KEY = 'kc_customer_session_expired';

function readJSON<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON<T>(key: string, value: T | null): void {
  if (typeof window === 'undefined') return;
  if (value === null) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getStoredCustomerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(window.atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isCustomerTokenUsable(token: string | null): token is string {
  if (!token) return false;
  if (typeof window === 'undefined') return false;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  return payload.exp * 1000 > Date.now();
}

export function markCustomerSessionExpired(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(CUSTOMER_SESSION_EXPIRED_KEY, '1');
}

export function consumeCustomerSessionExpired(): boolean {
  if (typeof window === 'undefined') return false;
  const expired = window.sessionStorage.getItem(CUSTOMER_SESSION_EXPIRED_KEY) === '1';
  window.sessionStorage.removeItem(CUSTOMER_SESSION_EXPIRED_KEY);
  return expired;
}

export function setStoredCustomerToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  }
}

export function getStoredCustomerUser(): User | null {
  return readJSON<User>(CUSTOMER_USER_KEY);
}

export function setStoredCustomerUser(user: User | null): void {
  writeJSON(CUSTOMER_USER_KEY, user);
}

export function getStoredCustomerStore(): Store | null {
  return readJSON<Store>(CUSTOMER_STORE_KEY);
}

export function setStoredCustomerStore(store: Store | null): void {
  writeJSON(CUSTOMER_STORE_KEY, store);
}

export function clearCustomerSession(): void {
  setStoredCustomerToken(null);
  setStoredCustomerUser(null);
}
