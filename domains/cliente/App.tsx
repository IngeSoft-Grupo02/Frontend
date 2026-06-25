/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  loginCustomer,
  registerCustomer,
  removeCartItem,
  toCartItems,
  toQuote,
} from './lib/api';
import { mapCustomerToUser } from './lib/customer';
import { getColorLabel } from '../shared/colors';
import { messageFromError } from '../shared/errors';

// Vistas que requieren sesión de cliente iniciada (ya protegidas en renderCurrentView)
const PROTECTED_VIEWS = new Set<View>([
  View.REQUEST_QUOTE,
  View.MY_QUOTES,
  View.MY_ORDERS,
  View.PROFILE,
]);

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
  } = useApp();

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [cartAlreadySubmitted, setCartAlreadySubmitted] = useState(false);

  const handleSelectStore = (store: Store) => {
    // If the user is logged in to a different store, log them out
    if (currentUser && currentUser.storeId !== store.id) {
      setCurrentUser(null);
    }

    setSelectedStore(store);
    setCurrentView(View.STOREFRONT_PUBLIC);
  };

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setCurrentView(View.QUOTE_DETAIL);
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView(View.ORDER_DETAIL);
  };

  const handlePayOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView(View.PAYMENT);
  };

  const loadCart = async (slug: string, token: string) => {
    const cart = await fetchCart(slug, token);
    setCartItems(toCartItems(cart));
    return cart;
  };

  const addToCart = async (item: any): Promise<void> => {
    // Al agregar un producto nuevo iniciamos un carrito limpio: descartamos
    // cualquier estado de recuperación o error de una cotización anterior.
    setCartError(null);
    setCartAlreadySubmitted(false);

    if (!selectedStore?.slug || !customerToken || !selectedProduct?.variants) {
      setCartItems(prev => [...prev, { ...item, id: `cart_${Date.now()}` }]);
      setCurrentView(View.CART);
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
      if (addedItem && (item.specs || item.files?.length > 0)) {
        const designDescription = [
          item.specs,
          item.files?.length ? `Archivos referenciales pendientes de S3: ${item.files.map((file: any) => file.name).join(', ')}` : '',
        ].filter(Boolean).join('\n');
        latestCart = await addCartDesign(selectedStore.slug, customerToken, addedItem.id, {
          description: designDescription,
        });
      }
    }

    if (latestCart) {
      setCartItems(toCartItems(latestCart));
    } else {
      await loadCart(selectedStore.slug, customerToken);
    }
    setCurrentView(View.CART);
  };

  const removeFromCart = async (id: string) => {
    if (!selectedStore?.slug || !customerToken) {
      setCartItems(prev => prev.filter(item => item.id !== id));
      return;
    }

    try {
      const cart = await removeCartItem(selectedStore.slug, customerToken, id);
      setCartItems(toCartItems(cart));
      // El carrito cambió: descartamos el estado de recuperación previo.
      setCartError(null);
      setCartAlreadySubmitted(false);
    } catch (err) {
      setCartError(messageFromError(err, 'No se pudo eliminar el producto del carrito.'));
    }
  };

  const submitCartQuotation = async () => {
    if (!selectedStore?.slug || !customerToken) {
      navigate(View.AUTH_LOGIN);
      return;
    }
    if (isSubmittingQuote) return;

    setIsSubmittingQuote(true);
    setCartError(null);
    setCartAlreadySubmitted(false);
    try {
      const quotation = await createQuotation(selectedStore.slug, customerToken);
      setSelectedQuote(toQuote(quotation));
      await loadCart(selectedStore.slug, customerToken);
      setCurrentView(View.QUOTE_DETAIL);
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
      setCurrentView(View.DIRECTORY);
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
        console.error('No se pudo cargar el carrito del cliente.', cartError);
      }

      const nextView = pendingView ?? View.CATALOG;
      setPendingView(null);
      setCurrentView(nextView);
      if (cartLoadError) {
        console.error('No se pudo cargar el carrito tras el inicio de sesión.');
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
      setCurrentView(View.DIRECTORY);
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
      setCurrentView(View.DIRECTORY);
    } else {
      setCurrentView(View.STOREFRONT_PUBLIC);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const navigateToProduct = (product: Product) => {
      setSelectedProduct(product);
      setCurrentView(View.PRODUCT_DETAIL);
  };

  // Navegación con soporte de "pendingView": si la vista destino requiere sesión
  // y no hay un cliente autenticado, redirige a login y recuerda a dónde volver.
  const navigate = (view: View) => {
    if (PROTECTED_VIEWS.has(view) && !currentUser) {
      if (!selectedStore) {
        setCurrentView(View.DIRECTORY);
        return;
      }
      setAuthError(null);
      setPendingView(view);
      setCurrentView(View.AUTH_LOGIN);
      return;
    }
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
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
        return <ProductDetail store={selectedStore} user={currentUser} product={selectedProduct} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.REQUEST_QUOTE:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;
        return <RequestQuote store={selectedStore} user={currentUser} product={selectedProduct} onNavigate={navigate} onLogout={handleLogout} onAddToCart={addToCart} cartCount={cartItems.length} />;

      case View.CART:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        return <Cart store={selectedStore} user={currentUser} items={cartItems} onRemoveItem={removeFromCart} onCreateQuotation={submitCartQuotation} onNavigate={navigate} onLogout={handleLogout} isSubmitting={isSubmittingQuote} cartError={cartError} cartAlreadySubmitted={cartAlreadySubmitted} />;

      case View.MY_QUOTES:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;
        return <MyQuotes store={selectedStore} user={currentUser} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;

      case View.QUOTE_DETAIL:
        if (!selectedStore || !selectedQuote) return <MyQuotes store={selectedStore!} user={currentUser} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;
        return <QuoteDetail store={selectedStore} user={currentUser} quote={selectedQuote} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.PAYMENT:
        if (!selectedStore || !selectedOrder) return <MyOrders store={selectedStore!} user={currentUser} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} onSelectOrder={handleSelectOrder} onPayOrder={handlePayOrder} cartCount={cartItems.length} />;
        return <Payment store={selectedStore} user={currentUser} order={selectedOrder} customerToken={customerToken} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} />;

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
           key={currentView}
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
