'use client';

/**
@license
SPDX-License-Identifier: Apache-2.0
*/
import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card, Input } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { Discount, Product } from '@/lib/types';
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
  const { discounts, products, addDiscount, updateDiscount, deleteDiscount } = useStore();
  const [filter, setFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDetailId, setShowDetailId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Discount>>({
    name: '',
    type: 'Porcentaje',
    value: 5,
    minUnits: 20,
    appliesTo: 'Todo el catálogo',
    status: 'Activa'
  });

  const MAX_DISCOUNTS = 5;
  const canCreateMoreDiscounts = discounts.length < MAX_DISCOUNTS;

  const applyDiscountValue = (price: number, discount: Discount) => Math.max(price * (1 - discount.value / 100), 0);

  const formatMoney = (value: number) => `S/ ${value.toFixed(2)}`;

  const discountScopeLabel = (discount: Discount) => {
    const scopeLabel = discount.appliesTo === 'Producto específico' ? 'Producto específico' : 'Todo el catálogo';
    return discount.appliesTo === 'Producto específico' && discount.productName
      ? `${scopeLabel} - ${discount.productName}`
      : scopeLabel;
  };

  const productDiscountPreview = useMemo(() => {
    if (formData.appliesTo !== 'Producto específico' || !formData.productId) return null;
    const product = products.find((item: Product) => item.id === formData.productId);
    if (!product) return null;

    const existingDiscounts = discounts.filter((discount: Discount) =>
      discount.status === 'Activa'
      && (discount.appliesTo === 'Todo el catálogo' || discount.productId === product.id)
      && discount.id !== editingId
    );
    const draftDiscount: Discount = {
      id: editingId || 'DRAFT',
      name: formData.name || 'Nuevo descuento',
      type: 'Porcentaje',
      value: Number(formData.value || 0),
      minUnits: Number(formData.minUnits || 0),
      appliesTo: 'Producto específico',
      productId: product.id,
      productName: product.name,
      status: formData.status || 'Activa',
      usageCount: 0
    };
    const sequence = [...existingDiscounts, draftDiscount];
    const finalPrice = sequence.reduce((price, discount) => applyDiscountValue(price, discount), product.price);
    return { product, sequence, finalPrice };
  }, [discounts, editingId, formData, products]);

  const selectedFormProduct = useMemo(
    () => products.find((product: Product) => product.id === formData.productId),
    [products, formData.productId]
  );

  const filteredProductsForPicker = useMemo(() => {
    const term = productSearchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product: Product) => product.name.toLowerCase().includes(term));
  }, [products, productSearchTerm]);

  const selectProductForDiscount = (product: Product) => {
    setFormData({ ...formData, productId: product.id, productName: product.name });
    if (formErrors.productId) setFormErrors({ ...formErrors, productId: '' });
    setIsProductPickerOpen(false);
    setProductSearchTerm('');
  };
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

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const value = Number(formData.value || 0);
    const minUnits = Number(formData.minUnits || 0);
    const appliesTo = formData.appliesTo || 'Todo el catálogo';
    const selectedProduct = products.find((product: Product) => product.id === formData.productId);

    if (!formData.name?.trim()) newErrors.name = 'La etiqueta es obligatoria';
    if (!Number.isInteger(minUnits) || minUnits <= 0) newErrors.minUnits = 'La cantidad mínima debe ser un entero mayor a 0';
    if (value <= 0) newErrors.value = 'El descuento debe ser mayor a 0';
    if (value > 100) newErrors.value = 'El porcentaje no puede superar 100%';
    if (!editingId && !canCreateMoreDiscounts) newErrors.form = 'Solo puedes configurar hasta 5 descuentos por tienda';
    if (appliesTo === 'Producto específico' && !selectedProduct) newErrors.productId = 'Selecciona el producto al que se aplicará el descuento';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    const discountName = formData.name!.trim();
    const payload = {
      name: discountName,
      type: 'Porcentaje' as Discount['type'],
      value,
      minUnits,
      appliesTo: appliesTo as Discount['appliesTo'],
      productId: appliesTo === 'Producto específico' ? selectedProduct?.id : undefined,
      productName: appliesTo === 'Producto específico' ? selectedProduct?.name : undefined,
      status: (formData.status || 'Activa') as Discount['status']
    };

    try {
      if (editingId) {
        await updateDiscount(editingId, payload);
        setEditingId(null);
      } else {
        await addDiscount({
          id: `DESC-${Math.floor(Math.random() * 10000)}`,
          ...payload,
          status: 'Activa',
          usageCount: 0
        });
      }
    } catch (error) {
      setFormErrors({ form: error instanceof Error ? error.message : 'No se pudo guardar el descuento' });
      return;
    }

    setIsCreating(false);
    setFormData({
      name: '',
      type: 'Porcentaje',
      value: 5,
      minUnits: 20,
      appliesTo: 'Todo el catálogo',
      productId: undefined,
      productName: undefined,
      status: 'Activa'
    });
    setFormErrors({});
    setIsProductPickerOpen(false);
    setProductSearchTerm('');
  };
  const startEdit = (discount: Discount) => {
    setFormData({
      name: discount.name,
      type: 'Porcentaje',
      value: discount.value,
      minUnits: discount.minUnits,
      appliesTo: discount.appliesTo,
      productId: discount.productId,
      productName: discount.productName,
      status: discount.status
    });
    setEditingId(discount.id);
    setIsCreating(true);
    setFormErrors({});
    setShowDetailId(null);
    setIsProductPickerOpen(false);
    setProductSearchTerm('');
  };
  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      await updateDiscount(id, { status: currentStatus === 'Activa' ? 'Pausada' : 'Activa' });
    } catch (error) {
      setFormErrors({ form: error instanceof Error ? error.message : 'No se pudo cambiar el estado' });
    }
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
            <Button variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); setFormErrors({}); setIsProductPickerOpen(false); setProductSearchTerm(''); }} className="rounded-2xl px-6 h-12">Cancelar</Button>
          </div>

          <Card className="shadow-2xl shadow-brand-black/5 border-2 border-brand-neutral-border p-10 overflow-hidden">
            <form onSubmit={handleCreateRule} className="space-y-12">
              {formErrors.form && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[13px] font-bold">
                  {formErrors.form}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Input
                    label="Etiqueta del Descuento *"
                    placeholder="Ej: Oferta de Lanzamiento"
                    value={formData.name || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                    }}
                    error={formErrors.name}
                    className="h-14 rounded-2xl font-bold"
                  />
                  <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-tighter">Este nombre identifica la promoción internamente</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] leading-none">Tipo de Bonificación</label>
                  <div className="h-14 bg-brand-neutral-light border border-brand-neutral-border rounded-2xl px-5 flex items-center justify-between">
                    <span className="text-[14px] font-black text-brand-black">Porcentaje</span>
                    <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Regla fija</span>
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
                      <h4 className="text-[28px] font-black">{val}%</h4>
                      <p className="text-[10px] font-black text-brand-text-muted uppercase mt-1">Tier Descuento</p>
                    </div>
                  ))}
                </div>
                {formErrors.value && <p className="text-[11px] font-bold text-red-500">{formErrors.value}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Input
                    label="Cantidad mínima de compra *"
                    value={formData.minUnits?.toString() || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, minUnits: parseInt(digits || '0') });
                      if (formErrors.minUnits) setFormErrors({ ...formErrors, minUnits: '' });
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="20"
                    error={formErrors.minUnits}
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
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const appliesTo = e.target.value as Discount['appliesTo'];
                      setFormData({
                        ...formData,
                        appliesTo,
                        productId: appliesTo === 'Producto específico' ? formData.productId : undefined,
                        productName: appliesTo === 'Producto específico' ? formData.productName : undefined
                      });
                      if (appliesTo !== 'Producto específico') {
                        setIsProductPickerOpen(false);
                        setProductSearchTerm('');
                      }
                      setFormErrors({ ...formErrors, productId: '' });
                    }}
                    className="w-full h-14 bg-white border border-brand-neutral-border rounded-2xl px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center', backgroundSize: '1.2rem' }}
                  >
                    <option>Todo el catálogo</option>
                    <option>Producto específico</option>
                  </select>
                  {formData.appliesTo === 'Producto específico' && (
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] leading-none">Producto</label>
                      <button
                        type="button"
                        onClick={() => setIsProductPickerOpen(true)}
                        className={`w-full min-h-14 bg-white border rounded-2xl px-5 py-4 text-left outline-none focus:ring-4 focus:ring-brand-black/5 transition-all flex items-center justify-between gap-4 ${formErrors.productId ? 'border-red-500' : 'border-brand-neutral-border hover:border-brand-black'}`}
                      >
                        <div className="min-w-0">
                          <p className="text-[14px] font-black text-brand-black truncate">
                            {selectedFormProduct ? selectedFormProduct.name : 'Buscar y seleccionar producto'}
                          </p>
                          <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-tight">
                            {selectedFormProduct ? `${formatMoney(selectedFormProduct.price)} | Stock ${selectedFormProduct.stock}` : 'Abre el buscador de productos'}
                          </p>
                        </div>
                        <Search size={18} className="text-brand-text-muted shrink-0" />
                      </button>
                      {formErrors.productId && <p className="text-[11px] font-bold text-red-500">{formErrors.productId}</p>}
                    </div>
                  )}
                </div>
              </div>

              {productDiscountPreview && (
                <div className="bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[32px] p-6 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Precio final estimado</p>
                      <h4 className="text-[24px] font-black text-brand-black">{productDiscountPreview.product.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-brand-text-muted uppercase">Base {formatMoney(productDiscountPreview.product.price)}</p>
                      <p className="text-[28px] font-black text-brand-black">{formatMoney(productDiscountPreview.finalPrice)}</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {productDiscountPreview.sequence.map((discount: Discount, index: number) => (
                      <div key={`${discount.id}-${index}`} className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 border border-brand-neutral-border">
                        <span className="text-[12px] font-black text-brand-black uppercase">{index + 1}. {discount.name}</span>
                        <span className="text-[12px] font-black text-brand-text-muted">
                          - {discount.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pt-10 border-t border-brand-neutral-border">
                <Button type="submit" disabled={!formData.name || (!editingId && !canCreateMoreDiscounts)} className="flex-1 h-16 gap-3 rounded-[24px] font-black uppercase tracking-widest shadow-2xl shadow-brand-black/20 text-[15px]">
                  <Plus size={22} /> {editingId ? 'Guardar Cambios' : 'Activar Descuento'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setIsCreating(false); setEditingId(null); setFormErrors({}); setIsProductPickerOpen(false); setProductSearchTerm(''); }} className="h-16 px-10 rounded-3xl text-brand-text-muted hover:text-red-500">Descartar</Button>
              </div>
            </form>
          </Card>
        </div>
        {isProductPickerOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-brand-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-[36px] shadow-2xl border-4 border-white overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-brand-neutral-border flex items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Selección de producto</p>
                  <h3 className="text-[28px] font-black tracking-tighter text-brand-black">Buscar producto</h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsProductPickerOpen(false); setProductSearchTerm(''); }}
                  className="w-11 h-11 rounded-full border-2 border-brand-neutral-border flex items-center justify-center hover:bg-brand-neutral-light transition-all"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="p-8 space-y-5">
                <div className="relative">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                  <input
                    type="text"
                    value={productSearchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre de producto..."
                    className="w-full h-14 pl-14 pr-5 bg-brand-neutral-light border border-brand-neutral-border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all"
                    autoFocus
                  />
                </div>
                <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3">
                  {filteredProductsForPicker.map((product: Product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => selectProductForDiscount(product)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all ${formData.productId === product.id ? 'border-brand-black bg-brand-neutral-light' : 'border-brand-neutral-border hover:border-brand-black'}`}
                    >
                      <div className="min-w-0">
                        <p className="text-[15px] font-black text-brand-black truncate">{product.name}</p>
                        <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-tight">{formatMoney(product.price)} | Stock {product.stock}</p>
                      </div>
                      {formData.productId === product.id ? <Check size={18} className="text-brand-black shrink-0" /> : <Package size={18} className="text-brand-text-muted shrink-0" />}
                    </button>
                  ))}
                  {filteredProductsForPicker.length === 0 && (
                    <div className="py-16 text-center space-y-3">
                      <Package size={34} className="mx-auto text-brand-neutral-mid" />
                      <p className="text-[13px] font-black text-brand-text-muted uppercase tracking-widest">No se encontraron productos</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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
            <p className="text-[12px] font-black text-brand-black uppercase tracking-widest">
              {discounts.length}/{MAX_DISCOUNTS} descuentos configurados
            </p>
          </div>
          <Button
            onClick={() => {
              if (!canCreateMoreDiscounts) {
                setFormErrors({ form: 'Solo puedes configurar hasta 5 descuentos por tienda' });
                return;
              }
              setIsCreating(true);
            }}
            disabled={!canCreateMoreDiscounts}
            className="rounded-[32px] gap-3 h-16 px-12 shadow-2xl shadow-brand-black/20 font-black text-[15px] uppercase tracking-wider"
          >
            <Plus size={24} /> Crear Descuento
          </Button>
        </header>
        {formErrors.form && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[13px] font-bold">
            {formErrors.form}
          </div>
        )}

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
                          <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-tighter mt-0.5">{discountScopeLabel(rule)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-center">
                        <span className="text-[16px] font-black text-brand-black">{rule.value}%</span>
                      </td>
                      <td className="px-8 py-7 text-center">
                        <span className="text-[14px] font-bold text-brand-black opacity-60">{`>= ${rule.minUnits} uds`}</span>
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
                  <h4 className="text-[32px] font-black text-brand-black">{selectedDiscount.value}%</h4>
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
                    <span className="text-[15px] font-black text-brand-black">{discountScopeLabel(selectedDiscount)}</span>
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
                      deleteDiscount(selectedDiscount.id).catch(error => {
                        setFormErrors({ form: error instanceof Error ? error.message : 'No se pudo eliminar el descuento' });
                      });
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



