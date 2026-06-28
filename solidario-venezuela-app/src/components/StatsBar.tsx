'use client';
import { useEffect, useState } from 'react';

interface Stats {
  personas: { total: number; buscando: number; encontrado: number };
  centros: number;
  voluntarios: number;
  denuncias: number;
  donaciones: number;
  organizaciones: number;
}

export function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setStats(d as Stats));
  }, []);

  if (!stats) return null;

  const items = [
    { value: stats.donaciones,          label: 'donaciones',        icon: '💰' },
    { value: stats.organizaciones,      label: 'organizaciones',    icon: '🏛️' },
    { value: stats.personas.total,      label: 'personas',          icon: '👤' },
    { value: stats.personas.buscando,   label: 'en búsqueda',       icon: '🔍' },
    { value: stats.personas.encontrado, label: 'encontradas',       icon: '✅' },
    { value: stats.centros,             label: 'centros activos',   icon: '🏠' },
    { value: stats.voluntarios,         label: 'voluntarios',       icon: '🙋' },
    { value: stats.denuncias,           label: 'denuncias',         icon: '🚨' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-6">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5 text-sm text-white/80">
          <span>{item.icon}</span>
          <span className="font-bold text-white">{item.value}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
