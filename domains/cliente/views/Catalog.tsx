/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutGrid,
  List as ListIcon,
  Check,
  Loader2,
  AlertTriangle,
  ImageIcon,
} from 'lucide-react';
import { Store, User, Product, View } from '../types';
import { fetchPublicProducts, toProduct } from '../lib/api';
import { TopBar } from '../components/layout/TopBar';
import { StoreLogo } from '../components/ui/StoreLogo';
import { getColorLabel, getColorSwatchStyle } from '../../shared/colors';
import { messageFromError } from '../../shared/errors';
import { useAutoRefresh } from '../../shared/hooks/useAutoRefresh';

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
const PRODUCTS_PER_PAGE = 21;

function ProductVisual({ product, index, className = '' }: { product: Product; index: number; className?: string }) {
  const imageUrl = product.image || product.imageUrls?.[0];
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(imageUrl && !imageFailed);

  return (
    <div className={`${className} bg-gray-100 relative overflow-hidden`}>
      {shouldShowImage ? (
        <img
          src={imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundColor: index % 3 === 0 ? 'var(--color-primary)' : index % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-tertiary)',
            color: index % 3 === 0 ? 'var(--text-on-primary)' : index % 3 === 1 ? 'var(--text-on-secondary)' : 'var(--text-on-tertiary)',
          }}
        >
          <ImageIcon size={42} className="opacity-45" />
        </div>
      )}
    </div>
  );
}

