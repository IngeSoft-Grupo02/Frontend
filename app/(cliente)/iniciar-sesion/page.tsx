import { ClienteRouteView } from '@/domains/cliente/RouteView';
import { View } from '@/domains/cliente/types';

export default function IniciarSesionPage() {
  return <ClienteRouteView view={View.AUTH_LOGIN} />;
}
