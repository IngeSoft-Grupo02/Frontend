/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShoppingCart, LogOut, User, ChevronDown, ClipboardCheck, Package } from 'lucide-react';
import { Button } from '../ui/Button';
import { Store, User as UserType, View } from '../../types';
import { StoreLogo } from '../ui/StoreLogo';
import { getReadableTextColor } from '../../lib/themeContrast';

interface TopBarProps {
  store: Store | null;
  user: UserType | null;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  showSearch?: boolean;
  cartCount?: number;
  currentView?: View;
}

export const TopBar: React.FC<TopBarProps> = ({ store, user, onNavigate, onLogout, showSearch = true, cartCount = 0, currentView }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isDirectory = currentView === View.DIRECTORY || !store;
  const headerBg = isDirectory ? '#0F1011' : '#FFFFFF';
  const headerText = isDirectory ? '#FFFFFF' : '#0F1011';
  const headerBorder = isDirectory ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const isInicioActive = currentView === View.STOREFRONT_PUBLIC;
  const isCatalogActive = currentView === View.CATALOG || currentView === View.PRODUCT_DETAIL || currentView === View.REQUEST_QUOTE;
  const isQuotesActive = currentView === View.MY_QUOTES || currentView === View.QUOTE_DETAIL;
  const isOrdersActive = currentView === View.MY_ORDERS || currentView === View.ORDER_DETAIL || currentView === View.PAYMENT;

  return (
    <header className="min-h-[72px] border-b flex flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-10 py-3 sticky top-0 z-[100] justify-between transition-colors duration-300" style={{ backgroundColor: headerBg, color: headerText, borderColor: headerBorder }}>
      {/* Brand / Logo */}
      <div className="contents lg:min-w-0 lg:flex lg:flex-1 lg:flex-wrap lg:items-center lg:gap-y-3">
        <div 
          className={`order-1 flex shrink-0 items-center gap-2 sm:gap-3 cursor-pointer group pr-3 sm:pr-6 ${store ? 'w-full lg:w-auto' : ''}`}
          onClick={() => onNavigate(View.DIRECTORY)}
          style={{ color: headerText }}
        >
          <div className="logo-accent w-5 h-5 grid grid-cols-2 gap-[2px]">
            <div className="bg-olive" />
            <div className="bg-camel" />
            <div className="bg-primary" />
            <div className="bg-border-subtle" />
          </div>
          <span className="font-extrabold text-[17px] sm:text-[18px] tracking-tight">Kingstore</span>
        </div>

        {store && (
          <div className="contents lg:min-w-0 lg:flex lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-3 lg:pl-6 lg:border-l lg:h-auto" style={{ borderColor: isDirectory ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
            <div className="order-2 min-w-0 flex items-center gap-3">
              <StoreLogo
                store={store}
                className="w-8 h-8 shrink-0 rounded-lg shadow-sm animate-fade-in"
                style={{ backgroundColor: store.color }}
                fallbackClassName="font-black text-[14px]"
                fallbackStyle={{ color: getReadableTextColor(store.color || store.primaryColor || '#0F1011') }}
                objectFit="contain"
              />
              <span className="max-w-[120px] truncate font-black text-[14px] sm:max-w-[180px] sm:text-[15px]" style={{ color: headerText }}>
                {store.name}
              </span>
            </div>
            
            <nav className="order-3 flex w-full items-center justify-between gap-2 overflow-visible pt-1 lg:order-none lg:w-auto lg:justify-start lg:gap-8 lg:pt-0">
              <button 
                onClick={() => {
                  if (typeof (window as any).setShowFullCatalog === 'function') {
                    (window as any).setShowFullCatalog(false);
                  }
                  onNavigate(View.STOREFRONT_PUBLIC);
                }} 
                className={`whitespace-nowrap text-[12px] sm:text-[13px] transition-colors py-1 cursor-pointer ${isInicioActive ? 'font-black border-b-2' : 'font-bold opacity-70 hover:opacity-100'}`}
                style={isInicioActive ? { color: isDirectory ? '#FFFFFF' : 'var(--color-tertiary-text)', borderColor: isDirectory ? '#FFFFFF' : 'var(--color-tertiary)' } : { color: headerText }}
              >
                Inicio
              </button>
              <button 
                onClick={() => {
                  if (typeof (window as any).setShowFullCatalog === 'function') {
                    (window as any).setShowFullCatalog(true);
                  }
                  onNavigate(View.CATALOG);
                }} 
                className={`whitespace-nowrap text-[12px] sm:text-[13px] transition-colors py-1 cursor-pointer ${isCatalogActive ? 'font-black border-b-2' : 'font-bold opacity-70 hover:opacity-100'}`}
                style={isCatalogActive ? { color: isDirectory ? '#FFFFFF' : 'var(--color-tertiary-text)', borderColor: isDirectory ? '#FFFFFF' : 'var(--color-tertiary)' } : { color: headerText }}
              >
                Catálogo
              </button>
              <button 
                onClick={() => onNavigate(View.MY_QUOTES)} 
                className={`whitespace-nowrap text-[12px] sm:text-[13px] transition-colors py-1 cursor-pointer ${isQuotesActive ? 'font-black border-b-2' : 'font-bold opacity-70 hover:opacity-100'}`}
                style={isQuotesActive ? { color: isDirectory ? '#FFFFFF' : 'var(--color-tertiary-text)', borderColor: isDirectory ? '#FFFFFF' : 'var(--color-tertiary)' } : { color: headerText }}
              >
                Cotizaciones
              </button>
              <button 
                onClick={() => onNavigate(View.MY_ORDERS)} 
                className={`whitespace-nowrap text-[12px] sm:text-[13px] transition-colors py-1 cursor-pointer ${isOrdersActive ? 'font-black border-b-2' : 'font-bold opacity-70 hover:opacity-100'}`}
                style={isOrdersActive ? { color: isDirectory ? '#FFFFFF' : 'var(--color-tertiary-text)', borderColor: isDirectory ? '#FFFFFF' : 'var(--color-tertiary)' } : { color: headerText }}
              >
                Pedidos
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="order-2 ml-auto flex shrink-0 items-center gap-2 sm:gap-4 lg:order-none lg:gap-8">
        {currentView !== View.DIRECTORY && (
          <>
            <button 
              onClick={() => onNavigate(View.CART)}
              className="p-2 transition-all relative cursor-pointer"
              style={{ color: headerText }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-0.5 -right-0.5 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 shadow-sm animate-fade-in"
                  style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)', borderColor: headerBg }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="text-right hidden sm:block">
                    <div className="text-[13px] font-black tracking-tight" style={{ color: headerText }}>{user.name}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-1 opacity-70" style={{ color: headerText }}>
                      Mi cuenta <ChevronDown size={10} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] shadow-sm hover:opacity-85"
                    style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                  >
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-4 w-60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border overflow-hidden py-2 animate-in fade-in zoom-in duration-200 origin-top-right z-[110]"
                    style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
                  >
                    <div className="px-4 py-3 border-b mb-1" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                      <p className="text-[11px] font-black uppercase tracking-widest mb-0.5 opacity-65" style={{ color: 'var(--text-on-secondary)' }}>Tu Cuenta</p>
                      <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-on-secondary)' }}>{user.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => { onNavigate(View.PROFILE); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 text-left px-4 py-3 text-[13px] font-bold hover:opacity-80 transition-all cursor-pointer"
                      style={{ color: 'var(--text-on-secondary)' }}
                    >
                      <User size={16} className="opacity-70" /> Editar perfil
                    </button>
                    
                    <button 
                      onClick={() => { onNavigate(View.MY_QUOTES); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 text-left px-4 py-3 text-[13px] font-bold hover:opacity-80 transition-all cursor-pointer"
                      style={{ color: 'var(--text-on-secondary)' }}
                    >
                      <ClipboardCheck size={16} className="opacity-70" /> Mis cotizaciones
                    </button>
                    
                    <button 
                      onClick={() => { onNavigate(View.MY_ORDERS); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 text-left px-4 py-3 text-[13px] font-bold hover:opacity-80 transition-all cursor-pointer"
                      style={{ color: 'var(--text-on-secondary)' }}
                    >
                      <Package size={16} className="opacity-70" /> Mis pedidos
                    </button>
                    
                    <div className="mt-1 pt-1 border-t px-2" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                       <button 
                        onClick={() => { if (onLogout) onLogout(); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 text-left px-3 py-3 rounded-xl text-[13px] font-black transition-all cursor-pointer"
                        style={{ color: 'var(--error-on-secondary)' }}
                      >
                        <LogOut size={16} /> Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                <button 
                  onClick={() => onNavigate(View.AUTH_LOGIN)} 
                  className="whitespace-nowrap text-[12px] sm:text-[13px] font-black tracking-tight hover:opacity-80 transition-opacity cursor-pointer animate-fade-in"
                  style={{ color: headerText }}
                >
                  Iniciar sesión
                </button>
                <Button 
                  variant="primary" 
                  onClick={() => onNavigate(View.AUTH_REGISTER)} 
                  className="!px-4 sm:!px-6 py-2.5 rounded-xl font-black !text-[12px] sm:!text-[13px] cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: 'var(--color-tertiary)', color: 'var(--text-on-tertiary)' }}
                >
                  Registrarse
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};
