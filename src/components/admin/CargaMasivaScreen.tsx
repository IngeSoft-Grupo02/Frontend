'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge, Input } from '../UI';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadRow {
  id: string;
  name: string;
  responsible: string;
  ruc: string;
  status: string;
  errors: string[];
}

export function CargaMasivaScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<UploadRow[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);

  const MAX_SIZE_MB = 5;
  const ALLOWED_TYPES = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/csv'
  ];

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (uploadedFile: File) => {
    if (!ALLOWED_TYPES.includes(uploadedFile.type) && !uploadedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert('Formato no válido. Usa .xlsx, .xls o .csv');
      return;
    }
    if (uploadedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`El archivo excede el límite de ${MAX_SIZE_MB}MB`);
      return;
    }
    setFile(uploadedFile);
    setPreviewData([]);
    setUploadComplete(false);
  };

  const simulateProcessing = () => {
    if (!file) return;
    setProcessing(true);

    // 🔌 TODO: Reemplazar por llamada real a API
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch('/api/stores/bulk-upload', { method: 'POST', body: formData });

    setTimeout(() => {
      const mockRows: UploadRow[] = [
        { id: '1', name: 'Urban Style', responsible: 'admin@urban.com', ruc: '20123456789', status: 'Activa', errors: [] },
        { id: '2', name: 'Core Lab', responsible: 'contacto@core.com', ruc: '20987654321', status: 'Activa', errors: [] },
        { id: '3', name: 'Bad Data Store', responsible: 'invalid-email', ruc: '123', status: 'Pendiente', errors: ['Email inválido', 'RUC debe tener 11 dígitos'] },
        { id: '4', name: '', responsible: 'missing@name.com', ruc: '20456789012', status: 'Activa', errors: ['Nombre de tienda obligatorio'] },
        { id: '5', name: 'Duplicate Store', responsible: 'dup@dup.com', ruc: '20111222333', status: 'Suspendida', errors: ['Tienda ya registrada'] },
      ];
      setPreviewData(mockRows);
      setProcessing(false);
    }, 1500);
  };

  const handleClear = () => {
    setFile(null);
    setPreviewData([]);
    setUploadComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmUpload = () => {
    setUploadComplete(true);
    setTimeout(() => {
      router.push('/admin/tiendas');
    }, 2000);
  };

  const downloadTemplate = () => {
    // 🔌 TODO: Reemplazar por descarga real del backend o archivo estático
    const csvContent = "Nombre,Responsable,RUC,Estado,Estilos,Prendas,Clientes,Paleta\nCanvas Lab,admin@canvas.com,20123456789,Activa,Casual;Street,Polo;Jean,Dama;Unisex,core-street";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_tienda.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const validRows = previewData.filter(r => r.errors.length === 0).length;
  const invalidRows = previewData.filter(r => r.errors.length > 0).length;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">Carga masiva de tiendas</h2>
        <p className="text-[14px] font-medium text-neutral-400">Sube un archivo Excel o CSV para registrar múltiples tiendas de forma automática</p>
      </div>

      {!file ? (
        <Card 
          className={`p-16 flex flex-col items-center justify-center border-2 border-dashed transition-colors cursor-pointer ${
            isDragging ? 'border-brand-camel bg-brand-camel/5' : 'border-neutral-200 hover:border-neutral-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx,.xls,.csv" 
            onChange={handleFileChange} 
          />
          <div className="w-20 h-20 bg-brand-camel/10 rounded-full flex items-center justify-center mb-6">
            <UploadCloud size={32} className="text-brand-camel" />
          </div>
          <h3 className="text-[20px] font-bold text-brand-black mb-2">Arrastra tu archivo aquí</h3>
          <p className="text-[14px] text-neutral-400 mb-6 text-center max-w-md">
            o haz clic para seleccionar. Formatos aceptados: .xlsx, .xls, .csv (Máx. {MAX_SIZE_MB}MB)
          </p>
          <Button variant="secondary" className="rounded-full px-8">Seleccionar archivo</Button>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="p-8 flex items-center justify-between bg-brand-camel/5 border-brand-camel/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-camel rounded-xl flex items-center justify-center">
                <FileSpreadsheet size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-brand-black text-[16px]">{file.name}</p>
                <p className="text-[12px] text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="rounded-full px-6" onClick={handleClear}>
                <Trash2 size={16} className="mr-2" /> Limpiar
              </Button>
              <Button 
                className="rounded-full px-8" 
                onClick={simulateProcessing} 
                disabled={processing}
              >
                {processing ? <Loader2 size={18} className="mr-2 animate-spin" /> : <CheckCircle2 size={18} className="mr-2" />}
                {processing ? 'Procesando...' : 'Validar archivo'}
              </Button>
            </div>
          </Card>

          <AnimatePresence>
            {previewData.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-[20px] font-display font-extrabold text-brand-black">Vista previa de datos</h3>
                    <p className="text-[14px] text-neutral-400">
                      {validRows} registros válidos · {invalidRows} con errores
                    </p>
                  </div>
                  <Button variant="secondary" className="rounded-full px-6" onClick={downloadTemplate}>
                    <Download size={16} className="mr-2" /> Descargar plantilla
                  </Button>
                </div>

                <Card className="px-0 py-2 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                      <thead className="bg-[#f1ede4]">
                        <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          <th className="py-4 px-6">#</th>
                          <th className="py-4 px-4">Tienda</th>
                          <th className="py-4 px-4">Responsable</th>
                          <th className="py-4 px-4">RUC</th>
                          <th className="py-4 px-4">Estado</th>
                          <th className="py-4 px-6">Validación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {previewData.map((row, i) => (
                          <tr key={row.id} className="text-[13px] hover:bg-neutral-50 transition-colors">
                            <td className="py-4 px-6 font-medium text-neutral-400">{i + 1}</td>
                            <td className="py-4 px-4 font-bold text-neutral-900">{row.name || <span className="text-red-400 italic">Vacío</span>}</td>
                            <td className="py-4 px-4 font-mono text-[12px] text-neutral-600">{row.responsible}</td>
                            <td className="py-4 px-4 font-mono text-[12px] text-neutral-600">{row.ruc}</td>
                            <td className="py-4 px-4">
                              <Badge variant={row.status === 'Activa' ? 'active' : 'warning'}>{row.status}</Badge>
                            </td>
                            <td className="py-4 px-6">
                              {row.errors.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  {row.errors.map((err, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-red-500">
                                      <AlertCircle size={12} /> {err}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-[11px] font-bold text-green-600">
                                  <CheckCircle2 size={12} /> Válido
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {invalidRows === 0 && (
                  <div className="flex justify-end pt-4">
                    <Button className="rounded-full px-10 h-14 text-[16px]" onClick={handleConfirmUpload}>
                      Confirmar carga masiva
                    </Button>
                  </div>
                )}

                {invalidRows > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle size={24} className="text-red-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-bold text-red-700 mb-1">No se puede completar la carga</p>
                      <p className="text-[13px] text-red-600">
                        Hay {invalidRows} fila(s) con errores. Corrige el archivo y vuelve a subirlo, o elimina las filas inválidas manualmente si el sistema lo permite.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}