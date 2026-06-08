'use client';
import { useStore } from '@/context/StoreContext';
import { Building2, ChevronDown, FileText, LayoutDashboard, LogOut, Package, Plus, Settings, ShoppingBag, Tag, UploadCloud, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export const Topbar = ({ title, subtitle, noSidebar }: { title: string; subtitle?: string; noSidebar?: boolean }) => {
  const { user, logout } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  
  const getInitials = (name: string) => name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const initials = user?.name ? getInitials(user.name) : (user?.email?.substring(0, 2).toUpperCase() || 'AD');

  return (
    <header className={`fixed top-0 right-0 h-20 bg-brand-neutral-light/80 backdrop-blur-md border-b border-brand-neutral-border z-40 px-8 flex items-center justify-between ${noSidebar ? 'left-0' : 'left-[280px]'}`}>
      <div>
        <h2 className="text-[24px] font-extrabold tracking-tight leading-none mb-1">{title}</h2>
        {subtitle && <p className="text-[12px] text-brand-text-muted font-medium">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 bg-white border border-brand-neutral-border rounded-xl px-3 py-2 cursor-pointer hover:bg-brand-neutral-mid transition-colors card-shadow focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-extrabold text-[12px]">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[13px] font-extrabold leading-none mb-1">{user?.name || user?.email || 'Admin Kingstore'}</p>
              <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">Comerciante</p>
            </div>
            <ChevronDown size={14} className={`text-brand-text-muted transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-brand-neutral-border rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-brand-neutral-border mb-1">
                <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest mb-1">Tu cuenta</p>
                <p className="text-[13px] font-bold truncate">{user?.email}</p>
              </div>
              <button 
                onClick={() => { setShowUserMenu(false); router.push('/profile'); }}
                className="w-full px-4 py-2.5 text-left text-[13px] font-bold hover:bg-brand-neutral-light flex items-center gap-2 transition-colors"
              >
                <User size={16} /> Editar perfil
              </button>
              <button 
                onClick={() => { setShowUserMenu(false); router.push('/store-selection'); }}
                className="w-full px-4 py-2.5 text-left text-[13px] font-bold hover:bg-brand-neutral-light flex items-center gap-2 transition-colors"
              >
                <Building2 size={16} /> Gestión de tiendas
              </button>
              <div className="h-px bg-brand-neutral-border my-1" />
              <div className="px-2 pb-1">
                <button 
                  onClick={() => { logout(); router.push('/login'); }}
                  className="w-full px-4 py-2.5 text-left text-[13px] font-black text-brand-black bg-white border border-brand-black rounded-xl flex items-center gap-2 hover:bg-brand-neutral-light transition-all active:scale-[0.98]"
                >
                  <LogOut size={16} strokeWidth={2.5} /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { store, stores, setStore } = useStore();
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);

  const navItems = [
    { label: 'Panel', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Productos', icon: Package, path: '/products' },
    { label: 'Carga masiva', icon: UploadCloud, path: '/carga-masiva' },
    { label: 'Cotizaciones', icon: FileText, path: '/quotes' },
    { label: 'Pedidos', icon: ShoppingBag, path: '/orders' },
    { label: 'Descuentos', icon: Tag, path: '/discounts' },
    { label: 'Configuración', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-[280px] bg-white border-r border-brand-neutral-border flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-[22px] font-extrabold tracking-tighter">Kingstore</h1>
          <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">Panel del comerciante</p>
        </div>
        <div className="relative">
          <div 
            onClick={() => setShowStoreDropdown(!showStoreDropdown)}
            className="bg-brand-neutral-light border border-brand-neutral-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-brand-neutral-mid transition-colors mb-8"
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm"
              style={{ backgroundColor: store.palette || '#000000' }}
            >
              {store.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-extrabold truncate">{store.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${store.status === 'Activa' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">{store.status}</span>
              </div>
            </div>
            <ChevronDown size={14} className={`text-brand-text-muted shrink-0 transition-transform ${showStoreDropdown ? 'rotate-180' : ''}`} />
          </div>
          {showStoreDropdown && (
            <div className="absolute top-full left-0 right-0 mt-[-24px] bg-white border border-brand-neutral-border rounded-2xl shadow-xl z-[60] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {stores.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => { setStore(s); setShowStoreDropdown(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-brand-neutral-light flex items-center gap-3 transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center text-[12px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: s.palette || '#000000' }}
                  >
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate">{s.name}</p>
                    <p className="text-[10px] text-brand-text-muted">{s.status}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 px-4 flex flex-col gap-1 mb-6 overflow-y-auto">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname === item.path 
                ? 'bg-brand-black text-white shadow-lg' 
                : 'text-brand-text-muted hover:bg-brand-neutral-light hover:text-brand-black'
            }`}
          >
            <item.icon size={18} />
            <span className="text-[13px] font-extrabold">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-brand-neutral-border">
        <button 
          onClick={() => router.push('/stores/new')}
          className="flex items-center justify-center gap-2 border border-brand-neutral-border bg-brand-neutral-light rounded-xl px-4 py-3 text-[12px] font-extrabold hover:bg-brand-neutral-mid transition-all w-full text-brand-black"
        >
          <Plus size={16} /> Crear tienda
        </button>
      </div>
    </aside>
  );
};

export const MerchantLayout = ({ children, title, subtitle, noSidebar }: { children: React.ReactNode; title: string; subtitle?: string; noSidebar?: boolean }) => {
  return (
    <div className="min-h-screen bg-brand-neutral-light flex w-full overflow-hidden">
      {!noSidebar && <Sidebar />}
      <div className={`flex-1 min-w-0 ${noSidebar ? 'pl-0' : 'pl-[280px]'}`}>
        <Topbar title={title} subtitle={subtitle} noSidebar={noSidebar} />
        <main className={`pb-12 px-8 flex flex-col gap-8 max-w-[1400px] w-full mx-auto animate-in fade-in duration-500 ${noSidebar ? 'pt-32' : 'pt-28'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
