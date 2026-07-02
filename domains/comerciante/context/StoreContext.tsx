'use client';
import { merchantApi, merchantSession, isTokenExpired, MerchantUser, BulkUploadResult } from '@/domains/comerciante/lib/api';
import { Discount, Order, Product, Quote, Store } from '@/domains/comerciante/lib/types';
import { messageFromError } from '@/domains/shared/errors';
import { useAutoRefresh } from '@/domains/shared/hooks/useAutoRefresh';
import { usePathname } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface RefreshDataOptions {
  background?: boolean;
}

interface StoreState {
  products: Product[];
  orders: Order[];
  quotes: Quote[];
  discounts: Discount[];
  store: Store;
  stores: Store[];
  user: MerchantUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  apiError: string | null;
  selectStore: (store: Store) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshData: (options?: RefreshDataOptions) => Promise<void>;
  updateProfile: (updates: Partial<MerchantUser>) => Promise<MerchantUser>;
  updatePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  addProduct: (product: Product | Omit<Product, 'id'>) => Promise<Product | void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | void>;
  deleteProduct: (id: string) => Promise<void>;
  bulkUploadProducts: (productsCsv: File, imagesZip?: File) => Promise<BulkUploadResult>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<Order | void>;
  updateQuote: (id: string, updates: Partial<Quote>) => Promise<Quote | void>;
  addDiscount: (discount: Omit<Discount, 'id' | 'usageCount'> & Partial<Pick<Discount, 'id' | 'usageCount'>>) => Promise<Discount | void>;
  updateDiscount: (id: string, updates: Partial<Discount>) => Promise<Discount | void>;
  deleteDiscount: (id: string) => Promise<void>;
  addStore: (store: Omit<Store, 'id'>) => Promise<Store>;
  saveStore: (store: Store) => Promise<Store>;
  saveStoreWithLogo: (store: Store, logo: File) => Promise<Store>;
  deleteStore: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const LEGACY_STORE_KEY = 'mc_store';
const STORE_ID_KEY = 'mc_store_id';
const MAX_DISCOUNTS_PER_STORE = 5;

const emptyStore: Store = {
  id: '',
  name: '',
  type: '',
  status: 'Inactiva',
  palette: '#000000',
  description: '',
  customizationIncrement: 10,
  colors: {
    primary: 'ONYX_BLACK',
    secondary: 'SLATE',
    tertiary: 'RAW_GOLD'
  }
};

const localPreviewLogo = (store: Store) => {
  const value = store.logoUrl || store.logo || '';
  return value.startsWith('data:') || value.startsWith('blob:') ? value : '';
};

const preserveLocalPreviewLogo = (source: Store, saved: Store) => {
  const previewLogo = localPreviewLogo(source);
  if (!previewLogo || saved.logoUrl || saved.logo) return saved;
  return {
    ...saved,
    logo: previewLogo,
    logoUrl: previewLogo
  };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [store, setStore] = useState<Store>(emptyStore);
  const [user, setUser] = useState<MerchantUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const hasBackendSession = Boolean(token);
  const isAuthenticated = Boolean(token);

  const getPersistedStoreId = () => {
    if (typeof window === 'undefined') return null;
    const savedId = localStorage.getItem(STORE_ID_KEY);
    if (savedId) return savedId;
    const legacyStore = localStorage.getItem(LEGACY_STORE_KEY);
    if (!legacyStore) return null;
    try {
      return JSON.parse(legacyStore)?.id ?? null;
    } catch {
      return null;
    }
  };

  const persistSelectedStoreId = (nextStore: Store) => {
    if (typeof window === 'undefined') return;
    if (nextStore.id) localStorage.setItem(STORE_ID_KEY, nextStore.id);
    else localStorage.removeItem(STORE_ID_KEY);
    localStorage.removeItem(LEGACY_STORE_KEY);
  };

  const loadScopedData = useCallback(async (storeId: string, options: RefreshDataOptions = {}) => {
    if (!merchantSession.getToken()) return;
    const background = Boolean(options.background);
    if (!background) {
      setIsLoading(true);
      setApiError(null);
    }
    try {
      const [nextProducts, nextOrders, nextQuotes, nextDiscounts] = await Promise.all([
        merchantApi.products(storeId),
        merchantApi.orders(storeId),
        merchantApi.quotes(storeId),
        merchantApi.discounts(storeId)
      ]);
      setProducts(nextProducts);
      setOrders(nextOrders);
      setQuotes(nextQuotes);
      setDiscounts(nextDiscounts);
    } catch (error) {
      if (background) return;
      setApiError(messageFromError(error, 'No se pudo cargar la información de la tienda'));
    } finally {
      if (!background) setIsLoading(false);
    }
  }, []);

  const initializeSession = useCallback(async () => {
    if (!merchantSession.getToken()) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const [profile, backendStores] = await Promise.all([
        merchantApi.profile(),
        merchantApi.stores()
      ]);
      const savedStoreId = getPersistedStoreId();
      const selectedStore = backendStores.find(item => item.id === savedStoreId) || backendStores[0] || emptyStore;

      setUser(profile);
      setStores(backendStores);
      setStore(selectedStore);
      persistSelectedStoreId(selectedStore);
      if (!selectedStore.id) {
        setProducts([]);
        setOrders([]);
        setQuotes([]);
        setDiscounts([]);
      }
    } catch (error) {
      setApiError(messageFromError(error, 'No se pudo iniciar la sesión del comerciante'));
      merchantSession.clear();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    merchantSession.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORE_ID_KEY);
      localStorage.removeItem(LEGACY_STORE_KEY);
    }
    setToken(null);
    setUser(null);
    setProducts([]);
    setOrders([]);
    setQuotes([]);
    setDiscounts([]);
    setStores([]);
    setStore(emptyStore);
  }, []);

  // Hidratación inicial: solo se considera autenticado si hay un token válido (no vencido).
  useEffect(() => {
    const savedToken = merchantSession.getToken();
    if (!savedToken || isTokenExpired(savedToken)) {
      // Sin token o token vencido/malformado: limpiar cualquier rastro de sesión.
      clearSession();
      setIsAuthInitialized(true);
      return;
    }

    setToken(savedToken);
    setIsAuthInitialized(true);
  }, [clearSession]);

  // Sesión expirada detectada por una request 401/403: limpiar y volver a estado deslogueado.
  useEffect(() => {
    const onSessionExpired = () => clearSession();
    window.addEventListener('merchant:session-expired', onSessionExpired);
    return () => window.removeEventListener('merchant:session-expired', onSessionExpired);
  }, [clearSession]);

  useEffect(() => {
    if (token) {
      initializeSession();
    }
  }, [token, initializeSession]);

  useEffect(() => {
    if (store?.id) {
      persistSelectedStoreId(store);
    }
  }, [store]);

  useEffect(() => {
    if (store?.id && hasBackendSession) {
      loadScopedData(store.id);
    }
  }, [store.id, hasBackendSession, loadScopedData]);

  const refreshIntervalMs = React.useMemo(() => {
    if (!pathname) return null;
    if (pathname.startsWith('/comerciante/quotes') || pathname.startsWith('/comerciante/orders')) return 6000;
    if (pathname === '/comerciante' || pathname.startsWith('/comerciante/dashboard')) return 8000;
    if (
      pathname.startsWith('/comerciante/products') ||
      pathname.startsWith('/comerciante/discounts') ||
      pathname.startsWith('/comerciante/carga-masiva')
    ) {
      return 15000;
    }
    return null;
  }, [pathname]);

  useAutoRefresh({
    enabled: Boolean(hasBackendSession && store.id && refreshIntervalMs),
    intervalMs: refreshIntervalMs,
    onRefresh: () => loadScopedData(store.id, { background: true }),
  });

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const result = await merchantApi.login(email, password);
      setToken(result.token);
      setUser(result.user);
    } catch (error) {
      const message = messageFromError(error, 'No se pudo iniciar sesión');
      setApiError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const selectStore = useCallback((nextStore: Store) => {
    setStore(nextStore);
    persistSelectedStoreId(nextStore);
  }, []);

  const refreshData = useCallback(async (options: RefreshDataOptions = {}) => {
    if (!hasBackendSession || !store.id) return;
    await loadScopedData(store.id, options);
  }, [hasBackendSession, loadScopedData, store.id]);

  const updateProfile = useCallback(async (updates: Partial<MerchantUser>) => {
    if (!hasBackendSession) throw new Error('Debes iniciar sesión como comerciante.');
    const updated = await merchantApi.updateProfile(updates);
    setUser(updated);
    return updated;
  }, [hasBackendSession]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!hasBackendSession) throw new Error('Debes iniciar sesión como comerciante.');
    await merchantApi.updatePassword(currentPassword, newPassword, confirmPassword);
  }, [hasBackendSession]);

  const addProduct = useCallback(async (p: Product | Omit<Product, 'id'>) => {
    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');
    const created = await merchantApi.createProduct(p, store.id);
    setProducts(prev => [created, ...prev]);
    await loadScopedData(store.id, { background: true });
    return created;
  }, [hasBackendSession, loadScopedData, store.id]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const current = products.find(item => item.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };

    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');

    const onlyStatus = Object.keys(updates).length === 1 && updates.status;
    const canPatchActive = onlyStatus && (updates.status === 'Activo' || updates.status === 'Inactivo');
    const updated = onlyStatus
      && canPatchActive
      ? await merchantApi.updateProductActive(id, activeFromProductStatus(updates.status), store.id)
      : await merchantApi.updateProduct(merged, store.id);
    setProducts(prev => prev.map(item => item.id === id ? updated : item));
    await loadScopedData(store.id, { background: true });
    return updated;
  }, [hasBackendSession, loadScopedData, products, store.id]);

  const deleteProduct = useCallback(async (id: string) => {
    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');
    await merchantApi.deleteProduct(id, store.id);
    await loadScopedData(store.id, { background: true });
    setProducts(prev => prev.filter(item => item.id !== id));
  }, [hasBackendSession, loadScopedData, store.id]);

  const bulkUploadProducts = useCallback(async (productsCsv: File, imagesZip?: File) => {
    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');
    const result = await merchantApi.bulkProducts(productsCsv, imagesZip, store.id);
    await loadScopedData(store.id, { background: true });
    return result;
  }, [hasBackendSession, loadScopedData, store.id]);

  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    const current = orders.find(order => order.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };
    if (!updates.status) {
      setOrders(prev => prev.map(order => order.id === id ? merged : order));
      return merged;
    }
    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');
    const updated = await merchantApi.updateOrderStatus(id, updates.status, store.id);
    setOrders(prev => prev.map(order => order.id === id ? updated : order));
    await loadScopedData(store.id, { background: true });
    return updated;
  }, [hasBackendSession, loadScopedData, orders, store.id]);

  const updateQuote = useCallback(async (id: string, updates: Partial<Quote>) => {
    const current = quotes.find(quote => quote.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };
    if (!updates.status) {
      setQuotes(prev => prev.map(quote => quote.id === id ? merged : quote));
      return merged;
    }
    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');
    const updated = await merchantApi.updateQuoteStatus(id, updates.status, updates.observations, store.id);
    setQuotes(prev => prev.map(quote => quote.id === id ? updated : quote));
    await loadScopedData(store.id, { background: true });
    return updated;
  }, [hasBackendSession, loadScopedData, quotes, store.id]);

  const addDiscount = useCallback(async (d: Omit<Discount, 'id' | 'usageCount'> & Partial<Pick<Discount, 'id' | 'usageCount'>>) => {
    if (discounts.length >= MAX_DISCOUNTS_PER_STORE) {
      throw new Error('Solo puedes configurar hasta 5 descuentos por tienda');
    }
    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');
    const created = await merchantApi.createDiscount(d, store.id);
    setDiscounts(prev => [...prev, created]);
    await loadScopedData(store.id, { background: true });
    return created;
  }, [discounts.length, hasBackendSession, loadScopedData, store.id]);

  const updateDiscount = useCallback(async (id: string, updates: Partial<Discount>) => {
    const current = discounts.find(item => item.id === id);
    const merged = { ...(current || {}), ...updates } as Discount;
    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');
    const updated = await merchantApi.updateDiscount(id, merged, store.id);
    setDiscounts(prev => prev.map(disc => disc.id === id ? updated : disc));
    await loadScopedData(store.id, { background: true });
    return updated;
  }, [discounts, hasBackendSession, loadScopedData, store.id]);

  const deleteDiscount = useCallback(async (id: string) => {
    if (!hasBackendSession || !store.id) throw new Error('Debes iniciar sesión y seleccionar una tienda.');
    await merchantApi.deleteDiscount(id, store.id);
    await loadScopedData(store.id, { background: true });
    setDiscounts(prev => prev.filter(disc => disc.id !== id));
  }, [hasBackendSession, loadScopedData, store.id]);

  const addStore = useCallback(async (s: Omit<Store, 'id'>) => {
    if (!hasBackendSession) throw new Error('Debes iniciar sesión como comerciante para crear una tienda.');
    const created = await merchantApi.createStore(s);
    setStores(prev => [...prev, created]);
    return created;
  }, [hasBackendSession]);

  const saveStore = useCallback(async (s: Store) => {
    if (!hasBackendSession) throw new Error('Debes iniciar sesión como comerciante para editar una tienda.');
    const updated = preserveLocalPreviewLogo(s, await merchantApi.updateStore(s));
    setStores(prev => prev.map(item => item.id === updated.id ? updated : item));
    setStore(updated);
    return updated;
  }, [hasBackendSession]);

  const saveStoreWithLogo = useCallback(async (s: Store, logo: File) => {
    if (!hasBackendSession) throw new Error('Debes iniciar sesión como comerciante para editar una tienda.');
    const updated = await merchantApi.updateStoreWithLogo(s, logo);
    setStores(prev => prev.map(item => item.id === updated.id ? updated : item));
    setStore(updated);
    return updated;
  }, [hasBackendSession]);

  const deleteStore = useCallback(async (id: string) => {
    if (!hasBackendSession) throw new Error('Debes iniciar sesión como comerciante para eliminar una tienda.');
    await merchantApi.deleteStore(id);
    setStores(prev => prev.filter(item => item.id !== id));
    if (store.id === id) {
      const nextStore = stores.find(item => item.id !== id) || emptyStore;
      setStore(nextStore);
    }
  }, [hasBackendSession, store.id, stores]);

  return (
    <StoreContext.Provider value={{
      products, orders, quotes, discounts, store, stores, user, isLoading, isAuthenticated, isAuthInitialized, apiError,
      selectStore,
      login, logout, refreshData, updateProfile, updatePassword,
      addProduct, updateProduct, deleteProduct, bulkUploadProducts,
      updateOrder, updateQuote, addDiscount, updateDiscount, deleteDiscount,
      addStore, saveStore, saveStoreWithLogo, deleteStore
    }}>
      {children}
    </StoreContext.Provider>
  );
};

const activeFromProductStatus = (status?: Product['status']) =>
  status === 'Activo';

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
