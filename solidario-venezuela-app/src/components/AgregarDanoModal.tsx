'use client';
import { useState } from 'react';
import { VenezuelaSelects } from './VenezuelaSelects';
import { LocationCapture } from './LocationCapture';

const TIPOS_INMUEBLE = [
  { value: 'vivienda',        label: 'Vivienda',        icon: '🏠' },
  { value: 'edificio',        label: 'Edificio',        icon: '🏢' },
  { value: 'escuela',         label: 'Escuela',         icon: '🏫' },
  { value: 'hospital',        label: 'Hospital',        icon: '🏥' },
  { value: 'comercio',        label: 'Comercio',        icon: '🏪' },
  { value: 'puente',          label: 'Puente',          icon: '🌉' },
  { value: 'infraestructura', label: 'Infraestructura', icon: '🛣️' },
  { value: 'otro',            label: 'Otro',            icon: '🏗️' },
];

const SEVERIDADES = [
  { value: 'leve',     label: 'Leve',           desc: 'Grietas menores, sin riesgo inmediato' },
  { value: 'moderado', label: 'Moderado',        desc: 'Daños visibles, posible riesgo' },
  { value: 'grave',    label: 'Grave',           desc: 'Estructura comprometida, riesgo alto' },
  { value: 'colapso',  label: 'Colapso total',   desc: 'La estructura ha colapsado' },
];

const PREFIJOS = ['0412', '0414', '0416', '0422', '0424', '0426'];

interface Props { onClose(): void; onSuccess(): void; }

export function AgregarDanoModal({ onClose, onSuccess }: Props) {
  const [tipoInmueble, setTipoInmueble] = useState('');
  const [severidad, setSeveridad] = useState('');
  const [estado, setEstado] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [personasAfectadas, setPersonasAfectadas] = useState('');
  const [contactoNombre, setContactoNombre] = useState('');
  const [prefijo, setPrefijo] = useState('0412');
  const [telefono, setTelefono] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!tipoInmueble || !severidad || !estado || !ciudad || !direccion.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        tipo_inmueble: tipoInmueble,
        severidad,
        estado,
        ciudad,
        direccion: direccion.trim(),
      };
      if (descripcion.trim()) body.descripcion = descripcion.trim();
      if (personasAfectadas) body.personas_afectadas = Number(personasAfectadas);
      if (contactoNombre.trim()) body.contacto_nombre = contactoNombre.trim();
      if (telefono.trim()) body.contacto_telefono = `${prefijo}${telefono.trim()}`;
      if (coords) { body.latitud = coords.lat; body.longitud = coords.lng; }

      const res = await fetch('/api/danos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? 'Error al enviar'); }
      setOk(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (ok) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
        <div className="text-5xl mb-4">🏚️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Daño registrado</h2>
        <p className="text-gray-600 text-sm mb-2">El reporte de daño estructural fue guardado.</p>
        <p className="text-gray-500 text-xs mb-6">Peritos voluntarios podrán contactarte para coordinar una evaluación gratuita.</p>
        <button onClick={() => { onSuccess(); onClose(); }} className="w-full rounded-xl bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700">Cerrar</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[95dvh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">🏚️ Reportar daño estructural</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5">
          <div className="rounded-lg bg-orange-50 border border-orange-100 p-3 text-sm text-orange-800">
            Peritos e ingenieros voluntarios podrán ver este reporte y contactarte para una <strong>evaluación gratuita</strong>.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de inmueble *</label>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS_INMUEBLE.map(t => (
                <button key={t.value} type="button" onClick={() => setTipoInmueble(t.value)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left ${tipoInmueble === t.value ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-700 hover:border-orange-200'}`}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nivel de daño *</label>
            <div className="space-y-2">
              {SEVERIDADES.map(s => (
                <button key={s.value} type="button" onClick={() => setSeveridad(s.value)}
                  className={`w-full flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${severidad === s.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                  <span className="text-sm font-semibold text-gray-900">{s.label}</span>
                  <span className="text-xs text-gray-500 mt-0.5">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <VenezuelaSelects estado={estado} onEstadoChange={setEstado} ciudad={ciudad} onCiudadChange={setCiudad} required />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección *</label>
            <input value={direccion} onChange={e => setDireccion(e.target.value)} required placeholder="Calle, número, urbanización..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción (opcional)</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2}
              placeholder="Describe los daños visibles..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Personas afectadas (opcional)</label>
            <input type="number" min="1" value={personasAfectadas} onChange={e => setPersonasAfectadas(e.target.value)} placeholder="Número de personas"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tu nombre (para que el perito te contacte)</label>
            <input value={contactoNombre} onChange={e => setContactoNombre(e.target.value)} placeholder="Nombre de contacto"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de contacto</label>
            <div className="flex gap-2">
              <select value={prefijo} onChange={e => setPrefijo(e.target.value)} className="rounded-xl border border-gray-300 px-2 py-2.5 text-sm focus:border-orange-500 focus:outline-none">
                {PREFIJOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 7))} placeholder="7654321" maxLength={7}
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación GPS (recomendado)</label>
            <LocationCapture onCapture={c => setCoords(c)} onClear={() => setCoords(null)} />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-60">
            {loading ? 'Enviando...' : '🏚️ Reportar daño estructural'}
          </button>
        </form>
      </div>
    </div>
  );
}
