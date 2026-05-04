'use client';

import {
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Settings,
    Shield,
    Store,
    Tag,
    UploadCloud,
    Users
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Store, label: 'Tiendas', href: '/admin/tiendas' },
  { icon: Users, label: 'Usuarios', href: '/admin/usuarios' },
  { icon: UploadCloud, label: 'Carga masiva', href: '/admin/carga-masiva' },
  { icon: Tag, label: 'Categorías', href: '/admin/categorias' },
  { icon: Settings, label: 'Parámetros', href: '/admin/parametros' },
  { icon: Shield, label: 'Auditoría', href: '/admin/auditoria' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <aside className="w-[280px] bg-brand-black text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-8">
        <h1 className="text-[32px] font-display font-extrabold tracking-tighter">Kingstore</h1>
        <p className="text-[12px] text-neutral-400 mt-1">Panel de Administración</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/'));
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActiveTab(item.label.toLowerCase())}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-brand-camel text-white' 
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-bold text-[14px]">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl w-full transition-colors">
          <LogOut size={20} />
          <span className="font-bold text-[14px]">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}