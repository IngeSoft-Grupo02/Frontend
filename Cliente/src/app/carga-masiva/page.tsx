'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import { Upload, FileCode, CheckCircle, AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'loading' | 'success' | 'error';
  progress: number;
}

export default function CargaMasivaPage() {
  const { selectedStore, currentUser, cartItems, setCurrentView } = useApp();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateProgress = (id: string) => {
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setFiles(prev =>
        prev.map(f => {
          if (f.id === id) {
            const hasError = f.name.endsWith('.pdf') || f.name.endsWith('.png'); // support csv/xlsx only
            if (current >= 100) {
              clearInterval(interval);
              return {
                ...f,
                progress: 100,
                status: hasError ? 'error' : 'success'
              };
            }
            return { ...f, progress: current };
          }
          return f;
        })
      );
    }, 150);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach(file => {
      const newFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        status: 'loading',
        progress: 0
      };
      setFiles(prev => [newFile, ...prev]);
      simulateProgress(newFile.id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="carga-masiva-container" className="min-h-screen bg-[var(--color-primary)] text-[var(--text-on-primary)] transition-all duration-300">
      <TopBar
        store={selectedStore}
        user={currentUser}
        onNavigate={(view) => {
          // Simply redirect using route mapping if needed, or update view
          window.location.href = '/';
        }}
        onLogout={() => {
          window.location.href = '/iniciar-sesion';
        }}
        cartCount={cartItems.length}
      />

      <main id="carga-masiva-main" className="max-w-4xl mx-auto px-4 py-12">
        <div id="carga-masiva-header" className="mb-10 text-center">
          <span className="px-3 py-1 text-xs font-mono tracking-widest uppercase rounded-full bg-[var(--color-tertiary)] text-[var(--text-on-tertiary)] mb-4 inline-block">
            Módulo Corporativo
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 font-sans">
            Carga Masiva de Productos
          </h1>
          <p className="text-[var(--text-on-primary)] opacity-80 max-w-lg mx-auto text-sm font-sans">
            Sube plantillas en formato *.csv o *.xlsx para solicitar cotizaciones a gran escala y procesar pedidos corporativos de manera instantánea.
          </p>
        </div>

        <div
          id="upload-drag-zone"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 text-center cursor-pointer flex flex-col items-center justify-center ${
            dragActive
              ? 'border-[var(--color-tertiary)] bg-white/10 scale-[1.01]'
              : 'border-white/20 bg-white/5 hover:bg-white/10'
          }`}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
          />
          <div id="upload-icon-wrapper" className="p-4 rounded-full bg-[var(--color-tertiary)] text-[var(--text-on-tertiary)] mb-4 shadow-lg transition-transform hover:scale-110">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-1 font-sans">
            Arrastra tus archivos aquí o haz clic para buscar
          </h3>
          <p className="text-xs text-[var(--text-on-primary)] opacity-60 mb-2 font-mono">
            Formatos permitidos: .csv, .xlsx, .xls (Máx. 10MB)
          </p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs px-3 py-1 rounded-md bg-white/5 border border-white/10">Ejemplo: plantilla_ropa.csv</span>
            <span className="text-xs px-3 py-1 rounded-md bg-white/5 border border-white/10">Ejemplo: medidas.xlsx</span>
          </div>
        </div>

        {files.length > 0 && (
          <div id="uploaded-files-section" className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-sm font-semibold mb-4 tracking-wider uppercase font-mono text-[var(--color-tertiary)]">
              Estado de carga de archivos ({files.length})
            </h4>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {files.map(file => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                      <div className="p-2 rounded-lg bg-white/10 text-[var(--color-tertiary)] flex-shrink-0">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[var(--text-on-primary)] opacity-60">{file.size}</span>
                          <span className="text-xs opacity-40">•</span>
                          {file.status === 'loading' && (
                            <span className="text-xs text-amber-400 font-mono">Procesando {file.progress}%</span>
                          )}
                          {file.status === 'success' && (
                            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Procesado Correctamente
                            </span>
                          )}
                          {file.status === 'error' && (
                            <span className="text-xs text-rose-400 font-mono flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Formato no compatible
                            </span>
                          )}
                        </div>
                        {file.status === 'loading' && (
                          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-[var(--color-tertiary)] h-full transition-all duration-150"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="p-2 text-[var(--text-on-primary)] opacity-40 hover:opacity-100 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
              <Button
                variant="ghost"
                onClick={() => setFiles([])}
              >
                Limpiar lista
              </Button>
              <Button
                variant="primary"
                disabled={files.some(f => f.status === 'loading') || !files.some(f => f.status === 'success')}
                onClick={() => {
                  alert('¡Tu catálogo masivo fue enviado con éxito a nuestro taller de diseño! Estaremos procesando tus presupuestos corporativos.');
                  window.location.href = '/';
                }}
              >
                Insertar al cotizador <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
