/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle2, Lock, Info, ShoppingCart, MapPin } from 'lucide-react';
import { Store, User, Quote, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';

interface PaymentProps {
  store: Store;
  user: User | null;
  quote: Quote;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  cartCount: number;
}

export const Payment: React.FC<PaymentProps> = ({ store, user, quote, onNavigate, onLogout, cartCount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [voucherType, setVoucherType] = useState<'boleta' | 'factura'>('boleta');
  const [extraId, setExtraId] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingReference, setShippingReference] = useState('');
  
  // Card states for validation
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const isFormValid = () => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    const isVisa = cleanCard.startsWith('4');
    const hasCorrectLength = cleanCard.length === 16;
    const hasExpiry = /^\d{2}\s\/\s\d{2}$/.test(expiry);
    const hasCvc = /^\d{3}$/.test(cvc);
    const hasName = cardName.trim().length > 3;
    const hasAddress = shippingAddress.trim().length > 5;

    // Check extra IDs if needed
    let hasExtraId = true;
    if (voucherType === 'factura' && user?.documentType !== 'RUC') {
      hasExtraId = extraId.length === 11; // Basic RUC length in Peru
    } else if (voucherType === 'boleta' && user?.documentType === 'RUC') {
      hasExtraId = extraId.length === 8; // Basic DNI length 
    }

    return isVisa && hasCorrectLength && hasExpiry && hasCvc && hasName && hasExtraId && hasAddress;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsProcessing(true);
    // Simulate payment gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length >= 2) {
      setExpiry(`${val.substring(0, 2)} / ${val.substring(2)}`);
    } else {
      setExpiry(val);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value.replace(/\D/g, '').substring(0, 3));
  };

  if (isSuccess) {
    const orderId = Math.floor(100000 + Math.random() * 900000);
    return (
      <div className="min-h-screen transition-colors duration-300 flex flex-col" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
        <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} />
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
              
              <h2 className="text-[42px] font-black mb-4 tracking-tighter" style={{ color: 'var(--text-on-secondary)' }}>¡Pago Satisfactorio!</h2>
              
              <div className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl border mb-10" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60" style={{ color: 'var(--text-on-primary)' }}>N° de Pedido:</span>
                <span className="text-[20px] font-black tracking-tight" style={{ color: 'var(--color-tertiary)' }}>{orderId}</span>
              </div>
              
              <p className="text-[18px] font-bold mb-12 max-w-sm mx-auto leading-snug opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                Tu transacción ha sido validada correctamente. Tu pedido ha sido registrado con éxito.
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

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} cartCount={cartCount} />
      
      <div className="max-w-6xl mx-auto px-10 py-12">
        <button 
          onClick={() => onNavigate(View.QUOTE_DETAIL)}
          className="flex items-center gap-2 text-[13px] font-bold transition-colors mb-10 cursor-pointer"
          style={{ color: '#475569' }}
        >
          <ArrowLeft size={16} /> Volver al detalle
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Payment Gateway Form */}
          <div className="lg:col-span-2 space-y-8">
            <header className="mb-8">
              <h1 className="text-[34px] font-extrabold mb-2" style={{ color: '#0F1011' }}>Pasarela de Pago</h1>
              <p className="font-medium opacity-75" style={{ color: '#475569' }}>Conexión cifrada de extremo a extremo.</p>
            </header>

            <form 
              id="payment-form" 
              className="rounded-3xl border p-10 shadow-sm space-y-8" 
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
              onSubmit={handlePayment}
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Tipo de Comprobante</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setVoucherType('boleta')}
                      className="py-4 px-6 rounded-2xl border-2 transition-all font-black text-[14px] flex items-center justify-center gap-3 cursor-pointer"
                      style={{ 
                        borderColor: voucherType === 'boleta' ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.1)',
                        backgroundColor: voucherType === 'boleta' ? 'var(--color-primary)' : 'var(--color-secondary)',
                        color: 'var(--text-on-secondary)'
                      }}
                    >
                      <div className="w-4 h-4 rounded-full border border-2 flex items-center justify-center" style={{ borderColor: voucherType === 'boleta' ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.2)' }}>
                        {voucherType === 'boleta' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-tertiary)' }} />}
                      </div>
                      Boleta de Venta
                    </button>
                    <button 
                      type="button"
                      onClick={() => setVoucherType('factura')}
                      className="py-4 px-6 rounded-2xl border-2 transition-all font-black text-[14px] flex items-center justify-center gap-3 cursor-pointer"
                      style={{ 
                        borderColor: voucherType === 'factura' ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.1)',
                        backgroundColor: voucherType === 'factura' ? 'var(--color-primary)' : 'var(--color-secondary)',
                        color: 'var(--text-on-secondary)'
                      }}
                    >
                      <div className="w-4 h-4 rounded-full border border-2 flex items-center justify-center" style={{ borderColor: voucherType === 'factura' ? 'var(--color-tertiary)' : 'rgba(0,0,0,0.2)' }}>
                        {voucherType === 'factura' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-tertiary)' }} />}
                      </div>
                      Factura
                    </button>
                  </div>
                </div>

                {/* Conditional Fields based on Voucher and User Data */}
                {(voucherType === 'factura' && user?.documentType !== 'RUC') && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Número de RUC (RUC)</label>
                    <input 
                      type="text" 
                      placeholder="Ingrese los 11 dígitos de su RUC"
                      value={extraId}
                      onChange={(e) => setExtraId(e.target.value.replace(/\D/g, '').substring(0, 11))}
                      className="w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      required
                    />
                    <p className="text-[10px] font-bold px-1 flex items-center gap-1" style={{ color: 'var(--color-tertiary)' }}>
                      <Info size={12} /> Para emitir Factura es necesario un número de RUC válido.
                    </p>
                  </motion.div>
                )}

                {(voucherType === 'boleta' && user?.documentType === 'RUC') && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Número de DNI</label>
                    <input 
                      type="text" 
                      placeholder="Ingrese los 8 dígitos de su DNI"
                      value={extraId}
                      onChange={(e) => setExtraId(e.target.value.replace(/\D/g, '').substring(0, 8))}
                      className="w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      required
                    />
                    <p className="text-[10px] font-bold px-1 flex items-center gap-1" style={{ color: 'var(--color-tertiary)' }}>
                      <Info size={12} /> Su cuenta está registrada con RUC, para Boleta necesitamos un DNI.
                    </p>
                  </motion.div>
                )}

                <div className="pt-6 border-t space-y-6" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <h3 className="text-[14px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--text-on-secondary)' }}>
                    <MapPin size={18} style={{ color: 'var(--color-tertiary)' }} /> Datos de Envío
                  </h3>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Dirección de Envío</label>
                    <input 
                      type="text" 
                      placeholder="Calle, Número, Urbanización, Distrito"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-sans"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Referencia</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Frente al parque, casa color verde, etc."
                      value={shippingReference}
                      onChange={(e) => setShippingReference(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-sans"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl border" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                    <CreditCard size={24} style={{ color: 'var(--color-tertiary)' }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-black" style={{ color: 'var(--text-on-primary)' }}>Tarjeta VISA</p>
                    <p className="text-[11px] font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--text-on-primary)' }}>Única tarjeta de pago aceptada</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-12 bg-[#1A1F71] rounded-md flex items-center justify-center">
                    <span className="text-white font-black text-[10px] italic">VISA</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
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
                        borderColor: cardNumber.length > 0 && !cardNumber.replace(/\s/g, '').startsWith('4') ? '#ef4444' : 'rgba(0,0,0,0.05)'
                      }}
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      {cardNumber.replace(/\s/g, '').startsWith('4') && <CheckCircle2 size={18} className="text-green-500" />}
                      <Lock size={14} className="opacity-40" style={{ color: 'var(--text-on-primary)' }} />
                    </div>
                  </div>
                  {cardNumber.length > 0 && !cardNumber.replace(/\s/g, '').startsWith('4') && (
                    <p className="text-[10px] text-red-500 font-bold px-1">La tarjeta ingresada no es VISA. Por favor use una tarjeta válida.</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                      Vencimiento
                    </label>
                    <input 
                      type="text" 
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="w-full px-6 py-4 rounded-xl font-black text-[16px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                      CVC / CVV
                    </label>
                    <input 
                      type="password" 
                      placeholder="•••"
                      value={cvc}
                      onChange={handleCvcChange}
                      className="w-full px-6 py-4 rounded-xl font-black text-[16px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-mono"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest px-1 opacity-80" style={{ color: 'var(--text-on-secondary)' }}>
                    Titular de la tarjeta
                  </label>
                  <input 
                    type="text" 
                    placeholder="NOMBRE COMO APARECE EN LA TARJETA"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="w-full px-6 py-4 rounded-xl font-black text-[15px] border focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all uppercase"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                    required
                  />
                </div>
              </div>

              <div className="pt-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter">
                    <Lock size={14} className="text-emerald-500" /> Secure Payment
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter">
                    <ShieldCheck size={14} className="text-blue-500" /> SSL Encrypted
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter">
                    <CheckCircle2 size={14} style={{ color: 'var(--color-tertiary)' }} /> Verified by Visa
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <aside>
            <div className="rounded-3xl border p-8 sticky top-[100px] shadow-lg" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
              <h3 className="text-[18px] font-extrabold mb-6 flex items-center gap-2">
                <ShoppingCart size={20} style={{ color: 'var(--color-tertiary)' }} /> Resumen de Compra
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[14px]">
                  <span className="font-medium opacity-75">Producto:</span>
                  <span className="font-bold">{quote.productName}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="font-medium opacity-75">Cantidad:</span>
                  <span className="font-bold">{quote.quantity} uds.</span>
                </div>
                <div className="border-t pt-6 flex flex-col gap-2" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                   <div className="flex justify-between text-[14px]">
                    <span className="font-medium opacity-75">Subtotal:</span>
                    <span className="font-bold">S/ {(quote.amount / 1.18).toFixed(2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="font-medium opacity-75">IGV (18%):</span>
                    <span className="font-bold">S/ {(quote.amount - (quote.amount / 1.18)).toFixed(2).toLocaleString()}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-end mb-8">
                    <span className="text-[12px] font-extrabold uppercase">Total a Pagar</span>
                    <span className="text-[28px] font-extrabold leading-tight">
                      S/ {quote.amount.toLocaleString()}
                    </span>
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
                        Validando...
                      </div>
                    ) : `Pagar con VISA`}
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
