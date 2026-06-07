'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import { Settings, Shield, Bell, MapPin, CheckCircle } from 'lucide-react';

export default function ConfiguracionPage() {
  const { selectedStore, currentUser, cartItems, setCurrentUser } = useApp();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre: currentUser?.name || 'Carlos Mendoza',
    correo: currentUser?.email || 'carlos.mendoza@pucp.edu.pe',
    celular: currentUser?.phone || '998877665',
    direccion: 'Av. El Sol 345, Barranco, Lima',
    distrito: 'Barranco',
    facturarEmpresa: 'No',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    if (currentUser && setCurrentUser) {
      setCurrentUser({
        ...currentUser,
        name: form.nombre,
        email: form.correo,
        phone: form.celular,
      });
    }
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div id="configuracion-container" className="min-h-screen bg-[var(--color-primary)] text-[var(--text-on-primary)] transition-all duration-300 animate-fade-in">
      <TopBar
        store={selectedStore}
        user={currentUser}
        onNavigate={() => {
          window.location.href = '/';
        }}
        onLogout={() => {
          window.location.href = '/iniciar-sesion';
        }}
        cartCount={cartItems.length}
      />

      <main id="configuracion-main" className="max-w-4xl mx-auto px-4 py-12">
        <div id="configuracion-header" className="mb-10 text-left">
          <span className="px-3 py-1 text-xs font-mono tracking-widest uppercase rounded-full bg-[var(--color-tertiary)] text-[var(--text-on-tertiary)] mb-3 inline-block">
            Preferencias de cuenta
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight font-sans">
            Configuración General
          </h1>
          <p className="text-[var(--text-on-primary)] opacity-75 mt-1 text-sm">
            Control de datos del cliente, preferencias de facturación y direcciones de despacho recurrentes.
          </p>
        </div>

        <div id="configuracion-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Side menu */}
          <div className="md:col-span-1 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-left text-sm font-bold border border-white/15 transition-all">
              <Settings className="w-4 h-4 text-[var(--color-tertiary)]" /> Datos del Comprador
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-left text-sm font-medium opacity-75 hover:opacity-100 transition-all">
              <MapPin className="w-4 h-4 text-[var(--color-tertiary)]" /> Direcciones de Envío
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-left text-sm font-medium opacity-75 hover:opacity-100 transition-all">
              <Shield className="w-4 h-4 text-[var(--color-tertiary)]" /> Seguridad y Claves
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-left text-sm font-medium opacity-75 hover:opacity-100 transition-all">
              <Bell className="w-4 h-4 text-[var(--color-tertiary)]" /> Notificaciones WhatsApp
            </button>
          </div>

          {/* Form */}
          <div className="md:col-span-2 p-8 bg-white/5 border border-white/10 rounded-3xl">
            <h3 className="text-lg font-bold mb-6 font-sans border-b border-white/10 pb-4">
              Información del Cliente
            </h3>

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-sm flex items-center gap-2 font-medium font-sans">
                <CheckCircle className="w-4 h-4" /> ¡Configuración guardada satisfactoriamente!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-tertiary)] mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-tertiary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-tertiary)] mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-tertiary)] animate-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-tertiary)] mb-2">Teléfono Móvil</label>
                  <input
                    type="tel"
                    required
                    value={form.celular}
                    onChange={(e) => setForm({ ...form, celular: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-tertiary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-tertiary)] mb-2">¿Facturar corporativamente?</label>
                  <select
                    value={form.facturarEmpresa}
                    onChange={(e) => setForm({ ...form, facturarEmpresa: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none text-white focus:ring-1 focus:ring-[var(--color-tertiary)]"
                  >
                    <option value="No">No, emitir DNI Boleta personal</option>
                    <option value="Si">Sí, emitir Factura por RUC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-tertiary)] mb-2">Dirección Principal Despacho</label>
                <input
                  type="text"
                  required
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-tertiary)]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <Button variant="ghost" type="button" onClick={() => window.location.href = '/'}>
                  Volver
                </Button>
                <Button variant="primary" type="submit">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
