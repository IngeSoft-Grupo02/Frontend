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

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: '/admin' },
  { icon: Store,           label: 'Tiendas',       href: '/admin/tiendas' },
  { icon: Users,           label: 'Usuarios',      href: '/admin/usuarios' },
  { icon: UploadCloud,     label: 'Carga masiva',  href: '/admin/carga-masiva' },
  { icon: Settings,        label: 'Parámetros',    href: '/admin/parametros' },
  { icon: Tag,             label: 'Categorías',    href: '/admin/categorias' },
  { icon: Shield,          label: 'Auditoría',     href: '/admin/auditoria' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-brand-black text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-[26px] font-display font-extrabold tracking-tighter">Admin</h1>
        <p className="text-[11px] text-neutral-400 mt-0.5">Centro de control</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname?.startsWith(item.href + '/'));
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} />
                <span className="font-bold text-[13px] uppercase tracking-wider">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-white/60" />}
            </a>
          );
        })}
      </nav>

      {/* Usuario logueado */}
      <div className="mx-3 mb-3 p-4 bg-white/5 rounded-xl">
        <p className="text-[13px] font-bold text-white truncate">admin@plataforma.com</p>
        <p className="text-[10px] font-bold text-brand-camel uppercase tracking-wider mt-0.5">Super Admin</p>
        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Cuenta principal</p>
      </div>

      {/* Cerrar sesión */}
      <div className="px-3 pb-6">
        <button className="flex items-center gap-3 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg w-full transition-colors">
          <LogOut size={16} />
          <span className="font-bold text-[13px]">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
