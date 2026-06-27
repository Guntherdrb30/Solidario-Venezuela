interface Denuncia {
  id: number;
  tipo: string;
  estado: string;
  ciudad: string;
  descripcion: string;
  fecha_hecho?: string;
  created_at: string;
}

const TIPO_CONFIG: Record<string, { label: string; icon: string; cls: string }> = {
  robo:           { label: 'Robo',              icon: '💰', cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  extorsion:      { label: 'Extorsión',         icon: '⚠️', cls: 'bg-red-100 text-red-800 border-red-200' },
  abuso_autoridad:{ label: 'Abuso de autoridad',icon: '🚔', cls: 'bg-purple-100 text-purple-800 border-purple-200' },
  secuestro:      { label: 'Secuestro',         icon: '🚨', cls: 'bg-red-200 text-red-900 border-red-300' },
  vandalismo:     { label: 'Vandalismo',         icon: '🔨', cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  otro:           { label: 'Otra anomalía',      icon: '📋', cls: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export function DenunciaCard({ denuncia }: { denuncia: Denuncia }) {
  const config = TIPO_CONFIG[denuncia.tipo] ?? TIPO_CONFIG.otro;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.cls}`}>
          <span>{config.icon}</span> {config.label}
        </span>
        <span className="text-xs text-gray-400 shrink-0">
          {new Date(denuncia.created_at).toLocaleDateString('es-VE')}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        📍 {denuncia.ciudad}, {denuncia.estado}
        {denuncia.fecha_hecho && (
          <span className="ml-2 text-gray-400">
            · ocurrió el {new Date(denuncia.fecha_hecho).toLocaleDateString('es-VE')}
          </span>
        )}
      </p>

      <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">{denuncia.descripcion}</p>

      <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Denuncia anónima
      </p>
    </div>
  );
}
