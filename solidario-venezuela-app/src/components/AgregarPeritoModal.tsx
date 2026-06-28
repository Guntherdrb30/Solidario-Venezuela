'use client';
import { useState } from 'react';
import { VenezuelaSelects } from './VenezuelaSelects';

const PROFESIONES = [
  { value: 'Ingeniero Civil',          icon: '🏗️' },
  { value: 'Arquitecto',               icon: '📐' },
  { value: 'Técnico en Construcción',  icon: '🔧' },
  { value: 'Ingeniero Estructural',    icon: '⚙️' },
  { value: 'Inspector de Obra',        icon: '📋' },
  { value: 'Otro',                     icon: '👷' },
];

const PREFIJOS = ['0412', '0414', '0416', '0422', '0424', '0426'];

interface Props { onClose(): void; onSuccess(): void; }

export function AgregarPeritoModal({ onClose, onSuccess }: Props) {
  const [nombre, setNombre] = useState('');
  const [profesion, setProfesion] = useState('');
  const [numeroColegiado, setNumeroColegiado] = useState('');
  const [estado, setEstado] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [prefijo, setPrefijo] = useState('0412');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nombre.trim() || !profesion || !estado || !ciudad) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        nombre: nombre.trim(),
        profesion,
        estado,
        ciudad,
      };
      if (numeroColegiado.trim()) body.numero_colegiado = numeroColegiado.trim();
      if (telefono.trim()) body.telefono = `${prefijo}${telefono.trim()}`;
      if (email.trim()) body.email = email.trim();

      const res = await fetch('/api/peritos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
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
        <div className="text-5xl mb-4">👷</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">¡Gracias por ofrecerte!</h2>
        <p className="text-gray-600 text-sm mb-2">Tu perfil de perito ha sido registrado.</p>
        <p className="text-gray-500 text-xs mb-6">Las personas afectadas podrán ver tu contacto y coordinarse contigo para una evaluación gratuita.</p>
        <button onClick={() => { onSuccess(); onClose(); }} className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">Cerrar</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[95dvh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">👷 Ofrecer peritaje gratuito</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5">
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-800">
            <strong>¡Gracias por tu solidaridad!</strong> Tu perfil será visible para las personas que reporten daños estructurales, para que puedas coordinarte con ellas y ofrecerles una evaluación técnica gratuita.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tu nombre completo *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Nombre y apellido"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tu profesión *</label>
            <div className="grid grid-cols-2 gap-2">
              {PROFESIONES.map(p => (
                <button key={p.value} type="button" onClick={() => setProfesion(p.value)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left ${profesion === p.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-blue-200'}`}>
                  <span>{p.icon}</span>{p.value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número de colegiado (opcional)</label>
            <input value={numeroColegiado} onChange={e => setNumeroColegiado(e.target.value)} placeholder="Ej: CIV-12345"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
            <p className="text-xs text-gray-400 mt-1">Tu colegiado genera más confianza, pero no es obligatorio.</p>
          </div>

          <VenezuelaSelects estado={estado} onEstadoChange={setEstado} ciudad={ciudad} onCiudadChange={setCiudad} required />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono *</label>
            <div className="flex gap-2">
              <select value={prefijo} onChange={e => setPrefijo(e.target.value)} className="rounded-xl border border-gray-300 px-2 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
                {PREFIJOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 7))} placeholder="7654321" maxLength={7} required
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email (opcional)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Registrando...' : '👷 Registrarme como perito voluntario'}
          </button>
        </form>
      </div>
    </div>
  );
}
