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

export function PersonaCard({ persona }: { persona: Persona }) {
  const badge = BADGE[persona.estado_busqueda] ?? BADGE.buscando;
  const initials = `${persona.nombre[0] ?? ''}${persona.apellido[0] ?? ''}`.toUpperCase();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {persona.foto_url ? (
          <img
            src={persona.foto_url}
            alt={`${persona.nombre} ${persona.apellido}`}
            className="h-16 w-16 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#eef6f1] text-[#1f7a4d] text-xl font-bold shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate">
            {persona.nombre} {persona.apellido}
          </p>
          {persona.cedula_numero && (
            <p className="text-sm text-gray-500">
              {persona.cedula_tipo ?? 'V'}-{persona.cedula_numero}
            </p>
          )}
          <p className="text-sm text-gray-500 truncate">
            {persona.ciudad}, {persona.estado}
          </p>
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
      <div className="mt-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}
