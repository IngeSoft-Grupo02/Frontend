'use client';

import { Badge, Card, Input, Select } from '@/domains/admin/components/UI';
import { Button } from '@/domains/admin/components/UI';
import { api, AuditLogResponse } from '@/domains/admin/lib/api';
import { auditEventLabel } from '@/domains/admin/lib/audit-event';
import { auditRoleLabel, auditUserLabel } from '@/domains/admin/lib/audit-display';
import { auditTimestampMs, formatAuditTimestamp } from '@/domains/admin/lib/audit-time';
import { useAutoRefresh } from '@/domains/shared/hooks/useAutoRefresh';
import { Search, Loader2, AlertCircle, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const PAGE_SIZE = 6;

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
  const hasLoadedLogsRef = useRef(false);

  const loadLogs = useCallback(async (background = false) => {
    try {
      if (!background) {
        setLoading(true); setError(null);
      }
      const data = await api.audit.getAll();
      setLogs(data);
      hasLoadedLogsRef.current = true;
    } catch (e: any) {
      if (!background || !hasLoadedLogsRef.current) setError(e.message);
    } finally {
      if (!background) setLoading(false);
    }
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  useAutoRefresh({
    enabled: true,
    intervalMs: 30000,
    onRefresh: () => loadLogs(true),
  });

  // Resetear página al cambiar filtros
  useEffect(() => { setPage(1); }, [filterLevel, searchUser, searchTenant, sortOrder, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    let result = [...logs];
    if (filterLevel)  result = result.filter(l => l.level === filterLevel);
    if (searchUser)   result = result.filter(l => (l.userEmail ?? '').toLowerCase().includes(searchUser.toLowerCase()));
    if (searchTenant) result = result.filter(l => (l.tenantSlug ?? '').toLowerCase().includes(searchTenant.toLowerCase()));
    if (dateFrom) {
      const from = new Date(`${dateFrom}T00:00:00`).getTime();
      result = result.filter(l => auditTimestampMs(l.timestamp) >= from);
    }
    if (dateTo) {
      const to = new Date(`${dateTo}T23:59:59.999`);
      result = result.filter(l => auditTimestampMs(l.timestamp) <= to.getTime());
    }
    result.sort((a, b) => {
      const diff = auditTimestampMs(a.timestamp) - auditTimestampMs(b.timestamp);
      return sortOrder === 'desc' ? -diff : diff;
    });
    return result;
  }, [logs, filterLevel, searchUser, searchTenant, sortOrder, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);
  const paginated = filtered.slice(pageStart, pageEnd);

  useEffect(() => {
    setPage(current => Math.min(current, totalPages));
  }, [totalPages]);

  const exportCsv = () => {
    const header = 'Fecha,Usuario,Rol,Tienda,Evento,HTTP,Endpoint,Status,Nivel\n';
    const rows = filtered.map(l =>
        `"${formatAuditTimestamp(l.timestamp)}","${auditUserLabel(l)}","${auditRoleLabel(l)}","${l.tenantSlug || '—'}","${auditEventLabel(l.httpMethod, l.endpoint, l.statusCode)}","${l.httpMethod}","${l.endpoint}","${l.statusCode}","${l.level}"`
    ).join('\n');
    const blob = new Blob([header+rows], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='auditoria.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
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

        <Card className="px-0 py-0 overflow-hidden">
          <div className="px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <h3 className="text-[18px] font-display font-extrabold">Registro de actividad</h3>
              <span className="inline-flex items-center rounded-full bg-brand-beige-light px-3 py-1 text-[12px] font-bold text-neutral-500">
                {loading ? '...' : `${paginated.length} de ${filtered.length} evento${filtered.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            <Button variant="secondary" className="rounded-full shadow-sm px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap" onClick={exportCsv}>
              <Download size={14}/> Exportar CSV
            </Button>
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
                      <th className="py-4 px-8 text-center">Tipo</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                    {paginated.map(log => (
                        <tr key={log.id} className="text-[13px] hover:bg-neutral-50 transition-colors">
                          <td className="py-5 px-8 font-medium text-neutral-400 text-[12px]">{formatAuditTimestamp(log.timestamp)}</td>
                          <td className="py-5 px-4 font-bold text-neutral-900 font-mono text-[12px]">{auditUserLabel(log)}</td>
                          <td className="py-5 px-4 text-neutral-400 font-medium uppercase text-[11px]">{auditRoleLabel(log)}</td>
                          <td className="py-5 px-4 font-extrabold text-neutral-700">{log.tenantSlug || '—'}</td>
                          <td className="py-5 px-4 font-extrabold text-[12px] uppercase">
                            {auditEventLabel(log.httpMethod, log.endpoint, log.statusCode)}
                          </td>
                          <td className="py-5 px-8 text-center">
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
                {filtered.length > PAGE_SIZE && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100 px-6 py-4">
                      <p className="text-[12px] font-bold text-neutral-400">
                        Mostrando {pageStart + 1}-{pageEnd} de {filtered.length} eventos
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(current => Math.max(1, current - 1))}
                            className="rounded-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={14} /> Anterior
                        </Button>
                        <span className="min-w-[92px] text-center text-[12px] font-black text-neutral-500">
                          {page} / {totalPages}
                        </span>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(current => Math.min(totalPages, current + 1))}
                            className="rounded-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Siguiente <ChevronRight size={14} />
                        </Button>
                      </div>
                    </div>
                )}
              </>
          )}
        </Card>
      </div>
  );
}
