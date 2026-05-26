'use client';

import { useApp } from '@/context/AppContext';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TopBar() {
  const router = useRouter();
  const { currentUser, logout } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    // Aumentamos z-40 y aseguramos bg-white
    <header className="h-20 fixed top-0 right-0 left-[280px] z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-8 flex items-center justify-between shadow-sm">
      
      {/* Espacio vacío a la izquierda para alineación, o puedes poner el título aquí si quieres */}
      <div className="w-64" /> 

      <div className="flex items-center gap-6 ml-auto">
        {/* Buscador (Opcional, según prototipo) */}
        {/* <div className="relative">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
           <input className="pl-10 pr-4 h-9 bg-neutral-100 rounded-lg text-sm outline-none w-64" placeholder="Buscar..." />
        </div> */}

        <div className="h-8 w-px bg-neutral-200 mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 pr-1 py-1.5 rounded-full hover:bg-neutral-50 transition-colors"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-brand-beige-dark flex items-center justify-center overflow-hidden border border-neutral-200">
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
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-neutral-200 shadow-xl z-40 overflow-hidden py-2"
                >
                  <button 
                    className="w-full px-4 py-2.5 text-[13px] font-bold text-neutral-700 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/admin/perfil');
                    }}
                  >
                    <Settings size={16} className="text-neutral-400" />
                    Mi cuenta
                  </button>
                  <div className="h-px bg-neutral-100 mx-2 my-1" />
                  <button 
                    className="w-full px-4 py-2.5 text-[13px] font-bold text-red-500 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      router.push('/login');
                    }}
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