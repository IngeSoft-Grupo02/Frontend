'use client';
import { mockDiscounts, mockOrders, mockProducts, mockQuotes, mockStores } from '@/lib/mockData';
import { Discount, Order, Product, Quote, Store } from '@/lib/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface StoreState {
  products: Product[];
  orders: Order[];
  quotes: Quote[];
  discounts: Discount[];
  store: Store;
  stores: Store[];
  user: {
    email: string;
    role: string;
    name: string;
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    phone?: string;
  } | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  setUser: React.Dispatch<React.SetStateAction<{
    email: string;
    role: string;
    name: string;
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    phone?: string;
  } | null>>;
  addProduct: (product: Product | Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  addDiscount: (discount: Discount) => void;
  updateDiscount: (id: string, updates: Partial<Discount>) => void;
  deleteDiscount: (id: string) => void;
  addStore: (store: Omit<Store, 'id'>) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with mock data
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [store, setStore] = useState<Store>(mockStores[0]);
  const [user, setUser] = useState<{
    email: string;
    role: string;
    name: string;
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    phone?: string;
  } | null>(null);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const savedProducts = localStorage.getItem('mc_products');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      if (parsed.length > 0 && !parsed[0].sizeColorStock) {
        localStorage.removeItem('mc_products');
      } else {
        setProducts(parsed);
      }
    }

    const savedOrders = localStorage.getItem('mc_orders');
    if (savedOrders) {
      const parsed = JSON.parse(savedOrders);
      if (parsed.length > 0 && !parsed[0].storeId) {
        localStorage.removeItem('mc_orders');
      } else {
        setOrders(parsed);
      }
    }

    const savedQuotes = localStorage.getItem('mc_quotes');
    if (savedQuotes) {
      const parsed = JSON.parse(savedQuotes);
      if (parsed.length > 0 && !parsed[0].storeId) {
        localStorage.removeItem('mc_quotes');
      } else {
        setQuotes(parsed);
      }
    }

    const savedDiscounts = localStorage.getItem('mc_discounts');
    if (savedDiscounts) {
      setDiscounts(JSON.parse(savedDiscounts));
    }

    const savedStores = localStorage.getItem('mc_stores');
    if (savedStores) {
      setStores(JSON.parse(savedStores));
    }

    const savedStore = localStorage.getItem('mc_store');
    if (savedStore) {
      setStore(JSON.parse(savedStore));
    }

    const savedUser = sessionStorage.getItem('mc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => localStorage.setItem('mc_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('mc_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('mc_quotes', JSON.stringify(quotes)), [quotes]);
  useEffect(() => localStorage.setItem('mc_discounts', JSON.stringify(discounts)), [discounts]);
  useEffect(() => localStorage.setItem('mc_stores', JSON.stringify(stores)), [stores]);
  useEffect(() => localStorage.setItem('mc_store', JSON.stringify(store)), [store]);
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('mc_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('mc_user');
    }
  }, [user]);

  const addProduct = useCallback((p: Product | Omit<Product, 'id'>) => {
    const newProduct = 'id' in p ? p : { ...p, id: `PRD-${Math.floor(Math.random() * 1000000)}` };
    setProducts(prev => [newProduct as Product, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, ...updates } : order));
  }, []);

  const updateQuote = useCallback((id: string, updates: Partial<Quote>) => {
    setQuotes(prev => prev.map(quote => quote.id === id ? { ...quote, ...updates } : quote));
  }, []);

  const addDiscount = (d: Discount) => setDiscounts(prev => [d, ...prev]);
  
  const updateDiscount = (id: string, updates: Partial<Discount>) => {
    setDiscounts(prev => prev.map(disc => disc.id === id ? { ...disc, ...updates } : disc));
  };

  const deleteDiscount = (id: string) => setDiscounts(prev => prev.filter(disc => disc.id !== id));

  const addStore = useCallback((s: Omit<Store, 'id'>) => {
    const newStore: Store = { ...s, id: `ST-${Math.floor(Math.random() * 1000000)}` };
    setStores(prev => [...prev, newStore]);
  }, []);

  return (
    <StoreContext.Provider value={{
      products, orders, quotes, discounts, store, stores, user,
      setProducts, setOrders, setQuotes, setDiscounts, setStore, setStores, setUser,
      addProduct, updateProduct, deleteProduct,
      updateOrder, updateQuote, addDiscount, updateDiscount, deleteDiscount,
      addStore
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};