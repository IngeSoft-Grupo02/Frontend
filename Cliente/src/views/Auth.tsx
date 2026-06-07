/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Mail, ArrowRight, ArrowLeft, Store as StoreIcon, ShieldCheck, CreditCard, Phone, Calendar } from 'lucide-react';
import { Store, View, TipoDocumento } from '../types';
import { Button } from '../components/ui/Button';

interface AuthProps {
  store: Store;
  type: 'login' | 'register' | 'forgot-password' | 'verification' | 'reset-password';
  onNavigate: (view: View) => void;
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ store, type, onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    numeroDocumento: '',
    tipoDocumento: TipoDocumento.DNI,
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    telefono: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Password validation
    if (!passwordRequirements.length || !passwordRequirements.uppercase || !passwordRequirements.number) {
      newErrors.password = 'La contraseña no cumple con los requisitos';
    }

    if (type === 'reset-password' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Document validation
    const docLength = formData.numeroDocumento.length;
    if (formData.tipoDocumento === TipoDocumento.DNI && docLength !== 8) {
      newErrors.numeroDocumento = 'El DNI debe tener 8 dígitos';
    } else if (formData.tipoDocumento === TipoDocumento.CE && (docLength < 9 || docLength > 12)) {
      newErrors.numeroDocumento = 'El CE debe tener entre 9 y 12 caracteres';
    } else if (formData.tipoDocumento === TipoDocumento.RUC && docLength !== 11) {
      newErrors.numeroDocumento = 'El RUC debe tener 11 dígitos';
    }

    // Phone validation (Peru: 9 digits)
    const phoneRegex = /^[9][0-9]{8}$/;
    if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos y empezar con 9';
    }

