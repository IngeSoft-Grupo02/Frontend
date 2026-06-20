'use client';

import { useState } from 'react';
import { api } from '@/domains/admin/lib/api';
import { useRouter } from 'next/navigation';
import { useApp } from '@/domains/admin/context/AppContext';
import { Eye, EyeOff, LayoutDashboard, Loader2 } from 'lucide-react';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError]     = useState('');
  const [loginError, setLoginError]     = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  const validateEmail = (value: string) => {
    setEmail(value);
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Ingresa un correo válido.');
    } else {
      setEmailError('');
    }
    setLoginError(null);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Completa todos los campos.');
      return;
    }
    if (emailError) return;

    setLoading(true);
    setLoginError(null);

    try {
      const data = await api.auth.login(email, password);

      // Verificar que sea SYSTEM_ADMIN
      if (data.role !== 'SYSTEM_ADMIN') {
        setLoginError('Acceso denegado. Este panel es solo para administradores.');
        return;
      }

      // Guardar token en localStorage para las llamadas a la API
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      const adminUser = {
        id: data.id,
        name: data.email,
        email: data.email,
        role: 'Super admin',
      };

      // Persistir datos mínimos del usuario para rehidratar la sesión al refrescar
      localStorage.setItem('adminUser', JSON.stringify(adminUser));

      // Actualizar contexto con datos reales del backend
      login(email, password, adminUser);

      router.push(ADMIN_ROUTES.dashboard);

    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('403') || msg.toLowerCase().includes('forbidden')) {
        setLoginError('Acceso denegado. Tu cuenta no tiene rol de administrador.');
      } else if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        setLoginError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else {
        setLoginError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 lg:p-10 overflow-hidden">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-0 md:gap-12 bg-white rounded-[40px] shadow-2xl overflow-hidden h-auto md:h-[750px]">

          {/* Left Section - Branding */}
          <div className="w-full md:w-[450px] bg-brand-black p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
            <div className="z-10">
              <h1 className="text-[48px] lg:text-[64px] font-display font-extrabold leading-none mb-8 tracking-tighter">
                Kingstore
              </h1>
              <p className="text-[16px] lg:text-[18px] text-neutral-400 font-medium max-w-[280px] leading-relaxed">
                Gestiona tiendas, usuarios, límites globales y trazabilidad operacional desde un único panel.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-[800px] h-full opacity-10 pointer-events-none -mr-[300px] flex items-center justify-center">
              <LayoutDashboard size={800} />
            </div>
            <div className="z-10 mt-auto pt-12">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-camel"></div>
                <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="flex-1 p-10 lg:p-24 flex flex-col justify-center bg-white overflow-y-auto">
            <div className="max-w-md w-full mx-auto">

              <div className="mb-10">
                <h2 className="text-[32px] lg:text-[42px] font-display font-extrabold leading-none mb-3 tracking-tight text-[#0a0a0a]">
                  Iniciar sesión
                </h2>
                <p className="text-[16px] text-neutral-400 font-medium">
                  Acceso restringido para administradores de la plataforma
                </p>
              </div>

              <div className="space-y-6" onKeyPress={handleKeyPress}>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-500 ml-1 uppercase tracking-wide">
                    Correo electrónico
                  </label>
                  <input
                      type="email"
                      placeholder="admin@kingstore.com"
                      value={email}
                      onChange={(e) => validateEmail(e.target.value)}
                      disabled={loading}
                      className={`w-full px-5 py-4 bg-neutral-50 border ${emailError ? 'border-red-300' : 'border-neutral-200'} rounded-2xl text-[15px] font-medium outline-none focus:bg-white focus:border-brand-camel focus:ring-4 focus:ring-brand-camel/10 transition-all disabled:opacity-50`}
                  />
                  {emailError && (
                      <p className="text-[12px] text-red-500 ml-1 font-medium">{emailError}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 ml-1 uppercase tracking-wide">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                        disabled={loading}
                        className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-[15px] font-medium outline-none focus:bg-white focus:border-brand-camel focus:ring-4 focus:ring-brand-camel/10 transition-all pr-12 disabled:opacity-50"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                      type="button"
                      onClick={() => router.push(ADMIN_ROUTES.passwordRecovery)}
                      className="text-brand-camel font-bold text-[14px] hover:underline underline-offset-4 tracking-tight block"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-brand-black rounded-lg" defaultChecked />
                  <span className="text-[14px] font-bold text-neutral-800">Mantener sesión abierta</span>
                </label>

                {/* Error */}
                {loginError && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-[14px] font-bold animate-in fade-in slide-in-from-top-2">
                      {loginError}
                    </div>
                )}

                {/* Botón */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-brand-black text-white font-bold text-[16px] hover:bg-neutral-800 active:scale-[0.98] transition-all mt-8 shadow-lg shadow-brand-black/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading
                      ? <><Loader2 size={20} className="animate-spin" /> Verificando...</>
                      : 'Ingresar al panel'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
