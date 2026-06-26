/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck, CreditCard, Phone, Calendar, Users, AlertCircle, CheckCircle2, Circle, Eye, EyeOff } from 'lucide-react';
import { Store, View, RegisterCustomerDTO } from '../types';
import { Button } from '../components/ui/Button';
import { StoreLogo } from '../components/ui/StoreLogo';

type Gender = 'MALE' | 'FEMALE' | 'NOT_SPECIFIED';
type DocumentTypeValue = 'DNI' | 'PASSPORT' | 'FOREIGN_ID_CARD';

const DOCUMENT_TYPE_OPTIONS: { value: DocumentTypeValue; label: string }[] = [
  { value: 'DNI', label: 'DNI' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'FOREIGN_ID_CARD', label: 'Carné de extranjería' },
];

// Longitud máxima del número de documento según tipo (DNI=8, CE=9-15, Pasaporte=6-20)
const DOCUMENT_NUMBER_MAX_LENGTH: Record<DocumentTypeValue, number> = {
  DNI: 8,
  FOREIGN_ID_CARD: 15,
  PASSPORT: 20,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LENGTH = 50;
const NAME_REGEX = /^[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1\u00DC\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1\u00FC\s]+$/u;
const PERSON_NAME_ERROR = 'El nombre debe tener entre 2 y 50 caracteres y solo puede contener letras.';

interface AuthProps {
  store: Store;
  type: 'login' | 'register' | 'forgot-password' | 'verification' | 'reset-password';
  onNavigate: (view: View) => void;
  onLogin: (email: string, password: string) => void;
  onRegister?: (dto: RegisterCustomerDTO) => void;
  authError?: string | null;
  authLoading?: boolean;
}

export const Auth: React.FC<AuthProps> = ({ store, type, onNavigate, onLogin, onRegister, authError, authLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    numeroDocumento: '',
    documentType: 'DNI' as DocumentTypeValue,
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    telefono: '',
    genero: 'NOT_SPECIFIED' as Gender,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const sanitizePersonName = (value: string) => {
    return value
      .replace(/[^A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1\u00DC\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1\u00FC\s]/gu, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, NAME_MAX_LENGTH);
  };

  const validatePersonNameField = (key: 'nombres' | 'apellidoPaterno' | 'apellidoMaterno') => {
    const value = formData[key].trim();
    const message = !value || value.length < 2 || value.length > NAME_MAX_LENGTH || !NAME_REGEX.test(value)
      ? PERSON_NAME_ERROR
      : '';
    setErrors((prev) => ({ ...prev, [key]: message }));
    return !message;
  };

  const updatePersonNameField = (key: 'nombres' | 'apellidoPaterno' | 'apellidoMaterno', value: string) => {
    const cleanValue = sanitizePersonName(value);
    setFormData((prev) => ({ ...prev, [key]: cleanValue }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const PasswordVisibilityButton = ({ visible, onClick }: { visible: boolean; onClick: () => void }) => (
    <button
      type="button"
      aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-opacity hover:opacity-80"
      style={{ color: 'var(--text-on-primary)' }}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const email = formData.email.trim();
    if (!email || !EMAIL_REGEX.test(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    // Password validation
    if (!passwordRequirements.length) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (type === 'reset-password' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (type === 'register') {
      // Nombres y apellidos
      const nameFields: { key: 'nombres' | 'apellidoPaterno' | 'apellidoMaterno'; label: string }[] = [
        { key: 'nombres', label: 'El nombre' },
        { key: 'apellidoPaterno', label: 'El apellido paterno' },
        { key: 'apellidoMaterno', label: 'El apellido materno' },
      ];
      nameFields.forEach(({ key }) => {
        const value = formData[key].trim();
        if (!value || value.length < 2 || value.length > NAME_MAX_LENGTH || !NAME_REGEX.test(value)) {
          newErrors[key] = PERSON_NAME_ERROR;
        }
      });

      // Documento: solo dígitos, longitud según tipo
      const docNumber = formData.numeroDocumento.trim();
      if (!docNumber) {
        newErrors.numeroDocumento = 'El número de documento es obligatorio';
      } else if (!/^\d+$/.test(docNumber)) {
        newErrors.numeroDocumento = 'El número de documento solo debe contener dígitos';
      } else if (formData.documentType === 'DNI' && docNumber.length !== 8) {
        newErrors.numeroDocumento = 'El DNI debe tener 8 dígitos';
      } else if (formData.documentType === 'FOREIGN_ID_CARD' && (docNumber.length < 9 || docNumber.length > 15)) {
        newErrors.numeroDocumento = 'El carné de extranjería debe tener entre 9 y 15 dígitos';
      } else if (formData.documentType === 'PASSPORT' && (docNumber.length < 6 || docNumber.length > 20)) {
        newErrors.numeroDocumento = 'El pasaporte debe tener entre 6 y 20 dígitos';
      }

      // Teléfono: exactamente 9 dígitos
      const phone = formData.telefono.trim();
      if (!/^\d{9}$/.test(phone)) {
        newErrors.telefono = 'El celular debe tener 9 dígitos';
      }

      // Fecha de nacimiento: formato válido y no futura
      if (!formData.fechaNacimiento) {
        newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
      } else {
        const birthDate = new Date(formData.fechaNacimiento);
        if (Number.isNaN(birthDate.getTime())) {
          newErrors.fechaNacimiento = 'La fecha de nacimiento no es válida';
        } else if (birthDate.getTime() > Date.now()) {
          newErrors.fechaNacimiento = 'La fecha de nacimiento no puede ser una fecha futura';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'register') {
      if (validateForm()) {
        const dto: RegisterCustomerDTO = {
          email: formData.email.trim(),
          password: formData.password,
          documentNumber: formData.numeroDocumento.trim(),
          documentType: formData.documentType,
          firstName: formData.nombres.trim(),
          paternalSurname: formData.apellidoPaterno.trim(),
          maternalSurname: formData.apellidoMaterno.trim(),
          birthDate: formData.fechaNacimiento,
          phone: formData.telefono.trim(),
          gender: formData.genero,
        };
        onRegister?.(dto);
      }
    } else if (type === 'reset-password') {
      if (validateForm()) {
        onNavigate(View.AUTH_LOGIN);
      }
    } else if (type === 'forgot-password') {
      // Simulate sending email
      onNavigate(View.AUTH_VERIFICATION);
    } else if (type === 'verification') {
      onNavigate(View.AUTH_RESET_PASSWORD);
    } else {
      onLogin(formData.email, formData.password);
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
      <div className="flex items-center gap-2 text-[11px] font-bold transition-colors" style={{ color: passwordRequirements.length ? 'var(--success-on-secondary)' : 'var(--muted-on-secondary)' }}>
        {passwordRequirements.length ? <CheckCircle2 size={12} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
        Mínimo 8 caracteres
      </div>
      <div className="flex items-center gap-2 text-[11px] font-bold transition-colors" style={{ color: passwordRequirements.uppercase ? 'var(--success-on-secondary)' : 'var(--muted-on-secondary)' }}>
        {passwordRequirements.uppercase ? <CheckCircle2 size={12} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
        Al menos 1 mayúscula
      </div>
      <div className="flex items-center gap-2 text-[11px] font-bold transition-colors" style={{ color: passwordRequirements.lowercase ? 'var(--success-on-secondary)' : 'var(--muted-on-secondary)' }}>
        {passwordRequirements.lowercase ? <CheckCircle2 size={12} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
        Al menos 1 minúscula
      </div>
      <div className="flex items-center gap-2 text-[11px] font-bold transition-colors" style={{ color: passwordRequirements.number ? 'var(--success-on-secondary)' : 'var(--muted-on-secondary)' }}>
        {passwordRequirements.number ? <CheckCircle2 size={12} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
        Al menos 1 número
      </div>
      <div className="flex items-center gap-2 text-[11px] font-bold transition-colors" style={{ color: passwordRequirements.special ? 'var(--success-on-secondary)' : 'var(--muted-on-secondary)' }}>
        {passwordRequirements.special ? <CheckCircle2 size={12} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
        Al menos 1 carácter especial
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
             <StoreLogo
               store={store}
               className="w-24 h-24 rounded-3xl mb-10 shadow-2xl border"
               style={{
                 backgroundColor: 'var(--color-secondary)',
                 borderColor: 'rgba(255, 255, 255, 0.1)'
               }}
               fallbackClassName="font-black text-4xl"
               fallbackStyle={{ color: 'var(--color-text-on-secondary)' }}
               objectFit="contain"
             />
             <h2 className="text-[42px] font-extrabold leading-tight mb-6">Accede a {store.name}</h2>
             <p
               className="text-[18px] leading-relaxed mb-10 opacity-80"
             >
               Esta es una cuenta exclusiva para esta tienda. Tus pedidos y cotizaciones aquí son independientes de otras marcas en Kingstore.
             </p>
             <div className="flex items-center gap-4 font-extrabold text-[14px]" style={{ color: 'var(--accent-on-primary)' }}>
                <ShieldCheck size={20} />
                Plataforma 100% segura
             </div>
          </div>
        </div>

        <div className="relative z-10 text-[12px] font-medium" style={{ color: 'var(--muted-on-primary)' }}>
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
            borderColor: 'var(--border-on-secondary)'
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

          <form className="space-y-6 auth-form" onSubmit={handleSubmit}>
            {type === 'register' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <CreditCard size={12} className="opacity-70" /> Tipo de Documento
                  </label>
                  <select
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border transition-all appearance-none ${errors.documentType ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                    value={formData.documentType}
                    onChange={(e) => {
                      const documentType = e.target.value as DocumentTypeValue;
                      const maxLength = DOCUMENT_NUMBER_MAX_LENGTH[documentType];
                      setFormData({
                        ...formData,
                        documentType,
                        numeroDocumento: formData.numeroDocumento.slice(0, maxLength),
                      });
                      setErrors((prev) => ({ ...prev, numeroDocumento: '', documentType: '' }));
                    }}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  >
                    {DOCUMENT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-[var(--color-primary)] text-[var(--text-on-primary)]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <CreditCard size={12} className="opacity-70" /> Número de Documento
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={DOCUMENT_NUMBER_MAX_LENGTH[formData.documentType]}
                    placeholder="Número de documento"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.numeroDocumento ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                    value={formData.numeroDocumento}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, DOCUMENT_NUMBER_MAX_LENGTH[formData.documentType]);
                      setFormData({...formData, numeroDocumento: digitsOnly});
                    }}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.numeroDocumento && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.numeroDocumento}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <User size={12} className="opacity-70" /> Nombres
                  </label>
                  <input
                    type="text"
                    placeholder="Tus nombres"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.nombres ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                    value={formData.nombres}
                    maxLength={NAME_MAX_LENGTH}
                    onChange={(e) => updatePersonNameField('nombres', e.target.value)}
                    onBlur={() => validatePersonNameField('nombres')}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.nombres && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.nombres}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <User size={12} className="opacity-70" /> Apellido Paterno
                  </label>
                  <input
                    type="text"
                    placeholder="Primer apellido"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.apellidoPaterno ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                    value={formData.apellidoPaterno}
                    maxLength={NAME_MAX_LENGTH}
                    onChange={(e) => updatePersonNameField('apellidoPaterno', e.target.value)}
                    onBlur={() => validatePersonNameField('apellidoPaterno')}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.apellidoPaterno && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.apellidoPaterno}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <User size={12} className="opacity-70" /> Apellido Materno
                  </label>
                  <input
                    type="text"
                    placeholder="Segundo apellido"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.apellidoMaterno ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                    value={formData.apellidoMaterno}
                    maxLength={NAME_MAX_LENGTH}
                    onChange={(e) => updatePersonNameField('apellidoMaterno', e.target.value)}
                    onBlur={() => validatePersonNameField('apellidoMaterno')}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.apellidoMaterno && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.apellidoMaterno}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Users size={12} className="opacity-70" /> Género
                  </label>
                  <select
                    className="w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border border-transparent transition-all appearance-none"
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: e.target.value as Gender })}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                  >
                    <option value="FEMALE" className="bg-[var(--color-primary)] text-[var(--text-on-primary)]">Femenino</option>
                    <option value="MALE" className="bg-[var(--color-primary)] text-[var(--text-on-primary)]">Masculino</option>
                    <option value="NOT_SPECIFIED" className="bg-[var(--color-primary)] text-[var(--text-on-primary)]">Prefiero no decir</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Calendar size={12} className="opacity-70" /> Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.fechaNacimiento ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.fechaNacimiento && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.fechaNacimiento}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Phone size={12} className="opacity-70" /> Teléfono
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="999 999 999"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.telefono ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value.replace(/\D/g, '').slice(0, 9)})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.telefono && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.telefono}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Mail size={12} className="opacity-70" /> Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    className={`w-full px-5 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.email ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)'
                    }}
                    required
                  />
                  {errors.email && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Lock size={12} className="opacity-70" /> Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      className={`w-full pl-5 pr-12 py-3.5 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.password ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)'
                      }}
                      required
                    />
                    <PasswordVisibilityButton visible={showPassword} onClick={() => setShowPassword((visible) => !visible)} />
                  </div>
                  {errors.password && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.password}</p>}
                  <PasswordHint />
                </div>
              </div>
            ) : type === 'reset-password' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Lock size={12} className="opacity-70" /> Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Al menos 8 caracteres"
                      className={`w-full pl-5 pr-12 py-4 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.password ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)'
                      }}
                      required
                    />
                    <PasswordVisibilityButton visible={showPassword} onClick={() => setShowPassword((visible) => !visible)} />
                  </div>
                  <PasswordHint />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pl-1" style={{ color: 'var(--text-on-secondary)' }}>
                    <Lock size={12} className="opacity-70" /> Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      className={`w-full pl-5 pr-12 py-4 rounded-xl font-medium text-[14px] border focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all ${errors.confirmPassword ? 'border-[var(--error-on-secondary)]' : 'border-transparent'}`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)'
                      }}
                      required
                    />
                    <PasswordVisibilityButton visible={showConfirmPassword} onClick={() => setShowConfirmPassword((visible) => !visible)} />
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] font-bold ml-1 text-[var(--error-on-secondary)]">{errors.confirmPassword}</p>}
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
                  className="w-full px-5 py-4 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all"
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
                      className="w-12 h-14 border border-transparent rounded-xl text-center text-xl font-black focus:border-[var(--accent-on-primary)] focus:ring-2 focus:ring-[var(--accent-on-primary)] outline-none transition-all"
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
                    style={{ color: 'var(--accent-on-secondary)' }}
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
                    className="w-full px-5 py-4 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      style={{ color: 'var(--accent-on-secondary)' }}
                      onClick={() => {
                        const recoveryUrl = store.slug
                          ? `/recuperacion?store=${encodeURIComponent(store.slug)}`
                          : '/recuperacion';
                        window.location.assign(recoveryUrl);
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      className="w-full pl-5 pr-12 py-4 rounded-xl font-medium text-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent-on-primary)] transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--text-on-primary)'
                      }}
                      required
                    />
                    <PasswordVisibilityButton visible={showPassword} onClick={() => setShowPassword((visible) => !visible)} />
                  </div>
                </div>
              </>
            )}

            {authError && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] font-bold"
                role="alert"
                style={{ border: '1px solid var(--error-on-secondary)', color: 'var(--error-on-secondary)' }}
              >
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}


            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="py-4.5 mt-4 uppercase tracking-widest text-[14px]"
              disabled={(type === 'login' || type === 'register') && authLoading}
            >
              <span>
                {(type === 'login' || type === 'register') && authLoading
                  ? 'Procesando...'
                  : type === 'login' ? 'Iniciar sesión' :
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
              <ArrowLeft size={14} style={{ color: 'var(--accent-on-secondary)' }} />
              <span>Volver a la tienda</span>
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t text-center" style={{ borderColor: 'var(--border-on-secondary)' }}>
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
                style={{ color: 'var(--accent-on-secondary)' }}
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
