import { View } from '../types';

export interface ClienteRouteState {
  view: View;
  productId?: string;
  quotationId?: string;
  orderId?: string;
}

export interface ClienteRouteParams {
  productId?: string | number | null;
  quotationId?: string | number | null;
  orderId?: string | number | null;
}

export const PROTECTED_CLIENT_VIEWS = new Set<View>([
  View.REQUEST_QUOTE,
  View.MY_QUOTES,
  View.QUOTE_DETAIL,
  View.MY_ORDERS,
  View.ORDER_DETAIL,
  View.CART,
  View.PAYMENT,
  View.PROFILE,
]);

const cleanSegment = (value: string | undefined) => decodeURIComponent(value || '').trim().toLowerCase();

export function parseClientePath(segments: string[] | undefined): ClienteRouteState {
  const [firstRaw, secondRaw, thirdRaw] = segments || [];
  const first = cleanSegment(firstRaw);
  const second = secondRaw ? decodeURIComponent(secondRaw) : undefined;
  const third = cleanSegment(thirdRaw);

  if (!first || first === 'inicio') return { view: View.STOREFRONT_PUBLIC };
  if (first === 'catalogo' || first === 'productos') {
    if (first === 'productos' && second) {
      return third === 'cotizar'
        ? { view: View.REQUEST_QUOTE, productId: second }
        : { view: View.PRODUCT_DETAIL, productId: second };
    }
    return { view: View.CATALOG };
  }
  if (first === 'cotizaciones') {
    return second ? { view: View.QUOTE_DETAIL, quotationId: second } : { view: View.MY_QUOTES };
  }
  if (first === 'pedidos') {
    if (second && third === 'pago') return { view: View.PAYMENT, orderId: second };
    return second ? { view: View.ORDER_DETAIL, orderId: second } : { view: View.MY_ORDERS };
  }
  if (first === 'carrito') return { view: View.CART };
  if (first === 'solicitar-cotizacion') return { view: View.REQUEST_QUOTE };
  if (first === 'iniciar-sesion') return { view: View.AUTH_LOGIN };
  if (first === 'registro') return { view: View.AUTH_REGISTER };
  if (first === 'mi-cuenta' || first === 'perfil') return { view: View.PROFILE };

  return { view: View.STOREFRONT_PUBLIC };
}

export function viewToClientePath(view: View, slug: string | undefined | null, params: ClienteRouteParams = {}): string {
  if (!slug) return '/';
  const encodedSlug = encodeURIComponent(slug);
  const productId = params.productId != null ? encodeURIComponent(String(params.productId)) : null;
  const quotationId = params.quotationId != null ? encodeURIComponent(String(params.quotationId)) : null;
  const orderId = params.orderId != null ? encodeURIComponent(String(params.orderId)) : null;

  switch (view) {
    case View.DIRECTORY:
      return '/';
    case View.STOREFRONT_PUBLIC:
    case View.STOREFRONT_PRIVATE:
      return `/${encodedSlug}/inicio`;
    case View.CATALOG:
      return `/${encodedSlug}/catalogo`;
    case View.PRODUCT_DETAIL:
      return productId ? `/${encodedSlug}/productos/${productId}` : `/${encodedSlug}/catalogo`;
    case View.REQUEST_QUOTE:
      return productId ? `/${encodedSlug}/productos/${productId}/cotizar` : `/${encodedSlug}/solicitar-cotizacion`;
    case View.MY_QUOTES:
      return `/${encodedSlug}/cotizaciones`;
    case View.QUOTE_DETAIL:
      return quotationId ? `/${encodedSlug}/cotizaciones/${quotationId}` : `/${encodedSlug}/cotizaciones`;
    case View.MY_ORDERS:
      return `/${encodedSlug}/pedidos`;
    case View.ORDER_DETAIL:
      return orderId ? `/${encodedSlug}/pedidos/${orderId}` : `/${encodedSlug}/pedidos`;
    case View.PAYMENT:
      return orderId ? `/${encodedSlug}/pedidos/${orderId}/pago` : `/${encodedSlug}/pedidos`;
    case View.CART:
      return `/${encodedSlug}/carrito`;
    case View.AUTH_LOGIN:
      return `/${encodedSlug}/iniciar-sesion`;
    case View.AUTH_REGISTER:
      return `/${encodedSlug}/registro`;
    case View.PROFILE:
      return `/${encodedSlug}/mi-cuenta`;
    default:
      return `/${encodedSlug}/inicio`;
  }
}
