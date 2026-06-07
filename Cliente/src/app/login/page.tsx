'use client';

import { Button } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validUser = {
    email: 'maria@studio47.pe',
    password: 'Comer123',
    role: 'Comerciante',
    name: 'María Cantillo López',
    firstName: 'María',
    paternalSurname: 'Cantillo',
    maternalSurname: 'López',
    phone: '987654321'
  };

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateEmail(email)) return;
    if (!password) {
      setLoginError('La contraseña es obligatoria');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      if (email === validUser.email && password === validUser.password) {
        setUser({ 
          email, 
          role: validUser.role, 
          name: validUser.name,
          firstName: validUser.firstName,
          paternalSurname: validUser.paternalSurname,
          maternalSurname: validUser.maternalSurname,
          phone: validUser.phone
        });
        router.push('/store-selection');
      } else if (email === validUser.email) {
        setLoginError('Contraseña incorrecta');
      } else {
        setLoginError('Cuenta no existe');
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans overflow-y-auto">
      {/* Left Column */}
      <div className="hidden lg:flex flex-col w-[45%] bg-brand-black p-12 justify-between relative overflow-hidden shrink-0">
        <div className="z-10 animate-in slide-in-from-left duration-700">
          <div className="h-1.5 w-12 bg-brand-camel mb-6 rounded-full"></div>
          <h1 className="text-white text-[24px] font-extrabold tracking-tight">STREET/CORE</h1>
          <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mt-1">Merchant Console v1.0</p>
        </div>
        
        <div className="z-10 max-w-sm animate-in slide-in-from-left duration-1000 delay-200">
          <h2 className="text-white text-[64px] font-extrabold leading-[1.05] tracking-tighter">
            Potencia <br />
            <span className="text-brand-camel">tus ventas.</span>
          </h2>
          <p className="text-white/60 text-[14px] font-medium mt-8 leading-relaxed">
            Gestión inteligente para marcas independientes.<br />
            Control total de stock, pedidos y cotizaciones corporativas.
          </p>
        </div>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-camel/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -ml-20 -mb-20"></div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 xl:p-24 bg-brand-neutral-light/30">
        <div className="w-full max-w-[440px] space-y-12 animate-in fade-in slide-in-from-right duration-700">
          <header className="space-y-4">
            <div className="h-1.5 w-12 bg-brand-black mb-8 rounded-full"></div>
            <h1 className="text-[48px] font-extrabold tracking-tighter text-brand-black leading-none">Acceso al Panel</h1>
            <p className="text-brand-text-muted text-[16px] leading-relaxed font-medium max-w-[320px]">
              Bienvenido de nuevo. Ingresa tus credenciales para gestionar tu tienda.
            </p>
          </header>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-[13px] font-extrabold">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-brand-black uppercase tracking-widest">Correo electrónico</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${emailError ? 'text-red-500' : 'text-brand-text-muted'}`} size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onBlur={(e) => validateEmail(e.target.value)}
                  placeholder="ejemplo@plataforma.com"
                  className={`w-full h-14 pl-12 pr-4 bg-white border rounded-2xl text-[14px] font-extrabold outline-none focus:ring-4 transition-all ${emailError ? 'border-red-400 focus:ring-red-500/5' : 'border-brand-neutral-border focus:ring-brand-black/5 focus:border-brand-black'}`}
                />
                {emailError && <p className="text-[11px] font-bold text-red-500 px-1 mt-1">{emailError}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-extrabold text-brand-black uppercase tracking-widest">Contraseña</label>
                <button 
                  type="button" 
                  onClick={() => router.push('/recovery')}
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
                  placeholder="••••••••••••"
                  className="w-full h-14 pl-12 pr-12 bg-white border border-brand-neutral-border rounded-2xl text-[14px] font-extrabold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all"
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
              className={`w-full h-14 !text-[15px] !rounded-[20px] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Iniciar sesión'}
            </Button>
          </form>

          <footer className="pt-8 text-center">
            <div className="flex items-center gap-6 mb-8">
              <div className="h-[1.5px] flex-1 bg-brand-neutral-border opacity-50"></div>
              <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">O</span>
              <div className="h-[1.5px] flex-1 bg-brand-neutral-border opacity-50"></div>
            </div>
            
            <button type="button" className="text-[14px] font-extrabold text-brand-black bg-brand-neutral-mid px-6 py-4 rounded-2xl hover:bg-brand-neutral-border transition-colors w-full">
              Contactar Soporte Técnico
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}