'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card, Input } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { Store as StoreType } from '@/lib/types';
import {
    AlertCircle,
    ArrowLeft,
    Check
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function StoreFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { stores, addStore, setStore } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Urbano',
    description: '',
    palette: '#000000',
    customizationIncrement: 10 as 5 | 10 | 15
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editId) {
      const store = stores.find(s => s.id === editId);
      if (store) {
        setFormData({
          name: store.name,
          type: store.type,
          description: store.description || '',
          palette: store.palette || '#000000',
          customizationIncrement: store.customizationIncrement || 10
        });
      }
    }
  }, [editId, stores]);

  const handleSave = () => {
    if (!formData.name) {
      setErrors({ name: 'El nombre de la tienda es obligatorio' });
      return;
    }

    if (editId) {
      const updatedStores = stores.map(s => 
        s.id === editId ? { ...s, ...formData } : s
      );
      // Actualizar la tienda actual si es la que estamos editando
      const updatedStore = updatedStores.find(s => s.id === editId);
      if (updatedStore) {
        setStore(updatedStore);
      }
    } else {
      const newStore: StoreType = {
        id: `ST-${Date.now()}`,
        ...formData,
        status: 'Activa'
      };
      addStore(newStore);
      setStore(newStore);
    }

    router.push('/store-selection');
  };

  const getInitials = (name: string) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <MerchantLayout title={editId ? "Editar Tienda" : "Crear Tienda"} subtitle="Configuración de nueva unidad de negocio" noSidebar={true}>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/store-selection')} 
              className="flex items-center gap-2 text-[11px] font-extrabold text-brand-text-muted hover:text-brand-black transition-all group uppercase tracking-[0.2em] leading-none"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              Volver a tiendas
            </button>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">
              {editId ? 'Editar' : 'Crear'} Tienda
            </h1>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="h-12 px-8 font-extrabold" 
              onClick={() => router.push('/store-selection')}
            >
              Cancelar
            </Button>
            <Button 
              className="gap-2 h-12 px-10 font-extrabold shadow-xl shadow-brand-black/20" 
              onClick={handleSave}
            >
              <Check size={20} /> {editId ? 'Actualizar' : 'Crear'} tienda
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <Card title="Información Básica" subtitle="01 · IDENTIDAD DE LA TIENDA">
              <div className="space-y-6">
                <Input
                  label="Nombre de la tienda *"
                  placeholder="Ej: Studio 47"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  error={errors.name}
                  className="h-14 rounded-2xl font-bold"
                />

                <div>
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2 block">Tipo de tienda</label>
                  <select
                    value={formData.type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-14 bg-white border border-brand-neutral-border rounded-2xl px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center', backgroundSize: '1.2rem' }}
                  >
                    <option>Urbano</option>
                    <option>Casual</option>
                    <option>Premium</option>
                    <option>Deportivo</option>
                    <option>Streetwear</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-2 block">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe el enfoque y estilo de tu tienda..."
                    className="w-full bg-white border border-brand-neutral-border rounded-2xl px-5 py-4 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all resize-none"
                  />
                </div>
              </div>
            </Card>

            <Card title="Paleta de Colores" subtitle="02 · IDENTIDAD VISUAL">
              <div className="space-y-6">
                <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em]">Color principal de la marca</label>
                <div className="flex items-center gap-6">
                  <input
                    type="color"
                    value={formData.palette}
                    onChange={(e) => setFormData({ ...formData, palette: e.target.value })}
                    className="w-24 h-24 rounded-2xl border-2 border-brand-neutral-border cursor-pointer"
                  />
                  <div className="flex-1">
                    <Input
                      value={formData.palette}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, palette: e.target.value })}
                      className="h-12 rounded-xl font-mono font-bold"
                    />
                    <p className="text-[10px] font-bold text-brand-text-muted uppercase mt-2">
                      Este color se usará en el logo, botones y elementos destacados
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 pt-4">
                  {['#000000', '#5D634B', '#B2956D', '#8B4513', '#2F4F4F', '#4A4A4A'].map(color => (
                    <div
                      key={color}
                      onClick={() => setFormData({ ...formData, palette: color })}
                      className={`aspect-square rounded-xl cursor-pointer transition-all border-2 ${
                        formData.palette === color ? 'border-brand-black scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Incremento por Personalización" subtitle="03 · CONFIGURACIÓN COMERCIAL">
              <div className="space-y-6">
                <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em]">Porcentaje de incremento</label>
                <div className="grid grid-cols-3 gap-4">
                  {[5, 10, 15].map((val) => (
                    <div
                      key={val}
                      onClick={() => setFormData({ ...formData, customizationIncrement: val as 5 | 10 | 15 })}
                      className={`p-8 border-2 rounded-4xl cursor-pointer text-center transition-all ${
                        formData.customizationIncrement === val ? 'border-brand-black bg-brand-neutral-mid shadow-inner' : 'border-brand-neutral-border hover:border-brand-black'
                      }`}
                    >
                      <h4 className="text-[32px] font-black">{val}%</h4>
                      <p className="text-[10px] font-black text-brand-text-muted uppercase mt-1">Incremento</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-[12px] font-bold text-blue-800 leading-relaxed">
                    Este porcentaje se aplicará automáticamente a todos los pedidos que incluyan personalización o archivos adjuntos en esta tienda.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8 sticky top-28">
            <Card title="Vista Previa de la Tienda">
              <div className="bg-brand-neutral-light rounded-[32px] border border-brand-neutral-border overflow-hidden shadow-2xl">
                <div 
                  className="h-40 flex items-center justify-center relative"
                  style={{ backgroundColor: formData.palette }}
                >
                  <div className="absolute top-4 left-4">
                    <Badge variant="black" className="!px-4 !py-1.5 font-black text-[11px]">
                      {formData.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                    <span 
                      className="text-[28px] font-black"
                      style={{ color: formData.palette }}
                    >
                      {getInitials(formData.name)}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-[22px] font-black text-brand-black leading-none mb-1">
                      {formData.name || 'Nombre de la tienda'}
                    </h3>
                    <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">
                      {formData.type}
                    </p>
                  </div>

                  <p className="text-[13px] font-medium text-brand-text-muted leading-relaxed">
                    {formData.description || 'Sin descripción disponible para esta tienda.'}
                  </p>

                  <div className="pt-4 border-t border-brand-neutral-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-brand-text-muted uppercase tracking-widest">Incremento</span>
                      <Badge variant="success" className="font-black">
                        +{formData.customizationIncrement}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-brand-text-muted uppercase tracking-widest">Estado</span>
                      <Badge variant="success" className="font-black">
                        Activa
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Resumen de Configuración">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Nombre</span>
                  <span className="text-[13px] font-black text-brand-black">{formData.name || 'Sin nombre'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Tipo</span>
                  <span className="text-[13px] font-black text-brand-black">{formData.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Color</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-lg border border-brand-neutral-border"
                      style={{ backgroundColor: formData.palette }}
                    />
                    <span className="text-[13px] font-black text-brand-black font-mono">{formData.palette}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-brand-text-muted uppercase">Incremento</span>
                  <span className="text-[13px] font-black text-brand-black">{formData.customizationIncrement}%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}