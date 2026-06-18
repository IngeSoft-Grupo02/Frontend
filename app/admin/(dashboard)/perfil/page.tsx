'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/domains/admin/context/AppContext';
import { api, UserResponseDTO } from '@/domains/admin/lib/api';
import { User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '@/domains/admin/components/UI';

function validarPassword(pwd: string): string {
  if (!pwd) return '';
  if (pwd.length < 8)            return 'Mínimo 8 caracteres.';
  if (!/[A-Z]/.test(pwd))        return 'Debe incluir al menos una mayúscula.';
  if (!/[0-9]/.test(pwd))        return 'Debe incluir al menos un número.';
  if (!/[^a-zA-Z0-9]/.test(pwd)) return 'Debe incluir al menos un símbolo (ej: *, !, @).';
  return '';
}

export default function PerfilPage() {
  const { currentUser } = useApp();

  const [userData,    setUserData]    = useState<UserResponseDTO|null>(null);
  const [loading,     setLoading]     = useState(true);
  const [phone,       setPhone]       = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving,    setIsSaving]    = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  // Cargar datos del usuario autenticado desde el backend
  useEffect(() => {
    if (!currentUser?.email) return;

    // Buscar el usuario por email en el listado
    api.users.getAll({ search: currentUser.email })
        .then(users => {
          const me = users.find(u => u.email === currentUser.email);
          if (me) {
            setUserData(me);
            setPhone(me.phone ?? '');
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, [currentUser?.email]);

  const pwdError   = validarPassword(newPassword);
  const confirmErr = confirmPassword && newPassword !== confirmPassword
      ? 'Las contraseñas no coinciden.' : '';

  const handleSave = async () => {
    setError(''); setSuccess('');

    if (phone && phone.length !== 9) {
      setError('El teléfono debe tener exactamente 9 dígitos.'); return;
    }
    if (newPassword) {
      const err = validarPassword(newPassword);
      if (err) { setError(err); return; }
      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden.'); return;
      }
    }
    if (!newPassword && !phone) {
      setSuccess('No hay cambios para guardar.'); return;
    }

    if (!userData?.id) { setError('No se pudo identificar el usuario.'); return; }

    setIsSaving(true);
    try {
      await api.users.update(userData.id, {
        ...(newPassword ? { password: newPassword } : {}),
        ...(phone       ? { phone }                : {}),
      });
      setSuccess('Cambios guardados correctamente.');
      setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      setError(err.message ?? 'Error al guardar cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  const roleLabel = (r: string) => {
    const map: Record<string,string> = {
      'Super admin':   'Super Administrador',
      'SYSTEM_ADMIN':  'Administrador del sistema',
      'MERCHANT':      'Comerciante',
      'CUSTOMER':      'Cliente',
    };
    return map[r] ?? r;
  };

  const displayName = userData
      ? `${userData.firstName ?? ''} ${userData.paternalSurname ?? ''}`.trim()
      : currentUser?.name ?? '';

  return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Mi Perfil</h2>
          <p className="text-[14px] font-medium text-neutral-400">Gestiona tu información personal y credenciales de acceso</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 lg:p-12">

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center border-4 border-white shadow-xl">
              <User size={48} className="text-neutral-400"/>
            </div>
          </div>

          {loading ? (
              <div className="flex items-center justify-center py-12 gap-3 text-neutral-400">
                <Loader2 size={20} className="animate-spin"/> Cargando datos...
              </div>
          ) : (
              <div className="space-y-8">
                {/* Mensajes */}
                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                      <AlertCircle size={16} className="text-red-600 shrink-0"/>
                      <p className="text-[13px] text-red-700 font-medium">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
                      <CheckCircle2 size={16} className="text-green-600 shrink-0"/>
                      <p className="text-[13px] text-green-700 font-medium">{success}</p>
                    </div>
                )}

                {/* Datos principales — solo lectura */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Nombre completo" value={displayName} disabled
                         className="bg-neutral-50 opacity-70"/>
                  <Input label="Correo electrónico" value={userData?.email ?? currentUser?.email ?? ''} disabled
                         className="bg-neutral-50 opacity-70"/>
                  <div>
                    <Input label="Teléfono (9 dígitos)" value={phone}
                           placeholder="987654321"
                           onChange={e => {
                             const val = e.target.value.replace(/\D/g,'').slice(0,9);
                             setPhone(val);
                             if (error) setError('');
                           }}/>
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold ml-1">Sin prefijos (ej: 987654321)</p>
                  </div>
                  <Input label="Rol"
                         value={roleLabel(userData?.role ?? currentUser?.role ?? '')}
                         disabled className="bg-neutral-50 opacity-70"/>
                </div>

                {/* Cambiar contraseña */}
                <div className="pt-6 border-t border-neutral-100">
                  <h4 className="text-[13px] font-bold text-neutral-900 mb-2 uppercase tracking-wider">Cambiar contraseña</h4>
                  <p className="text-[12px] text-neutral-400 mb-6">Mínimo 8 caracteres, una mayúscula, un número y un símbolo.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Nueva contraseña</label>
                      <div className="relative">
                        <input type={showNew ? 'text' : 'password'}
                               placeholder="Dejar en blanco para no cambiar"
                               value={newPassword}
                               onChange={e => setNewPassword(e.target.value)}
                               className={`w-full h-11 px-4 pr-11 bg-white border ${newPassword && pwdError ? 'border-red-400' : 'border-neutral-200'} rounded-2xl text-[14px] outline-none focus:border-brand-camel transition-colors`}/>
                        <button type="button" onClick={() => setShowNew(p=>!p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                          {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                      {newPassword && pwdError && (
                          <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{pwdError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">Confirmar contraseña</label>
                      <div className="relative">
                        <input type={showConfirm ? 'text' : 'password'}
                               placeholder="Repetir nueva contraseña"
                               value={confirmPassword}
                               onChange={e => setConfirmPassword(e.target.value)}
                               className={`w-full h-11 px-4 pr-11 bg-white border ${confirmErr ? 'border-red-400' : 'border-neutral-200'} rounded-2xl text-[14px] outline-none focus:border-brand-camel transition-colors`}/>
                        <button type="button" onClick={() => setShowConfirm(p=>!p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                          {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                      {confirmErr && (
                          <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{confirmErr}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave}
                          disabled={isSaving || !!(newPassword && (pwdError || confirmErr))}
                          className="rounded-full px-12 h-12">
                    {isSaving ? <><Loader2 size={16} className="animate-spin mr-2"/>Guardando...</> : 'Guardar cambios'}
                  </Button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}