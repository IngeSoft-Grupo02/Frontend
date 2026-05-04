'use client';

import { Plus } from 'lucide-react';
import { Button, Card } from '../UI';

interface DashboardScreenProps {
  stores: any[];
  onCreateStore: () => void;
}

export function DashboardScreen({ stores, onCreateStore }: DashboardScreenProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[34px] font-display font-extrabold tracking-tight">Dashboard de plataforma</h2>
          <p className="text-[14px] text-neutral-400">Visión ejecutiva del ecosistema multi-tenant</p>
        </div>
        <Button onClick={onCreateStore} className="rounded-full">
          <Plus size={14} className="mr-2" /> Nueva tienda
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <p className="text-[11px] text-neutral-400">Tiendas activas</p>
          <p className="text-[32px] font-extrabold">128</p>
        </Card>
        <Card>
          <p className="text-[11px] text-neutral-400">Usuarios</p>
          <p className="text-[32px] font-extrabold">764</p>
        </Card>
      </div>
    </div>
  );
}