import { ClienteRouteView } from '@/domains/cliente/RouteView';
import { View } from '@/domains/cliente/types';

export default function CotizacionesPage() {
  return <ClienteRouteView view={View.MY_QUOTES} />;
}
