'use client';

import { useState } from 'react';
import { Button, Card, Badge, Input, Select } from '../UI';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_USERS, MOCK_STORES } from '@/mockData';

interface User {
  name: string;
  email: string;
  role: string;
  store: string;
}

interface UsuariosScreenProps {
  users: typeof MOCK_USERS;
  stores: typeof MOCK_STORES;
  onCreateMerchant: () => void;
}

function roleVariant(role: string) {
  switch (role) {
    case 'Administrador': return 'active';
    case 'Comerciante':   return 'info';
    case 'Cliente':       return 'pending';
    default:              return 'pending';
  }
}

export function UsuariosScreen({ users, stores, onCreateMerchant }: UsuariosScreenProps) {
  const [showPanel, setShowPanel] = useState<'create' | 'edit' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Todos');
  const [filterStore, setFilterStore] = useState('Todas');

  // Form state for create/edit
  const [formName, setFormName]   = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole]   = useState('Comerciante');
  const [formStore, setFormStore] = useState('No aplica');

  const openCreate = () => {
    setSelectedUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Comerciante');
    setFormStore('No aplica');
    setShowPanel('create');
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStore(user.store);
    setShowPanel('edit');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole  = filterRole  === 'Todos'  || user.role  === filterRole;
    const matchesStore = filterStore === 'Todas'  || user.store === filterStore;
    return matchesSearch && matchesRole && matchesStore;
  });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">
            Gestión de usuarios
          </h2>
          <p className="text-[14px] font-medium text-neutral-400">Control de acceso por rol y tenant</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button onClick={onCreateMerchant} variant="secondary" className="flex-1 md:flex-none rounded-full h-12 px-6">
            <Plus size={16} className="mr-2" /> Nuevo comerciante
          </Button>
          <Button onClick={openCreate} className="flex-1 md:flex-none rounded-full h-12 px-6">
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
          <Select label="Rol" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option>Todos</option>
            <option>Administrador</option>
            <option>Comerciante</option>
            <option>Cliente</option>
          </Select>
        </div>
        <div>
          <Select label="Tienda" value={filterStore} onChange={(e) => setFilterStore(e.target.value)}>
            <option>Todas</option>
            {stores.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <Card className="flex-1 px-0 py-2 overflow-hidden w-full">
          <div className="px-8 py-4 mb-2">
            <h3 className="text-[18px] font-display font-extrabold text-brand-black">Usuarios del sistema</h3>
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
                    onClick={() => openEdit(user)}
                  >
                    <td className="py-5 px-8 font-extrabold text-neutral-900">{user.name}</td>
                    <td className="py-5 px-4 font-medium text-neutral-600 font-mono text-[12px]">{user.email}</td>
                    <td className="py-5 px-4">
                      <Badge variant={roleVariant(user.role) as any}>{user.role}</Badge>
                    </td>
                    <td className="py-5 px-8 font-medium text-neutral-500">{user.store}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-neutral-400 font-medium italic">
                      No se encontraron usuarios con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="w-full xl:w-[400px] shrink-0"
            >
              <Card className="p-8 border-2 border-neutral-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[24px] font-display font-extrabold text-brand-black">
                    {showPanel === 'create' ? 'Crear usuario' : 'Editar usuario'}
                  </h3>
                  <button onClick={() => setShowPanel(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X size={20} className="text-neutral-500" />
                  </button>
                </div>

                <div className="space-y-5">
                  <Input
                    label="Nombre completo"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Lucía Vega"
                  />
                  <Input
                    label="Correo"
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="lucia@tienda.com"
                  />
                  <Select
                    label="Rol"
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                  >
                    <option>Administrador</option>
                    <option>Comerciante</option>
                    <option>Cliente</option>
                  </Select>
                  <Select
                    label="Tienda asociada"
                    value={formStore}
                    onChange={e => setFormStore(e.target.value)}
                  >
                    <option>No aplica</option>
                    {stores.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>

                  <div className="bg-[#e2ead8] p-4 rounded-xl">
                    <p className="text-[12px] font-bold text-[#6d7a5b]">
                      Se asignará contraseña temporal al guardar.
                    </p>
                    <p className="text-[10px] text-[#6d7a5b] opacity-80 uppercase font-bold mt-1">
                      El alta respeta validación por rol y tenant.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" className="flex-1" onClick={() => setShowPanel(null)}>
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={!formName.trim() || !formEmail.trim()}
                    >
                      Guardar usuario
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
