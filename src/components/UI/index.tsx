'use client';

import { ChevronDown } from 'lucide-react';
import React from 'react';

// Badge
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'active' | 'suspended' | 'inactive' | 'pending' | 'alerta' | 'selected';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '', ...props }) => {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-gray-100 text-gray-600',
    active: 'bg-[#e2ead8] text-[#6d7a5b]',
    suspended: 'bg-[#f1ede4] text-[#bca37d]',
    inactive: 'bg-[#fee2e2] text-[#991b1b]',
    pending: 'bg-gray-100 text-gray-400',
    selected: 'bg-[#0a0a0a] text-white',
    alerta: 'bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]',
  };

  const isClickable = !!props.onClick;

  return (
    <span 
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider select-none transition-all duration-200 ${variants[variant]} ${isClickable ? 'cursor-pointer active:scale-95' : ''} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'beige' | 'danger' | 'active';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-extrabold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-brand-black text-white hover:bg-neutral-800',
    secondary: 'bg-white text-brand-black border border-neutral-200 hover:bg-neutral-50',
    destructive: 'bg-[#a64d3b] text-white hover:bg-[#8f4132]',
    outline: 'bg-transparent border border-brand-black text-brand-black hover:bg-neutral-50',
    ghost: 'bg-transparent text-brand-black hover:bg-neutral-100',
    beige: 'bg-brand-beige-dark text-brand-black hover:bg-neutral-200',
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
};

// Card
export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl card-shadow p-6 ${className}`}>
    {children}
  </div>
);

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: any;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon: Icon, rightElement, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon size={16} className="text-neutral-400" />
        </div>
      )}
      <input 
        className={`w-full h-11 ${Icon ? 'pl-11' : 'px-4'} ${rightElement ? 'pr-11' : 'px-4'} bg-white border border-neutral-200 rounded-xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors ${error ? 'border-red-500 bg-red-50' : ''} ${className}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
    {error && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase">{error}</p>}
  </div>
);

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, className = '', children, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 ml-1 uppercase">{label}</label>}
    <div className="relative">
      <select 
        className={`w-full h-11 px-4 bg-white border border-neutral-200 rounded-xl text-[14px] font-medium appearance-none outline-none focus:border-brand-camel transition-colors cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={14} className="text-neutral-400" />
      </div>
    </div>
  </div>
);