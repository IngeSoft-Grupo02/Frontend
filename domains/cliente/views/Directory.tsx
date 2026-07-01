/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Loader2, Mail, MessageCircle } from 'lucide-react';
import { Store, View } from '../types';
import { fetchPublicStores, toStore } from '../lib/api';
import { getReadableMutedTextColor, getReadableTextColor } from '../lib/themeContrast';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { StoreLogo } from '../components/ui/StoreLogo';
import { messageFromError } from '../../shared/errors';

interface DirectoryProps {
  onSelectStore: (store: Store, targetView?: View) => void;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
}

export const Directory: React.FC<DirectoryProps> = ({ onSelectStore, onNavigate, onLogout }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchPublicStores()
      .then((data) => {
        if (!active) return;
        setStores(data.map(toStore));
      })
      .catch((err) => {
        if (!active) return;
        setError(messageFromError(err, 'No se pudieron cargar las tiendas. Intenta nuevamente.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = Array.from(new Set(stores.map((store) => store.category).filter(Boolean)));
  const categoryCounts = categories.reduce<Record<string, number>>((counts, category) => {
    counts[category] = stores.filter(store => store.category === category).length;
    return counts;
  }, {});

  const filteredStores = selectedCategories.length === 0
    ? stores
    : stores.filter(store => selectedCategories.includes(store.category));

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  return (
    <div className="min-h-screen pb-20 transition-colors duration-300 animate-fade-in" style={{ backgroundColor: '#FDFBF7', color: '#0F1011' }}>
      <TopBar store={null} user={null} onNavigate={onNavigate} onLogout={onLogout} showSearch={false} currentView={View.DIRECTORY} />
      
      {/* Hero Section - Minimal & Geometric */}
      <section 
        className="py-20 px-10 relative overflow-hidden border-b text-center md:text-left"
        style={{
          backgroundColor: '#0F1011',
          color: '#FFFFFF',
          borderColor: 'rgba(255,255,255,0.08)'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[48px] font-extrabold leading-tight mb-6"
              style={{ color: '#FFFFFF' }}
            >
              Kingstore: Tu Conexión <br /> Directa con la Moda
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[18px] max-w-xl mb-10 opacity-80"
              style={{ color: '#FFFFFF' }}
            >
              Nuestra visión es democratizar el acceso a productos textiles de alta calidad, conectando a fabricantes independientes directamente con los consumidores. Ofrecemos una plataforma segura y eficiente para descubrir las mejores prendas del mercado.
            </motion.p>
          </div>
          <div className="logo-accent w-48 h-48 grid grid-cols-2 gap-2 opacity-30">
             <div className="bg-olive rounded-lg" />
             <div className="bg-camel rounded-lg" />
             <div className="bg-white/20 rounded-lg" />
             <div className="bg-white/10 rounded-lg" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">
        <aside className="h-fit self-start lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:border-r lg:border-black/10 lg:pr-8">
          <div className="flex items-end justify-between gap-3 pb-4 border-b border-black/10">
            <div>
              <h2 className="text-[22px] font-extrabold tracking-tight">Categorías</h2>
              <p className="text-[12px] font-bold text-neutral-500">{filteredStores.length} de {stores.length} tiendas</p>
            </div>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                className="text-[12px] font-black text-[#B87533] underline underline-offset-4"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="mt-5 space-y-3 max-h-[min(520px,calc(100vh-9rem))] overflow-y-auto pr-2">
            {categories.map((cat) => {
              const checked = selectedCategories.includes(cat);

              return (
                <label
                  key={cat}
                  className="group flex min-h-9 cursor-pointer items-center gap-3 text-[#0F1011]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(cat)}
                    className="peer sr-only"
                  />
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] border transition-all"
                    style={{
                      backgroundColor: checked ? '#0F1011' : '#FFFFFF',
                      borderColor: checked ? '#0F1011' : 'rgba(15,16,17,0.28)'
                    }}
                  >
                    {checked && <span className="h-2.5 w-2.5 rounded-[3px] bg-white" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[15px] font-bold group-hover:text-[#B87533]">
                    {cat}
                  </span>
                  <span className="text-[12px] font-bold text-neutral-400">{categoryCounts[cat] ?? 0}</span>
                </label>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#0F1011]">
              <Loader2 size={32} className="animate-spin opacity-60" />
              <p className="text-[14px] font-semibold opacity-60">Cargando tiendas...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <AlertTriangle size={32} className="text-red-500" />
              <p className="text-[14px] font-semibold text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && filteredStores.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <p className="text-[14px] font-semibold opacity-60">
                {stores.length === 0 ? 'No hay tiendas disponibles por el momento.' : 'No hay tiendas en estas categorías.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredStores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredStores.map((store, i) => {
              const storeBgColor = store.primaryColor || store.color;
              const cardCoverText = getReadableTextColor(storeBgColor);
              const cardCoverSub = getReadableMutedTextColor(storeBgColor);

              return (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="product-card card-premium overflow-hidden group border rounded-[24px] bg-white text-[#0F1011] transition-all hover:shadow-xl hover:-translate-y-0.5 duration-300"
                  style={{
                    borderColor: 'rgba(0,0,0,0.05)'
                  }}
                >
                  <div
                    className="h-32 p-6 flex items-center justify-between relative transition-all group-hover:opacity-95"
                    style={{ backgroundColor: storeBgColor }}
                  >
                    <div className="min-w-0 flex items-center gap-4" style={{ color: cardCoverText }}>
                      <StoreLogo
                        store={store}
                        className="w-12 h-12 rounded-[8px] shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: cardCoverText }}
                        fallbackClassName="font-extrabold text-[18px]"
                        fallbackStyle={{ color: storeBgColor }}
                        objectFit="contain"
                      />
                      <div className="min-w-0">
                        <h3 className="text-[18px] font-extrabold tracking-tight truncate">{store.name}</h3>
                        <span className="block text-[10px] font-black uppercase tracking-widest truncate" style={{ color: cardCoverSub, contentVisibility: 'auto' }}>{store.category}</span>
                      </div>
                    </div>
                    <div className="logo-accent w-8 h-8 grid grid-cols-2 gap-[2px] opacity-25 shrink-0">
                      <div style={{ backgroundColor: cardCoverText }} />
                      <div style={{ backgroundColor: cardCoverText }} />
                      <div style={{ backgroundColor: cardCoverText }} />
                      <div style={{ backgroundColor: cardCoverText }} />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        fullWidth
                        className="!py-2.5 transition-all outline-none"
                        style={{
                          backgroundColor: '#0F1011',
                          color: '#FFFFFF',
                          borderColor: 'transparent'
                        }}
                        onClick={() => onSelectStore(store)}
                      >
                        Ver tienda
                      </Button>
                      <Button
                        variant="ghost"
                        fullWidth
                        className="!py-2.5 border hover:bg-gray-50 transition-colors"
                        style={{
                          backgroundColor: 'transparent',
                          color: '#0F1011',
                          borderColor: 'rgba(0,0,0,0.1)'
                        }}
                        onClick={() => {
                            onSelectStore(store, View.AUTH_REGISTER);
                        }}
                      >
                        Registrarme
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          )}
        </main>
      </div>

      {/* Footer Info Section */}
      <footer className="max-w-7xl mx-auto px-10 mt-32 pb-20 text-center">
        <div 
          className="rounded-[40px] p-16 shadow-2xl relative overflow-hidden border text-white"
          style={{
            backgroundColor: '#0F1011',
            borderColor: 'rgba(255,255,255,0.08)'
          }}
        >
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-camel opacity-10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-[40px] font-extrabold mb-4 tracking-tighter leading-tight text-white">Sé parte de Kingstore</h2>
            <p className="text-[18px] mb-12 max-w-2xl mx-auto font-medium opacity-80 text-white">
              ¡Únete a nuestra plataforma y haz crecer tu negocio! Sé vendedor independiente de Kingstore y conecta con miles de clientes.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">
              <div 
                className="flex items-center gap-4 px-8 py-5 rounded-2xl border hover:bg-white/10 transition-all group cursor-pointer"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <MessageCircle size={28} className="text-camel group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">WhatsApp</div>
                  <div className="text-[18px] font-extrabold tracking-tight text-white">999 888 777</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-12" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
              
              <div 
                className="flex items-center gap-4 px-8 py-5 rounded-2xl border hover:bg-white/10 transition-all group cursor-pointer"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <Mail size={28} className="text-camel group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">Correo Electrónico</div>
                  <div className="text-[18px] font-extrabold tracking-tight underline decoration-camel/30 underline-offset-4 decoration-2 text-white">kingstore@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 flex flex-col items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm text-white"
            style={{ backgroundColor: '#0F1011' }}
          >
            KS
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-45" style={{ color: '#0F1011' }}>
            Kingstore © 2026 • PUCP
          </p>
        </div>
      </footer>
    </div>
  );
};
