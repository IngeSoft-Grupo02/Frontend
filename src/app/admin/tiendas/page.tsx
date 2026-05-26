'use client';

import { useApp } from '@/context/AppContext';
import { AlertTriangle, CheckCircle2, Filter, MoreVertical, Plus, Search, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function TiendasPage() {
  const { stores, updateStore } = useApp();
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');

  // Filtrar tiendas
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          store.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todas' || store.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Activa': return <CheckCircle2 size={16} className="text-green-600" />;
      case 'Suspendida': return <XCircle size={16} className="text-red-500" />;
      case 'Inactiva': return <AlertTriangle size={16} className="text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Directorio de Tiendas</h1>
          <p className="text-sm text-slate-500">Gestiona y visualiza todas las tiendas registradas.</p>
        </div>
        <Link 
          href="/admin/tiendas/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus size={18} />
          Nueva Tienda
        </Link>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-400"
          />
        </div>
        
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-400 appearance-none cursor-pointer"
          >
            <option value="Todas">Todos los estados</option>
            <option value="Activa">Activa</option>
            <option value="Suspendida">Suspendida</option>
            <option value="Inactiva">Inactiva</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-sm text-slate-500">
          Total: <span className="font-bold text-slate-900 ml-1">{filteredStores.length}</span>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Nombre de la Tienda</th>
                <th className="px-6 py-4 font-medium">Responsable</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Fecha Registro</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{store.name}</td>
                  <td className="px-6 py-4 text-slate-600">{store.responsible}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      store.status === 'Activa' ? 'bg-green-50 text-green-700 border-green-100' : 
                      store.status === 'Suspendida' ? 'bg-red-50 text-red-700 border-red-100' : 
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {getStatusIcon(store.status)}
                      {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{store.registrationDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-900 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No se encontraron tiendas con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}