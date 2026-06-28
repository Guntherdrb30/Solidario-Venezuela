const TIPO_CONFIG: Record<string, { label: string; icon: string; cls: string }> = {
  personas_atrapadas: { label: 'Personas atrapadas', icon: '🆘', cls: 'bg-red-200 text-red-900 border-red-300' },
  heridos:            { label: 'Heridos',             icon: '🚑', cls: 'bg-orange-100 text-orange-900 border-orange-200' },
  incendio:           { label: 'Incendio',            icon: '🔥', cls: 'bg-red-100 text-red-800 border-red-200' },
  derrumbe:           { label: 'Derrumbe',            icon: '🏚️', cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  fuga_gas:           { label: 'Fuga de gas',         icon: '⚠️', cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  otro:               { label: 'Emergencia',          icon: '📢', cls: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const ESTADO_SOLICITUD: Record<string, { label: string; dot: string }> = {
  activa:     { label: 'Activa',      dot: 'bg-red-500' },
  en_proceso: { label: 'En proceso',  dot: 'bg-yellow-500' },
  resuelta:   { label: 'Resuelta',    dot: 'bg-green-500' },
};

interface Rescate {
  id: number;
  tipo_emergencia: string;
  estado: string;
  ciudad: string;
  direccion: string;
  descripcion: string;
  personas_involucradas?: number;
  contacto_nombre?: string;
  contacto_telefono?: string;
  latitud?: number;
  longitud?: number;
  estado_solicitud: string;
  created_at: string;
}

export function RescateCard({ rescate }: { rescate: Rescate }) {
  const tipo = TIPO_CONFIG[rescate.tipo_emergencia] ?? TIPO_CONFIG.otro;
  const est = ESTADO_SOLICITUD[rescate.estado_solicitud] ?? ESTADO_SOLICITUD.activa;

  const shareWA = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `*🆘 SOLICITUD DE RESCATE — Solidario Venezuela*\n🚨 ${tipo.label}\n📍 ${rescate.direccion}, ${rescate.ciudad}, ${rescate.estado}${rescate.personas_involucradas ? `\n👥 ${rescate.personas_involucradas} personas involucradas` : ''}${rescate.contacto_telefono ? `\n📞 Contacto: ${rescate.contacto_telefono}` : ''}\n📝 ${rescate.descripcion}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="rounded-xl border-2 border-red-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${tipo.cls}`}>
          {tipo.icon} {tipo.label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`h-2 w-2 rounded-full ${est.dot}`} />
          <span className="text-xs text-gray-500">{est.label}</span>
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-900">📍 {rescate.direccion}</p>
      <p className="text-xs text-gray-500 mt-0.5">{rescate.ciudad}, {rescate.estado}</p>

      {rescate.personas_involucradas && (
        <p className="mt-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md px-2 py-1">
          👥 {rescate.personas_involucradas} persona{rescate.personas_involucradas !== 1 ? 's' : ''} involucrada{rescate.personas_involucradas !== 1 ? 's' : ''}
        </p>
      )}

      <p className="mt-2 text-sm text-gray-700 leading-relaxed line-clamp-3">{rescate.descripcion}</p>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {rescate.contacto_telefono && (
          <a href={`tel:${rescate.contacto_telefono}`}
            className="inline-flex items-center gap-1 rounded-lg bg-[#eef6f1] px-2.5 py-1.5 text-xs font-medium text-[#1f7a4d] hover:bg-[#d9ede3]">
            📞 {rescate.contacto_telefono}
          </a>
        )}
        {rescate.latitud && rescate.longitud && (
          <a href={`https://www.google.com/maps?q=${rescate.latitud},${rescate.longitud}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
            🗺️ Ver mapa
          </a>
        )}
        <button onClick={shareWA}
          className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 ml-auto">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Difundir
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">{new Date(rescate.created_at).toLocaleDateString('es-VE')} {new Date(rescate.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</p>
    </div>
  );
}
