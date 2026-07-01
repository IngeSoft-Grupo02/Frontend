/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Shield, ArrowLeft, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { Store, User as UserType, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';

interface ProfileProps {
  store: Store;
  user: UserType;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  onUpdateUser: (user: UserType) => void;
  cartCount: number;
}

export const Profile: React.FC<ProfileProps> = ({ store, user, onNavigate, onLogout, onUpdateUser, cartCount }) => {
  const [formData, setFormData] = useState({
    email: user.email,
    phone: user.phone || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API update
    setTimeout(() => {
      onUpdateUser({
        ...user,
        ...formData
      });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.PROFILE} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
        <button 
          onClick={() => onNavigate(View.CATALOG)}
          className="flex items-center gap-2 text-[13px] font-bold transition-colors mb-8 sm:mb-10 cursor-pointer"
          style={{ color: 'var(--text-on-primary)', opacity: 0.8 }}
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </button>

        <header className="mb-8 sm:mb-12">
          <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-on-primary)' }}>Mi Cuenta</h1>
          <p className="font-medium opacity-75" style={{ color: 'var(--text-on-primary)' }}>Gestiona tu información personal y preferencias de contacto.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Avatar and Summary */}
          <div className="space-y-6">
            <div className="rounded-[24px] border p-5 sm:p-8 text-center shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center font-extrabold text-[32px] mx-auto mb-6 shadow-sm"
                style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
              >
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-[18px] font-extrabold mb-1" style={{ color: 'var(--text-on-secondary)' }}>{user.name}</h3>
              <p className="break-all text-[13px] font-medium mb-2 opacity-70" style={{ color: 'var(--text-on-secondary)' }}>{user.email}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-on-secondary)' }}>
                {user.documentType} {user.documentId}
              </p>
              
              <div className="pt-6 mt-6 border-t flex flex-col gap-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <Button 
                  variant="primary" 
                  fullWidth 
                  className="!py-2 !text-[12px] font-black cursor-pointer" 
                  style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                  onClick={() => onNavigate(View.MY_ORDERS)}
                >
                  Ver mis pedidos
                </Button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-[24px] border p-5 sm:p-8 lg:p-10 shadow-sm space-y-8" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest px-1 flex items-center gap-2 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                      <User size={12} /> Nombre Completo
                    </label>
                    <input 
                      type="text" 
                      value={user.name}
                      disabled
                      className="w-full px-6 py-4 rounded-xl font-medium text-[15px] border cursor-not-allowed opacity-60"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest px-1 flex items-center gap-2 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                      <Shield size={12} /> {user.documentType || 'Documento'}
                    </label>
                    <input 
                      type="text" 
                      value={user.documentId}
                      disabled
                      className="w-full px-6 py-4 rounded-xl font-medium text-[15px] border cursor-not-allowed opacity-60"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.1)' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest px-1 flex items-center gap-2 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                    <Mail size={12} /> Correo Electrónico
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl font-medium text-[15px] border focus:outline-none transition-all font-mono"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest px-1 flex items-center gap-2 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                    <Phone size={12} /> Teléfono Móvil
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-6 py-4 rounded-xl font-medium text-[15px] border focus:outline-none transition-all font-mono"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                    placeholder="+51 999 999 999"
                  />
                </div>
              </div>

              <div className="pt-8 border-t flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="min-h-5">
                  {showSuccess && (
                     <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 font-bold text-[13px]"
                        style={{ color: 'var(--accent-on-secondary)' }}
                     >
                       <CheckCircle2 size={16} /> ¡Datos guardados!
                     </motion.div>
                  )}
                </div>
                <Button 
                  variant="primary" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 sm:px-10 py-4 font-black cursor-pointer shadow-sm" 
                  style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                  disabled={isSaving}
                >
                  {isSaving ? <><Loader2 size={18} className="animate-spin" /> Cargando...</> : <><Save size={18} /> Guardar cambios</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
