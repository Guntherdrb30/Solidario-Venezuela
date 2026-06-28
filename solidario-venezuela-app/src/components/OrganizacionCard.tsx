const TIPO_CONFIG: Record<string, { label: string; icon: string }> = {
  ong:               { label: 'ONG',                  icon: '🤝' },
  fundacion:         { label: 'Fundación',             icon: '🏛️' },
  grupo_comunitario: { label: 'Grupo Comunitario',     icon: '👥' },
  empresa:           { label: 'Empresa',               icon: '🏢' },
  iglesia:           { label: 'Iglesia / Fe',          icon: '⛪' },
  otro:              { label: 'Organización',          icon: '🌐' },
};

interface Organizacion {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  areas?: string;
  contacto_nombre: string;
  telefono?: string;
  email?: string;
  website?: string;
  estado?: string;
  ciudad?: string;
  pais_sede: string;
  rif?: string;
  verificada: boolean;
  created_at: string;
}

export function OrganizacionCard({ org }: { org: Organizacion }) {
  const tipo = TIPO_CONFIG[org.tipo] ?? TIPO_CONFIG.otro;
  const areas = org.areas ? org.areas.split(',').map(a => a.trim()).filter(Boolean) : [];

  const shareWA = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `*Solidario Venezuela — Organización*\n${tipo.icon} *${org.nombre}*\n${tipo.label}${org.verificada ? ' ✅ Verificada' : ''}\n📍 ${org.ciudad ? `${org.ciudad}, ` : ''}${org.pais_sede}${org.telefono ? `\n📞 ${org.telefono}` : ''}${org.email ? `\n✉️ ${org.email}` : ''}${org.website ? `\n🌐 ${org.website}` : ''}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef6f1] text-2xl">
          {tipo.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900 leading-tight">{org.nombre}</p>
            {org.verificada && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6f1] border border-[#1f7a4d]/30 px-2 py-0.5 text-xs font-semibold text-[#1f7a4d]">
                ✅ Verificada
              </span>
            )}
          </div>
          <p className="text-xs text-[#1f7a4d] font-medium">{tipo.label}</p>
          <p className="text-xs text-gray-500">
            📍 {org.ciudad ? `${org.ciudad}, ` : ''}{org.estado ? `${org.estado}, ` : ''}{org.pais_sede}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-3">{org.descripcion}</p>

      {areas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {areas.map(area => (
            <span key={area} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{area}</span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mb-3">Contacto: <span className="font-medium text-gray-700">{org.contacto_nombre}</span></p>

      <div className="flex items-center gap-2 flex-wrap">
        {org.telefono && (
          <a href={`tel:${org.telefono}`}
            className="inline-flex items-center gap-1 rounded-lg bg-[#eef6f1] px-2.5 py-1.5 text-xs font-medium text-[#1f7a4d] hover:bg-[#d9ede3]">
            📞 Llamar
          </a>
        )}
        {org.email && (
          <a href={`mailto:${org.email}`}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">
            ✉️ Email
          </a>
        )}
        {org.website && (
          <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
            🌐 Web
          </a>
        )}
        <button onClick={shareWA}
          className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 ml-auto">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Compartir
        </button>
      </div>
    </div>
  );
}
