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

interface Avistamiento {
  id: number;
  fecha?: string;
  lugar: string;
  descripcion: string;
  created_at: string;
}

const BADGE: Record<string, { label: string; cls: string }> = {
  buscando:   { label: 'En búsqueda',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  encontrado: { label: 'Encontrado/a', cls: 'bg-green-100 text-green-800 border-green-200' },
  descartado: { label: 'Caso cerrado', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export default function PersonaDetalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [showAvistamiento, setShowAvistamiento] = useState(false);
  const [aForm, setAForm] = useState({ fecha: '', lugar: '', descripcion: '' });
  const [aLoading, setALoading] = useState(false);
  const [aError, setAError] = useState('');
  const [aDone, setADone] = useState(false);
  const [updatingEstado, setUpdatingEstado] = useState(false);

  const loadPersona = () =>
    fetch(`/api/personas/${id}`).then(r => r.json()).then(d => setPersona(d as Persona));

  const loadAvistamientos = () =>
    fetch(`/api/personas/${id}/avistamiento`).then(r => r.json()).then(d => setAvistamientos(d as Avistamiento[]));

  useEffect(() => {
    Promise.all([loadPersona(), loadAvistamientos()]).finally(() => setLoading(false));
  }, [id]);

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!persona) return;
    const labels: Record<string, string> = { encontrado: 'encontrado/a', descartado: 'caso cerrado', buscando: 'en búsqueda' };
    if (!confirm(`¿Marcar a ${persona.nombre} ${persona.apellido} como ${labels[nuevoEstado]}?`)) return;
    setUpdatingEstado(true);
    await fetch(`/api/personas/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado_busqueda: nuevoEstado }),
    });
    await loadPersona();
    setUpdatingEstado(false);
  };

  const enviarAvistamiento = async (e: React.FormEvent) => {
    e.preventDefault();
    setALoading(true);
    setAError('');
    const res = await fetch(`/api/personas/${id}/avistamiento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aForm),
    });
    if (res.ok) {
      setADone(true);
      loadAvistamientos();
      setAForm({ fecha: '', lugar: '', descripcion: '' });
    } else {
      const d = await res.json() as { error: string };
      setAError(d.error);
    }
    setALoading(false);
  };

  const shareWhatsApp = () => {
    if (!persona) return;
    const url = window.location.href;
    const estado = persona.estado_busqueda === 'buscando' ? '🔍 EN BÚSQUEDA' : persona.estado_busqueda === 'encontrado' ? '✅ ENCONTRADO/A' : 'Caso cerrado';
    const text = `*Solidario Venezuela* — ${estado}\n👤 *${persona.nombre} ${persona.apellido}*${persona.cedula_numero ? `\n🪪 ${persona.cedula_tipo ?? 'V'}-${persona.cedula_numero}` : ''}\n📍 ${persona.ciudad}, ${persona.estado}${persona.ultima_vez_fecha ? `\n📅 Último aviso: ${new Date(persona.ultima_vez_fecha).toLocaleDateString('es-VE')}` : ''}\n🔗 ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareNative = async () => {
    if (!persona) return;
    const url = window.location.href;
    const text = `${persona.nombre} ${persona.apellido} — ${persona.ciudad}, ${persona.estado}.`;
    if (navigator.share) await navigator.share({ title: `${persona.nombre} ${persona.apellido} — Solidario Venezuela`, text, url });
    else { await navigator.clipboard.writeText(`${text}\n${url}`); alert('Enlace copiado.'); }
  };

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
      <div className="mx-auto max-w-2xl px-5 py-8 space-y-5">
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
          ← Volver
        </button>

        {/* Ficha principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
              <h1 className="text-2xl font-bold text-white">{persona.nombre} {persona.apellido}</h1>
              {persona.cedula_numero && (
                <p className="text-[#a8c4b0] text-sm mt-1">{persona.cedula_tipo ?? 'V'}-{persona.cedula_numero}</p>
              )}
              <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Estado / Ciudad" value={`${persona.ciudad}, ${persona.estado}`} />
              {persona.fecha_nacimiento && <Field label="Fecha de nacimiento" value={new Date(persona.fecha_nacimiento).toLocaleDateString('es-VE')} />}
              {persona.genero && <Field label="Género" value={persona.genero} />}
              {persona.telefono && <Field label="Teléfono" value={persona.telefono} />}
              {persona.email && <Field label="Email" value={persona.email} />}
            </div>

            {(persona.ultima_vez_fecha || persona.ultima_vez_lugar) && (
              <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-700 mb-2">Última vez visto</p>
                {persona.ultima_vez_fecha && <p className="text-sm text-yellow-900">📅 {new Date(persona.ultima_vez_fecha).toLocaleDateString('es-VE')}</p>}
                {persona.ultima_vez_lugar && <p className="text-sm text-yellow-900 mt-1">📍 {persona.ultima_vez_lugar}</p>}
              </div>
            )}

            {persona.descripcion && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Señas particulares</p>
                <p className="text-sm text-gray-700 leading-relaxed">{persona.descripcion}</p>
              </div>
            )}

            {persona.latitud && persona.longitud && (
              <a href={`https://www.google.com/maps?q=${persona.latitud},${persona.longitud}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100">
                📍 Ver última ubicación en Google Maps
              </a>
            )}

            <p className="text-xs text-gray-400">Registrado el {new Date(persona.created_at).toLocaleDateString('es-VE')}</p>
          </div>

          {/* Acciones */}
          <div className="border-t border-gray-100 p-4 space-y-3">
            {/* Compartir */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={shareNative}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartir
              </button>
              <button onClick={shareWhatsApp}
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
            </div>

            {/* Cambiar estado */}
            {persona.estado_busqueda === 'buscando' && (
              <div className="flex gap-2 flex-wrap pt-1 border-t border-gray-100">
                <button onClick={() => cambiarEstado('encontrado')} disabled={updatingEstado}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                  ✅ Marcar como encontrado/a
                </button>
                <button onClick={() => cambiarEstado('descartado')} disabled={updatingEstado}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                  Cerrar caso
                </button>
              </div>
            )}
            {persona.estado_busqueda !== 'buscando' && (
              <div className="pt-1 border-t border-gray-100">
                <button onClick={() => cambiarEstado('buscando')} disabled={updatingEstado}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                  🔄 Reactivar búsqueda
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Avistamientos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">👁️ Avistamientos reportados</h2>
              <p className="text-xs text-gray-400 mt-0.5">{avistamientos.length} reporte{avistamientos.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => { setShowAvistamiento(!showAvistamiento); setADone(false); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-3 py-2 text-sm font-semibold text-white hover:bg-[#17663f]">
              + Reportar avistamiento
            </button>
          </div>

          {showAvistamiento && (
            <div className="px-6 py-4 bg-[#f8f7f2] border-b border-gray-100">
              {aDone ? (
                <div className="text-center py-4">
                  <p className="text-2xl mb-2">✅</p>
                  <p className="text-sm font-medium text-gray-800">¡Gracias! Tu reporte fue enviado.</p>
                  <button onClick={() => { setADone(false); setShowAvistamiento(false); }}
                    className="mt-3 text-xs text-[#1f7a4d] underline">Cerrar</button>
                </div>
              ) : (
                <form onSubmit={enviarAvistamiento} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Nuevo avistamiento</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Fecha (aprox.)</label>
                      <input type="date" value={aForm.fecha} max={new Date().toISOString().split('T')[0]}
                        onChange={e => setAForm(f => ({ ...f, fecha: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Lugar <span className="text-red-500">*</span></label>
                      <input type="text" value={aForm.lugar} required
                        onChange={e => setAForm(f => ({ ...f, lugar: e.target.value }))}
                        placeholder="Ej: Av. Principal, Caracas"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Descripción <span className="text-red-500">*</span></label>
                    <textarea value={aForm.descripcion} required minLength={10} rows={3}
                      onChange={e => setAForm(f => ({ ...f, descripcion: e.target.value }))}
                      placeholder="¿Cómo lo/la viste? ¿Estaba bien? ¿Con quién? ¿Qué llevaba puesto?..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
                  </div>
                  {aError && <p className="text-xs text-red-600">{aError}</p>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={aLoading}
                      className="rounded-lg bg-[#1f7a4d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17663f] disabled:opacity-50">
                      {aLoading ? 'Enviando...' : 'Enviar reporte'}
                    </button>
                    <button type="button" onClick={() => setShowAvistamiento(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {avistamientos.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-400 text-sm">No hay avistamientos reportados aún.</p>
              <p className="text-xs text-gray-400 mt-1">Si viste a esta persona, usa el botón de arriba.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {avistamientos.map(a => (
                <div key={a.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-800">📍 {a.lugar}</p>
                    <p className="text-xs text-gray-400 shrink-0">
                      {a.fecha ? new Date(a.fecha).toLocaleDateString('es-VE') : new Date(a.created_at).toLocaleDateString('es-VE')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{a.descripcion}</p>
                </div>
              ))}
            </div>
          )}
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
