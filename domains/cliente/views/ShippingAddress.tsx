/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';
import { Store, User, Order, View } from '../types';
import { setShippingAddress, toOrder } from '../lib/api';
import { messageFromError } from '../../shared/errors';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';

const DISTRICTS: { value: string; label: string }[] = [
  { value: 'CERCADO_DE_LIMA', label: 'Cercado de Lima' },
  { value: 'ANCON', label: 'Ancón' },
  { value: 'ATE', label: 'Ate' },
  { value: 'BARRANCO', label: 'Barranco' },
  { value: 'BREÑA', label: 'Breña' },
  { value: 'CALLAO', label: 'Callao' },
  { value: 'CARABAYLLO', label: 'Carabayllo' },
  { value: 'CHACLACAYO', label: 'Chaclacayo' },
  { value: 'CHORRILLOS', label: 'Chorrillos' },
  { value: 'CIENEGUILLA', label: 'Cieneguilla' },
  { value: 'COMAS', label: 'Comas' },
  { value: 'INDEPENDENCIA', label: 'Independencia' },
  { value: 'JESUS_MARIA', label: 'Jesús María' },
  { value: 'LA_MOLINA', label: 'La Molina' },
  { value: 'LA_VICTORIA', label: 'La Victoria' },
  { value: 'LINCE', label: 'Lince' },
  { value: 'LOS_OLIVOS', label: 'Los Olivos' },
  { value: 'LURIGANCHO', label: 'Lurigancho' },
  { value: 'LURIN', label: 'Lurín' },
  { value: 'MAGDALENA', label: 'Magdalena' },
  { value: 'MIRAFLORES', label: 'Miraflores' },
  { value: 'PACHACAMAC', label: 'Pachacámac' },
  { value: 'PUCUSANA', label: 'Pucusana' },
  { value: 'PUEBLO_LIBRE', label: 'Pueblo Libre' },
  { value: 'PUENTE_PIEDRA', label: 'Puente Piedra' },
  { value: 'PUNTA_HERMOSA', label: 'Punta Hermosa' },
  { value: 'PUNTA_NEGRA', label: 'Punta Negra' },
  { value: 'RIMAC', label: 'Rímac' },
  { value: 'SAN_BARTOLO', label: 'San Bartolo' },
  { value: 'SAN_BORJA', label: 'San Borja' },
  { value: 'SAN_ISIDRO', label: 'San Isidro' },
  { value: 'SAN_JUAN_DE_LURIGANCHO', label: 'San Juan de Lurigancho' },
  { value: 'SAN_JUAN_DE_MIRAFLORES', label: 'San Juan de Miraflores' },
  { value: 'SAN_LUIS', label: 'San Luis' },
  { value: 'SAN_MARTIN_DE_PORRES', label: 'San Martín de Porres' },
  { value: 'SAN_MIGUEL', label: 'San Miguel' },
  { value: 'SANTA_ANITA', label: 'Santa Anita' },
  { value: 'SANTA_MARIA_DEL_MAR', label: 'Santa María del Mar' },
  { value: 'SURCO', label: 'Surco' },
  { value: 'SURQUILLO', label: 'Surquillo' },
  { value: 'VILLA_EL_SALVADOR', label: 'Villa El Salvador' },
  { value: 'VILLA_MARIA_DEL_TRIUNFO', label: 'Villa María del Triunfo' },
  { value: 'OTRO', label: 'Otro' },
];

