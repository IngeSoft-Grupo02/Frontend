'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Save, AlertCircle, Check, X, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Input, Select, Card, Badge } from '@/components/UI';

// Paletas de color del prototipo
const PRIMARY_COLORS = [
  { name: 'ONYX BLACK', code: '#000000' },
  { name: 'DEEP ZINC', code: '#1A1A1B' },
  { name: 'MIDNIGHT', code: '#0D1120' },
  { name: 'CHARCOAL', code: '#333D4F' },
  { name: 'ESPRESSO', code: '#1F1C1B' }
];

const SECONDARY_COLORS = [
  { name: 'OLIVE DRAB', code: '#5D634B' },
  { name: 'SAGE', code: '#8B9E82' },
  { name: 'SLATE', code: '#4A5568' },
  { name: 'TERRA', code: '#A97C44' },
  { name: 'DUSTY RED', code: '#A52222' }
];

const TERTIARY_COLORS = [
  { name: 'RICH CAMEL', code: '#B2956D' },
  { name: 'RAW GOLD', code: '#C59D53' },
  { name: 'SILVER MIST', code: '#9BA9BC' },
  { name: 'COPPER', code: '#BC5610' },
  { name: 'STONE', code: '#CED1D6' }
];

const COLOR_PALETTES = [
  { id: 'core-street', name: 'Core Street', primary: '#0F0F10', secondary: '#6E7F5D', accent: '#B89B72' },
  { id: 'atelier-mono', name: 'Atelier Mono', primary: '#161616', secondary: '#8C8C8C', accent: '#C9C7C1' },
  { id: 'utility-drop', name: 'Utility Drop', primary: '#1B2018', secondary: '#6E7F5D', accent: '#A34A3C' },
  { id: 'luxe-capsule', name: 'Luxe Capsule', primary: '#15120F', secondary: '#B89B72', accent: '#E4D5B7' },
];

export default function NuevaTiendaPage() {
  const router = useRouter();
  const { addStore, users } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    status: 'Activa',
    responsible: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // selectedStyles y selectedClientes permiten múltiples
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  
  // selectedPrendas ahora actúa como única selección ("Categoría única")
  const [selectedPrendas, setSelectedPrendas] = useState<string[]>([]);
  
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [merchantSearch, setMerchantSearch] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);

  const validate = (name: string, value: string) => {
    if (name === 'name' && !value) return 'El nombre de la tienda es obligatorio.';
    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  // Función genérica para toggle múltiple
  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSave = () => {
    if (formData.name && selectedMerchant) {
      addStore({
        ...formData,
        id: `tenant-${Math.floor(Math.random() * 1000)}`,
        responsible: selectedMerchant.email,
        palette: selectedPalette.id,
        styles: selectedStyles,
        // Al ser única, tomamos el primer elemento (o string vacío si es undefined)
        prendas: selectedPrendas.length > 0 ? selectedPrendas[0] : '', 
        clientes: selectedClientes,
        registrationDate: new Date().toLocaleDateString('es-PE')
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
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Parámetros de la Tienda</h2>
          <p className="text-[14px] font-medium text-neutral-400">Define los valores de marca y configuración</p>
        </div>
        <Button variant="secondary" className="rounded-full px-8" onClick={() => router.push('/admin/carga-masiva')}>
          Registro masivo de tiendas
        </Button>
      </div>

      <Card className="p-10">
        {/* Datos básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Input 
            label="Nombre de la tienda" 
            name="name"
            placeholder="Canvas Lab" 
            value={formData.name} 
            onChange={e => {
              setFormData({...formData, name: e.target.value});
              setErrors(prev => ({ ...prev, name: validate('name', e.target.value) }));
            }} 
            onBlur={handleBlur}
            error={errors.name}
          />
          <Select label="Estado inicial" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option>Activa</option>
            <option>Inactiva</option>
            <option>En revisión</option>
          </Select>
        </div>

        {/* Comerciante asociado */}
        <div className="bg-brand-beige-light p-8 rounded-[32px] mb-10 border border-neutral-100">
          <h4 className="text-[11px] font-bold text-neutral-500 mb-6 uppercase ml-1 tracking-widest">Comerciante asociado (Obligatorio)</h4>
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
            placeholder="Observaciones sobre la tienda o el proceso de alta..."
          />
        </div>

        {/* Categorías / Prendas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Categoría única</label>
            <div className="flex flex-wrap gap-2">
              {['Polo', 'Jean', 'Camisa', 'Vestido', 'Casaca'].map(s => (
                <Badge 
                  key={s} 
                  // Lógica corregida: Solo muestra 'selected' si es exactamente el que está en la lista
                  variant={selectedPrendas.includes(s) ? 'selected' : 'pending'} 
                  // Lógica corregida: Reemplaza la lista con un array de un solo elemento [s]
                  onClick={() => setSelectedPrendas([s])}
                  className="cursor-pointer"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Configuración de marca - Colores */}
        <div className="mb-10">
          <h4 className="text-[11px] font-bold text-neutral-500 mb-2 uppercase ml-1 tracking-widest font-mono">Configuración de marca</h4>
          <p className="text-[14px] font-medium text-neutral-400 mb-8 ml-1">Personaliza cada nivel de tu identidad visual seleccionando entre nuestras opciones curadas.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10">
            {/* Color Principal */}
            <div className="space-y-4">
              <h5 className="text-[13px] font-extrabold text-neutral-900 uppercase tracking-wide">Color Principal</h5>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight mb-4">Primordialmente para botones y títulos</p>
              <div className="space-y-3">
                {PRIMARY_COLORS.map(color => (
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
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight mb-4">Para acentos y elementos de soporte</p>
              <div className="space-y-3">
                {SECONDARY_COLORS.map(color => (
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
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight mb-4">Detalles finos y estados de realce</p>
              <div className="space-y-3">
                {TERTIARY_COLORS.map(color => (
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

          {/* Preview de paleta */}
          <div className="mt-16 pt-16 border-t border-neutral-100 flex flex-col items-center">
            <h5 className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-[0.2em] mb-10">Resultado de tu combinación</h5>
            <div className="bg-neutral-50/50 p-10 rounded-[40px] border border-neutral-100 shadow-sm flex items-center gap-12">
              <div className="flex items-center">
                <div className="w-20 h-24 rounded-[24px] shadow-xl border-4 border-white" style={{ backgroundColor: selectedPalette.primary }} />
                <div className="w-16 h-20 rounded-[20px] shadow-lg border-4 border-white -ml-4 z-10" style={{ backgroundColor: selectedPalette.secondary }} />
                <div className="w-16 h-20 rounded-[20px] shadow-lg border-4 border-white -ml-8 z-20" style={{ backgroundColor: selectedPalette.accent }} />
              </div>
              <div>
                <h6 className="text-[18px] font-display font-extrabold tracking-tight mb-2 uppercase">Paleta Custom-S47</h6>
                <div className="flex gap-3 text-[10px] font-mono font-bold text-neutral-400 uppercase">
                  <span>{selectedPalette.primary}</span>
                  <span>{selectedPalette.secondary}</span>
                  <span>{selectedPalette.accent}</span>
                </div>
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
            Guardar
          </Button>
        </div>
      </Card>

      {/* Modal de selección de comerciante */}
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
                    <h3 className="text-[28px] font-display font-extrabold tracking-tight">Asociar comerciante</h3>
                    <p className="text-[14px] font-medium text-neutral-400">Selecciona el responsable de esta tienda</p>
                  </div>
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