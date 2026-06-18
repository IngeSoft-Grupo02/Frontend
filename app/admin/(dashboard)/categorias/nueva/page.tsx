'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/domains/admin/context/AppContext';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Input, Select, Card } from '@/domains/admin/components/UI';

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const { addCategory } = useApp();
  
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catStatus, setCatStatus] = useState('Activa');

  const handleSave = () => {
    if (!catName) return;
    addCategory({ name: catName, description: catDesc, status: catStatus });
    router.push('/admin/categorias');
  };

  return (
    <div className="space-y-12 animate-in fadeIn duration-500 max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-brand-camel font-bold text-[14px] hover:underline">
          <ArrowLeft size={16} /> Volver a categorías
        </button>
        <h2 className="text-[28px] font-display font-extrabold tracking-tight">
          Nueva categoría
        </h2>
        <p className="text-[14px] font-medium text-neutral-400">Define los parámetros de la categoría global</p>
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
              Crear categoría
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}