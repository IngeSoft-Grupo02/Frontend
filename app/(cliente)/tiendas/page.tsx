import { ClienteRouteView } from '@/domains/cliente/RouteView';
import { View } from '@/domains/cliente/types';

export default function TiendasPage() {
  return <ClienteRouteView view={View.DIRECTORY} />;
}
