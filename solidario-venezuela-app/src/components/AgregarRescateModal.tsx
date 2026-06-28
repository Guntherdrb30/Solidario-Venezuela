'use client';
import { useState } from 'react';
import { VenezuelaSelects } from './VenezuelaSelects';
import { LocationCapture } from './LocationCapture';

const TIPOS = [
  { value: 'personas_atrapadas', label: 'Personas atrapadas', icon: '🆘' },
  { value: 'heridos',            label: 'Heridos',            icon: '🚑' },
  { value: 'incendio',           label: 'Incendio',           icon: '🔥' },
  { value: 'derrumbe',           label: 'Derrumbe',           icon: '🏚️' },
  { value: 'fuga_gas',           label: 'Fuga de gas',        icon: '⚠️' },
  { value: 'otro',               label: 'Otra emergencia',    icon: '📢' },
];

const PREFIJOS = ['0412', '0414', '0416', '0422', '0424', '0426'];

interface Props { onClose(): void; onSuccess(): void; }

export function AgregarRescateModal({ onClose, onSuccess }: Props) {
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [personasInvolucradas, setPersonasInvolucradas] = useState('');
  const [contactoNombre, setContactoNombre] = useState('');
  const [prefijo, setPrefijo] = useState('0412');
  const [telefono, setTelefono] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!tipo || !estado || !ciudad || !direccion.trim() || !descripcion.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        tipo_emergencia: tipo,
        estado,
        ciudad,
        direccion: direccion.trim(),
        descripcion: descripcion.trim(),
      };
      if (personasInvolucradas) body.personas_involucradas = Number(personasInvolucradas);
      if (contactoNombre.trim()) body.contacto_nombre = contactoNombre.trim();
      if (telefono.trim()) body.contacto_telefono = `${prefijo}${telefono.trim()}`;
      if (latitud && longitud) { body.latitud = Number(latitud); body.longitud = Number(longitud); }

      const res = await fetch('/api/rescate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
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
        <div className="text-5xl mb-4">🆘</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Solicitud enviada</h2>
        <p className="text-gray-600 text-sm mb-6">Tu solicitud de rescate ha sido registrada. Las brigadas de ayuda pueden verla ahora.</p>
        <button onClick={() => { onSuccess(); onClose(); }} className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700">Cerrar</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[95dvh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">🆘 Solicitud de rescate</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5">
          <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-800">
            <strong>Emergencia activa:</strong> Esta solicitud será visible de inmediato para voluntarios y brigadas de ayuda. Para emergencias con riesgo de vida, también llama al <strong>911</strong>.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de emergencia *</label>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS.map(t => (
                <button key={t.value} type="button" onClick={() => setTipo(t.value)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left ${tipo === t.value ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-700 hover:border-red-200'}`}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>

          <VenezuelaSelects estado={estado} onEstadoChange={setEstado} ciudad={ciudad} onCiudadChange={setCiudad} required />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección exacta *</label>
            <input value={direccion} onChange={e => setDireccion(e.target.value)} required placeholder="Calle, número, sector, referencias..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción de la situación *</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required rows={3}
              placeholder="Describe qué está pasando, número de personas, condición..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Personas involucradas (opcional)</label>
            <input type="number" min="1" value={personasInvolucradas} onChange={e => setPersonasInvolucradas(e.target.value)}
              placeholder="Número aproximado"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de contacto (opcional)</label>
            <input value={contactoNombre} onChange={e => setContactoNombre(e.target.value)} placeholder="Nombre de quien reporta"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de contacto (opcional)</label>
            <div className="flex gap-2">
              <select value={prefijo} onChange={e => setPrefijo(e.target.value)} className="rounded-xl border border-gray-300 px-2 py-2.5 text-sm focus:border-red-500 focus:outline-none">
                {PREFIJOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 7))} placeholder="7654321" maxLength={7}
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <LocationCapture latitud={latitud} longitud={longitud} onCapture={(lat, lng) => { setLatitud(lat); setLongitud(lng); }} />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {loading ? 'Enviando...' : '🆘 Enviar solicitud de rescate'}
          </button>
        </form>
      </div>
    </div>
  );
}
