const CATEGORIA_CONFIG: Record<string, { label: string; icon: string; cls: string }> = {
  damnificados:  { label: 'Damnificados',       icon: '🏚️', cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  ninos:         { label: 'Niños y Niñas',       icon: '👶', cls: 'bg-pink-100 text-pink-800 border-pink-200' },
  vivienda:      { label: 'Vivienda',            icon: '🏠', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  alimentacion:  { label: 'Alimentación',        icon: '🍎', cls: 'bg-green-100 text-green-800 border-green-200' },
  medicinas:     { label: 'Medicinas/Salud',     icon: '💊', cls: 'bg-red-100 text-red-800 border-red-200' },
  educacion:     { label: 'Educación',           icon: '📚', cls: 'bg-purple-100 text-purple-800 border-purple-200' },
  ropa:          { label: 'Ropa e Insumos',      icon: '👕', cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  rescate:       { label: 'Rescate/Emergencias', icon: '🆘', cls: 'bg-red-200 text-red-900 border-red-300' },
  otro:          { label: 'Otra causa',          icon: '💛', cls: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const ESTADO_CONFIG: Record<string, { label: string; dot: string }> = {
  disponible:  { label: 'Disponible',  dot: 'bg-green-500' },
  en_proceso:  { label: 'En proceso',  dot: 'bg-yellow-500' },
  entregada:   { label: 'Entregada',   dot: 'bg-blue-500' },
};

const TIPO_LABEL: Record<string, string> = {
  dinero:  '💵 Dinero',
  especie: '📦 Especie',
  mixto:   '💵📦 Mixto',
};

interface Donacion {
  id: number;
  tipo: string;
  monto?: number;
  moneda?: string;
  descripcion_especie?: string;
  categoria: string;
  proposito: string;
  donante_nombre: string;
  donante_empresa?: string;
  donante_pais: string;
  donante_telefono?: string;
  donante_email?: string;
  org_nombre?: string;
  estado: string;
  created_at: string;
}

export function DonacionCard({ donacion }: { donacion: Donacion }) {
  const cat = CATEGORIA_CONFIG[donacion.categoria] ?? CATEGORIA_CONFIG.otro;
  const est = ESTADO_CONFIG[donacion.estado] ?? ESTADO_CONFIG.disponible;

  const shareWA = (e: React.MouseEvent) => {
    e.preventDefault();
    const montoStr = donacion.monto ? ` · ${donacion.moneda ?? 'USD'} ${Number(donacion.monto).toLocaleString()}` : '';
    const text = `*💰 DONACIÓN — Solidario Venezuela*\n${cat.icon} ${cat.label}${montoStr}\n🌍 Donante: ${donacion.donante_empresa ?? donacion.donante_nombre} (${donacion.donante_pais})\n📝 Propósito: ${donacion.proposito}${donacion.org_nombre ? `\n🏛️ Asignada a: ${donacion.org_nombre}` : ''}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${cat.cls}`}>
          {cat.icon} {cat.label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`h-2 w-2 rounded-full ${est.dot}`} />
          <span className="text-xs text-gray-500">{est.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs text-gray-500">{TIPO_LABEL[donacion.tipo] ?? '💛'}</span>
        {donacion.monto && (
          <span className="text-sm font-bold text-[#1f7a4d]">
            {donacion.moneda ?? 'USD'} {Number(donacion.monto).toLocaleString('es-VE')}
          </span>
        )}
      </div>

      <p className="text-sm font-semibold text-gray-900">{donacion.donante_empresa ?? donacion.donante_nombre}</p>
      {donacion.donante_empresa && (
        <p className="text-xs text-gray-500">Responsable: {donacion.donante_nombre}</p>
      )}
      <p className="text-xs text-gray-400">🌍 {donacion.donante_pais}</p>

      <p className="mt-2 text-xs text-gray-700 leading-relaxed line-clamp-3">
        <span className="font-medium text-gray-600">Propósito:</span> {donacion.proposito}
      </p>

      {donacion.descripcion_especie && (
        <p className="mt-1 text-xs text-gray-500 italic line-clamp-2">📦 {donacion.descripcion_especie}</p>
      )}

      {donacion.org_nombre && (
        <div className="mt-2 rounded-lg bg-[#eef6f1] border border-[#1f7a4d]/20 px-2.5 py-1.5">
          <p className="text-xs text-[#1f7a4d] font-medium">🏛️ Asignada a: {donacion.org_nombre}</p>
        </div>
      )}

      {!donacion.org_nombre && donacion.estado === 'disponible' && (
        <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-200 px-2.5 py-1.5">
          <p className="text-xs text-yellow-800 font-medium">⏳ Busca organización receptora</p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {donacion.donante_telefono && (
          <a href={`tel:${donacion.donante_telefono}`}
            className="inline-flex items-center gap-1 rounded-lg bg-[#eef6f1] px-2.5 py-1.5 text-xs font-medium text-[#1f7a4d] hover:bg-[#d9ede3]">
            📞 Contactar
          </a>
        )}
        {donacion.donante_email && (
          <a href={`mailto:${donacion.donante_email}`}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">
            ✉️ Email
          </a>
        )}
        <button onClick={shareWA}
          className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 ml-auto">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Difundir
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">{new Date(donacion.created_at).toLocaleDateString('es-VE')}</p>
    </div>
  );
}
