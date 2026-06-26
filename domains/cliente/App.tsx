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
import { ApiError, fetchCustomerMe, loginCustomer, registerCustomer } from './lib/api';
import { mapCustomerToUser } from './lib/customer';

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

  const addToCart = (item: any) => {
    setCartItems(prev => [...prev, { ...item, id: `cart_${Date.now()}` }]);
    setCurrentView(View.CART);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
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

      const nextView = pendingView ?? View.CATALOG;
      setPendingView(null);
      setCurrentView(nextView);
    } catch (err) {
      if (err instanceof ApiError) {
        const isBadCredentials =
          err.status === 401 || err.message.toLowerCase() === 'invalid credentials';
        setAuthError(isBadCredentials ? 'La contraseña ingresada es incorrecta.' : err.message);
      } else {
        setAuthError('No se pudo iniciar sesión. Intenta nuevamente.');
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
      setAuthError(err instanceof ApiError ? err.message : 'No se pudo completar el registro. Intenta nuevamente.');
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
        return <Cart store={selectedStore} user={currentUser} items={cartItems} onRemoveItem={removeFromCart} onNavigate={navigate} onLogout={handleLogout} />;

      case View.MY_QUOTES:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;
        return <MyQuotes store={selectedStore} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;

      case View.QUOTE_DETAIL:
        if (!selectedStore || !selectedQuote) return <MyQuotes store={selectedStore!} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;
        return <QuoteDetail store={selectedStore} user={currentUser} quote={selectedQuote} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.PAYMENT:
        if (!selectedStore || !selectedQuote) return <MyQuotes store={selectedStore!} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;
        return <Payment store={selectedStore} user={currentUser} quote={selectedQuote} onNavigate={navigate} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.MY_ORDERS:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={navigate} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={navigate} onLogin={handleLogin} onRegister={handleRegister} authError={authError} authLoading={authLoading} />;
        return <MyOrders store={selectedStore} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onSelectOrder={handleSelectOrder} cartCount={cartItems.length} />;

      case View.ORDER_DETAIL:
        if (!selectedStore || !selectedOrder) return <MyOrders store={selectedStore!} user={currentUser} onNavigate={navigate} onLogout={handleLogout} onSelectOrder={handleSelectOrder} cartCount={cartItems.length} />;
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
