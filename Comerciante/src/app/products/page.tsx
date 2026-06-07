'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/lib/types';
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Edit3,
  Eye, EyeOff,
  Plus,
  Search,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function ProductsPage() {
  const router = useRouter();
  const { products, deleteProduct, updateProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState<'recent' | 'old' | 'more-stock' | 'less-stock'>('recent');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDetailId, setShowDetailId] = useState<string | null>(null);

  const selectedProduct = useMemo(() =>
    products.find(p => p.id === showDetailId),
    [products, showDetailId]
  );

  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter(p => p.status === 'Activo').length,
      drafts: products.filter(p => p.status === 'Borrador').length,
      outOfStock: products.filter(p => p.stock === 0).length,
      inactive: products.filter(p => p.status === 'Inactivo').length,
    };
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      if (!p) return false;
      const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'old':
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        break;
      case 'more-stock':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'less-stock':
        result.sort((a, b) => a.stock - b.stock);
        break;
    }
    return result;
  }, [products, searchTerm, statusFilter, sortBy]);

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      setDeleteId(null);
    }
  };

  const toggleStatus = (product: Product) => {
    const newStatus = product.status === 'Inactivo' ? 'Activo' : 'Inactivo';
    updateProduct(product.id, { status: newStatus });
  };

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInMins < 1) return 'Ahora mismo';
    if (diffInMins < 60) return `Hace ${diffInMins} min`;
    if (diffInHours < 24) return `Hace ${diffInHours} h`;
    if (diffInDays === 1) return 'Ayer';
    return `Hace ${diffInDays} d`;
  };

  return (
    <MerchantLayout title="Gestor de Productos" subtitle="Gestión de catálogo y stock en tiempo real">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold text-brand-camel uppercase tracking-[0.2em]">Inventario Central</p>
            <h1 className="text-[44px] font-[900] tracking-tighter leading-[0.9] text-brand-black">Inventario</h1>
            <p className="text-brand-text-muted text-[15px] font-medium max-w-lg leading-relaxed">
              Administra las prendas de tu tienda, controla el stock por variantes y configura tus precios.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="gap-2 h-12 px-6 rounded-2xl" onClick={() => router.push('/bulk-upload')}>
              <Upload size={18} /> Carga masiva
            </Button>
            <Button className="gap-2 h-12 px-6 rounded-2xl shadow-xl shadow-brand-black/10" onClick={() => router.push('/products/nuevo')}>
              <Plus size={22} /> Nuevo producto
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Totales', value: stats.total, color: 'bg-brand-black' },
            { label: 'Activos', value: stats.active, color: 'bg-green-500' },
            { label: 'Borradores', value: stats.drafts, color: 'bg-blue-500' },
            { label: 'Sin Stock', value: stats.outOfStock, color: 'bg-red-500' },
            { label: 'Inactivos', value: stats.inactive, color: 'bg-brand-neutral-dark' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl border border-brand-neutral-border p-6 shadow-sm transition-all hover:shadow-md cursor-default group">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2 h-2 rounded-full ${stat.color} ${stat.label !== 'Totales' ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-extrabold text-brand-text-muted uppercase tracking-widest">{stat.label}</span>
              </div>
              <h4 className="text-[32px] font-black leading-none tracking-tight group-hover:scale-105 transition-transform origin-left">
                {stat.value.toString().padStart(2, '0')}
              </h4>
            </div>
          ))}
        </div>

        <Card className="!p-0 border-brand-neutral-border shadow-xl rounded-[32px] overflow-hidden">
          <div className="px-8 py-6 border-b border-brand-neutral-border flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-brand-neutral-light/20">
            <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
              <div className="relative w-full md:max-w-md group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-black transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre de producto..."
                  className="w-full h-12 pl-12 pr-4 bg-white border border-brand-neutral-border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand-black/5 focus:border-brand-black transition-all"
                />
              </div>
              <div className="relative w-full md:w-64">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full h-12 pl-5 pr-10 bg-white border border-brand-neutral-border rounded-2xl text-[13px] font-extrabold cursor-pointer hover:bg-brand-neutral-light focus:outline-none focus:ring-4 focus:ring-brand-black/5"
                >
                  {['Todos', 'Activo', 'Sin stock', 'Borrador', 'Inactivo'].map((status) => (
                    <option key={status} value={status}>{status === 'Todos' ? 'Filtrar por Estado' : status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none flex items-center gap-2 pl-5 pr-10 py-3 bg-white border border-brand-neutral-border rounded-2xl text-[13px] font-extrabold cursor-pointer hover:bg-brand-neutral-light focus:outline-none focus:ring-4 focus:ring-brand-black/5"
              >
                <option value="recent">Ordenar por más reciente</option>
                <option value="old">Más antiguos</option>
                <option value="more-stock">Mayor stock</option>
                <option value="less-stock">Menor stock</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-muted" />
            </div>
          </div>

          <div className="min-h-[400px]">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-brand-neutral-light/40 border-b border-brand-neutral-border">
                      <th className="px-8 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Información del Producto</th>
                      <th className="px-8 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Precio</th>
                      <th className="px-8 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Inventario</th>
                      <th className="px-8 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Estado</th>
                      <th className="px-8 py-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Actividad</th>
                    </tr>
                  </thead>
                  <tbody key={`${statusFilter}-${searchTerm}-${sortBy}`} className="divide-y divide-brand-neutral-border">
                    {filteredAndSortedProducts.map((product, index) => {
                      if (!product) return null;
                      const productKey = product.id || `product-${index}`;
                      return (
                        <tr
                          key={productKey}
                          onClick={() => setShowDetailId(product.id || null)}
                          className="hover:bg-brand-neutral-light transition-colors group cursor-pointer relative"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl bg-brand-neutral-mid border border-brand-neutral-border overflow-hidden shrink-0 shadow-sm relative group-hover:scale-105 transition-transform">
                                {product.image || (product.images && product.images.length > 0) ? (
                                  <img src={product.image || product.images?.[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-brand-text-muted">
                                    <Plus size={20} opacity={0.3} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[15px] font-black text-brand-black leading-tight mb-1 truncate">{product.name}</h4>
                                <p className="text-[12px] font-medium text-brand-text-muted truncate max-w-[240px] leading-snug">
                                  {product.description || 'Sin descripción detallada'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-0.5">
                              <p className="text-[16px] font-black tracking-tight">S/ {product.price?.toFixed(2) || '0.00'}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className={`text-[15px] font-black ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : ''}`}>
                                  {product.stock}
                                </p>
                                {product.stock <= 5 && product.stock > 0 && (
                                  <Badge variant="danger" className="py-0 px-1 text-[8px]">Crítico</Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <Badge variant={
                              product.status === 'Activo' ? 'success' :
                              product.status === 'Sin stock' ? 'danger' :
                              product.status === 'Borrador' ? 'primary' : 'outline'
                            } className="font-black tracking-widest text-[10px] uppercase py-1.5 px-3 rounded-lg">
                              {product.status}
                            </Badge>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-[13px] font-bold text-brand-black leading-none">{formatRelativeDate(product.updatedAt)}</p>
                              </div>
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-1" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-brand-neutral-light rounded-full flex items-center justify-center mb-6 text-brand-text-muted">
                  <Search size={32} strokeWidth={1} />
                </div>
                <h3 className="text-[20px] font-black text-brand-black mb-2">No se encontraron productos</h3>
                <p className="text-brand-text-muted text-[14px] max-w-[280px]">Prueba ajustando tus términos de búsqueda o filtros de estado.</p>
                <Button variant="ghost" className="mt-6" onClick={() => { setSearchTerm(''); setStatusFilter('Todos'); }}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>

          <div className="px-8 py-8 border-t border-brand-neutral-border flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-neutral-light/10">
            <p className="text-[13px] font-bold text-brand-text-muted">
              Mostrando <span className="text-brand-black">{filteredAndSortedProducts.length}</span> de <span className="text-brand-black">{products.length}</span> productos
            </p>
            <div className="flex items-center gap-2">
              <button className="h-10 px-4 flex items-center justify-center rounded-xl hover:bg-brand-neutral-light border border-brand-neutral-border text-brand-text-muted font-bold text-[12px] transition-all">
                Anterior
              </button>
              <div className="flex items-center gap-1">
                {[1].map((page) => (
                  <button
                    key={page}
                    className="w-10 h-10 flex items-center justify-center rounded-xl font-black text-[12px] bg-brand-black text-white shadow-xl"
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="h-10 px-4 flex items-center justify-center rounded-xl hover:bg-brand-neutral-light border border-brand-neutral-border text-brand-text-muted font-bold text-[12px] transition-all">
                Siguiente
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in-95 duration-200">
            <div className="flex flex-col md:flex-row h-[500px]">
              <div className="w-full md:w-2/5 bg-brand-neutral-mid relative">
                {selectedProduct.image || (selectedProduct.images && selectedProduct.images.length > 0) ? (
                  <img src={selectedProduct.image || selectedProduct.images?.[0]?.url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-text-muted">
                    <Plus size={48} opacity={0.1} />
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <Badge variant={
                    selectedProduct.status === 'Activo' ? 'success' :
                    selectedProduct.status === 'Sin stock' ? 'danger' : 'outline'
                  } className="!px-4 !py-1 font-black text-[10px] uppercase shadow-lg">
                    {selectedProduct.status}
                  </Badge>
                </div>
              </div>
              <div className="w-full md:w-3/5 p-10 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-brand-camel uppercase tracking-[0.2em]">Ficha Técnica</p>
                      <h2 className="text-[32px] font-black tracking-tighter text-brand-black leading-[1.1]">{selectedProduct.name}</h2>
                    </div>
                    <button
                      onClick={() => setShowDetailId(null)}
                      className="w-10 h-10 rounded-full border border-brand-neutral-border flex items-center justify-center hover:bg-brand-neutral-light transition-all shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-brand-text-muted uppercase">Precio Lista</p>
                        <p className="text-[24px] font-black text-brand-black">S/ {selectedProduct.price.toFixed(2)}</p>
                      </div>
                      <div className="w-px h-10 bg-brand-neutral-border" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-brand-text-muted uppercase">Stock Actual</p>
                        <p className="text-[24px] font-black text-brand-black">{selectedProduct.stock} uds</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Descripción</p>
                      <p className="text-[14px] font-medium text-brand-text-muted leading-relaxed line-clamp-3">
                        {selectedProduct.description || 'Este producto aún no cuenta con una descripción detallada en el sistema.'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-6 border-t border-brand-neutral-border">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => { router.push(`/products/nuevo?edit=${selectedProduct.id}`); setShowDetailId(null); }}
                      className="flex-1 h-14 !rounded-2xl font-black gap-2"
                    >
                      <Edit3 size={18} /> Editar Producto
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { toggleStatus(selectedProduct); }}
                      className="flex-1 h-14 !rounded-2xl font-black gap-2"
                    >
                      {selectedProduct.status === 'Inactivo' ? <Eye size={18} /> : <EyeOff size={18} />}
                      {selectedProduct.status === 'Inactivo' ? 'Activar' : 'Desactivar'}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => { setDeleteId(selectedProduct.id); setShowDetailId(null); }}
                    className="h-12 !rounded-xl font-bold text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} className="mr-2" /> Eliminar permanentemente
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <Card className="w-full max-w-md !rounded-[40px] shadow-2xl relative overflow-hidden border-none animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="p-10 space-y-8 text-center relative z-10">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-[28px] font-black text-brand-black leading-tight tracking-tighter">¿Eliminar producto?</h3>
                <p className="text-[15px] font-medium text-brand-text-muted leading-relaxed">
                  Esta acción es irreversible y eliminará el producto del catálogo y todos sus reportes históricos.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleDelete}
                  className="h-14 font-extrabold !bg-red-600 hover:!bg-red-700 !text-white rounded-2xl w-full text-[15px] shadow-xl shadow-red-200"
                >
                  Sí, eliminar definitivamente
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setDeleteId(null)}
                  className="h-14 font-extrabold text-brand-text-muted rounded-2xl w-full text-[15px]"
                >
                  No, mantener producto
                </Button>
              </div>
            </div>
            <button
              onClick={() => setDeleteId(null)}
              className="absolute top-6 right-6 text-brand-text-muted hover:text-brand-black transition-colors"
            >
              <X size={24} />
            </button>
          </Card>
        </div>
      )}
    </MerchantLayout>
  );
}