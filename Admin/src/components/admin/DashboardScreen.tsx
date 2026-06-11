'use client';

import { MOCK_AUDIT, MOCK_STORES, MOCK_USERS } from '@/lib/mockData';
import { Plus, ShieldCheck, Store, Tag, Users } from 'lucide-react';
import { Badge, Button, Card } from '../UI';

const NIVEL_ES: Record<string, string> = {
  INFO:    'Info',
  SUCCESS: 'Éxito',
  WARNING: 'Alerta',
  ERROR:   'Error',
};

const NIVEL_VARIANT: Record<string, string> = {
  INFO:    'info',
  SUCCESS: 'exito',
  WARNING: 'alerta',
  ERROR:   'error',
};

interface DashboardScreenProps {
  stores: typeof MOCK_STORES;
  onCreateStore: () => void;
}

export function DashboardScreen({ stores, onCreateStore }: DashboardScreenProps) {
  const activeStores    = stores.filter(s => s.status === 'Activa').length;
  const suspendedStores = stores.filter(s => s.status === 'Suspendida').length;
  const totalUsers      = MOCK_USERS.length;
  const totalCategories = 3;

  const recentLogs = MOCK_AUDIT.slice(0, 5);

  return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[34px] font-display font-extrabold tracking-tight">
              Dashboard de plataforma
            </h2>
            <p className="text-[14px] text-neutral-400">Visión ejecutiva del ecosistema multi-tenant</p>
          </div>
          <Button onClick={onCreateStore} className="rounded-full">
            <Plus size={14} className="mr-2" /> Nueva tienda
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Tiendas activas</p>
              <Store size={16} className="text-neutral-300" />
            </div>
            <p className="text-[40px] font-extrabold leading-none">{activeStores}</p>
            {suspendedStores > 0 && (
                <p className="text-[12px] text-neutral-400 mt-2">{suspendedStores} suspendida(s)</p>
            )}
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Usuarios</p>
              <Users size={16} className="text-neutral-300" />
            </div>
            <p className="text-[40px] font-extrabold leading-none">{totalUsers}</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Categorías</p>
              <Tag size={16} className="text-neutral-300" />
            </div>
            <p className="text-[40px] font-extrabold leading-none">{totalCategories}</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total tenants</p>
              <ShieldCheck size={16} className="text-neutral-300" />
            </div>
            <p className="text-[40px] font-extrabold leading-none">{stores.length}</p>
          </Card>
        </div>

        {/* Tiendas recientes */}
        <Card className="px-0 py-2 overflow-hidden">
          <div className="px-8 py-4 mb-2">
            <h3 className="text-[18px] font-display font-extrabold text-brand-black">Tiendas registradas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[#f1ede4]">
              <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-4 px-8">Nombre</th>
                <th className="py-4 px-4">Responsable</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-8 text-right">Registro</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
              {stores.map((store, i) => (
                  <tr key={i} className="text-[13px] hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-8 font-extrabold text-neutral-900">{store.name}</td>
                    <td className="py-4 px-4 font-mono text-[12px] text-neutral-500">{store.responsible}</td>
                    <td className="py-4 px-4">
                      <Badge variant={
                        store.status === 'Activa'      ? 'activo' :
                            store.status === 'Suspendida'  ? 'suspendido' : 'pendiente'
                      }>
                        {store.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-8 text-right font-medium text-neutral-400">{store.registrationDate}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Actividad reciente */}
        <Card className="px-0 py-2 overflow-hidden">
          <div className="px-8 py-4 mb-2">
            <h3 className="text-[18px] font-display font-extrabold text-brand-black">Actividad reciente</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-[#f1ede4]">
              <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-4 px-8">Fecha / Hora</th>
                <th className="py-4 px-4">Usuario</th>
                <th className="py-4 px-4">Acción</th>
                <th className="py-4 px-8 text-right">Nivel</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
              {recentLogs.map((log, i) => (
                  <tr key={i} className="text-[13px] hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-8 font-mono text-[11px] text-neutral-400">{log.time}</td>
                    <td className="py-4 px-4 font-bold text-neutral-800">{log.user}</td>
                    <td className="py-4 px-4 font-bold uppercase text-[11px] tracking-tight text-neutral-700">{log.action}</td>
                    <td className="py-4 px-8 text-right">
                      <Badge variant={NIVEL_VARIANT[log.level] as any}>
                        {NIVEL_ES[log.level] ?? log.level}
                      </Badge>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
  );
}