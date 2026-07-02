'use client';
import { Topbar } from '@/domains/comerciante/components/MerchantLayout';
import { useStore } from '@/domains/comerciante/context/StoreContext';
import { Store } from '@/domains/comerciante/lib/types';
import { FileText, LayoutGrid, Plus, Store as StoreIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StoreSelectionPage() {
  const router = useRouter();
  const { stores, selectStore, isAuthenticated, isAuthInitialized, isLoading } = useStore();
  const handleSelectStore = (store: Store) => {
    selectStore(store);
    router.push('/comerciante/dashboard');
  };
  const getInitials = (name: string) => name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const getPendingQuotes = (store: Store) => Number(store.pendingQuotes || 0);
  const getStoreCategory = (store: Store) => store.categoryName || store.type || 'Sin categoría';
  const getStoreColor = (store: Store) => store.palette || '#5D634B';
  const getStoreLogo = (store: Store) => store.logoUrl || store.logo || '';

  useEffect(() => {
    if (isAuthInitialized && !isAuthenticated) {
      router.replace('/comerciante/login');
    }
  }, [isAuthInitialized, isAuthenticated, router]);

  if (!isAuthInitialized || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-brand-text-muted">
          <div className="w-8 h-8 border-2 border-brand-neutral-border border-t-brand-black rounded-full animate-spin"></div>
          <p className="text-[12px] font-bold uppercase tracking-widest">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans">
      <Topbar title="Kingstore" subtitle="Gestión Central de Tiendas" noSidebar />
      <main className="max-w-[1240px] mx-auto px-6 pt-32 pb-12 space-y-12">
        <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-brand-neutral-border card-shadow">
          <div><h2 className="text-[24px] font-black text-brand-black">Mis Unidades de Negocio</h2><p className="text-[14px] text-brand-text-muted font-bold">Selecciona una tienda para gestionar sus operaciones</p></div>
          <button onClick={() => router.push('/comerciante/stores/new')} className="bg-brand-black text-white px-8 py-4 rounded-2xl text-[13px] font-black flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"><Plus size={18} /> Crear Nueva Tienda</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <motion.div key={store.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-[24px] border border-brand-neutral-border overflow-hidden card-shadow group flex flex-col">
              <div className="h-[200px] p-8 flex flex-col justify-between relative overflow-hidden transition-all group-hover:opacity-95" style={{ backgroundColor: getStoreColor(store) }}>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 text-white"><LayoutGrid size={80} strokeWidth={1} /></div>
                <div className="flex items-start gap-4 relative z-10 min-w-0 pr-16">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white flex items-center justify-center shadow-lg ring-1 ring-white/70">
                    {getStoreLogo(store) ? (
                      <img src={getStoreLogo(store)} alt={`Logo de ${store.name}`} className="h-full w-full object-contain p-2" />
                    ) : (
                      <span className="text-[24px] font-black leading-none" style={{ color: getStoreColor(store) }}>{getInitials(store.name)}</span>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1 pt-1">
                    <h3 className="text-[22px] font-black text-white leading-tight break-all overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]" title={store.name}>{store.name}</h3>
                    <p className="text-[11px] font-black text-white/70 uppercase tracking-widest truncate">{getStoreCategory(store)}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col space-y-6">
                <p className="text-brand-text-muted text-[15px] font-medium leading-relaxed flex-1">{store.description || 'Sin descripción disponible para esta tienda.'}</p>
                <div className="bg-brand-neutral-light border border-brand-neutral-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-camel shadow-sm"><FileText size={20} /></div><div><p className="text-[14px] font-black text-brand-black">{getPendingQuotes(store)} Pendientes</p><p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Cotizaciones por revisar</p></div></div>
                </div>
                <div className="flex gap-4"><button onClick={() => handleSelectStore(store)} className="w-full bg-brand-black text-white px-6 py-4 rounded-xl text-[13px] font-black uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10">Entrar a tienda</button></div>
              </div>
            </motion.div>
          ))}
        </div>
        {stores.length === 0 && (
          <div className="bg-white rounded-[28px] border border-brand-neutral-border card-shadow p-10 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-neutral-light border border-brand-neutral-border flex items-center justify-center text-brand-black">
              <StoreIcon size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-[22px] font-black text-brand-black">Aún no tienes tiendas asignadas</h3>
              <p className="text-[14px] font-bold text-brand-text-muted max-w-[460px]">
                Puedes crear una nueva tienda o pedir a un administrador que te asigne una existente.
              </p>
            </div>
            <button onClick={() => router.push('/comerciante/stores/new')} className="bg-brand-black text-white px-8 py-4 rounded-2xl text-[13px] font-black flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10">
              <Plus size={18} /> Crear Nueva Tienda
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
