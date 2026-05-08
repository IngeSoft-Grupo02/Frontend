'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/UI';
import { Eye, EyeOff } from 'lucide-react';

type ErrorType = 'invalid_credentials' | 'not_admin' | 'not_found' | null;

const ERROR_MESSAGES: Record<NonNullable<ErrorType>, string> = {
  invalid_credentials: 'Credenciales incorrectas. Verifica tu correo y contraseña.',
  not_admin:           'Esta cuenta no tiene permisos de administrador.',
  not_found:           'No existe una cuenta registrada con ese correo.',
};

const MOCK_ACCOUNTS = [
  { email: 'admin@plataforma.com', password: 'admin123', role: 'admin' },
  { email: 'lucia@canvas.com',     password: 'lucia123', role: 'merchant' },
];

export default function AdminLoginPage() {
  const router = useRouter();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passTouched,  setPassTouched]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [authError,    setAuthError]    = useState<ErrorType>(null);

  const emailError = (() => {
    if (!emailTouched) return '';
    if (!email) return 'El correo es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un correo válido (ej: admin@empresa.com).';
    return '';
  })();

  const passError = (() => {
    if (!passTouched) return '';
    if (!password) return 'La contraseña es obligatoria.';
    return '';
  })();

  const isFormValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length > 0;

  const handleSubmit = () => {
    setEmailTouched(true);
    setPassTouched(true);
    setAuthError(null);
    if (!isFormValid) return;
    setLoading(true);
    setTimeout(() => {
      const account = MOCK_ACCOUNTS.find(a => a.email === email);
      if (!account)                        setAuthError('not_found');
      else if (account.password !== password) setAuthError('invalid_credentials');
      else if (account.role !== 'admin')   setAuthError('not_admin');
      else                                 router.push('/admin');
      setLoading(false);
    }, 900);
  };

  return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="w-full max-w-[900px] bg-white rounded-[32px] shadow-sm border border-neutral-100 overflow-hidden flex min-h-[520px]">

          {/* ── Panel izquierdo (negro) ── */}
          <div className="hidden md:flex w-[380px] shrink-0 bg-brand-black flex-col justify-between p-10 relative overflow-hidden">
            {/* Círculos decorativos */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-[48px] bg-white/5" />
            <div className="absolute top-32 -right-20 w-56 h-56 rounded-[48px] bg-white/5" />
            <div className="absolute -bottom-10 left-10 w-48 h-48 rounded-[48px] bg-white/5" />
            <div className="absolute bottom-24 -right-10 w-40 h-40 rounded-[48px] bg-white/5" />

            {/* Contenido */}
            <div className="relative z-10">
              <h1 className="text-[40px] font-display font-extrabold tracking-tighter text-white mb-4">
                Kingstore
              </h1>
              <p className="text-[15px] text-neutral-400 leading-relaxed">
                Gestiona tiendas, usuarios, límites globales y trazabilidad operacional desde un único panel.
              </p>
            </div>

            {/* Tags */}
            <div className="relative z-10 flex gap-3">
            <span className="px-3 py-2 rounded-xl border border-white/10 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Multi-tenant
            </span>
              <span className="px-3 py-2 rounded-xl border border-white/10 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Streetwear DS
            </span>
            </div>
          </div>

          {/* ── Panel derecho (formulario) ── */}
          <div className="flex-1 flex flex-col justify-center px-10 py-12">
            <h2 className="text-[32px] font-display font-extrabold text-brand-black mb-1">
              Iniciar sesión
            </h2>
            <p className="text-[13px] text-neutral-400 mb-8">
              Acceso restringido para administradores de la plataforma
            </p>

            <div className="space-y-5">
              <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="admin@plataforma.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setAuthError(null); }}
                  onBlur={() => setEmailTouched(true)}
                  error={emailError}
              />

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-neutral-500 uppercase ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setAuthError(null); }}
                      onBlur={() => setPassTouched(true)}
                      onKeyDown={e => e.key === 'Enter' && isFormValid && handleSubmit()}
                      className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors ${
                          passError ? 'border-red-500' : 'border-neutral-200'
                      }`}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passError && <p className="text-[12px] text-red-500 font-bold ml-1">{passError}</p>}
              </div>

              <div className="text-left -mt-2">
                <a
                    href="/recuperar-contrasena"
                    className="text-[12px] font-bold text-brand-camel hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Error de autenticación */}
              {authError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <span className="text-red-500 shrink-0 font-bold">✕</span>
                    <p className="text-[13px] font-bold text-red-700">{ERROR_MESSAGES[authError]}</p>
                  </div>
              )}

              {/* Botón */}
              <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || loading}
                  className={`w-full h-12 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                      isFormValid && !loading
                          ? 'bg-brand-black text-white hover:bg-neutral-800'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
              >
                {loading
                    ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5" />
                    : 'Ingresar al panel'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}