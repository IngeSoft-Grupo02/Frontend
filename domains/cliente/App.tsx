/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { View, Store, User, Product, Quote, Order, RegisterCustomerDTO } from './types';
import { Directory } from './views/Directory';
import { Catalog } from './views/Catalog';
import { RequestQuote } from './views/RequestQuote';
import { MyQuotes } from './views/MyQuotes';
import { QuoteDetail } from './views/QuoteDetail';
import { Payment } from './views/Payment';
import { MyOrders } from './views/MyOrders';
import { OrderDetail } from './views/OrderDetail';
import { Auth } from './views/Auth';
import { ProductDetail } from './views/ProductDetail';
import { Cart } from './views/Cart';
import { Profile } from './views/Profile';
import { TopBar } from './components/layout/TopBar';
import { Button } from './components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './context/AppContext';
import {
  addCartDesign,
  addCartItem,
  ApiError,
  createQuotation,
  fetchCart,
  fetchCustomerMe,
  fetchOrder,
  fetchQuotation,
  loginCustomer,
  registerCustomer,
  removeCartItem,
  toCartItems,
  toOrder,
  toQuote,
} from './lib/api';
import { mapCustomerToUser } from './lib/customer';
import { consumeCustomerSessionExpired } from './lib/session';
import { getColorLabel } from '../shared/colors';
import { messageFromError } from '../shared/errors';
import { useAutoRefresh } from '../shared/hooks/useAutoRefresh';
import { PROTECTED_CLIENT_VIEWS, viewToClientePath, ClienteRouteParams } from './lib/navigation';

