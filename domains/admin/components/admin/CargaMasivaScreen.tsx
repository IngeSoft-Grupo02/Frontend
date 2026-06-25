'use client';

import { useState, useRef, DragEvent, useEffect } from 'react';
import { api } from '@/domains/admin/lib/api';
import { messageFromError } from '@/domains/shared/errors';
import { Button, Card } from '../UI';
import {
  Download, CheckCircle2, AlertCircle, Loader2,
  Users, Store, ImageIcon, Play, FileText,
} from 'lucide-react';

// ── Tipos ──────────────────────────────────────────────────────────

type BlockKey = 'merchants' | 'stores' | 'images';
type BlockStatus = 'pending' | 'validating' | 'valid' | 'error';

interface BlockState {
  file: File | null;
  status: BlockStatus;
  rowCount: number;       // filas del CSV (sin cabecera)
  incidences: Incidence[];
  zipFileNames: string[]; // nombres de archivos dentro del ZIP (solo para bloque images)
}

interface Incidence {
  block: 'Comerciantes' | 'Tiendas' | 'Imágenes';
  row: number | string;
  detail: string;
  isError: boolean;
}

interface BulkResult {
  merchantsCreated: number;
  storesCreated: number;
  logosProcessed: number;
}

// ── Constantes ────────────────────────────────────────────────────

const MERCHANT_COLUMNS = [
  'email','password','firstName','paternalSurname','maternalSurname',
  'documentType','documentNumber','birthDate','phone','gender','ruc',
];
const STORE_COLUMNS = ['storeName','slug','categoryId','primaryColor','secondaryColor','tertiaryColor','categoryId','primaryColor','secondaryColor','tertiaryColor','description','merchantEmail','logoFileName'];
const VALID_DOC_TYPES     = ['DNI','PASSPORT','FOREIGN_ID_CARD'];
const VALID_PRIMARY_COLORS   = ['ONYX_BLACK','DEEP_ZINC','MIDNIGHT','CHARCOAL','ESPRESSO'];
const VALID_SECONDARY_COLORS = ['OLIVE_DRAB','SAGE','SLATE','TERRA','DUSTY_RED'];
const VALID_TERTIARY_COLORS  = ['RICH_CAMEL','RAW_GOLD','SILVER_MIST','COPPER','STONE'];
const VALID_GENDERS   = ['MALE','FEMALE','NOT_SPECIFIED'];
const MAX_FILE_MB     = 50;

// ── Helpers CSV ───────────────────────────────────────────────────

function splitCsvLine(line: string): string[] {
  const tokens: string[] = [];
  let inQuotes = false;
  let current = '';
  for (const c of line) {
    if (c === '"') { inQuotes = !inQuotes; }
    else if (c === ',' && !inQuotes) { tokens.push(current.trim()); current = ''; }
    else { current += c; }
  }
  tokens.push(current.trim());
  return tokens;
}

function parseCsv(text: string): { headers: string[]; rows: Record<string,string>[] } {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '' && !l.trim().startsWith('#'));
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = splitCsvLine(lines[0]).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const cols = splitCsvLine(line);
    const row: Record<string,string> = {};
    headers.forEach((h, i) => { row[h] = (cols[i] ?? '').trim(); });
    return row;
  });
  return { headers, rows };
}

function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidDate(d: string)  { return /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d)); }

// ── Validadores ───────────────────────────────────────────────────

