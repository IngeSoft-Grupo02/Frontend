import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'active' | 'suspended' | 'error' | 'warning' | 'success' | 'pending' | 'selected' | 'info';
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, variant = 'active', className = '', onClick }: BadgeProps) {
  const variants = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-600 text-white',
    pending: 'bg-neutral-100 text-neutral-600',
    selected: 'bg-brand-camel text-white',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span 
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${variants[variant]} ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      {children}
    </span>
  );
}