import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'activo' | 'suspendido' | 'error' | 'alerta' | 'exito' | 'pendiente' | 'seleccionado' | 'info';
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, variant = 'activo', className = '', onClick }: BadgeProps) {
  const variants: Record<string, string> = {
    activo:       'bg-green-100 text-green-800',
    suspendido:   'bg-red-100 text-red-800',
    error:        'bg-red-600 text-white',
    alerta:       'bg-yellow-100 text-yellow-800',
    exito:        'bg-green-600 text-white',
    pendiente:    'bg-neutral-100 text-neutral-600',
    seleccionado: 'bg-brand-camel text-white',
    info:         'bg-blue-100 text-blue-800',
    // Aliases inglés → español para compatibilidad retroactiva
    active:    'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    warning:   'bg-yellow-100 text-yellow-800',
    success:   'bg-green-600 text-white',
    pending:   'bg-neutral-100 text-neutral-600',
    selected:  'bg-brand-camel text-white',
  };

  return (
    <span
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${variants[variant as string] ?? variants.pendiente} ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      {children}
    </span>
  );
}
