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
  const [formData, setFormData]   = useState<ParamsState>(initialParams);
  const [touched, setTouched]     = useState(false);
  const [isSaving, setIsSaving]   = useState(false);
  const [savedOk,  setSavedOk]    = useState(false);

  const handleChange = (name: keyof ParamsState, value: any) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  // Validaciones
  const errors = {
    maxImagesPerStore:      formData.maxImagesPerStore <= 0      ? 'Debe ser mayor a 0.' : '',
    maxProductsPerCategory: formData.maxProductsPerCategory <= 0 ? 'Debe ser mayor a 0.' : '',
    sessionTimeoutMinutes:  formData.sessionTimeoutMinutes <= 0  ? 'Debe ser mayor a 0.' : '',
    allowedImageExtensions: !formData.allowedImageExtensions.trim() ? 'Ingresa al menos una extensión.' : '',
  };

  const isFormValid = Object.values(errors).every(e => e === '');
  const hasChanges  = JSON.stringify(formData) !== JSON.stringify(initialParams);

  const handleSubmit = () => {
    setTouched(true);
    if (!isFormValid) return;
    setIsSaving(true);
    setSavedOk(false);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">Parámetros del sistema</h2>
        <p className="text-[14px] font-medium text-neutral-400">Configuración global que afecta a todos los tenants y módulos</p>
      </div>

      {savedOk && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-green-600 font-bold text-[13px]">✓ Configuración guardada correctamente.</span>
        </div>
      )}

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
              onChange={e => handleChange('maxImagesPerStore', parseInt(e.target.value) || 0)}
              error={touched ? errors.maxImagesPerStore : ''}
            />
            <Input
              label="Máx. productos por categoría"
              type="number"
              value={formData.maxProductsPerCategory}
              onChange={e => handleChange('maxProductsPerCategory', parseInt(e.target.value) || 0)}
              error={touched ? errors.maxProductsPerCategory : ''}
            />
            <Input
              label="Tiempo de sesión (minutos)"
              type="number"
              value={formData.sessionTimeoutMinutes}
              onChange={e => handleChange('sessionTimeoutMinutes', parseInt(e.target.value) || 0)}
              error={touched ? errors.sessionTimeoutMinutes : ''}
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
              error={touched ? errors.allowedImageExtensions : ''}
            />
            <div className="p-4 bg-brand-beige-light rounded-xl border border-neutral-100">
              <p className="text-[12px] font-bold text-neutral-500 uppercase">Nota técnica</p>
              <p className="text-[12px] text-neutral-600 mt-1">Cambiar extensiones afecta la validación en todos los tenants. No se eliminarán archivos existentes.</p>
            </div>
          </div>
        </Card>

        {/* Comportamiento global */}
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

            {[
              { key: 'enableAuditLogs', label: 'Registros de Auditoría',  desc: 'Registro de acciones críticas', danger: false },
              { key: 'maintenanceMode', label: 'Modo Mantenimiento',       desc: 'Bloquea acceso a tenants',     danger: true  },
            ].map(({ key, label, desc, danger }) => (
              <div key={key} className="flex items-center justify-between p-6 bg-white border border-neutral-100 rounded-2xl">
                <div>
                  <p className="font-bold text-brand-black">{label}</p>
                  <p className="text-[12px] text-neutral-400">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[key as keyof ParamsState] as boolean}
                    onChange={e => handleChange(key as keyof ParamsState, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-14 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${danger ? 'peer-checked:bg-red-500' : 'peer-checked:bg-brand-camel'}`} />
                </label>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100">
        <Button variant="secondary" className="rounded-full px-8" onClick={() => { setFormData(initialParams); setTouched(false); setSavedOk(false); }}>
          Descartar cambios
        </Button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || !hasChanges || isSaving}
          className={`px-10 rounded-full font-bold text-[14px] h-11 flex items-center gap-2 transition-all ${
            isFormValid && hasChanges && !isSaving
              ? 'bg-brand-black text-white hover:bg-neutral-800'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <Save size={16} /> {isSaving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  );
}
