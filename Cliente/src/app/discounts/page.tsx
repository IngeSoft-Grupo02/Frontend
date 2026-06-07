'use client';

/**
@license
SPDX-License-Identifier: Apache-2.0
*/
import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card, Input } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { Discount } from '@/lib/types';
import {
    ArrowUpRight,
    Check,
    CheckCircle2,
    ChevronRight,
    Edit3,
    Info,
    Package,
    PauseCircle,
    Plus,
    Search,
    Tag,
    Trash2,
    X
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

export default function DiscountsPage() {
  const { discounts, addDiscount, updateDiscount, deleteDiscount } = useStore();
  const [filter, setFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDetailId, setShowDetailId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Discount & { type?: string }>>({
    name: '',
    type: 'Porcentaje',
    value: 5,
    minUnits: 20,
    appliesTo: 'Todo el catálogo',
    status: 'Activa'
  });

  const selectedDiscount = useMemo(() =>
    discounts.find((d: Discount) => d.id === showDetailId),
    [discounts, showDetailId]
  );

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((d: Discount) => {
      const displayStatus = d.status === 'Activa' ? 'Activas' : 'Inactivos';
      const matchesFilter = filter === 'Todas' || displayStatus === filter;
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [discounts, filter, searchTerm]);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      updateDiscount(editingId, {
        name: formData.name,
        value: formData.value || 0,
        minUnits: formData.minUnits || 0,
        appliesTo: formData.appliesTo || 'Todo el catálogo'
      });
      setEditingId(null);
    } else {
      const newRule: Discount = {
        id: `DESC-${Math.floor(Math.random() * 10000)}`,
        name: formData.name,
        value: formData.value || 0,
        minUnits: formData.minUnits || 0,
        appliesTo: formData.appliesTo || 'Todo el catálogo',
        status: 'Activa',
        usageCount: 0
      };
      addDiscount(newRule);
    }

    setIsCreating(false);
    setFormData({
      name: '',
      type: 'Porcentaje',
      value: 5,
      minUnits: 20,
      appliesTo: 'Todo el catálogo',
      status: 'Activa'
    });
  };

  const startEdit = (discount: Discount) => {
    setFormData({
      name: discount.name,
      value: discount.value,
      minUnits: discount.minUnits,
      appliesTo: discount.appliesTo,
      status: discount.status
    });
    setEditingId(discount.id);
    setIsCreating(true);
    setShowDetailId(null);
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateDiscount(id, { status: currentStatus === 'Activa' ? 'Pausada' : 'Activa' });
  };

  if (isCreating) {
    return (
      <MerchantLayout title={editingId ? "Editar Descuento" : "Nuevo Descuento"} subtitle="Configuración de regla avanzada">
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-[32px] font-black tracking-tighter text-brand-black">{editingId ? 'Modificar Regla' : 'Crear Nueva Regla de Volumen'}</h2>
              <p className="text-[14px] font-bold text-brand-text-muted uppercase tracking-tight">Establece los gatillos de descuento para tus clientes</p>
            </div>
            <Button variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); }} className="rounded-2xl px-6 h-12">Cancelar</Button>
          </div>

          <Card className="shadow-2xl shadow-brand-black/5 border-2 border-brand-neutral-border p-10 overflow-hidden">
            <form onSubmit={handleCreateRule} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Input
                    label="Etiqueta del Descuento *"
                    placeholder="Ej: Oferta de Lanzamiento"
                    value={formData.name || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 rounded-2xl font-bold"
                  />
                  <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-tighter">Este nombre identifica la promoción internamente</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] leading-none">Tipo de Bonificación</label>
                  <div className="grid grid-cols-2 gap-3 bg-brand-neutral-light p-2 rounded-2xl border border-brand-neutral-border">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'Porcentaje' })}
                      className={`rounded-xl py-3 text-[13px] font-black flex items-center justify-center gap-2 transition-all ${
                        formData.type === 'Porcentaje' ? 'bg-brand-black text-white shadow-xl' : 'text-brand-text-muted hover:text-brand-black'
                      }`}
                    >
                      {formData.type === 'Porcentaje' && <Check size={14} />} Porcentaje
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'Monto Fijo' })}
                      className={`rounded-xl py-3 text-[13px] font-black flex items-center justify-center gap-2 transition-all ${
                        formData.type === 'Monto Fijo' ? 'bg-brand-black text-white shadow-xl' : 'text-brand-text-muted hover:text-brand-black'
                      }`}
                    >
                      {formData.type === 'Monto Fijo' && <Check size={14} />} Monto Fijo
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] leading-none">Intensidad del Descuento</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[5, 10, 15, 20].map(val => (
                    <div
                      key={val}
                      onClick={() => setFormData({ ...formData, value: val })}
                      className={`p-8 border-2 rounded-[32px] cursor-pointer text-center transition-all relative ${
                        formData.value === val ? 'border-brand-black bg-brand-neutral-mid shadow-inner ring-4 ring-brand-black/5' : 'border-brand-neutral-border hover:border-brand-black'
                      }`}
                    >
                      <h4 className="text-[28px] font-black">{val}{formData.type === 'Porcentaje' ? '%' : ''}</h4>
                      <p className="text-[10px] font-black text-brand-text-muted uppercase mt-1">Tier Descuento</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Input
                    label="Cantidad mínima de compra *"
                    value={formData.minUnits?.toString() || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, minUnits: parseInt(e.target.value) || 0 })}
                    type="number"
                    placeholder="20"
                    className="h-14 rounded-2xl font-bold"
                  />
                  <div className="bg-blue-50 p-6 rounded-[24px] border border-blue-100 flex items-start gap-4 shadow-sm">
                    <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[12px] font-bold text-blue-800 leading-relaxed uppercase tracking-tighter">
                      La promoción se activará automáticamente cuando el pedido alcance las <span className="underline decoration-2">{formData.minUnits || 0}</span> unidades.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] leading-none">Aplicabilidad</label>
                  <select
                    value={formData.appliesTo}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, appliesTo: e.target.value as Discount['appliesTo'] })}
                    className="w-full h-14 bg-white border border-brand-neutral-border rounded-2xl px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center', backgroundSize: '1.2rem' }}
                  >
                    <option>Todo el catálogo</option>
                    <option>Producto específico</option>
                    <option>Categoría</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-10 border-t border-brand-neutral-border">
                <Button type="submit" disabled={!formData.name} className="flex-1 h-16 gap-3 rounded-[24px] font-black uppercase tracking-widest shadow-2xl shadow-brand-black/20 text-[15px]">
                  <Plus size={22} /> {editingId ? 'Guardar Cambios' : 'Activar Descuento'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setIsCreating(false); setEditingId(null); }} className="h-16 px-10 rounded-3xl text-brand-text-muted hover:text-red-500">Descartar</Button>
              </div>
            </form>
          </Card>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout title="Promociones de Volumen" subtitle="Configuración de descuentos por cantidad">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Precios Dinámicos</p>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">Reglas de Volumen</h1>
            <p className="text-brand-text-muted text-[15px] font-bold max-w-2xl leading-relaxed">
              Define descuentos automáticos que incentiven pedidos grandes. Las reglas se aplican en tiempo real al carrito.
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="rounded-[32px] gap-3 h-16 px-12 shadow-2xl shadow-brand-black/20 font-black text-[15px] uppercase tracking-wider"
          >
            <Plus size={24} /> Crear Descuento
          </Button>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[32px] border-2 border-brand-neutral-border flex items-center justify-between hover:border-brand-black transition-all group cursor-default">
            <div className="space-y-2">
              <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Activas Ahora
              </p>
              <h3 className="text-[40px] font-black tracking-tighter">
                {discounts.filter((d: Discount) => d.status === 'Activa').length.toString().padStart(2, '0')}
              </h3>
            </div>
            <CheckCircle2 size={40} className="text-green-500 opacity-20 group-hover:opacity-100 transition-all" />
          </div>
          <div className="bg-white p-8 rounded-[32px] border-2 border-brand-neutral-border flex items-center justify-between hover:border-brand-black transition-all group cursor-default">
            <div className="space-y-2">
              <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-text-muted rounded-full"></span> Inactivos
              </p>
              <h3 className="text-[40px] font-black tracking-tighter">
                {discounts.filter((d: Discount) => d.status === 'Pausada').length.toString().padStart(2, '0')}
              </h3>
            </div>
            <PauseCircle size={40} className="text-brand-neutral-mid opacity-30 group-hover:opacity-100 transition-all" />
          </div>
          <div className="bg-brand-neutral-light p-8 rounded-[32px] border-2 border-brand-neutral-border flex items-center justify-between group cursor-default">
            <div className="space-y-2">
              <p className="text-[11px] font-black text-brand-text-muted uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-black rounded-full"></span> Uso del Mes
              </p>
              <h3 className="text-[40px] font-black tracking-tighter">
                {discounts.reduce((acc: number, d: Discount) => acc + d.usageCount, 0).toString().padStart(2, '0')}
              </h3>
            </div>
            <ArrowUpRight size={40} className="text-brand-black opacity-10 group-hover:scale-110 transition-all" />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <Card className="!p-0 overflow-hidden shadow-2xl shadow-brand-black/5 border-2 border-brand-neutral-border">
            <div className="p-8 border-b border-brand-neutral-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-widest leading-none">Listado de Promociones</h4>
                <h3 className="text-[20px] font-black tracking-tight text-brand-black">Catálogo Completo</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="h-12 pl-12 pr-6 bg-brand-neutral-light border border-brand-neutral-border rounded-xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 transition-all w-64"
                  />
                </div>
                <div className="flex items-center gap-3 bg-brand-neutral-light px-4 py-2 rounded-2xl border border-brand-neutral-border">
                  <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Filtrar:</span>
                  <select
                    value={filter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
                    className="bg-transparent text-[13px] font-bold text-brand-black outline-none cursor-pointer pr-4"
                  >
                    {['Todas', 'Activas', 'Inactivos'].map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-neutral-light/50 border-b border-brand-neutral-border">
                    <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Nombre de la Regla</th>
                    <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest text-center">Descuento</th>
                    <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest text-center">Gatillo (Unidades)</th>
                    <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest text-center">Canjes</th>
                    <th className="px-8 py-5 text-[10px] font-black text-brand-text-muted uppercase tracking-widest text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-neutral-border">
                  {filteredDiscounts.map((rule: Discount) => (
                    <tr
                      key={rule.id}
                      onClick={() => setShowDetailId(rule.id)}
                      className="hover:bg-brand-neutral-light/40 transition-all cursor-pointer group"
                    >
                      <td className="px-8 py-7">
                        <div className="flex flex-col">
                          <span className="text-[16px] font-black text-brand-black tracking-tight flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            {rule.name}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-40" />
                          </span>
                          <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-tighter mt-0.5">{rule.appliesTo}</span>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-center">
                        <span className="text-[16px] font-black text-brand-black">{rule.value}{rule.type === 'Porcentaje' ? '%' : ' S/'}</span>
                      </td>
                      <td className="px-8 py-7 text-center">
                        <span className="text-[14px] font-bold text-brand-black opacity-60">≥ {rule.minUnits} uds</span>
                      </td>
                      <td className="px-8 py-7 text-center">
                        <Badge variant="outline" className="font-black text-[11px]">{rule.usageCount}</Badge>
                      </td>
                      <td className="px-8 py-7 text-right">
                        <div className="flex items-center justify-end">
                          <Badge variant={rule.status === 'Activa' ? 'success' : 'outline'} className="font-black !px-4 !py-1 text-[10px] uppercase tracking-widest">
                            {rule.status === 'Activa' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDiscounts.length === 0 && (
                <div className="p-24 text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-neutral-mid/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Tag size={32} className="text-brand-neutral-mid" />
                  </div>
                  <p className="text-[15px] font-black text-brand-text-muted uppercase tracking-widest leading-relaxed">Sin promociones configuradas</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedDiscount && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-brand-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in-95 duration-200">
            <div className="p-10 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <Badge variant={selectedDiscount.status === 'Activa' ? 'success' : 'outline'} className="!px-5 !py-1.5 font-black text-[10px] uppercase tracking-widest">
                    {selectedDiscount.status === 'Activa' ? 'Promoción Activa' : 'Promoción Suspendida'}
                  </Badge>
                  <h2 className="text-[40px] font-black tracking-tighter text-brand-black leading-tight">{selectedDiscount.name}</h2>
                </div>
                <button
                  onClick={() => setShowDetailId(null)}
                  className="w-12 h-12 rounded-full border-2 border-brand-neutral-border flex items-center justify-center hover:bg-brand-neutral-light transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-brand-neutral-light p-6 rounded-[32px] space-y-1">
                  <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-wider">Valor del Beneficio</p>
                  <h4 className="text-[32px] font-black text-brand-black">{selectedDiscount.value}{selectedDiscount.type === 'Porcentaje' ? '%' : ' S/'}</h4>
                </div>
                <div className="bg-brand-neutral-light p-6 rounded-[32px] space-y-1">
                  <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-wider">Mínimo Unidades</p>
                  <h4 className="text-[32px] font-black text-brand-black">{selectedDiscount.minUnits} uds</h4>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Resumen de Aplicabilidad</p>
                <div className="p-6 border-2 border-brand-neutral-border rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-black flex items-center justify-center text-white">
                      <Package size={20} />
                    </div>
                    <span className="text-[15px] font-black text-brand-black">{selectedDiscount.appliesTo}</span>
                  </div>
                  <Badge variant="outline" className="font-bold">{selectedDiscount.usageCount} canjes totales</Badge>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6">
                <div className="flex gap-3">
                  <Button
                    onClick={() => toggleStatus(selectedDiscount.id, selectedDiscount.status)}
                    variant={selectedDiscount.status === 'Activa' ? 'outline' : 'brand'}
                    className="flex-1 h-16 rounded-2xl font-black gap-2"
                  >
                    {selectedDiscount.status === 'Activa' ? <PauseCircle size={20} /> : <CheckCircle2 size={20} />}
                    {selectedDiscount.status === 'Activa' ? 'Pausar Oferta' : 'Reactivar Oferta'}
                  </Button>
                  <Button
                    onClick={() => startEdit(selectedDiscount)}
                    className="flex-1 h-16 rounded-2xl font-black gap-2"
                  >
                    <Edit3 size={20} /> Editar Regla
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    if (confirm('¿Eliminar esta regla permanentemente?')) {
                      deleteDiscount(selectedDiscount.id);
                      setShowDetailId(null);
                    }
                  }}
                  variant="ghost"
                  className="h-14 rounded-xl font-bold text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={20} className="mr-2" /> Eliminar permanentemente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MerchantLayout>
  );
}