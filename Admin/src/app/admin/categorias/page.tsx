'use client';

import { Badge, Button, Card, Input, Select } from '@/components/UI';
import { useApp } from '@/context/AppContext';
import { Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CategoriasPage() {
  const router = useRouter();
  const { categories, updateCategory } = useApp();
  
  const [showDetail, setShowDetail] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todas' || cat.status === filterStatus || 
                         (filterStatus === 'Activas' && cat.status === 'Activa') || 
                         (filterStatus === 'Inactivas' && cat.status === 'Inactiva');
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = () => {
    if (showDetail) {
      const newStatus = showDetail.status === 'Activa' ? 'Inactiva' : 'Activa';
      updateCategory(showDetail.name, { status: newStatus });
      setShowDetail({ ...showDetail, status: newStatus });
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Catálogo global</h2>
          <p className="text-[14px] font-medium text-neutral-400">Jerarquía y nomenclaturas unificadas</p>
        </div>
        <Button onClick={() => router.push('/admin/categorias/nueva')} className="rounded-full h-12 px-8 w-full md:w-auto">
          <Plus size={16} className="mr-2" /> Nueva categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="sm:col-span-2">
          <Input 
            label="Buscar categoría" 
            placeholder="Nombre o descripción" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select 
            label="Estado"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option>Todas</option>
            <option>Activas</option>
            <option>Inactivas</option>
          </Select>
        </div>
      </div>

      <Card className="px-0 py-2 overflow-hidden">
        <div className="px-8 py-4 mb-4">
          <h3 className="text-[18px] font-extrabold">Catálogo maestro</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-[#f1ede4]">
              <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-4 px-8">Nombre</th>
                <th className="py-4 px-4">Descripción</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-8 text-right">Uso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCategories.map((cat, i) => (
                <tr 
                  key={i} 
                  className="text-[13px] hover:bg-neutral-50 cursor-pointer transition-colors"
                  onClick={() => setShowDetail(cat)}
                >
                  <td className="py-6 px-8 font-extrabold text-neutral-900">{cat.name}</td>
                  <td className="py-6 px-4 font-medium text-neutral-400">{cat.description}</td>
                  <td className="py-6 px-4">
                    <Badge variant={cat.status === 'Activa' ? 'active' : 'suspended'}>{cat.status}</Badge>
                  </td>
                  <td className="py-6 px-8 text-right font-bold text-neutral-700">{cat.use} tiendas vinculadas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Detalle */}
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
                  <h4 className="text-[28px] font-display font-extrabold tracking-tight">Detalle de categoría</h4>
                  <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-neutral-100 rounded-full">
                    <X size={24} />
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
                      <Badge variant={showDetail.status === 'Activa' ? 'active' : 'suspended'}>{showDetail.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Descripción</p>
                    <p className="text-[14px] text-neutral-500 font-medium">{showDetail.description}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase mb-1">Uso en tiendas</p>
                    <p className="text-[16px] font-extrabold text-brand-black">{showDetail.use} tiendas vinculadas</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    className="flex-1 rounded-2xl h-14 bg-brand-black text-white font-bold hover:bg-neutral-800 transition-colors" 
                    onClick={handleToggleStatus}
                  >
                    {showDetail.status === 'Activa' ? 'Desactivar' : 'Activar'}
                  </button>
                  <button 
                    className="flex-1 rounded-2xl h-14 border border-neutral-200 text-brand-black font-bold hover:bg-neutral-50 transition-colors"
                    onClick={() => {
                      router.push(`/admin/categorias/${encodeURIComponent(showDetail.name)}/editar`);
                      setShowDetail(null);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}