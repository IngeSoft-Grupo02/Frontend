'use client';

import { useApp } from '@/context/AppContext';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NuevaTiendaPage() {
  const router = useRouter();
  const { addStore, users } = useApp(); // users para el dropdown de responsables

  const [formData, setFormData] = useState({
    name: '',
    responsible: '',
    status: 'Activa'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.responsible) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    // Agregar al contexto
    addStore({
      ...formData,
      id: Date.now().toString(), // ID temporal
      registrationDate: new Date().toLocaleDateString('es-PE')
    });

    // Volver a la lista
    router.push('/admin/tiendas');
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-right duration-300">
      
      {/* Botón Volver */}
      <Link 
        href="/admin/tiendas"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a tiendas
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Registrar Nueva Tienda</h1>
        <p className="text-slate-500 mb-8">Ingresa los datos iniciales para el tenant.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre de la Tienda <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Tienda Centro, Sucursal Norte"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-400 outline-none transition-colors"
            />
          </div>

          {/* Responsable (Usuario) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Responsable / Admin <span className="text-red-500">*</span>
            </label>
            <select 
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-400 outline-none transition-colors appearance-none"
            >
              <option value="">Seleccionar responsable...</option>
              {users.map(u => (
                <option key={u.email} value={u.email}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            {users.length === 0 && <p className="text-xs text-red-500 mt-1">No hay usuarios registrados. Crea usuarios primero.</p>}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estado Inicial
            </label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-400 outline-none transition-colors appearance-none"
            >
              <option value="Activa">Activa</option>
              <option value="Suspendida">Suspendida</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>

          {/* Botones */}
          <div className="pt-6 flex gap-4 border-t border-slate-100 mt-8">
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              <Save size={18} />
              Guardar Tienda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}