/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'camel' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-[var(--color-tertiary)] text-[var(--color-text-on-tertiary)] border-transparent hover:opacity-90 active:scale-[0.98]',
    secondary: 'bg-warm-bg text-text-main border-border-subtle hover:bg-border-subtle hover:text-text-main active:scale-[0.98]',
    outline: 'bg-transparent text-[var(--accent-on-light)] border-[var(--accent-on-light)] hover:bg-[var(--color-tertiary)] hover:text-[var(--color-text-on-tertiary)] active:scale-[0.98]',
    camel: 'bg-[var(--color-tertiary)] text-[var(--color-text-on-tertiary)] border-transparent hover:opacity-90 active:scale-[0.98]',
    ghost: 'bg-transparent text-text-main border-transparent hover:bg-warm-bg active:scale-[0.98]'
  };

  return (
    <button 
      className={`
        px-6 py-2.5 rounded-[12px] font-black text-[13px] transition-all duration-200 border
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center inline-flex items-center justify-center gap-2
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
