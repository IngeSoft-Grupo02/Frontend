'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card, Input } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    Check,
    Eye,
    EyeOff,
    Key,
    Lock,
    Mail,
    Phone,
    Save,
    Shield,
    User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, updatePassword } = useStore();
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Personal Data
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [paternalSurname, setPaternalSurname] = useState(user?.paternalSurname || '');
  const [maternalSurname, setMaternalSurname] = useState(user?.maternalSurname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const getInitials = () => {
    const name = user?.name || '';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getFullName = () => {
    return [firstName, paternalSurname, maternalSurname].filter(Boolean).join(' ');
  };

  const onlyDigits = (value: string) => value.replace(/\D/g, '').slice(0, 15);

  const handleSavePersonal = async () => {
    const newErrors: Record<string, string> = {};

    if (!firstName) newErrors.firstName = 'El nombre es obligatorio';
    if (!paternalSurname) newErrors.paternalSurname = 'El apellido paterno es obligatorio';
    if (!email) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Formato de correo inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateProfile({
        firstName,
        paternalSurname,
        maternalSurname,
        email,
        phone
      });

      setErrors({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors({ email: error instanceof Error ? error.message : 'No se pudo actualizar el perfil' });
    }
  };

  const handleChangePassword = async () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) newErrors.currentPassword = 'La contraseña actual es obligatoria';
    if (!newPassword) newErrors.newPassword = 'La nueva contraseña es obligatoria';
    else if (newPassword.length < 6) newErrors.newPassword = 'Mínimo 6 caracteres';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

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
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors({ currentPassword: error instanceof Error ? error.message : 'No se pudo actualizar la contraseña' });
    }
  };

  const tabs = [
    { id: 'personal' as const, label: 'Información Personal', icon: User },
    { id: 'security' as const, label: 'Seguridad', icon: Shield }
  ];

  return (
    <MerchantLayout title="Mi Perfil" subtitle="Gestiona tu información personal y seguridad" noSidebar={true}>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-[11px] font-extrabold text-brand-text-muted hover:text-brand-black transition-all group uppercase tracking-[0.2em] leading-none"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Volver al panel
            </button>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">Perfil de Usuario</h1>
            <p className="text-brand-text-muted text-[15px] font-bold max-w-2xl leading-relaxed">
              Actualiza tus datos personales y configura la seguridad de tu cuenta.
            </p>
          </div>
        </header>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 flex items-center gap-4 animate-in slide-in-from-top duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <Check size={24} />
            </div>
            <div>
              <h4 className="text-[16px] font-black text-green-800">Cambios guardados exitosamente</h4>
              <p className="text-[13px] font-bold text-green-700">Tu información se ha actualizado correctamente.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 bg-brand-neutral-mid/20 p-2 rounded-[24px] border border-brand-neutral-border w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setErrors({}); }}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[13px] font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-black text-white shadow-xl shadow-brand-black/20'
                  : 'text-brand-text-muted hover:text-brand-black hover:bg-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <>
                <Card title="Información Personal" subtitle="Datos de contacto y identificación">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <Input
                        label="Apellido Materno"
                        value={maternalSurname}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaternalSurname(e.target.value)}
                        className="h-14 rounded-2xl font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Correo electrónico *"
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
                        label="Teléfono"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={15}
                        value={phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(onlyDigits(e.target.value))}
                        className="h-14 rounded-2xl font-bold"
                      />
                    </div>

                    <div className="bg-brand-neutral-light p-6 rounded-2xl border border-brand-neutral-border flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-black rounded-full flex items-center justify-center text-white font-black">
                        <User size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-brand-text-muted uppercase tracking-wider">Rol actual</p>
                        <p className="text-[15px] font-black text-brand-black">{user?.role || 'Comerciante'}</p>
                      </div>
                      <Badge variant="success" className="font-black">Verificado</Badge>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSavePersonal}
                    className="h-14 px-10 gap-3 rounded-2xl font-black shadow-xl shadow-brand-black/20"
                  >
                    <Save size={20} /> Guardar cambios
                  </Button>
                </div>
              </>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <>
                <Card title="Cambiar Contraseña" subtitle="Actualiza tu contraseña de acceso">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-brand-black uppercase tracking-widest">Contraseña actual</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setCurrentPassword(e.target.value);
                            if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                          }}
                          placeholder="••••••••"
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
                      <label className="text-[11px] font-black text-brand-black uppercase tracking-widest">Nueva contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setNewPassword(e.target.value);
                            if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                          }}
                          placeholder="••••••••"
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
                      <label className="text-[11px] font-black text-brand-black uppercase tracking-widest">Confirmar nueva contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                          }}
                          placeholder="••••••••"
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

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                      <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[12px] font-bold text-blue-800 leading-relaxed">
                          La contraseña debe tener al menos 6 caracteres. Se recomienda usar una combinación de letras, números y símbolos.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleChangePassword}
                    className="h-14 px-10 gap-3 rounded-2xl font-black shadow-xl shadow-brand-black/20"
                  >
                    <Key size={20} /> Actualizar contraseña
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="!p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-brand-black rounded-full flex items-center justify-center text-white font-black text-[40px] shadow-2xl shadow-brand-black/20">
                    {getInitials()}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-camel rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[22px] font-black text-brand-black tracking-tight">
                    {user?.name || 'Usuario'}
                  </h3>
                  <p className="text-[12px] font-bold text-brand-text-muted uppercase tracking-widest">
                    {user?.role || 'Comerciante'}
                  </p>
                </div>

                <div className="w-full space-y-3 pt-4 border-t border-brand-neutral-border">
                  <div className="flex items-center gap-3 text-[13px] font-bold text-brand-text-muted">
                    <Mail size={16} className="text-brand-text-muted" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-3 text-[13px] font-bold text-brand-text-muted">
                      <Phone size={16} className="text-brand-text-muted" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>

                <Badge variant="success" className="!px-5 !py-1.5 font-black">
                  Cuenta verificada
                </Badge>
              </div>
            </Card>

            <Card title="Información de la Cuenta" className="!p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Estado</span>
                  <Badge variant="success" className="font-black">Activa</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Último acceso</span>
                  <span className="text-[13px] font-black text-brand-black">Hoy, 10:42 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Tienda principal</span>
                  <span className="text-[13px] font-black text-brand-black">Studio 47</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}
