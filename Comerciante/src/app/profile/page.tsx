'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Button, Card, Input } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Key,
  Lock,
  Save,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, updatePassword } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [paternalSurname, setPaternalSurname] = useState(user?.paternalSurname || '');
  const [maternalSurname, setMaternalSurname] = useState(user?.maternalSurname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const onlyDigits = (value: string) => value.replace(/\D/g, '').slice(0, 15);
  const showSavedMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getPasswordFieldError = (message: string): Record<string, string> => {
    const normalized = message.toLowerCase();
    if (normalized.includes('current') || normalized.includes('actual') || normalized.includes('incorrect')) {
      return { currentPassword: message };
    }
    if (normalized.includes('match') || normalized.includes('coincid')) {
      return { confirmPassword: message };
    }
    return { newPassword: message };
  };

  const handleSavePersonal = async () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!paternalSurname.trim()) newErrors.paternalSurname = 'El apellido paterno es obligatorio';
    if (!email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Formato de correo invalido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateProfile({
        firstName: firstName.trim(),
        paternalSurname: paternalSurname.trim(),
        maternalSurname: maternalSurname.trim(),
        email: email.trim(),
        phone
      });

      setErrors({});
      showSavedMessage();
    } catch (error) {
      setErrors({ email: error instanceof Error ? error.message : 'No se pudo actualizar el perfil' });
    }
  };

  const handleChangePassword = async () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) newErrors.currentPassword = 'La contrase?a actual es obligatoria';
    if (!newPassword) newErrors.newPassword = 'La nueva contrase?a es obligatoria';
    else if (newPassword.length < 8) newErrors.newPassword = 'Minimo 8 caracteres';
    else if (!/[A-Z]/.test(newPassword)) newErrors.newPassword = 'La nueva contrase?a debe incluir una may?scula';
    else if (!/[0-9]/.test(newPassword)) newErrors.newPassword = 'La nueva contrase?a debe incluir al menos un n?mero';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirma la nueva contrase?a';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Las contrase?as no coinciden';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword, confirmPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      showSavedMessage();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar la contrase?a';
      setErrors(getPasswordFieldError(message));
    }
  };

  return (
    <MerchantLayout title="Mi Perfil" subtitle="Gestiona tu informaci?n personal y seguridad" noSidebar={true}>
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[11px] font-extrabold text-brand-text-muted hover:text-brand-black transition-all group uppercase tracking-[0.2em] leading-none"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Volver
            </button>
            <h1 className="text-[40px] md:text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">Perfil de Usuario</h1>
            <p className="text-brand-text-muted text-[15px] font-bold max-w-2xl leading-relaxed">
              Actualiza tus datos personales y cambia tu contrase?a desde una sola pantalla.
            </p>
          </div>
        </header>

        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 flex items-center gap-4 animate-in slide-in-from-top duration-300">
            <div className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center text-white">
              <Check size={22} />
            </div>
            <div>
              <h4 className="text-[16px] font-black text-green-800">Cambios guardados exitosamente</h4>
              <p className="text-[13px] font-bold text-green-700">Tu informaci?n se ha actualizado correctamente.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <Card title="Informaci?n Personal" subtitle="Datos de contacto e identificaci?n" className="shadow-2xl shadow-brand-black/5">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre *"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors({ ...errors, firstName: '' });
                  }}
                  error={errors.firstName}
                  className="h-14 rounded-2xl font-bold"
                />
                <Input
                  label="Apellido Paterno *"
                  value={paternalSurname}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPaternalSurname(e.target.value);
                    if (errors.paternalSurname) setErrors({ ...errors, paternalSurname: '' });
                  }}
                  error={errors.paternalSurname}
                  className="h-14 rounded-2xl font-bold"
                />
              </div>

              <Input
                label="Apellido Materno"
                value={maternalSurname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaternalSurname(e.target.value)}
                className="h-14 rounded-2xl font-bold"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Correo electronico *"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  error={errors.email}
                  className="h-14 rounded-2xl font-bold"
                />
                <Input
                  label="Telefono"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={15}
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(onlyDigits(e.target.value))}
                  className="h-14 rounded-2xl font-bold"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSavePersonal}
                  className="h-14 px-10 gap-3 rounded-2xl font-black shadow-xl shadow-brand-black/20"
                >
                  <Save size={20} /> Guardar informaci?n
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Seguridad" subtitle="Actualiza la contrase?a de acceso" className="shadow-2xl shadow-brand-black/5">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-brand-black uppercase tracking-widest">Contrase?a actual</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCurrentPassword(e.target.value);
                      if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                    }}
                    placeholder="Contrase?a actual"
                    className={`w-full h-14 pl-12 pr-12 bg-white border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all ${
                      errors.currentPassword ? 'border-red-500' : 'border-brand-neutral-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-black transition-colors"
                  >
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-[11px] font-bold text-red-500">{errors.currentPassword}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-brand-black uppercase tracking-widest">Nueva contrase?a</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                    }}
                    placeholder="Minimo 8 caracteres"
                    className={`w-full h-14 pl-12 pr-12 bg-white border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all ${
                      errors.newPassword ? 'border-red-500' : 'border-brand-neutral-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-black transition-colors"
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-[11px] font-bold text-red-500">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-brand-black uppercase tracking-widest">Confirmar nueva contrase?a</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Repite la nueva contrase?a"
                    className={`w-full h-14 pl-12 pr-12 bg-white border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-brand-neutral-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-black transition-colors"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] font-bold text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-start gap-4">
                <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="text-[12px] font-black text-blue-900 uppercase tracking-wider">Requisitos de seguridad</p>
                  <div className="space-y-1.5">
                    <PasswordRule active={newPassword.length >= 8} label="Minimo 8 caracteres" />
                    <PasswordRule active={/[A-Z]/.test(newPassword)} label="Al menos una mayúscula" />
                    <PasswordRule active={/[0-9]/.test(newPassword)} label="Al menos un número" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleChangePassword}
                  className="h-14 px-10 gap-3 rounded-2xl font-black shadow-xl shadow-brand-black/20"
                >
                  <Key size={20} /> Actualizar contrase?a
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MerchantLayout>
  );
}

function PasswordRule({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-[12px] font-bold ${active ? 'text-green-700' : 'text-blue-800/70'}`}>
      {active ? <Check size={14} strokeWidth={3} /> : <Shield size={14} />}
      {label}
    </div>
  );
}
