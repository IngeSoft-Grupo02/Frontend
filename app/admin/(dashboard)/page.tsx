'use client';

import { Badge, Card } from '@/domains/admin/components/UI';
import { api, StoreResponse, AuditLogResponse } from '@/domains/admin/lib/api';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function endpointToEvento(method: string, endpoint: string, statusCode: number): string {
  const e = endpoint.toLowerCase(); const ok = statusCode < 400;
  if (e.includes('/auth/login'))     return ok ? 'Inicio de sesión'       : 'Inicio de sesión fallido';
  if (e.includes('/auth/logout'))    return 'Cierre de sesión';
  if (method==='POST' && e.includes('/admin/stores') && !e.includes('suspend') && !e.includes('deactivate') && !e.includes('reactivate'))
    return ok ? 'Tienda registrada'      : 'Error al registrar tienda';
  if (e.includes('/suspend'))        return ok ? 'Tienda suspendida'      : 'Error al suspender tienda';
  if (e.includes('/reactivate'))     return ok ? 'Tienda reactivada'      : 'Error al reactivar tienda';
  if (e.includes('/deactivate') && e.includes('/stores')) return ok ? 'Tienda desactivada' : 'Error al desactivar tienda';
  if (method==='PUT'  && e.includes('/admin/stores')) return ok ? 'Tienda editada'       : 'Error al editar tienda';
  if (method==='POST' && e.includes('/admin/users'))  return ok ? 'Usuario creado'       : 'Error al crear usuario';
  if (method==='PUT'  && e.includes('/admin/users'))  return ok ? 'Usuario actualizado'  : 'Error al actualizar usuario';
  if (e.includes('/deactivate') && e.includes('/users')) return ok ? 'Usuario desactivado' : 'Error al desactivar usuario';
  if (e.includes('/admin/bulk/upload')) return ok ? 'Carga masiva ejecutada' : 'Error en carga masiva';
  if (e.includes('/admin/audit'))       return 'Consulta de auditoría';
  if (e.includes('/admin/stores/metrics')) return 'Consulta de métricas';
  if (e.includes('/admin/system/config') && method==='PUT') return 'Parámetros actualizados';
  if (e.includes('/admin/system/config')) return 'Consulta de configuración';
  return `${method} ${endpoint}`;
}

function getStatusVariant(s: string) {
  if (s === 'ACTIVE') return 'active'; if (s === 'SUSPENDED') return 'suspended'; return 'neutral';
}
function mapStatus(s: string) {
  return ({ ACTIVE:'Activa', SUSPENDED:'Suspendida', DEACTIVATED:'Desactivada', INACTIVE:'Inactiva' } as any)[s] ?? s;
}
function formatTs(ts: string) {
  try { return new Date(ts).toLocaleString('es-PE', { dateStyle:'short', timeStyle:'short' }); }
  catch { return ts; }
}

export default function DashboardPage() {
  const [stores,  setStores]  = useState<StoreResponse[]>([]);
  const [logs,    setLogs]    = useState<AuditLogResponse[]>([]);
  const [emails,  setEmails]  = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stores.getAll(), api.audit.getAll(), api.bulk.existingEmails()])
        .then(([s, l, e]) => { setStores(s); setLogs(l); setEmails(e); })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  const activeStores    = stores.filter(s => s.storeStatus === 'ACTIVE').length;
  const suspendedStores = stores.filter(s => s.storeStatus === 'SUSPENDED').length;
  const errorLogs       = logs.filter(l => l.level === 'ERROR').length;

  // Ordenar logs descendente (más reciente primero) y tomar los últimos 8
  const recentLogs = [...logs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);

  // Ordenar tiendas descendente por createdAt
  const recentStores = [...stores]
      .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
      .slice(0, 6);

  if (loading) return (
      <div className="flex items-center justify-center h-[60vh] gap-3 text-neutral-400">
        <Loader2 size={24} className="animate-spin" /> Cargando panel...
      </div>
  );

  return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
        <div>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Resumen Operativo</h2>
          <p className="text-[14px] font-medium text-neutral-400">Estado actual de la red de tiendas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Tiendas activas',      value: activeStores },
            { label: 'Usuarios registrados', value: emails.length },
            { label: 'Tiendas suspendidas',  value: suspendedStores },
            { label: 'Errores en auditoría', value: errorLogs },
          ].map((m, i) => (
              <Card key={i} className="flex flex-col gap-4 p-6">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{m.label}</p>
                <span className="text-[32px] font-display font-extrabold">{m.value}</span>
              </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 overflow-hidden px-0 py-2">
            <div className="px-8 py-4 bg-white border-b border-neutral-100">
              <h3 className="text-[18px] font-display font-extrabold">Actividad reciente</h3>
              <p className="text-[12px] font-medium text-neutral-400">Últimos eventos auditables</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-brand-beige-light">
                <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-8">Hora</th>
                  <th className="py-4 px-6">Usuario</th>
                  <th className="py-4 px-6">Evento</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                {recentLogs.map(log => (
                    <tr key={log.id} className="text-[13px] hover:bg-neutral-50 transition-colors">
                      <td className="py-5 px-8 font-medium text-neutral-500 text-[12px]">{formatTs(log.timestamp)}</td>
                      <td className="py-5 px-6 font-bold text-neutral-900 text-[12px] font-mono">{log.userEmail || '—'}</td>
                      <td className="py-5 px-6 font-extrabold text-[12px] uppercase tracking-tight">
                        {endpointToEvento(log.httpMethod, log.endpoint, log.statusCode)}
                      </td>
                    </tr>
                ))}
                {logs.length === 0 && (
                    <tr><td colSpan={3} className="py-12 text-center text-neutral-400 italic text-[13px]">Sin actividad registrada.</td></tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="flex flex-col h-fit">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[18px] font-display font-extrabold">Tiendas recientes</h3>
                <p className="text-[12px] font-medium text-neutral-400">Resumen rápido</p>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
              <tr className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                <th className="pb-3 px-2">Tienda</th>
                <th className="pb-3 px-2 text-right">Estado</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
              {recentStores.map(s => (
                  <tr key={s.id}>
                    <td className="py-3 px-2">
                      <p className="font-extrabold text-neutral-900 text-[13px]">{s.storeName}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{s.slug}</p>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant={getStatusVariant(s.storeStatus) as any}>{mapStatus(s.storeStatus)}</Badge>
                    </td>
                  </tr>
              ))}
              {stores.length === 0 && <tr><td colSpan={2} className="py-8 text-center text-neutral-400 italic text-[12px]">Sin tiendas.</td></tr>}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
  );
}
