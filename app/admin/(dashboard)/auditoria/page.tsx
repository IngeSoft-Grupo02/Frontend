'use client';

import { Badge, Card, Input, Select } from '@/domains/admin/components/UI';
import { Button } from '@/domains/admin/components/UI';
import { api, AuditLogResponse } from '@/domains/admin/lib/api';
import { Search, Loader2, AlertCircle, Download, ChevronDown } from 'lucide-react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const PAGE_SIZE = 30;

function endpointToEvento(method: string, endpoint: string, statusCode: number): string {
  const e = endpoint.toLowerCase(); const ok = statusCode < 400;
  if (e.includes('/auth/login'))     return ok ? 'Inicio de sesión' : 'Inicio de sesión fallido';
  if (e.includes('/auth/logout'))    return 'Cierre de sesión';
  if (method==='POST' && e.includes('/admin/stores') && !e.includes('suspend') && !e.includes('deactivate') && !e.includes('reactivate'))
    return ok ? 'Tienda registrada' : 'Error al registrar tienda';
  if (e.includes('/suspend'))        return ok ? 'Tienda suspendida' : 'Error al suspender tienda';
  if (e.includes('/reactivate'))     return ok ? 'Tienda reactivada' : 'Error al reactivar tienda';
  if (e.includes('/deactivate') && e.includes('/stores')) return ok ? 'Tienda desactivada' : 'Error al desactivar tienda';
  if (method==='PUT'  && e.includes('/admin/stores')) return ok ? 'Tienda editada' : 'Error al editar tienda';
  if (method==='POST' && e.includes('/admin/users'))  return ok ? 'Usuario creado' : 'Error al crear usuario';
  if (method==='PUT'  && e.includes('/admin/users'))  return ok ? 'Usuario actualizado' : 'Error al actualizar usuario';
  if (e.includes('/deactivate') && e.includes('/users')) return ok ? 'Usuario desactivado' : 'Error al desactivar usuario';
  if (e.includes('/admin/bulk/upload')) return ok ? 'Carga masiva ejecutada' : 'Error en carga masiva';
  if (e.includes('/admin/audit'))       return 'Consulta de auditoría';
  if (e.includes('/admin/stores/metrics')) return 'Consulta de métricas';
  if (e.includes('/admin/system/config') && method==='PUT') return 'Parámetros actualizados';
  if (e.includes('/admin/system/config')) return 'Consulta de configuración';
  return `${method} ${endpoint}`;
}

function getLevelVariant(level: string) {
  if (level==='INFO')  return 'active';
  if (level==='WARN')  return 'warning';
  if (level==='ERROR') return 'error';
  return 'neutral';
}

function getLevelLabel(level: string) {
  if (level==='WARN') return 'ALERTA';
  return level;
}

function formatTs(ts: string) {
  try { return new Date(ts).toLocaleString('es-PE'); } catch { return ts; }
}

