'use client';
import { Topbar } from '@/components/MerchantLayout';
import { useStore } from '@/context/StoreContext';
import { Store } from '@/lib/types';
import { FileText, LayoutGrid, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function StoreSelectionPage() {
  const router = useRouter();
  const { stores, setStore, quotes } = useStore();
  const handleSelectStore = (store: Store) => {
    setStore(store);
    router.push('/dashboard');
  };
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const getPendingQuotes = (storeId: string) => quotes.filter(q => q.storeId === storeId && q.status === 'Pendiente').length;

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans">
      <Topbar title="Kingstore" subtitle="Gestión Central de Tiendas" noSidebar />
      <main className="max-w-[1240px] mx-auto px-6 pt-32 pb-12 space-y-12">
        <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-brand-neutral-border card-shadow">
          <div><h2 className="text-[24px] font-black text-brand-black">Mis Unidades de Negocio</h2><p className="text-[14px] text-brand-text-muted font-bold">Selecciona una tienda para gestionar sus operaciones</p></div>
          <button onClick={() => router.push('/stores/new')} className="bg-brand-black text-white px-8 py-4 rounded-2xl text-[13px] font-black flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"><Plus size={18} /> Crear Nueva Tienda</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <motion.div key={store.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-[24px] border border-brand-neutral-border overflow-hidden card-shadow group flex flex-col">
              <div className="h-[200px] p-8 flex flex-col justify-between relative overflow-hidden transition-all group-hover:opacity-95" style={{ backgroundColor: store.palette || '#5D634B' }}>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 text-white"><LayoutGrid size={80} strokeWidth={1} /></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg"><span className="text-[24px] font-black" style={{ color: store.palette || '#5D634B' }}>{getInitials(store.name)}</span></div>
                  <div className="space-y-1"><h3 className="text-[22px] font-black text-white leading-none">{store.name}</h3><p className="text-[11px] font-black text-white/70 uppercase tracking-widest">{store.type}</p></div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col space-y-6">
                <p className="text-brand-text-muted text-[15px] font-medium leading-relaxed flex-1">{store.description || 'Sin descripción disponible para esta tienda.'}</p>
                <div className="bg-brand-neutral-light border border-brand-neutral-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-camel shadow-sm"><FileText size={20} /></div><div><p className="text-[14px] font-black text-brand-black">{getPendingQuotes(store.id)} Pendientes</p><p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Cotizaciones por revisar</p></div></div>
                </div>
                <div className="flex gap-4"><button onClick={() => handleSelectStore(store)} className="w-full bg-brand-black text-white px-6 py-4 rounded-xl text-[13px] font-black uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10">Entrar a tienda</button></div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}