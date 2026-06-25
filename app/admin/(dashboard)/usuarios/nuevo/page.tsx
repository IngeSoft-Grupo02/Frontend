'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, StoreResponse } from '@/domains/admin/lib/api';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Users, Store } from 'lucide-react';
import { Button, Input, Select, Card, Badge } from '@/domains/admin/components/UI';
import { ADMIN_ROUTES } from '@/domains/admin/lib/routes';
import { messageFromError } from '@/domains/shared/errors';

// ── Helpers de validación ─────────────────────────────────────────

const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

function calcularEdad(fechaNac: string): number {
  const hoy = new Date();
  const nac = new Date(fechaNac);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const mes = hoy.getMonth() - nac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function validarCampo(name: string, value: string, form: any): string {
  switch (name) {
    case 'firstName':
    case 'paternalSurname':
    case 'maternalSurname':
      if (!value.trim()) return 'Obligatorio.';
      if (!SOLO_LETRAS.test(value)) return 'Solo letras y espacios, sin números ni caracteres especiales.';
      if (value.trim().length < 2) return 'Mínimo 2 caracteres.';
      return '';

    case 'docNumber':
      if (!value) return 'Obligatorio.';
      if (!/^\d+$/.test(value)) return 'Solo números.';
      if (form.docType === 'DNI' && value.length !== 8) return 'DNI debe tener 8 dígitos.';
      if (form.docType === 'FOREIGN_ID_CARD' && value.length !== 9) return 'Carnet debe tener 9 dígitos.';
      return '';

    case 'email':
      if (!value.trim()) return 'Obligatorio.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Correo electrónico inválido.';

    case 'password':
      if (!value) return 'Obligatorio.';
      return value.length >= 8 ? '' : 'Mínimo 8 caracteres.';

    case 'phone':
      if (!value) return '';
      if (!/^\d+$/.test(value)) return 'Solo números.';
      return value.length !== 9 ? 'Debe tener 9 dígitos.' : '';

    case 'ruc':
      if (form.role === 'MERCHANT') {
        if (!value) return 'Obligatorio.';
        if (!/^\d{11}$/.test(value)) return 'RUC debe tener 11 dígitos numéricos.';
      }
      return '';

    case 'birthDate':
      if (!value) return 'Obligatorio.';
      const hoy = new Date();
      const nac = new Date(value);
      if (nac >= hoy) return 'La fecha de nacimiento no puede ser futura.';
      const edad = calcularEdad(value);
      if (edad < 18) return 'El usuario debe ser mayor de edad (18+).';
      if (edad > 100) return 'Fecha de nacimiento inválida.';
      return '';

    default: return '';
  }
}

// ── Campos requeridos según rol ───────────────────────────────────
function camposRequeridos(role: string): string[] {
  const base = ['firstName', 'paternalSurname', 'maternalSurname',
    'docNumber', 'birthDate', 'email', 'password'];
  if (role === 'MERCHANT') return [...base, 'ruc'];
  return base;
}

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [selectedMerchantStores, setSelectedMerchantStores] = useState<{id:number;name:string}[]>([]);

  const [form, setForm] = useState({
    docType: 'DNI', docNumber: '', firstName: '', paternalSurname: '', maternalSurname: '',
    birthDate: '', phone: '', gender: 'MALE', ruc: '', email: '', password: 'Kingstore2026*',
    role: 'MERCHANT', storeId: '',
  });
  const [errors,      setErrors]      = useState<Record<string,string>>({});
  const [touched,     setTouched]     = useState<Record<string,boolean>>({});
  const [loading,     setLoading]     = useState(false);
  const [globalError, setGlobalError] = useState<string|null>(null);

  useEffect(() => {
    api.stores.getAll().then(setStores).catch(() => setStores([]));
  }, []);

  // ── ¿El formulario está completo y sin errores? ───────────────
  const isFormValid = (): boolean => {
    const requeridos = camposRequeridos(form.role);
    for (const campo of requeridos) {
      const val = (form as any)[campo] ?? '';
      if (!val.trim()) return false;
      if (validarCampo(campo, val, form)) return false;
    }
    if (form.role === 'MERCHANT' && selectedMerchantStores.length === 0) return false;
    if (form.role === 'CUSTOMER' && !form.storeId) return false;
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    // Sanitización por campo
    if (name === 'firstName' || name === 'paternalSurname' || name === 'maternalSurname') {
      // Eliminar números y caracteres especiales en tiempo real
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    }
    if (name === 'docNumber') {
      value = value.replace(/\D/g, '').slice(0, form.docType === 'DNI' ? 8 : 9);
    }
    if (name === 'phone') value = value.replace(/\D/g, '').slice(0, 9);
    if (name === 'ruc')   value = value.replace(/\D/g, '').slice(0, 11);

    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: validarCampo(name, value, {...form, [name]: value}) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: validarCampo(name, value, form) }));
  };

  const handleSave = async () => {
    // Marcar todos como touched y validar
    const requeridos = camposRequeridos(form.role);
    const newTouched: Record<string,boolean> = {};
    const newErrors:  Record<string,string>  = {};
    requeridos.forEach(f => {
      newTouched[f] = true;
      newErrors[f]  = validarCampo(f, (form as any)[f] ?? '', form);
    });
    setTouched(newTouched); setErrors(newErrors);

    if (Object.values(newErrors).some(e => e)) return;
    if (form.role === 'MERCHANT' && selectedMerchantStores.length === 0) {
      setErrors(p => ({ ...p, storeId: 'Selecciona al menos una tienda.' }));
      return;
    }

    setLoading(true); setGlobalError(null);
    try {
      await api.users.create({
        email:           form.email,
        password:        form.password,
        documentNumber:  form.docNumber,
        documentType:    form.docType as any,
        firstName:       form.firstName,
        paternalSurname: form.paternalSurname,
        maternalSurname: form.maternalSurname,
        birthDate:       form.birthDate || undefined,
        phone:           form.phone || undefined,
        gender:          form.gender as any,
        role:            form.role as any,
        ruc:             form.role === 'MERCHANT' ? form.ruc : undefined,
        storeId:         form.role === 'CUSTOMER' && form.storeId ? Number(form.storeId) : undefined,
      });
      router.push(ADMIN_ROUTES.users);
    } catch (err: any) { setGlobalError(messageFromError(err)); }
    finally { setLoading(false); }
  };

  const addStore = (id: number, name: string) => {
    if (!selectedMerchantStores.find(s => s.id === id)) {
      setSelectedMerchantStores(p => [...p, { id, name }]);
      setErrors(p => ({ ...p, storeId: '' }));
    }
  };
  const removeStore = (id: number) =>
      setSelectedMerchantStores(p => p.filter(s => s.id !== id));

  // Fecha máxima permitida (hace 18 años)
  const maxBirthDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  })();

  const formValid = isFormValid();

  return (
      <div className="space-y-12 animate-in slide-in-from-right duration-500 max-w-[1400px] mx-auto">
        <div>
          <button onClick={() => router.push(ADMIN_ROUTES.users)}
                  className="flex items-center gap-2 text-brand-camel font-bold text-[14px] mb-4 hover:underline">
            <ArrowLeft size={16}/> Volver a usuarios
          </button>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Formulario de Registro</h2>
          <p className="text-[14px] font-medium text-neutral-400">Verifica los datos obligatorios según el rol seleccionado</p>
        </div>

        {globalError && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle size={18} className="text-red-600 shrink-0"/>
              <p className="text-[14px] text-red-800 font-medium">{globalError}</p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-10">
              <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
                <Users size={20} className="text-brand-camel"/> Persona
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <Select label="Rol del sistema" name="role" value={form.role} onChange={handleChange}>
                  <option value="SYSTEM_ADMIN">Administrador</option>
                  <option value="MERCHANT">Comerciante</option>
                  <option value="CUSTOMER">Cliente</option>
                </Select>

                {/* Tienda según rol */}
                {form.role === 'SYSTEM_ADMIN' && (
                    <Input label="Tienda asociada" value="Global (Entorno administrativo)" disabled/>
                )}
                {form.role === 'MERCHANT' && (
                    <div className="space-y-3">
                      <Select label="Asignar tiendas (Una o muchas)" value=""
                              onChange={e => {
                                const s = stores.find(st => st.id === Number(e.target.value));
                                if (s) addStore(s.id, s.storeName);
                              }}>
                        <option value="">Seleccionar tienda...</option>
                        {stores
                            .filter(s => !selectedMerchantStores.find(ms => ms.id === s.id))
                            .map(s => <option key={s.id} value={s.id}>{s.storeName}</option>)}
                      </Select>
                      {selectedMerchantStores.length > 0 ? (
                          <div className="flex flex-wrap gap-2 p-3 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
                            {selectedMerchantStores.map(s => (
                                <Badge key={s.id} variant="selected" onClick={() => removeStore(s.id)} className="cursor-pointer">
                                  {s.name} <span className="ml-1 opacity-60">×</span>
                                </Badge>
                            ))}
                          </div>
                      ) : (
                          <p className="text-[10px] text-red-400 font-bold uppercase ml-1">
                            {errors.storeId || 'Debes seleccionar al menos una tienda'}
                          </p>
                      )}
                    </div>
                )}
                {form.role === 'CUSTOMER' && (
                    <Select label="Tienda asociada (Solo una) *" name="storeId"
                            value={form.storeId} onChange={handleChange}>
                      <option value="">Seleccionar...</option>
                      {stores.map(s => <option key={s.id} value={s.id}>{s.storeName}</option>)}
                    </Select>
                )}

                <Select label="Tipo de documento" name="docType" value={form.docType} onChange={handleChange}>
                  <option value="DNI">DNI</option>
                  <option value="PASSPORT">Pasaporte</option>
                  <option value="FOREIGN_ID_CARD">Carnet de extranjería</option>
                </Select>

                <Input label="Número de documento *" name="docNumber"
                       placeholder={form.docType === 'DNI' ? '8 dígitos numéricos' : 'Número de documento'}
                       value={form.docNumber} onChange={handleChange} onBlur={handleBlur}
                       error={touched.docNumber ? errors.docNumber : ''}/>

                <Input label="Nombre *" name="firstName" placeholder="Luciana"
                       value={form.firstName} onChange={handleChange} onBlur={handleBlur}
                       error={touched.firstName ? errors.firstName : ''}/>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Apellido Paterno *" name="paternalSurname" placeholder="Vega"
                         value={form.paternalSurname} onChange={handleChange} onBlur={handleBlur}
                         error={touched.paternalSurname ? errors.paternalSurname : ''}/>
                  <Input label="Apellido Materno *" name="maternalSurname" placeholder="Rios"
                         value={form.maternalSurname} onChange={handleChange} onBlur={handleBlur}
                         error={touched.maternalSurname ? errors.maternalSurname : ''}/>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">
                    Fecha de Nacimiento * <span className="text-neutral-400 font-normal normal-case">(debe ser mayor de 18 años)</span>
                  </label>
                  <input type="date" name="birthDate" max={maxBirthDate}
                         value={form.birthDate} onChange={handleChange} onBlur={handleBlur}
                         className={`w-full px-5 py-3.5 bg-white border ${touched.birthDate && errors.birthDate ? 'border-red-400' : 'border-neutral-200'} rounded-2xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors`}/>
                  {touched.birthDate && errors.birthDate && (
                      <p className="text-[12px] text-red-500 font-bold mt-1 ml-1">{errors.birthDate}</p>
                  )}
                </div>

                <Input label="Teléfono" name="phone" placeholder="987654321"
                       value={form.phone} onChange={handleChange} onBlur={handleBlur}
                       error={touched.phone ? errors.phone : ''}/>

                <Select label="Género" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                  <option value="NOT_SPECIFIED">No especificado</option>
                </Select>
              </div>
            </Card>

            {form.role === 'MERCHANT' && (
                <Card className="p-10">
                  <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
                    <Store size={20} className="text-brand-camel"/> Información adicional
                  </h3>
                  <Input label="RUC (Obligatorio) *" name="ruc" placeholder="20123456789"
                         value={form.ruc} onChange={handleChange} onBlur={handleBlur}
                         error={touched.ruc ? errors.ruc : ''}/>
                </Card>
            )}
          </div>

          <div className="space-y-8">
            <Card className="p-10 border-2 border-brand-camel">
              <h3 className="text-[20px] font-display font-extrabold mb-8 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-brand-camel"/> Cuenta de Usuario
              </h3>
              <div className="space-y-6">
                <Input label="Correo electrónico *" name="email" placeholder="luciana@street.com"
                       value={form.email} onChange={handleChange} onBlur={handleBlur}
                       error={touched.email ? errors.email : ''}/>
                <div>
                  <Input label="Contraseña (Fija)" name="password" type="text"
                         value={form.password} disabled
                         className="bg-neutral-100/50 cursor-not-allowed opacity-70"/>
                  <p className="text-[10px] text-brand-camel mt-2 font-bold uppercase ml-1">
                    Contraseña de acceso inicial no modificable
                  </p>
                </div>
              </div>
              <div className="mt-12 space-y-3">
                <Button className={`w-full h-14 rounded-2xl transition-opacity ${!formValid ? 'opacity-40 cursor-not-allowed' : ''}`}
                        onClick={handleSave} disabled={loading || !formValid}>
                  {loading
                      ? <><Loader2 size={16} className="animate-spin mr-2"/>Guardando...</>
                      : 'Confirmar registro'}
                </Button>
                {!formValid && (
                    <p className="text-[11px] text-neutral-400 text-center font-medium">
                      Completa todos los campos obligatorios para continuar
                    </p>
                )}
                <Button variant="secondary" className="w-full h-14 rounded-2xl"
                        onClick={() => router.push(ADMIN_ROUTES.users)}>
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}
