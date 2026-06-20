import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-white rounded-[32px] shadow-sm border border-neutral-100 p-8 ${className}`} {...props}>
      {children}
    </div>
  );
}