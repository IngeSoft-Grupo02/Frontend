/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Info, CheckCircle2, ChevronRight, FileText, ImageIcon, X, Plus } from 'lucide-react';
import { Store, User, Product, View } from '../types';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { getColorLabel } from '../../shared/colors';

interface RequestQuoteProps {
  store: Store;
  user: User | null;
  product: Product | null;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  onAddToCart: (item: any) => void;
  cartCount: number;
}

export const RequestQuote: React.FC<RequestQuoteProps> = ({ store, user, product, onNavigate, onLogout, onAddToCart, cartCount }) => {
  const [step, setStep] = useState(1);
  const [specs, setSpecs] = useState('');
  const [rows, setRows] = useState<{id: string, size: string, color: string, quantity: number}[]>([
    { id: '1', size: 'S', color: 'BLANCO', quantity: 0 }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string}[]>([]);

  const availableVariants = product?.variants || [];
  const SIZES = Array.from(new Set(availableVariants.map((variant) => variant.size))).filter(Boolean);
  const COLORS = Array.from(new Set(availableVariants.map((variant) => String(variant.color)))).filter(Boolean);

  React.useEffect(() => {
    const firstVariant = availableVariants[0];
    if (firstVariant) {
      setRows([{ id: '1', size: firstVariant.size, color: String(firstVariant.color), quantity: 0 }]);
    }
  }, [product?.id]);

  const addRow = () => {
    const firstVariant = availableVariants[0];
    setRows(prev => [...prev, { id: Date.now().toString(), size: firstVariant?.size || '', color: firstVariant ? String(firstVariant.color) : '', quantity: 0 }]);
  };

  const updateRow = (id: string, field: string, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const addMockFile = () => {
    if (uploadedFiles.length >= 5) {
      alert('Máximo 5 archivos permitidos.');
      return;
    }
    const names = ['Logo_Final.ai', 'Mockup_Ref.jpg', 'Ficha_Tecnica.pdf', 'Paleta_Colores.png', 'Logo_Variante.svg'];
    const newFile = {
      name: names[uploadedFiles.length] || `Archivo_${uploadedFiles.length + 1}.pdf`,
      size: (Math.random() * 5 + 1).toFixed(1) + ' MB'
    };
    setUploadedFiles(prev => [...prev, newFile]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const quantity = rows.reduce((acc, row) => acc + (row.quantity || 0), 0);

  const handleAddToCart = () => {
    if (!product) return;
    const invalidRows = rows.filter((row) => row.quantity > 0 && !availableVariants.some((variant) => variant.size === row.size && String(variant.color) === row.color));
    if (invalidRows.length > 0) {
      alert('Selecciona combinaciones de talla y color disponibles para este producto.');
      return;
    }
    onAddToCart({
      productId: product.id,
      productName: product.name,
      quantity,
      specs,
      rows,
      hasDesign: uploadedFiles.length > 0,
      files: uploadedFiles,
      price: product.price
    });
  };

  const basePrice = product?.price || 28;
  const subtotal = basePrice * quantity;

  const designFeeRate = parseFloat(store.designFeePercentage || '10') / 100;
  const designFeeAmount = uploadedFiles.length > 0 ? (subtotal * designFeeRate) : 0;

  const amountBeforeDiscount = subtotal + designFeeAmount;

  const discountRate = quantity >= 300 ? 0.08 : quantity >= 100 ? 0.05 : 0;
  const discountAmount = amountBeforeDiscount * discountRate;

  const total = amountBeforeDiscount - discountAmount;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FFFFFF', color: '#0F1011' }}>
      <TopBar store={store} user={user} onNavigate={onNavigate} onLogout={onLogout} showSearch={false} cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-10 py-12 flex gap-12">
        <main className="flex-1">
          <header className="mb-12">
            <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-widest mb-6 opacity-60">
              <span style={step >= 1 ? { color: 'var(--accent-on-light)' } : {}} className="font-extrabold">Configuración</span>
              <ChevronRight size={14} />
              <span style={step >= 2 ? { color: 'var(--accent-on-light)' } : {}} className="font-extrabold">Diseño</span>
              <ChevronRight size={14} />
              <span style={step >= 3 ? { color: 'var(--accent-on-light)' } : {}} className="font-extrabold">Resumen</span>
            </div>
            <h2 className="text-[34px] font-extrabold leading-tight mb-2" style={{ color: '#0F1011' }}>Solicitar cotización</h2>
            <p className="font-medium text-[15px] opacity-75" style={{ color: '#475569' }}>Personaliza tu pedido por volumen. El equipo de {store.name} revisará tu solicitud.</p>
          </header>

          <div className="space-y-8">
            {/* Step 1: Configuration */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="rounded-2xl border p-10"
               style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-start gap-6 mb-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-[18px]" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--accent-on-primary)', border: '1px solid var(--border-on-primary)' }}>1</div>
                <div>
                  <h3 className="text-[20px] font-extrabold mb-1" style={{ color: 'var(--text-on-secondary)' }}>Detalles del Producto</h3>
                  <p className="text-[14px] opacity-60">Selecciona las características técnicas para la producción.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[12px] font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Producto</label>
                  <div className="w-full px-5 py-3.5 rounded-xl font-bold text-[14px] border" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                    {product?.name || 'Selecciona un producto'}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Cantidad Total (u)</label>
                  <div
                    className="w-full px-5 py-3.5 rounded-xl font-black text-[18px] border transition-colors"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      borderColor: 'rgba(0,0,0,0.05)',
                      color: quantity <= 0 ? 'var(--error-on-primary)' : 'var(--accent-on-primary)'
                    }}
                  >
                    {quantity} unidades
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    {quantity <= 0 ? (
                      <span className="flex items-center gap-1" style={{ color: 'var(--error-on-secondary)' }}><Info size={12} /> Mínimo de producción: 60 unidades</span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--success-on-secondary)' }}><CheckCircle2 size={12} /> Cantidad válida para producción</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[12px] font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Distribución por Tallas y Colores</label>
                  <Button
                    variant="ghost"
                    className="text-[11px] h-8 px-3 flex items-center gap-2 font-black cursor-pointer"
                    style={{ color: 'var(--accent-on-secondary)' }}
                    onClick={addRow}
                  >
                    <Plus size={14} /> Agregar combinación
                  </Button>
                </div>

                <div className="space-y-4">
                  {rows.map((row) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={row.id}
                      className="flex flex-wrap items-end gap-6 p-6 rounded-2xl border"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                    >
                      <div className="flex-1 min-w-[120px] space-y-2">
                        <label className="text-[10px] font-black tracking-widest uppercase opacity-60">Talla</label>
                        <select
                          value={row.size}
                          onChange={(e) => updateRow(row.id, 'size', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border font-black text-[14px] focus:outline-none transition-all appearance-none cursor-pointer"
                          style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.1)' }}
                        >
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="flex-1 min-w-[150px] space-y-2">
                        <label className="text-[10px] font-black tracking-widest uppercase opacity-60">Color</label>
                        <select
                          value={row.color}
                          onChange={(e) => updateRow(row.id, 'color', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border font-black text-[14px] focus:outline-none transition-all appearance-none cursor-pointer"
                          style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.1)' }}
                        >
                          {COLORS.map(c => <option key={c} value={c}>{getColorLabel(c)}</option>)}
                        </select>
                      </div>
                      <div className="w-32 space-y-2">
                        <label className="text-[10px] font-black tracking-widest uppercase opacity-60">Cantidad</label>
                        <input
                          type="number"
                          min="0"
                          value={row.quantity || ''}
                          onChange={(e) => updateRow(row.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2.5 rounded-xl border font-black text-[14px] focus:outline-none transition-all"
                          placeholder="0"
                          style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.1)' }}
                        />
                      </div>
                      <button
                        onClick={() => removeRow(row.id)}
                        className="p-3 hover:text-red-500 rounded-xl transition-all mb-0.5 cursor-pointer"
                        style={{ color: 'var(--text-on-primary)', opacity: 0.5 }}
                        disabled={rows.length === 1}
                        title="Eliminar combinación"
                      >
                        <X size={20} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Step 2: Design */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="rounded-2xl border p-10"
               style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-start gap-6 mb-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-[18px]" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--accent-on-primary)', border: '1px solid var(--border-on-primary)' }}>2</div>
                <div>
                  <h3 className="text-[20px] font-extrabold mb-1" style={{ color: 'var(--text-on-secondary)' }}>Referencias de Diseño</h3>
                  <p className="text-[14px] opacity-60">Sube tu logo, ficha técnica o fotos de referencia.</p>
                </div>
              </div>

              <div className="border-2 rounded-2xl p-8 mb-10 flex items-start gap-5 shadow-sm" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-tertiary)', color: 'var(--text-on-primary)' }}>
                <Info size={24} style={{ color: 'var(--color-tertiary)' }} className="shrink-0 mt-1" />
                <p className="text-[15px] font-bold leading-relaxed">
                  <span className="uppercase tracking-[0.25em] text-[11px] block mb-2 opacity-65" style={{ color: 'var(--color-tertiary)' }}>Nota de Producción</span>
                  La inclusión de un diseño personalizado conlleva un incremento del {store.designFeePercentage || '10%'} sobre el monto total de esta cotización. Este incremento se aplica automáticamente al adjuntar archivos de referencia.
                </p>
              </div>

              <div
                className="border-2 border-dashed rounded-2xl p-16 text-center group transition-colors cursor-pointer"
                onClick={addMockFile}
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.1)' }}
              >
                <div className="w-16 h-16 rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)' }}>
                  <Upload size={24} style={{ color: 'var(--color-tertiary)' }} />
                </div>
                <h4 className="text-[16px] font-extrabold mb-2" style={{ color: 'var(--text-on-primary)' }}>
                  {uploadedFiles.length >= 5 ? 'Límite de archivos alcanzado' : 'Sube tus referencias de diseño'}
                </h4>
                <p className="text-[13px] opacity-60 font-medium mb-8">Permitido: PNG, JPG, PDF, AI, SVG (Máx. 5 archivos)</p>
                <div className="flex justify-center gap-3">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm border" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                    <ImageIcon size={12} /> Referencias
                  </span>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-black uppercase tracking-wider opacity-85" style={{ color: 'var(--text-on-secondary)' }}>Archivos adjuntos ({uploadedFiles.length}/5)</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedFiles.map((file, idx) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-xl border group"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                            <FileText size={16} style={{ color: 'var(--color-tertiary)' }} />
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-[12px] font-black truncate" style={{ color: 'var(--text-on-primary)' }}>{file.name}</div>
                            <div className="text-[10px] opacity-60 font-bold">{file.size}</div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="p-2 hover:text-red-500 transition-colors cursor-pointer"
                          style={{ color: 'var(--muted-on-primary)' }}
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-3">
                 <label className="text-[12px] font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-on-secondary)' }}>Indicaciones adicionales</label>
                 <textarea
                    placeholder="Escribe aquí detalles sobre estampados, bordados o acabados especiales..."
                    className="w-full px-5 py-4 rounded-xl font-medium text-[14px] border focus:outline-none min-h-[120px]"
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-on-primary)', borderColor: 'rgba(0,0,0,0.05)' }}
                 />
              </div>
            </motion.div>

            <div className="flex justify-end gap-6 pt-6">
               <Button variant="ghost" onClick={() => onNavigate(View.CATALOG)} style={{ color: '#475569' }}>Cancelar</Button>
               <Button
                variant="primary"
                className="px-16 cursor-pointer font-black"
                onClick={handleAddToCart}
                disabled={quantity <= 0 || availableVariants.length === 0}
                style={{
                  backgroundColor: 'var(--color-tertiary)',
                  color: 'var(--text-on-tertiary)'
                }}
              >
                Añadir al carrito
              </Button>
            </div>
          </div>
        </main>

        {/* Sidebar Summary */}
        <aside className="w-[380px] flex-shrink-0">
          <div className="rounded-2xl border p-10 sticky top-28 shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.05)' }}>
            <h4 className="text-[15px] font-black uppercase tracking-widest mb-8 pb-4 border-b-2" style={{ color: 'var(--text-on-secondary)', borderColor: 'rgba(0,0,0,0.1)' }}>
              Resumen
            </h4>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-[14px] shadow-sm" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--text-on-secondary)' }}>
                      {quantity}
                   </div>
                   <div>
                      <div className="text-[13px] font-black" style={{ color: 'var(--text-on-primary)' }}>{product?.name || 'Producto'}</div>
                      <div className="text-[11px] font-bold opacity-60" style={{ color: 'var(--text-on-primary)' }}>S/ {basePrice.toFixed(2)} c/u</div>
                   </div>
                </div>
                <div className="text-[14px] font-black" style={{ color: 'var(--text-on-primary)' }}>S/ {subtotal.toLocaleString()}</div>
              </div>

              <div className="flex justify-between items-center px-4 py-3 rounded-xl border text-[13px]" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--text-on-primary)' }}>
                  <ImageIcon size={16} />
                  Incremento por diseño ({store.designFeePercentage || '10%'})
                </div>
                <div className="text-[14px] font-black" style={{ color: 'var(--color-tertiary)' }}>
                  {designFeeAmount > 0 ? `+ S/ ${designFeeAmount.toLocaleString()}` : 'S/ 0.00'}
                </div>
              </div>

              {discountRate > 0 && (
                <div className="flex justify-between items-center px-4 py-3 rounded-xl border text-[13px]" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--text-on-secondary)' }}>
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Descuento vol. ({(discountRate * 100).toFixed(0)}%)
                  </div>
                  <div className="text-[14px] font-black text-emerald-500">- S/ {discountAmount.toLocaleString()}</div>
                </div>
              )}
            </div>

            <div className="space-y-6 pt-6 border-t-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
               <div className="flex justify-between items-end">
                  <div className="text-[14px] font-black uppercase tracking-widest opacity-60">Total</div>
                  <div className="text-right">
                     <div className="text-[32px] font-black leading-none mb-1 tracking-tighter" style={{ color: 'var(--text-on-secondary)' }}>S/ {total.toLocaleString()}</div>
                     <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Monto final sujeto a revisión</div>
                  </div>
               </div>
            </div>

             {!user && (
              <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="p-4 rounded-xl mb-6 flex items-start gap-3 text-left border" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--text-on-primary)' }}>
                  <Info size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] font-medium leading-relaxed">Debes tener una cuenta en **{store.name}** para poder enviar esta cotización. Por favor, inicia sesión o regístrate.</p>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  className="py-4 cursor-pointer font-black text-[13px]"
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                    color: 'var(--text-on-tertiary)'
                  }}
                  onClick={() => onNavigate(View.AUTH_LOGIN)}
                >
                   Ingresar ahora
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
