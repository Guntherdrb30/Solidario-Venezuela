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
          <div className="border-t border-gray-100 p-4 flex gap-3">
            <ShareButton persona={persona} />
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
