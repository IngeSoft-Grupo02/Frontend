/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Ruler, Shield, Sparkles, RefreshCw, FileText } from 'lucide-react';
import { Store, User, Product, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';

interface ProductDetailProps {
  store: Store;
  user: User | null;
  product: Product;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  cartCount: number;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ store, user, product, onNavigate, onLogout, cartCount }) => {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} showSearch={false} cartCount={cartCount} />
      
      <div className="max-w-7xl mx-auto px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Product Images Mock */}
          <div className="flex-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-3xl flex items-center justify-center p-20 border"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-primary)',
                borderColor: 'rgba(0,0,0,0.08)'
              }}
            >
               <FileText size={180} style={{ color: 'var(--text-on-primary)', opacity: 0.25 }} />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className="aspect-square border rounded-xl cursor-pointer transition-colors hover:scale-105"
                  style={{
                    backgroundColor: i % 3 === 0 ? 'var(--color-primary)' : i % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)',
                    borderColor: 'rgba(0,0,0,0.08)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-black"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--text-on-secondary)'
                }}
              >
                {store.name} Premium
              </span>
              <span className="opacity-40">/</span>
              <span className="text-[12px] font-medium uppercase tracking-widest opacity-60">{product.id}</span>
            </div>

            <h1 className="text-[42px] font-extrabold leading-tight mb-4" style={{ color: '#0F1011' }}>{product.name}</h1>
            <p className="text-[18px] font-medium mb-10 leading-relaxed" style={{ color: '#475569' }}>
              {product.description}
            </p>

            <div 
              className="rounded-2xl border p-8 mb-10 space-y-8"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--text-on-secondary)',
                borderColor: 'rgba(0,0,0,0.05)'
              }}
            >
              <div className="flex justify-between items-end border-b pb-6" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest block mb-1 opacity-60">Precio por unidad</span>
                  <span className="text-[32px] font-extrabold" style={{ color: 'var(--text-on-secondary)' }}>S/ {product.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest block mb-3 opacity-60">Tallas disponibles</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <span 
                        key={size} 
                        className="w-10 h-10 rounded-lg border flex items-center justify-center text-[12px] font-black"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--text-on-primary)',
                          borderColor: 'rgba(0,0,0,0.05)'
                        }}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest block mb-3 opacity-60">Colores disponibles</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <div 
                        key={color} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--text-on-primary)',
                          borderColor: 'rgba(0,0,0,0.05)'
                        }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full border border-black/10" 
                          style={{ backgroundColor: color === 'BLANCO' ? '#FFFFFF' : color === 'NEGRO' ? '#000000' : color === 'ROJO' ? '#EF4444' : color === 'AZUL' ? '#3B82F6' : color === 'VERDE' ? '#10B981' : '#CCCCCC' }} 
                        />
                        <span className="text-[10px] font-black uppercase">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-gray-400">
                       <Ruler size={20} style={{ color: 'var(--text-on-secondary)', opacity: 0.6 }} />
                    </div>
                    <div>
                       <div className="text-[12px] font-bold mb-1">Guía de tallas</div>
                       <button className="text-[11px] font-bold uppercase tracking-widest hover:underline cursor-pointer" style={{ color: 'var(--accent-on-secondary)' }}>Ver medidas</button>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-gray-400">
                       <Shield size={20} style={{ color: 'var(--text-on-secondary)', opacity: 0.6 }} />
                    </div>
                    <div>
                       <div className="text-[12px] font-bold mb-1">Certificación</div>
                       <p className="text-[11px] opacity-75">Algodón Certificado</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex gap-4">
               <Button 
                  variant="primary" 
                  className="flex-1 py-5 cursor-pointer font-black transition-all" 
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                    color: 'var(--text-on-tertiary)',
                    borderColor: 'transparent'
                  }}
                  onClick={() => {
                    if (!user) {
                      onNavigate(View.AUTH_LOGIN);
                    } else {
                      onNavigate(View.REQUEST_QUOTE);
                    }
                  }}
               >
                  Solicitar cotización
               </Button>
               <Button 
                  variant="secondary" 
                  className="aspect-square p-0 flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--text-on-secondary)',
                    borderColor: 'rgba(0,0,0,0.1)'
                  }}
               >
                  <Sparkles size={20} />
               </Button>
            </div>

            {/* Extra Specs */}
            <div className="mt-12 space-y-6 pt-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
               <div className="flex gap-4">
                  <RefreshCw size={20} className="shrink-0 opacity-45" />
                  <p className="text-[13px] font-medium" style={{ color: '#475569' }}>
                     **Producción por demanda:** El tiempo estimado de fabricación tras aprobación de cotización es de 12 a 15 días hábiles.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
