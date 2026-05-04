'use client';

import { useState } from 'react';
import { Button, Card, Input, Select } from '../UI';
import { Save, Shield, FileImage, Settings } from 'lucide-react';

interface ParamsState {
  maxImagesPerStore: number;
  maxProductsPerCategory: number;
  allowedImageExtensions: string;
  defaultTenantStatus: string;
  enableAuditLogs: boolean;
  sessionTimeoutMinutes: number;
  maintenanceMode: boolean;
}

interface ParametrosScreenProps {
  initialParams: ParamsState;
  onSave: (params: ParamsState) => void;
}

export function ParametrosScreen({ initialParams, onSave }: ParametrosScreenProps) {
  const [formData, setFormData] = useState<ParamsState>(initialParams);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (name: keyof ParamsState, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">Parámetros del sistema</h2>
        <p className="text-[14px] font-medium text-neutral-400">Configuración global que afecta a todos los tenants y módulos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Límites */}
        <Card className="p-8">
          <h3 className="text-[18px] font-display font-extrabold mb-6 flex items-center gap-2 text-brand-black">
            <Shield size={20} className="text-brand-camel" /> Límites y Restricciones
          </h3>
          <div className="space-y-6">
            <Input
              label="Máx. imágenes por tienda"
              type="number"
              value={formData.maxImagesPerStore}
              onChange={e => handleChange('maxImagesPerStore', parseInt(e.target.value))}
            />
            <Input
              label="Máx. productos por categoría"
              type="number"
              value={formData.maxProductsPerCategory}
              onChange={e => handleChange('maxProductsPerCategory', parseInt(e.target.value))}
            />
            <Input
              label="Tiempo de sesión (minutos)"
              type="number"
              value={formData.sessionTimeoutMinutes}
              onChange={e => handleChange('sessionTimeoutMinutes', parseInt(e.target.value))}
            />
          </div>
        </Card>

        {/* Archivos */}
        <Card className="p-8">
          <h3 className="text-[18px] font-display font-extrabold mb-6 flex items-center gap-2 text-brand-black">
            <FileImage size={20} className="text-brand-camel" /> Configuración de Archivos
          </h3>
          <div className="space-y-6">
            <Input
              label="Extensiones permitidas (separadas por coma)"
              placeholder="jpg,png,webp"
              value={formData.allowedImageExtensions}
              onChange={e => handleChange('allowedImageExtensions', e.target.value)}
            />
            <div className="p-4 bg-brand-beige-light rounded-xl border border-neutral-100">
              <p className="text-[12px] font-bold text-neutral-500 uppercase">Nota técnica</p>
              <p className="text-[12px] text-neutral-600 mt-1">Cambiar extensiones afecta la validación en todos los tenants. No se eliminarán archivos existentes.</p>
            </div>
          </div>
        </Card>

        {/* Comportamiento Global */}
        <Card className="p-8 lg:col-span-2">
          <h3 className="text-[18px] font-display font-extrabold mb-6 flex items-center gap-2 text-brand-black">
            <Settings size={20} className="text-brand-camel" /> Comportamiento Global
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="block text-[11px] font-bold text-neutral-500 uppercase ml-1">Estado por defecto (Nuevas tiendas)</label>
              <Select value={formData.defaultTenantStatus} onChange={e => handleChange('defaultTenantStatus', e.target.value)}>
                <option>Activa</option>
                <option>En revisión</option>
                <option>Inactiva</option>
              </Select>
            </div>

            <div className="flex items-center justify-between p-6 bg-white border border-neutral-100 rounded-2xl">
              <div>
                <p className="font-bold text-[#0a0a0a]">Logs de Auditoría</p>
                <p className="text-[12px] text-neutral-400">Registro de acciones críticas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.enableAuditLogs} 
                  onChange={e => handleChange('enableAuditLogs', e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-camel"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-6 bg-white border border-neutral-100 rounded-2xl">
              <div>
                <p className="font-bold text-[#0a0a0a]">Modo Mantenimiento</p>
                <p className="text-[12px] text-neutral-400">Bloquea acceso a tenants</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.maintenanceMode} 
                  onChange={e => handleChange('maintenanceMode', e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100">
        <Button variant="secondary" className="rounded-full px-8" onClick={() => setFormData(initialParams)}>
          Descartar cambios
        </Button>
        <Button className="rounded-full px-10" onClick={handleSubmit} disabled={isSaving}>
          <Save size={16} className="mr-2" /> {isSaving ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </div>
    </div>
  );
}