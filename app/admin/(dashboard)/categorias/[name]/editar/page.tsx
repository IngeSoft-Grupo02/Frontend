'use client';

import { Button, Card, Input, Select } from '@/domains/admin/components/UI';
import { useApp } from '@/domains/admin/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditarCategoriaPage() {
  const router = useRouter();
  const params = useParams();
  const { categories, updateCategory } = useApp();
  
  // El nombre de la categoría viene en la URL
  const categoryName = decodeURIComponent(params.name as string);
  const categoryToEdit = categories.find(c => c.name === categoryName);
  
  if (!categoryToEdit) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-xl font-bold text-neutral-400">Categoría no encontrada</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  const [catName, setCatName] = useState(categoryToEdit.name);
  const [catDesc, setCatDesc] = useState(categoryToEdit.description);
  const [catStatus, setCatStatus] = useState(categoryToEdit.status);

  const handleSave = () => {
    if (!catName) return;
    updateCategory(categoryToEdit.name, { 
      name: catName, 
      description: catDesc, 
      status: catStatus 
    });
    router.push('/admin/categorias');
  };

  return (
    <div className="space-y-12 animate-in fadeIn duration-500 max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-brand-camel font-bold text-[14px] hover:underline">
          <ArrowLeft size={16} /> Volver a categorías
        </button>
        <h2 className="text-[28px] font-display font-extrabold tracking-tight">
          Editar categoría
        </h2>
        <p className="text-[14px] font-medium text-neutral-400">Modifica los parámetros de la categoría</p>
      </div>

      <Card className="p-10 border-2 border-brand-camel shadow-xl">
        <div className="space-y-8">
          <Input 
            label="Nombre de categoría" 
            placeholder="Ej. Accesorios" 
            value={catName} 
            onChange={e => setCatName(e.target.value)} 
          />
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Descripción</label>
            <textarea 
              className="w-full h-40 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors resize-none shadow-inner"
              placeholder="Breve detalle del alcance..."
              value={catDesc}
              onChange={e => setCatDesc(e.target.value)}
            />
          </div>
          <Select label="Estado" value={catStatus} onChange={e => setCatStatus(e.target.value)}>
            <option>Activa</option>
            <option>Inactiva</option>
          </Select>

          <div className="pt-8 flex gap-4">
            <Button variant="secondary" className="flex-1 h-14 rounded-2xl" onClick={() => router.back()}>Cancelar</Button>
            <Button className="flex-1 h-14 rounded-2xl shadow-lg" onClick={handleSave}>
              Guardar cambios
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}