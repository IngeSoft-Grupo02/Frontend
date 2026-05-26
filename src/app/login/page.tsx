'use client';

import { useApp } from '@/context/AppContext';
import { Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  
  // Estados locales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Validación simple de email
  const validateEmail = (value: string) => {
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !regex.test(value)) {
      setEmailError('Ingresa un correo válido.');
    } else {
      setEmailError('');
    }
    setError(''); // Limpiar error de login al escribir
  };

  // Manejar el login
  const handleLogin = () => {
    if (!email || !password) {
      setError('No se pudo iniciar sesión. Verifica tus credenciales.');
      return;
    }

    // Llamamos a la función del contexto
    const success = login(email, password);
    
    if (success) {
      router.push('/admin'); // Redirigir al panel
    } else {
      setError('Credenciales incorrectas. (Prueba: admin@platform.com / admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 lg:p-10">
      <div className="w-full max-w-[1200px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
        
        {/* --- Sección Izquierda: Branding --- */}
        <div className="w-full lg:w-[450px] bg-brand-black p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
          
          {/* Contenido */}
          <div className="z-10 relative">
            <h1 className="text-[48px] lg:text-[64px] font-display font-extrabold leading-none mb-8 tracking-tighter">
              Kingstore
            </h1>
            <p className="text-[16px] lg:text-[18px] text-neutral-400 font-medium max-w-[280px] leading-relaxed">
              Gestiona tiendas, usuarios y límites globales desde un único panel centralizado.
            </p>
          </div>

          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-[800px] h-full opacity-10 pointer-events-none -mr-[300px] flex items-center justify-center">
            <LayoutDashboard size={600} />
          </div>
          
          <div className="z-10 mt-auto pt-12">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-camel"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
            </div>
          </div>
        </div>

        {/* --- Sección Derecha: Formulario --- */}
        <div className="flex-1 p-10 lg:p-24 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-10">
              <h2 className="text-[32px] lg:text-[42px] font-display font-extrabold leading-none mb-3 tracking-tight text-[#0a0a0a]">
                Iniciar sesión
              </h2>
              <p className="text-[16px] text-neutral-400 font-medium">
                Acceso restringido para administradores
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Input Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-500 ml-1 uppercase tracking-wide">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="admin@platform.com"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  className={`w-full px-5 py-4 bg-neutral-50 border ${emailError ? 'border-red-300' : 'border-neutral-200'} rounded-2xl text-[15px] font-medium outline-none focus:bg-white focus:border-brand-camel focus:ring-4 focus:ring-brand-camel/10 transition-all`}
                />
                {emailError && (
                  <p className="text-[12px] text-red-500 ml-1 font-medium">{emailError}</p>
                )}
              </div>

              {/* Input Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-neutral-500 ml-1 uppercase tracking-wide">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-[15px] font-medium outline-none focus:bg-white focus:border-brand-camel focus:ring-4 focus:ring-brand-camel/10 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Global */}
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-[13px] font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
                   {error}
                </div>
              )}

              {/* Botón Login */}
              <button
                onClick={handleLogin}
                className="w-full h-16 rounded-2xl bg-brand-black text-white font-bold text-[16px] hover:bg-neutral-800 active:scale-[0.98] transition-all mt-4 shadow-lg shadow-brand-black/20"
              >
                Ingresar al panel
              </button>

              {/* Footer Links */}
              <div className="flex justify-between items-center pt-4 px-2">
                <button className="text-sm text-neutral-400 hover:text-brand-camel font-medium transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
                <button className="text-sm text-neutral-400 hover:text-brand-camel font-medium transition-colors">
                  Soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}