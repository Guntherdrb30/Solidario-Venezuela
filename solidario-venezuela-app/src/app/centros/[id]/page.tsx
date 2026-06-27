'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  latitud?: number;
  longitud?: number;
  created_at: string;
}

function ShareButton({ centro }: { centro: Centro }) {
  const share = async () => {
    const url = window.location.href;
    const text = `${centro.nombre} — ${centro.ciudad}, ${centro.estado}${centro.tipo ? ` (${centro.tipo})` : ''}.${centro.telefono ? ` Tel: ${centro.telefono}` : ''}`;
    if (navigator.share) {
      await navigator.share({ title: `${centro.nombre} — Solidario Venezuela`, text, url });
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

export default function CentroDetalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [centro, setCentro] = useState<Centro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/centros/${id}`)
      .then(r => r.json())
      .then(d => setCentro(d as Centro))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1f7a4d] border-t-transparent" />
    </div>
  );

  if (!centro || 'error' in (centro as object)) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-gray-500">Centro no encontrado.</p>
      <Link href="/" className="text-[#1f7a4d] underline text-sm">Volver al inicio</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <button onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
          ← Volver
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#17221c] p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">{centro.nombre}</h1>
                <p className="text-[#a8c4b0] mt-1">{centro.ciudad}, {centro.estado}</p>
              </div>
              {centro.tipo && (
                <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                  {centro.tipo}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            {centro.direccion && (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Dirección</p>
                  <p className="mt-1 text-sm text-gray-800">{centro.direccion}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {centro.telefono && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <span>📞</span>
                  <div>
                    <p className="text-xs text-gray-400">Teléfono</p>
                    <a href={`tel:${centro.telefono}`} className="text-sm font-medium text-[#1f7a4d]">
                      {centro.telefono}
                    </a>
                  </div>
                </div>
              )}
              {centro.email && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <span>✉️</span>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <a href={`mailto:${centro.email}`} className="text-sm font-medium text-[#1f7a4d] truncate">
                      {centro.email}
                    </a>
                  </div>
                </div>
              )}
              {centro.horario && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 col-span-2">
                  <span>🕐</span>
                  <div>
                    <p className="text-xs text-gray-400">Horario</p>
                    <p className="text-sm font-medium text-gray-800">{centro.horario}</p>
                  </div>
                </div>
              )}
            </div>

            {centro.descripcion && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Descripción</p>
                <p className="text-sm text-gray-700 leading-relaxed">{centro.descripcion}</p>
              </div>
            )}

            {centro.latitud && centro.longitud && (
              <a
                href={`https://www.google.com/maps?q=${centro.latitud},${centro.longitud}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100">
                📍 Ver ubicación en Google Maps
              </a>
            )}

            <p className="text-xs text-gray-400">
              Registrado el {new Date(centro.created_at).toLocaleDateString('es-VE')}
            </p>
          </div>

          <div className="border-t border-gray-100 p-4 flex gap-3">
            <ShareButton centro={centro} />
          </div>
        </div>
      </div>
    </main>
  );
}
