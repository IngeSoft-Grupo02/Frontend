/**
@license
SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

// --- Badge ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'black';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-brand-neutral-mid text-brand-black',
    secondary: 'bg-brand-neutral-mid text-brand-text-muted',
    success: 'bg-[#E7F3E9] text-[#2D6A4F] border border-[#2D6A4F]/10',
    warning: 'bg-[#FFF9E6] text-[#B28228] border border-[#B28228]/10',
    danger: 'bg-[#FFE9E9] text-[#C53030] border border-[#C53030]/10',
    info: 'bg-[#EBF8FF] text-[#2B6CB0] border border-[#2B6CB0]/10',
    outline: 'bg-transparent border border-brand-neutral-border text-brand-text-muted',
    black: 'bg-brand-black text-white'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'camel' | 'brand';  // ← AGREGADO 'brand'
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-brand-black text-white hover:bg-brand-black/90 shadow-sm',
    secondary: 'bg-brand-neutral-mid text-brand-black hover:bg-brand-neutral-border',
    outline: 'bg-transparent border-2 border-brand-black text-brand-black hover:bg-brand-black/5',
    ghost: 'bg-transparent text-brand-text-muted hover:bg-brand-neutral-mid hover:text-brand-black',
    danger: 'bg-[#FFE9E9] text-[#C53030] hover:bg-[#FFD1D1]',
    camel: 'bg-brand-camel text-white hover:bg-brand-camel/90 shadow-sm',
    brand: 'bg-brand-black text-white hover:bg-brand-black/90 shadow-lg'  // ← AGREGADO
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2 text-[12px]',
    lg: 'px-6 py-3 text-[14px]',
    icon: 'p-2'
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-extrabold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, headerAction }) => (
  <div className={`bg-white rounded-2xl border border-brand-neutral-border card-shadow overflow-hidden ${className}`}>
    {(title || subtitle || headerAction) && (
      <div className="px-6 py-5 border-b border-brand-neutral-border flex items-center justify-between">
        <div>
          {title && <h3 className="text-[16px] font-extrabold text-brand-black tracking-tight">{title}</h3>}
          {subtitle && <p className="text-[12px] text-brand-text-muted mt-0.5">{subtitle}</p>}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-[11px] font-bold text-brand-black uppercase tracking-wider">{label}</label>}
    <input 
      className={`bg-white border border-brand-neutral-border rounded-xl px-4 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black transition-all ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <span className="text-[10px] text-red-500 font-bold uppercase">{error}</span>}
  </div>
);