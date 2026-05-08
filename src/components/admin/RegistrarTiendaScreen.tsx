'use client';

import { useState } from 'react';
import { Button, Card, Badge, Input, Select } from '../UI';
import { ArrowLeft, AlertCircle, X, Search, ChevronRight, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_USERS } from '@/mockData';

const COLOR_PALETTES = [
  { id: 'core-street',  name: 'Core Street',  primary: '#0F0F10', secondary: '#6E7F5D', accent: '#B89B72' },
  { id: 'atelier-mono', name: 'Atelier Mono', primary: '#161616', secondary: '#8C8C8C', accent: '#C9C7C1' },
  { id: 'utility-drop', name: 'Utility Drop', primary: '#1B2018', secondary: '#6E7F5D', accent: '#A34A3C' },
  { id: 'luxe-capsule', name: 'Luxe Capsule', primary: '#15120F', secondary: '#B89B72', accent: '#E4D5B7' },
];

interface RegistrarTiendaScreenProps {
  merchants: typeof MOCK_USERS;
  onBack: () => void;
  onSave: (store: any) => void;
  onNavigateToBulk: () => void;
  initialData: any | null;
}

export function RegistrarTiendaScreen({ merchants, onBack, onSave, onNavigateToBulk, initialData }: RegistrarTiendaScreenProps) {
  const [formData, setFormData] = useState({
    name:   initialData?.name   || '',
    status: initialData?.status || 'Activa',
  });
  const [nameTouched, setNameTouched] = useState(false);
  const [selectedStyles,   setSelectedStyles]   = useState<string[]>(initialData?.styles   || []);
  const [selectedPrendas,  setSelectedPrendas]  = useState<string[]>(initialData?.prendas  || []);
  const [selectedClientes, setSelectedClientes] = useState<string[]>(initialData?.clientes || []);
  const [selectedPalette, setSelectedPalette] = useState(
    COLOR_PALETTES.find(p => p.id === initialData?.palette) || COLOR_PALETTES[0]
  );
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [merchantSearch,    setMerchantSearch]    = useState('');
  const [selectedMerchant,  setSelectedMerchant]  = useState<any>(() =>
    initialData?.responsible
      ? merchants.find(m => m.email === initialData.responsible) || null
      : null
  );

  const nameError = nameTouched && !formData.name.trim() ? 'El nombre de la tienda es obligatorio.' : '';

  // El formulario es válido si tiene nombre y comerciante seleccionado
  const isFormValid = formData.name.trim().length > 0 && selectedMerchant !== null;

  const toggleItem = (setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) =>
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const handleSave = () => {
    setNameTouched(true);
    if (!isFormValid) return;
    onSave({
      ...formData,
      responsible: selectedMerchant.email,
      palette: selectedPalette.id,
      styles: selectedStyles,
      prendas: selectedPrendas,
      clientes: selectedClientes,
    });
  };

  const filteredMerchants = merchants.filter(m =>
    m.role === 'Comerciante' && (
      m.name.toLowerCase().includes(merchantSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(merchantSearch.toLowerCase())
    )
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-brand-camel font-bold text-[14px] mb-4 hover:underline">
            <ArrowLeft size={16} /> Volver al listado
          </button>
          <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">
            {initialData ? 'Editar tienda' : 'Registrar tienda'}
          </h2>
          <p className="text-[14px] font-medium text-neutral-400">
            {initialData ? 'Ajusta los parámetros del tenant' : 'Alta individual para nuevos tenants'}
          </p>
        </div>
        <Button variant="secondary" className="rounded-full px-8" onClick={onNavigateToBulk}>
          Registro masivo de tiendas
        </Button>
      </div>

      <Card className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Input
            label="Nombre de la tienda"
            name="name"
            placeholder="Canvas Lab"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            onBlur={() => setNameTouched(true)}
            error={nameError}
          />
          <Select label="Estado inicial" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
            <option>Activa</option>
            <option>Inactiva</option>
            <option>En revisión</option>
          </Select>
        </div>

        {/* Comerciante asociado */}
        <div className="bg-brand-beige-light p-8 rounded-[32px] mb-10 border border-neutral-100">
          <h4 className="text-[11px] font-bold text-neutral-500 mb-6 uppercase ml-1 tracking-widest">
            Comerciante asociado (Obligatorio)
          </h4>
          <div className="flex items-center justify-between">
            {selectedMerchant ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-camel text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {selectedMerchant.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[16px] font-extrabold text-neutral-900">{selectedMerchant.name}</p>
                  <p className="text-[12px] font-medium text-neutral-400">{selectedMerchant.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-[14px] font-medium text-neutral-400 italic">Ningún comerciante seleccionado</p>
            )}
            <Button variant="secondary" className="rounded-full px-6" onClick={() => setShowMerchantModal(true)}>
              {selectedMerchant ? 'Cambiar comerciante' : 'Asociar comerciante'}
            </Button>
          </div>
          {!selectedMerchant && (
            <p className="text-[12px] text-red-500 font-bold mt-4 flex items-center gap-1">
              <AlertCircle size={12} /> Se requiere una vinculación para registrar la tienda.
            </p>
          )}
        </div>

        {/* Observaciones */}
        <div className="space-y-4 mb-10">
          <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Observaciones</label>
          <textarea
            className="w-full h-48 px-6 py-4 bg-white border border-neutral-200 rounded-[32px] text-[14px] font-medium outline-none focus:border-brand-camel transition-colors resize-none"
            placeholder="Tenant enfocado en streetwear premium."
          />
        </div>

        {/* Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {[
            { label: 'Estilos',          items: ['Casual','Formal','Deportivo','Street','Indie'],  state: selectedStyles,   setter: setSelectedStyles },
            { label: 'Tipos de prenda',  items: ['Polo','Jean','Camisa','Vestido','Casaca'],        state: selectedPrendas,  setter: setSelectedPrendas },
            { label: 'Tipos de cliente', items: ['Dama','Caballero','Niño','Unisex'],               state: selectedClientes, setter: setSelectedClientes },
          ].map(({ label, items, state, setter }) => (
            <div key={label} className="space-y-4">
              <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">{label}</label>
              <div className="flex flex-wrap gap-2">
                {items.map(s => (
                  <Badge
                    key={s}
                    variant={state.includes(s) ? 'seleccionado' : 'pendiente'}
                    onClick={() => toggleItem(setter, s)}
                    className="cursor-pointer"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Paletas */}
        <div className="mb-10">
          <h4 className="text-[11px] font-bold text-neutral-500 mb-6 uppercase ml-1 tracking-widest">
            Configuración de marca: Paleta de colores
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLOR_PALETTES.map(palette => (
              <button
                key={palette.id}
                onClick={() => setSelectedPalette(palette)}
                className={`p-6 rounded-[32px] border-2 transition-all text-left ${
                  selectedPalette.id === palette.id
                    ? 'border-brand-camel bg-brand-camel/5'
                    : 'border-neutral-100 hover:border-neutral-200 bg-white'
                }`}
              >
                <h5 className="font-display font-extrabold text-[18px] mb-4">{palette.name}</h5>
                <div className="flex gap-2 mb-6">
                  {[palette.primary, palette.secondary, palette.accent].map(c => (
                    <div key={c} className="w-10 h-10 rounded-full border border-neutral-100" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-full rounded-xl flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter" style={{ backgroundColor: palette.primary }}>
                    Acción principal
                  </div>
                  <div className="h-8 w-full rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter" style={{ backgroundColor: palette.accent, color: palette.primary }}>
                    Acento campaña
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 border-t border-neutral-100 pt-10">
          <Button variant="secondary" className="rounded-full px-10 border-neutral-200" onClick={onBack}>
            Cancelar
          </Button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className={`px-10 rounded-full font-bold text-[14px] h-11 flex items-center gap-2 transition-all ${
              isFormValid
                ? 'bg-brand-black text-white hover:bg-neutral-800'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Save size={16} /> Guardar
          </button>
        </div>
      </Card>

      {/* Modal comerciante */}
      <AnimatePresence>
        {showMerchantModal && (
          <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-[28px] font-display font-extrabold tracking-tight text-brand-black">Asociar comerciante</h3>
                    <p className="text-[14px] font-medium text-neutral-400">Selecciona el responsable de esta tienda</p>
                  </div>
                  <button onClick={() => setShowMerchantModal(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <div className="mb-6">
                  <Input
                    label="Buscar comerciante"
                    placeholder="Nombre o correo..."
                    icon={Search}
                    value={merchantSearch}
                    onChange={e => setMerchantSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2">
                  {filteredMerchants.map(m => (
                    <button
                      key={m.email}
                      onClick={() => { setSelectedMerchant(m); setShowMerchantModal(false); }}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-brand-camel hover:bg-brand-camel/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-brand-black">{m.name}</p>
                          <p className="text-[12px] text-neutral-400 font-medium">{m.email}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-neutral-300" />
                    </button>
                  ))}
                  {filteredMerchants.length === 0 && (
                    <div className="py-20 text-center text-neutral-400 font-medium italic">
                      No se encontraron comerciantes registrados.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