interface ShippingAddressProps {
  store: Store;
  user: User | null;
  order: Order;
  customerToken: string | null;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  cartCount: number;
  onShippingCompleted?: (updatedOrder: Order) => void;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({ store, user, order, customerToken, onNavigate, onLogout, cartCount, onShippingCompleted }) => {
  const existing = order.shippingDetail;
  const [address, setAddress] = useState(existing?.address ?? '');
  const [district, setDistrict] = useState(existing?.district ?? '');
  const [reference, setReference] = useState(existing?.reference ?? '');
  const [recipientName, setRecipientName] = useState(existing?.recipientName ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const addressError = touched.address && !address.trim() ? 'La dirección es obligatoria.' : null;
  const districtError = touched.district && !district ? 'Selecciona un distrito.' : null;

  const isFormValid = address.trim().length > 0 && district.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ address: true, district: true });
    if (!isFormValid) return;
    if (!customerToken || !store.slug || !order.realId) {
      setError('No se pudo guardar. Inténtalo nuevamente.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const dto = await setShippingAddress(store.slug, customerToken, order.realId, {
        address: address.trim(),
        district,
        reference: reference.trim() || undefined,
        recipientName: recipientName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      const updatedOrder = toOrder(dto);
      onShippingCompleted?.(updatedOrder);
      setIsSuccess(true);
    } catch (err) {
      setError(messageFromError(err, 'No se pudo guardar la dirección. Inténtalo nuevamente.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen transition-colors duration-300 flex flex-col" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
        <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.SHIPPING_ADDRESS} />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full rounded-[28px] sm:rounded-[40px] border p-8 sm:p-12 lg:p-16 text-center shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
          >
            <div className="relative z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-8 sm:mb-10 shadow-xl" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}>
                <Truck size={48} strokeWidth={2.5} />
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-black mb-4 tracking-tight sm:tracking-tighter" style={{ color: 'var(--text-on-secondary)' }}>¡Dirección Guardada!</h2>
              <p className="text-[16px] sm:text-[18px] font-bold mb-8 sm:mb-12 max-w-sm mx-auto leading-snug opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                Tu dirección de envío se registró correctamente. Tu pedido está en camino.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Button
                  variant="primary"
                  fullWidth
                  className="py-5 text-[15px] font-black shadow-xl cursor-pointer"
                  style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                  onClick={() => onNavigate(View.ORDER_DETAIL)}
                >
                  Ver detalle del pedido
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  className="py-5 text-[15px] font-black border-2 cursor-pointer"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.1)' }}
                  onClick={() => onNavigate(View.CATALOG)}
                >
                  Seguir comprando
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.SHIPPING_ADDRESS} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <button
          onClick={() => onNavigate(View.ORDER_DETAIL)}
          className="flex items-center gap-2 text-[13px] font-bold transition-colors mb-8 sm:mb-10 cursor-pointer"
          style={{ color: '#475569' }}
        >
          <ArrowLeft size={16} /> Volver al pedido
        </button>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={28} style={{ color: 'var(--accent-on-primary, #475569)' }} />
            <h1 className="text-[28px] sm:text-[34px] font-extrabold" style={{ color: '#0F1011' }}>Dirección de Envío</h1>
          </div>
          <p className="font-medium opacity-75 ml-0 sm:ml-[40px]" style={{ color: '#475569' }}>
            Pedido N° {order.id} — Indica dónde quieres recibir tu pedido.
          </p>
        </header>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 mb-6"
          >
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <p className="text-[13px] font-bold">{error}</p>
          </motion.div>
        )}

        <form
          className="rounded-3xl border p-5 sm:p-8 lg:p-10 shadow-sm space-y-6"
          style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
          onSubmit={handleSubmit}
        >
          {/* Dirección */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
              Dirección *
            </label>
            <input
              type="text"
              placeholder="Av. Larco 123, Int. 4B"
              value={address}
              maxLength={255}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => markTouched('address')}
              className="w-full px-6 py-4 rounded-xl font-bold text-[15px] border focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-primary)',
                borderColor: addressError ? '#ef4444' : 'rgba(0,0,0,0.05)',
              }}
            />
            {addressError && <p className="text-[11px] text-red-500 font-bold px-1">{addressError}</p>}
          </div>

          {/* Distrito */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
              Distrito *
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              onBlur={() => markTouched('district')}
              className="w-full px-6 py-4 rounded-xl font-bold text-[15px] border focus:outline-none transition-all appearance-none cursor-pointer"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-primary)',
                borderColor: districtError ? '#ef4444' : 'rgba(0,0,0,0.05)',
              }}
            >
              <option value="">Selecciona un distrito</option>
              {DISTRICTS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            {districtError && <p className="text-[11px] text-red-500 font-bold px-1">{districtError}</p>}
          </div>

          {/* Referencia */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
              Referencia
            </label>
            <input
              type="text"
              placeholder="Frente al parque, cerca de la farmacia"
              value={reference}
              maxLength={500}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-6 py-4 rounded-xl font-bold text-[15px] border focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-primary)',
                borderColor: 'rgba(0,0,0,0.05)',
              }}
            />
          </div>

          {/* Nombre del destinatario */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
              Nombre del destinatario
            </label>
            <input
              type="text"
              placeholder="Ana García López"
              value={recipientName}
              maxLength={150}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-6 py-4 rounded-xl font-bold text-[15px] border focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-primary)',
                borderColor: 'rgba(0,0,0,0.05)',
              }}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
              Teléfono de contacto
            </label>
            <input
              type="tel"
              placeholder="987 654 321"
              value={phone}
              maxLength={20}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-6 py-4 rounded-xl font-bold text-[15px] border focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-primary)',
                borderColor: 'rgba(0,0,0,0.05)',
              }}
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSaving || !isFormValid}
              className="py-5 text-[15px] font-black shadow-xl cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Guardar dirección de envío
                </span>
              )}
            </Button>
          </div>
        </form>

        <p className="text-[12px] font-bold text-center mt-6 opacity-50" style={{ color: '#475569' }}>
          Puedes actualizar tu dirección de envío en cualquier momento desde el detalle del pedido.
        </p>
      </div>
    </div>
  );
};
