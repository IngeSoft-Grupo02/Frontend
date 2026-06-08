'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card, Input } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import {
    AlertCircle,
    Bell,
    Check,
    Edit3,
    Palette,
    Percent,
    Plus,
    Save,
    Store,
    Trash2,
    Upload,
    Users,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Constante tipada para los incrementos
const INCREMENT_VALUES = [5, 10, 15] as const;
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

const onlyDigits = (value: string) => value.replace(/\D/g, '').slice(0, 15);
const isValidHexColor = (value: string) => HEX_COLOR_REGEX.test(value);

export default function SettingsPage() {
  const { store, saveStore } = useStore();
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'notifications' | 'team'>('general');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // General Settings
  const [storeName, setStoreName] = useState(store.name);
  const [storeType, setStoreType] = useState(store.type);
  const [storeDescription, setStoreDescription] = useState(store.description || '');
  const [customizationIncrement, setCustomizationIncrement] = useState<5 | 10 | 15>(store.customizationIncrement || 10);

  // Contact Info
  const [email, setEmail] = useState(store.contactEmail || '');
  const [phone, setPhone] = useState(store.contactPhone || '');
  const [address, setAddress] = useState(store.address || '');
  const [website, setWebsite] = useState(store.website || '');

  // Branding
  const [primaryColor, setPrimaryColor] = useState(store.palette || '#000000');
  const [secondaryColor, setSecondaryColor] = useState('#B2956D');
  const [accentColor, setAccentColor] = useState('#5D634B');

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [quoteAlerts, setQuoteAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // Team
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'María Cantillo', role: 'Administrador', email: 'maria@studio47.pe', status: 'Activo' },
    { id: '2', name: 'Carlos Mendoza', role: 'Editor', email: 'carlos@studio47.pe', status: 'Activo' },
    { id: '3', name: 'Ana Torres', role: 'Visualizador', email: 'ana@studio47.pe', status: 'Inactivo' }
  ]);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  useEffect(() => {
    setStoreName(store.name);
    setStoreType(store.type);
    setStoreDescription(store.description || '');
    setCustomizationIncrement(store.customizationIncrement || 10);
    setEmail(store.contactEmail || '');
    setPhone(store.contactPhone || '');
    setAddress(store.address || '');
    setWebsite(store.website || '');
    setPrimaryColor(store.palette || '#000000');
  }, [store]);

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!storeName.trim()) newErrors.storeName = 'El nombre de la tienda es obligatorio';
    if (email && !EMAIL_REGEX.test(email)) newErrors.email = 'Formato de correo inválido';
    if (website && !WEBSITE_REGEX.test(website)) newErrors.website = 'Formato de sitio web inválido';
    if (!isValidHexColor(primaryColor)) newErrors.primaryColor = 'Color primario inválido';
    if (!isValidHexColor(secondaryColor)) newErrors.secondaryColor = 'Color secundario inválido';
    if (!isValidHexColor(accentColor)) newErrors.accentColor = 'Color de acento inválido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await saveStore({
      ...store,
      name: storeName.trim(),
      type: storeType,
      description: storeDescription.trim(),
      customizationIncrement: customizationIncrement,
      palette: primaryColor,
      contactEmail: email.trim(),
      contactPhone: phone,
      address: address.trim(),
      website: website.trim()
      });

      setErrors({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors({ storeName: error instanceof Error ? error.message : 'No se pudo guardar la tienda' });
    }
  };

  const handleInviteMember = () => {
    const newErrors: Record<string, string> = {};

    if (!inviteName.trim()) newErrors.inviteName = 'El nombre es obligatorio';
    if (!inviteEmail.trim()) newErrors.inviteEmail = 'El correo es obligatorio';
    else if (!EMAIL_REGEX.test(inviteEmail)) newErrors.inviteEmail = 'Formato de correo inválido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    setTeamMembers(prev => [
      ...prev,
      {
        id: `${Date.now()}`,
        name: inviteName.trim(),
        role: inviteRole,
        email: inviteEmail.trim(),
        status: 'Activo'
      }
    ]);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Editor');
    setErrors(prev => ({ ...prev, inviteName: '', inviteEmail: '' }));
  };

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Store },
    { id: 'branding' as const, label: 'Branding', icon: Palette },
    { id: 'notifications' as const, label: 'Notificaciones', icon: Bell },
    { id: 'team' as const, label: 'Equipo', icon: Users }
  ];

  return (
    <MerchantLayout title="Configuración" subtitle="Personaliza tu tienda y gestiona permisos">
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Panel de Control</p>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">Ajustes del Sistema</h1>
            <p className="text-brand-text-muted text-[15px] font-bold max-w-2xl leading-relaxed">
              Configura los parámetros operativos, visuales y de seguridad de tu tienda.
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
              <p className="text-[13px] font-bold text-green-700">La configuración se ha actualizado correctamente.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 bg-brand-neutral-mid/20 p-2 rounded-[24px] border border-brand-neutral-border w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* General Tab */}
            {activeTab === 'general' && (
              <>
                <Card title="Información de la Tienda" subtitle="Datos básicos de tu negocio">
                  <div className="space-y-6">
                    <Input
                      label="Nombre de la tienda"
                      value={storeName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setStoreName(e.target.value);
                        if (errors.storeName) setErrors({ ...errors, storeName: '' });
                      }}
                      error={errors.storeName}
                      className="h-14 rounded-2xl font-bold"
                    />
                    <div>
                      <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2 block">Tipo de tienda</label>
                      <select
                        value={storeType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStoreType(e.target.value)}
                        className="w-full h-14 bg-white border border-brand-neutral-border rounded-2xl px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center', backgroundSize: '1.2rem' }}
                      >
                        <option>Urbano</option>
                        <option>Casual</option>
                        <option>Premium</option>
                        <option>Deportivo</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2 block">Descripción</label>
                      <textarea
                        value={storeDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStoreDescription(e.target.value)}
                        rows={4}
                        placeholder="Describe tu tienda..."
                        className="w-full bg-white border border-brand-neutral-border rounded-2xl px-5 py-4 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all resize-none"
                      />
                    </div>
                  </div>
                </Card>

                <Card title="Incremento por Personalización" subtitle="Configura el porcentaje adicional">
                  <div className="space-y-6">
                    <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em]">Porcentaje de incremento</label>
                    <div className="grid grid-cols-3 gap-4">
                      {INCREMENT_VALUES.map((val) => (
                        <div
                          key={val}
                          onClick={() => setCustomizationIncrement(val)}
                          className={`p-8 border-2 rounded-4xl cursor-pointer text-center transition-all ${
                            customizationIncrement === val ? 'border-brand-black bg-brand-neutral-mid shadow-inner' : 'border-brand-neutral-border hover:border-brand-black'
                          }`}
                        >
                          <h4 className="text-[32px] font-black">{val}%</h4>
                          <p className="text-[10px] font-black text-brand-text-muted uppercase mt-1">Incremento</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                      <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-[12px] font-bold text-blue-800 leading-relaxed">
                        Este porcentaje se aplicará automáticamente a todos los pedidos que incluyan personalización o archivos adjuntos.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card title="Información de Contacto" subtitle="Datos de contacto de la tienda">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Correo electrónico"
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
                    <Input
                      label="Dirección"
                      value={address}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                      className="h-14 rounded-2xl font-bold"
                    />
                    <Input
                      label="Sitio web"
                      type="url"
                      value={website}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setWebsite(e.target.value);
                        if (errors.website) setErrors({ ...errors, website: '' });
                      }}
                      error={errors.website}
                      className="h-14 rounded-2xl font-bold"
                    />
                  </div>
                </Card>
              </>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <>
                <Card title="Paleta de Colores" subtitle="Personaliza los colores de tu tienda">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em]">Color Primario</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={isValidHexColor(primaryColor) ? primaryColor : '#000000'}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-20 h-20 rounded-2xl border-2 border-brand-neutral-border cursor-pointer"
                          />
                          <div className="flex-1">
                            <Input
                              value={primaryColor}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setPrimaryColor(e.target.value);
                                if (errors.primaryColor) setErrors({ ...errors, primaryColor: '' });
                              }}
                              error={errors.primaryColor}
                              className="h-12 rounded-xl font-mono font-bold"
                            />
                            <p className="text-[10px] font-bold text-brand-text-muted uppercase mt-1">Color principal de la marca</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em]">Color Secundario</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={isValidHexColor(secondaryColor) ? secondaryColor : '#000000'}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-20 h-20 rounded-2xl border-2 border-brand-neutral-border cursor-pointer"
                          />
                          <div className="flex-1">
                            <Input
                              value={secondaryColor}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSecondaryColor(e.target.value);
                                if (errors.secondaryColor) setErrors({ ...errors, secondaryColor: '' });
                              }}
                              error={errors.secondaryColor}
                              className="h-12 rounded-xl font-mono font-bold"
                            />
                            <p className="text-[10px] font-bold text-brand-text-muted uppercase mt-1">Acentos y detalles</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em]">Color de Acento</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={isValidHexColor(accentColor) ? accentColor : '#000000'}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-20 h-20 rounded-2xl border-2 border-brand-neutral-border cursor-pointer"
                          />
                          <div className="flex-1">
                            <Input
                              value={accentColor}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setAccentColor(e.target.value);
                                if (errors.accentColor) setErrors({ ...errors, accentColor: '' });
                              }}
                              error={errors.accentColor}
                              className="h-12 rounded-xl font-mono font-bold"
                            />
                            <p className="text-[10px] font-bold text-brand-text-muted uppercase mt-1">Botones y CTAs</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-brand-neutral-light p-8 rounded-3xl border-2 border-brand-neutral-border">
                      <h4 className="text-[12px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Vista Previa</h4>
                      <div className="space-y-4">
                        <div className="h-20 rounded-2xl" style={{ backgroundColor: primaryColor }}></div>
                        <div className="flex gap-4">
                          <div className="flex-1 h-16 rounded-2xl" style={{ backgroundColor: secondaryColor }}></div>
                          <div className="flex-1 h-16 rounded-2xl" style={{ backgroundColor: accentColor }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Logo de la Tienda" subtitle="Sube el logo de tu marca">
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 bg-brand-neutral-light border-2 border-dashed border-brand-neutral-border rounded-3xl flex items-center justify-center">
                        <Store size={48} className="text-brand-text-muted opacity-30" />
                      </div>
                      <div className="space-y-3">
                        <Button variant="outline" className="gap-2">
                          <Upload size={18} /> Subir logo
                        </Button>
                        <p className="text-[11px] font-bold text-brand-text-muted">PNG, JPG o SVG. Máximo 2MB.</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card title="Preferencias de Notificaciones" subtitle="Configura cómo recibir alertas">
                <div className="space-y-6">
                  {[
                    { label: 'Notificaciones por correo', desc: 'Recibe actualizaciones importantes por email', value: emailNotifications, onChange: setEmailNotifications },
                    { label: 'Actualizaciones de pedidos', desc: 'Alertas cuando cambie el estado de un pedido', value: orderUpdates, onChange: setOrderUpdates },
                    { label: 'Alertas de cotizaciones', desc: 'Notificaciones de nuevas cotizaciones', value: quoteAlerts, onChange: setQuoteAlerts },
                    { label: 'Reporte semanal', desc: 'Resumen semanal de actividad', value: weeklyReport, onChange: setWeeklyReport }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-brand-neutral-light rounded-2xl border border-brand-neutral-border">
                      <div className="flex-1">
                        <h4 className="text-[15px] font-black text-brand-black mb-1">{item.label}</h4>
                        <p className="text-[12px] font-bold text-brand-text-muted">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.onChange(!item.value)}
                        className={`w-14 h-8 rounded-full transition-all relative ${
                          item.value ? 'bg-brand-black' : 'bg-brand-neutral-border'
                        }`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                          item.value ? 'left-7' : 'left-1'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <>
                <Card title="Miembros del Equipo" subtitle="Gestiona los usuarios de tu tienda">
                  <div className="space-y-4">
                    {teamMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-6 bg-brand-neutral-light rounded-2xl border border-brand-neutral-border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-brand-black rounded-full flex items-center justify-center text-white font-black text-[14px]">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-[15px] font-black text-brand-black">{member.name}</h4>
                            <p className="text-[12px] font-bold text-brand-text-muted">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={member.status === 'Activo' ? 'success' : 'outline'} className="font-black">
                            {member.status}
                          </Badge>
                          <Badge variant="outline" className="font-bold">
                            {member.role}
                          </Badge>
                          <button className="p-2 hover:bg-white rounded-lg transition-colors">
                            <Edit3 size={16} className="text-brand-text-muted" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Invitar Nuevo Miembro" subtitle="Agrega usuarios al equipo">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nombre completo"
                        placeholder="Juan Pérez"
                        value={inviteName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setInviteName(e.target.value);
                          if (errors.inviteName) setErrors({ ...errors, inviteName: '' });
                        }}
                        error={errors.inviteName}
                        className="h-14 rounded-2xl font-bold"
                      />
                      <Input
                        label="Correo electrónico"
                        type="email"
                        placeholder="juan@studio47.pe"
                        value={inviteEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setInviteEmail(e.target.value);
                          if (errors.inviteEmail) setErrors({ ...errors, inviteEmail: '' });
                        }}
                        error={errors.inviteEmail}
                        className="h-14 rounded-2xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2 block">Rol</label>
                      <select
                        value={inviteRole}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInviteRole(e.target.value)}
                        className="w-full h-14 bg-white border border-brand-neutral-border rounded-2xl px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center', backgroundSize: '1.2rem' }}
                      >
                        <option>Administrador</option>
                        <option>Editor</option>
                        <option>Visualizador</option>
                      </select>
                    </div>
                    <Button type="button" onClick={handleInviteMember} className="w-full h-14 gap-3 rounded-2xl font-black">
                      <Plus size={20} /> Enviar invitación
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-8">
            <Card title="Acciones Rápidas" className="!p-8">
              <div className="space-y-4">
                <Button onClick={handleSave} className="w-full h-14 gap-3 rounded-2xl font-black shadow-xl shadow-brand-black/20">
                  <Save size={20} /> Guardar cambios
                </Button>
                <Button variant="outline" className="w-full h-14 gap-3 rounded-2xl font-black">
                  <X size={20} /> Cancelar
                </Button>
              </div>
            </Card>

            <Card title="Información del Plan" className="!p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Plan actual</span>
                  <Badge variant="success" className="font-black">Premium</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Expiración</span>
                  <span className="text-[14px] font-black text-brand-black">31 Dic 2026</span>
                </div>
                <div className="pt-4 border-t border-brand-neutral-border">
                  <Button variant="camel" className="w-full h-12 gap-2 rounded-xl font-black">
                    <Percent size={18} /> Mejorar plan
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}
