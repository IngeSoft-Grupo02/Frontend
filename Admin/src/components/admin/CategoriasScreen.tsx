'use client';

import { MOCK_CATEGORIES, MOCK_STORES } from '@/lib/mockData';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Plus, Search, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Card, Input, Select } from '../UI';

interface CategoriasScreenProps {
  categories: typeof MOCK_CATEGORIES;
  stores: typeof MOCK_STORES;
  onCreate: (category: any) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

export function CategoriasScreen({ categories, stores, onCreate, onUpdate, onDelete }: CategoriasScreenProps) {
  const [showModal, setShowModal]             = useState<'create' | 'edit' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchTerm, setSearchTerm]           = useState('');
  const [filterStatus, setFilterStatus]       = useState('Todas');
  const [nameTouched, setNameTouched]         = useState(false);

  const [formData, setFormData] = useState({
    name: '', description: '', status: 'Activa', assignedStores: [] as string[],
  });

  const nameError = nameTouched && !formData.name.trim() ? 'El nombre de la categoría es obligatorio.' : '';
  const isFormValid = formData.name.trim().length > 0;

  const filteredCategories = categories.filter(cat => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todas' || cat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({ name: '', description: '', status: 'Activa', assignedStores: [] });
    setNameTouched(false);
    setShowModal('create');
  };

  const handleOpenEdit = (category: any) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || '', status: category.status, assignedStores: category.assignedStores || [] });
    setNameTouched(false);
    setShowModal('edit');
  };

  const handleCloseModal = () => { setShowModal(null); setSelectedCategory(null); };

  const handleSubmit = () => {
    setNameTouched(true);
    if (!isFormValid) return;
    if (showModal === 'create') onCreate(formData);
    else if (selectedCategory) onUpdate(selectedCategory.name, formData);
    handleCloseModal();
  };

  const toggleStore = (storeId: string) =>
    setFormData(prev => ({
      ...prev,
      assignedStores: prev.assignedStores.includes(storeId)
        ? prev.assignedStores.filter(id => id !== storeId)
        : [...prev.assignedStores, storeId],
    }));

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">Categorías</h2>
          <p className="text-[14px] font-medium text-neutral-400">Maestro global de categorías de productos</p>
        </div>
        <Button onClick={handleOpenCreate} className="rounded-full px-6 h-12">
          <Plus size={16} className="mr-2" /> Nueva categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
        <div className="sm:col-span-2">
          <Input label="Buscar categoría" placeholder="Nombre o descripción" icon={Search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div>
          <Select label="Estado" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option>Todas</option>
            <option>Activa</option>
            <option>Inactiva</option>
          </Select>
        </div>
      </div>

      <Card className="px-0 py-2 overflow-hidden">
        <div className="px-8 py-4 mb-2">
          <h3 className="text-[18px] font-display font-extrabold text-brand-black">Listado de categorías</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-[#f1ede4]">
              <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-4 px-8">Nombre</th>
                <th className="py-4 px-4">Descripción</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Uso</th>
                <th className="py-4 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCategories.map((cat, i) => (
                <tr key={i} className="text-[13px] hover:bg-neutral-50 transition-colors">
                  <td className="py-5 px-8 font-extrabold text-neutral-900">{cat.name}</td>
                  <td className="py-5 px-4 font-medium text-neutral-600">{cat.description}</td>
                  <td className="py-5 px-4">
                    <Badge variant={cat.status === 'Activa' ? 'activo' : 'pendiente'}>{cat.status}</Badge>
                  </td>
                  <td className="py-5 px-4 text-right font-mono text-[12px] text-neutral-500">{cat.use || 0} tiendas</td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(cat)} className="p-2 hover:bg-brand-camel/10 rounded-lg transition-colors text-brand-camel">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onUpdate(cat.name, { status: cat.status === 'Activa' ? 'Inactiva' : 'Activa' })} className="px-3 py-1 text-[11px] font-bold hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500">
                        {cat.status === 'Activa' ? 'Inactivar' : 'Activar'}
                      </button>
                      <button onClick={() => onDelete(cat.name)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-neutral-400 font-medium italic">No se encontraron categorías.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-[28px] font-display font-extrabold tracking-tight text-brand-black">
                      {showModal === 'create' ? 'Nueva categoría' : 'Editar categoría'}
                    </h3>
                    <p className="text-[14px] font-medium text-neutral-400">
                      {showModal === 'create' ? 'Crea una categoría global disponible para todas las tiendas' : 'Ajusta los detalles de la categoría'}
                    </p>
                  </div>
                  <button onClick={handleCloseModal} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X size={24} className="text-brand-black" />
                  </button>
                </div>

                <div className="space-y-6 mb-8">
                  <Input
                    label="Nombre de la categoría"
                    placeholder="Ej: Polos, Accesorios..."
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    onBlur={() => setNameTouched(true)}
                    error={nameError}
                  />
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Descripción</label>
                    <textarea
                      className="w-full h-32 px-6 py-4 bg-white border border-neutral-200 rounded-[24px] text-[14px] font-medium outline-none focus:border-brand-camel transition-colors resize-none"
                      placeholder="Describe el propósito de esta categoría..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <Select label="Estado inicial" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option>Activa</option>
                    <option>Inactiva</option>
                  </Select>
                </div>

                <div className="mb-8">
                  <h4 className="text-[14px] font-bold text-brand-black mb-4 flex items-center gap-2">
                    <Tag size={18} className="text-brand-camel" /> Asignar a tiendas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-2">
                    {stores.map(store => {
                      const isAssigned = formData.assignedStores.includes(store.id);
                      return (
                        <button
                          key={store.id}
                          onClick={() => toggleStore(store.id)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${isAssigned ? 'border-brand-camel bg-brand-camel/5' : 'border-neutral-100 hover:border-neutral-200'}`}
                        >
                          <div>
                            <p className="font-bold text-[14px] text-brand-black">{store.name}</p>
                            <p className="text-[11px] text-neutral-400">{store.id}</p>
                          </div>
                          {isAssigned && <div className="w-5 h-5 bg-brand-camel rounded-full flex items-center justify-center"><X size={12} className="text-white" /></div>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 font-medium">{formData.assignedStores.length} tienda(s) seleccionada(s)</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                  <Button variant="secondary" className="flex-1 rounded-2xl h-14" onClick={handleCloseModal}>Cancelar</Button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`flex-1 rounded-2xl h-14 font-bold text-[14px] transition-all ${
                      isFormValid ? 'bg-brand-black text-white hover:bg-neutral-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    {showModal === 'create' ? 'Crear categoría' : 'Guardar cambios'}
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
