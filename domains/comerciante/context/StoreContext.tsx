'use client';
import { mockDiscounts, mockOrders, mockProducts, mockQuotes, mockStores } from '@/domains/comerciante/lib/mockData';
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
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  setUser: React.Dispatch<React.SetStateAction<MerchantUser | null>>;
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
  addDiscount: (discount: Discount) => Promise<Discount | void>;
  updateDiscount: (id: string, updates: Partial<Discount>) => Promise<Discount | void>;
  deleteDiscount: (id: string) => Promise<void>;
  addStore: (store: Omit<Store, 'id'>) => Promise<Store | void>;
  saveStore: (store: Store) => Promise<Store | void>;
  deleteStore: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const USER_KEY = 'mc_user';
const STORE_KEY = 'mc_store';
const STORE_SYNC_MODE = process.env.NEXT_PUBLIC_MERCHANT_STORE_SYNC_MODE || 'local';
const MAX_DISCOUNTS_PER_STORE = 5;

const fallbackStore = mockStores[0];

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
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [store, setStore] = useState<Store>(fallbackStore);
  const [user, setUser] = useState<MerchantUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const hasBackendSession = Boolean(token);
  const isAuthenticated = Boolean(token);
  const shouldUseStoreApi = STORE_SYNC_MODE === 'api';
  const shouldSyncStoresWithBackend = hasBackendSession && shouldUseStoreApi;

  const persistUser = (nextUser: MerchantUser | null) => {
    if (nextUser) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      sessionStorage.removeItem(USER_KEY);
    }
  };

  const persistStore = (nextStore: Store) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(nextStore));
  };

  const createLocalStore = (s: Omit<Store, 'id'>) => ({
    ...s,
    id: `ST-${Math.floor(Math.random() * 1000000)}`
  });

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
      const savedStore = localStorage.getItem(STORE_KEY);
      const savedStoreId = savedStore ? JSON.parse(savedStore)?.id : null;
      const selectedStore = backendStores.find(item => item.id === savedStoreId) || backendStores[0] || fallbackStore;

      setUser(profile);
      persistUser(profile);
      setStores(backendStores.length > 0 ? backendStores : mockStores);
      setStore(selectedStore);
      persistStore(selectedStore);
      await loadScopedData(selectedStore.id);
    } catch (error) {
      setApiError(messageFromError(error, 'No se pudo iniciar la sesión del comerciante'));
      merchantSession.clear();
      setToken(null);
      setUser(null);
      persistUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadScopedData]);

  const clearSession = useCallback(() => {
    merchantSession.clear();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(USER_KEY);
      localStorage.removeItem(STORE_KEY);
    }
    setToken(null);
    setUser(null);
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

    const savedUser = sessionStorage.getItem(USER_KEY);
    const savedStore = localStorage.getItem(STORE_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedStore) setStore(JSON.parse(savedStore));
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
      persistStore(store);
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
      persistUser(result.user);
      await initializeSession();
    } catch (error) {
      const message = messageFromError(error, 'No se pudo iniciar sesión');
      setApiError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [initializeSession]);

  const logout = useCallback(() => {
    merchantSession.clear();
    setToken(null);
    setUser(null);
    persistUser(null);
    setProducts(mockProducts);
    setOrders(mockOrders);
    setQuotes(mockQuotes);
    setDiscounts(mockDiscounts);
    setStores(mockStores);
    setStore(fallbackStore);
  }, []);

  const refreshData = useCallback(async (options: RefreshDataOptions = {}) => {
    if (!hasBackendSession) return;
    await loadScopedData(store.id, options);
  }, [hasBackendSession, loadScopedData, store.id]);

  const updateProfile = useCallback(async (updates: Partial<MerchantUser>) => {
    if (!hasBackendSession) {
      const nextUser = { ...(user || { email: '', role: 'Comerciante', name: '' }), ...updates } as MerchantUser;
      setUser(nextUser);
      persistUser(nextUser);
      return nextUser;
    }
    const updated = await merchantApi.updateProfile(updates);
    setUser(updated);
    persistUser(updated);
    return updated;
  }, [hasBackendSession, user]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!hasBackendSession) return;
    await merchantApi.updatePassword(currentPassword, newPassword, confirmPassword);
  }, [hasBackendSession]);

  const addProduct = useCallback(async (p: Product | Omit<Product, 'id'>) => {
    if (!hasBackendSession) {
      const newProduct = 'id' in p ? p : { ...p, id: `PRD-${Math.floor(Math.random() * 1000000)}` };
      setProducts(prev => [newProduct as Product, ...prev]);
      return newProduct as Product;
    }
    const created = await merchantApi.createProduct(p, store.id);
    setProducts(prev => [created, ...prev]);
    await loadScopedData(store.id, { background: true });
    return created;
  }, [hasBackendSession, loadScopedData, store.id]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const current = products.find(item => item.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };

    if (!hasBackendSession) {
      setProducts(prev => prev.map(item => item.id === id ? merged : item));
      return merged;
    }

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
    if (hasBackendSession) {
      await merchantApi.deleteProduct(id, store.id);
      await loadScopedData(store.id, { background: true });
    }
    setProducts(prev => prev.filter(item => item.id !== id));
  }, [hasBackendSession, loadScopedData, store.id]);

  const bulkUploadProducts = useCallback(async (productsCsv: File, imagesZip?: File) => {
    if (!hasBackendSession) {
      return { productsCreated: 0, variantsProcessed: 0, imagesUploaded: 0, errors: [] };
    }
    const result = await merchantApi.bulkProducts(productsCsv, imagesZip, store.id);
    await loadScopedData(store.id, { background: true });
    return result;
  }, [hasBackendSession, loadScopedData, store.id]);

  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    const current = orders.find(order => order.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };
    if (!hasBackendSession || !updates.status) {
      setOrders(prev => prev.map(order => order.id === id ? merged : order));
      return merged;
    }
    const updated = await merchantApi.updateOrderStatus(id, updates.status, store.id);
    setOrders(prev => prev.map(order => order.id === id ? updated : order));
    await loadScopedData(store.id, { background: true });
    return updated;
  }, [hasBackendSession, loadScopedData, orders, store.id]);

  const updateQuote = useCallback(async (id: string, updates: Partial<Quote>) => {
    const current = quotes.find(quote => quote.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };
    if (!hasBackendSession || !updates.status) {
      setQuotes(prev => prev.map(quote => quote.id === id ? merged : quote));
      return merged;
    }
    const updated = await merchantApi.updateQuoteStatus(id, updates.status, updates.observations, store.id);
    setQuotes(prev => prev.map(quote => quote.id === id ? updated : quote));
    await loadScopedData(store.id, { background: true });
    return updated;
  }, [hasBackendSession, loadScopedData, quotes, store.id]);

  const addDiscount = useCallback(async (d: Discount) => {
    if (discounts.length >= MAX_DISCOUNTS_PER_STORE) {
      throw new Error('Solo puedes configurar hasta 5 descuentos por tienda');
    }
    if (!hasBackendSession) {
      setDiscounts(prev => [...prev, d]);
      return d;
    }
    const created = await merchantApi.createDiscount(d, store.id);
    setDiscounts(prev => [...prev, created]);
    await loadScopedData(store.id, { background: true });
    return created;
  }, [discounts.length, hasBackendSession, loadScopedData, store.id]);

  const updateDiscount = useCallback(async (id: string, updates: Partial<Discount>) => {
    const current = discounts.find(item => item.id === id);
    const merged = { ...(current || {}), ...updates } as Discount;
    if (!hasBackendSession) {
      setDiscounts(prev => prev.map(disc => disc.id === id ? merged : disc));
      return merged;
    }
    const updated = await merchantApi.updateDiscount(id, merged, store.id);
    setDiscounts(prev => prev.map(disc => disc.id === id ? updated : disc));
    await loadScopedData(store.id, { background: true });
    return updated;
  }, [discounts, hasBackendSession, loadScopedData, store.id]);

  const deleteDiscount = useCallback(async (id: string) => {
    if (hasBackendSession) {
      await merchantApi.deleteDiscount(id, store.id);
      await loadScopedData(store.id, { background: true });
    }
    setDiscounts(prev => prev.filter(disc => disc.id !== id));
  }, [hasBackendSession, loadScopedData, store.id]);

  const addStore = useCallback(async (s: Omit<Store, 'id'>) => {
    if (shouldUseStoreApi && !hasBackendSession) {
      throw new Error('Debes iniciar sesión como comerciante para crear una tienda en la base de datos.');
    }
    if (!shouldSyncStoresWithBackend) {
      const newStore: Store = createLocalStore(s);
      setStores(prev => [...prev, newStore]);
      return newStore;
    }
    const created = await merchantApi.createStore(s);
    setStores(prev => [...prev, created]);
    return created;
  }, [hasBackendSession, shouldSyncStoresWithBackend, shouldUseStoreApi]);

  const saveStore = useCallback(async (s: Store) => {
    if (!hasBackendSession) {
      setStores(prev => prev.map(item => item.id === s.id ? s : item));
      setStore(s);
      return s;
    }
    const updated = preserveLocalPreviewLogo(s, await merchantApi.updateStore(s));
    setStores(prev => prev.map(item => item.id === updated.id ? updated : item));
    setStore(updated);
    return updated;
  }, [hasBackendSession]);

  const deleteStore = useCallback(async (id: string) => {
    if (shouldUseStoreApi && !hasBackendSession) {
      throw new Error('Debes iniciar sesión como comerciante para eliminar una tienda en la base de datos.');
    }
    if (shouldSyncStoresWithBackend) {
      await merchantApi.deleteStore(id);
    }
    setStores(prev => prev.filter(item => item.id !== id));
    if (store.id === id) {
      const nextStore = stores.find(item => item.id !== id) || fallbackStore;
      setStore(nextStore);
    }
  }, [hasBackendSession, shouldSyncStoresWithBackend, shouldUseStoreApi, store.id, stores]);

  return (
    <StoreContext.Provider value={{
      products, orders, quotes, discounts, store, stores, user, isLoading, isAuthenticated, isAuthInitialized, apiError,
      setProducts, setOrders, setQuotes, setDiscounts, setStore, setStores, setUser,
      login, logout, refreshData, updateProfile, updatePassword,
      addProduct, updateProduct, deleteProduct, bulkUploadProducts,
      updateOrder, updateQuote, addDiscount, updateDiscount, deleteDiscount,
      addStore, saveStore, deleteStore
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
