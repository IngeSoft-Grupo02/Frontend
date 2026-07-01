import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label = 'Cargando...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-3 text-[13px] font-bold text-neutral-500 ${className}`}>
      <Loader2 size={20} className="animate-spin" />
      <span>{label}</span>
    </div>
  );
}
