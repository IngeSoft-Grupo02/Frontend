import { translateErrorMessage } from '../shared/errors';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL
  || process.env.NEXT_PUBLIC_API_BASE_URL
  || 'http://localhost:8080'
).replace(/\/+$/, '');

export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Usa entre 8 y 72 caracteres, con mayúscula, minúscula, número y símbolo.';

export function isStrongPassword(password: string): boolean {
  return password.length >= 8
    && password.length <= 72
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body
      ? String((body as { message: unknown }).message)
      : 'No se pudo completar la solicitud.';
    const error = new Error(translateErrorMessage(message, 'No se pudo completar la solicitud.')) as Error & { code?: string };
    if (body && typeof body === 'object' && 'code' in body) {
      error.code = String((body as { code: unknown }).code);
    }
    throw error;
  }

  return body as T;
}

export function requestPasswordReset(email: string, storeSlug?: string | null): Promise<{ message: string }> {
  const trimmedStoreSlug = storeSlug?.trim();
  return request('/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim(),
      ...(trimmedStoreSlug ? { storeSlug: trimmedStoreSlug } : {}),
    }),
  });
}

export async function validatePasswordResetToken(token: string): Promise<boolean> {
  const result = await request<{ valid: boolean }>(
    `/auth/password/validate?token=${encodeURIComponent(token)}`,
  );
  return result.valid;
}

export function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return request('/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}
