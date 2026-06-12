'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext'; // Solo usamos el hook, no proveemos
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAuthInitialized } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthInitialized && !isLoggedIn) router.push('/login');
  }, [isAuthInitialized, isLoggedIn, router]);

  if (!isAuthInitialized || !isLoggedIn) return null;

  const getPageMeta = () => {
    if (pathname === '/') return { title: 'PANEL', subtitle: 'Visión ejecutiva del ecosistema multi-tenant' };
    if (pathname === '/tiendas') return { title: 'Tiendas registradas', subtitle: 'Listado general de tenants con estado operativo' };
    if (pathname === '/usuarios') return { title: 'Gestión de usuarios', subtitle: 'Control de acceso por rol y tenant' };
    if (pathname === '/carga-masiva') return { title: 'Carga masiva', subtitle: 'Sube uno o varios archivos en una misma operación.' };
    if (pathname === '/categorias') return { title: 'Categorías', subtitle: 'Estandarización transversal para todas las tiendas' };
    if (pathname === '/auditoria') return { title: 'Auditoría y logs', subtitle: 'Monitoreo crítico, trazabilidad y exportación' };
    if (pathname === '/parametros') return { title: 'Parámetros', subtitle: 'Configuración global del sistema' };
    return { title: 'Kingstore', subtitle: 'Plataforma administrativa' };
  };

  const { title, subtitle } = getPageMeta();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-[280px] relative">
        <div className="z-40 sticky top-0">
          <TopBar title={title} subtitle={subtitle} />
        </div>
        <main className="flex-1 pt-24 p-8">
          <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}