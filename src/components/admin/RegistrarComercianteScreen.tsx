'use client';

import { useState, ChangeEvent, FocusEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Select } from '../UI';
import { ArrowLeft, Users, Store, CheckCircle2, AlertCircle } from 'lucide-react';

interface FormData {
  docType: string;
  docNumber: string;
  name: string;
  lastNamePaterno: string;
  lastNameMaterno: string;
  birthDate: string;
  phone: string;
  ruc: string;
  email: string;
  password: string;
}

interface Errors {
  [key: string]: string;
}

export function RegistrarComercianteScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    docType: 'DNI',
    docNumber: '',
    name: '',
    lastNamePaterno: '',
    lastNameMaterno: '',
    birthDate: '',
    phone: '',
    ruc: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 🔍 Lógica de validación centralizada
  const validate = (name: string, value: string, data: FormData = formData): string => {
    let error = '';
    const onlyLetters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

    switch (name) {
      case 'docNumber':
        if (!value) return 'Campo obligatorio.';
        if (data.docType === 'DNI' && value.length !== 8) return 'DNI debe tener exactamente 8 dígitos.';
        if (data.docType === 'RUC' && value.length !== 11) return 'RUC debe tener exactamente 11 dígitos.';
        if (data.docType === 'Carnet de extranjería' && value.length !== 9) return 'Carnet debe tener 9 dígitos.';
        if (data.docType === 'Pasaporte' && value.length < 5) return 'Pasaporte inválido (mín. 5 caracteres).';
        break;
      case 'name':
      case 'lastNamePaterno':
        if (!value) return 'Campo obligatorio.';
        if (!onlyLetters.test(value)) return 'Solo se permiten letras.';
        break;
      case 'phone':
        if (!value) return 'Campo obligatorio.';
        if (!/^\d{9}$/.test(value)) return 'Teléfono debe tener 9 dígitos.';
        break;
      case 'ruc':
        if (!value) return 'Campo obligatorio.';
        if (!/^\d{11}$/.test(value)) return 'RUC debe tener 11 dígitos.';
        break;
      case 'email':
        if (!value) return 'Campo obligatorio.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Correo electrónico inválido.';
        break;
      case 'birthDate':
        if (!value) return 'Campo obligatorio.';
        const birth = new Date(value);
        const today = new Date();
        if (birth > today) return 'La fecha no puede ser futura.';
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < 18) return 'El comerciante debe ser mayor de 18 años.';
        break;
      case 'password':
        if (!value) return 'Campo obligatorio.';
        if (value.length < 8) return 'Mínimo 8 caracteres.';
        break;
    }
    return error;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    // ️ Filtros de entrada en tiempo real
    if (name === 'docNumber') {
      if (formData.docType === 'DNI') value = value.replace(/\D/g, '').slice(0, 8);
      else if (formData.docType === 'RUC') value = value.replace(/\D/g, '').slice(0, 11);
      else if (formData.docType === 'Carnet de extranjería') value = value.replace(/\D/g, '').slice(0, 9);
      else value = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    } else if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 9);
    } else if (name === 'ruc') {
      value = value.replace(/\D/g, '').slice(0, 11);
    } else if (['name', 'lastNamePaterno', 'lastNameMaterno'].includes(name)) {
      value = value.replace(/[0-9]/g, '');
    }

    const nextData = { ...formData, [name]: value };
    setFormData(nextData);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid = (): boolean => {
    const requiredFields = ['docNumber', 'name', 'lastNamePaterno', 'birthDate', 'phone', 'ruc', 'email', 'password'];
    const currentErrors = requiredFields.map(f => validate(f, formData[f as keyof FormData]));
    return requiredFields.every(f => formData[f as keyof FormData] && !currentErrors[requiredFields.indexOf(f)]);
  };

  const handleSubmit = () => {
    // Marcar todos como tocados para mostrar errores pendientes
    const allTouched: Record<string, boolean> = {};
    const allErrors: Errors = {};
    const fields = ['docNumber', 'name', 'lastNamePaterno', 'birthDate', 'phone', 'ruc', 'email', 'password'];
    
    fields.forEach(f => {
      allTouched[f] = true;
      allErrors[f] = validate(f, formData[f as keyof FormData]);
    });

    setTouched(allTouched);
    setErrors(allErrors);

    if (isFormValid()) {
      console.log('✅ Datos válidos listos para API:', formData);
      // Aquí irá: await axios.post('/api/merchants', formData)
      router.push('/admin/usuarios');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 max-w-[1400px] mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-brand-camel font-bold text-[14px] hover:underline">
        <ArrowLeft size={16} /> Volver a usuarios
      </button>

      <div>
        <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">Registrar comerciante</h2>
        <p className="text-[14px] font-medium text-neutral-400">Vinculación de persona natural o jurídica a tienda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 👤 Sección Persona */}
          <Card className="p-10">
            <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
              <Users size={20} className="text-brand-camel" /> Persona
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Select label="Tipo de documento" name="docType" value={formData.docType} onChange={handleChange}>
                <option>DNI</option>
                <option>RUC</option>
                <option>Carnet de extranjería</option>
                <option>Pasaporte</option>
              </Select>
              <Input 
                label="Número de documento" 
                name="docNumber"
                placeholder={formData.docType === 'DNI' ? '8 dígitos' : formData.docType === 'RUC' ? '11 dígitos' : 'Máx. 20 caracteres'}
                value={formData.docNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.docNumber ? errors.docNumber : ''}
              />
              <Input label="Nombre" name="name" placeholder="Luciana" value={formData.name} onChange={handleChange} onBlur={handleBlur} error={touched.name ? errors.name : ''} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Apellido Paterno" name="lastNamePaterno" placeholder="Vega" value={formData.lastNamePaterno} onChange={handleChange} onBlur={handleBlur} error={touched.lastNamePaterno ? errors.lastNamePaterno : ''} />
                <Input label="Apellido Materno" name="lastNameMaterno" placeholder="Rios" value={formData.lastNameMaterno} onChange={handleChange} />
              </div>
              <Input label="Fecha de Nacimiento" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} onBlur={handleBlur} error={touched.birthDate ? errors.birthDate : ''} />
              <Input label="Teléfono" name="phone" placeholder="987654321" value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={touched.phone ? errors.phone : ''} />
            </div>
          </Card>

          {/* 🏪 Sección Comerciante */}
          <Card className="p-10">
            <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
              <Store size={20} className="text-brand-camel" /> Comerciante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Input label="RUC" name="ruc" placeholder="20123456789" value={formData.ruc} onChange={handleChange} onBlur={handleBlur} error={touched.ruc ? errors.ruc : ''} />
            </div>
          </Card>
        </div>

        {/* 🔐 Sección Cuenta */}
        <div className="space-y-8">
          <Card className="p-10 border-2 border-brand-camel">
            <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-brand-camel" /> Cuenta de Usuario
            </h3>
            <div className="space-y-6">
              <Input label="Email" name="email" placeholder="luciana@street.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={touched.email ? errors.email : ''} />
              <div>
                <Input label="Contraseña" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} onBlur={handleBlur} error={touched.password ? errors.password : ''} />
                <p className="text-[10px] text-neutral-400 mt-2 font-bold uppercase ml-1">Mínimo 8 caracteres</p>
              </div>
            </div>
            
            <div className="mt-12 space-y-3">
              <Button className="w-full h-14 rounded-2xl" onClick={handleSubmit} disabled={!isFormValid()}>
                Crear comerciante
              </Button>
              <Button variant="secondary" className="w-full h-14 rounded-2xl" onClick={() => router.back()}>Cancelar</Button>
            </div>
          </Card>

          <div className="p-8 bg-brand-camel/10 rounded-[32px] border border-brand-camel/20">
             <p className="text-[13px] font-bold text-brand-camel leading-relaxed">
               Al crear el comerciante, se le enviará un correo de bienvenida con las instrucciones para su primera sesión.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}