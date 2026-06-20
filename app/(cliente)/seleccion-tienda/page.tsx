import { ClienteRouteView } from '@/domains/cliente/RouteView';
import { View } from '@/domains/cliente/types';

export default function SeleccionTiendaPage() {
  return <ClienteRouteView view={View.DIRECTORY} />;
}
