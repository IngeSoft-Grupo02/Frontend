/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const styles: Record<string, string> = {
    'Pendientes': 'bg-amber-100 text-amber-800 border border-amber-300 shadow-sm',
    'En revisión': 'bg-blue-100 text-blue-800 border border-blue-300 shadow-sm',
    'Propuesta enviada': 'bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm',
    'Aprobadas': 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm',
    'Rechazadas': 'bg-rose-100 text-rose-800 border border-rose-300 shadow-sm',
    'Pagado': 'bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-sm',
    'En proceso': 'bg-orange-100 text-orange-800 border border-orange-300 shadow-sm',
    'En camino': 'bg-lime-100 text-lime-800 border border-lime-300 shadow-sm',
    'Entregado': 'bg-green-100 text-green-900 border border-green-300 shadow-sm',
  };

  const currentStyle = styles[status] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`px-[10px] py-[4px] rounded-[20px] text-[10px] font-extrabold uppercase tracking-wider ${currentStyle} ${className}`}>
      {status}
    </span>
  );
};
