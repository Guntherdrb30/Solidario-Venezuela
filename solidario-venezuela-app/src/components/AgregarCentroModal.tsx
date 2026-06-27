'use client';
import { useState } from 'react';
import { VenezuelaSelects } from './VenezuelaSelects';
import { LocationCapture } from './LocationCapture';
import { TIPOS_CENTRO, PREFIJOS_MOVIL } from '@/lib/venezuela-data';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY = {
  nombre: '', tipo: '', estado: '', ciudad: '',
  direccion: '', prefijo: '0414', telefono_num: '',
  email: '', horario: '', descripcion: '', latitud: '', longitud: '',
};

export function AgregarCentroModal({ open, onClose, onSuccess }: Props) {
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
      const res = await fetch('/api/centros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          tipo: form.tipo || null,
          estado: form.estado,
          ciudad: form.ciudad,
          direccion: form.direccion || null,
          telefono: telefono || null,
          email: form.email || null,
          horario: form.horario || null,
          descripcion: form.descripcion || null,
          latitud: form.latitud || null,
          longitud: form.longitud || null,
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
      <div className="w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Agregar Centro de Ayuda</h2>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del centro <span className="text-red-500">*</span>
            </label>
            <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)}
              required maxLength={200}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select value={form.tipo} onChange={e => set('tipo', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none">
              <option value="">Seleccionar tipo...</option>
              {TIPOS_CENTRO.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <VenezuelaSelects
            estado={form.estado} ciudad={form.ciudad}
            onEstadoChange={v => set('estado', v)}
            onCiudadChange={v => set('ciudad', v)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input type="text" value={form.direccion} onChange={e => set('direccion', e.target.value)}
              placeholder="Ej: Av. Principal con Calle 5, Local 3"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horario de atención</label>
            <input type="text" value={form.horario} onChange={e => set('horario', e.target.value)}
              placeholder="Ej: Lun-Vie 8am-5pm"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          <LocationCapture
            latitud={form.latitud} longitud={form.longitud}
            onCapture={(lat, lng) => { set('latitud', lat); set('longitud', lng); }}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
              rows={3} maxLength={500}
              placeholder="Servicios que ofrece, requisitos de acceso..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="flex gap-3 pb-4">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-lg bg-[#1f7a4d] py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] disabled:opacity-50 transition-colors">
              {loading ? 'Guardando...' : 'Guardar Centro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
