'use client';

import { Badge, Button, Card, Input, Select } from '@/components/UI';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Check, ChevronRight, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Opciones de colores
const PRIMARY_COLORS_OPTIONS = [
  { name: 'ONYX BLACK', code: '#0F1011' },
  { name: 'MIDNIGHT', code: '#1A2332' },
  { name: 'CHARCOAL', code: '#36454F' },
  { name: 'ESPRESSO', code: '#4B3621' },
  { name: 'ALABASTER', code: '#F9FAFB' },
  { name: 'WARM CREAM', code: '#FDFBF7' }
];

const SECONDARY_COLORS_OPTIONS = [
  { name: 'SLATE', code: '#475569' },
  { name: 'SAGE', code: '#8A9A86' },
  { name: 'TERRA', code: '#E2725B' },
  { name: 'DUSTY RED', code: '#B25C5C' },
  { name: 'GHOST WHITE', code: '#FFFFFF' },
  { name: 'SOFT TAUPE', code: '#D5CEC4' },
  { name: 'BLUSH PINK', code: '#F4C2C2' },
  { name: 'FROSTED BLUE', code: '#B0E0E6' }
];

const TERTIARY_COLORS_OPTIONS = [
  { name: 'RAW GOLD', code: '#D4AF37' },
  { name: 'COPPER', code: '#B87333' },
  { name: 'COBALT BLUE', code: '#2563EB' },
  { name: 'CORAL PUNCH', code: '#FF5A5F' },
  { name: 'EMERALD', code: '#10B981' },
  { name: 'SUNFLOWER', code: '#FFC107' },
  { name: 'HOT MAGENTA', code: '#FF00FF' },
  { name: 'VIOLET POP', code: '#8B5CF6' }
];

const COLOR_PALETTES = [
  { id: 'core-street', name: 'Core Street', primary: '#0F1011', secondary: '#475569', accent: '#D4AF37' },
  { id: 'atelier-mono', name: 'Atelier Mono', primary: '#F9FAFB', secondary: '#FFFFFF', accent: '#2563EB' },
  { id: 'utility-drop', name: 'Utility Drop', primary: '#36454F', secondary: '#8A9A86', accent: '#10B981' },
  { id: 'luxe-capsule', name: 'Luxe Capsule', primary: '#4B3621', secondary: '#D5CEC4', accent: '#B87333' },
];

