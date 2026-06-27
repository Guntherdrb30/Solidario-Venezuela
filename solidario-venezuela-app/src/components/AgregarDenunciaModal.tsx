'use client';
import { useState } from 'react';
import { VenezuelaSelects } from './VenezuelaSelects';
import { LocationCapture } from './LocationCapture';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TIPOS = [
  { value: 'robo',            label: '💰 Robo' },
  { value: 'extorsion',       label: '⚠️ Extorsión' },
  { value: 'abuso_autoridad', label: '🚔 Abuso de autoridad' },
  { value: 'secuestro',       label: '🚨 Secuestro' },
  { value: 'vandalismo',      label: '🔨 Vandalismo' },
  { value: 'otro',            label: '📋 Otra anomalía' },
];

const EMPTY = {
  tipo: '', estado: '', ciudad: '',
  descripcion: '', fecha_hecho: '',
  latitud: '', longitud: '',
};

export function AgregarDenunciaModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/denuncias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: form.tipo,
          estado: form.estado,
          ciudad: form.ciudad,
          descripcion: form.descripcion,
          fecha_hecho: form.fecha_hecho || null,
          latitud: form.latitud || null,
          longitud: form.longitud || null,
        }),
      });

      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Error al enviar');

      setDone(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(EMPTY);
    setDone(false);
    setError('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Hacer una denuncia</h2>
            <p className="text-xs text-gray-400 mt-0.5">Completamente anónima — no se almacena ningún dato personal</p>
          </div>
          <button onClick={handleClose} type="button" className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
            <span className="text-5xl">✅</span>
            <h3 className="text-lg font-semibold text-gray-900">Denuncia enviada</h3>
            <p className="text-sm text-gray-500">
              Tu denuncia ha sido registrada de forma anónima. Gracias por contribuir a la seguridad de la comunidad.
            </p>
            <button onClick={handleClose}
              className="mt-2 rounded-lg bg-[#1f7a4d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f]">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* Aviso de anonimato */}
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
              <span className="text-blue-500 text-lg shrink-0">🔒</span>
              <p className="text-xs text-blue-800">
                <strong>Denuncia anónima:</strong> No te pedimos nombre, cédula, ni ningún dato de contacto.
                Tu identidad está completamente protegida.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de denuncia <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIPOS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set('tipo', t.value)}
                    className={`rounded-lg border px-3 py-2.5 text-sm text-left transition-colors ${
                      form.tipo === t.value
                        ? 'border-[#1f7a4d] bg-[#eef6f1] text-[#1f7a4d] font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t.label}
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
                Fecha en que ocurrió <span className="text-gray-400 font-normal">(aproximada, opcional)</span>
              </label>
              <input type="date" value={form.fecha_hecho}
                onChange={e => set('fecha_hecho', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del hecho <span className="text-red-500">*</span>
              </label>
              <textarea value={form.descripcion}
                onChange={e => set('descripcion', e.target.value)}
                required minLength={10} maxLength={1000} rows={4}
                placeholder="Describe lo que ocurrió con el mayor detalle posible (lugar exacto, cómo fue, número de personas implicadas, etc.)..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
              <p className="text-xs text-gray-400 text-right mt-1">{form.descripcion.length}/1000</p>
            </div>

            <LocationCapture
              latitud={form.latitud} longitud={form.longitud}
              onCapture={(lat, lng) => { set('latitud', lat); set('longitud', lng); }}
            />

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="flex gap-3 pb-4">
              <button type="button" onClick={handleClose}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" disabled={loading || !form.tipo || !form.estado || !form.ciudad || form.descripcion.length < 10}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40 transition-colors">
                {loading ? 'Enviando...' : '🚨 Enviar denuncia'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
