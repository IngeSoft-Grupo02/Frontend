'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { User, Plus, Save } from 'lucide-react';
import { Button, Input } from '@/components/UI';

export default function PerfilPage() {
  const router = useRouter();
  const { currentUser, updateUser } = useApp();
  
  // Estado local para el formulario
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    role: currentUser?.role || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Efecto para sincronizar si cambia el contexto
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.phone.length !== 9) {
      setError('El teléfono debe tener exactamente 9 dígitos');
      return;
    }

    // Validar contraseñas si se cambiaron
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        setError('La nueva contraseña debe tener al menos 8 caracteres');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }

    setError('');
    setIsSaving(true);

    // Simulación de guardado (reemplazar con API real después)
    setTimeout(() => {
      updateUser(currentUser?.email, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      });
      setIsSaving(false);
      // Opcional: Mostrar toast de éxito
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[28px] font-display font-extrabold tracking-tight">Mi Perfil</h2>
        <p className="text-[14px] font-medium text-neutral-400">Gestiona tu información personal y credenciales de acceso</p>
      </div>

      <div className="bg-white rounded-3xl card-shadow p-8 lg:p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-brand-beige-dark flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                <User size={48} className="text-neutral-600" />
              </div>
              <button 
                type="button" 
                className="absolute bottom-0 right-0 bg-brand-camel text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Campos Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Nombre completo" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input 
              label="Correo electrónico" 
              value={formData.email} 
              disabled
              className="bg-neutral-50 opacity-70"
            />
            <div>
              <Input 
                label="Teléfono (9 dígitos)" 
                value={formData.phone} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setFormData({ ...formData, phone: val });
                  if (error) setError('');
                }}
                error={error}
              />
              <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold ml-1">Sin prefijos (ej: 987654321)</p>
            </div>
            <Input 
              label="Rol" 
              value={formData.role} 
              disabled
              className="bg-neutral-50 opacity-70"
            />
          </div>

          {/* Sección Seguridad */}
          <div className="pt-6 border-t border-neutral-100">
             <h4 className="text-[13px] font-bold text-neutral-900 mb-6 uppercase tracking-wider">Seguridad</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Nueva contraseña" 
                  type="password" 
                  placeholder="Dejar en blanco para no cambiar"
                  value={formData.newPassword}
                  onChange={e => setFormData({...formData, newPassword: e.target.value})}
                />
                <Input 
                  label="Confirmar contraseña" 
                  type="password" 
                  placeholder="Repetir nueva contraseña"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
             </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSaving} 
              className="rounded-full px-12 h-12"
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}