'use client';

import { useState } from 'react';
import { Button, Card, Badge, Input, Select } from '../UI';
import { 
  Search, 
  Download, 
  ShieldAlert, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Filter 
} from 'lucide-react';
import { MOCK_AUDIT } from '@/mockData';

interface AuditLog {
  time: string;
  user: string;
  role: string;
  tenant: string;
  action: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

interface AuditoriaScreenProps {
  logs: typeof MOCK_AUDIT;
}

export function AuditoriaScreen({ logs }: AuditoriaScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterDate, setFilterDate] = useState('Hoy');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filterLevel === 'Todos' || log.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      case 'SUCCESS': return 'success';
      default: return 'info';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <ShieldAlert size={14} />;
      case 'WARNING': return <AlertTriangle size={14} />;
      case 'SUCCESS': return <CheckCircle size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[34px] font-display font-extrabold tracking-tight text-brand-black">
            Auditoría del sistema
          </h2>
          <p className="text-[14px] font-medium text-neutral-400">
            Registro inmutable de eventos y cambios críticos
          </p>
        </div>
        <Button variant="secondary" className="rounded-full h-12 px-6">
          <Download size={16} className="mr-2" /> Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="sm:col-span-2">
          <Input 
            label="Buscar evento" 
            placeholder="Usuario, acción o tienda..." 
            icon={Search} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select 
            label="Nivel" 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option>Todos</option>
            <option>INFO</option>
            <option>SUCCESS</option>
            <option>WARNING</option>
            <option>ERROR</option>
          </Select>
        </div>
        <div>
          <Select 
            label="Rango"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option>Hoy</option>
            <option>Últimos 7 días</option>
            <option>Este mes</option>
          </Select>
        </div>
      </div>

      <Card className="px-0 py-2 overflow-hidden">
        <div className="px-8 py-4 mb-2">
          <h3 className="text-[18px] font-display font-extrabold text-brand-black">
            Timeline de actividad
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-[#f1ede4]">
              <tr className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-4 px-8">Timestamp</th>
                <th className="py-4 px-4">Usuario</th>
                <th className="py-4 px-4">Tienda / Tenant</th>
                <th className="py-4 px-4">Acción</th>
                <th className="py-4 px-8 text-right">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLogs.map((log, i) => (
                <tr key={i} className="text-[13px] hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-8 font-medium text-neutral-500 font-mono text-[11px]">
                    {log.time}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-bold text-neutral-900">{log.user}</p>
                      <p className="text-[10px] text-neutral-400">{log.role}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-neutral-600">
                    {log.tenant}
                  </td>
                  <td className="py-4 px-4 font-bold text-brand-black uppercase tracking-tight text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-4 px-8 text-right">
                    <Badge 
                      variant={getLevelColor(log.level) as any}
                      className="flex items-center justify-center gap-1 w-fit ml-auto"
                    >
                      {getLevelIcon(log.level)} {log.level}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400 font-medium italic">
                    No se encontraron registros con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}