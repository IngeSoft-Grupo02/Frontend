import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'active' | 'suspended' | 'error' | 'warning' | 'success' | 'pending';
  className?: string;
}

export function Badge({ children, variant = 'active', className = '' }: BadgeProps) {
  const variants = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-600 text-white',
    pending: 'bg-neutral-100 text-neutral-600',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}