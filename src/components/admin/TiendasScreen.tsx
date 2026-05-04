'use client';

import { useState } from 'react';
import { Button, Card, Badge, Input, Select } from '../UI';
import { Plus, Search, X, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_STORES } from '@/mockData';

interface TiendasScreenProps {
  stores: typeof MOCK_STORES;
  onCreateStore: () => void;
  onNavigateToBulk: () => void;
  onUpdateStore: (id: string, updates: Partial<typeof MOCK_STORES[0]>) => void;
  onEditStore: (store: typeof MOCK_STORES[0]) => void;
}

export function TiendasScreen({
  stores,
  onCreateStore,
  onNavigateToBulk,
  onUpdateStore,
  onEditStore,
}: TiendasScreenProps) {
  const [showDetail, setShowDetail] = useState<typeof MOCK_STORES[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [sortOrder, setSortOrder] = useState('Más reciente');

  const handleToggleStatus = () => {
    if (showDetail) {
      const newStatus = showDetail.status === 'Activa' ? 'Suspendida' : 'Activa';
      onUpdateStore(showDetail.id, { status: newStatus });
      setShowDetail({ ...showDetail, status: newStatus });
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         store.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todas' || store.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOrder === 'A-Z') return a.name.localeCompare(b.name);
    if (sortOrder === 'Z-A') return b.name.localeCompare(a.name);
    if (sortOrder === 'Más reciente') {
      const dateA = a.registrationDate.split('/').reverse().join('-');
      const dateB = b.registrationDate.split('/').reverse().join('-');
      return dateB.localeCompare(dateA);
    }
    if (sortOrder === 'Más antiguo') {
      const dateA = a.registrationDate.split('/').reverse().join('-');
      const dateB = b.registrationDate.split('/').reverse().join('-');
      return dateA.localeCompare(dateB);
    }
    return 0;
  });

  return (
    <div className="space-y-8 relative max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">
            Tiendas registradas
          </h2>
          <p className="text-[14px] font-medium text-neutral-400">
            Listado general de tenants con estado operativo
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            variant="secondary" 
            className="flex-1 md:flex-none rounded-full shadow-sm px-6"
            onClick={onNavigateToBulk}
          >
            Carga masiva
          </Button>
          <Button 
            onClick={onCreateStore} 
            className="flex-1 md:flex-none rounded-full px-6"
          >
            <Plus size={14} className="mr-2" /> Nueva tienda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="sm:col-span-2">
          <Input 
            label="Buscar tienda" 
            placeholder="Nombre o correo del responsable" 
            icon={Search} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select 
            label="Estado" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>Todas</option>
            <option>Activa</option>
            <option>Suspendida</option>
            <option>Desactivada</option>
          </Select>
        </div>
        <div>
          <Select 
            label="Orden"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option>Más reciente</option>
            <option>Más antiguo</option>
            <option>A-Z</option>
            <option>Z-A</option>
          </Select>
        </div>
      </div>

      <Card className="px-0 py-2 overflow-hidden">
        <div className="px-8 py-4 mb-4">
          <h3 className="text-[18px] font-display font-extrabold text-brand-black">
            Directorio de tiendas
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-[#f1ede4]">
              <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-4 px-8">Nombre</th>
                <th className="py-4 px-4">Identificador</th>
                <th className="py-4 px-4">Correo responsable</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-8 text-right">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredStores.map((store, i) => (
                <tr 
                  key={i} 
                  className="text-[13px] hover:bg-neutral-50 cursor-pointer transition-colors"
                  onClick={() => setShowDetail(store)}
                >
                  <td className="py-5 px-8 font-extrabold text-neutral-900">{store.name}</td>
                  <td className="py-5 px-4 font-medium text-neutral-500">{store.id}</td>
                  <td className="py-5 px-4 font-medium text-neutral-600 font-mono text-[12px]">
                    {store.responsible}
                  </td>
                  <td className="py-5 px-4">
                    <Badge variant={store.status.toLowerCase() as any}>{store.status}</Badge>
                  </td>
                  <td className="py-5 px-8 text-right font-medium text-neutral-500">
                    {store.registrationDate}
                  </td>
                </tr>
              ))}
              {filteredStores.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-neutral-400 font-medium italic">
                    No se encontraron tiendas con los filtros aplicados.
                  </td>
                </tr>
              )}
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
                    <h4 className="text-[28px] font-display font-extrabold tracking-tight text-brand-black">
                      Detalle de tienda
                    </h4>
                    <p className="text-[14px] font-medium text-neutral-400">ID: {showDetail.id}</p>
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
                      <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Estado</p>
                      <Badge variant={showDetail.status.toLowerCase() as any}>{showDetail.status}</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Responsable</p>
                    <p className="font-bold text-neutral-700">{showDetail.responsible}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Motivo / Observación</p>
                    <p className="text-[14px] text-neutral-500 font-medium">
                      {showDetail.status === 'Suspendida' 
                        ? 'Falta de pago de servicios Cloud.' 
                        : 'Operativa sin incidencias reportadas.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 rounded-2xl h-14"
                    onClick={handleToggleStatus}
                  >
                    {showDetail.status === 'Activa' ? 'Suspender' : 'Reactivar'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1 rounded-2xl h-14"
                    onClick={() => {
                      if (showDetail) {
                        onEditStore(showDetail);
                        setShowDetail(null);
                      }
                    }}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}