export default function AuditoriaPage() {
  const [logs,        setLogs]        = useState<AuditLogResponse[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string|null>(null);
  const [page,        setPage]        = useState(1);

  // Filtros
  const [filterLevel,  setFilterLevel]  = useState('');
  const [searchUser,   setSearchUser]   = useState('');
  const [searchTenant, setSearchTenant] = useState('');
  const [sortOrder,    setSortOrder]    = useState<'desc'|'asc'>('desc');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');

  useEffect(() => {
    setLoading(true); setError(null);
    api.audit.getAll()
        .then(setLogs)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
  }, []);

  // Resetear página al cambiar filtros
  useEffect(() => { setPage(1); }, [filterLevel, searchUser, searchTenant, sortOrder, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    let result = [...logs];
    if (filterLevel)  result = result.filter(l => l.level === filterLevel);
    if (searchUser)   result = result.filter(l => (l.userEmail ?? '').toLowerCase().includes(searchUser.toLowerCase()));
    if (searchTenant) result = result.filter(l => (l.tenantSlug ?? '').toLowerCase().includes(searchTenant.toLowerCase()));
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter(l => new Date(l.timestamp).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo); to.setHours(23,59,59,999);
      result = result.filter(l => new Date(l.timestamp).getTime() <= to.getTime());
    }
    result.sort((a, b) => {
      const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? -diff : diff;
    });
    return result;
  }, [logs, filterLevel, searchUser, searchTenant, sortOrder, dateFrom, dateTo]);

  // Paginación incremental
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore   = paginated.length < filtered.length;

  const exportCsv = () => {
    const header = 'Fecha,Usuario,Rol,Tienda,Evento,HTTP,Endpoint,Status,Nivel\n';
    const rows = filtered.map(l =>
        `"${formatTs(l.timestamp)}","${l.userEmail}","${l.role}","${l.tenantSlug}","${endpointToEvento(l.httpMethod, l.endpoint, l.statusCode)}","${l.httpMethod}","${l.endpoint}","${l.statusCode}","${l.level}"`
    ).join('\n');
    const blob = new Blob([header+rows], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='auditoria.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-[28px] font-display font-extrabold tracking-tight">Registro Maestro de Eventos</h2>
            <p className="text-[14px] font-medium text-neutral-400">Detalle granular de acciones administrativas</p>
          </div>
          <Button variant="secondary" className="rounded-full shadow-sm" onClick={exportCsv}>
            <Download size={14} className="mr-2"/> Exportar CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select label="Tipo" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
            <option value="">Todas</option>
            <option value="INFO">INFO</option>
            <option value="WARN">ALERTA</option>
            <option value="ERROR">ERROR</option>
          </Select>
          <Input label="Usuario" placeholder="Buscar por email..." icon={Search}
                 value={searchUser} onChange={e => setSearchUser(e.target.value)} />
          <Input label="Tienda" placeholder="Buscar por slug..." icon={Search}
                 value={searchTenant} onChange={e => setSearchTenant(e.target.value)} />
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Desde</label>
            <input type="date" value={dateFrom} max={dateTo || undefined}
                   onChange={e => { const v = e.target.value; setDateFrom(v); if (dateTo && v > dateTo) setDateTo(''); }}
                   className="w-full px-5 py-3.5 bg-white border border-neutral-200 rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors"/>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Hasta</label>
            <input type="date" value={dateTo} min={dateFrom || undefined}
                   onChange={e => setDateTo(e.target.value)}
                   className="w-full px-5 py-3.5 bg-white border border-neutral-200 rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors"/>
          </div>
          <Select label="Orden" value={sortOrder} onChange={e => setSortOrder(e.target.value as 'desc'|'asc')}>
            <option value="desc">Más reciente primero</option>
            <option value="asc">Más antiguo primero</option>
          </Select>
        </div>

        <Card className="px-0 py-2 overflow-hidden">
          <div className="px-8 py-4 mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-display font-extrabold">Registro de actividad</h3>
            <span className="text-[12px] font-bold text-neutral-400">
            {loading ? '...' : `${paginated.length} de ${filtered.length} evento${filtered.length !== 1 ? 's' : ''}`}
          </span>
          </div>
          {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-neutral-400">
                <Loader2 size={20} className="animate-spin"/> Cargando registros...
              </div>
          ) : error ? (
              <div className="flex items-center justify-center py-20 gap-3 text-red-500">
                <AlertCircle size={20}/> {error}
              </div>
          ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-[#f1ede4]">
                    <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      <th className="py-4 px-8">Fecha / Hora</th>
                      <th className="py-4 px-4">Usuario</th>
                      <th className="py-4 px-4">Rol</th>
                      <th className="py-4 px-4">Tienda</th>
                      <th className="py-4 px-4">Acción</th>
                      <th className="py-4 px-8 text-right">Tipo</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                    {paginated.map(log => (
                        <tr key={log.id} className="text-[13px] hover:bg-neutral-50 transition-colors">
                          <td className="py-5 px-8 font-medium text-neutral-400 text-[12px]">{formatTs(log.timestamp)}</td>
                          <td className="py-5 px-4 font-bold text-neutral-900 font-mono text-[12px]">{log.userEmail || '—'}</td>
                          <td className="py-5 px-4 text-neutral-400 font-medium uppercase text-[11px]">{log.role || '—'}</td>
                          <td className="py-5 px-4 font-extrabold text-neutral-700">{log.tenantSlug || '—'}</td>
                          <td className="py-5 px-4 font-extrabold text-[12px] uppercase">
                            {endpointToEvento(log.httpMethod, log.endpoint, log.statusCode)}
                          </td>
                          <td className="py-5 px-8 text-right">
                            <Badge variant={getLevelVariant(log.level) as any}>{getLevelLabel(log.level)}</Badge>
                          </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr><td colSpan={6} className="py-12 text-center text-neutral-400 italic">
                          No se encontraron registros.
                        </td></tr>
                    )}
                    </tbody>
                  </table>
                </div>
                {/* Botón cargar más */}
                {hasMore && (
                    <div className="flex justify-center py-6 border-t border-neutral-100">
                      <Button variant="secondary" className="rounded-full px-8 gap-2"
                              onClick={() => setPage(p => p + 1)}>
                        <ChevronDown size={16}/> Cargar más ({filtered.length - paginated.length} restantes)
                      </Button>
                    </div>
                )}
              </>
          )}
        </Card>
      </div>
  );
}
