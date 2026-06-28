'use client';
import { useState } from 'react';
import { VenezuelaSelects } from './VenezuelaSelects';

const TIPOS = [
  { value: 'ong',               label: 'ONG',                icon: '🤝' },
  { value: 'fundacion',         label: 'Fundación',          icon: '🏛️' },
  { value: 'grupo_comunitario', label: 'Grupo comunitario',  icon: '👥' },
  { value: 'empresa',           label: 'Empresa',            icon: '🏢' },
  { value: 'iglesia',           label: 'Iglesia / Fe',       icon: '⛪' },
  { value: 'otro',              label: 'Otro',               icon: '🌐' },
];

const AREAS_OPCIONES = [
  'Alimentación', 'Vivienda', 'Salud', 'Educación', 'Ropa e Insumos',
  'Rescate', 'Niñez', 'Adultos mayores', 'Personas con discapacidad', 'Animales', 'Otro',
];

interface Props { onClose(): void; onSuccess(): void; }

export function AgregarOrganizacionModal({ onClose, onSuccess }: Props) {
  const [tipo, setTipo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [contactoNombre, setContactoNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [paisSede, setPaisSede] = useState('Venezuela');
  const [estado, setEstado] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [rif, setRif] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const toggleArea = (a: string) => setAreas(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nombre.trim() || !tipo || !descripcion.trim() || !contactoNombre.trim()) {
      setError('Nombre, tipo, descripción y contacto son requeridos.');
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        nombre: nombre.trim(),
        tipo,
        descripcion: descripcion.trim(),
        areas: areas.join(', '),
        contacto_nombre: contactoNombre.trim(),
        pais_sede: paisSede.trim() || 'Venezuela',
      };
      if (telefono.trim()) body.telefono = telefono.trim();
      if (email.trim()) body.email = email.trim();
      if (website.trim()) body.website = website.trim();
      if (estado) body.estado = estado;
      if (ciudad) body.ciudad = ciudad;
      if (rif.trim()) body.rif = rif.trim();

      const res = await fetch('/api/organizaciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? 'Error'); }
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
        <div className="text-5xl mb-4">🏛️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">¡Organización registrada!</h2>
        <p className="text-gray-600 text-sm mb-2">Tu organización ya es visible en el directorio.</p>
        <p className="text-gray-500 text-xs mb-6">El equipo de Solidario Venezuela puede verificarla para que aparezca con el sello ✅ de confianza.</p>
        <button onClick={() => { onSuccess(); onClose(); }} className="w-full rounded-xl bg-[#1f7a4d] py-3 font-semibold text-white hover:bg-[#17663f]">Cerrar</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[95dvh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">🏛️ Registrar organización</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5">
          <div className="rounded-lg bg-[#eef6f1] border border-[#1f7a4d]/20 p-3 text-sm text-[#1f7a4d]">
            Registra tu organización para que donantes en Venezuela y en el exterior puedan encontrarte y coordinar la entrega de recursos. Las organizaciones verificadas aparecen destacadas.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de organización *</label>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS.map(t => (
                <button key={t.value} type="button" onClick={() => setTipo(t.value)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left ${tipo === t.value ? 'border-[#1f7a4d] bg-[#eef6f1] text-[#1f7a4d]' : 'border-gray-200 text-gray-700 hover:border-[#1f7a4d]/40'}`}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la organización *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} required
              placeholder="Nombre oficial"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción y misión *</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} required
              placeholder="¿Qué hace tu organización? ¿Cómo ayudan a las personas afectadas?"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Áreas de trabajo</label>
            <div className="flex flex-wrap gap-2">
              {AREAS_OPCIONES.map(a => (
                <button key={a} type="button" onClick={() => toggleArea(a)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${areas.includes(a) ? 'border-[#1f7a4d] bg-[#eef6f1] text-[#1f7a4d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">País sede *</label>
            <input value={paisSede} onChange={e => setPaisSede(e.target.value)}
              placeholder="Venezuela, Colombia, EEUU, España..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          <VenezuelaSelects estado={estado} onEstadoChange={setEstado} ciudad={ciudad} onCiudadChange={setCiudad} />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Datos de contacto</p>
            <input value={contactoNombre} onChange={e => setContactoNombre(e.target.value)} required
              placeholder="Nombre del responsable principal *"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
              placeholder="Teléfono"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            <input value={website} onChange={e => setWebsite(e.target.value)}
              placeholder="Sitio web (opcional)"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            <input value={rif} onChange={e => setRif(e.target.value)}
              placeholder="RIF o número de registro (opcional)"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-[#1f7a4d] py-3 font-semibold text-white hover:bg-[#17663f] disabled:opacity-60">
            {loading ? 'Registrando...' : '🏛️ Registrar organización'}
          </button>
        </form>
      </div>
    </div>
  );
}
