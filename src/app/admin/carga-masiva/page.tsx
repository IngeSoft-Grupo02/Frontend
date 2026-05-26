'use client';

import { useState } from 'react';
import { Users, Store, ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Badge, Button } from '@/components/UI';

export default function CargaMasivaPage() {
  // Estados del flujo de carga: 'idle' -> 'fileSelected1' -> 'hasErrors' -> 'fileSelected2' -> 'success'
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'fileSelected1' | 'hasErrors' | 'fileSelected2' | 'success'>('idle');

  const handleFileSelect = () => {
    if (uploadStatus === 'idle') setUploadStatus('fileSelected1');
    if (uploadStatus === 'hasErrors') setUploadStatus('fileSelected2');
  };

  const handleExecute = () => {
    if (uploadStatus === 'fileSelected1') setUploadStatus('hasErrors');
    if (uploadStatus === 'fileSelected2') setUploadStatus('success');
  };

  const blocks = [
    { title: 'Comerciantes', icon: Users, desc: 'Gestión masiva de cuentas. El archivo Excel debe contener: código, nombres, correo, DNI y teléfono.' },
    { title: 'Tiendas', icon: Store, desc: 'Alta masiva de tiendas. El archivo Excel debe vincular cada tienda a un código de comerciante existente.' },
    { title: 'ZIP de imágenes', icon: ImageIcon, desc: 'Sube un archivo .zip con las imágenes de productos. Máximo 5 imágenes por variante. La primera será principal.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-display font-extrabold tracking-tight">Inyección de datos</h2>
          <p className="text-[14px] font-medium text-neutral-400">Proceso de carga por lotes y validación</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleExecute} 
            disabled={uploadStatus === 'idle' || uploadStatus === 'hasErrors' || uploadStatus === 'success'}
            className="rounded-full h-12 px-10 shadow-lg"
          >
            Ejecutar carga
          </Button>
        </div>
      </div>

      {uploadStatus === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="bg-brand-green/10 border-2 border-brand-green p-10 flex flex-col items-center text-center">
            <CheckCircle2 size={64} className="text-brand-green mb-6" />
            <h3 className="text-[32px] font-display font-extrabold text-brand-green-dark mb-2">¡Carga exitosa!</h3>
            <p className="text-[18px] font-medium text-brand-green-dark mb-6">
              Se han procesado correctamente los archivos:
            </p>
            <div className="flex gap-4">
              <Badge variant="active" className="text-lg py-2 px-6 rounded-full">+12 tiendas creadas</Badge>
              <Badge variant="active" className="text-lg py-2 px-6 rounded-full">+8 comerciantes vinculados</Badge>
            </div>
            <Button className="mt-10 rounded-full px-10" onClick={() => setUploadStatus('idle')}>Cargar nuevos archivos</Button>
          </Card>
        </motion.div>
      )}

      {uploadStatus !== 'success' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blocks.map((block, i) => {
              const isExcelFile = block.title !== 'ZIP de imágenes';
              const isSelected = (uploadStatus === 'fileSelected1' || uploadStatus === 'hasErrors' || uploadStatus === 'fileSelected2') && isExcelFile;
              const isSuccessiveUpload = uploadStatus === 'fileSelected2' && isExcelFile;

              return (
                <Card key={i} className={`flex flex-col h-full border-2 transition-all duration-300 ${isSelected ? 'border-brand-camel bg-brand-beige-light/30' : 'border-transparent hover:border-brand-camel/50'} group`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[20px] font-display font-extrabold">{block.title}</h4>
                    <block.icon size={20} className="text-neutral-300 group-hover:text-brand-camel transition-colors" />
                  </div>
                  <p className="text-[12px] text-neutral-400 mb-6 flex-1 pr-4">{block.desc}</p>
                  
                  <div className="flex gap-2 mb-6">
                    <Badge variant={isSelected ? 'success' : 'pending'}>
                      {isSelected ? (isSuccessiveUpload ? 'Archivo corregido' : 'Excel cargado') : 'Sin archivo'}
                    </Badge>
                    {isSelected && <p className="text-[10px] font-bold text-neutral-400 self-center">maestros_final_v2.xlsx</p>}
                  </div>

                  <div className="space-y-2 mt-auto">
                    <Button 
                      variant={isSelected ? "active" : "beige"} 
                      className="w-full text-[12px] h-14 rounded-2xl"
                      onClick={handleFileSelect}
                    >
                      {isSelected ? 'Cambiar archivo' : 'Seleccionar archivo'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { m: 'Comerciantes', val: uploadStatus === 'fileSelected2' ? '8' : uploadStatus === 'fileSelected1' ? '8' : '—', status: (uploadStatus === 'fileSelected1' || uploadStatus === 'fileSelected2' || uploadStatus === 'hasErrors') ? 'neutral' : 'pending' },
              { m: 'Tiendas', val: uploadStatus === 'fileSelected2' ? '12' : uploadStatus === 'fileSelected1' ? '12' : '—', status: (uploadStatus === 'fileSelected1' || uploadStatus === 'fileSelected2' || uploadStatus === 'hasErrors') ? 'neutral' : 'pending' },
              { m: 'ZIP de imágenes', val: '0', status: (uploadStatus === 'fileSelected1' || uploadStatus === 'fileSelected2' || uploadStatus === 'hasErrors') ? 'neutral' : 'pending' },
              { m: 'Errores', val: uploadStatus === 'hasErrors' ? '3' : '0', status: uploadStatus === 'hasErrors' ? 'error' : (uploadStatus === 'idle' ? 'pending' : 'success') },
            ].map((m) => (
              <Card key={m.m} className="p-4 flex flex-col gap-1 items-start">
                <p className="text-[10px] text-neutral-400 font-bold uppercase">{m.m}</p>
                <p className="text-[24px] font-extrabold">{m.val}</p>
                <Badge variant={m.status as any}>{uploadStatus === 'idle' ? 'Pendiente' : (uploadStatus === 'hasErrors' && m.m === 'Errores') ? 'Crítico' : 'Válido'}</Badge>
              </Card>
            ))}
          </div>

          <Card className={`${uploadStatus === 'hasErrors' ? 'bg-orange-50 border-orange-200' : 'bg-brand-beige-light border-none'} transition-colors duration-500`}>
            <div className="flex items-center gap-3 mb-2">
              {uploadStatus === 'hasErrors' ? <AlertCircle className="text-orange-600" size={20} /> : <div className="w-5" />}
              <h4 className={`text-[18px] font-display font-extrabold ${uploadStatus === 'hasErrors' ? 'text-orange-900' : 'text-neutral-900'}`}>
                {uploadStatus === 'hasErrors' ? 'Referencias con inconsistencias' : 'Referencias resueltas'}
              </h4>
            </div>
            <p className={`text-[14px] font-medium ${uploadStatus === 'hasErrors' ? 'text-orange-700' : 'text-neutral-500'}`}>
              {uploadStatus === 'hasErrors' 
                ? 'Se detectaron 3 códigos de comerciante que no existen en la base de datos ni en el archivo actual.' 
                : uploadStatus === 'idle' ? 'Aún no se han validado referencias.' : 'Todas las referencias (ID Tienda, ID Comerciante) han sido validadas contra la BD.'
              }
            </p>
          </Card>

          <Card className="px-0 py-2 overflow-hidden">
            <div className="px-8 py-4 mb-4 flex justify-between items-center">
              <h3 className="text-[18px] font-display font-extrabold">Incidencias detectadas</h3>
              {uploadStatus === 'hasErrors' && <Badge variant="error" className="animate-pulse">3 ERRORES ENCONTRADOS</Badge>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#f1ede4]">
                  <tr className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                    <th className="py-4 px-8">Bloque</th>
                    <th className="py-4 px-4">Fila</th>
                    <th className="py-4 px-4">Código</th>
                    <th className="py-4 px-4">Tipo</th>
                    <th className="py-4 px-4">Detalle</th>
                    <th className="py-4 px-8 text-right">Origen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {uploadStatus === 'hasErrors' ? (
                    <>
                      {[
                        { b: 'Tiendas', f: '12', c: 'T-99', t: 'REFERENCIA', d: 'ID Comerciante "C-005" no existe', o: 'ARCHIVO' },
                        { b: 'Tiendas', f: '45', c: 'T-102', t: 'FORMATO', d: 'RUC debe tener 11 dígitos', o: 'ARCHIVO' },
                        { b: 'Comerciantes', f: '5', c: 'C-001', t: 'DUPLICADO', d: 'El correo luciana@street.com ya está registrado', o: 'SISTEMA' },
                      ].map((err, i) => (
                        <tr key={i} className="text-[13px] bg-red-50/30">
                          <td className="py-5 px-8 font-extrabold text-neutral-900">{err.b}</td>
                          <td className="py-5 px-4 font-bold text-red-600">{err.f}</td>
                          <td className="py-5 px-4 font-mono font-medium">{err.c}</td>
                          <td className="py-5 px-4"><Badge variant="error">{err.t}</Badge></td>
                          <td className="py-5 px-4 text-neutral-700 font-medium">{err.d}</td>
                          <td className="py-5 px-8 text-right text-neutral-400 font-bold">{err.o}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-400 font-medium italic">
                        {uploadStatus === 'idle' ? 'Todavía no se ejecutó validación' : 'No se detectaron errores en el archivo seleccionado'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}