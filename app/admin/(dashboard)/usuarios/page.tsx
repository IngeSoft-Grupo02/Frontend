'use client';

import { Badge, Button, Card, Input, Select } from '@/domains/admin/components/UI';
import { api, UserResponseDTO } from '@/domains/admin/lib/api';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';
import { useAutoRefresh } from '@/domains/shared/hooks/useAutoRefresh';
import { Plus, UploadCloud, X, Loader2, AlertCircle, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';

const USERS_PAGE_SIZE = 6;

const ROLE_LABEL: Record<string,string> = {
  SYSTEM_ADMIN: 'Administrador', MERCHANT: 'Comerciante', CUSTOMER: 'Cliente'
};
function formatRole(r: string) { return ROLE_LABEL[r] ?? r; }
function roleVariant(r: string) {
  if (r === 'SYSTEM_ADMIN') return 'active';
  if (r === 'MERCHANT') return 'warning';
  return 'info';
}

export default function UsuariosPage() {
  const router = useRouter();
  const [users,         setUsers]         = useState<UserResponseDTO[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string|null>(null);
  const [showDetail,    setShowDetail]    = useState<UserResponseDTO|null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [filterRole,    setFilterRole]    = useState('');
  const [filterStore,   setFilterStore]   = useState('');
  const hasLoadedUsersRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = useCallback(async (background = false) => {
    try {
      if (!background) {
        setLoading(true); setError(null);
      }
      const u = await api.users.getAll();
      setUsers(u);
      hasLoadedUsersRef.current = true;
    } catch (e: any) {
      if (!background || !hasLoadedUsersRef.current) setError(e.message);
    }
    finally {
      if (!background) setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useAutoRefresh({
    enabled: true,
    intervalMs: 30000,
    onRefresh: () => loadData(true),
  });

  const filtered = users.filter(u => {
    const name = `${u.firstName ?? ''} ${u.paternalSurname ?? ''} ${u.email}`.toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase());
    const matchRole   = !filterRole  || u.role === filterRole;
    const matchStore  = !filterStore || (u.storeName ?? '').toLowerCase().includes(filterStore.toLowerCase());
    return matchSearch && matchRole && matchStore;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / USERS_PAGE_SIZE));
  const pageStart = (currentPage - 1) * USERS_PAGE_SIZE;
  const pageEnd = Math.min(pageStart + USERS_PAGE_SIZE, filtered.length);
  const paginatedUsers = filtered.slice(pageStart, pageEnd);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStore]);

  useEffect(() => {
    setCurrentPage(page => Math.min(page, totalPages));
  }, [totalPages]);

  const handleDeactivate = async (user: UserResponseDTO) => {
    if (!window.confirm(`¿Desactivar el usuario "${user.email}"?`)) return;
    setActionLoading(true);
    try {
      await api.users.deactivate(user.id);
      setShowDetail(null);
      await loadData();
    } catch (e: any) { setError(e.message); }
    finally { setActionLoading(false); }
  };

  return (
      <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          <Input label="Buscar" placeholder="Nombre o correo" icon={Search}
                 value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <Select label="Rol" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="">Todos</option>
            <option value="SYSTEM_ADMIN">Administrador</option>
            <option value="MERCHANT">Comerciante</option>
            <option value="CUSTOMER">Cliente</option>
          </Select>
          <Input label="Tienda" placeholder="Buscar por tienda..." icon={Search}
                 value={filterStore} onChange={e => setFilterStore(e.target.value)} />
        </div>

        <Card className="px-0 py-0 overflow-hidden">
          <div className="px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <h3 className="text-[18px] font-display font-extrabold">Usuarios del sistema</h3>
              <span className="inline-flex items-center rounded-full bg-brand-beige-light px-3 py-1 text-[12px] font-bold text-neutral-500">
                {filtered.length} usuario{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button variant="secondary" className="rounded-full h-10 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap" title="Actualizar"
                      onClick={() => loadData()} disabled={loading}>
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>
              </Button>
              <Button className="flex-1 lg:flex-none rounded-full px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap"
                      onClick={() => router.push(ADMIN_ROUTES.bulk)}>
                <UploadCloud size={14}/> Carga masiva
              </Button>
              <Button onClick={() => router.push(ADMIN_ROUTES.newUser)}
                      className="flex-1 lg:flex-none rounded-full px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <Plus size={16}/> Nuevo usuario
              </Button>
            </div>
          </div>
          {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-neutral-400">
                <Loader2 size={20} className="animate-spin"/> Cargando...
              </div>
          ) : error ? (
              <div className="flex items-center justify-center py-20 gap-3 text-red-500">
                <AlertCircle size={20}/> {error}
              </div>
          ) : (
              <>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-[#f1ede4]">
                  <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-4 px-8">Nombre</th>
                    <th className="py-4 px-4">Correo</th>
                    <th className="py-4 px-4">Rol</th>
                    <th className="py-4 px-8">Tienda</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                  {paginatedUsers.map(u => (
                      <tr key={u.id} className="text-[13px] hover:bg-neutral-50 cursor-pointer transition-colors"
                          onClick={() => setShowDetail(u)}>
                        <td className="py-5 px-8 font-extrabold text-neutral-900">
                          {u.firstName ? `${u.firstName} ${u.paternalSurname ?? ''}` : '—'}
                        </td>
                        <td className="py-5 px-4 font-medium text-neutral-600 font-mono text-[12px]">{u.email}</td>
                        <td className="py-5 px-4">
                          <Badge variant={roleVariant(u.role) as any}>{formatRole(u.role)}</Badge>
                        </td>
                        <td className="py-5 px-8 font-medium text-neutral-500">{u.storeName ?? '—'}</td>
                      </tr>
                  ))}
                  {filtered.length === 0 && (
                      <tr><td colSpan={4} className="py-20 text-center text-neutral-400 italic">
                        No se encontraron usuarios.
                      </td></tr>
                  )}
                  </tbody>
                </table>
              </div>
              {filtered.length > USERS_PAGE_SIZE && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100 px-6 py-4">
                    <p className="text-[12px] font-bold text-neutral-400">
                      Mostrando {pageStart + 1}-{pageEnd} de {filtered.length} usuarios
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                          className="rounded-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={14} /> Anterior
                      </Button>
                      <span className="min-w-[92px] text-center text-[12px] font-black text-neutral-500">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
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

        {/* Modal detalle — transición rápida */}
        <AnimatePresence mode="wait">
          {showDetail && (
              <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity:0, scale:0.97, y:10 }}
                    animate={{ opacity:1, scale:1, y:0 }}
                    exit={{ opacity:0, scale:0.97, y:10 }}
                    transition={{ duration: 0.15 }}
                    className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden">
                  <div className="p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h4 className="text-[28px] font-display font-extrabold tracking-tight">Detalle de usuario</h4>
                        <p className="text-[14px] font-medium text-neutral-400">{showDetail.email}</p>
                      </div>
                      <button
                          type="button"
                          aria-label="Cerrar detalle"
                          title="Cerrar"
                          onClick={() => setShowDetail(null)}
                          className="w-10 h-10 shrink-0 inline-flex items-center justify-center hover:bg-neutral-100 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-camel"
                      >
                        <X size={24}/>
                      </button>
                    </div>
                    <div className="space-y-5 mb-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Nombre</p>
                          <p className="font-extrabold text-neutral-900">
                            {showDetail.firstName ? `${showDetail.firstName} ${showDetail.paternalSurname ?? ''}` : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Rol</p>
                          <Badge variant={roleVariant(showDetail.role) as any}>{formatRole(showDetail.role)}</Badge>
                        </div>
                      </div>
                      {showDetail.documentNumber && (
                          <div>
                            <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Documento</p>
                            <p className="font-bold text-neutral-700">{showDetail.documentType} · {showDetail.documentNumber}</p>
                          </div>
                      )}
                      {showDetail.phone && (
                          <div>
                            <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Teléfono</p>
                            <p className="font-bold text-neutral-700">{showDetail.phone}</p>
                          </div>
                      )}
                      {showDetail.ruc && (
                          <div>
                            <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">RUC</p>
                            <p className="font-bold text-neutral-700">{showDetail.ruc}</p>
                          </div>
                      )}
                      <div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Tienda asociada</p>
                        <p className="font-bold text-neutral-700">{showDetail.storeName ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Estado</p>
                        <Badge variant={showDetail.active ? 'active' : 'inactive'}>
                          {showDetail.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <Button className="flex-1 rounded-2xl h-14 border border-brand-black inline-flex items-center justify-center whitespace-nowrap"
                                onClick={() => { router.push(ADMIN_ROUTES.editUser(showDetail.id)); setShowDetail(null); }}>
                          Editar usuario
                        </Button>
                        {showDetail.active && (
                            <Button variant="secondary"
                                    className="flex-1 rounded-2xl h-14 border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center justify-center whitespace-nowrap"
                                    onClick={() => handleDeactivate(showDetail)} disabled={actionLoading}>
                              {actionLoading ? <Loader2 size={16} className="animate-spin"/> : 'Desactivar'}
                            </Button>
                        )}
                      </div>
                      <Button variant="secondary" className="w-full rounded-2xl h-12 border border-neutral-200 inline-flex items-center justify-center whitespace-nowrap"
                              onClick={() => setShowDetail(null)}>Cerrar</Button>
                    </div>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>
      </div>
  );
}
