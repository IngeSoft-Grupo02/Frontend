'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge } from '../UI';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  Store,
  ImageIcon,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadBlock {
  key: 'merchants' | 'stores' | 'images';
  label: string;
  description: string;
  icon: React.ElementType;
  accept: string;
  templateName: string;
  templateContent: string;
}

interface Incidence {
  block: string;
  row: number | string;
  code: string;
  type: 'ERROR' | 'WARNING';
  detail: string;
  origin: string;
}

interface BlockState {
  file: File | null;
  status: 'pending' | 'valid' | 'error';
}

const BLOCKS: UploadBlock[] = [
  {
    key: 'merchants',
    label: 'Comerciantes',
    description: 'Crea cuentas nuevas. Incluye código, nombres, correo, DNI y teléfono.',
    icon: Users,
    accept: '.xlsx,.xls,.csv',
    templateName: 'plantilla_comerciantes.csv',
    templateContent: 'codigo,nombres,correo,dni,telefono\nCOM001,Juan Pérez,juan@email.com,12345678,987654321',
  },
  {
    key: 'stores',
    label: 'Tiendas',
    description: 'Crea tiendas nuevas. Usa codigo_comerciante_referencia. Puede apuntar a archivo actual o a BD.',
    icon: Store,
    accept: '.xlsx,.xls,.csv',
    templateName: 'plantilla_tiendas.csv',
    templateContent: 'nombre,codigo_comerciante,estado,paleta\nMi Tienda,COM001,Activa,CORESTREET',
  },
  {
    key: 'images',
    label: 'ZIP de imágenes',
    description: 'Se usa si el Excel declara imágenes. Máximo 5 imágenes por variante. La primera será principal.',
    icon: ImageIcon,
    accept: '.zip',
    templateName: 'instrucciones_imagenes.txt',
    templateContent: 'Estructura del ZIP:\n/imagenes/[codigo_producto]/[1-5].jpg',
  },
];

const MAX_SIZE_MB = 10;