    // Age validation (> 18 years)
    if (formData.fechaNacimiento) {
      const birthDate = new Date(formData.fechaNacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte';
      }
    } else {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'register' || type === 'reset-password') {
      if (validateForm()) {
        if (type === 'register') onLogin();
        else onNavigate(View.AUTH_LOGIN);
      }
    } else if (type === 'forgot-password') {
      // Simulate sending email
      onNavigate(View.AUTH_VERIFICATION);
    } else if (type === 'verification') {
      onNavigate(View.AUTH_RESET_PASSWORD);
    } else {
      onLogin();
    }
  };

  const getAuthTitle = () => {
    switch (type) {
      case 'login': return 'Bienvenido de nuevo';
      case 'register': return 'Registro de Cliente';
      case 'forgot-password': return 'Recuperar contraseña';
      case 'verification': return 'Verificación de cuenta';
      case 'reset-password': return 'Nueva contraseña';
      default: return '';
    }
  };

  const getAuthSubtitle = () => {
    switch (type) {
      case 'register': return `Completa tus datos para crear una cuenta en ${store.name}`;
      case 'forgot-password': return 'Ingresa tu correo para recibir un código de verificación';
      case 'verification': return 'Hemos enviado un código a tu correo electrónico';
      case 'reset-password': return 'Crea una contraseña segura para tu cuenta';
      default: return null;
    }
  };

  const PasswordHint = () => (
    <div className="mt-2 space-y-1.5 pl-1">
      <div className={`flex items-center gap-2 text-[10px] font-bold transition-colors ${passwordRequirements.length ? 'text-green-500' : 'text-gray-400'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.length ? 'bg-green-500' : 'bg-gray-300'}`} />
        Mínimo 8 caracteres
      </div>
      <div className={`flex items-center gap-2 text-[10px] font-bold transition-colors ${passwordRequirements.uppercase ? 'text-green-500' : 'text-gray-400'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.uppercase ? 'bg-green-500' : 'bg-gray-300'}`} />
        Al menos 1 mayúscula
      </div>
      <div className={`flex items-center gap-2 text-[10px] font-bold transition-colors ${passwordRequirements.number ? 'text-green-500' : 'text-gray-400'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${passwordRequirements.number ? 'bg-green-500' : 'bg-gray-300'}`} />
        Al menos 1 número
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Left Branding Side */}
      <div 
        className="hidden lg:flex w-1/2 p-24 flex-col justify-between relative overflow-hidden transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-on-primary)'
        }}
      >
        <div className="relative z-10">
          <div 
            className="flex items-center gap-2.5 mb-20 cursor-pointer" 
            onClick={() => onNavigate(View.DIRECTORY)}
          >
            <div className="logo-accent w-6 h-6 grid grid-cols-2 gap-[2px]">
              <div className="bg-[var(--color-secondary)]" />
              <div className="bg-[var(--color-tertiary)]" />
              <div style={{ backgroundColor: 'var(--color-text-on-primary)' }} />
              <div style={{ backgroundColor: 'var(--color-text-on-primary)', opacity: 0.2 }} />
            </div>
            <span className="font-extrabold text-[24px] tracking-tight">Kingstore</span>
          </div>

          <div className="max-w-md">
             <div 
               className="w-24 h-24 rounded-3xl flex items-center justify-center mb-10 font-black text-4xl shadow-2xl border"
               style={{ 
                 backgroundColor: 'var(--color-secondary)',
                 color: 'var(--color-text-on-secondary)',
                 borderColor: 'rgba(255, 255, 255, 0.1)'
               }}
             >
               {store.logo}
             </div>
             <h2 className="text-[42px] font-extrabold leading-tight mb-6">Accede a {store.name}</h2>
             <p 
               className="text-[18px] leading-relaxed mb-10 opacity-80"
             >
               Esta es una cuenta exclusiva para esta tienda. Tus pedidos y cotizaciones aquí son independientes de otras marcas en Kingstore.
             </p>
             <div className="flex items-center gap-4 font-extrabold text-[14px]" style={{ color: 'var(--color-tertiary)' }}>
                <ShieldCheck size={20} />
                Plataforma 100% segura
             </div>
          </div>
        </div>

        <div className="relative z-10 text-[12px] font-medium opacity-50">
           &copy; 2026 Kingstore Software. Todos los derechos reservados.
        </div>

        {/* Abstract background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `radial-gradient(circle at 100% 100%, ${store.color} 0%, transparent 50%)` 
          }}
        />
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 transition-colors duration-300" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full ${type === 'register' ? 'max-w-[700px]' : 'max-w-[480px]'} rounded-3xl border p-8 sm:p-12 shadow-xl overflow-y-auto max-h-[90vh] no-scrollbar`}
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--text-on-secondary)',
            borderColor: 'rgba(0,0,0,0.05)'
          }}
        >

          <div className="text-center mb-10">
            <h3 className="text-[28px] font-extrabold mb-2" style={{ color: 'var(--text-on-secondary)' }}>
              {getAuthTitle()}
            </h3>
            {getAuthSubtitle() && (
              <p className="font-medium text-[14px] opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                {getAuthSubtitle()}
              </p>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {type === 'register' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <CreditCard size={12} className="opacity-70" /> Tipo de Documento
                  </label>
                  <select 
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border transition-all appearance-none ${errors.tipoDocumento ? 'border-red-500' : 'border-transparent'}`}
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value as TipoDocumento})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  >
                    <option value={TipoDocumento.DNI} className="bg-[var(--color-primary)] text-[var(--text-on-primary)]">DNI</option>
                    <option value={TipoDocumento.CE} className="bg-[var(--color-primary)] text-[var(--text-on-primary)]">CE</option>
                    <option value={TipoDocumento.RUC} className="bg-[var(--color-primary)] text-[var(--text-on-primary)]">RUC</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <CreditCard size={12} className="opacity-70" /> Número de Documento
                  </label>
                  <input 
                    type="text" 
                    placeholder="Número de documento"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all ${errors.numeroDocumento ? 'border-red-500' : 'border-transparent'}`}
                    value={formData.numeroDocumento}
                    onChange={(e) => setFormData({...formData, numeroDocumento: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.numeroDocumento && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.numeroDocumento}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <User size={12} className="opacity-70" /> Nombres
                  </label>
                  <input 
                    type="text" 
                    placeholder="Tus nombres"
                    className="w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all"
                    value={formData.nombres}
                    onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <User size={12} className="opacity-70" /> Apellido Paterno
                  </label>
                  <input 
                    type="text" 
                    placeholder="Primer apellido"
                    className="w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all"
                    value={formData.apellidoPaterno}
                    onChange={(e) => setFormData({...formData, apellidoPaterno: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <User size={12} className="opacity-70" /> Apellido Materno
                  </label>
                  <input 
                    type="text" 
                    placeholder="Segundo apellido"
                    className="w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all"
                    value={formData.apellidoMaterno}
                    onChange={(e) => setFormData({...formData, apellidoMaterno: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Calendar size={12} className="opacity-70" /> Fecha de Nacimiento
                  </label>
                  <input 
                    type="date" 
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all ${errors.fechaNacimiento ? 'border-red-500' : 'border-transparent'}`}
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.fechaNacimiento && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.fechaNacimiento}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Phone size={12} className="opacity-70" /> Teléfono
                  </label>
                  <input 
                    type="tel" 
                    placeholder="999 999 999"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all ${errors.telefono ? 'border-red-500' : 'border-transparent'}`}
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.telefono && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.telefono}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Mail size={12} className="opacity-70" /> Correo electrónico
                  </label>
                  <input 
                    type="email" 
                    placeholder="tu@correo.com"
                    className="w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Lock size={12} className="opacity-70" /> Contraseña
                  </label>
                  <input 
                    type="password" 
                    placeholder="********"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  <PasswordHint />
                </div>
              </div>
            ) : type === 'reset-password' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Lock size={12} className="opacity-70" /> Nueva Contraseña
                  </label>
                  <input 
                    type="password" 
                    placeholder="Al menos 8 caracteres"
                    className={`w-full px-5 py-4 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  <PasswordHint />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Lock size={12} className="opacity-70" /> Confirmar Contraseña
                  </label>
                  <input 
                    type="password" 
                    placeholder="Repite tu contraseña"
                    className={`w-full px-5 py-4 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            ) : type === 'forgot-password' ? (
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                  <Mail size={12} className="opacity-70" /> Correo electrónico
                </label>
                <input 
                  type="email" 
                  placeholder="tu@correo.com"
                  className="w-full px-5 py-4 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--text-on-primary)'
                  }}
                  required
                />
              </div>
            ) : type === 'verification' ? (
              <div className="space-y-6">
                <div className="flex justify-center gap-3 sm:gap-4">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 border border-transparent rounded-xl text-center text-xl font-black focus:border-[var(--color-tertiary)] focus:ring-2 focus:ring-[var(--color-tertiary)]/10 outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)'
                      }}
                      onChange={(e) => {
                        if (e.target.value && i < 5) {
                          const nextInputs = e.target.parentElement?.querySelectorAll('input');
                          if (nextInputs && nextInputs[i + 1]) {
                             (nextInputs[i + 1] as HTMLInputElement).focus();
                          }
                        }
                      }}
                    />
                  ))}
                </div>
                <div className="text-center">
                   <button 
                    type="button"
                    disabled={isResending}
                    onClick={() => {
                      setIsResending(true);
                      setTimeout(() => setIsResending(false), 2000);
                    }}
                    className="text-[12px] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                    style={{ color: 'var(--color-tertiary)' }}
                  >
                    {isResending ? 'Reenviando...' : 'Reenviar código'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Mail size={12} className="opacity-70" /> Correo electrónico
                  </label>
                  <input 
                    type="email" 
                    placeholder="tu@correo.com"
                    className="w-full px-5 py-4 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-on-secondary)' }}>
                      <Lock size={12} className="opacity-70" /> Contraseña
                    </label>
                    <button 
                      type="button" 
                      className="text-[11px] font-bold hover:underline cursor-pointer"
                      style={{ color: 'var(--color-tertiary)' }}
                      onClick={() => onNavigate(View.AUTH_FORGOT_PASSWORD)}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    placeholder="********"
                    className="w-full px-5 py-4 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/10 transition-all"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                </div>
              </>
            )}


            <Button type="submit" variant="primary" fullWidth className="py-4.5 mt-4 uppercase tracking-widest text-[14px]">
              <span>
                {type === 'login' ? 'Iniciar sesión' : 
                 type === 'register' ? 'Crear cuenta ahora' : 
                 type === 'forgot-password' ? 'Enviar código' : 
                 type === 'verification' ? 'Verificar código' : 'Restablecer contraseña'}
              </span>
              <ArrowRight size={18} />
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              fullWidth 
              className="py-4.5 uppercase tracking-widest text-[13px] !bg-transparent border transition-all mt-3 flex items-center justify-center gap-2 font-black"
              style={{
                borderColor: 'var(--text-on-secondary)',
                color: 'var(--text-on-secondary)'
              }}
              onClick={() => onNavigate(View.STOREFRONT_PUBLIC)}
            >
              <ArrowLeft size={14} style={{ color: 'var(--color-tertiary)' }} />
              <span>Volver a la Tienda</span>
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t text-center" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
            <p className="text-[13px] font-medium" style={{ color: 'var(--text-on-secondary)' }}>
              {type === 'login' 
                ? '¿Aún no tienes cuenta?' 
                : type === 'forgot-password' || type === 'verification' || type === 'reset-password'
                ? '¿Recordaste tu contraseña?'
                : '¿Ya eres miembro?'}
              {' '}
              <button 
                onClick={() => {
                  if (type === 'login') onNavigate(View.AUTH_REGISTER);
                  else if (type === 'register') onNavigate(View.AUTH_LOGIN);
                  else onNavigate(View.AUTH_LOGIN);
                }}
                className="font-extrabold hover:underline cursor-pointer"
                style={{ color: 'var(--color-tertiary)' }}
              >
                {type === 'login' ? 'Regístrate aquí' : 'Ingresa aquí'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
