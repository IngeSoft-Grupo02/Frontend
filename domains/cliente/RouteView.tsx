'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import App from './App';
import { useApp } from './context/AppContext';
import { ApiError, fetchOrder, fetchPublicProduct, fetchPublicStore, fetchQuotation, toOrder, toProduct, toQuote, toStore } from './lib/api';
import { parseClientePath, viewToClientePath } from './lib/navigation';
import { View } from './types';

interface ClienteRouteViewProps {
  view?: View;
  slug?: string;
  path?: string[];
}

export function ClienteRouteView({ view, slug, path }: ClienteRouteViewProps) {
  const router = useRouter();
  const {
    selectedStore,
    setSelectedStore,
    currentView,
    setCurrentView,
    setSelectedProduct,
    setSelectedQuote,
    setSelectedOrder,
    customerToken,
    isHydrated,
  } = useApp();
  const [loading, setLoading] = useState(Boolean(slug));
  const [routeError, setRouteError] = useState<string | null>(null);

  const routeState = useMemo(() => {
    return slug ? parseClientePath(path) : { view: view ?? View.DIRECTORY };
  }, [path, slug, view]);

  useEffect(() => {
    if (slug || view === View.DIRECTORY || !selectedStore?.slug) return;
    router.replace(viewToClientePath(view ?? View.DIRECTORY, selectedStore.slug));
  }, [router, selectedStore?.slug, slug, view]);

  useEffect(() => {
    if (!slug) {
      setCurrentView(view ?? View.DIRECTORY);
      return;
    }

    let active = true;
    const loadRoute = async () => {
      setLoading(true);
      setRouteError(null);
      try {
        const store = toStore(await fetchPublicStore(slug));
        if (!active) return;
        setSelectedStore(store);

        if (routeState.productId) {
          const product = toProduct(await fetchPublicProduct(slug, routeState.productId), store.slug || store.id);
          if (!active) return;
          setSelectedProduct(product);
        } else if (routeState.view !== View.REQUEST_QUOTE && routeState.view !== View.PRODUCT_DETAIL) {
          setSelectedProduct(null);
        }

        if (routeState.quotationId && customerToken) {
          const quotation = toQuote(await fetchQuotation(slug, customerToken, routeState.quotationId));
          if (!active) return;
          setSelectedQuote(quotation);
        } else if (routeState.view !== View.QUOTE_DETAIL) {
          setSelectedQuote(null);
        }

        if (routeState.orderId && customerToken) {
          const numericOrderId = Number(routeState.orderId);
          if (Number.isFinite(numericOrderId)) {
            const order = toOrder(await fetchOrder(slug, customerToken, numericOrderId));
            if (!active) return;
            setSelectedOrder(order);
          }
        } else if (routeState.view !== View.ORDER_DETAIL && routeState.view !== View.PAYMENT) {
          setSelectedOrder(null);
        }

        setCurrentView(routeState.view);
      } catch (error) {
        if (!active) return;
        if (error instanceof ApiError && error.status === 404) {
          setRouteError('No encontramos esa tienda o recurso en KingStore.');
        } else {
          setRouteError('No se pudo cargar esta ruta. Intenta nuevamente.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadRoute();
    return () => {
      active = false;
    };
  }, [
    customerToken,
    path,
    routeState.orderId,
    routeState.productId,
    routeState.quotationId,
    routeState.view,
    setCurrentView,
    setSelectedOrder,
    setSelectedProduct,
    setSelectedQuote,
    setSelectedStore,
    slug,
    view,
  ]);

  // En rutas con slug, la URL es la fuente de verdad: jamás renderizar el landing/
  // directorio global como frame intermedio. Mientras la tienda cargada no coincida con
  // el slug (selectedStore puede venir stale de localStorage tras remontar el provider)
  // o la vista aún no esté sincronizada (currentView arranca en DIRECTORY), mantener un
  // loader contextual de tienda. La condición no se dispara en navegación dentro de la
  // misma tienda (slug coincide y la vista ya no es DIRECTORY), evitando parpadeos.
  if (slug && loading && (selectedStore?.slug !== slug || currentView === View.DIRECTORY)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white text-[#0F1011]">
        <Loader2 className="animate-spin text-gray-400" />
        <p className="text-[13px] font-bold text-gray-500">Cargando tienda...</p>
      </div>
    );
  }

  if (routeError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white px-6 text-center text-[#0F1011]">
        <AlertTriangle className="text-red-500" />
        <p className="text-[16px] font-black">{routeError}</p>
        <button
          type="button"
          onClick={() => router.replace('/')}
          className="rounded-xl border border-black/10 px-5 py-3 text-[13px] font-black"
        >
          Ir al directorio
        </button>
      </div>
    );
  }

  if (!isHydrated && !slug) {
    return null;
  }

  return <App />;
}
