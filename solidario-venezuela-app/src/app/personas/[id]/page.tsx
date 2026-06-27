'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  cedula_tipo?: string;
  cedula_numero?: string;
  fecha_nacimiento?: string;
  genero?: string;
  estado: string;
  ciudad: string;
  telefono?: string;
  email?: string;
  foto_url?: string;
  ultima_vez_fecha?: string;
  ultima_vez_lugar?: string;
  descripcion?: string;
  estado_busqueda: string;
  latitud?: number;
  longitud?: number;
  created_at: string;
}

const BADGE: Record<string, { label: string; cls: string }> = {
  buscando:   { label: 'En búsqueda',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  encontrado: { label: 'Encontrado/a', cls: 'bg-green-100 text-green-800 border-green-200' },
  descartado: { label: 'Caso cerrado', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

function ShareButton({ persona }: { persona: Persona }) {
  const share = async () => {
    const url = window.location.href;
    const text = `${persona.nombre} ${persona.apellido} — ${persona.ciudad}, ${persona.estado}. ${
      persona.estado_busqueda === 'buscando' ? '🔍 En búsqueda.' : persona.estado_busqueda === 'encontrado' ? '✅ Encontrado/a.' : 'Caso cerrado.'
    }`;
    if (navigator.share) {
      await navigator.share({ title: `${persona.nombre} ${persona.apellido} — Solidario Venezuela`, text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Enlace copiado al portapapeles.');
    }
  };
  return (
    <button onClick={share}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Compartir
    </button>
  );
}

export default function PersonaDetalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/personas/${id}`)
      .then(r => r.json())
      .then(d => setPersona(d as Persona))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1f7a4d] border-t-transparent" />
    </div>
  );

  if (!persona || 'error' in (persona as object)) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-gray-500">Persona no encontrada.</p>
      <Link href="/" className="text-[#1f7a4d] underline text-sm">Volver al inicio</Link>
    </div>
  );

  const badge = BADGE[persona.estado_busqueda] ?? BADGE.buscando;
  const initials = `${persona.nombre[0]}${persona.apellido[0]}`.toUpperCase();

  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      <div className="mx-auto max-w-2xl px-5 py-8">
        {/* Back */}
        <button onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
          ← Volver
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#17221c] p-6 flex items-center gap-5">
            {persona.foto_url ? (
              <img src={persona.foto_url} alt={persona.nombre}
                className="h-24 w-24 rounded-xl object-cover border-2 border-white/20 shrink-0" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[#1f7a4d] text-3xl font-bold text-white shrink-0">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {persona.nombre} {persona.apellido}
              </h1>
              {persona.cedula_numero && (
                <p className="text-[#a8c4b0] text-sm mt-1">
                  {persona.cedula_tipo ?? 'V'}-{persona.cedula_numero}
                </p>
              )}
              <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Estado / Ciudad" value={`${persona.ciudad}, ${persona.estado}`} />
              {persona.fecha_nacimiento && (
                <Field label="Fecha de nacimiento"
                  value={new Date(persona.fecha_nacimiento).toLocaleDateString('es-VE')} />
              )}
              {persona.genero && <Field label="Género" value={persona.genero} />}
              {persona.telefono && <Field label="Teléfono" value={persona.telefono} />}
              {persona.email && <Field label="Email" value={persona.email} />}
            </div>

            {(persona.ultima_vez_fecha || persona.ultima_vez_lugar) && (
              <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-700 mb-2">
                  Última vez visto
                </p>
                {persona.ultima_vez_fecha && (
                  <p className="text-sm text-yellow-900">
                    📅 {new Date(persona.ultima_vez_fecha).toLocaleDateString('es-VE')}
                  </p>
                )}
                {persona.ultima_vez_lugar && (
                  <p className="text-sm text-yellow-900 mt-1">📍 {persona.ultima_vez_lugar}</p>
                )}
              </div>
            )}

            {persona.descripcion && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  Señas particulares
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{persona.descripcion}</p>
              </div>
            )}

            {persona.latitud && persona.longitud && (
              <a
                href={`https://www.google.com/maps?q=${persona.latitud},${persona.longitud}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100">
                📍 Ver última ubicación registrada en Google Maps
              </a>
            )}

            <p className="text-xs text-gray-400">
              Registrado el {new Date(persona.created_at).toLocaleDateString('es-VE')}
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-4 flex gap-3 flex-wrap">
            <ShareButton persona={persona} />
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`*Solidario Venezuela* — ${persona.estado_busqueda === 'buscando' ? '🔍 EN BÚSQUEDA' : '✅ ENCONTRADO/A'}\n👤 *${persona.nombre} ${persona.apellido}*${persona.cedula_numero ? `\n🪪 ${persona.cedula_tipo ?? 'V'}-${persona.cedula_numero}` : ''}\n📍 ${persona.ciudad}, ${persona.estado}\n🔗 ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
