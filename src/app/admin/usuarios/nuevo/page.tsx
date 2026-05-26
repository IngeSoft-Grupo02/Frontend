'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Users, Store } from 'lucide-react';
import { Button, Input, Select, Card, Badge } from '@/components/UI';

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const { addUser, stores } = useApp();

  const [formData, setFormData] = useState({
    docType: 'DNI',
    docNumber: '',
    name: '',
    lastNamePaterno: '',
    lastNameMaterno: '',
    birthDate: '',
    phone: '',
    ruc: '',
    email: '',
    password: 'Kingstore2026*',
    role: 'Comerciante',
    store: ''
  });

  const [selectedMerchantStores, setSelectedMerchantStores] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (name: string, value: string, currentFormData = formData) => {
    let error = '';
    const onlyLetters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

    switch (name) {
      case 'docNumber':
        if (currentFormData.docType === 'DNI') {
          if (value.length !== 8) error = 'DNI debe tener exactamente 8 dígitos.';
        } else if (currentFormData.docType === 'RUC') {
          if (value.length !== 11) error = 'RUC debe tener exactamente 11 dígitos.';
        } else if (currentFormData.docType === 'Carnet de extranjería') {
          if (value.length !== 9) error = 'Carnet de extranjería debe tener exactamente 9 dígitos.';
        } else if (currentFormData.docType === 'Pasaporte') {
          if (value.length === 0) error = 'Campo obligatorio.';
          else if (value.length < 5) error = 'Pasaporte inválido.';
        }
        break;
      case 'name':
      case 'lastNamePaterno':
        if (!onlyLetters.test(value)) error = 'No se permiten números ni caracteres especiales.';
        if (!value) error = 'Campo obligatorio.';
        break;
      case 'phone':
        if (value.length !== 9) error = 'Teléfono debe tener 9 dígitos.';
        break;
      case 'ruc':
        if (value.length > 0 && value.length !== 11) error = 'RUC debe tener 11 dígitos.';
        if (value.length === 0 && currentFormData.role === 'Comerciante') error = 'Campo obligatorio.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Correo electrónico inválido.';
        break;
      case 'birthDate':
        if (!value) {
          error = 'Campo obligatorio.';
        } else {
          const birth = new Date(value);
          const today = new Date();
          if (birth > today) {
            error = 'La fecha no puede ser futura.';
          } else {
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
            if (age < 18) error = 'El comerciante debe ser mayor de edad.';
          }
        }
        break;
      case 'password':
        if (value.length < 8) error = 'Mínimo 8 caracteres.';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    // Input masking
    if (name === 'docNumber') {
      if (formData.docType === 'DNI') value = value.replace(/\D/g, '').slice(0, 8);
      else if (formData.docType === 'RUC') value = value.replace(/\D/g, '').slice(0, 11);
      else if (formData.docType === 'Carnet de extranjería') value = value.replace(/\D/g, '').slice(0, 9);
      else if (formData.docType === 'Pasaporte') value = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    } else if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 9);
    } else if (name === 'ruc') {
      value = value.replace(/\D/g, '').slice(0, 11);
    } else if (['name', 'lastNamePaterno', 'lastNameMaterno'].includes(name)) {
      value = value.replace(/[0-9]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid = () => {
    const requiredFields = ['docNumber', 'name', 'lastNamePaterno', 'birthDate', 'phone', 'email', 'password'];
    if (formData.role === 'Comerciante') {
      requiredFields.push('ruc');
      if (selectedMerchantStores.length === 0) return false;
    }
    if (formData.role === 'Cliente' && !formData.store) return false;
    
    const hasEmptyFields = requiredFields.some(f => !formData[f as keyof typeof formData]);
    if (hasEmptyFields) return false;
    
    const currentErrors = requiredFields.map(f => validate(f, (formData as any)[f]));
    return currentErrors.every(e => e === '');
  };

  const handleSave = () => {
    // Mark all as touched to show errors
    const allTouched: Record<string, boolean> = {};
    const allErrors: Record<string, string> = {};
    const requiredFields = ['docNumber', 'name', 'lastNamePaterno', 'birthDate', 'phone', 'email', 'password', 'docType'];
    
    if (formData.role === 'Comerciante') requiredFields.push('ruc');
    
    requiredFields.forEach(f => {
      allTouched[f] = true;
      allErrors[f] = validate(f, (formData as any)[f]);
    });
    
    setTouched(allTouched);
    setErrors(allErrors);

    if (isFormValid()) {
      let finalStore = formData.store;
      if (formData.role === 'Administrador') finalStore = 'Todas';
      if (formData.role === 'Comerciante') finalStore = selectedMerchantStores.length > 0 ? selectedMerchantStores.join(', ') : 'Ninguna';

      addUser({
        name: `${formData.name} ${formData.lastNamePaterno}`,
        email: formData.email,
        role: formData.role,
        store: finalStore,
        docType: formData.docType,
        docNumber: formData.docNumber,
        phone: formData.phone,
        birthDate: formData.birthDate,
        ruc: formData.ruc
      });
      router.push('/admin/usuarios');
    }
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
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">
            Formulario de Registro
          </h2>
          <p className="text-[14px] font-medium text-neutral-400">
            Verifica los datos obligatorios según el rol seleccionado
          </p>
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
                  {selectedMerchantStores.length === 0 && (
                    <p className="text-[10px] text-red-400 font-bold uppercase ml-1">Debes seleccionar al menos una tienda</p>
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
              
              <Select 
                label="Tipo de documento" 
                name="docType" 
                value={formData.docType} 
                onChange={(e) => {
                  handleChange(e);
                  setFormData(prev => ({ ...prev, docNumber: '' }));
                }}
              >
                <option>DNI</option>
                <option>RUC</option>
                <option>Carnet de extranjería</option>
                <option>Pasaporte</option>
              </Select>
              
              <Input 
                label="Número de documento" 
                name="docNumber"
                placeholder={
                  formData.docType === 'DNI' ? '8 dígitos' : 
                  formData.docType === 'RUC' ? '11 dígitos' : 
                  formData.docType === 'Carnet de extranjería' ? '9 dígitos' :
                  'Máx. 20 caracteres'
                } 
                value={formData.docNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.docNumber ? errors.docNumber : ''}
              />
              
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
                  onBlur={handleBlur}
                  error={touched.lastNamePaterno ? errors.lastNamePaterno : ''}
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
                label="Fecha de Nacimiento" 
                name="birthDate"
                type="date" 
                value={formData.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.birthDate ? errors.birthDate : ''}
              />
              
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
                  value={formData.ruc}
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
                placeholder="luciana@street.com" 
                value={formData.email} 
                onChange={handleChange} 
                onBlur={handleBlur}
                error={touched.email ? errors.email : ''}
              />
              <div>
                <Input 
                  label="Contraseña (Fija)" 
                  name="password"
                  type="text" 
                  value={formData.password}
                  disabled
                  className="bg-neutral-100/50 cursor-not-allowed opacity-70"
                />
                <p className="text-[10px] text-brand-camel mt-2 font-bold uppercase ml-1">Contraseña de acceso inicial no modificable</p>
              </div>
            </div>
            
            <div className="mt-12 space-y-3">
              <Button 
                className="w-full h-14 rounded-2xl" 
                onClick={handleSave}
                disabled={!isFormValid()}
              >
                Confirmar registro
              </Button>
              <Button variant="secondary" className="w-full h-14 rounded-2xl" onClick={() => router.back()}>Cancelar</Button>
            </div>
          </Card>

          <div className="p-8 bg-brand-camel/10 rounded-[32px] border border-brand-camel/20">
            <p className="text-[13px] font-bold text-brand-camel leading-relaxed">
              Al crear el usuario, se le enviará un correo de bienvenida con las instrucciones para su primera sesión y configuración.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}