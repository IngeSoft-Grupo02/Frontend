'use client';

import { Badge, Card } from '@/domains/admin/components/UI';
import { api, StoreResponse, AuditLogResponse, UserResponseDTO } from '@/domains/admin/lib/api';
import { auditEventLabel } from '@/domains/admin/lib/audit-event';
import { auditUserLabel } from '@/domains/admin/lib/audit-display';
import { auditTimestampMs, formatAuditTimestamp } from '@/domains/admin/lib/audit-time';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function getStatusVariant(s: string) {
  if (s === 'ACTIVE') return 'active'; if (s === 'SUSPENDED') return 'suspended'; return 'neutral';
}
function mapStatus(s: string) {
  return ({ ACTIVE:'Activa', SUSPENDED:'Suspendida', DEACTIVATED:'Desactivada', INACTIVE:'Inactiva' } as any)[s] ?? s;
}

export default function DashboardPage() {
  const [stores,  setStores]  = useState<StoreResponse[]>([]);
  const [logs,    setLogs]    = useState<AuditLogResponse[]>([]);
  const [users,   setUsers]   = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stores.getAll(), api.audit.getAll(), api.users.getAll()])
        .then(([s, l, u]) => { setStores(s); setLogs(l); setUsers(u); })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  const activeStores    = stores.filter(s => s.storeStatus === 'ACTIVE').length;
  const suspendedStores = stores.filter(s => s.storeStatus === 'SUSPENDED').length;
  const errorLogs       = logs.filter(l => l.level === 'ERROR').length;

  // Ordenar logs descendente (más reciente primero) y tomar los últimos 5
  const recentLogs = [...logs]
      .sort((a, b) => auditTimestampMs(b.timestamp) - auditTimestampMs(a.timestamp))
      .slice(0, 5);

  // Ordenar tiendas descendente por createdAt
  const recentStores = [...stores]
      .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
      .slice(0, 5);

  if (loading) return (
      <div className="flex items-center justify-center h-[60vh] gap-3 text-neutral-400">
        <Loader2 size={24} className="animate-spin" /> Cargando panel...
      </div>
  );

  return (
      <div className="space-y-5 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Tiendas activas',      value: activeStores },
            { label: 'Usuarios registrados', value: users.length },
            { label: 'Tiendas suspendidas',  value: suspendedStores },
            { label: 'Errores en auditoría', value: errorLogs },
          ].map((m, i) => (
              <Card key={i} className="flex flex-col justify-center gap-3 p-5 min-h-[104px]">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider leading-none">{m.label}</p>
                <span className="text-[30px] font-display font-extrabold leading-none">{m.value}</span>
              </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 overflow-hidden px-0 py-0">
            <div className="px-7 py-3.5 bg-white border-b border-neutral-100">
              <h3 className="text-[18px] font-display font-extrabold">Actividad reciente</h3>
              <p className="text-[12px] font-medium text-neutral-400">Últimos eventos auditables</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-brand-beige-light">
                <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Hora</th>
                  <th className="py-3 px-5">Usuario</th>
                  <th className="py-3 px-5">Evento</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                {recentLogs.map(log => (
                    <tr key={log.id} className="text-[13px] hover:bg-neutral-50 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-neutral-500 text-[12px]">{formatAuditTimestamp(log.timestamp)}</td>
                      <td className="py-3.5 px-5 font-bold text-neutral-900 text-[12px] font-mono">{auditUserLabel(log)}</td>
                      <td className="py-3.5 px-5 font-extrabold text-[12px] uppercase tracking-tight">
                        {auditEventLabel(log.httpMethod, log.endpoint, log.statusCode)}
                      </td>
                    </tr>
                ))}
                {logs.length === 0 && (
                    <tr><td colSpan={3} className="py-8 text-center text-neutral-400 italic text-[13px]">Sin actividad registrada.</td></tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="flex flex-col h-fit overflow-hidden p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[18px] font-display font-extrabold">Tiendas recientes</h3>
                <p className="text-[12px] font-medium text-neutral-400">Resumen rápido</p>
              </div>
            </div>
            <table className="w-full table-fixed text-left">
              <colgroup>
                <col className="w-[68%]" />
                <col className="w-[32%]" />
              </colgroup>
              <thead>
              <tr className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                <th className="pb-2 px-2">Tienda</th>
                <th className="pb-2 px-2 text-center">Estado</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
              {recentStores.map(s => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-2 min-w-0 align-middle">
                      <p className="font-extrabold text-neutral-900 text-[13px] truncate" title={s.storeName}>{s.storeName}</p>
                      <p className="text-[10px] text-neutral-400 font-mono truncate" title={s.slug}>{s.slug}</p>
                    </td>
                    <td className="py-2.5 px-2 text-center align-middle">
                      <Badge className="inline-flex max-w-full justify-center whitespace-nowrap" variant={getStatusVariant(s.storeStatus) as any}>{mapStatus(s.storeStatus)}</Badge>
                    </td>
                  </tr>
              ))}
              {stores.length === 0 && <tr><td colSpan={2} className="py-6 text-center text-neutral-400 italic text-[12px]">Sin tiendas.</td></tr>}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
  );
}