async function validateMerchantsCsv(
    file: File,
    existingEmails: string[],
): Promise<{ incidences: Incidence[]; rowCount: number; emailsFound: string[] }> {
  const text = await file.text();
  const { headers, rows } = parseCsv(text);
  const incidences: Incidence[] = [];
  const emailsFound: string[] = [];

  const missingCols = MERCHANT_COLUMNS.filter(c => !headers.includes(c));
  if (missingCols.length > 0) {
    incidences.push({ block:'Comerciantes', row:'Cabecera',
      detail:`Columnas faltantes: ${missingCols.join(', ')}`, isError:true });
    return { incidences, rowCount: rows.length, emailsFound };
  }

  rows.forEach((row, idx) => {
    const n = idx + 2;

    // email
    if (!row.email) {
      incidences.push({ block:'Comerciantes', row:n, detail:'El campo email es obligatorio.', isError:true });
    } else if (!isValidEmail(row.email)) {
      incidences.push({ block:'Comerciantes', row:n, detail:`Formato de email inválido: "${row.email}".`, isError:true });
    } else if (existingEmails.includes(row.email.toLowerCase())) {
      incidences.push({ block:'Comerciantes', row:n, detail:`El email "${row.email}" ya está registrado en el sistema.`, isError:true });
    } else if (emailsFound.includes(row.email.toLowerCase())) {
      incidences.push({ block:'Comerciantes', row:n, detail:`El email "${row.email}" está duplicado en el archivo.`, isError:true });
    } else {
      emailsFound.push(row.email.toLowerCase());
    }

    if (!row.password)
      incidences.push({ block:'Comerciantes', row:n, detail:'El campo password es obligatorio.', isError:true });

    if (!row.firstName)
      incidences.push({ block:'Comerciantes', row:n, detail:'El campo firstName es obligatorio.', isError:true });

    if (!VALID_DOC_TYPES.includes((row.documentType ?? '').toUpperCase()))
      incidences.push({ block:'Comerciantes', row:n,
        detail:`documentType inválido: "${row.documentType}". Permitidos: ${VALID_DOC_TYPES.join(', ')}.`, isError:true });

    if (!row.documentNumber)
      incidences.push({ block:'Comerciantes', row:n, detail:'El campo documentNumber es obligatorio.', isError:true });

    if (row.birthDate && !isValidDate(row.birthDate))
      incidences.push({ block:'Comerciantes', row:n,
        detail:`birthDate inválido: "${row.birthDate}". Usa formato yyyy-MM-dd.`, isError:true });

    if (!VALID_GENDERS.includes((row.gender ?? '').toUpperCase()))
      incidences.push({ block:'Comerciantes', row:n,
        detail:`gender inválido: "${row.gender}". Permitidos: ${VALID_GENDERS.join(', ')}.`, isError:true });

    if (!/^\d{11}$/.test(row.ruc ?? ''))
      incidences.push({ block:'Comerciantes', row:n,
        detail:`RUC inválido: "${row.ruc}". Debe tener exactamente 11 dígitos numéricos.`, isError:true });
  });

  return { incidences, rowCount: rows.length, emailsFound };
}

