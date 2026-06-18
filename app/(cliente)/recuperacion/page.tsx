import { ClienteRouteView } from '@/domains/cliente/RouteView';
import { View } from '@/domains/cliente/types';

export default function RecuperacionPage() {
  return <ClienteRouteView view={View.AUTH_FORGOT_PASSWORD} />;
}
