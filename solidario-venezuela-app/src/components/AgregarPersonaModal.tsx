'use client';
import { useState } from 'react';
import { VenezuelaSelects } from './VenezuelaSelects';
import { ImageUpload } from './ImageUpload';
import { GENEROS, ESTADOS_BUSQUEDA, PREFIJOS_MOVIL } from '@/lib/venezuela-data';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY = {
  nombre: '', apellido: '', cedula_tipo: 'V', cedula_numero: '',
  fecha_nacimiento: '', genero: '', estado: '', ciudad: '',
  prefijo: '0414', telefono_num: '', email: '', foto_url: '',
  ultima_vez_fecha: '', ultima_vez_lugar: '', descripcion: '',
  estado_busqueda: 'buscando',
};

export function AgregarPersonaModal({ open, onClose, onSuccess }: Props) {
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
      const res = await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          cedula_tipo: form.cedula_tipo || null,
          cedula_numero: form.cedula_numero || null,
          fecha_nacimiento: form.fecha_nacimiento || null,
          genero: form.genero || null,
          estado: form.estado,
          ciudad: form.ciudad,
          telefono: telefono || null,
          email: form.email || null,
          foto_url: form.foto_url || null,
          ultima_vez_fecha: form.ultima_vez_fecha || null,
          ultima_vez_lugar: form.ultima_vez_lugar || null,
          descripcion: form.descripcion || null,
          estado_busqueda: form.estado_busqueda,
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
      <div className="w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Agregar Persona</h2>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Identificación */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Identificación</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)}
                  required maxLength={100}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.apellido} onChange={e => set('apellido', e.target.value)}
                  required maxLength={100}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                <div className="flex gap-2">
                  <select value={form.cedula_tipo} onChange={e => set('cedula_tipo', e.target.value)}
                    className="rounded-md border border-gray-300 px-2 py-2 text-sm w-16 focus:border-[#1f7a4d] focus:outline-none">
                    <option value="V">V</option>
                    <option value="E">E</option>
                  </select>
                  <input type="text" value={form.cedula_numero}
                    onChange={e => set('cedula_numero', e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="12345678" maxLength={8}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                <input type="date" value={form.fecha_nacimiento}
                  onChange={e => set('fecha_nacimiento', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select value={form.genero} onChange={e => set('genero', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none">
                <option value="">Seleccionar...</option>
                {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </section>

          {/* Ubicación */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Ubicación</h3>
            <VenezuelaSelects
              estado={form.estado} ciudad={form.ciudad}
              onEstadoChange={v => set('estado', v)}
              onCiudadChange={v => set('ciudad', v)}
              required
            />
          </section>

          {/* Contacto */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Contacto</h3>
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
          </section>

          {/* Foto */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Foto</h3>
            <ImageUpload value={form.foto_url} onChange={v => set('foto_url', v)} />
          </section>

          {/* Última vez visto */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Última vez visto</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" value={form.ultima_vez_fecha}
                  onChange={e => set('ultima_vez_fecha', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                <input type="text" value={form.ultima_vez_lugar}
                  onChange={e => set('ultima_vez_lugar', e.target.value)}
                  placeholder="Ej: Av. Principal, Caracas"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / señas particulares</label>
              <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
                rows={3} maxLength={500} placeholder="Describir apariencia, ropa, señas..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
              <p className="text-xs text-gray-400 text-right">{form.descripcion.length}/500</p>
            </div>
          </section>

          {/* Estado búsqueda */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Estado de búsqueda</h3>
            <select value={form.estado_busqueda} onChange={e => set('estado_busqueda', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none">
              {ESTADOS_BUSQUEDA.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </section>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="flex gap-3 pt-2 pb-4">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-lg bg-[#1f7a4d] py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] disabled:opacity-50 transition-colors">
              {loading ? 'Guardando...' : 'Guardar Persona'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
