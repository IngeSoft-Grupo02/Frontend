'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order, Product, Quote, Store, User, View } from '../types';
import {
  getStoredCustomerStore,
  getStoredCustomerToken,
  getStoredCustomerUser,
  isCustomerTokenUsable,
  clearCustomerSession,
  markCustomerSessionExpired,
  setStoredCustomerStore,
  setStoredCustomerToken,
  setStoredCustomerUser,
} from '../lib/session';
import { applyThemeContrastTokens, getThemeContrastTokens } from '../lib/themeContrast';

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
  isHydrated: boolean;
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

  useEffect(() => {
    const storedStore = getStoredCustomerStore();
    const storedUser = getStoredCustomerUser();
    const storedToken = getStoredCustomerToken();
    if (storedStore) setSelectedStore(storedStore);
    if (storedUser && isCustomerTokenUsable(storedToken)) {
      setCurrentUser(storedUser);
      setCustomerToken(storedToken);
    } else if (storedUser || storedToken) {
      clearCustomerSession();
      markCustomerSessionExpired();
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredCustomerStore(selectedStore);
  }, [selectedStore, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setStoredCustomerUser(currentUser);
  }, [currentUser, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setStoredCustomerToken(customerToken);
  }, [customerToken, hydrated]);

  useEffect(() => {
    const tokens = getThemeContrastTokens({
      primary: selectedStore?.primaryColor || selectedStore?.color,
      secondary: selectedStore?.secondaryColor,
      tertiary: selectedStore?.tertiaryColor,
    });
    applyThemeContrastTokens(tokens, document.documentElement);
  }, [selectedStore]);

  const logout = () => {
    setCurrentUser(null);
    setCustomerToken(null);
  };

  const addToCart = (item: any) => {
    setCartItems((previous) => [...previous, { ...item, id: `cart_${Date.now()}` }]);
  };

  const removeFromCart = (id: string) => {
    setCartItems((previous) => previous.filter((item) => item.id !== id));
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
        isHydrated: hydrated,
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
