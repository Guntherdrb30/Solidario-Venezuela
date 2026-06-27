'use client';
import { useEffect, useState } from 'react';

interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  tipo: 'info' | 'alerta' | 'urgente';
  created_at: string;
}

const AVISO_STYLE: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  urgente: { bg: 'bg-red-50',    border: 'border-red-400',    icon: '🚨', text: 'text-red-800' },
  alerta:  { bg: 'bg-yellow-50', border: 'border-yellow-400', icon: '⚠️', text: 'text-yellow-800' },
  info:    { bg: 'bg-blue-50',   border: 'border-blue-400',   icon: 'ℹ️', text: 'text-blue-800' },
};

export function AvisoBanner() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('/api/avisos').then(r => r.json()).then(d => setAvisos(d as Aviso[]));
  }, []);

  const visible = avisos.filter(a => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-5 pt-4 space-y-2">
      {visible.map(aviso => {
        const s = AVISO_STYLE[aviso.tipo] ?? AVISO_STYLE.info;
        return (
          <div key={aviso.id}
            className={`flex items-start gap-3 rounded-xl border-l-4 px-4 py-3 ${s.bg} ${s.border}`}>
            <span className="text-xl shrink-0">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${s.text}`}>{aviso.titulo}</p>
              <p className={`text-xs mt-0.5 ${s.text} opacity-80`}>{aviso.contenido}</p>
            </div>
            <button
              onClick={() => setDismissed(prev => new Set([...prev, aviso.id]))}
              className={`shrink-0 text-lg leading-none ${s.text} opacity-50 hover:opacity-100`}>
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