export function CargaMasivaScreen() {
  const router = useRouter();
  const fileRefs = {
    merchants: useRef<HTMLInputElement>(null),
    stores: useRef<HTMLInputElement>(null),
    images: useRef<HTMLInputElement>(null),
  };

  const [blocks, setBlocks] = useState<Record<string, BlockState>>({
    merchants: { file: null, status: 'pending' },
    stores: { file: null, status: 'pending' },
    images: { file: null, status: 'pending' },
  });

  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [resolvedRefs, setResolvedRefs] = useState<{ label: string; count: number }[]>([]);

  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleFileSelect = (key: string, file: File | null) => {
    if (!file) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`El archivo excede el límite de ${MAX_SIZE_MB}MB`);
      return;
    }
    setBlocks(prev => ({ ...prev, [key]: { file, status: 'pending' } }));
    setExecuted(false);
    setIncidences([]);
    setResolvedRefs([]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, key: string) => {
    e.preventDefault();
    setDragOver(null);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(key, f);
  };

  const downloadTemplate = (block: UploadBlock) => {
    const blob = new Blob([block.templateContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = block.templateName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExecute = () => {
    const hasAny = Object.values(blocks).some(b => b.file !== null);
    if (!hasAny) return;

    setExecuting(true);

    // 🔌 TODO: reemplazar por llamada real
    // const fd = new FormData();
    // if (blocks.merchants.file) fd.append('merchants', blocks.merchants.file);
    // if (blocks.stores.file)   fd.append('stores',    blocks.stores.file);
    // if (blocks.images.file)   fd.append('images',    blocks.images.file);
    // const res = await fetch('/api/bulk-upload', { method: 'POST', body: fd });

    setTimeout(() => {
      // Simular resultado
      const mockIncidences: Incidence[] = blocks.merchants.file
        ? [
            {
              block: 'Comerciantes',
              row: 3,
              code: 'VAL_EMAIL',
              type: 'ERROR',
              detail: 'Formato de correo inválido',
              origin: blocks.merchants.file.name,
            },
          ]
        : [];

      const mockResolved = [];
      if (blocks.merchants.file) mockResolved.push({ label: 'Comerciantes procesados', count: 4 });
      if (blocks.stores.file)    mockResolved.push({ label: 'Tiendas procesadas', count: 2 });
      if (blocks.images.file)    mockResolved.push({ label: 'Imágenes procesadas', count: 12 });

      // Actualizar estados de bloques
      setBlocks(prev => {
        const next = { ...prev };
        if (next.merchants.file) next.merchants = { ...next.merchants, status: mockIncidences.length > 0 ? 'error' : 'valid' };
        if (next.stores.file)    next.stores    = { ...next.stores,    status: 'valid' };
        if (next.images.file)    next.images    = { ...next.images,    status: 'valid' };
        return next;
      });

      setIncidences(mockIncidences);
      setResolvedRefs(mockResolved);
      setExecuting(false);
      setExecuted(true);
    }, 1800);
  };

  const merchantCount = blocks.merchants.file ? (executed ? (incidences.some(i => i.block === 'Comerciantes') ? '!' : '✓') : '—') : '—';
  const storeCount    = blocks.stores.file    ? (executed ? '✓' : '—') : '—';
  const imageCount    = blocks.images.file    ? (executed ? 12 : 0) : 0;
  const errorCount    = executed ? incidences.length : 0;

  const canExecute = Object.values(blocks).some(b => b.file !== null) && !executing;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">
            Carga masiva
          </h2>
          <p className="text-[14px] font-medium text-neutral-400">
            Sube uno o varios archivos en una misma operación.
          </p>
        </div>
        <Button
          onClick={handleExecute}
          disabled={!canExecute}
          className="rounded-xl h-12 px-8 flex items-center gap-2 shrink-0"
        >
          {executing
            ? <><Loader2 size={16} className="animate-spin" /> Ejecutando...</>
            : <><Play size={16} /> Ejecutar carga</>
          }
        </Button>
      </div>

      {/* 3 bloques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOCKS.map((block) => {
          const state = blocks[block.key];
          const Icon = block.icon;
          const isDrag = dragOver === block.key;

          return (
            <Card
              key={block.key}
              className={`p-6 flex flex-col gap-4 transition-all border-2 ${
                isDrag ? 'border-brand-camel bg-brand-camel/5' : 'border-neutral-100'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(block.key); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, block.key)}
            >
              {/* Título + icono */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[18px] font-display font-extrabold text-brand-black">
                    {block.label}
                  </h3>
                  <p className="text-[12px] text-neutral-400 mt-1 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                <Icon size={20} className="text-neutral-300 shrink-0 mt-1" />
              </div>

              {/* Estado del archivo */}
              <div>
                {state.file ? (
                  <div className="flex items-center gap-2">
                    {state.status === 'valid' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle2 size={10} /> {state.file.name}
                      </span>
                    )}
                    {state.status === 'error' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertCircle size={10} /> {state.file.name}
                      </span>
                    )}
                    {state.status === 'pending' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-500">
                        {state.file.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-400">
                    SIN ARCHIVO
                  </span>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => downloadTemplate(block)}
                  className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 bg-white text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Descargar plantilla
                </button>
                <input
                  type="file"
                  ref={fileRefs[block.key as keyof typeof fileRefs]}
                  className="hidden"
                  accept={block.accept}
                  onChange={(e) => handleFileSelect(block.key, e.target.files?.[0] || null)}
                />
                <button
                  onClick={() => fileRefs[block.key as keyof typeof fileRefs].current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-beige text-[13px] font-bold text-brand-black hover:bg-brand-camel/20 transition-colors"
                >
                  Seleccionar archivo
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 4 métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'COMERCIANTES', value: merchantCount, status: executed && blocks.merchants.file ? (incidences.some(i => i.block === 'Comerciantes') ? 'error' : 'ok') : 'pending' },
          { label: 'TIENDAS',      value: storeCount,    status: executed && blocks.stores.file ? 'ok' : 'pending' },
          { label: 'IMÁGENES',     value: imageCount,    status: executed && blocks.images.file ? 'ok' : 'pending' },
          { label: 'ERRORES',      value: errorCount,    status: errorCount > 0 ? 'error' : 'pending' },
        ].map((m) => (
          <Card key={m.label} className="p-5">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">{m.label}</p>
            <p className="text-[32px] font-extrabold text-brand-black leading-none mb-3">{m.value}</p>
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              m.status === 'ok'      ? 'bg-green-100 text-green-700' :
              m.status === 'error'   ? 'bg-red-100 text-red-700' :
                                       'bg-neutral-100 text-neutral-500'
            }`}>
              {m.status === 'ok' ? 'COMPLETADO' : m.status === 'error' ? 'CON ERRORES' : 'PENDIENTE'}
            </span>
          </Card>
        ))}
      </div>

      {/* Referencias resueltas */}
      <div className="space-y-3">
        <h3 className="text-[20px] font-display font-extrabold text-brand-black">Referencias resueltas</h3>
        {resolvedRefs.length === 0 ? (
          <p className="text-[14px] text-neutral-400">Aún no se han validado referencias.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {resolvedRefs.map((r, i) => (
              <Card key={i} className="p-5 flex items-center justify-between">
                <p className="text-[14px] font-bold text-neutral-700">{r.label}</p>
                <span className="text-[24px] font-extrabold text-brand-black">{r.count}</span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Incidencias detectadas */}
      <div className="space-y-3">
        <h3 className="text-[20px] font-display font-extrabold text-brand-black">Incidencias detectadas</h3>
        <Card className="px-0 py-2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-[#f1ede4]">
                <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Bloque</th>
                  <th className="py-4 px-4">Fila</th>
                  <th className="py-4 px-4">Código</th>
                  <th className="py-4 px-4">Tipo</th>
                  <th className="py-4 px-4">Detalle</th>
                  <th className="py-4 px-6">Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {incidences.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-400 font-medium italic text-[14px]">
                      {executed ? 'Sin incidencias detectadas.' : 'Todavía no se ejecutó validación'}
                    </td>
                  </tr>
                ) : (
                  incidences.map((inc, i) => (
                    <tr key={i} className="text-[13px] hover:bg-neutral-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-neutral-900">{inc.block}</td>
                      <td className="py-4 px-4 font-mono text-[12px] text-neutral-500">{inc.row}</td>
                      <td className="py-4 px-4 font-mono text-[12px] text-neutral-600">{inc.code}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inc.type === 'ERROR' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {inc.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-neutral-600">{inc.detail}</td>
                      <td className="py-4 px-6 font-mono text-[11px] text-neutral-400">{inc.origin}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
