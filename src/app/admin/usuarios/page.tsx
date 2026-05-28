'use client';

import { Badge, Button, Card, Input, Select } from '@/components/UI';
import { useApp } from '@/context/AppContext';
import { Plus, UploadCloud, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UsuariosPage() {
  const router = useRouter();
  const { users, stores, deleteUser, updateUser } = useApp();
  
  const [showDetail, setShowDetail] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Todos');
  const [filterStore, setFilterStore] = useState('Todas');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'Todos' || user.role === filterRole;
    const matchesStore = filterStore === 'Todas' || user.store === filterStore;
    return matchesSearch && matchesRole && matchesStore;
  });

  const handleEditUser = () => {
    if (showDetail) {
      router.push(`/admin/usuarios/editar?email=${encodeURIComponent(showDetail.email)}`);
    }
  };

  const handleDeleteUser = () => {
    if (showDetail && window.confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteUser(showDetail.email);
      setShowDetail(null);
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Usuarios del sistema</h2>
          <p className="text-[14px] font-medium text-neutral-400">Listado de personal y accesos activos</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            variant="secondary" 
            className="flex-1 md:flex-none rounded-full h-12 px-8 shadow-sm" 
            onClick={() => router.push('/admin/carga-masiva')}
          >
            <UploadCloud size={14} className="mr-2" /> Carga masiva
          </Button>
          <Button 
            onClick={() => router.push('/admin/usuarios/nuevo')} 
            className="flex-1 md:flex-none rounded-full h-12 px-8 shadow-lg"
          >
            <Plus size={16} className="mr-2" /> Nuevo usuario
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="sm:col-span-2">
          <Input 
            label="Buscar" 
            placeholder="Nombre o correo" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select 
            label="Rol" 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option>Todos</option>
            <option>Administrador</option>
            <option>Comerciante</option>
            <option>Cliente</option>
          </Select>
        </div>
        <div>
          <Select 
            label="Tienda"
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
          >
            <option>Todas</option>
            {stores.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <Card className="flex-1 px-0 py-2 overflow-hidden w-full">
          <div className="px-8 py-4 mb-2">
            <h3 className="text-[18px] font-display font-extrabold">Usuarios del sistema</h3>
          </div>
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
                {filteredUsers.map((user, i) => (
                  <tr 
                    key={i} 
                    className="text-[13px] hover:bg-neutral-50 cursor-pointer transition-colors" 
                    onClick={() => setShowDetail(user)}
                  >
                    <td className="py-5 px-8 font-extrabold text-neutral-900">{user.name}</td>
                    <td className="py-5 px-4 font-medium text-neutral-600 font-mono text-[12px]">{user.email}</td>
                    <td className="py-5 px-4">
                      <Badge variant={user.role === 'Administrador' ? 'active' : user.role === 'Comerciante' ? 'warning' : 'info'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-5 px-8 font-medium text-neutral-500">{user.store}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <AnimatePresence>
          {showDetail && (
            <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-md z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
              >
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="text-[28px] font-display font-extrabold tracking-tight">Detalle de usuario</h4>
                      <p className="text-[14px] font-medium text-neutral-400">{showDetail.email}</p>
                    </div>
                    <button 
                      onClick={() => setShowDetail(null)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X size={24} className="text-brand-black" />
                    </button>
                  </div>
                  
                  <div className="space-y-6 mb-10">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Nombre</p>
                        <p className="font-extrabold text-[#0a0a0a]">{showDetail.name}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Rol</p>
                        <Badge variant={showDetail.role === 'Administrador' ? 'active' : showDetail.role === 'Comerciante' ? 'warning' : 'info'}>
                          {showDetail.role}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Tienda asociada</p>
                      <p className="font-bold text-neutral-700">{showDetail.store}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 rounded-2xl h-14"
                        onClick={() => {
                          router.push(`/admin/usuarios/${encodeURIComponent(showDetail.email)}/editar`);
                          setShowDetail(null);
                        }}
                      >
                        Editar usuario
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="flex-1 rounded-2xl h-14 text-red-500 border-red-100 hover:bg-red-50"
                        onClick={handleDeleteUser}
                      >
                        Eliminar
                      </Button>
                    </div>
                    <Button 
                      variant="secondary"
                      className="w-full rounded-2xl h-12"
                      onClick={() => setShowDetail(null)}
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}