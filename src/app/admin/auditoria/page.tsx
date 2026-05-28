'use client';

import { Badge, Button, Card, Input, Select } from '@/components/UI';
import { useApp } from '@/context/AppContext';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function AuditoriaPage() {
  const { auditLogs, stores, users } = useApp();
  
  // Estados para los nuevos inputs de búsqueda
  const [searchUser, setSearchUser] = useState('');
  const [searchTenant, setSearchTenant] = useState('');
  const [filterLevel, setFilterLevel] = useState('Todas');

  // Filtrado combinado
  const filteredLogs = auditLogs.filter(log => {
    const matchesLevel = filterLevel === 'Todas' || log.level === filterLevel;
    const matchesUser = log.user.toLowerCase().includes(searchUser.toLowerCase());
    // Nota: MOCK_AUDIT usa 'tenant', en tu AppContext puede variar, ajustamos para que funcione
    const matchesTenant = log.tenant.toLowerCase().includes(searchTenant.toLowerCase());
    
    return matchesLevel && matchesUser && matchesTenant;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Registro Maestro de Eventos</h2>
          <p className="text-[14px] font-medium text-neutral-400">Detalle granular de acciones administrativas</p>
        </div>
        <Button variant="secondary" className="rounded-full shadow-sm">
          Exportar CSV
        </Button>
      </div>

      {/* Filtros actualizados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        {/* Tipo (Select) */}
        <div>
          <Select 
            label="Tipo" 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option>Todas</option>
            <option>INFO</option>
            <option>ALERTA</option>
            <option>ERROR</option>
          </Select>
        </div>

        {/* Usuario (Input de búsqueda) */}
        <div>
          <Input 
            label="Usuario" 
            placeholder="Buscar por nombre o email..." 
            icon={Search}
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>

        {/* Tienda (Input de búsqueda) */}
        <div>
          <Input 
            label="Tienda" 
            placeholder="Buscar por nombre de tienda..." 
            icon={Search}
            value={searchTenant}
            onChange={(e) => setSearchTenant(e.target.value)}
          />
        </div>

        {/* Rango de fechas (Select) */}
        <div>
          <Select label="Rango de fechas">
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
            <option>Hoy</option>
          </Select>
        </div>
      </div>

      {/* Tabla de Registros */}
      <Card className="px-0 py-2 overflow-hidden">
        <div className="px-8 py-4 mb-4">
          <h3 className="text-[18px] font-display font-extrabold">Registro de actividad</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-[#f1ede4]">
              <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-4 px-8">Fecha/hora</th>
                <th className="py-4 px-4">Usuario</th>
                <th className="py-4 px-4">Rol</th>
                <th className="py-4 px-4">Tienda</th>
                <th className="py-4 px-4">Acción</th>
                <th className="py-4 px-8 text-right">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLogs.map((log, i) => {
                const mockDate = `${log.time.includes('(') ? log.time.split(' ')[0] : log.time} 10/05/2026`;
                
                const variant = log.level === 'INFO' ? 'active' : 
                               log.level === 'ALERTA' ? 'warning' : 
                               log.level === 'ERROR' ? 'error' : 'neutral';

                return (
                  <tr key={i} className="text-[13px] hover:bg-neutral-50 transition-colors">
                    <td className="py-6 px-8 font-medium text-neutral-400">{mockDate}</td>
                    <td className="py-6 px-4 font-bold text-neutral-900">{log.user}</td>
                    <td className="py-6 px-4 text-neutral-400 font-medium uppercase text-[11px]">{log.role}</td>
                    <td className="py-6 px-4 font-extrabold text-neutral-700">{log.tenant}</td>
                    <td className="py-6 px-4 font-extrabold text-[12px] uppercase">{log.action}</td>
                    <td className="py-6 px-8 text-right">
                      <Badge variant={variant}>{log.level}</Badge>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 font-medium italic">
                    No se encontraron registros con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}