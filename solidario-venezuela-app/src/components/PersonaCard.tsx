import Link from 'next/link';

interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  cedula_tipo?: string;
  cedula_numero?: string;
  estado: string;
  ciudad: string;
  foto_url?: string;
  ultima_vez_fecha?: string;
  estado_busqueda: string;
  descripcion?: string;
}

const BADGE: Record<string, { label: string; cls: string }> = {
  buscando:   { label: 'En búsqueda',  cls: 'bg-yellow-100 text-yellow-800' },
  encontrado: { label: 'Encontrado/a', cls: 'bg-green-100 text-green-800' },
  descartado: { label: 'Caso cerrado', cls: 'bg-gray-100 text-gray-600' },
};

function WhatsAppBtn({ persona }: { persona: Persona }) {
  const share = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/personas/${persona.id}`;
    const estado = persona.estado_busqueda === 'buscando' ? '🔍 EN BÚSQUEDA' : persona.estado_busqueda === 'encontrado' ? '✅ ENCONTRADO/A' : 'Caso cerrado';
    const text = `*Solidario Venezuela* — ${estado}\n👤 *${persona.nombre} ${persona.apellido}*${persona.cedula_numero ? `\n🪪 ${persona.cedula_tipo ?? 'V'}-${persona.cedula_numero}` : ''}\n📍 ${persona.ciudad}, ${persona.estado}${persona.ultima_vez_fecha ? `\n📅 Último aviso: ${new Date(persona.ultima_vez_fecha).toLocaleDateString('es-VE')}` : ''}\n🔗 ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };
  return (
    <button onClick={share}
      className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      WhatsApp
    </button>
  );
}

export function PersonaCard({ persona }: { persona: Persona }) {
  const badge = BADGE[persona.estado_busqueda] ?? BADGE.buscando;
  const initials = `${persona.nombre[0] ?? ''}${persona.apellido[0] ?? ''}`.toUpperCase();

  return (
    <Link href={`/personas/${persona.id}`} className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow hover:border-[#1f7a4d]/30 cursor-pointer">
      <div className="flex gap-4">
        {persona.foto_url ? (
          <img src={persona.foto_url} alt={`${persona.nombre} ${persona.apellido}`}
            className="h-16 w-16 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#eef6f1] text-[#1f7a4d] text-xl font-bold shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate">{persona.nombre} {persona.apellido}</p>
          {persona.cedula_numero && (
            <p className="text-sm text-gray-500">{persona.cedula_tipo ?? 'V'}-{persona.cedula_numero}</p>
          )}
          <p className="text-sm text-gray-500 truncate">{persona.ciudad}, {persona.estado}</p>
          {persona.ultima_vez_fecha && (
            <p className="text-xs text-gray-400 mt-0.5">
              Último aviso: {new Date(persona.ultima_vez_fecha).toLocaleDateString('es-VE')}
            </p>
          )}
        </div>
      </div>
      {persona.descripcion && (
        <p className="mt-2 text-xs text-gray-500 line-clamp-2">{persona.descripcion}</p>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
          {badge.label}
        </span>
        <WhatsAppBtn persona={persona} />
      </div>
    </Link>
  );
}
