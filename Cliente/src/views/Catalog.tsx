/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ChevronDown, 
  LayoutGrid, 
  List as ListIcon,
  Check
} from 'lucide-react';
import { Store, User, Product, View } from '../types';
import { PRODUCTS, AVAILABLE_SIZES, AVAILABLE_COLORS } from '../constants';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';

// Helper to calculate perceptual brightness of a hex color
function getBrightness(hexColor: string): number {
  if (!hexColor) return 0;
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return 0;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return 0;
  return (r * 299 + g * 587 + b * 114) / 1000;
}

interface CatalogProps {
  store: Store;
  user: User | null;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  onSelectProduct: (product: Product) => void;
  cartCount: number;
  initialShowFullCatalog?: boolean;
}

type SortOption = 'recent' | 'oldest' | 'price-asc' | 'price-desc';

export const Catalog: React.FC<CatalogProps> = ({ store, user, onNavigate, onLogout, onSelectProduct, cartCount, initialShowFullCatalog = false }) => {
  const [showFullCatalog, setShowFullCatalog] = useState(initialShowFullCatalog);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  React.useEffect(() => {
    setShowFullCatalog(initialShowFullCatalog);
  }, [initialShowFullCatalog, store.id]);

  // Sync with window for TopBar access (hacky but works for this architecture)
  React.useEffect(() => {
    (window as any).setShowFullCatalog = setShowFullCatalog;
    return () => { delete (window as any).setShowFullCatalog; };
  }, [setShowFullCatalog]);

  // Filter and sort products
  const storeProducts = useMemo(() => {
    let filtered = PRODUCTS.filter(p => !p.storeId || p.storeId === store.id);
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => p.colors.some(c => selectedColors.includes(c)));
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'recent') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      return 0;
    });
  }, [store.id, searchQuery, selectedSizes, selectedColors, sortBy]);

  const displayedProducts = useMemo(() => {
    return showFullCatalog ? storeProducts : storeProducts.slice(0, 3);
  }, [showFullCatalog, storeProducts]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar 
        store={store} 
        user={user} 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        cartCount={cartCount} 
        currentView={showFullCatalog ? View.CATALOG : View.STOREFRONT_PUBLIC}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
           {!showFullCatalog ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[40px] shadow-sm overflow-hidden border min-h-[80vh] flex flex-col"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(0,0,0,0.08)',
                color: '#0F1011'
              }}
            >
              <div 
                className="relative min-h-[650px] p-20 flex flex-col items-start justify-center text-left overflow-hidden rounded-[40px] transition-all duration-300"
                style={{ 
                  background: `radial-gradient(circle at 100% 0%, var(--color-camel-light) 0%, transparent 60%), #FFFFFF`
                }}
              >
                {/* Subtle patterns/light effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(0,0,0,0.01)_0%,_transparent_70%)]" />
                <div className="absolute -left-20 top-20 w-96 h-96 bg-camel opacity-[0.01] blur-[120px] rounded-full" />
                
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative z-10 max-w-2xl flex flex-col items-start gap-6 pl-4"
                >
                  {/* Store Logo Accent */}
                  <div 
                    className="w-28 h-28 rounded-[32px] flex items-center justify-center font-black text-4xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border mb-8 backdrop-blur-md transition-all group-hover:scale-105"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--text-on-primary)',
                      borderColor: 'rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {store.logo}
                  </div>

                  <div className="space-y-4">
                    <div 
                      className="inline-flex items-center gap-3 bg-gray-50 border px-5 py-2 rounded-full mb-2"
                      style={{ 
                         borderColor: 'rgba(0,0,0,0.08)',
                         color: '#475569',
                      }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-tertiary)' }} />
                      <span className="text-[11px] font-black tracking-[0.25em] uppercase">Bienvenidos a la fábrica</span>
                    </div>
                    
                    <div className="space-y-1">
                      <h2 
                        className="text-[84px] font-black leading-[0.8] tracking-tighter"
                        style={{ color: '#0F1011' }}
                      >
                        {store.name}
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="h-px w-12" style={{ backgroundColor: 'var(--color-tertiary)' }} />
                        <h3 
                          className="text-[56px] font-black leading-[0.8] tracking-tighter"
                          style={{ color: 'var(--color-tertiary)' }}
                        >
                          Industrial Partners
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-12">
                    <button 
                      className="group flex items-center gap-4 px-14 py-4.5 rounded-2xl font-black text-[14px] uppercase tracking-widest transition-all shadow-[0_15px_30px_rgba(0,0,0,0.08)] active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--color-tertiary)',
                        color: 'var(--text-on-tertiary)'
                      }}
                      onClick={() => setShowFullCatalog(true)}
                    >
                      Explorar Catálogo
                      <div className="w-2 h-2 rounded-full transition-colors animate-bounce" style={{ backgroundColor: 'var(--color-text-on-tertiary)' }} />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Quick Preview Products */}
              <div className="p-12 border-t" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h4 className="text-[24px] font-black tracking-tight" style={{ color: '#0F1011' }}>Productos recientes</h4>
                    <p className="text-[14px] font-bold" style={{ color: '#475569' }}>Últimas incorporaciones a nuestro catálogo industrial</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedProducts.map((product, i) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="product-card group cursor-pointer text-left rounded-[24px] border p-5 hover:shadow-xl transition-all"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#0F1011',
                        borderColor: 'rgba(0,0,0,0.08)'
                      }}
                      onClick={() => onSelectProduct(product)}
                    >
                      <div className="aspect-square rounded-[18px] overflow-hidden relative mb-4">
                        <div 
                          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                          style={{ 
                            backgroundColor: i % 3 === 0 ? 'var(--color-primary)' : i % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)' 
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-[14px] font-black" style={{ color: '#0F1011' }}>{product.name}</h3>
                        <div className="flex justify-between items-center pt-2">
                          <p className="text-[14px] font-black" style={{ color: '#0F1011' }}>S/ {product.price.toFixed(2)}</p>
                          <span className="text-[10px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}>Ver info</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-20 flex justify-center">
                   <button 
                    onClick={() => onNavigate(View.DIRECTORY)}
                    className="group flex items-center gap-3 px-10 py-4 rounded-2xl text-[13px] font-black transition-all border shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#0F1011',
                      borderColor: 'rgba(0,0,0,0.08)'
                    }}
                  >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    VOLVER A TIENDAS
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Catalog Header & Filters */}
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[32px] shadow-sm border"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0F1011',
                  borderColor: 'rgba(0,0,0,0.08)'
                }}
              >
                <div className="space-y-1">
                  <h2 className="text-[28px] font-black tracking-tight" style={{ color: '#0F1011' }}>Catálogo de Productos</h2>
                  <p className="text-[14px] font-bold" style={{ color: '#475569' }}>Mostrando {storeProducts.length} artículos disponibles</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar producto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border rounded-xl py-3 pl-12 pr-6 text-[13px] font-bold focus:ring-2 focus:ring-[#0F1011]/10 transition-all w-full md:w-64"
                      style={{
                        backgroundColor: '#F9FAFB',
                        borderColor: 'rgba(0,0,0,0.08)',
                        color: '#0F1011'
                      }}
                    />
                  </div>
                  
                  <div className="flex h-12 rounded-xl p-1 shrink-0 border" style={{ backgroundColor: '#F9FAFB', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <button 
                      onClick={() => setViewMode('grid')}
                      className="flex-1 px-4 flex items-center justify-center rounded-lg transition-all"
                      style={viewMode === 'grid' ? {
                        backgroundColor: 'var(--color-tertiary)',
                        color: 'var(--text-on-tertiary)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      } : {
                        color: '#0F1011',
                        opacity: 0.6
                      }}
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className="flex-1 px-4 flex items-center justify-center rounded-lg transition-all"
                      style={viewMode === 'list' ? {
                        backgroundColor: 'var(--color-tertiary)',
                        color: 'var(--text-on-tertiary)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      } : {
                        color: '#0F1011',
                        opacity: 0.6
                      }}
                    >
                      <ListIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 space-y-6">
                  <div className="p-8 rounded-[32px] shadow-sm border" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <h3 className="text-[12px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--color-tertiary)' }}>Ordenar por</h3>
                    <div className="space-y-1">
                      {[
                        { id: 'recent', label: 'Más recientes' },
                        { id: 'oldest', label: 'Más antiguos' },
                        { id: 'price-asc', label: 'Precio: Menor a Mayor' },
                        { id: 'price-desc', label: 'Precio: Mayor a Menor' }
                      ].map(option => (
                        <button 
                          key={option.id}
                          onClick={() => setSortBy(option.id as SortOption)}
                          className="w-full text-left px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-between cursor-pointer"
                          style={sortBy === option.id ? {
                            color: 'var(--text-on-tertiary)',
                            backgroundColor: 'var(--color-tertiary)'
                          } : {
                            color: '#0F1011',
                            opacity: 0.8
                          }}
                        >
                          {option.label}
                          {sortBy === option.id && <Check size={14} style={{ color: 'var(--text-on-tertiary)' }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-[32px] shadow-sm border" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <h3 className="text-[12px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--color-tertiary)' }}>Filtrar por Talla</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {AVAILABLE_SIZES.map(size => (
                        <button 
                          key={size}
                          onClick={() => {
                            setSelectedSizes(prev => 
                              prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                            );
                          }}
                          className="h-10 flex items-center justify-center rounded-xl text-[12px] font-black transition-all border cursor-pointer"
                          style={selectedSizes.includes(size) ? {
                            backgroundColor: 'var(--color-tertiary)',
                            borderColor: 'var(--color-tertiary)',
                            color: 'var(--text-on-tertiary)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          } : {
                            backgroundColor: '#FFFFFF',
                            borderColor: 'rgba(0,0,0,0.08)',
                            color: '#0F1011'
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-[32px] shadow-sm border" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <h3 className="text-[12px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--color-tertiary)' }}>Color</h3>
                    <div className="space-y-2">
                      {AVAILABLE_COLORS.map(color => (
                        <button 
                          key={color}
                          onClick={() => {
                            setSelectedColors(prev => 
                              prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
                            );
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all border cursor-pointer"
                          style={selectedColors.includes(color) ? {
                            backgroundColor: 'var(--color-tertiary)',
                            borderColor: 'var(--color-tertiary)',
                            color: 'var(--text-on-tertiary)',
                          } : {
                            backgroundColor: '#FFFFFF',
                            borderColor: 'rgba(0,0,0,0.08)',
                            color: '#0F1011'
                          }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-black/10" 
                            style={{ 
                              backgroundColor: color === 'BLANCO' ? '#FFFFFF' : 
                                               color === 'NEGRO' ? '#000000' : 
                                               color === 'ROJO' ? '#DC2626' : 
                                               color === 'VERDE' ? '#16A34A' : 
                                               color === 'AZUL' ? '#2563EB' : '#ccc' 
                            }} 
                          />
                          {color.charAt(0) + color.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                  {storeProducts.length > 0 ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}>
                      {storeProducts.map((product, i) => (
                        <motion.div 
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`group rounded-[32px] border overflow-hidden hover:shadow-xl transition-all cursor-pointer ${viewMode === 'list' ? 'flex items-center p-4 gap-8' : ''}`}
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#0F1011',
                            borderColor: 'rgba(0,0,0,0.08)'
                          }}
                          onClick={() => onSelectProduct(product)}
                        >
                          <div className={`${viewMode === 'list' ? 'w-48 shrink-0' : 'w-full'} aspect-square bg-gray-100 relative overflow-hidden`}>
                            <div 
                              className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                              style={{ 
                                backgroundColor: i % 3 === 0 ? 'var(--color-primary)' : i % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)' 
                              }}
                            />
                          </div>
                          
                          <div className="p-6 flex flex-col flex-1 text-left">
                            <h3 className="text-[16px] font-black mb-1 transition-colors" style={{ color: '#0F1011' }}>{product.name}</h3>
                            <p className="text-[12px] font-medium line-clamp-2 mb-6" style={{ color: '#475569' }}>{product.description}</p>
                            
                            <div className="mt-auto flex items-center justify-between">
                              <span className="text-[18px] font-black" style={{ color: '#0F1011' }}>S/ {product.price.toFixed(2)}</span>
                              <button 
                                className="text-[11px] font-black px-6 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                                style={{
                                  backgroundColor: 'var(--color-tertiary)',
                                  color: 'var(--text-on-tertiary)'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectProduct(product);
                                }}
                              >
                                VER DETALLES
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[40px] p-20 text-center border border-dashed border-gray-200" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
                      <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-[20px] font-black mb-2">No se encontraron productos</h3>
                      <p className="opacity-75 max-w-xs mx-auto text-gray-500">Prueba ajustando tus filtros o términos de búsqueda.</p>
                      <button 
                        onClick={() => { setSelectedSizes([]); setSelectedColors([]); setSearchQuery(''); }}
                        className="mt-8 font-black text-[13px] underline decoration-2 underline-offset-4 cursor-pointer"
                        style={{ color: 'var(--color-tertiary)' }}
                      >
                        Limpiar todos los filtros
                      </button>
                    </div>
                  )}
                </div>
              </div>

               {/* Catalog Footer Nav */}
               <div className="pt-20 flex justify-center">
                   <button 
                    onClick={() => setShowFullCatalog(false)}
                    className="group flex items-center gap-3 px-10 py-4 rounded-2xl text-[13px] font-black border shadow-sm hover:shadow-lg active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#0F1011',
                      borderColor: 'rgba(0,0,0,0.08)'
                    }}
                  >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    VOLVER AL INICIO
                  </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

