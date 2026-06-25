'use client';

import { MerchantLayout } from '@/domains/comerciante/components/MerchantLayout';
import { Badge, Button, Card, Input } from '@/domains/comerciante/components/ui';
import { useStore } from '@/domains/comerciante/context/StoreContext';
import { merchantApi, merchantSession } from '@/domains/comerciante/lib/api';
import { Product } from '@/domains/comerciante/lib/types';
import { messageFromError } from '@/domains/shared/errors';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Layers,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

const COLORS = ['Blanco', 'Negro', 'Rojo', 'Azul', 'Verde'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
type ProductImageDraft = { name: string; url: string; file?: File };

const sanitizeMoney = (value: string) => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const [integerPart, ...decimalParts] = cleaned.split('.');
  const decimals = decimalParts.join('').slice(0, 2);
  return decimalParts.length > 0 ? `${integerPart}.${decimals}` : integerPart;
};

const isAllowedImage = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const validExtension = IMAGE_EXTENSIONS.includes(extension);
  const validMime = file.type === '' || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  return validExtension && validMime;
};

function ProductFormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { products, addProduct, updateProduct, store, isLoading, apiError } = useStore();
  const isInitialized = useRef<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    status: Product['status'];
    inventoryBlocks: Array<{
      talla: string;
      stock: Record<string, number>;
    }>;
    images: ProductImageDraft[];
  }>({
    name: '',
    description: '',
    price: '',
    status: 'Borrador',
    inventoryBlocks: [
      {
        talla: '',
        stock: { 'Blanco': 0, 'Negro': 0, 'Rojo': 0, 'Azul': 0, 'Verde': 0 }
      }
    ],
    images: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  // Cargar datos si es edición
  useEffect(() => {
    if (isInitialized.current === (editId || 'new')) return;

    if (editId) {
      const product = products.find(p => p.id === editId);
      if (product) {
        const inventoryBlocks = (product.sizes || []).map(size => {
          const stock: Record<string, number> = {};
          COLORS.forEach(color => {
            stock[color] = product.sizeColorStock?.[size]?.[color] || 0;
          });
          return { talla: size, stock };
        });

        setFormData({
          name: product.name,
          description: product.description,
          price: (product.price || 0).toString(),
          status: product.status,
          inventoryBlocks: inventoryBlocks.length > 0 ? inventoryBlocks : [
            { talla: '', stock: { 'Blanco': 0, 'Negro': 0, 'Rojo': 0, 'Azul': 0, 'Verde': 0 } }
          ],
          images: product.images || (product.image ? [{ name: 'imagen-principal', url: product.image }] : []),
        });
        isInitialized.current = editId;
      }
    } else {
      isInitialized.current = 'new';
    }
  }, [editId, products]);

  const totalStock = useMemo(() => {
    return formData.inventoryBlocks.reduce((acc: number, block) => {
      const blockStock = Object.values(block.stock).reduce((cAcc: number, q: number) => cAcc + (Number(q) || 0), 0) as number;
      return acc + blockStock;
    }, 0);
  }, [formData.inventoryBlocks]);

  const validation = useMemo(() => {
    const hasValidSize = formData.inventoryBlocks.some(block => block.talla.trim().length > 0);
    return {
      nameDesc: formData.name.length > 0 && formData.description.length > 0,
      prices: parseFloat(formData.price) > 0,
      stock: hasValidSize && totalStock > 0,
    };
  }, [formData, totalStock]);

  const canBeActive = Object.values(validation).every(Boolean);

  const previewSizes = useMemo(() => {
    return formData.inventoryBlocks
      .filter(block => {
        const sizeQty = Object.values(block.stock).reduce<number>((acc, q) => acc + (Number(q) || 0), 0);
        return block.talla.trim().length > 0 && sizeQty > 0;
      })
      .map(block => block.talla);
  }, [formData.inventoryBlocks]);

  const getInitials = (name: string) => {
    if (!name) return 'S47';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 3);
  };

  const handleSave = async (asDraft = false) => {
    if (isSavingRef.current) return;
    if (!asDraft) {
      if (!formData.name || !formData.description || !formData.price || parseFloat(formData.price) <= 0) {
        setErrors({
          name: !formData.name ? 'El nombre es obligatorio' : '',
          description: !formData.description ? 'La descripción es obligatoria' : '',
          price: !formData.price ? 'El precio es obligatorio' : parseFloat(formData.price) <= 0 ? 'El precio debe ser mayor a 0' : ''
        });
        return;
      }

      const tallyNames = formData.inventoryBlocks.map(b => b.talla.trim());
      if (tallyNames.some(name => name === '')) {
        setErrors({ inventory: 'Todas las tallas deben tener un nombre' });
        return;
      }

      const lowerTallyNames = tallyNames.map(n => n.toLowerCase());
      if (new Set(lowerTallyNames).size !== lowerTallyNames.length) {
        setErrors({ inventory: 'No se permiten tallas duplicadas' });
        return;
      }
    }

    const sizeColorStock: Record<string, Record<string, number>> = {};
    const sizes: string[] = [];

    formData.inventoryBlocks.forEach(block => {
      const name = block.talla.trim();
      if (name) {
        sizes.push(name);
        sizeColorStock[name] = block.stock;
      }
    });

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      const uploadedImages = merchantSession.getToken()
        ? await Promise.all(formData.images.map(async image => {
          if (!image.file) return { name: image.name, url: image.url };
          const result = await merchantApi.uploadProductImage(image.file, store.id);
          return { name: image.name, url: result.imageUrl };
        }))
        : formData.images.map(image => ({ name: image.name, url: image.url }));

      const payload: Omit<Product, 'id'> = {
        name: formData.name || 'Sin nombre',
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        stock: totalStock,
        sizeColorStock,
        sizeStock: Object.entries(sizeColorStock).reduce((acc, [size, colors]) => ({
          ...acc,
          [size]: Object.values(colors).reduce((s, q) => s + q, 0)
        }), {}),
        status: asDraft ? 'Borrador' : (canBeActive ? 'Activo' : 'Borrador'),
        variants: sizes.length * COLORS.length,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Admin',
        sizes: sizes,
        image: uploadedImages[0]?.url || '',
        images: uploadedImages,
      };

      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await addProduct(payload);
      }
      router.push('/comerciante/products');
    } catch (error) {
      setErrors({ form: messageFromError(error, 'No se pudo guardar el producto') });
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  const updateTallaName = (index: number, name: string) => {
    const filteredName = name.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '');
    const newBlocks = [...formData.inventoryBlocks];
    newBlocks[index].talla = filteredName;
    setFormData({ ...formData, inventoryBlocks: newBlocks });
    if (errors.inventory) setErrors({ ...errors, inventory: '' });
  };

  const updateColorStock = (blockIndex: number, color: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    const newBlocks = [...formData.inventoryBlocks];
    newBlocks[blockIndex].stock = {
      ...newBlocks[blockIndex].stock,
      [color]: num
    };
    setFormData({ ...formData, inventoryBlocks: newBlocks });
  };

  const addTallaBlock = () => {
    setFormData({
      ...formData,
      inventoryBlocks: [
        ...formData.inventoryBlocks,
        { talla: '', stock: { 'Blanco': 0, 'Negro': 0, 'Rojo': 0, 'Azul': 0, 'Verde': 0 } }
      ]
    });
  };

  const removeTallaBlock = (index: number) => {
    if (formData.inventoryBlocks.length <= 1) return;
    const newBlocks = formData.inventoryBlocks.filter((_, i) => i !== index);
    setFormData({ ...formData, inventoryBlocks: newBlocks });
  };

  const isWaitingForProduct = Boolean(editId) && isLoading && !products.some(p => p.id === editId);
  const editProductNotFound = Boolean(editId) && !isLoading && !products.some(p => p.id === editId);

  if (isWaitingForProduct) {
    return (
      <MerchantLayout title="Editar producto" subtitle="Cargando información del catálogo">
        <div className="grid gap-6 animate-pulse">
          <div className="h-12 w-80 rounded-2xl bg-brand-neutral-mid" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-80 rounded-[2rem] bg-white border border-brand-neutral-border" />
              <div className="h-64 rounded-[2rem] bg-white border border-brand-neutral-border" />
            </div>
            <div className="lg:col-span-4 h-96 rounded-[2rem] bg-white border border-brand-neutral-border" />
          </div>
        </div>
      </MerchantLayout>
    );
  }

  if (editProductNotFound) {
    return (
      <MerchantLayout title="Editar producto" subtitle="Producto no encontrado">
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <AlertCircle size={36} className="text-red-500" />
            <h2 className="text-[24px] font-black text-brand-black">No se encontró el producto</h2>
            <p className="text-[14px] font-bold text-brand-text-muted">Vuelve al catálogo y selecciona un producto existente.</p>
            <Button onClick={() => router.push('/comerciante/products')}>Volver al catálogo</Button>
          </div>
        </Card>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout title={editId ? "Editar producto" : "Crear producto"} subtitle={`Gestión de inventario › ${formData.name || 'Nueva prenda'}`}>
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-[13px] font-bold">
          {apiError}
        </div>
      )}
      <div className="flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[11px] font-extrabold text-brand-text-muted hover:text-brand-black transition-all group uppercase tracking-[0.2em] leading-none">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver
            </button>
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">
              {editId ? 'Editar' : 'Crear'} Producto
            </h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="h-12 px-8 font-extrabold" onClick={() => handleSave(true)} disabled={isSaving}>
              <Save size={18} className="mr-2" /> {isSaving ? 'Guardando...' : 'Guardar como borrador'}
            </Button>
            <Button className="gap-2 h-12 px-10 font-extrabold shadow-xl shadow-brand-black/20" onClick={() => handleSave(false)} disabled={isSaving}>
              <Check size={20} /> {isSaving ? 'Guardando...' : `${editId ? 'Actualizar' : 'Publicar'} catálogo`}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <Card title="Información Básica" subtitle="01 · IDENTIDAD" headerAction={<Badge variant={formData.status === 'Activo' ? 'success' : 'primary'}>{formData.status}</Badge>}>
              <div className="space-y-8 py-2">
                {errors.form && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-[13px] font-bold">
                    <AlertCircle size={18} /> {errors.form}
                  </div>
                )}
                <Input
                  label="Nombre del producto *"
                  placeholder="Ej: Polo Oversized Premium Onyx"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  error={errors.name}
                />
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-brand-black uppercase tracking-widest">Descripción del producto</label>
                  <textarea
                    rows={4}
                    placeholder="Describe fit, sensación, detalles técnicos..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: '' });
                    }}
                    className={`w-full bg-white border rounded-2xl px-5 py-4 text-[14px] font-medium outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all min-h-[140px] resize-none ${
                      errors.description ? 'border-red-500' : 'border-brand-neutral-border'
                    }`}
                  />
                  {errors.description && <p className="text-[11px] font-bold text-red-500">{errors.description}</p>}
                </div>
              </div>
            </Card>

            <Card title="Inventario por Talla y Color" subtitle="02 · STOCK DETALLADO">
              <div className="space-y-12 py-2">
                {errors.inventory && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-[13px] font-bold">
                    <AlertCircle size={18} /> {errors.inventory}
                  </div>
                )}

                {formData.inventoryBlocks.map((block, index) => (
                  <div key={index} className="space-y-6 relative p-6 bg-white border border-brand-neutral-border rounded-[2rem] card-shadow">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                      <div className="md:w-1/3">
                        <Input
                          label="Talla"
                          placeholder="Ej: S, 30, Única..."
                          value={block.talla}
                          onChange={(e) => updateTallaName(index, e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                          {COLORS.map(color => (
                            <div key={color} className="space-y-1.5">
                              <label className="text-[10px] font-extrabold text-brand-text-muted uppercase tracking-wider">{color}</label>
                              <input
                                type="text"
                                placeholder="0"
                                value={block.stock[color]?.toString() || '0'}
                                onChange={(e) => updateColorStock(index, color, e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-full h-11 bg-brand-neutral-light border border-brand-neutral-border rounded-xl px-4 text-[13px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {formData.inventoryBlocks.length > 1 && (
                        <button
                          onClick={() => removeTallaBlock(index)}
                          className="md:mb-1 p-2 text-brand-text-muted hover:text-red-500 transition-colors"
                          title="Eliminar talla"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  className="w-full h-14 border-2 border-dashed border-brand-neutral-border hover:border-brand-black hover:bg-white rounded-2xl font-black text-[13px] uppercase tracking-widest gap-2"
                  onClick={addTallaBlock}
                >
                  <Plus size={18} /> Agregar talla
                </Button>

                <div className="pt-6 border-t border-dashed border-brand-neutral-border">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-black text-brand-black uppercase tracking-widest">Total Stock Global</label>
                    <div className="h-14 px-8 flex items-center justify-center rounded-2xl font-black text-[20px] bg-brand-black text-white shadow-xl shadow-brand-black/20">
                      {totalStock} <span className="text-white/40 ml-2 text-[12px] font-bold">UNIDADES</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Precio" subtitle="03 · ECONOMÍA">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end py-2">
                <Input
                  label="Precio Venta (S/)*"
                  placeholder="89.00"
                  value={formData.price}
                  inputMode="decimal"
                  onChange={(e) => {
                    setFormData({ ...formData, price: sanitizeMoney(e.target.value) });
                    if (errors.price) setErrors({ ...errors, price: '' });
                  }}
                  error={errors.price}
                />
              </div>
            </Card>

            <Card title="Imágenes del producto" subtitle="04 · VISUAL · HASTA 5 IMÁGENES">
              <div className="py-2 space-y-6">
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-2xl border-2 border-brand-neutral-border bg-brand-neutral-light relative overflow-hidden group">
                        <img
                          src={img.url}
                          alt={img.name || `Product ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-xl h-8 px-3 text-[10px]"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }))}
                          >
                            <Trash2 size={12} className="mr-1.5" /> Eliminar
                          </Button>
                        </div>
                        <Badge variant="black" className="absolute top-2 left-2 !text-[9px] h-4 px-1.5 opacity-70">#{idx + 1}</Badge>
                      </div>
                    ))}

                    {formData.images.length < 5 && (
                      <div className="aspect-square rounded-2xl border-2 border-dashed border-brand-neutral-border bg-brand-neutral-light flex flex-col items-center justify-center relative overflow-hidden group hover:bg-brand-neutral-mid transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-brand-neutral-border/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Plus size={20} className="text-brand-text-muted" />
                        </div>
                        <p className="text-[9px] font-black text-brand-text-muted uppercase tracking-widest text-center px-2">Subir imagen</p>
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!isAllowedImage(file)) {
                                setErrors(prev => ({ ...prev, imageUpload: 'Solo se permiten imagenes JPG, PNG o WEBP' }));
                                e.target.value = '';
                                return;
                              }
                              if (file.size > 2 * 1024 * 1024) {
                                setErrors(prev => ({ ...prev, imageUpload: 'Máximo 2MB por imagen' }));
                                e.target.value = '';
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({
                                  ...prev,
                                  images: [...prev.images, { name: file.name, url: reader.result as string, file }].slice(0, 5)
                                }));
                                setErrors(prev => ({ ...prev, imageUpload: '' }));
                              };
                              reader.readAsDataURL(file);
                            }
                            e.target.value = '';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {errors.imageUpload && (
                    <div className="flex items-center gap-2 text-red-500 text-[12px] font-bold">
                      <AlertCircle size={14} /> {errors.imageUpload}
                    </div>
                  )}

                  <div className="flex-1 space-y-4 pt-4 border-t border-brand-neutral-border border-dashed">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-[13px] font-black text-brand-black uppercase tracking-tight">Requisitos y Guía de estilo</h4>
                        <p className="text-[11px] text-brand-text-muted font-bold">Sube hasta 5 imágenes (PNG, JPG). Recomendado 1000x1000px. Máx 2MB por archivo.</p>
                      </div>
                      <Badge variant="outline" className="h-7 !px-4 self-start md:self-auto font-black border-brand-black">
                        {formData.images.length} / 5 IMÁGENES
                      </Badge>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      {[
                        'Fondo neutro o minimalista',
                        'Producto centrado y bien iluminado',
                        'Mínimo 800px de resolución',
                        'Formatos aceptados: JPG, PNG, WEBP'
                      ].map(tip => (
                        <li key={tip} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-brand-text-muted" />
                          <span className="text-[11px] font-bold text-brand-black/70">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            <Card title="Vista Previa en Tienda">
              <div className="bg-brand-neutral-light rounded-[28px] border border-brand-neutral-border overflow-hidden shadow-xl">
                <div className="bg-white p-3 border-b border-brand-neutral-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-[8px] font-bold">{getInitials(store.name)}</div>
                    <span className="text-[11px] font-extrabold">{store.name}</span>
                  </div>
                </div>

                <div className="p-3">
                  <div className="bg-white rounded-2xl border border-brand-neutral-border overflow-hidden group">
                    <div className="aspect-[4/3] bg-zinc-100 relative flex items-center justify-center overflow-hidden">
                      <div className="absolute top-2 left-2 z-10">
                        <Badge variant="black" className="bg-white text-black h-5 px-3 font-black text-[9px]">NEW</Badge>
                      </div>

                      {formData.images[0]?.url ? (
                        <img
                          src={formData.images[0].url}
                          alt="Product preview"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                          <Layers size={42} strokeWidth={0.5} className="text-black" />
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-brand-black text-[15px] font-black tracking-tight leading-none mb-1 truncate">{formData.name || 'Nombre del Ítem'}</h3>
                          <p className="text-brand-text-muted text-[10px] font-bold uppercase tracking-widest line-clamp-1">{formData.description || 'Sin descripción'}</p>
                        </div>
                        <div className="text-brand-black font-black text-[14px] tracking-tighter">
                          S/ {formData.price || '0.00'}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {previewSizes.length > 0 ? (
                            previewSizes.map(s => (
                              <span key={s} className="text-[10px] font-black text-brand-black px-2 py-1 rounded-lg border border-brand-neutral-border bg-brand-neutral-light">{s}</span>
                            ))
                          ) : (
                            <p className="text-[10px] text-brand-text-muted font-bold italic">Selecciona tallas con stock</p>
                          )}
                        </div>

                        <Button
                          className="w-full h-9 text-[11px] font-black rounded-xl"
                          style={{ backgroundColor: store.colors?.primary || '#000000' }}
                        >
                          Agregar al Carrito
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Estado de Publicación" subtitle="REQUISITOS">
              <div className="space-y-4 pt-1">
                {[
                  { l: 'Nombre y descripción completa', ok: validation.nameDesc },
                  { l: 'Precio definido', ok: validation.prices },
                  { l: 'Stock inicial definido', ok: validation.stock },
                ].map(item => (
                  <div key={item.l} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${item.ok ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-brand-neutral-border'}`}></div>
                      <span className={`text-[13px] font-bold ${item.ok ? 'text-brand-black' : 'text-brand-text-muted'}`}>{item.l}</span>
                    </div>
                    {item.ok && <Check size={14} className="text-green-500" strokeWidth={4} />}
                  </div>
                ))}
                <div className="pt-4 border-t border-brand-neutral-border space-y-3">
                  <Button variant="ghost" className="w-full h-11 font-extrabold" onClick={() => handleSave(true)} disabled={isSaving}>
                    <Save size={16} className="mr-2" /> {isSaving ? 'Guardando...' : 'Guardar borrador'}
                  </Button>
                  <Button className="w-full gap-2 h-12 font-extrabold shadow-xl shadow-brand-black/20" onClick={() => handleSave(false)} disabled={isSaving}>
                    <Check size={18} /> {isSaving ? 'Guardando...' : `${editId ? 'Actualizar' : 'Publicar'} catálogo`}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}

export default function ProductFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-neutral-light p-10 text-[13px] font-black uppercase tracking-widest text-brand-text-muted">Cargando formulario...</div>}>
      <ProductFormPageContent />
    </Suspense>
  );
}
