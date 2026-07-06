'use client';

import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface FloatingToastProps {
  message: string | null;
  variant?: ToastVariant;
  onClose?: () => void;
}

const toastStyles: Record<ToastVariant, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

const toastIcons: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function FloatingToast({ message, variant = 'success', onClose }: FloatingToastProps) {
  if (!message) return null;
  const Icon = toastIcons[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`fixed bottom-5 right-5 z-[220] flex w-[calc(100vw-2.5rem)] max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-[13px] font-bold shadow-2xl shadow-black/10 animate-in slide-in-from-bottom-3 fade-in ${toastStyles[variant]}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="min-w-0 flex-1 leading-relaxed">{message}</p>
      {onClose && (
        <button
          type="button"
          aria-label="Cerrar mensaje"
          onClick={onClose}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning' | 'success';
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const confirmButtonStyles: Record<NonNullable<ConfirmDialogProps['tone']>, string> = {
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-brand-black text-white hover:bg-neutral-800',
  success: 'bg-green-600 text-white hover:bg-green-700',
};

const confirmIconStyles: Record<NonNullable<ConfirmDialogProps['tone']>, string> = {
  danger: 'bg-red-50 text-red-600',
  warning: 'bg-amber-50 text-amber-700',
  success: 'bg-green-50 text-green-700',
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'warning',
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-brand-black/35 p-5 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white p-7 shadow-2xl shadow-black/20 animate-in zoom-in-95 duration-150">
        <div className="mb-5 flex items-start gap-4">
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${confirmIconStyles[tone]}`}>
            <AlertTriangle size={22} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[22px] font-black tracking-tight text-brand-black">{title}</h3>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-neutral-500">{message}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-12 rounded-2xl border border-neutral-200 bg-white px-6 text-[13px] font-black text-brand-black hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`h-12 rounded-2xl px-6 text-[13px] font-black disabled:cursor-not-allowed disabled:opacity-60 ${confirmButtonStyles[tone]}`}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
