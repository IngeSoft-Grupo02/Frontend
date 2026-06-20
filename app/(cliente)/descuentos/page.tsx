'use client';

import React, { useState } from 'react';
import { useApp } from '@/domains/cliente/context/AppContext';
import { TopBar } from '@/domains/cliente/components/layout/TopBar';
import { Button } from '@/domains/cliente/components/ui/Button';
import { Ticket, Gift, Check, Flame, Percent } from 'lucide-react';

export default function DescuentosPage() {
  const { selectedStore, currentUser, cartItems } = useApp();
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const coupons = [
    { code: 'CORP15', discount: '15% Desc.', desc: 'Para primeros pedidos mayores a 100 unidades.', tag: 'Mayorista' },
    { code: 'VERANO26', discount: '20% Desc.', desc: 'Válido para camisas y casacas seleccionadas.', tag: 'Estacional' },
    { code: 'DISEÑO_GRATIS', discount: 'Molde Libre', desc: 'Bonificación de tarifa de patronaje integral.', tag: 'Premium' },
  ];

  const dealProducts = [
    { name: 'Polo Algodón Premium Orgánico', price: 'S/. 35.00', origPrice: 'S/. 49.00', discount: '-30%', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60' },
    { name: 'Casaca Sastrera Minimalista', price: 'S/. 120.00', origPrice: 'S/. 175.00', discount: '-31%', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60' },
    { name: 'Pantalón Cargo Algodón Sarga', price: 'S/. 79.00', origPrice: 'S/. 110.00', discount: '-28%', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60' },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div id="descuentos-container" className="min-h-screen bg-[var(--color-primary)] text-[var(--text-on-primary)] transition-all duration-300">
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

      <main id="descuentos-main" className="max-w-5xl mx-auto px-4 py-12">
        <div id="descuentos-header" className="mb-10 text-center">
          <span className="px-3 py-1 text-xs font-mono tracking-widest uppercase rounded-full bg-[var(--color-tertiary)] text-[var(--text-on-tertiary)] mb-3 inline-block">
            Promociones de Temporada
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight font-sans">
            Beneficios Exclusivos
          </h1>
          <p className="text-[var(--text-on-primary)] opacity-75 mt-1 text-sm max-w-md mx-auto">
            Cupos de descuento y bonificaciones activadas para pedidos corporativos y clientes regulares.
          </p>
        </div>

        {/* Coupons section */}
        <div id="coupons-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {coupons.map((coupon, idx) => (
            <div key={idx} className="relative p-6 bg-white/5 border border-dashed border-white/20 hover:border-white/35 rounded-2xl flex flex-col justify-between transition-all">
              <span className="absolute top-4 right-4 bg-white/10 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase font-extrabold">
                {coupon.tag}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-5 h-5 text-[var(--color-tertiary)]" />
                  <span className="text-lg font-black tracking-tight font-sans text-[var(--color-tertiary)]">{coupon.discount}</span>
                </div>
                <h4 className="text-sm font-bold tracking-tight mb-1 font-mono uppercase bg-white/5 inline-block px-2.5 py-1 rounded-md text-white">{coupon.code}</h4>
                <p className="text-xs text-[var(--text-on-primary)] opacity-70 mt-2 font-sans">{coupon.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <Button
                  id={`copy-btn-${coupon.code}`}
                  variant={copiedCoupon === coupon.code ? 'secondary' : 'primary'}
                  className="w-full text-xs py-2"
                  onClick={() => handleCopy(coupon.code)}
                >
                  {copiedCoupon === coupon.code ? (
                    <span className="flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> Copiado</span>
                  ) : (
                    'Copiar Cupón'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Showcase products on offer */}
        <div id="deals-showcase" className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-[var(--color-tertiary)] animate-pulse" />
            <h3 className="text-xl font-bold font-sans">Ofertas de Ropa Más Cotizadas</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealProducts.map((p, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                <div className="relative h-44 bg-neutral-900 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-rose-500 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Percent className="w-3.5 h-3.5" /> {p.discount}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold font-sans line-clamp-1 text-white">{p.name}</h4>
                    <p className="text-xs text-[var(--text-on-primary)] opacity-60 mt-1">Suministro de fibras y moldaje garantizado.</p>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4 pt-4 border-t border-white/5">
                    <span className="text-lg font-mono font-extrabold text-[var(--color-tertiary)]">{p.price}</span>
                    <span className="text-xs font-mono text-white/50 line-through">{p.origPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
