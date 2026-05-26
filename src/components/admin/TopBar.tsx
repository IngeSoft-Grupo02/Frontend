'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import { User, ChevronDown, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Obtener título y subtítulo según la ruta
  const getPageMeta = () => {
    if (pathname === '/admin') return { title: 'PANEL', subtitle: 'Visión ejecutiva del ecosistema multi-tenant' };
    if (pathname === '/admin/tiendas') return { title: 'Tiendas registradas', subtitle: 'Listado general de tenants con estado operativo' };
    if (pathname === '/admin/usuarios') return { title: 'Gestión de usuarios', subtitle: 'Control de acceso por rol y tenant' };
    if (pathname === '/admin/carga-masiva') return { title: 'Carga masiva', subtitle: 'Sube uno o varios archivos en una misma operación.' };
    if (pathname === '/admin/categorias') return { title: 'Categorías', subtitle: 'Estandarización transversal para todas las tiendas' };
    if (pathname === '/admin/auditoria') return { title: 'Auditoría y logs', subtitle: 'Monitoreo crítico, trazabilidad y exportación' };
    if (pathname === '/admin/perfil') return { title: 'Configuración de cuenta', subtitle: 'Personaliza tu experiencia y seguridad' };
    if (pathname === '/admin/parametros') return { title: 'Parámetros', subtitle: 'Configuración global del sistema' };
    return { title: 'Kingstore', subtitle: 'Plataforma administrativa' };
  };

  const { title, subtitle } = getPageMeta();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-20 fixed top-0 right-0 left-[280px] z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-8 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-[20px] font-display font-extrabold tracking-tight text-neutral-900 leading-tight">
          {title}
        </h1>
        <p className="text-[12px] font-medium text-neutral-400">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-8 w-px bg-neutral-100 mx-1"></div>

        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 pr-1 py-1.5 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-brand-beige-dark flex items-center justify-center overflow-hidden border border-neutral-100">
                <User size={18} className="text-neutral-600" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[13px] font-bold text-neutral-900 leading-none">
                {currentUser?.name || 'Admin'}
              </p>
              <p className="text-[10px] font-medium text-neutral-400 mt-0.5 tracking-wide uppercase">
                {currentUser?.role || 'ADMINISTRADOR'}
              </p>
            </div>
            <ChevronDown 
              size={14} 
              className={`text-neutral-400 ml-1 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
            />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-neutral-100 shadow-xl z-40 overflow-hidden py-2"
                >
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/admin/perfil');
                    }}
                    className="w-full px-4 py-2.5 text-[13px] font-bold text-neutral-700 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left cursor-pointer"
                  >
                    <Settings size={16} className="text-neutral-400" />
                    Mi cuenta
                  </button>
                  <div className="h-px bg-neutral-50 mx-2 my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-[13px] font-bold text-red-500 flex items-center gap-3 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}