// Vistas que requieren sesión de cliente iniciada (ya protegidas en renderCurrentView)
export default function App() {
  const {
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
    isHydrated,
  } = useApp();

  const router = useRouter();
  const pathname = usePathname();

  const activeView = pathname === '/' ? View.DIRECTORY : currentView;

  useEffect(() => {
    if (pathname === '/' && currentView !== View.DIRECTORY) {
      setCurrentView(View.DIRECTORY);
    }
  }, [pathname, currentView, setCurrentView]);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [cartAlreadySubmitted, setCartAlreadySubmitted] = useState(false);
  const [quotationDescription, setQuotationDescription] = useState('');
  const [itemDesignFiles, setItemDesignFiles] = useState<Record<string, File[]>>({});
  const [generalDesignFiles, setGeneralDesignFiles] = useState<File[]>([]);

  const getRouteParams = React.useCallback((overrides: ClienteRouteParams = {}): ClienteRouteParams => ({
    productId: overrides.productId ?? selectedProduct?.id,
    quotationId: overrides.quotationId ?? selectedQuote?.id,
    orderId: overrides.orderId ?? selectedOrder?.realId ?? selectedOrder?.id,
  }), [selectedOrder?.id, selectedOrder?.realId, selectedProduct?.id, selectedQuote?.id]);

  const pathForView = React.useCallback((view: View, params: ClienteRouteParams = {}) => (
    viewToClientePath(view, selectedStore?.slug, getRouteParams(params))
  ), [getRouteParams, selectedStore?.slug]);

  const moveToView = React.useCallback((view: View, params: ClienteRouteParams = {}, options: { replace?: boolean } = {}) => {
    const nextPath = pathForView(view, params);
    if (nextPath && pathname !== nextPath) {
      if (options.replace) router.replace(nextPath);
      else router.push(nextPath);
    }
    setCurrentView(view);
  }, [pathForView, pathname, router, setCurrentView]);

  useEffect(() => {
    if (!consumeCustomerSessionExpired()) return;
    setCartItems([]);
    setCartError(null);
    setCartAlreadySubmitted(false);
    setAuthError('Tu sesión expiró. Vuelve a iniciar sesión.');
    moveToView(View.AUTH_LOGIN, {}, { replace: true });
  });

  // Sesión de cliente expirada/ inválida (token vencido): api.ts emite este evento
  // al recibir 401/403 en una request autenticada. Limpiamos la sesión y enviamos a
  // login con un mensaje claro, en vez de dejar al usuario "logueado" con un token muerto.
  useEffect(() => {
    const onSessionExpired = () => {
      logout();
      setCartItems([]);
      setCartError(null);
      setCartAlreadySubmitted(false);
      setAuthError('Tu sesión expiró. Vuelve a iniciar sesión.');
      moveToView(View.AUTH_LOGIN, {}, { replace: true });
    };
    window.addEventListener('kc:session-expired', onSessionExpired);
    return () => window.removeEventListener('kc:session-expired', onSessionExpired);
  }, [logout, moveToView, setCartItems]);

  // Aislamiento por tienda: al cambiar de tienda activa (slug), limpiar el carrito en
  // memoria para no arrastrar el conteo/contenido de la tienda anterior. Cada tienda
  // recarga su propio carrito (en login y en el auto-refresh de la vista de carrito).
  useEffect(() => {
    setCartItems([]);
    setItemDesignFiles({});
    setGeneralDesignFiles([]);
  }, [selectedStore?.slug, setCartItems]);

  useEffect(() => {
    if (!isHydrated || currentUser || !selectedStore?.slug) return;
    if (!PROTECTED_CLIENT_VIEWS.has(currentView)) return;

    const returnTo = pathForView(currentView);
    setPendingView(currentView);
    setAuthError(null);
    const loginPath = `${viewToClientePath(View.AUTH_LOGIN, selectedStore.slug)}?returnTo=${encodeURIComponent(returnTo)}`;
    if (pathname !== loginPath) router.replace(loginPath);
    setCurrentView(View.AUTH_LOGIN);
  }, [currentUser, currentView, isHydrated, pathForView, pathname, router, selectedStore?.slug, setCurrentView, setPendingView]);

  const handleSelectStore = (store: Store, targetView: View = View.STOREFRONT_PUBLIC) => {
    // If the user is logged in to a different store, log them out
    if (currentUser && currentUser.storeId !== store.id) {
      setCurrentUser(null);
    }

    setSelectedStore(store);
    router.push(viewToClientePath(targetView, store.slug));
    setCurrentView(targetView);
  };

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    moveToView(View.QUOTE_DETAIL, { quotationId: quote.id });
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    moveToView(View.ORDER_DETAIL, { orderId: order.realId ?? order.id });
  };

  const handlePayOrder = (order: Order) => {
    setSelectedOrder(order);
    moveToView(View.PAYMENT, { orderId: order.realId ?? order.id });
  };

  const loadCart = async (slug: string, token: string) => {
    const cart = await fetchCart(slug, token);
    setCartItems(toCartItems(cart));
    return cart;
  };

  const refreshSelectedQuote = React.useCallback(async () => {
    if (!selectedStore?.slug || !customerToken || !selectedQuote?.id) return;
    const quotation = await fetchQuotation(selectedStore.slug, customerToken, selectedQuote.id);
    setSelectedQuote(toQuote(quotation));
  }, [selectedStore?.slug, customerToken, selectedQuote?.id, setSelectedQuote]);

  const refreshSelectedOrder = React.useCallback(async () => {
    if (!selectedStore?.slug || !customerToken || !selectedOrder?.realId) return;
    const order = await fetchOrder(selectedStore.slug, customerToken, selectedOrder.realId);
    setSelectedOrder(toOrder(order));
  }, [selectedStore?.slug, customerToken, selectedOrder?.realId, setSelectedOrder]);

  useAutoRefresh({
    enabled: currentView === View.CART && Boolean(selectedStore?.slug && customerToken) && !isSubmittingQuote,
    intervalMs: 10000,
    onRefresh: async () => {
      await loadCart(selectedStore!.slug!, customerToken!);
    },
  });

  useAutoRefresh({
    enabled: currentView === View.QUOTE_DETAIL && Boolean(selectedStore?.slug && customerToken && selectedQuote?.id),
    intervalMs: 6000,
    onRefresh: refreshSelectedQuote,
  });

  useAutoRefresh({
    enabled: (currentView === View.ORDER_DETAIL || currentView === View.PAYMENT) && Boolean(selectedStore?.slug && customerToken && selectedOrder?.realId),
    intervalMs: 7000,
    onRefresh: refreshSelectedOrder,
  });

  const addToCart = async (item: any): Promise<void> => {
    // Al agregar un producto nuevo iniciamos un carrito limpio: descartamos
    // cualquier estado de recuperación o error de una cotización anterior.
    setCartError(null);
    setCartAlreadySubmitted(false);

    if (!selectedStore?.slug || !customerToken || !selectedProduct?.variants) {
      setCartItems(prev => [...prev, { ...item, id: `cart_${Date.now()}` }]);
      moveToView(View.CART);
      return;
    }

    let latestCart = null;
    const validRows = (item.rows || []).filter((row: any) => Number(row.quantity) > 0);
    for (const row of validRows) {
      const variant = selectedProduct.variants.find(
        (entry) => entry.size === row.size && String(entry.color) === String(row.color),
      );
      if (!variant) {
        throw new Error(`No existe una variante para talla ${row.size} y color ${getColorLabel(row.color)}.`);
      }
      latestCart = await addCartItem(selectedStore.slug, customerToken, {
        productVariantId: variant.id,
        quantity: Number(row.quantity),
      });

      const addedItem = latestCart.items.find((cartItem) => cartItem.productVariantId === variant.id);
      if (addedItem) {
        if (item.specs) {
          const customerDescription = String(item.specs || '').trim();
          if (customerDescription) {
            latestCart = await addCartDesign(selectedStore.slug, customerToken, addedItem.id, {
              description: customerDescription,
            });
          }
        }
        if (item.files?.length > 0) {
          const variantKey = String(addedItem.productVariantId);
          setItemDesignFiles((current) => ({
            ...current,
            [variantKey]: [...(current[variantKey] || []), ...item.files],
          }));
        }
      }
    }

    if (latestCart) {
      setCartItems(toCartItems(latestCart));
    } else {
      await loadCart(selectedStore.slug, customerToken);
    }
    moveToView(View.CART);
  };

  const removeFromCart = async (id: string) => {
    if (!selectedStore?.slug || !customerToken) {
      setCartItems(prev => prev.filter(item => item.id !== id));
      return;
    }

    try {
      const removedItem = cartItems.find((item) => item.id === id);
      const cart = await removeCartItem(selectedStore.slug, customerToken, id);
      const nextItems = toCartItems(cart);
      setCartItems(nextItems);
      if (nextItems.length === 0) {
        setItemDesignFiles({});
        setGeneralDesignFiles([]);
      } else if (removedItem) {
        setItemDesignFiles((current) => {
          const next = { ...current };
          delete next[removedItem.productVariantId];
          return next;
        });
      }
      // El carrito cambió: descartamos el estado de recuperación previo.
      setCartError(null);
      setCartAlreadySubmitted(false);
    } catch (err) {
      setCartError(messageFromError(err, 'No se pudo eliminar el producto del carrito.'));
    }
  };

  const submitCartQuotation = async (description?: string) => {
    if (!selectedStore?.slug || !customerToken) {
      navigate(View.AUTH_LOGIN);
      return;
    }
    if (isSubmittingQuote) return;

    setIsSubmittingQuote(true);
    setCartError(null);
    setCartAlreadySubmitted(false);
    try {
      const allDesigns: File[] = [];
      const associations: ({ productVariantId: number } | null)[] = [];

      for (const [productVariantId, files] of Object.entries(itemDesignFiles)) {
        for (const file of files) {
          allDesigns.push(file);
          associations.push({ productVariantId: Number(productVariantId) });
        }
      }
      for (const file of generalDesignFiles) {
        allDesigns.push(file);
        associations.push(null);
      }

      const quotation = await createQuotation(selectedStore.slug, customerToken, {
        description,
        designs: allDesigns,
        designAssociations: associations,
      });
      const mappedQuote = toQuote(quotation);
      setSelectedQuote(mappedQuote);
      setQuotationDescription('');
      setItemDesignFiles({});
      setGeneralDesignFiles([]);
      await loadCart(selectedStore.slug, customerToken);
      moveToView(View.QUOTE_DETAIL, { quotationId: mappedQuote.id });
    } catch (err) {
      const msg = messageFromError(err, 'No se pudo crear la cotización.');
      setCartError(msg);
      // El Backend desactivó el carrito atrapado. Recargar para obtener el carrito vacío nuevo.
      if (/ya fue enviado como cotizaci/i.test(msg)) {
        setCartAlreadySubmitted(true);
        try {
          await loadCart(selectedStore.slug, customerToken);
        } catch {
          setCartItems([]);
        }
      }
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (!selectedStore?.slug) {
      setAuthError('Selecciona una tienda antes de iniciar sesión.');
      moveToView(View.DIRECTORY);
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      const result = await loginCustomer(selectedStore.slug, { email, password });
      setCustomerToken(result.token);
      const profile = await fetchCustomerMe(selectedStore.slug, result.token);
      setCurrentUser(mapCustomerToUser(profile));
      let cartLoadError = false;
      try {
        await loadCart(selectedStore.slug, result.token);
      } catch (cartError) {
        cartLoadError = true;
        setCartItems([]);
        // Solo el mensaje (string), no el objeto Error, para no disparar el overlay de Next.js.
        console.warn('No se pudo cargar el carrito del cliente:', cartError instanceof Error ? cartError.message : String(cartError));
      }

      const nextView = pendingView ?? View.CATALOG;
      setPendingView(null);
      const returnTo = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('returnTo') : null;
      if (returnTo && selectedStore.slug && returnTo.startsWith(`/${selectedStore.slug}/`)) {
        router.push(returnTo);
        setCurrentView(nextView);
        return;
      }
      moveToView(nextView);
      if (cartLoadError) {
        console.warn('No se pudo cargar el carrito tras el inicio de sesión.');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        const isBadCredentials =
          err.status === 401 || err.message.toLowerCase() === 'invalid credentials';
        setAuthError(isBadCredentials ? 'La contraseña ingresada es incorrecta.' : messageFromError(err));
      } else {
        setAuthError(messageFromError(err, 'No se pudo iniciar sesión. Intenta nuevamente.'));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (dto: RegisterCustomerDTO) => {
    if (!selectedStore?.slug) {
      setAuthError('Selecciona una tienda antes de registrarte.');
      moveToView(View.DIRECTORY);
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      await registerCustomer(selectedStore.slug, dto);
      await handleLogin(dto.email, dto.password);
    } catch (err) {
      setAuthError(messageFromError(err, 'No se pudo completar el registro. Intenta nuevamente.'));
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (!selectedStore) {
      moveToView(View.DIRECTORY);
    } else {
      moveToView(View.STOREFRONT_PUBLIC);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const navigateToProduct = (product: Product) => {
      setSelectedProduct(product);
      moveToView(View.PRODUCT_DETAIL, { productId: product.id });
  };

  // Navegación con soporte de "pendingView": si la vista destino requiere sesión
  // y no hay un cliente autenticado, redirige a login y recuerda a dónde volver.
  const navigate = (view: View) => {
    if (PROTECTED_CLIENT_VIEWS.has(view) && !currentUser) {
      if (!selectedStore) {
        moveToView(View.DIRECTORY);
        return;
      }
      setAuthError(null);
      setPendingView(view);
      const returnTo = pathForView(view);
      router.push(`${viewToClientePath(View.AUTH_LOGIN, selectedStore.slug)}?returnTo=${encodeURIComponent(returnTo)}`);
      setCurrentView(View.AUTH_LOGIN);
      return;
    }
    moveToView(view);
  };

  const renderCurrentView = () => {
    switch (activeView) {
      case View.DIRECTORY:
        return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;

      case View.STOREFRONT_PUBLIC:
      case View.STOREFRONT_PRIVATE:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        return <Catalog store={selectedStore} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onSelectProduct={navigateToProduct} cartCount={cartItems.length} initialShowFullCatalog={false} />;

      case View.CATALOG:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        return <Catalog store={selectedStore} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onSelectProduct={navigateToProduct} cartCount={cartItems.length} initialShowFullCatalog={true} />;

      case View.AUTH_LOGIN:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} />;
        return <Auth store={selectedStore} type="login" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;

      case View.AUTH_REGISTER:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} />;
        return <Auth store={selectedStore} type="register" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;

      case View.AUTH_FORGOT_PASSWORD:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} />;
        return <Auth store={selectedStore} type="forgot-password" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;

      case View.AUTH_VERIFICATION:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} />;
        return <Auth store={selectedStore} type="verification" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;

      case View.AUTH_RESET_PASSWORD:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} />;
        return <Auth store={selectedStore} type="reset-password" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;

      case View.PRODUCT_DETAIL:
        if (!selectedStore || !selectedProduct) return <Catalog store={selectedStore!} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onSelectProduct={navigateToProduct} cartCount={cartItems.length} />;
        return <ProductDetail store={selectedStore} user={currentUser} product={selectedProduct} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} onProductUpdated={setSelectedProduct} />;

      case View.REQUEST_QUOTE:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;
        return <RequestQuote store={selectedStore} user={currentUser} product={selectedProduct} onNavigate={navigate} onLogout={handleLogout} onAddToCart={addToCart} cartCount={cartItems.length} />;

      case View.CART:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        return <Cart store={selectedStore} user={currentUser} items={cartItems} onRemoveItem={removeFromCart} onCreateQuotation={submitCartQuotation} onNavigate={navigate} onLogout={handleLogout} isSubmitting={isSubmittingQuote} cartError={cartError} cartAlreadySubmitted={cartAlreadySubmitted} quotationDescription={quotationDescription} onQuotationDescriptionChange={setQuotationDescription} quotationFiles={generalDesignFiles} onQuotationFilesChange={setGeneralDesignFiles} itemDesignFiles={itemDesignFiles} />;

      case View.MY_QUOTES:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;
        return <MyQuotes store={selectedStore} user={currentUser} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;

      case View.QUOTE_DETAIL:
        if (!selectedStore || !selectedQuote) return <MyQuotes store={selectedStore!} user={currentUser} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;
        return <QuoteDetail store={selectedStore} user={currentUser} quote={selectedQuote} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.PAYMENT:
        if (!selectedStore || !selectedOrder) return <MyOrders store={selectedStore!} user={currentUser} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} onSelectOrder={handleSelectOrder} onPayOrder={handlePayOrder} cartCount={cartItems.length} />;
        return <Payment store={selectedStore} user={currentUser} order={selectedOrder} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} onPaymentCompleted={refreshSelectedOrder} />;

      case View.MY_ORDERS:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;
        return <MyOrders store={selectedStore} user={currentUser} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} onSelectOrder={handleSelectOrder} onPayOrder={handlePayOrder} cartCount={cartItems.length} />;

      case View.ORDER_DETAIL:
        if (!selectedStore || !selectedOrder) return <MyOrders store={selectedStore!} user={currentUser} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} onSelectOrder={handleSelectOrder} onPayOrder={handlePayOrder} cartCount={cartItems.length} />;
        return <OrderDetail store={selectedStore} user={currentUser} order={selectedOrder} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.PROFILE:
        if (!selectedStore || !currentUser) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        return <Profile store={selectedStore} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onUpdateUser={handleUpdateUser} cartCount={cartItems.length} />;

      default:
        return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} />;
    }
  };

  return (
    <div className="text-text-main font-sans">
      <AnimatePresence mode="wait">
        <motion.div
           key={activeView}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