export default function EditarTiendaPage() {
  const router = useRouter();
  const params = useParams();
  const { stores, users, updateStore } = useApp();
  
  const storeToEdit = stores.find(s => s.id === params.id);
  
  if (!storeToEdit) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-xl font-bold text-neutral-400">Tienda no encontrada</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  // CORRECCIÓN 1: Buscar la paleta existente para pre-seleccionarla
  const existingPalette = COLOR_PALETTES.find(p => p.id === storeToEdit.palette);

  const [formData, setFormData] = useState({
    name: storeToEdit.name,
    status: storeToEdit.status,
    responsible: storeToEdit.responsible,
    observations: '' 
  });

  // CORRECCIÓN 2: Inicializar paleta con el valor guardado
  const [selectedPalette, setSelectedPalette] = useState(
    existingPalette || COLOR_PALETTES[0]
  );
  
  // CORRECCIÓN 3: Inicializar categoría con el valor guardado (prendas es array en mock data)
  const [selectedCategory, setSelectedCategory] = useState<string>(
    storeToEdit.prendas && storeToEdit.prendas.length > 0 ? storeToEdit.prendas[0] : ''
  );
  
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [merchantSearch, setMerchantSearch] = useState('');
  
  // CORRECCIÓN 4: Buscar el comerciante actual para mostrarlo ya seleccionado
  const [selectedMerchant, setSelectedMerchant] = useState<any>(
    users.find(u => u.email === storeToEdit.responsible) || null
  );

  const handleSave = () => {
    if (formData.name && selectedMerchant) {
      updateStore(storeToEdit.id, {
        ...formData,
        responsible: selectedMerchant.email,
        palette: selectedPalette.id,
        prendas: selectedCategory ? [selectedCategory] : [] // Guardamos como array
      });
      router.push('/admin/tiendas');
    }
  };

  const filteredMerchants = users.filter(m =>
    m.role === 'Comerciante' && (
      m.name.toLowerCase().includes(merchantSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(merchantSearch.toLowerCase())
    )
  );

  return (
    <div className="space-y-12 animate-in slide-in-from-right duration-500 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-brand-camel font-bold text-[14px] mb-4 hover:underline"
          >
            <ArrowLeft size={16} /> Volver al listado
          </button>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Editar Tienda</h2>
          <p className="text-[14px] font-medium text-neutral-400">Modifica los parámetros de <span className="font-bold">{storeToEdit.name}</span></p>
        </div>
      </div>

      <Card className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Input 
            label="Nombre de la tienda" 
            name="name"
            placeholder="Canvas Lab" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <Select label="Estado" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option>Activa</option>
            <option>Suspendida</option>
            <option>Inactiva</option>
          </Select>
        </div>

        {/* Comerciante asociado */}
        <div className="bg-brand-beige-light p-8 rounded-[32px] mb-10 border border-neutral-100">
          <h4 className="text-[11px] font-bold text-neutral-500 mb-6 uppercase ml-1 tracking-widest">Comerciante asociado</h4>
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
        </div>

        {/* Observaciones */}
        <div className="space-y-4 mb-10">
          <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Observaciones</label>
          <textarea 
            className="w-full h-48 px-6 py-4 bg-white border border-neutral-200 rounded-[32px] text-[14px] font-medium outline-none focus:border-brand-camel transition-colors resize-none"
            placeholder="Observaciones sobre la tienda o el proceso de alta..."
            value={formData.observations}
            onChange={e => setFormData({...formData, observations: e.target.value})}
          />
        </div>

        {/* Categoría única */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Categoría única</label>
            <div className="flex flex-wrap gap-2">
              {['Polo', 'Jean', 'Camisa', 'Vestido', 'Casaca'].map(s => (
                <Badge 
                  key={s} 
                  // Ahora resalta si coincide con selectedCategory
                  variant={selectedCategory === s ? 'selected' : 'pending'} 
                  onClick={() => setSelectedCategory(s === selectedCategory ? '' : s)}
                  className="cursor-pointer"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Colores */}
        <div className="mb-10">
          <h4 className="text-[11px] font-bold text-neutral-500 mb-6 uppercase ml-1 tracking-widest font-mono">Configuración de marca</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10">
            {/* Color Principal */}
            <div className="space-y-4">
              <h5 className="text-[13px] font-extrabold text-neutral-900 uppercase tracking-wide">Color Principal</h5>
              <div className="space-y-3">
                {PRIMARY_COLORS_OPTIONS.map(color => (
                  <button 
                    key={color.code}
                    onClick={() => setSelectedPalette({...selectedPalette, primary: color.code})}
                    className={`w-full flex items-center justify-between p-3 rounded-[20px] border-2 transition-all ${selectedPalette.primary === color.code ? 'border-brand-black bg-white shadow-md' : 'border-neutral-100 hover:border-neutral-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full shadow-inner border border-neutral-100" style={{ backgroundColor: color.code }} />
                      <span className="text-[12px] font-extrabold text-neutral-900 tracking-wider uppercase">{color.name}</span>
                    </div>
                    {selectedPalette.primary === color.code && <Check size={16} className="text-brand-black" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Secundario */}
            <div className="space-y-4">
              <h5 className="text-[13px] font-extrabold text-neutral-900 uppercase tracking-wide">Color Secundario</h5>
              <div className="space-y-3">
                {SECONDARY_COLORS_OPTIONS.map(color => (
                  <button 
                    key={color.code}
                    onClick={() => setSelectedPalette({...selectedPalette, secondary: color.code})}
                    className={`w-full flex items-center justify-between p-3 rounded-[20px] border-2 transition-all ${selectedPalette.secondary === color.code ? 'border-brand-black bg-white shadow-md' : 'border-neutral-100 hover:border-neutral-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full shadow-inner border border-neutral-100" style={{ backgroundColor: color.code }} />
                      <span className="text-[12px] font-extrabold text-neutral-900 tracking-wider uppercase">{color.name}</span>
                    </div>
                    {selectedPalette.secondary === color.code && <Check size={16} className="text-brand-black" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Terciario */}
            <div className="space-y-4">
              <h5 className="text-[13px] font-extrabold text-neutral-900 uppercase tracking-wide">Color Terciario</h5>
              <div className="space-y-3">
                {TERTIARY_COLORS_OPTIONS.map(color => (
                  <button 
                    key={color.code}
                    onClick={() => setSelectedPalette({...selectedPalette, accent: color.code})}
                    className={`w-full flex items-center justify-between p-3 rounded-[20px] border-2 transition-all ${selectedPalette.accent === color.code ? 'border-brand-black bg-white shadow-md' : 'border-neutral-100 hover:border-neutral-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full shadow-inner border border-neutral-100" style={{ backgroundColor: color.code }} />
                      <span className="text-[12px] font-extrabold text-neutral-900 tracking-wider uppercase">{color.name}</span>
                    </div>
                    {selectedPalette.accent === color.code && <Check size={16} className="text-brand-black" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 border-t border-neutral-100 pt-10">
          <Button variant="secondary" className="rounded-full px-10 border-neutral-200" onClick={() => router.back()}>Cancelar</Button>
          <Button 
            className="rounded-full px-10" 
            onClick={handleSave}
            disabled={!formData.name || !selectedMerchant}
          >
            Guardar cambios
          </Button>
        </div>
      </Card>

      {/* Modal de comerciante */}
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
                  <h3 className="text-[28px] font-display font-extrabold tracking-tight">Asociar comerciante</h3>
                  <button onClick={() => setShowMerchantModal(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <Input 
                    label="Buscar comerciante" 
                    placeholder="Nombre, apellido o correo..." 
                    icon={Search}
                    value={merchantSearch}
                    onChange={e => setMerchantSearch(e.target.value)}
                  />
                </div>

                <div className="max-h-[350px] overflow-y-auto space-y-2 pr-2">
                  {filteredMerchants.map((m: any) => (
                    <button 
                      key={m.email}
                      onClick={() => {
                        setSelectedMerchant(m);
                        setShowMerchantModal(false);
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-brand-camel hover:bg-brand-camel/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-neutral-500">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#0a0a0a]">{m.name}</p>
                          <p className="text-[12px] text-neutral-400 font-medium">{m.email}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-neutral-300" />
                    </button>
                  ))}
                  {filteredMerchants.length === 0 && (
                    <div className="py-20 text-center text-neutral-400 font-medium italic">
                      No se encontraron comerciantes.
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
