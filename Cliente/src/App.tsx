/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { View, Store, User, Product, Quote, Order, TipoDocumento } from './types';
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
import { STORES } from './constants';
import { TopBar } from './components/layout/TopBar';
import { Button } from './components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './context/AppContext';

// Helper to calculate perceptual brightness of a hex color
function getBrightness(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return 0;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return 0;
  // Standard HSP / YIQ formula
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// Function to darken a color to guarantee at least 4.5:1 text contrast on white
function adjustColorContrast(hexColor: string, targetBrightness = 110): string {
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
}

export default function App() {
  const {
    currentView,
    setCurrentView,
    selectedStore,
    setSelectedStore,
    currentUser,
    setCurrentUser,
    selectedProduct,
    setSelectedProduct,
    selectedQuote,
    setSelectedQuote,
    selectedOrder,
    setSelectedOrder,
    cartItems,
    setCartItems,
  } = useApp();

  React.useEffect(() => {
    if (selectedStore && currentView !== View.DIRECTORY) {
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
  }, [selectedStore, currentView]);

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

  const handleLogin = () => {
    if (selectedStore) {
      setCurrentUser({
        id: 'user_1',
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@pucp.edu.pe',
        phone: '998877665',
        documentType: TipoDocumento.DNI,
        documentId: '45678912',
        storeId: selectedStore.id
      });
      setCurrentView(View.CATALOG);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
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

  const renderCurrentView = () => {
    switch (currentView) {
      case View.DIRECTORY:
        return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} onLogout={handleLogout} />;
      
      case View.STOREFRONT_PUBLIC:
      case View.STOREFRONT_PRIVATE:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} onLogout={handleLogout} />;
        return <Catalog store={selectedStore} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onSelectProduct={navigateToProduct} cartCount={cartItems.length} initialShowFullCatalog={false} />;

      case View.CATALOG:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} onLogout={handleLogout} />;
        return <Catalog store={selectedStore} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onSelectProduct={navigateToProduct} cartCount={cartItems.length} initialShowFullCatalog={true} />;

      case View.AUTH_LOGIN:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} />;
        return <Auth store={selectedStore} type="login" onNavigate={setCurrentView} onLogin={handleLogin} />;

      case View.AUTH_REGISTER:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} />;
        return <Auth store={selectedStore} type="register" onNavigate={setCurrentView} onLogin={handleLogin} />;

      case View.AUTH_FORGOT_PASSWORD:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} />;
        return <Auth store={selectedStore} type="forgot-password" onNavigate={setCurrentView} onLogin={handleLogin} />;

      case View.AUTH_VERIFICATION:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} />;
        return <Auth store={selectedStore} type="verification" onNavigate={setCurrentView} onLogin={handleLogin} />;
      
      case View.AUTH_RESET_PASSWORD:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} />;
        return <Auth store={selectedStore} type="reset-password" onNavigate={setCurrentView} onLogin={handleLogin} />;

      case View.PRODUCT_DETAIL:
        if (!selectedStore || !selectedProduct) return <Catalog store={selectedStore!} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onSelectProduct={navigateToProduct} cartCount={cartItems.length} />;
        return <ProductDetail store={selectedStore} user={currentUser} product={selectedProduct} onNavigate={setCurrentView} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.REQUEST_QUOTE:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={setCurrentView} onLogin={handleLogin} />;
        return <RequestQuote store={selectedStore} user={currentUser} product={selectedProduct} onNavigate={setCurrentView} onLogout={handleLogout} onAddToCart={addToCart} cartCount={cartItems.length} />;

      case View.CART:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} onLogout={handleLogout} />;
        return <Cart store={selectedStore} user={currentUser} items={cartItems} onRemoveItem={removeFromCart} onNavigate={setCurrentView} onLogout={handleLogout} />;

      case View.MY_QUOTES:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={setCurrentView} onLogin={handleLogin} />;
        return <MyQuotes store={selectedStore} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;

      case View.QUOTE_DETAIL:
        if (!selectedStore || !selectedQuote) return <MyQuotes store={selectedStore!} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;
        return <QuoteDetail store={selectedStore} user={currentUser} quote={selectedQuote} onNavigate={setCurrentView} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.PAYMENT:
        if (!selectedStore || !selectedQuote) return <MyQuotes store={selectedStore!} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onSelectQuote={handleSelectQuote} cartCount={cartItems.length} />;
        return <Payment store={selectedStore} user={currentUser} quote={selectedQuote} onNavigate={setCurrentView} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.MY_ORDERS:
        if (!selectedStore) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} onLogout={handleLogout} />;
        if (!currentUser) return <Auth store={selectedStore} type="login" onNavigate={setCurrentView} onLogin={handleLogin} />;
        return <MyOrders store={selectedStore} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onSelectOrder={handleSelectOrder} cartCount={cartItems.length} />;

      case View.ORDER_DETAIL:
        if (!selectedStore || !selectedOrder) return <MyOrders store={selectedStore!} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onSelectOrder={handleSelectOrder} cartCount={cartItems.length} />;
        return <OrderDetail store={selectedStore} user={currentUser} order={selectedOrder} onNavigate={setCurrentView} onLogout={handleLogout} cartCount={cartItems.length} />;

      case View.PROFILE:
        if (!selectedStore || !currentUser) return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} onLogout={handleLogout} />;
        return <Profile store={selectedStore} user={currentUser} onNavigate={setCurrentView} onLogout={handleLogout} onUpdateUser={handleUpdateUser} cartCount={cartItems.length} />;

      default:
        return <Directory onSelectStore={handleSelectStore} onNavigate={setCurrentView} />;
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
