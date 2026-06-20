'use client';

import {
  ChevronRight,
  History,
  LayoutDashboard,
  Store,
  Tag,
  UploadCloud,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';

const NAV_ITEMS = [
  { id: 'dashboard', path: ADMIN_ROUTES.dashboard, label: 'PANEL', icon: LayoutDashboard },
  { id: 'stores', path: ADMIN_ROUTES.stores, label: 'Tiendas', icon: Store },
  { id: 'users', path: ADMIN_ROUTES.users, label: 'Usuarios', icon: Users },
  { id: 'bulk', path: ADMIN_ROUTES.bulk, label: 'Carga masiva', icon: UploadCloud },
  { id: 'categories', path: ADMIN_ROUTES.categories, label: 'Categorías', icon: Tag },
  { id: 'audit', path: ADMIN_ROUTES.audit, label: 'Auditoría', icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] bg-white h-screen flex flex-col p-8 fixed left-0 top-0 z-50 border-r border-neutral-100">
      <div className="mb-12">
        <h1 className="text-[28px] font-display font-extrabold tracking-tight text-brand-black">
          Admin
        </h1>
        <p className="text-[12px] font-medium text-neutral-400 -mt-1">Centro de control</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl group transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-black text-white' 
                  : 'text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[13px] font-extrabold uppercase tracking-tight`}>
                  {item.label}
                </span>
              </div>
              {isActive && <ChevronRight size={14} className="text-neutral-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <div className="bg-[#f1ede4] p-4 rounded-2xl flex flex-col gap-1 border border-neutral-100 shadow-sm">
          <p className="text-[12px] font-bold text-neutral-800 break-all">admin@plataforma.com</p>
          <div className="flex">
            <span className="bg-[#e2ead8] text-[#6d7a5b] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Super admin
            </span>
          </div>
          <p className="text-[10px] font-medium text-neutral-400 mt-1 uppercase">Entorno global</p>
        </div>
      </div>
    </aside>
  );
}
