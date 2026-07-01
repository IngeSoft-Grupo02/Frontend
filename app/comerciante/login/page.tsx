'use client';

import { Button } from '@/domains/comerciante/components/ui';
import { useStore } from '@/domains/comerciante/context/StoreContext';
import { messageFromError } from '@/domains/shared/errors';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val: string) => {
    if (!val) {
      setEmailError('El correo es obligatorio');
      return false;
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!isEmail) {
      setEmailError('Formato de correo inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateEmail(email)) return;
    if (!password) {
      setLoginError('La contraseña es obligatoria');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      router.push('/comerciante/store-selection');
    } catch (error) {
      setLoginError(messageFromError(error, 'No se pudo iniciar sesión'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans overflow-y-auto">
      <div className="hidden lg:flex flex-col w-[42%] bg-brand-black p-10 justify-center relative overflow-hidden shrink-0">
        <div className="z-10 max-w-[340px] animate-in slide-in-from-left duration-1000 delay-200">
          <h2 className="text-white text-[52px] font-extrabold leading-[1.05] tracking-tighter">
            Potencia <br />
            <span className="text-brand-camel">tus ventas.</span>
          </h2>
          <p className="text-white/60 text-[13px] font-medium mt-6 leading-relaxed">
            Gestión inteligente para marcas independientes.<br />
            Control total de stock, pedidos y cotizaciones corporativas.
          </p>
        </div>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-camel/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -ml-20 -mb-20"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 xl:p-14 bg-brand-neutral-light/30">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-right duration-700">
          <header className="space-y-3">
            <div className="h-1.5 w-10 bg-brand-black mb-6 rounded-full"></div>
            <h1 className="text-[40px] font-extrabold tracking-tighter text-brand-black leading-none">Acceso al Panel</h1>
            <p className="text-brand-text-muted text-[14px] leading-relaxed font-medium max-w-[320px]">
              Bienvenido de nuevo. Ingresa tus credenciales para gestionar tu tienda.
            </p>
          </header>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-[13px] font-extrabold">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-brand-black uppercase tracking-widest">Correo electrónico</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-6 -translate-y-1/2 transition-colors ${emailError ? 'text-red-500' : 'text-brand-text-muted'}`} size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onBlur={(e) => validateEmail(e.target.value)}
                  placeholder="ejemplo@plataforma.com"
                  className={`w-full h-12 pl-12 pr-4 bg-white border rounded-2xl text-[14px] font-extrabold outline-none focus:ring-4 transition-all ${emailError ? 'border-red-400 focus:ring-red-500/5' : 'border-brand-neutral-border focus:ring-brand-black/5 focus:border-brand-black'}`}
                />
                {emailError && <p className="text-[11px] font-bold text-red-500 px-1 mt-1">{emailError}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-extrabold text-brand-black uppercase tracking-widest">Contraseña</label>
                <button
                  type="button"
                  onClick={() => router.push('/comerciante/recovery')}
                  className="text-[11px] font-extrabold text-brand-camel hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="************"
                  className="w-full h-12 pl-12 pr-12 bg-white border border-brand-neutral-border rounded-2xl text-[14px] font-extrabold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-black transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className={`w-full h-12 !text-[14px] !rounded-[18px] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Cargando...</> : 'Iniciar sesión'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