async function validateStoresCsv(
    file: File,
    existingStoreNames: string[],
    existingMerchantEmails: string[],
    merchantsInFile: string[],
    logosInZip: string[],   // nombres de archivos dentro del ZIP (vacío si no se cargó ZIP)
): Promise<{ incidences: Incidence[]; rowCount: number; logosReferenced: string[] }> {
  const text = await file.text();
  const { headers, rows } = parseCsv(text);
  const incidences: Incidence[] = [];
  const logosReferenced: string[] = [];

  const missingCols = STORE_COLUMNS.filter(c => !headers.includes(c));
  if (missingCols.length > 0) {
    incidences.push({ block:'Tiendas', row:'Cabecera',
      detail:`Columnas faltantes: ${missingCols.join(', ')}`, isError:true });
    return { incidences, rowCount: rows.length, logosReferenced };
  }

  const slugsEnArchivo: string[] = [];
  const allMerchants = [...existingMerchantEmails, ...merchantsInFile];

  rows.forEach((row, idx) => {
    const n = idx + 2;

    // storeName
    if (!row.storeName)
      incidences.push({ block:'Tiendas', row:n, detail:'El campo storeName es obligatorio.', isError:true });
    else if (row.storeName.length > 100)
      incidences.push({ block:'Tiendas', row:n, detail:'storeName supera 100 caracteres.', isError:true });
    else if (existingStoreNames.map(s=>s.toLowerCase()).includes(row.storeName.toLowerCase()))
      incidences.push({ block:'Tiendas', row:n,
        detail:`La tienda "${row.storeName}" ya existe en el sistema.`, isError:true });

    // slug
    if (!row.slug)
      incidences.push({ block:'Tiendas', row:n, detail:'El campo slug es obligatorio.', isError:true });
    else if (slugsEnArchivo.includes(row.slug.toLowerCase()))
      incidences.push({ block:'Tiendas', row:n,
        detail:`El slug "${row.slug}" está duplicado en el archivo.`, isError:true });
    else
      slugsEnArchivo.push(row.slug.toLowerCase());

    // categoryId — obligatorio y numérico
    if (!row.categoryId || row.categoryId.trim() === '') {
      incidences.push({ block:'Tiendas', row:n, detail:'El campo categoryId es obligatorio.', isError:true });
    } else if (isNaN(Number(row.categoryId))) {
      incidences.push({ block:'Tiendas', row:n, detail:`categoryId debe ser un número entero: "${row.categoryId}".`, isError:true });
    }

    // primaryColor
    if (!VALID_PRIMARY_COLORS.includes((row.primaryColor ?? '').toUpperCase()))
      incidences.push({ block:'Tiendas', row:n,
        detail:`primaryColor inválido: "${row.primaryColor}". Permitidos: ${VALID_PRIMARY_COLORS.join(', ')}.`, isError:true });

    // secondaryColor
    if (!VALID_SECONDARY_COLORS.includes((row.secondaryColor ?? '').toUpperCase()))
      incidences.push({ block:'Tiendas', row:n,
        detail:`secondaryColor inválido: "${row.secondaryColor}". Permitidos: ${VALID_SECONDARY_COLORS.join(', ')}.`, isError:true });

    // tertiaryColor
    if (!VALID_TERTIARY_COLORS.includes((row.tertiaryColor ?? '').toUpperCase()))
      incidences.push({ block:'Tiendas', row:n,
        detail:`tertiaryColor inválido: "${row.tertiaryColor}". Permitidos: ${VALID_TERTIARY_COLORS.join(', ')}.`, isError:true });

    // merchantEmail — OBLIGATORIO
    if (!row.merchantEmail || row.merchantEmail.trim() === '') {
      incidences.push({ block:'Tiendas', row:n,
        detail:'El campo merchantEmail es obligatorio. Toda tienda debe tener un comerciante asignado.', isError:true });
    } else if (!allMerchants.includes(row.merchantEmail.toLowerCase())) {
      incidences.push({ block:'Tiendas', row:n,
        detail:`El comerciante "${row.merchantEmail}" no existe en el sistema ni en el archivo de comerciantes cargado.`, isError:true });
    }

    // logoFileName — opcional, pero si viene se valida contra el ZIP
    const logo = (row.logoFileName ?? '').trim();
    if (logo) {
      const VALID_IMG_EXTS = ['jpg','jpeg','png','webp'];
      const ext = logo.includes('.') ? logo.split('.').pop()!.toLowerCase() : '';

      // Extensión válida
      if (!VALID_IMG_EXTS.includes(ext)) {
        incidences.push({ block:'Tiendas', row:n,
          detail:`logoFileName "${logo}" tiene extensión inválida. Permitidas: jpg, jpeg, png, webp.`, isError:true });
      }
      // Si hay ZIP cargado, el nombre debe existir dentro de él
      else if (logosInZip.length > 0 && !logosInZip.map(l=>l.toLowerCase()).includes(logo.toLowerCase())) {
        incidences.push({ block:'Tiendas', row:n,
          detail:`El logo "${logo}" no existe en el ZIP cargado. Verifica el nombre exacto del archivo.`, isError:true });
      }
      // Registrar como referenciado (para detectar logos en ZIP sin tienda)
      else if (logosInZip.length > 0) {
        logosReferenced.push(logo.toLowerCase());
      }
    }
  });

  return { incidences, rowCount: rows.length, logosReferenced };
}

