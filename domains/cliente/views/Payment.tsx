/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle2, Lock, Info, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Store, User, Order, View } from '../types';
import { payOrder } from '../lib/api';
import { messageFromError } from '../../shared/errors';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';

type ReceiptType = 'BOLETA' | 'FACTURA';

interface PaymentProps {
  store: Store;
  user: User | null;
  order: Order;
  customerToken: string | null;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  cartCount: number;
  onPaymentCompleted?: () => Promise<void> | void;
}

export const Payment: React.FC<PaymentProps> = ({ store, user, order, customerToken, onNavigate, onLogout, cartCount, onPaymentCompleted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [receiptType, setReceiptType] = useState<ReceiptType>('BOLETA');
  const [ruc, setRuc] = useState('');
  const [rucError, setRucError] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const cleanCard = cardNumber.replace(/\s/g, '');

  const rucValid = receiptType === 'BOLETA' || ruc.length === 11;

  const isFormValid = () => {
    const isVisa = cleanCard.startsWith('4');
    const hasCard = cleanCard.length === 16 && isVisa;
    const hasExpiry = /^\d{2}\s\/\s\d{2}$/.test(expiry);
    const hasCvc = /^\d{3}$/.test(cvc);
    const hasName = cardName.trim().length > 2;
    return hasCard && hasExpiry && hasCvc && hasName && rucValid;
  };

  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
    setRuc(val);
    setRucError(null);
  };

  const handleRucBlur = () => {
    if (receiptType === 'FACTURA' && ruc.length > 0 && ruc.length < 11) {
      setRucError('El RUC debe tener exactamente 11 dígitos.');
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    setCardNumber(val.replace(/(\d{4})(?=\d)/g, '$1 '));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    setExpiry(val.length >= 2 ? `${val.substring(0, 2)} / ${val.substring(2)}` : val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value.replace(/\D/g, '').substring(0, 3));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    if (!customerToken || !store.slug || !order.realId) {
      setPaymentError('No se pudo iniciar el pago. Inténtalo nuevamente.');
      return;
    }
    if (!receiptType) {
      setPaymentError('El tipo de comprobante es obligatorio.');
      return;
    }
    if (receiptType === 'FACTURA' && ruc.length !== 11) {
      setRucError('El RUC debe tener exactamente 11 dígitos.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const expiryForBackend = expiry.replace(/\s/g, '');

    try {
      await payOrder(store.slug, customerToken, order.realId, {
        paymentMethod: 'VIRTUAL',
        receiptType,
        cardNumber: cleanCard,
        cardHolder: cardName.trim(),
        expiryDate: expiryForBackend,
        cvv: cvc,
        ruc: receiptType === 'FACTURA' ? ruc : undefined,
      });
      await onPaymentCompleted?.();
      setIsSuccess(true);
    } catch (err) {
      setPaymentError(messageFromError(err, 'No se pudo registrar el pago. Inténtalo nuevamente.'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen transition-colors duration-300 flex flex-col" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
        <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.PAYMENT} />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full rounded-[40px] border p-16 text-center shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
          >
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}>
                <CheckCircle2 size={56} strokeWidth={2.5} />
              </div>
              <h2 className="text-[42px] font-black mb-4 tracking-tighter" style={{ color: 'var(--text-on-secondary)' }}>¡Pago Registrado!</h2>
              <div className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl border mb-10" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60" style={{ color: 'var(--text-on-primary)' }}>Pedido N°:</span>
                <span className="text-[20px] font-black tracking-tight" style={{ color: 'var(--accent-on-primary)' }}>{order.id}</span>
              </div>
              <p className="text-[18px] font-bold mb-12 max-w-sm mx-auto leading-snug opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                Pago registrado correctamente. Tu pedido está siendo procesado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Button
                  variant="primary"
                  fullWidth
                  className="py-5 text-[15px] font-black shadow-xl cursor-pointer"
                  style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                  onClick={() => onNavigate(View.MY_ORDERS)}
                >
                  Ver mis pedidos
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

  const total = order.finalTotal ?? order.amount;
  const subtotal = order.partialTotal ?? total / 1.18;
  const discount = order.totalDiscount ?? 0;
  const igv = total - (subtotal - discount);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} currentView={View.PAYMENT} />

      <div className="max-w-6xl mx-auto px-10 py-12">
        <button
          onClick={() => onNavigate(View.MY_ORDERS)}
          className="flex items-center gap-2 text-[13px] font-bold transition-colors mb-10 cursor-pointer"
          style={{ color: '#475569' }}
        >
          <ArrowLeft size={16} /> Volver a mis pedidos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulario de pago */}
          <div className="lg:col-span-2 space-y-8">
            <header className="mb-8">
              <h1 className="text-[34px] font-extrabold mb-2" style={{ color: '#0F1011' }}>Pasarela de Pago</h1>
              <p className="font-medium opacity-75" style={{ color: '#475569' }}>Conexión cifrada de extremo a extremo.</p>
            </header>

            {paymentError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700"
              >
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p className="text-[13px] font-bold">{paymentError}</p>
              </motion.div>
            )}

            <form
              id="payment-form"
              className="rounded-3xl border p-10 shadow-sm space-y-8"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
              onSubmit={handlePayment}
            >
              {/* Tipo de comprobante */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                  Tipo de Comprobante
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['BOLETA', 'FACTURA'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { setReceiptType(type); setRucError(null); setPaymentError(null); }}
                      className="py-4 px-6 rounded-2xl border-2 transition-all font-black text-[14px] flex items-center justify-center gap-3 cursor-pointer"
                      style={{
                        borderColor: receiptType === type ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.1)',
                        backgroundColor: receiptType === type ? 'var(--color-primary)' : 'var(--color-secondary)',
                        color: 'var(--text-on-secondary)',
                      }}
                    >
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: receiptType === type ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.2)' }}>
                        {receiptType === type && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-tertiary)' }} />}
                      </div>
                      {type === 'BOLETA' ? 'Boleta de Venta' : 'Factura'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campo RUC solo para factura */}
              {receiptType === 'FACTURA' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                    Número de RUC
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ingrese los 11 dígitos de su RUC"
                    value={ruc}
                    maxLength={11}
                    onChange={handleRucChange}
                    onBlur={handleRucBlur}
                    className="w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none transition-all font-mono"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)',
                      borderColor: rucError ? '#ef4444' : 'rgba(0,0,0,0.05)',
                    }}
                  />
                  {rucError ? (
                    <p className="text-[11px] text-red-500 font-bold px-1">{rucError}</p>
                  ) : (
                    <p className="text-[10px] font-bold px-1 flex items-center gap-1" style={{ color: 'var(--accent-on-secondary)' }}>
                      <Info size={12} /> Para emitir Factura es necesario un RUC válido de 11 dígitos.
                    </p>
                  )}
                </motion.div>
              )}

              {/* Separador tarjeta */}
              <div className="flex items-center justify-between p-6 rounded-2xl border" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                    <CreditCard size={24} style={{ color: 'var(--accent-on-secondary)' }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-black" style={{ color: 'var(--text-on-primary)' }}>Tarjeta VISA</p>
                    <p className="text-[11px] font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--text-on-primary)' }}>Única tarjeta de pago aceptada</p>
                  </div>
                </div>
                <div className="h-8 w-12 bg-[#1A1F71] rounded-md flex items-center justify-center">
                  <span className="text-white font-black text-[10px] italic">VISA</span>
                </div>
              </div>

              {/* Número de tarjeta */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest flex items-center justify-between px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                  Número de Tarjeta
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">SÓLO VISA (EMPIEZA CON 4)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-6 py-4 rounded-xl font-black text-[16px] border transition-all font-mono focus:outline-none"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)',
                      borderColor: cleanCard.length > 0 && !cleanCard.startsWith('4') ? '#ef4444' : 'rgba(0,0,0,0.05)',
                    }}
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    {cleanCard.startsWith('4') && cleanCard.length === 16 && <CheckCircle2 size={18} className="text-green-500" />}
                    <Lock size={14} className="opacity-40" style={{ color: 'var(--text-on-primary)' }} />
                  </div>
                </div>
                {cleanCard.length > 0 && !cleanCard.startsWith('4') && (
                  <p className="text-[10px] text-red-500 font-bold px-1">La tarjeta ingresada no es VISA. Por favor usa una tarjeta válida.</p>
                )}
              </div>

              {/* Vencimiento y CVV */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Vencimiento</label>
                  <input
                    type="text"
                    placeholder="MM / AA"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full px-6 py-4 rounded-xl font-black text-[16px] border focus:outline-none transition-all font-mono"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>CVC / CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cvc}
                    onChange={handleCvcChange}
                    className="w-full px-6 py-4 rounded-xl font-black text-[16px] border focus:outline-none transition-all font-mono"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                    required
                  />
                </div>
              </div>

              {/* Titular */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Titular de la tarjeta</label>
                <input
                  type="text"
                  placeholder="NOMBRE COMO APARECE EN LA TARJETA"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none transition-all uppercase"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                  required
                />
              </div>

              <div className="pt-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter">
                    <Lock size={14} className="text-emerald-500" /> Pago Seguro
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter">
                    <ShieldCheck size={14} className="text-blue-500" /> Cifrado SSL
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter">
                    <CheckCircle2 size={14} style={{ color: 'var(--accent-on-secondary)' }} /> Verificado por Visa
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Resumen del pedido */}
          <aside>
            <div className="rounded-3xl border p-8 sticky top-[100px] shadow-lg" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
              <h3 className="text-[18px] font-extrabold mb-6 flex items-center gap-2">
                <ShoppingBag size={20} style={{ color: 'var(--accent-on-secondary)' }} /> Resumen del pedido
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[14px]">
                  <span className="font-medium opacity-75">Pedido N°:</span>
                  <span className="font-bold">#{order.id}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="font-medium opacity-75">Producto:</span>
                  <span className="font-bold text-right max-w-[140px] leading-tight">{order.productName}</span>
                </div>

                {/* Ítems del pedido */}
                {order.itemsDetail && order.itemsDetail.length > 0 && (
                  <div className="pt-2 space-y-2">
                    {order.itemsDetail.map((item, idx) => (
                      <div key={idx} className="text-[12px] rounded-lg p-3 border" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                        <div className="font-bold">{item.productName}</div>
                        <div className="opacity-70">{item.quantity} u. × S/ {item.unitPrice.toFixed(2)} = S/ {item.subTotal.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4 space-y-2" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <div className="flex justify-between text-[13px]">
                    <span className="font-medium opacity-75">Subtotal:</span>
                    <span className="font-bold">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="font-medium opacity-75">Descuento:</span>
                      <span className="font-bold" style={{ color: 'var(--accent-on-secondary)' }}>- S/ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[13px]">
                    <span className="font-medium opacity-75">IGV (18%):</span>
                    <span className="font-bold">S/ {igv.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-end mb-6">
                    <span className="text-[12px] font-extrabold uppercase">Total a Pagar</span>
                    <span className="text-[28px] font-extrabold leading-tight">S/ {total.toFixed(2)}</span>
                  </div>

                  <Button
                    form="payment-form"
                    type="submit"
                    variant="primary"
                    fullWidth
                    className={`py-5 text-[16px] font-black shadow-xl transition-all ${!isFormValid() ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                    style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                    disabled={isProcessing || !isFormValid()}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3 justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Procesando pago...
                      </div>
                    ) : 'Confirmar pago'}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
