import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ElementType;
}

export function Input({ label, error, icon: Icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-[11px] font-bold text-neutral-500 uppercase ml-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />}
        <input
          className={`w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-[14px] font-medium outline-none focus:border-brand-camel transition-colors ${Icon ? 'pl-12' : ''} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[12px] text-red-500 font-bold ml-1">{error}</p>}
    </div>
  );
}