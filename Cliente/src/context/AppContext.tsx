'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Store, User, Product, Quote, Order, View } from '../types';
import {
  getStoredCustomerStore,
  getStoredCustomerToken,
  getStoredCustomerUser,
  setStoredCustomerStore,
  setStoredCustomerToken,
  setStoredCustomerUser,
} from '../lib/session';

interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  customerToken: string | null;
  setCustomerToken: (token: string | null) => void;
  pendingView: View | null;
  setPendingView: (view: View | null) => void;
  logout: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedQuote: Quote | null;
  setSelectedQuote: (quote: Quote | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<View>(View.DIRECTORY);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  const [pendingView, setPendingView] = useState<View | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Rehidratar sesión de cliente desde localStorage al montar (F5)
  useEffect(() => {
    const storedStore = getStoredCustomerStore();
    const storedUser = getStoredCustomerUser();
    const storedToken = getStoredCustomerToken();
    if (storedStore) setSelectedStore(storedStore);
    if (storedUser) setCurrentUser(storedUser);
    if (storedToken) setCustomerToken(storedToken);
    setHydrated(true);
  }, []);

  // Persistir tienda seleccionada
  useEffect(() => {
    if (!hydrated) return;
    setStoredCustomerStore(selectedStore);
  }, [selectedStore, hydrated]);

  // Persistir usuario y token de sesión del cliente
  useEffect(() => {
    if (!hydrated) return;
    setStoredCustomerUser(currentUser);
  }, [currentUser, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setStoredCustomerToken(customerToken);
  }, [customerToken, hydrated]);

  const logout = () => {
    setCurrentUser(null);
    setCustomerToken(null);
  };

  // Helper to calculate perceptual brightness of a hex color
  const getBrightness = (hexColor: string): number => {
    const hex = hexColor.replace('#', '');
    if (hex.length !== 6) return 0;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return 0;
    // Standard HSP / YIQ formula
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Function to darken a color to guarantee at least 4.5:1 text contrast on white
  const adjustColorContrast = (hexColor: string, targetBrightness = 110): string => {
    const currentBrightness = getBrightness(hexColor);
    if (currentBrightness <= targetBrightness) {
      return hexColor; // No adjustment needed
    }
    
    const hex = hexColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    const factor = targetBrightness / currentBrightness;
    r = Math.max(0, Math.min(255, Math.floor(r * factor)));
    g = Math.max(0, Math.min(255, Math.floor(g * factor)));
    b = Math.max(0, Math.min(255, Math.floor(b * factor)));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (selectedStore) {
      const primary = selectedStore.primaryColor || selectedStore.color;
      const secondary = selectedStore.secondaryColor || '#86916B';
      const tertiary = selectedStore.tertiaryColor || '#BDA37D';

      document.documentElement.style.setProperty('--color-primary', primary);
      document.documentElement.style.setProperty('--color-secondary', secondary);
      document.documentElement.style.setProperty('--color-tertiary', tertiary);

      // Calcular perceptibilidad de brillo YIQ para garantizar contraste WCAG >= 4.5:1
      const pBright = getBrightness(primary);
      const sBright = getBrightness(secondary);
      const tBright = getBrightness(tertiary);

      const colorTextOnPrimary = pBright > 140 ? '#1a1a1a' : '#ffffff';
      const colorTextOnSecondary = sBright > 140 ? '#1a1a1a' : '#ffffff';
      const colorTextOnTertiary = tBright > 140 ? '#1a1a1a' : '#ffffff';

      document.documentElement.style.setProperty('--color-text-on-primary', colorTextOnPrimary);
      document.documentElement.style.setProperty('--color-text-on-secondary', colorTextOnSecondary);
      document.documentElement.style.setProperty('--color-text-on-tertiary', colorTextOnTertiary);

      // Compatibilidad con AGENTS.md
      document.documentElement.style.setProperty('--text-on-primary', colorTextOnPrimary);
      document.documentElement.style.setProperty('--text-on-secondary', colorTextOnSecondary);
      document.documentElement.style.setProperty('--text-on-tertiary', colorTextOnTertiary);

      // Ajuste automático de contraste para cuando se pinta texto sobre fondo blanco/claro
      const primaryText = adjustColorContrast(primary, 110);
      const secondaryText = adjustColorContrast(secondary, 110);
      const tertiaryText = adjustColorContrast(tertiary, 110);

      document.documentElement.style.setProperty('--color-primary-text', primaryText);
      document.documentElement.style.setProperty('--color-secondary-text', secondaryText);
      document.documentElement.style.setProperty('--color-tertiary-text', tertiaryText);

      // Compatibilidad regresiva con herencia de estilos
      document.documentElement.style.setProperty('--color-camel', tertiary);
      document.documentElement.style.setProperty('--color-olive', secondary);
      document.documentElement.style.setProperty('--color-camel-light', `${tertiary}22`);
    } else {
      document.documentElement.style.setProperty('--color-primary', '#000000');
      document.documentElement.style.setProperty('--color-secondary', '#86916B');
      document.documentElement.style.setProperty('--color-tertiary', '#BDA37D');
      document.documentElement.style.setProperty('--color-text-on-primary', '#ffffff');
      document.documentElement.style.setProperty('--color-text-on-secondary', '#ffffff');
      document.documentElement.style.setProperty('--color-text-on-tertiary', '#ffffff');
      document.documentElement.style.setProperty('--text-on-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-on-secondary', '#ffffff');
      document.documentElement.style.setProperty('--text-on-tertiary', '#ffffff');
      document.documentElement.style.setProperty('--color-primary-text', '#1a1a1a');
      document.documentElement.style.setProperty('--color-secondary-text', '#475569');
      document.documentElement.style.setProperty('--color-tertiary-text', '#BDA37D');
      document.documentElement.style.setProperty('--color-camel', '#BDA37D');
      document.documentElement.style.setProperty('--color-olive', '#86916B');
      document.documentElement.style.setProperty('--color-camel-light', '#D1C0A5');
    }
  }, [selectedStore]);

  const addToCart = (item: any) => {
    setCartItems(prev => [...prev, { ...item, id: `cart_${Date.now()}` }]);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedStore,
        setSelectedStore,
        currentUser,
        setCurrentUser,
        customerToken,
        setCustomerToken,
        pendingView,
        setPendingView,
        logout,
        selectedProduct,
        setSelectedProduct,
        selectedQuote,
        setSelectedQuote,
        selectedOrder,
        setSelectedOrder,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
