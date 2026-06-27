import Link from 'next/link';

interface Centro {
  id: number;
  nombre: string;
  tipo?: string;
  estado: string;
  ciudad: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  horario?: string;
  descripcion?: string;
}

export function CentroCard({ centro }: { centro: Centro }) {
  return (
    <Link href={`/centros/${centro.id}`} className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow hover:border-[#1f7a4d]/30 cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{centro.nombre}</p>
          <p className="text-sm text-gray-500">{centro.ciudad}, {centro.estado}</p>
        </div>
        {centro.tipo && (
          <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {centro.tipo}
          </span>
        )}
      </div>
      {centro.direccion && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{centro.direccion}</p>
      )}
      {centro.descripcion && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{centro.descripcion}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        {centro.telefono && <span>📞 {centro.telefono}</span>}
        {centro.email && <span>✉️ {centro.email}</span>}
        {centro.horario && <span>🕐 {centro.horario}</span>}
      </div>
    </Link>
  );
}
