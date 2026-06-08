'use client';

import { MerchantLayout } from '@/components/MerchantLayout';
import { Badge, Button, Card } from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import JSZip from 'jszip';
import {
    AlertCircle,
    AlertTriangle,
    Archive,
    CheckCircle2,
    ChevronRight,
    Download,
    FileSpreadsheet,
    FileText,
    Loader2,
    RefreshCcw,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';

const StepIndicator = ({ number, title, subtitle, active, completed }: { number: string; title: string; subtitle: string; active: boolean; completed: boolean }) => (
  <div className={`flex items-center gap-4 transition-all ${active ? 'opacity-100 scale-105' : 'opacity-40'}`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[18px] font-extrabold border-2 ${
      active ? 'bg-brand-black text-white border-brand-black' : 
      completed ? 'bg-green-500 text-white border-green-500' : 'bg-transparent border-brand-neutral-border text-brand-text-muted'
    }`}>
      {completed ? <CheckCircle2 size={24} /> : number}
    </div>
    <div>
      <h4 className="text-[14px] font-extrabold text-brand-black leading-none mb-1">{title}</h4>
      <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-tight">{subtitle}</p>
    </div>
  </div>
);

interface ValidationResult {
  label: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  details?: string;
}

export default function BulkUploadPage() {
  const router = useRouter();
  const { bulkUploadProducts } = useStore();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const [csvFile, setCsvFile] = useState<{
    file: File;
    name: string;
    size: string;
    date: string;
    items: number;
    variants: number;
    data: any[];
    referencesImages: boolean;
    referencedImageNames: Set<string>;
  } | null>(null);

  const [zipFile, setZipFile] = useState<{
    file: File;
    name: string;
    size: string;
    entries: string[];
  } | null>(null);

  const [csvStatus, setCsvStatus] = useState<'idle' | 'error' | 'valid'>('idle');
  const [zipStatus, setZipStatus] = useState<'idle' | 'error' | 'valid'>('idle');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [zipErrors, setZipErrors] = useState<string[]>([]);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [isProcessingZip, setIsProcessingZip] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map(h => h.trim().toUpperCase());
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] ? values[i].trim() : '';
      });
      return obj;
    });
    return { headers, rows };
  };

  const isCsvFile = (file: File) => file.name.toLowerCase().endsWith('.csv');
  const isZipFile = (file: File) => file.name.toLowerCase().endsWith('.zip');

  const handleCsvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isCsvFile(file)) {
      setCsvErrors(['Solo se permiten archivos .csv para productos.']);
      setCsvStatus('error');
      setCsvFile(null);
      if (csvInputRef.current) csvInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCsvErrors(['El archivo CSV no debe exceder los 10MB.']);
      setCsvStatus('error');
      setCsvFile(null);
      if (csvInputRef.current) csvInputRef.current.value = '';
      return;
    }

    setIsProcessingCsv(true);
    setCsvErrors([]);

    try {
      const text = await file.text();
      const { headers, rows } = parseCsv(text);

      const requiredHeaders = ['NOMBRE', 'DESCRIPCION', 'TALLA', 'COLOR', 'STOCK', 'IMAGENES'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        setCsvErrors([`Faltan columnas obligatorias: ${missingHeaders.join(', ')}`]);
        setCsvStatus('error');
        setCsvFile(null);
        return;
      }

      let errors: string[] = [];
      let referencedImageNames = new Set<string>();
      let referencesImages = false;
      let productNames = new Set<string>();

      rows.forEach((row, idx) => {
        const rowNum = idx + 2;
        if (!row.NOMBRE) errors.push(`Fila ${rowNum}: El NOMBRE no puede estar vacío.`);
        if (!row.DESCRIPCION) errors.push(`Fila ${rowNum}: La DESCRIPCION no puede estar vacía.`);
        if (!row.TALLA) errors.push(`Fila ${rowNum}: La TALLA no puede estar vacía.`);
        if (!row.COLOR) errors.push(`Fila ${rowNum}: El COLOR no puede estar vacío.`);
        
        const stock = parseInt(row.STOCK);
        if (isNaN(stock)) {
          errors.push(`Fila ${rowNum}: El STOCK debe ser un valor numérico.`);
        } else if (stock < 0) {
          errors.push(`Fila ${rowNum}: El STOCK no puede ser negativo.`);
        }

        if (row.IMAGENES) {
          const imgs = row.IMAGENES.split(';').map((s: string) => s.trim().toLowerCase()).filter((s: string) => s !== '');
          if (imgs.length > 5) {
            errors.push(`Fila ${rowNum}: Máximo 5 imágenes permitidas.`);
          }
          if (imgs.length > 0) {
            referencesImages = true;
            imgs.forEach((img: string) => referencedImageNames.add(img));
          }
        }

        if (row.NOMBRE) productNames.add(row.NOMBRE);
      });

      if (errors.length > 0) {
        setCsvErrors(errors);
        setCsvStatus('error');
        setCsvFile(null);
      } else {
        setCsvFile({
          file,
          name: file.name,
          size: formatSize(file.size),
          date: new Date().toLocaleTimeString(),
          items: productNames.size,
          variants: rows.length,
          data: rows,
          referencesImages,
          referencedImageNames
        });
        setCsvStatus('valid');
        setCsvErrors([]);
      }
    } catch (err) {
      console.error(err);
      setCsvErrors(['Error al leer el archivo CSV.']);
      setCsvStatus('error');
    } finally {
      setIsProcessingCsv(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isZipFile(file)) {
      setZipErrors(['Solo se permiten archivos .zip para imágenes.']);
      setZipStatus('error');
      setZipFile(null);
      if (zipInputRef.current) zipInputRef.current.value = '';
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setZipErrors(['El archivo ZIP no debe exceder los 50MB.']);
      setZipStatus('error');
      setZipFile(null);
      if (zipInputRef.current) zipInputRef.current.value = '';
      return;
    }

    setIsProcessingZip(true);
    setZipErrors([]);

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      
      const zipEntries = Object.keys(content.files)
        .filter(name => !content.files[name].dir)
        .filter(name => {
          const baseName = name.split(/[/\\]/).pop() || '';
          return !baseName.startsWith('.') && !name.includes('__MACOSX') && baseName !== 'Thumbs.db';
        })
        .map(path => ({
          path,
          name: (path.split(/[/\\]/).pop() || '').trim().toLowerCase(),
          size: ((content.files[path] as any)._data?.uncompressedSize || 0) as number
        }))
        .filter(entry => entry.name !== '');

      const entries = zipEntries.map(entry => entry.name);
      
      const invalidExtensions = zipEntries.filter(entry => {
        const ext = entry.name.split('.').pop()?.toLowerCase();
        return !['jpg', 'jpeg', 'png'].includes(ext || '');
      }).map(entry => entry.name);

      if (invalidExtensions.length > 0) {
        setZipErrors([`Formatos no permitidos encontrados en el ZIP (solo JPG, PNG): ${invalidExtensions.slice(0, 3).join(', ')}${invalidExtensions.length > 3 ? '...' : ''}`]);
        setZipStatus('error');
        setZipFile(null);
        return;
      }

      const oversizedImages = zipEntries
        .filter(entry => entry.size > 2 * 1024 * 1024)
        .map(entry => entry.name);

      if (oversizedImages.length > 0) {
        setZipErrors([`Imágenes mayores a 2MB encontradas: ${oversizedImages.slice(0, 3).join(', ')}${oversizedImages.length > 3 ? '...' : ''}`]);
        setZipStatus('error');
        setZipFile(null);
        return;
      }

      setZipFile({
        file,
        name: file.name,
        size: formatSize(file.size),
        entries
      });
      setZipStatus('valid');
    } catch (err) {
      console.error(err);
      setZipErrors(['Error al procesar el archivo ZIP.']);
      setZipStatus('error');
    } finally {
      setIsProcessingZip(false);
      if (zipInputRef.current) zipInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = ['NOMBRE', 'DESCRIPCION', 'TALLA', 'COLOR', 'STOCK', 'IMAGENES'];
    const row1 = ['Polo Oversized Premium Onyx', 'Polo oversized de algodón con fit relajado', 'S', 'Negro', '10', 'polo-onyx-1.png;polo-onyx-2.png'];
    const row2 = ['Polo Oversized Premium Onyx', 'Polo oversized de algodón con fit relajado', 'M', 'Negro', '8', 'polo-onyx-1.png;polo-onyx-2.png'];
    const row3 = ['Polo Classic White', 'Polo clásico de corte estándar', 'S', 'Blanco', '12', 'polo-white-1.png'];
    const csvContent = [headers, row1, row2, row3].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla-productos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [importedSummary, setImportedSummary] = useState<{
    products: number;
    variants: number;
    images: number;
    unusedImages: number;
  } | null>(null);

  const handleExecute = async () => {
    if (csvStatus !== 'valid') return;
    if (csvFile?.referencesImages && zipStatus !== 'valid') return;
    setIsExecuting(true);

    try {
      if (!csvFile) return;
      const result = await bulkUploadProducts(csvFile.file, zipFile?.file);

      if (result.errors?.length) {
        setCsvErrors(result.errors);
        setCsvStatus('error');
        return;
      }
      
      setImportedSummary({
        products: result.productsCreated,
        variants: result.variantsProcessed,
        images: result.imagesUploaded,
        unusedImages: zipFile ? Math.max(zipFile.entries.length - result.imagesUploaded, 0) : 0
      });
      
      setIsFinished(true);
    } catch (error) {
      console.error("Error during execution: ", error);
      alert("Ocurrió un error al procesar la carga masiva.");
    } finally {
      setIsExecuting(false);
    }
  };

  const { validations, canExecute } = useMemo(() => {
    if (csvStatus === 'idle') return { validations: [], canExecute: false };
    let results: ValidationResult[] = [
      { label: 'CSV con formato correcto', status: 'success' },
      { label: `${csvFile?.items || 0} productos detectados, ${csvFile?.variants || 0} variantes`, status: 'success' },
      { label: 'Campos obligatorios completos (Nombre, Descripción, Talla, Color, Stock)', status: 'success' },
    ];

    if (csvStatus === 'error') {
      results = [
        ...results,
        { label: 'Error en la estructura o datos del CSV', status: 'error', details: csvErrors[0] }
      ];
      return { validations: results, canExecute: false };
    }
 
    let blockingError = false;

    if (csvFile?.referencesImages) {
      if (zipStatus === 'idle') {
        results.push({ 
          label: 'El CSV contiene imágenes referenciadas, pero no se subió un ZIP. Para cargar imágenes de forma masiva, debes subir el ZIP correspondiente.', 
          status: 'error' 
        });
        blockingError = true;
      } else if (zipStatus === 'error') {
        results.push({ 
          label: 'Error: El ZIP de imágenes tiene problemas de formato o integridad.', 
          status: 'error',
          details: zipErrors[0]
        });
        blockingError = true;
      } else if (zipStatus === 'valid' && zipFile) {
        const missingImages = Array.from(csvFile.referencedImageNames).filter(name => !zipFile.entries.includes(name));
        if (missingImages.length > 0) {
          results.push({ 
            label: `Faltan imágenes en el ZIP: ${missingImages.slice(0, 3).join(', ')}${missingImages.length > 3 ? '...' : ''}`, 
            status: 'error' 
          });
          blockingError = true;
        } else {
          results.push({ label: 'Imágenes del ZIP validadas correctamente (coinciden con el CSV)', status: 'success' });
          
          const extraImages = zipFile.entries.filter(name => !csvFile.referencedImageNames.has(name));
          if (extraImages.length > 0) {
            results.push({ 
              label: 'El ZIP contiene imágenes que no están referenciadas en el CSV. Estas imágenes no serán asociadas a ningún producto.', 
              status: 'warning' 
            });
          }
        }
      }
    } else {
      results.push({ label: 'No se referenciaron imágenes en el CSV.', status: 'success' });
      if (zipStatus === 'valid') {
        results.push({ 
          label: 'Se subió un ZIP, pero el CSV no contiene imágenes referenciadas. Las imágenes no podrán asociarse automáticamente.', 
          status: 'warning' 
        }); 
      }
    }

    return { 
      validations: results, 
      canExecute: csvStatus === 'valid' && !blockingError 
    };
  }, [csvStatus, zipStatus, csvFile, zipFile, csvErrors, zipErrors]);

  if (isFinished) {
    return (
      <MerchantLayout title="Carga masiva" subtitle="Resultados de la operación">
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-32 h-32 bg-green-500 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-green-500/20">
            <CheckCircle2 size={64} />
          </div>
          <div className="space-y-3">
            <h1 className="text-[44px] font-black tracking-tighter text-brand-black leading-none uppercase">¡Carga completada!</h1>
            <div className="flex flex-col items-center gap-2">
              <p className="text-brand-text-muted text-[17px] font-bold max-w-md mx-auto leading-relaxed">
                Se han importado con éxito {importedSummary?.products} productos y sus {importedSummary?.variants} variantes al catálogo principal.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <Badge variant="success" className="h-10 px-5 !text-[13px] font-black !rounded-xl">
                  {importedSummary?.images} imágenes asociadas
                </Badge>
                {importedSummary && importedSummary.unusedImages > 0 && (
                  <Badge variant="outline" className="h-10 px-5 !text-[13px] font-black !rounded-xl text-amber-600 bg-amber-50 border-amber-200">
                    {importedSummary.unusedImages} imágenes del ZIP no referenciadas
                  </Badge>
                )}
                {importedSummary && importedSummary.images === 0 && csvFile?.referencesImages && (
                  <Badge variant="danger" className="h-10 px-5 !text-[13px] font-black !rounded-xl">
                    0 imágenes asociadas (Revisar nombres)
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/products')} variant="camel" className="h-14 px-10 gap-3 !rounded-2xl font-black shadow-xl shadow-brand-camel/20">
              Ver Catálogo Actualizado <ChevronRight size={20} />
            </Button>
            <Button onClick={() => { setIsFinished(false); setCsvStatus('idle'); setZipStatus('idle'); setCsvFile(null); setZipFile(null); setImportedSummary(null); }} variant="outline" className="h-14 px-10 !rounded-2xl font-black">
              Nueva Carga Masiva
            </Button>
          </div>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout title="Carga masiva" subtitle="Importa varios productos al catálogo en una sola operación">
      <div className="space-y-8 pb-10">
        <header className="space-y-4">
          <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest leading-none">Productos · Importación</p>
          <h1 className="text-[42px] font-extrabold tracking-tight text-brand-black leading-none">Carga masiva de productos</h1>
          <p className="text-brand-text-muted text-[14px] font-medium max-w-2xl leading-relaxed">
            Sube tu catálogo completo desde un archivo CSV. Las imágenes son opcionales y pueden subirse en un archivo ZIP.
          </p>
        </header>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-3xl border border-brand-neutral-border card-shadow shadow-xl shadow-brand-black/5">
          <StepIndicator number="01" title="Descarga la plantilla CSV" subtitle="Usa nuestro formato oficial" completed={!!csvFile} active={!csvFile} />
          <StepIndicator number="02" title="Sube tu CSV + imágenes" subtitle="ZIP opcional" active={!!csvFile && csvStatus === 'valid' && zipStatus === 'idle'} completed={csvStatus === 'valid' && (zipStatus === 'valid' || !csvFile?.referencesImages)} />
          <StepIndicator number="03" title="Valida y ejecuta" subtitle="Revisa antes de confirmar" active={canExecute} completed={isFinished} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: CSV */}
            <div className="bg-white rounded-2xl border-2 border-brand-neutral-border p-8 card-shadow shadow-sm space-y-6 relative overflow-hidden transition-all hover:border-brand-camel/30">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-camel"></div>
              <div>
                <h3 className="text-[11px] font-extrabold text-brand-text-muted uppercase tracking-widest mb-1">01 · Archivo de productos</h3>
                <h2 className="text-[22px] font-extrabold tracking-tight text-brand-black uppercase">Archivo CSV (.csv)</h2>
                <p className="text-[12px] text-brand-text-muted font-bold opacity-60">Una fila por variante · máximo 500 productos por archivo CSV</p>
              </div>

              <input 
                type="file" 
                ref={csvInputRef} 
                onChange={handleCsvChange} 
                accept=".csv" 
                className="hidden" 
              />

              {csvFile ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-[24px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all animate-in slide-in-from-left-4">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white rounded-2xl border-2 border-green-200 flex items-center justify-center text-green-600 shadow-xl shadow-green-500/10">
                      <FileSpreadsheet size={32} />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-black text-brand-black leading-none mb-1 tracking-tight">{csvFile.name}</h4>
                      <p className="text-[12px] font-bold text-brand-text-muted uppercase">
                        {csvFile.size} • actualizado {csvFile.date}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="success" className="!text-[10px] !px-3 font-black">
                          {csvFile.items} productos · {csvFile.variants} variantes detectadas
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => csvInputRef.current?.click()} className="flex-1 sm:grow-0 h-11 !rounded-xl font-black">Cambiar</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setCsvFile(null); setCsvStatus('idle'); setZipStatus('idle'); setZipFile(null); }} className="flex-1 sm:grow-0 h-11 text-red-500 hover:bg-red-50 hover:text-red-600 font-black tracking-widest uppercase text-[10px] !rounded-xl">Quitar</Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => csvInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const input = csvInputRef.current;
                      if (input) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        input.files = dataTransfer.files;
                        handleCsvChange({ target: input } as any);
                      }
                    }
                  }} 
                  className="border-3 border-dashed border-brand-neutral-border rounded-[32px] p-12 flex flex-col items-center justify-center text-center gap-5 hover:border-brand-black hover:bg-brand-neutral-light/50 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-3xl bg-brand-neutral-light border-2 border-brand-neutral-border flex items-center justify-center text-brand-text-muted group-hover:scale-110 group-hover:bg-brand-black group-hover:text-white transition-all shadow-sm">
                    {isProcessingCsv ? <Loader2 size={32} className="animate-spin" /> : <RefreshCcw size={32} />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[15px] font-black text-brand-black">Arrastra tu CSV aquí o haz clic para seleccionar</p>
                    <p className="text-[11px] uppercase font-black tracking-widest text-brand-text-muted opacity-60">CSV hasta 10MB · máximo 500 productos por archivo</p>
                  </div>
                  {csvStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 max-w-sm text-left">
                      <AlertCircle className="text-red-500 shrink-0" size={18} />
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-red-600 uppercase tracking-widest">Error de carga</p>
                        <p className="text-[12px] text-red-700 font-bold">{csvErrors[0] || 'El archivo no es válido'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: ZIP */}
            <div className="bg-white rounded-2xl border-2 border-brand-neutral-border p-8 card-shadow shadow-sm space-y-6 relative overflow-hidden transition-all hover:border-brand-camel/30">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-camel"></div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-[11px] font-extrabold text-brand-text-muted uppercase tracking-widest mb-1">02 · Imágenes de productos</h3>
                  <h2 className="text-[22px] font-extrabold tracking-tight text-brand-black uppercase">Archivo ZIP de imágenes</h2>
                  <p className="text-[12px] text-brand-text-muted font-bold opacity-60">Los nombres deben coincidir con los referenciados en el CSV · PNG o JPG</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="h-6 font-black border-brand-neutral-border text-brand-text-muted !text-[9px]">OPCIONAL</Badge>
                  <p className="text-[9px] font-bold text-brand-text-muted uppercase text-right leading-none max-w-[120px]">Obligatorio solo si el CSV referencia imágenes</p>
                </div>
              </div>

              <input 
                type="file" 
                ref={zipInputRef} 
                onChange={handleZipChange} 
                accept=".zip" 
                className="hidden" 
              />

              {zipFile ? (
                <div className={`border-2 rounded-[24px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all animate-in slide-in-from-left-4 ${
                  zipStatus === 'error' ? 'bg-red-50 border-red-200' : 'bg-brand-neutral-light border-brand-neutral-border'
                }`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-xl ${
                      zipStatus === 'error' ? 'bg-white border-red-200 text-red-500 shadow-red-500/10' : 'bg-white border-brand-neutral-border text-brand-black shadow-brand-black/5'
                    }`}>
                      <Archive size={32} />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-black text-brand-black leading-none mb-1 tracking-tight">{zipFile.name}</h4>
                      <p className="text-[12px] font-bold text-brand-text-muted uppercase tracking-tight">
                        {zipFile.size} • {zipStatus === 'error' ? 'con errores' : 'verificado'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={zipStatus === 'error' ? 'danger' : 'success'} className="!text-[10px] !px-3 font-black">
                          {zipStatus === 'error' ? 'ZIP Inválido' : 'ZIP Válido'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button onClick={() => zipInputRef.current?.click()} variant="outline" className="flex-1 sm:grow-0 h-11 !rounded-xl font-black">Cambiar</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setZipFile(null); setZipStatus('idle'); setZipErrors([]); }} className="flex-1 sm:grow-0 h-11 text-red-500 hover:bg-red-50 hover:text-red-600 font-black tracking-widest uppercase text-[10px] !rounded-xl">Quitar</Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => zipInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const input = zipInputRef.current;
                      if (input) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        input.files = dataTransfer.files;
                        handleZipChange({ target: input } as any);
                      }
                    }
                  }} 
                  className="border-3 border-dashed border-brand-neutral-border rounded-[32px] p-12 flex flex-col items-center justify-center text-center gap-5 hover:border-brand-black hover:bg-brand-neutral-light/50 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-3xl bg-brand-neutral-light border-2 border-brand-neutral-border flex items-center justify-center text-brand-text-muted group-hover:scale-110 group-hover:bg-brand-black group-hover:text-white transition-all shadow-sm">
                    {isProcessingZip ? <Loader2 size={32} className="animate-spin" /> : <Archive size={32} />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[15px] font-black text-brand-black">Arrastra tu ZIP aquí o haz clic para seleccionar</p>
                    <p className="text-[11px] uppercase font-black tracking-widest text-brand-text-muted opacity-60">ZIP hasta 50MB · imágenes PNG o JPG · máx. 2MB por imagen</p>
                  </div>
                  {zipStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 max-w-sm text-left">
                      <AlertCircle className="text-red-500 shrink-0" size={18} />
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-red-600 uppercase tracking-widest">Error de ZIP</p>
                        <p className="text-[12px] text-red-700 font-bold">{zipErrors[0] || 'El ZIP no es válido'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Validation */}
            <div className={`bg-white rounded-2xl border-2 p-8 card-shadow shadow-sm space-y-6 relative overflow-hidden transition-colors ${
              canExecute ? 'border-green-100 bg-green-50/10' : 'border-brand-neutral-border'
            }`}>
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                csvStatus === 'error' ? 'bg-red-500' : 
                canExecute ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[11px] font-extrabold text-brand-text-muted uppercase tracking-widest mb-1">03 · Validación previa</h3>
                  <h2 className="text-[22px] font-extrabold tracking-tight text-brand-black uppercase">Revisa antes de ejecutar</h2>
                  <p className="text-[12px] text-brand-text-muted font-bold opacity-60">Resultados analíticos del motor de importación CSV</p>
                </div>
                {csvStatus !== 'idle' && (
                  <Badge variant={canExecute ? 'success' : 'danger'} className="h-8 !px-4 self-start sm:self-center font-black transition-all">
                    {canExecute ? 'VÁLIDO' : 'CON ERRORES'}
                  </Badge>
                )}
              </div>

              {!csvFile ? (
                <div className="flex flex-col items-center justify-center p-14 gap-5 border-2 border-dashed border-brand-neutral-border rounded-[32px] bg-brand-neutral-light/30">
                  <div className="w-20 h-20 bg-brand-neutral-mid rounded-[28px] border border-brand-neutral-border flex items-center justify-center text-brand-text-muted opacity-30 animate-pulse">
                    <AlertCircle size={40} />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="text-[18px] font-black tracking-tight uppercase">Esperando CSV</h4>
                    <p className="text-[13px] text-brand-text-muted font-bold max-w-[340px] leading-relaxed uppercase tracking-tighter opacity-70">
                      Al subir el archivo CSV, el sistema auditará automáticamente la integridad de los datos de productos y variantes.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-brand-neutral-light/40 p-10 rounded-[32px] border-2 border-brand-neutral-border animate-in fade-in duration-500">
                  {validations.map((v, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex items-center gap-4 group">
                        <div className="shrink-0 transition-transform group-hover:scale-110">
                          {v.status === 'success' ? <CheckCircle2 size={24} className="text-green-500" /> : 
                            v.status === 'error' ? <X size={24} className="text-red-500" /> :
                            v.status === 'warning' ? <AlertTriangle size={24} className="text-amber-500" /> : 
                            <div className="w-6 h-6 rounded-full border-3 border-brand-neutral-border border-t-brand-black animate-spin"></div>}
                        </div>
                        <span className={`text-[15px] font-bold ${
                          v.status === 'pending' ? 'text-brand-text-muted' : 
                          v.status === 'error' ? 'text-red-600 font-black' : 'text-brand-black'
                        }`}>{v.label}</span>
                      </div>
                      {v.details && (
                        <div className="ml-10 text-[12px] text-brand-text-muted font-medium bg-white/50 p-2 rounded-lg border border-brand-neutral-border inline-block self-start">
                          {v.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Export Card */}
            <Card title="Ejecutar" subtitle="Procesamiento Final" className={`border-2 ring-4 !p-8 shadow-2xl transition-all ${
              canExecute ? 'border-brand-black ring-brand-black/5' : 'border-brand-neutral-border ring-transparent opacity-60'
            }`}>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-brand-text-muted uppercase tracking-[0.2em] leading-none">Confirmación de Acción</h4>
                  <p className="text-[13px] text-brand-black font-bold leading-relaxed">
                    Esta acción importará productos y actualizará su inventario. Asegúrate de que los nombres, tallas, colores y stocks sean correctos.
                  </p>
                </div>
               
                <div className="space-y-4">
                  <Button 
                    onClick={handleExecute}
                    className={`w-full h-16 gap-3 !rounded-2xl font-black text-[16px] uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
                      canExecute && !isExecuting ? 'shadow-xl shadow-brand-black/20 hover:scale-[1.02] active:scale-95' : ''
                    }`}
                    variant={canExecute ? 'primary' : 'outline'}
                    disabled={!canExecute || isExecuting}
                  >
                    {isExecuting ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <RefreshCcw size={24} />
                    )}
                    {isExecuting ? 'Procesando...' : 'Ejecutar carga masiva'}
                  </Button>

                  {!canExecute && csvStatus === 'valid' && !isExecuting && (
                    <div className="text-center p-4 rounded-2xl bg-red-50 border-2 border-red-200 animate-in fade-in">
                      <p className="text-[11px] font-black text-red-700 uppercase tracking-widest gap-2 flex items-center justify-center">
                        <AlertCircle size={14} /> Faltan requisitos
                      </p>
                      <p className="text-[10px] text-red-600 font-bold mt-1 uppercase">Revisa los errores de validación</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Template Card */}
            <Card title="Plantillas" subtitle="Descarga la plantilla" className="!p-8">
              <p className="text-[12px] text-brand-text-muted mb-6 leading-relaxed font-bold uppercase tracking-tight opacity-70">Usa nuestro formato estándar para evitar errores durante la validación.</p>
             
              <div 
                onClick={downloadTemplate}
                className="flex items-center gap-4 bg-brand-neutral-light border-2 border-brand-neutral-border rounded-[20px] p-5 group cursor-pointer hover:bg-white hover:border-brand-black active:scale-95 transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-white rounded-xl border border-brand-neutral-border flex items-center justify-center group-hover:text-brand-black group-hover:scale-110 transition-all text-brand-text-muted">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h5 className="text-[14px] font-black text-brand-black tracking-tight leading-none mb-1">plantilla-productos.csv</h5>
                  <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-tighter">Formato oficial • 2KB</p>
                </div>
                <Download size={20} className="text-brand-text-muted group-hover:text-brand-black" />
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest opacity-60">Estructura esperada</p>
                <div className="flex flex-wrap gap-2">
                  {['NOMBRE', 'DESCRIPCION', 'TALLA', 'COLOR', 'STOCK', 'IMAGENES'].map(tag => (
                    <Badge key={tag} variant="outline" className="h-6 !px-3 font-black bg-brand-neutral-light !border-brand-neutral-border text-[9px]">{tag}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}
