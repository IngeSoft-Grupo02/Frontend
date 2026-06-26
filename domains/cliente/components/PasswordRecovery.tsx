'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Mail, ShieldAlert } from 'lucide-react';
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
  requestPasswordReset,
  resetPassword,
  validatePasswordResetToken,
} from '@/domains/auth/passwordRecovery';
import { getStoredCustomerStore } from '@/domains/cliente/lib/session';
import { Button } from './ui/Button';

type Step = 'request' | 'sent' | 'validating' | 'reset' | 'success' | 'invalid';

export function PasswordRecovery({ token, storeSlug }: { token: string | null; storeSlug?: string | null }) {
  const [step, setStep] = useState<Step>(token ? 'validating' : 'request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordHasMinLength = password.length >= 8;
  const passwordHasRequiredCharacters =
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  useEffect(() => {
    if (!token) return;
    validatePasswordResetToken(token)
      .then(valid => setStep(valid ? 'reset' : 'invalid'))
      .catch(() => setStep('invalid'));
  }, [token]);

  const handleRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const selectedStoreSlug = storeSlug?.trim() || getStoredCustomerStore()?.slug;
      await requestPasswordReset(email, selectedStoreSlug);
      setStep('sent');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    if (!isStrongPassword(password)) {
      setError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(token, password);
      setStep('success');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-warm-bg px-6 py-16 flex items-center justify-center">
      <section className="w-full max-w-lg rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
        {step === 'validating' && (
          <div className="flex items-center justify-center gap-3 py-20 text-text-secondary">
            <Loader2 className="animate-spin" /> Validando enlace...
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleRequest} className="space-y-6">
            <header>
              <Mail className="mb-4" />
              <h1 className="text-3xl font-extrabold">Recuperar contraseña</h1>
              <p className="mt-2 text-sm text-text-secondary">Recibirás un enlace seguro si tu correo corresponde a una cuenta activa.</p>
            </header>
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-xl border border-border-subtle px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
            />
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={() => window.location.assign('/iniciar-sesion')}>
              Volver al login
            </Button>
          </form>
        )}

        {step === 'sent' && (
          <div className="space-y-5 text-center">
            <CheckCircle2 className="mx-auto text-green-600" size={48} />
            <h1 className="text-3xl font-extrabold">Revisa tu correo</h1>
            <p className="text-sm text-text-secondary">Si la cuenta está activa, enviamos un enlace. Revisa también la carpeta de spam.</p>
            <Button fullWidth onClick={() => window.location.assign('/iniciar-sesion')}>Volver al login</Button>
          </div>
        )}

        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-5">
            <header>
              <KeyRound className="mb-4" />
              <h1 className="text-3xl font-extrabold">Nueva contraseña</h1>
              <p className="mt-2 text-sm text-text-secondary">{PASSWORD_REQUIREMENTS_MESSAGE}</p>
            </header>
            <div className="relative">
              <input
                type={showPassword && password ? 'text' : 'password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Nueva contraseña"
                className="w-full rounded-xl border border-border-subtle px-4 py-3 pr-12"
              />
              {password && (
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
                  onClick={() => setShowPassword(value => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword && confirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                placeholder="Confirmar contraseña"
                className="w-full rounded-xl border border-border-subtle px-4 py-3 pr-12"
              />
              {confirmPassword && (
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
                  onClick={() => setShowConfirmPassword(value => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-primary"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            <div className="rounded-xl border border-border-subtle bg-warm-bg p-4">
              <h2 className="text-xs font-extrabold uppercase text-text-primary">Requisitos de contraseña</h2>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li className={passwordHasMinLength ? 'font-bold text-green-600' : ''}>
                  {passwordHasMinLength ? '✓' : '○'} Mínimo 8 caracteres
                </li>
                <li className={passwordsMatch ? 'font-bold text-green-600' : ''}>
                  {passwordsMatch ? '✓' : '○'} Las contraseñas deben coincidir
                </li>
                <li className={passwordHasRequiredCharacters ? 'font-bold text-green-600' : ''}>
                  {passwordHasRequiredCharacters ? '✓' : '○'} Debe incluir mayúscula, minúscula, número y símbolo
                </li>
              </ul>
            </div>
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <Button type="submit" fullWidth disabled={loading}>{loading ? 'Guardando...' : 'Guardar contraseña'}</Button>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-5 text-center">
            <CheckCircle2 className="mx-auto text-green-600" size={48} />
            <h1 className="text-3xl font-extrabold">Contraseña actualizada</h1>
            <Button fullWidth onClick={() => window.location.assign('/iniciar-sesion')}>Iniciar sesión</Button>
          </div>
        )}

        {step === 'invalid' && (
          <div className="space-y-5 text-center">
            <ShieldAlert className="mx-auto text-red-600" size={48} />
            <h1 className="text-3xl font-extrabold">Enlace inválido o expirado</h1>
            <Button fullWidth onClick={() => window.location.assign('/recuperacion')}>Solicitar otro enlace</Button>
          </div>
        )}
      </section>
    </main>
  );
}
