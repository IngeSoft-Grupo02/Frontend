import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, children, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-[11px] font-bold text-neutral-500 uppercase ml-1">{label}</label>}
      <select
        className={`w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}