export const Catalog: React.FC<CatalogProps> = ({ store, user, onNavigate, onLogout, onSelectProduct, cartCount, initialShowFullCatalog = false }) => {
  const [showFullCatalog, setShowFullCatalog] = useState(initialShowFullCatalog);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasProductsRef = React.useRef(false);

  useEffect(() => {
    setShowFullCatalog(initialShowFullCatalog);
  }, [initialShowFullCatalog, store.id]);

  useEffect(() => {
    (window as any).setShowFullCatalog = setShowFullCatalog;
    return () => { delete (window as any).setShowFullCatalog; };
  }, [setShowFullCatalog]);

  const loadProducts = React.useCallback(async (background = false) => {
    if (!store.slug) return;

    if (!background) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchPublicProducts(store.slug, searchQuery);
      setProducts(data.map((product) => toProduct(product, store.slug || store.id)));
      hasProductsRef.current = true;
      setError(null);
    } catch (err) {
      if (!background || !hasProductsRef.current) {
        setError(messageFromError(err, 'No se pudieron cargar los productos. Intenta nuevamente.'));
      }
    } finally {
      if (!background) setLoading(false);
    }
  }, [store.id, store.slug, searchQuery]);

  useEffect(() => {
    void loadProducts(false);
  }, [loadProducts]);

  useAutoRefresh({
    enabled: Boolean(store.slug),
    intervalMs: 20000,
    onRefresh: () => loadProducts(true),
  });

  const availableSizes = useMemo(() => Array.from(new Set(products.flatMap((product) => product.sizes))).sort(), [products]);
  const availableColors = useMemo(() => Array.from(new Set(products.flatMap((product) => product.colors))).sort(), [products]);

  // Backend soporta search por nombre; talla/color/ordenamiento son filtros locales sobre productos cargados.
  const storeProducts = useMemo(() => {
    let filtered = products;

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) => product.sizes.some((size) => selectedSizes.includes(size)));
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) => product.colors.some((color) => selectedColors.includes(color)));
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'recent') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      return 0;
    });
  }, [products, selectedSizes, selectedColors, sortBy]);

  const displayedProducts = useMemo(() => {
    return showFullCatalog ? storeProducts : storeProducts.slice(0, 3);
  }, [showFullCatalog, storeProducts]);
  const totalPages = Math.max(1, Math.ceil(storeProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return storeProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [currentPage, storeProducts]);
  const pageStart = storeProducts.length === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const pageEnd = Math.min(currentPage * PRODUCTS_PER_PAGE, storeProducts.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSizes, selectedColors, sortBy, showFullCatalog]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchQuery('');
  };

  const renderProductCards = (items: Product[]) => (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8' : 'space-y-5 sm:space-y-6'}>
      {items.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`group rounded-[24px] sm:rounded-[32px] border overflow-hidden hover:shadow-xl transition-all cursor-pointer ${viewMode === 'list' ? 'flex flex-col sm:flex-row sm:items-center p-4 gap-5 sm:gap-8' : ''}`}
          style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
          onClick={() => onSelectProduct(product)}
        >
          <ProductVisual product={product} index={index} className={`${viewMode === 'list' ? 'w-full sm:w-48 shrink-0 rounded-[18px] sm:rounded-none' : 'w-full'} aspect-square`} />

          <div className={`${viewMode === 'list' ? 'w-full p-2 sm:p-6' : 'p-5 sm:p-6'} flex flex-col flex-1 text-left`}>
            <h3 className="text-[16px] font-black mb-1 transition-colors" style={{ color: '#0F1011' }}>{product.name}</h3>
            <p className="text-[12px] font-medium line-clamp-2 mb-4" style={{ color: '#475569' }}>{product.description}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {product.sizes.slice(0, 4).map((size) => (
                <span key={size} className="px-2 py-1 rounded-lg text-[10px] font-black border" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>{size}</span>
              ))}
              {product.stock !== undefined && (
                <span className="px-2 py-1 rounded-lg text-[10px] font-black border" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>Stock {product.stock}</span>
              )}
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
              <span className="text-[18px] font-black" style={{ color: '#0F1011' }}>S/ {product.price.toFixed(2)}</span>
              <button
                className="text-[11px] font-black px-4 sm:px-6 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                onClick={(event) => {
                  event.stopPropagation();
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
  );

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {!showFullCatalog ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[28px] md:rounded-[40px] shadow-sm overflow-hidden border min-h-[80vh] flex flex-col"
              style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)', color: '#0F1011' }}
            >
              <div
                className="relative min-h-[520px] md:min-h-[650px] p-8 sm:p-12 md:p-20 flex flex-col items-start justify-center text-left overflow-hidden rounded-[28px] md:rounded-[40px] transition-all duration-300"
                style={{ background: 'radial-gradient(circle at 100% 0%, var(--color-camel-light) 0%, transparent 60%), #FFFFFF' }}
              >
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 max-w-2xl flex flex-col items-start gap-6 pl-4">
                  <StoreLogo
                    store={store}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border mb-6 md:mb-8 backdrop-blur-md"
                    style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0, 0, 0, 0.08)' }}
                    fallbackClassName="font-black text-4xl"
                    fallbackStyle={{ color: 'var(--text-on-primary)' }}
                    objectFit="contain"
                  />

                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 bg-gray-50 border px-5 py-2 rounded-full mb-2" style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#475569' }}>
                      <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-tertiary)' }} />
                      <span className="text-[11px] font-black tracking-[0.25em] uppercase">Bienvenidos a la fábrica</span>
                    </div>
                    <h2 className="text-[44px] sm:text-[58px] md:text-[84px] font-black leading-[0.9] md:leading-[0.8] tracking-tight md:tracking-tighter" style={{ color: '#0F1011' }}>{store.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="h-px w-12" style={{ backgroundColor: 'var(--color-tertiary)' }} />
                      <h3 className="text-[30px] sm:text-[42px] md:text-[56px] font-black leading-[0.9] md:leading-[0.8] tracking-tight md:tracking-tighter" style={{ color: 'var(--accent-on-light)' }}>Socios industriales</h3>
                    </div>
                  </div>

                  <div className="pt-12">
                    <button
                      className="group flex items-center gap-4 px-8 sm:px-10 md:px-14 py-4 rounded-2xl font-black text-[12px] sm:text-[14px] uppercase tracking-widest transition-all shadow-[0_15px_30px_rgba(0,0,0,0.08)] active:scale-95 cursor-pointer"
                      style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                      onClick={() => setShowFullCatalog(true)}
                    >
                      Explorar Catálogo
                      <div className="w-2 h-2 rounded-full transition-colors animate-bounce" style={{ backgroundColor: 'var(--text-on-tertiary)' }} />
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="p-5 sm:p-8 md:p-12 border-t" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                <div className="flex justify-between items-end mb-8 md:mb-10">
                  <div>
                    <h4 className="text-[24px] font-black tracking-tight" style={{ color: '#0F1011' }}>Productos recientes</h4>
                    <p className="text-[14px] font-bold" style={{ color: '#475569' }}>Últimas incorporaciones al catálogo</p>
                  </div>
                </div>

                {loading ? (
                  <div className="py-16 flex flex-col items-center gap-3 text-gray-500"><Loader2 className="animate-spin" /> Cargando productos...</div>
                ) : error ? (
                  <div className="py-16 flex flex-col items-center gap-3 text-red-600"><AlertTriangle /> {error}</div>
                ) : displayedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                    {displayedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="product-card group cursor-pointer text-left rounded-[24px] border p-5 hover:shadow-xl transition-all"
                        style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                        onClick={() => onSelectProduct(product)}
                      >
                        <ProductVisual product={product} index={index} className="aspect-square rounded-[18px] mb-4" />
                        <h3 className="text-[14px] font-black" style={{ color: '#0F1011' }}>{product.name}</h3>
                        <div className="flex justify-between items-center pt-2">
                          <p className="text-[14px] font-black" style={{ color: '#0F1011' }}>S/ {product.price.toFixed(2)}</p>
                          <span className="text-[10px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider" style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}>Ver info</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-500 font-bold">Esta tienda aún no tiene productos disponibles.</div>
                )}

                <div className="mt-12 md:mt-20 flex justify-center">
                  <button onClick={() => onNavigate(View.DIRECTORY)} className="group flex items-center gap-3 px-6 sm:px-10 py-4 rounded-2xl text-[12px] sm:text-[13px] font-black transition-all border shadow-sm hover:shadow-md active:scale-95 cursor-pointer" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    VOLVER A TIENDAS
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 p-5 sm:p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                <div className="space-y-1">
                  <h2 className="text-[28px] font-black tracking-tight" style={{ color: '#0F1011' }}>Catálogo de productos</h2>
                  <p className="text-[14px] font-bold" style={{ color: '#475569' }}>Mostrando {storeProducts.length} artículos disponibles</p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 sm:gap-4 md:w-auto">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="border rounded-xl py-3 pl-12 pr-6 text-[13px] font-bold focus:ring-2 focus:ring-[#0F1011]/10 transition-all w-full md:w-64"
                      style={{ backgroundColor: '#F9FAFB', borderColor: 'rgba(0,0,0,0.08)', color: '#0F1011' }}
                    />
                  </div>

                  <div className="flex h-12 rounded-xl p-1 shrink-0 border" style={{ backgroundColor: '#F9FAFB', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <button onClick={() => setViewMode('grid')} className="flex-1 px-4 flex items-center justify-center rounded-lg transition-all" style={viewMode === 'grid' ? { backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } : { color: '#0F1011', opacity: 0.6 }} aria-label="Vista grilla">
                      <LayoutGrid size={18} />
                    </button>
                    <button onClick={() => setViewMode('list')} className="flex-1 px-4 flex items-center justify-center rounded-lg transition-all" style={viewMode === 'list' ? { backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } : { color: '#0F1011', opacity: 0.6 }} aria-label="Vista lista">
                      <ListIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 space-y-6">
                  <div className="p-8 rounded-[32px] shadow-sm border" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <h3 className="text-[12px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--accent-on-light)' }}>Ordenar por</h3>
                    <div className="space-y-1">
                      {[
                        { id: 'recent', label: 'Más recientes' },
                        { id: 'oldest', label: 'Más antiguos' },
                        { id: 'price-asc', label: 'Precio: Menor a Mayor' },
                        { id: 'price-desc', label: 'Precio: Mayor a Menor' },
                      ].map((option) => (
                        <button key={option.id} onClick={() => setSortBy(option.id as SortOption)} className="w-full text-left px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-between cursor-pointer" style={sortBy === option.id ? { color: 'var(--text-on-tertiary)', backgroundColor: 'var(--color-tertiary)' } : { color: '#0F1011', opacity: 0.8 }}>
                          {option.label}
                          {sortBy === option.id && <Check size={14} style={{ color: 'var(--text-on-tertiary)' }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {availableSizes.length > 0 && (
                    <div className="p-8 rounded-[32px] shadow-sm border" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                      <h3 className="text-[12px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--accent-on-light)' }}>Filtrar por Talla</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSizes.map((size) => (
                          <button key={size} onClick={() => setSelectedSizes((prev) => prev.includes(size) ? prev.filter((entry) => entry !== size) : [...prev, size])} className="h-10 flex items-center justify-center rounded-xl text-[12px] font-black transition-all border cursor-pointer" style={selectedSizes.includes(size) ? { backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' } : { backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)', color: '#0F1011' }}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableColors.length > 0 && (
                    <div className="p-8 rounded-[32px] shadow-sm border" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
                      <h3 className="text-[12px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--accent-on-light)' }}>Color</h3>
                      <div className="space-y-2">
                        {availableColors.map((color) => (
                          <button key={color} onClick={() => setSelectedColors((prev) => prev.includes(color) ? prev.filter((entry) => entry !== color) : [...prev, color])} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all border cursor-pointer" style={selectedColors.includes(color) ? { backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' } : { backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)', color: '#0F1011' }}>
                            <div className="w-4 h-4 rounded-full border" style={getColorSwatchStyle(color)} />
                            {getColorLabel(color)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>

                <div className="min-w-0 flex-1">
                  {loading ? (
                    <div className="rounded-[28px] md:rounded-[40px] p-10 md:p-20 text-center border border-dashed border-gray-200 flex flex-col items-center gap-3" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
                      <Loader2 size={32} className="animate-spin text-gray-400" />
                      <p className="font-bold text-gray-500">Cargando productos...</p>
                    </div>
                  ) : error ? (
                    <div className="rounded-[28px] md:rounded-[40px] p-10 md:p-20 text-center border border-dashed border-red-200 flex flex-col items-center gap-3" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
                      <AlertTriangle size={32} className="text-red-500" />
                      <p className="font-bold text-red-600">{error}</p>
                    </div>
                  ) : storeProducts.length > 0 ? (
                    <div className="space-y-8">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="text-[13px] font-bold" style={{ color: '#64748B' }}>
                          Mostrando {pageStart}-{pageEnd} de {storeProducts.length} productos
                        </p>
                        {totalPages > 1 && (
                          <p className="text-[12px] font-black uppercase tracking-widest" style={{ color: '#94A3B8' }}>
                            Página {currentPage} de {totalPages}
                          </p>
                        )}
                      </div>

                      {renderProductCards(paginatedProducts)}

                      {totalPages > 1 && (
                        <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2" aria-label="Paginación de productos">
                          <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl border text-[11px] sm:text-[12px] font-black inline-flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                          >
                            <ChevronLeft size={16} />
                            Anterior
                          </button>

                          {Array.from({ length: totalPages }).map((_, index) => {
                            const page = index + 1;
                            const isVisible = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                            const showGap = (page === currentPage - 2 && page > 1) || (page === currentPage + 2 && page < totalPages);

                            if (showGap) {
                              return <span key={`gap-${page}`} className="px-1 text-[12px] font-black text-slate-400">...</span>;
                            }

                            if (!isVisible) return null;

                            return (
                              <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className="h-10 min-w-10 sm:h-11 sm:min-w-11 px-3 sm:px-4 rounded-xl border text-[11px] sm:text-[12px] font-black transition-all cursor-pointer"
                                style={currentPage === page
                                  ? { backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', borderColor: 'var(--color-tertiary)' }
                                  : { backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                              >
                                {page}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl border text-[11px] sm:text-[12px] font-black inline-flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}
                          >
                            Siguiente
                            <ChevronRight size={16} />
                          </button>
                        </nav>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-[28px] md:rounded-[40px] p-10 md:p-20 text-center border border-dashed border-gray-200" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
                      <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6"><Search size={32} className="text-gray-400" /></div>
                      <h3 className="text-[20px] font-black mb-2">No se encontraron productos</h3>
                      <p className="opacity-75 max-w-xs mx-auto text-gray-500">Prueba ajustando tus filtros o términos de búsqueda.</p>
                      <button onClick={clearFilters} className="mt-8 font-black text-[13px] underline decoration-2 underline-offset-4 cursor-pointer" style={{ color: 'var(--accent-on-light)' }}>Limpiar todos los filtros</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-12 md:pt-20 flex justify-center">
                <button onClick={() => setShowFullCatalog(false)} className="group flex items-center gap-3 px-6 sm:px-10 py-4 rounded-2xl text-[12px] sm:text-[13px] font-black border shadow-sm hover:shadow-lg active:scale-95 cursor-pointer" style={{ backgroundColor: '#FFFFFF', color: '#0F1011', borderColor: 'rgba(0,0,0,0.08)' }}>
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
