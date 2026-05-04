import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-[32px] shadow-sm border border-neutral-100 p-8 ${className}`}>
      {children}
    </div>
  );
}