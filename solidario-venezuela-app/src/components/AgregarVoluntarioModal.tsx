'use client';
import { useState } from 'react';
import { VenezuelaSelects } from './VenezuelaSelects';
import { PREFIJOS_MOVIL } from '@/lib/venezuela-data';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const HABILIDADES = [
  { value: 'Médico / Enfermero',             icon: '🏥' },
  { value: 'Rescatista / Primeros auxilios', icon: '🚑' },
  { value: 'Logística y transporte',          icon: '🚛' },
  { value: 'Cocina y alimentación',           icon: '🍲' },
  { value: 'Construcción / Obras',            icon: '🔧' },
  { value: 'Psicología y apoyo emocional',    icon: '🧠' },
  { value: 'Comunicaciones',                  icon: '📡' },
  { value: 'Educación',                       icon: '📚' },
  { value: 'Otro',                            icon: '🙋' },
];

const EMPTY = {
  nombre: '', habilidad: '', estado: '', ciudad: '',
  prefijo: '0414', telefono_num: '', disponibilidad: '',
};

export function AgregarVoluntarioModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof EMPTY, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const telefono = form.telefono_num ? `${form.prefijo}${form.telefono_num}` : '';

    try {
      const res = await fetch('/api/voluntarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          habilidad: form.habilidad,
          estado: form.estado,
          ciudad: form.ciudad,
          telefono: telefono || null,
          disponibilidad: form.disponibilidad || null,
        }),
      });

      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Error al guardar');

      setForm(EMPTY);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Registrarme como voluntario</h2>
            <p className="text-xs text-gray-400 mt-0.5">Conecta con quienes más te necesitan</p>
          </div>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)}
              required maxLength={100}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿En qué puedes ayudar? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HABILIDADES.map(h => (
                <button key={h.value} type="button"
                  onClick={() => set('habilidad', h.value)}
                  className={`rounded-lg border px-3 py-2.5 text-sm text-left transition-colors ${
                    form.habilidad === h.value
                      ? 'border-[#1f7a4d] bg-[#eef6f1] text-[#1f7a4d] font-medium'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                  {h.icon} {h.value}
                </button>
              ))}
            </div>
          </div>

          <VenezuelaSelects
            estado={form.estado} ciudad={form.ciudad}
            onEstadoChange={v => set('estado', v)}
            onCiudadChange={v => set('ciudad', v)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de contacto <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="flex gap-2">
              <select value={form.prefijo} onChange={e => set('prefijo', e.target.value)}
                className="rounded-md border border-gray-300 px-2 py-2 text-sm w-24 focus:border-[#1f7a4d] focus:outline-none">
                {PREFIJOS_MOVIL.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input type="tel" value={form.telefono_num}
                onChange={e => set('telefono_num', e.target.value.replace(/\D/g, '').slice(0, 7))}
                placeholder="1234567" maxLength={7}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disponibilidad <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input type="text" value={form.disponibilidad}
              onChange={e => set('disponibilidad', e.target.value)} maxLength={200}
              placeholder="Ej: Tiempo completo, Fines de semana, Tardes..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="flex gap-3 pb-4">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading || !form.habilidad}
              className="flex-1 rounded-lg bg-[#1f7a4d] py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] disabled:opacity-50 transition-colors">
              {loading ? 'Guardando...' : '🙋 Registrarme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
