'use client';

import { Badge, Button, Card, Input, Select } from '@/components/UI';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, CheckCircle2, Store, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const { users, stores, updateUser } = useApp();
  
  // Decodificar el email de la URL
  const email = decodeURIComponent(params.email as string);
  const userToEdit = users.find(u => u.email === email);
  
  if (!userToEdit) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-xl font-bold text-neutral-400">Usuario no encontrado</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  // Separar nombre completo en partes para los inputs
  const nameParts = userToEdit.name.split(' ');
  
  const [formData, setFormData] = useState({
    name: nameParts[0] || '',
    lastNamePaterno: nameParts[1] || '',
    lastNameMaterno: '', // Asumimos que mock no tiene apellido materno
    email: userToEdit.email,
    role: userToEdit.role,
    store: userToEdit.store,
    phone: userToEdit.phone || '',
    docType: userToEdit.docType || 'DNI',
    docNumber: userToEdit.docNumber || '',
    ruc: userToEdit.ruc || '', // CORRECCIÓN: Inicializar con el RUC existente si lo hay
  });

  const [selectedMerchantStores, setSelectedMerchantStores] = useState<string[]>(
    userToEdit.role === 'Comerciante' && userToEdit.store && userToEdit.store !== 'Todas' 
      ? userToEdit.store.split(', ') 
      : []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (name: string, value: string) => {
    if (name === 'name' && !value) return 'El nombre es obligatorio.';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido.';
    if (name === 'phone' && value && value.length !== 9) return 'Teléfono debe tener 9 dígitos.';
    // CORRECCIÓN: Validar RUC si es comerciante
    if (name === 'ruc' && formData.role === 'Comerciante' && value.length !== 11) return 'RUC debe tener 11 dígitos.';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSave = () => {
    // Marcar todos como touched
    const allTouched: Record<string, boolean> = {};
    const allErrors: Record<string, string> = {};
    ['name', 'email', 'phone', 'ruc'].forEach(f => {
      allTouched[f] = true;
      allErrors[f] = validate(f, (formData as any)[f]);
    });
    
    setTouched(allTouched);
    setErrors(allErrors);

    const hasErrors = Object.values(allErrors).some(e => e);
    if (hasErrors) return;

    let finalStore = formData.store;
    if (formData.role === 'Administrador') finalStore = 'Todas';
    if (formData.role === 'Comerciante') finalStore = selectedMerchantStores.length > 0 ? selectedMerchantStores.join(', ') : 'Ninguna';

    updateUser(userToEdit.email, {
      ...formData,
      name: `${formData.name} ${formData.lastNamePaterno}`.trim(),
      store: finalStore,
    });

    router.push('/admin/usuarios');
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-right duration-500 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-brand-camel font-bold text-[14px] mb-4 hover:underline"
          >
            <ArrowLeft size={16} /> Volver a usuarios
          </button>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Editar Usuario</h2>
          <p className="text-[14px] font-medium text-neutral-400">Modifica los parámetros de acceso y perfil</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10">
            <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
              <Users size={20} className="text-brand-camel" /> Persona
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Select 
                label="Rol del sistema" 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option>Administrador</option>
                <option>Comerciante</option>
                <option>Cliente</option>
              </Select>
              
              {formData.role === 'Administrador' ? (
                <Input label="Tienda asociada" value="Todas" disabled />
              ) : formData.role === 'Comerciante' ? (
                <div className="space-y-4">
                  <Select 
                    label="Asignar tiendas (Una o muchas)" 
                    value="" 
                    onChange={(e: any) => {
                      const val = e.target.value;
                      if (val && !selectedMerchantStores.includes(val)) {
                        setSelectedMerchantStores(prev => [...prev, val]);
                      }
                    }}
                  >
                    <option value="">Seleccionar tienda...</option>
                    {stores.filter(s => !selectedMerchantStores.includes(s.name)).map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </Select>

                  {selectedMerchantStores.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-3 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
                      {selectedMerchantStores.map(s => (
                        <Badge 
                          key={s} 
                          variant="selected" 
                          onClick={() => setSelectedMerchantStores(prev => prev.filter(p => p !== s))}
                          className="cursor-pointer hover:bg-brand-camel/80 transition-colors"
                        >
                          {s} <span className="ml-1 opacity-60">×</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Select 
                  label="Tienda asociada (Solo una)" 
                  name="store" 
                  value={formData.store} 
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  {stores.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </Select>
              )}
              
              <Input 
                label="Nombre" 
                name="name"
                placeholder="Luciana" 
                value={formData.name} 
                onChange={handleChange} 
                onBlur={handleBlur}
                error={touched.name ? errors.name : ''}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Apellido Paterno" 
                  name="lastNamePaterno"
                  placeholder="Vega" 
                  value={formData.lastNamePaterno} 
                  onChange={handleChange} 
                />
                <Input 
                  label="Apellido Materno" 
                  name="lastNameMaterno"
                  placeholder="Rios" 
                  value={formData.lastNameMaterno}
                  onChange={handleChange}
                />
              </div>
              
              <Input 
                label="Teléfono" 
                name="phone"
                placeholder="987654321" 
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone ? errors.phone : ''}
              />
            </div>
          </Card>

          {/* Sección Información Adicional - Aquí aparecerá el RUC si existe */}
          {(formData.role === 'Comerciante' || formData.role === 'Cliente') && (
            <Card className="p-10">
              <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
                <Store size={20} className="text-brand-camel" /> Información adicional
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Input 
                  label={formData.role === 'Comerciante' ? "RUC (Obligatorio)" : "RUC (Opcional)"} 
                  name="ruc"
                  placeholder="20123456789" 
                  value={formData.ruc} // El valor se lee del estado que inicializamos arriba
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.ruc ? errors.ruc : ''}
                />
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="p-10 border-2 border-brand-camel">
            <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-brand-camel" /> Cuenta de Usuario
            </h3>
            <div className="space-y-6">
              <Input 
                label="Nombre de usuario (Email)" 
                name="email"
                value={formData.email} 
                disabled
                className="bg-neutral-50 opacity-70"
              />
            </div>
            
            <div className="mt-12 space-y-3">
              <Button 
                className="w-full h-14 rounded-2xl" 
                onClick={handleSave}
              >
                Guardar cambios
              </Button>
              <Button variant="secondary" className="w-full h-14 rounded-2xl" onClick={() => router.back()}>Cancelar</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}