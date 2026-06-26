'use client';

import { Badge, Button, Card, Input, Select } from '@/domains/admin/components/UI';
import { api, UserResponseDTO } from '@/domains/admin/lib/api';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';
import { useAutoRefresh } from '@/domains/shared/hooks/useAutoRefresh';
import { Plus, UploadCloud, X, Loader2, AlertCircle, Search, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';

// Caché simple en módulo — persiste entre renders pero no entre recargas de página
let _cachedUsers: UserResponseDTO[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minuto

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
  const [users,         setUsers]         = useState<UserResponseDTO[]>(_cachedUsers ?? []);
  const [loading,       setLoading]       = useState(!_cachedUsers);
  const [error,         setError]         = useState<string|null>(null);
  const [showDetail,    setShowDetail]    = useState<UserResponseDTO|null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [filterRole,    setFilterRole]    = useState('');
  const [filterStore,   setFilterStore]   = useState('');
  const hasLoadedUsersRef = useRef(Boolean(_cachedUsers));

  const loadData = useCallback(async (force = false, background = false) => {
    const now = Date.now();
    // Usar caché si está vigente y no es forzado
    if (!force && _cachedUsers && (now - _cacheTime) < CACHE_TTL) {
      setUsers(_cachedUsers);
      setLoading(false);
      return;
    }
    try {
      if (!background) {
        setLoading(true); setError(null);
      }
      const u = await api.users.getAll();
      _cachedUsers = u;
      _cacheTime = Date.now();
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
    onRefresh: () => loadData(true, true),
  });

  const filtered = users.filter(u => {
    const name = `${u.firstName ?? ''} ${u.paternalSurname ?? ''} ${u.email}`.toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase());
    const matchRole   = !filterRole  || u.role === filterRole;
    const matchStore  = !filterStore || (u.storeName ?? '').toLowerCase().includes(filterStore.toLowerCase());
    return matchSearch && matchRole && matchStore;
  });

  const handleDeactivate = async (user: UserResponseDTO) => {
    if (!window.confirm(`¿Desactivar el usuario "${user.email}"?`)) return;
    setActionLoading(true);
    try {
      await api.users.deactivate(user.id);
      _cachedUsers = null; // Invalidar caché
      setShowDetail(null);
      await loadData(true);
    } catch (e: any) { setError(e.message); }
    finally { setActionLoading(false); }
  };

  return (
      <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-[28px] font-display font-extrabold tracking-tight">Usuarios del sistema</h2>
            <p className="text-[14px] font-medium text-neutral-400">Control de acceso por rol y tenant</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="secondary" className="rounded-full h-12 px-4" title="Actualizar"
                    onClick={() => loadData(true)} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>
            </Button>
            <Button variant="secondary" className="flex-1 md:flex-none rounded-full h-12 px-8 shadow-sm"
                    onClick={() => router.push(ADMIN_ROUTES.bulk)}>
              <UploadCloud size={14} className="mr-2"/> Carga masiva
            </Button>
            <Button onClick={() => router.push(ADMIN_ROUTES.newUser)}
                    className="flex-1 md:flex-none rounded-full h-12 px-8 shadow-lg">
              <Plus size={16} className="mr-2"/> Nuevo usuario
            </Button>
          </div>
        </div>

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

        <Card className="px-0 py-2 overflow-hidden">
          <div className="px-8 py-4 mb-2 flex items-center justify-between">
            <h3 className="text-[18px] font-display font-extrabold">Usuarios del sistema</h3>
            <span className="text-[12px] font-bold text-neutral-400">{filtered.length} usuario{filtered.length !== 1 ? 's' : ''}</span>
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
                  {filtered.map(u => (
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
                      <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-neutral-100 rounded-full">
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
                        <Button className="flex-1 rounded-2xl h-14"
                                onClick={() => { router.push(ADMIN_ROUTES.editUser(showDetail.id)); setShowDetail(null); }}>
                          Editar usuario
                        </Button>
                        {showDetail.active && (
                            <Button variant="secondary"
                                    className="flex-1 rounded-2xl h-14 text-red-500 border-red-100 hover:bg-red-50"
                                    onClick={() => handleDeactivate(showDetail)} disabled={actionLoading}>
                              {actionLoading ? <Loader2 size={16} className="animate-spin"/> : 'Desactivar'}
                            </Button>
                        )}
                      </div>
                      <Button variant="secondary" className="w-full rounded-2xl h-12"
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
