import React from 'react';

// 1. Definir la interfaz ButtonProps
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'active' | 'beige' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-bold transition-colors';
  
  // 2. Tipar el objeto variants correctamente
  const variants: Record<string, string> = {
    primary: 'bg-brand-black text-white hover:bg-neutral-800',
    secondary: 'bg-brand-beige-light text-brand-black hover:bg-neutral-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    active: 'bg-brand-black text-white',
    beige: 'bg-brand-beige-dark text-brand-black hover:bg-neutral-200',
    outline: 'bg-transparent border border-brand-black text-brand-black hover:bg-neutral-50',
    ghost: 'bg-transparent text-brand-black hover:bg-neutral-100',
    destructive: 'bg-[#a64d3b] text-white hover:bg-[#8f4132]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-[11px]',
    md: 'h-10 px-5 text-[12px]',
    lg: 'h-12 px-8 text-[14px]',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}

// Exportar el tipo para que otros archivos puedan usarlo
export type { ButtonProps };