async function validateLogosZip(
    file: File,
): Promise<{ incidences: Incidence[]; fileNames: string[] }> {
  const incidences: Incidence[] = [];
  const fileNames: string[] = [];

  if (!file.name.toLowerCase().endsWith('.zip')) {
    incidences.push({ block:'Imágenes', row:'—',
      detail:`El archivo debe ser un .zip. Se recibió: "${file.name}".`, isError:true });
    return { incidences, fileNames };
  }

  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    incidences.push({ block:'Imágenes', row:'—',
      detail:`El ZIP supera ${MAX_FILE_MB} MB.`, isError:true });
    return { incidences, fileNames };
  }

  // Parsear cabeceras del ZIP para extraer nombres de archivos
  // El formato ZIP almacena "local file headers" con la firma 0x04034b50
  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    const VALID_IMG_EXTS = ['jpg','jpeg','png','webp'];
    let offset = 0;

    while (offset < buffer.byteLength - 4) {
      const sig = view.getUint32(offset, true);
      if (sig !== 0x04034b50) { offset++; continue; }

      const fileNameLength = view.getUint16(offset + 26, true);
      const extraLength    = view.getUint16(offset + 28, true);
      const compressedSize = view.getUint32(offset + 18, true);

      const nameBytes = new Uint8Array(buffer, offset + 30, fileNameLength);
      const name = new TextDecoder().decode(nameBytes);

      // Ignorar directorios
      if (!name.endsWith('/')) {
        // Solo el nombre de archivo, sin ruta
        const baseName = name.includes('/') ? name.split('/').pop()! : name;
        const ext = baseName.includes('.') ? baseName.split('.').pop()!.toLowerCase() : '';

        if (!VALID_IMG_EXTS.includes(ext)) {
          incidences.push({ block:'Imágenes', row:'—',
            detail:`Archivo "${baseName}" con extensión no permitida. Solo: jpg, jpeg, png, webp.`, isError:false });
        } else if (compressedSize > 2 * 1024 * 1024) {
          incidences.push({ block:'Imágenes', row:'—',
            detail:`El archivo "${baseName}" supera 2 MB.`, isError:true });
        } else {
          fileNames.push(baseName);
        }
      }

      offset += 30 + fileNameLength + extraLength + compressedSize;
    }
  } catch {
    incidences.push({ block:'Imágenes', row:'—',
      detail:'No se pudo leer el contenido del ZIP. Verifica que el archivo no esté corrupto.', isError:true });
    return { incidences, fileNames };
  }

  if (fileNames.length === 0 && incidences.filter(i=>i.isError).length === 0) {
    incidences.push({ block:'Imágenes', row:'—',
      detail:'El ZIP no contiene imágenes válidas (jpg, jpeg, png, webp).', isError:true });
  }

  return { incidences, fileNames };
}

// ── Plantillas ────────────────────────────────────────────────────

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function downloadMerchantsTemplate() {
  const csv = [
    'email,password,firstName,paternalSurname,maternalSurname,documentType,documentNumber,birthDate,phone,gender,ruc',
    '# INSTRUCCIONES:,min 8 chars,Obligatorio,Obligatorio,Obligatorio,DNI|PASSPORT|FOREIGN_ID_CARD,Sin puntos,yyyy-MM-dd,9 dígitos,MALE|FEMALE|NOT_SPECIFIED,11 dígitos exactos',
    'juan.perez@ejemplo.com,Pass1234!,Juan,Perez,Garcia,DNI,12345678,1988-05-15,987654321,MALE,20100000001',
    'maria.torres@ejemplo.com,Pass5678!,Maria,Torres,Lopez,DNI,87654321,1992-11-20,912345678,FEMALE,20200000002',
  ].join('\n');
  triggerDownload(new Blob(['\uFEFF' + csv], { type:'text/csv;charset=utf-8;' }), 'plantilla_comerciantes.csv');
}

function downloadStoresTemplate() {
  const csv = [
    'storeName,slug,categoryId,primaryColor,secondaryColor,tertiaryColor,description,merchantEmail,logoFileName',
    '# INSTRUCCIONES:,minúsculas-sin-espacios,CORESTREET|ATELIERMONO|UTILITYDROP|LUXECAPSULE,Opcional,Email del comerciante (obligatorio),Nombre exacto del archivo en el ZIP (opcional)',
    'Mi Tienda Urbana,mi-tienda-urbana,1,ONYX_BLACK,OLIVE_DRAB,RICH_CAMEL,Ropa urbana para jóvenes,juan.perez@ejemplo.com,MiTiendaUrbana.png',
    'Luxe Moda,luxe-moda,2,MIDNIGHT,SAGE,RAW_GOLD,Alta costura accesible,maria.torres@ejemplo.com,',
  ].join('\n');
  triggerDownload(new Blob(['\uFEFF' + csv], { type:'text/csv;charset=utf-8;' }), 'plantilla_tiendas.csv');
}

function downloadLogosInstructions() {
  const txt = [
    'Instrucciones para el ZIP de logos de tiendas',
    '==============================================',
    '',
    'El ZIP debe contener UNA imagen por tienda.',
    'El nombre del archivo debe ser exactamente el SLUG de la tienda.',
    '',
    'Ejemplos:',
    '  mi-tienda-urbana.png  ->  logo de la tienda con slug "mi-tienda-urbana"',
    '  luxe-moda.jpg         ->  logo de la tienda con slug "luxe-moda"',
    '',
    'Formatos permitidos: .jpg  .jpeg  .png  .webp',
    'Tamaño máximo por imagen: 2 MB',
  ].join('\n');
  triggerDownload(new Blob([txt], { type:'text/plain;charset=utf-8;' }), 'instrucciones_logos.txt');
}

