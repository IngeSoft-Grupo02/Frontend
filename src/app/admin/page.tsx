'use client';

import { Badge, Card } from '@/components/UI';
import { useApp } from '@/context/AppContext';

export default function DashboardPage() {
  const { stores, users, auditLogs } = useApp();

  // Datos concretos calculados del contexto
  const activeStores = stores.filter(s => s.status === 'Activa').length;
  const totalUsers = users.length;
  const suspendedStores = stores.filter(s => s.status === 'Suspendida').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Resumen Operativo</h2>
          <p className="text-[14px] font-medium text-neutral-400">Estado actual de la red de tiendas</p>
        </div>
      </div>

      {/* Métricas - Estilo Sobrio (Sin iconos, sin porcentajes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tiendas activas', value: activeStores },
          { label: 'Usuarios', value: totalUsers },
          { label: 'Tiendas suspendidas', value: suspendedStores },
          { label: 'Registro de incidencias', value: '7' },
        ].map((metric, i) => (
          <Card key={i} className="flex flex-col gap-4 p-6">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              {metric.label}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-[32px] font-display font-extrabold">
                {metric.value}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Sección Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabla de Actividad */}
        <Card className="lg:col-span-2 overflow-hidden px-0 py-2">
          <div className="px-8 py-4 bg-white border-b border-neutral-100 flex justify-between items-center">
            <div>
              <h3 className="text-[18px] font-display font-extrabold">Actividad reciente</h3>
              <p className="text-[12px] font-medium text-neutral-400">Últimos eventos auditables</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-brand-beige-light">
                <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-8">Hora</th>
                  <th className="py-4 px-6">Usuario</th>
                  <th className="py-4 px-6">Evento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {auditLogs.slice(0, 5).map((log, i) => (
                  <tr key={i} className="text-[13px] hover:bg-neutral-50 transition-colors">
                    <td className="py-5 px-8 font-medium text-neutral-500">
                      {log.time} 10/05/2026
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-bold text-neutral-900">{log.user}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-extrabold text-[12px] uppercase tracking-tight">
                        {log.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Lista de Tiendas */}
        <Card className="flex flex-col h-fit">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[18px] font-display font-extrabold">Tiendas recientes</h3>
              <p className="text-[12px] font-medium text-neutral-400">Resumen rápido de actividad</p>
            </div>
          </div>
          <div className="flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 pb-2">
                  <th className="pb-3 px-2">Tienda</th>
                  <th className="pb-3 px-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {stores.slice(0, 5).map((store, i) => (
                  <tr key={i} className="text-[12px] font-medium text-neutral-700">
                    <td className="py-3 px-2">
                      <p className="font-extrabold text-neutral-900">{store.name}</p>
                      <p className="text-[10px] text-neutral-400">{store.responsible}</p>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant={store.status === 'Activa' ? 'activo' : 'suspendido'}>
                        {store.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}