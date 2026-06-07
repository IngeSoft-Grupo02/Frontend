'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TrendingUp, FileText, ShoppingBag, CreditCard, ChevronRight, BarChart3, Clock, CheckCircle } from 'lucide-react';

export default function TableroPage() {
  const { selectedStore, currentUser, cartItems } = useApp();
  const [activeTab, setActiveTab] = useState<'ventas' | 'produccion'>('ventas');

  const stats = [
    { label: 'Cotizaciones Enviadas', val: '12', icon: FileText, desc: '4 en revisión por diseño', sP: 'text-amber-500' },
    { label: 'Pedidos en Producción', val: '3', icon: ShoppingBag, desc: 'Ensamblando telas y moldes', sP: 'text-blue-500' },
    { label: 'Total Facturado', val: 'S/. 4,520', icon: CreditCard, desc: 'Con impuestos incluidos', sP: 'text-emerald-500' },
    { label: 'Ahorro Corporativo', val: '15%', icon: TrendingUp, desc: 'Por volumen de pedido', sP: 'text-violet-500' },
  ];

  const recentQuotes = [
    { id: 'COT-2026-001', product: 'Polos Premium Cuello Redondo', qty: 250, date: '04 Jun 2026', total: 'S/. 1,850', status: 'Propuesta enviada' },
    { id: 'COT-2026-002', product: 'Casacas Impermeables con Logotipo', qty: 100, date: '01 Jun 2026', total: 'S/. 3,200', status: 'En revisión' },
    { id: 'COT-2026-003', product: 'Gorras Deportivas de Sarga', qty: 500, date: '28 May 2026', total: 'S/. 2,400', status: 'Aprobadas' },
  ];

  return (
    <div id="tablero-container" className="min-h-screen bg-[var(--color-primary)] text-[var(--text-on-primary)] transition-all duration-300">
      <TopBar
        store={selectedStore}
        user={currentUser}
        onNavigate={() => {
          window.location.href = '/';
        }}
        onLogout={() => {
          window.location.href = '/iniciar-sesion';
        }}
        cartCount={cartItems.length}
      />

      <main id="tablero-main" className="max-w-6xl mx-auto px-4 py-12">
        <div id="tablero-header" className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="px-3 py-1 text-xs font-mono tracking-widest uppercase rounded-full bg-[var(--color-tertiary)] text-[var(--text-on-tertiary)] mb-3 inline-block">
              Panel del Cliente
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight font-sans">
              Resumen de Actividad
            </h1>
            <p className="text-[var(--text-on-primary)] opacity-70 mt-1 text-sm">
              Control general de tus especificaciones textiles, propuestas recibidas y estados de entrega.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => window.location.href = '/carga-masiva'}>
              Nueva Carga Masiva
            </Button>
            <Button variant="primary" onClick={() => window.location.href = '/'}>
              Ir al Catálogo
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div id="tablero-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-tertiary)] font-mono">{stat.label}</span>
                  <div className={`p-2 rounded-lg bg-white/10 ${stat.sP}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">{stat.val}</h3>
                  <p className="text-xs text-[var(--text-on-primary)] opacity-60 font-sans">{stat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Section */}
        <div id="tablero-analytics" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* SVG Vector Chart Card */}
          <div className="lg:col-span-2 p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold font-sans">Presupuesto de Pedidos por Mes</h3>
                <p className="text-xs text-[var(--text-on-primary)] opacity-60">Datos anualizados en soles peruanos (S/.)</p>
              </div>
              <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('ventas')}
                  className={`px-3 py-1 rounded-md transition-all ${activeTab === 'ventas' ? 'bg-[var(--color-tertiary)] text-[var(--text-on-tertiary)]' : 'opacity-60 hover:opacity-100'}`}
                >
                  Pedidos
                </button>
                <button
                  onClick={() => setActiveTab('produccion')}
                  className={`px-3 py-1 rounded-md transition-all ${activeTab === 'produccion' ? 'bg-[var(--color-tertiary)] text-[var(--text-on-tertiary)]' : 'opacity-60 hover:opacity-100'}`}
                >
                  Telas
                </button>
              </div>
            </div>

            {/* Custom Premium SVG Chart */}
            <div className="h-64 w-full relative mt-4 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                {/* Main Graph Area */}
                <path
                  d="M 10 180 Q 100 130 180 150 T 300 80 T 420 50 T 490 30"
                  fill="none"
                  stroke="var(--color-tertiary)"
                  strokeWidth="3.5"
                  className="transition-all duration-500"
                />

                {/* Glow representation */}
                <path
                  d="M 10 180 Q 100 130 180 150 T 300 80 T 420 50 T 490 30 L 490 200 L 10 200 Z"
                  fill="url(#gradient-chart-glow)"
                  className="transition-all duration-500"
                />

                {/* Definitions */}
                <defs>
                  <linearGradient id="gradient-chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-tertiary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--color-tertiary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Graph Points */}
                <circle cx="10" cy="180" r="5" fill="var(--color-tertiary)" stroke="white" strokeWidth="1.5" />
                <circle cx="180" cy="150" r="5" fill="var(--color-tertiary)" stroke="white" strokeWidth="1.5" />
                <circle cx="300" cy="80" r="5" fill="var(--color-tertiary)" stroke="white" strokeWidth="1.5" />
                <circle cx="420" cy="50" r="5" fill="var(--color-tertiary)" stroke="white" strokeWidth="1.5" />
                <circle cx="490" cy="30" r="5" fill="var(--color-tertiary)" stroke="white" strokeWidth="1.5" />
              </svg>
              
              {/* Custom Tooltip Overlay simulation */}
              <div className="absolute top-10 left-52 bg-card text-text-main px-3 py-1.5 rounded-lg border border-border-subtle shadow-lg scale-90 md:scale-100 flex flex-col">
                <span className="text-[10px] font-mono font-bold text-text-secondary uppercase">Enero - Mayo 2026</span>
                <span className="text-xs font-bold text-stone-900">S/. 12,480.00 COP</span>
              </div>
            </div>

            {/* Months Axis */}
            <div className="flex justify-between px-2 font-mono text-[10px] text-[var(--text-on-primary)] opacity-40 mt-3 border-t border-white/5 pt-3">
              <span>Ene</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Side distribution details */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold mb-1 font-sans">Canales de Pedidos</h3>
              <p className="text-xs text-[var(--text-on-primary)] opacity-60 mb-6">Pedidos mayoritarios corporativos por canal.</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span>Vía Cotizador Digital</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--color-tertiary)] h-full rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span>Atención Asistida WhatsApp</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span>Integraciones Masiva (.csv)</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono opacity-80 hover:opacity-100 cursor-pointer">
              <span>Descargar Reporte PDF</span>
              <ChevronRight className="w-4 h-4 text-[var(--color-tertiary)]" />
            </div>
          </div>
        </div>

        {/* Recent Quotes List in Spanish */}
        <div id="tablero-recent-quotes" className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold font-sans">Últimas Solicitudes de Cotización</h3>
              <p className="text-xs text-[var(--text-on-primary)] opacity-60">Seguimiento en tiempo real con diseñadores asignados.</p>
            </div>
            <Button variant="ghost" onClick={() => window.location.href = '/cotizaciones'}>
              Ver todas
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono text-[var(--text-on-primary)] opacity-50 uppercase tracking-widest leading-normal">
                  <th className="py-3 px-4 font-normal">ID Cotización</th>
                  <th className="py-3 px-4 font-normal">Concepto de Ropa</th>
                  <th className="py-3 px-4 font-normal">Cantidad</th>
                  <th className="py-3 px-4 font-normal">Fecha Registro</th>
                  <th className="py-3 px-4 font-normal">Precio Estimado</th>
                  <th className="py-3 px-4 font-normal">Estado actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-white/2 cursor-pointer transition-colors" onClick={() => window.location.href = '/cotizaciones'}>
                    <td className="py-4 px-4 font-mono font-bold text-[var(--color-tertiary)]">{quote.id}</td>
                    <td className="py-4 px-4 font-bold">{quote.product}</td>
                    <td className="py-4 px-4 font-mono">{quote.qty} und</td>
                    <td className="py-4 px-4 font-sans text-xs opacity-75">{quote.date}</td>
                    <td className="py-4 px-4 font-mono">{quote.total}</td>
                    <td className="py-4 px-4">
                      <Badge status={quote.status} className="!text-[9px] shadow-sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