// ── Simulación backend ────────────────────────────────────────────

function simulateBackend(blocks: Record<BlockKey, BlockState>): BulkResult {
  const mErrors = blocks.merchants.incidences.filter(i => i.isError).length;
  const sErrors = blocks.stores.incidences.filter(i => i.isError).length;
  return {
    merchantsCreated: blocks.merchants.file && mErrors === 0 ? blocks.merchants.rowCount : 0,
    storesCreated:    blocks.stores.file    && sErrors === 0 ? blocks.stores.rowCount    : 0,
    logosProcessed:   blocks.images.file    && blocks.images.incidences.filter(i=>i.isError).length === 0 ? 1 : 0,
  };
}


// ── Componente ────────────────────────────────────────────────────

const INITIAL_BLOCK: BlockState = { file:null, status:'pending', rowCount:0, incidences:[], zipFileNames:[] };

export function CargaMasivaScreen() {
  const fileRefs = {
    merchants: useRef<HTMLInputElement>(null),
    stores:    useRef<HTMLInputElement>(null),
    images:    useRef<HTMLInputElement>(null),
  };

  const [blocks, setBlocks] = useState<Record<BlockKey, BlockState>>({
    merchants: { ...INITIAL_BLOCK },
    stores:    { ...INITIAL_BLOCK },
    images:    { ...INITIAL_BLOCK },
  });

  const [executing, setExecuting]   = useState(false);
  const [executed,  setExecuted]    = useState(false);
  const [result,    setResult]      = useState<BulkResult | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [dragOver,  setDragOver]    = useState<BlockKey | null>(null);

  // ── Datos reales de la BD ─────────────────────────────────────
  const [existingEmails,         setExistingEmails]         = useState<string[]>([]);
  const [existingStoreNames,     setExistingStoreNames]     = useState<string[]>([]);
  const [existingMerchantEmails, setExistingMerchantEmails] = useState<string[]>([]);
  const [dataLoaded,             setDataLoaded]             = useState(false);

  // Cargar datos del backend al montar el componente
  useEffect(() => {
    async function loadExistingData() {
      const [emails, storesData] = await Promise.all([
        api.bulk.existingEmails(),
        api.bulk.existingStores(),
      ]);
      setExistingEmails(emails);
      setExistingStoreNames(storesData.storeNames);
      setExistingMerchantEmails(storesData.merchantEmails);
      setDataLoaded(true);
    }
    loadExistingData();
  }, []);

  // ── Validación en tiempo real ─────────────────────────────────

  const validateBlock = async (key: BlockKey, file: File, currentBlocks: Record<BlockKey, BlockState>) => {
    setBlocks(prev => ({ ...prev, [key]: { ...prev[key], status:'validating' } }));

    try {
      // Emails del CSV de comerciantes ya cargado (para validación cruzada en tiendas)
      let merchantEmailsInFile: string[] = [];
      const mFile = key === 'merchants' ? file : currentBlocks.merchants.file;
      if (mFile) {
        const text = await mFile.text();
        const { rows } = parseCsv(text);
        merchantEmailsInFile = rows.map(r => (r.email ?? '').toLowerCase()).filter(Boolean);
      }

      // Nombres de archivos del ZIP ya cargado
      const logosInZip = key === 'images' ? [] : currentBlocks.images.zipFileNames;

      let incidences: Incidence[] = [];
      let rowCount = 0;
      let zipFileNames: string[] = currentBlocks[key].zipFileNames;

      if (key === 'merchants') {
        const res = await validateMerchantsCsv(file, existingEmails);
        incidences = res.incidences;
        rowCount   = res.rowCount;

        // Re-validar tiendas si ya están cargadas (porque cambiaron los emails disponibles)
        if (currentBlocks.stores.file) {
          const sRes = await validateStoresCsv(
              currentBlocks.stores.file,
              existingStoreNames,
              existingMerchantEmails,
              res.emailsFound,
              logosInZip,
          );
          setBlocks(prev => ({
            ...prev,
            stores: { ...prev.stores, incidences: sRes.incidences,
              status: sRes.incidences.some(i=>i.isError) ? 'error' : 'valid' },
          }));
        }
      } else if (key === 'stores') {
        const res = await validateStoresCsv(
            file, existingStoreNames, existingMerchantEmails, merchantEmailsInFile, logosInZip,
        );
        incidences = res.incidences;
        rowCount   = res.rowCount;

        // Detectar logos en ZIP que ninguna tienda referenció
        if (logosInZip.length > 0) {
          logosInZip.forEach(logoName => {
            if (!res.logosReferenced.includes(logoName.toLowerCase())) {
              incidences.push({ block:'Imágenes', row:'—',
                detail:`El logo "${logoName}" está en el ZIP pero ninguna tienda lo referencia en logoFileName.`, isError:false });
            }
          });
        }
      } else {
        // ZIP cargado: extraer nombres y re-validar tiendas si ya están cargadas
        const res = await validateLogosZip(file);
        incidences   = res.incidences;
        zipFileNames = res.fileNames;
        rowCount     = res.fileNames.length;

        if (currentBlocks.stores.file) {
          const sRes = await validateStoresCsv(
              currentBlocks.stores.file,
              existingStoreNames,
              existingMerchantEmails,
              merchantEmailsInFile,
              res.fileNames,
          );
          // Detectar logos en ZIP sin tienda que los referencie
          res.fileNames.forEach(logoName => {
            if (!sRes.logosReferenced.includes(logoName.toLowerCase())) {
              sRes.incidences.push({ block:'Imágenes', row:'—',
                detail:`El logo "${logoName}" está en el ZIP pero ninguna tienda lo referencia en logoFileName.`, isError:false });
            }
          });
          setBlocks(prev => ({
            ...prev,
            stores: { ...prev.stores, incidences: sRes.incidences,
              status: sRes.incidences.some(i=>i.isError) ? 'error' : 'valid' },
          }));
        }
      }

      setBlocks(prev => ({
        ...prev,
        [key]: {
          file,
          status:       incidences.some(i => i.isError) ? 'error' : 'valid',
          rowCount,
          incidences,
          zipFileNames,
        },
      }));
    } catch {
      setBlocks(prev => ({
        ...prev,
        [key]: { ...prev[key], status:'error',
          incidences:[{ block: key === 'merchants' ? 'Comerciantes' : key === 'stores' ? 'Tiendas' : 'Imágenes',
            row:'—', detail:'Error al leer el archivo.', isError:true }] },
      }));
    }

    setExecuted(false);
    setResult(null);
    setGlobalError(null);
  };

  const handleFileSelect = (key: BlockKey, file: File | null) => {
    if (!file) return;
    // Validar extensión antes de cualquier otra cosa
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const allowedExts: Record<BlockKey, string[]> = {
      merchants: ['csv'],
      stores:    ['csv'],
      images:    ['zip'],
    };
    if (!allowedExts[key].includes(ext)) {
      alert(`Archivo inválido. Solo se permiten: ${allowedExts[key].join(', ').toUpperCase()}.\nRecibido: .${ext}`);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      alert(`El archivo supera el límite de ${MAX_FILE_MB} MB.`); return;
    }
    // Guardar file en estado y lanzar validación
    setBlocks(prev => {
      const next = { ...prev, [key]: { ...INITIAL_BLOCK, file, status:'validating' as BlockStatus } };
      validateBlock(key, file, next);
      return next;
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, key: BlockKey) => {
    e.preventDefault(); setDragOver(null);
    handleFileSelect(key, e.dataTransfer.files[0] ?? null);
  };

  // ── Ejecutar ──────────────────────────────────────────────────

  const handleExecute = async () => {
    const hasAny = Object.values(blocks).some(b => b.file !== null);
    if (!hasAny || executing) return;

    const allIncidences = [
      ...blocks.merchants.incidences,
      ...blocks.stores.incidences,
      ...blocks.images.incidences,
    ];
    const hasErrors = allIncidences.some(i => i.isError);
    if (hasErrors) return; // no ejecutar si hay errores

    setExecuting(true);
    setGlobalError(null);

    try {
      const data = await api.bulk.upload(
          blocks.merchants.file ?? undefined,
          blocks.stores.file    ?? undefined,
          blocks.images.file    ?? undefined,
      );
      setResult({
        merchantsCreated: data.merchantsCreated ?? 0,
        storesCreated:    data.storesCreated    ?? 0,
        logosProcessed:   data.logosUploaded    ?? 0,
      });
      setExecuted(true);
    } catch (err: any) {
      setGlobalError(messageFromError(err, 'Error inesperado.'));
    } finally {
      setExecuting(false);
    }
  };

  // ── Métricas ──────────────────────────────────────────────────

  const allIncidences = [
    ...blocks.merchants.incidences,
    ...blocks.stores.incidences,
    ...blocks.images.incidences,
  ];
  const errorCount = allIncidences.filter(i => i.isError).length;
  const hasBlockingErrors = errorCount > 0;

  const canExecute =
      Object.values(blocks).some(b => b.file !== null) &&
      !executing &&
      !hasBlockingErrors &&
      Object.values(blocks).every(b => b.file === null || b.status === 'valid');

  const metrics = [
    {
      label: 'COMERCIANTES',
      value: blocks.merchants.file
          ? (executed && result ? `${result.merchantsCreated}/${blocks.merchants.rowCount}` : `${blocks.merchants.rowCount}`)
          : '—',
      status: !blocks.merchants.file ? 'pending'
          : blocks.merchants.status === 'error' ? 'error'
              : blocks.merchants.status === 'valid' && executed ? 'ok'
                  : blocks.merchants.status === 'validating' ? 'pending'
                      : 'pending',
    },
    {
      label: 'TIENDAS',
      value: blocks.stores.file
          ? (executed && result ? `${result.storesCreated}/${blocks.stores.rowCount}` : `${blocks.stores.rowCount}`)
          : '—',
      status: !blocks.stores.file ? 'pending'
          : blocks.stores.status === 'error' ? 'error'
              : blocks.stores.status === 'valid' && executed ? 'ok'
                  : 'pending',
    },
    {
      label: 'LOGOS',
      value: blocks.images.file
          ? (executed && result ? String(result.logosProcessed) : String(blocks.images.rowCount))
          : '—',
      status: !blocks.images.file ? 'pending'
          : blocks.images.status === 'error' ? 'error'
              : blocks.images.status === 'valid' && executed ? 'ok'
                  : 'pending',
    },
    {
      label: 'ERRORES',
      value: String(errorCount),
      status: errorCount > 0 ? 'error' : executed ? 'ok' : 'pending',
    },
  ];

  const BLOCK_CONFIG = [
    { key:'merchants' as BlockKey, label:'Comerciantes',
      description:'Crea cuentas de comerciantes. Descarga la plantilla para ver las columnas requeridas.',
      icon:Users, accept:'.csv', onDownload:downloadMerchantsTemplate },
    { key:'stores' as BlockKey, label:'Tiendas',
      description:'Crea tiendas y las vincula a comerciantes. categoryId (ID de categoría), primaryColor, secondaryColor, tertiaryColor y merchantEmail son obligatorios.',
      icon:Store, accept:'.csv', onDownload:downloadStoresTemplate },
    { key:'images' as BlockKey, label:'ZIP de logos',
      description:'ZIP con 1 logo por tienda (png/jpg/webp, máx 2 MB). El nombre del archivo debe ser el slug.',
      icon:ImageIcon, accept:'.zip', onDownload:downloadLogosInstructions },
  ];

  // ── Render ────────────────────────────────────────────────────

  return (
      <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">
              Carga masiva
            </h2>
            <p className="text-[14px] font-medium text-neutral-400">
              Sube CSV de comerciantes, tiendas y logos en una sola operación.
              {!dataLoaded && (
                  <span className="ml-2 text-blue-500 text-[12px]">
                <Loader2 size={10} className="inline animate-spin mr-1" />
                Cargando datos del sistema...
              </span>
              )}
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

        {/* Aviso si hay errores bloqueantes */}
        {hasBlockingErrors && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-[14px] text-red-800 font-medium">
                Hay {errorCount} {errorCount === 1 ? 'error' : 'errores'} en los archivos. Corrígelos antes de ejecutar la carga.
              </p>
            </div>
        )}

        {/* Error global de red */}
        {globalError && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-[14px] text-red-800 font-medium">{globalError}</p>
            </div>
        )}

        {/* 3 bloques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOCK_CONFIG.map((block) => {
            const state = blocks[block.key];
            const Icon  = block.icon;
            const isDrag = dragOver === block.key;
            const blockErrors = state.incidences.filter(i => i.isError).length;

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
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-display font-extrabold text-brand-black">{block.label}</h3>
                      <p className="text-[12px] text-neutral-400 mt-1 leading-relaxed">{block.description}</p>
                    </div>
                    <Icon size={20} className="text-neutral-300 shrink-0 mt-1" />
                  </div>

                  {/* Badge estado */}
                  <div className="flex items-center gap-2 flex-wrap min-h-[24px]">
                    {!state.file && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-400">
                    SIN ARCHIVO
                  </span>
                    )}
                    {state.file && state.status === 'validating' && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-600 flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" /> VALIDANDO...
                  </span>
                    )}
                    {state.file && state.status === 'valid' && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle2 size={10} /> OK — {state.rowCount} {state.rowCount === 1 ? 'fila' : 'filas'}
                  </span>
                    )}
                    {state.file && state.status === 'error' && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 flex items-center gap-1">
                    <AlertCircle size={10} /> {blockErrors} {blockErrors === 1 ? 'ERROR' : 'ERRORES'}
                  </span>
                    )}
                    {state.file && state.status !== 'validating' && (
                        <span className="text-[11px] text-neutral-400 truncate max-w-[140px]" title={state.file.name}>
                    {state.file.name}
                  </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                        onClick={block.onDownload}
                        className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 bg-white text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={13} /> Descargar plantilla
                    </button>
                    <input
                        type="file"
                        ref={fileRefs[block.key]}
                        className="hidden"
                        accept={block.accept}
                        onChange={(e) => handleFileSelect(block.key, e.target.files?.[0] ?? null)}
                    />
                    <button
                        onClick={() => fileRefs[block.key].current?.click()}
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-beige text-[13px] font-bold text-brand-black hover:bg-brand-camel/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={13} />
                      {state.file ? 'Cambiar archivo' : 'Seleccionar archivo'}
                    </button>
                  </div>
                </Card>
            );
          })}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
              <Card key={m.label} className="p-5">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">{m.label}</p>
                <p className="text-[32px] font-extrabold text-brand-black leading-none mb-3">{m.value}</p>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    m.status === 'ok'    ? 'bg-green-100 text-green-700' :
                        m.status === 'error' ? 'bg-red-100 text-red-700'    :
                            'bg-neutral-100 text-neutral-500'
                }`}>
              {m.status === 'ok' ? 'COMPLETADO' : m.status === 'error' ? 'CON ERRORES' : 'PENDIENTE'}
            </span>
              </Card>
          ))}
        </div>

        {/* Referencias resueltas */}
        {executed && result && !hasBlockingErrors && (
            <div className="space-y-3">
              <h3 className="text-[20px] font-display font-extrabold text-brand-black">Referencias resueltas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label:'Comerciantes creados', count: result.merchantsCreated },
                  { label:'Tiendas creadas',      count: result.storesCreated },
                  { label:'Logos procesados',     count: result.logosProcessed },
                ].map((r, i) => (
                    <Card key={i} className="p-5 flex items-center justify-between">
                      <p className="text-[14px] font-bold text-neutral-700">{r.label}</p>
                      <span className="text-[28px] font-extrabold text-brand-black">{r.count}</span>
                    </Card>
                ))}
              </div>
            </div>
        )}

        {/* Tabla incidencias */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-display font-extrabold text-brand-black">Incidencias detectadas</h3>
            {errorCount > 0 && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
              {errorCount} {errorCount === 1 ? 'error' : 'errores'}
            </span>
            )}
          </div>
          <Card className="px-0 py-2 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f1ede4]">
                <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-6 w-[180px]">Carga masiva</th>
                  <th className="py-4 px-4 w-[80px]">Fila</th>
                  <th className="py-4 px-6">Detalle</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                {allIncidences.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-neutral-400 font-medium italic text-[14px]">
                        {Object.values(blocks).some(b => b.file)
                            ? '✓ Sin incidencias en los archivos cargados.'
                            : 'Selecciona archivos para ver la validación en tiempo real.'}
                      </td>
                    </tr>
                ) : (
                    allIncidences.map((inc, i) => (
                        <tr key={i} className={`text-[13px] transition-colors ${
                            inc.isError ? 'bg-red-50/40 hover:bg-red-50' : 'hover:bg-yellow-50/40'
                        }`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={14} className={inc.isError ? 'text-red-500 shrink-0' : 'text-yellow-500 shrink-0'} />
                              <span className="font-bold text-neutral-900">{inc.block}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-[12px] text-neutral-500">{inc.row}</td>
                          <td className="py-4 px-6 text-neutral-700">{inc.detail}</td>
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
