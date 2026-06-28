'use client';
import { useState, useEffect } from 'react';

const CATEGORIAS = [
  { value: 'damnificados',  label: 'Damnificados',        icon: '🏚️' },
  { value: 'ninos',         label: 'Niños y Niñas',        icon: '👶' },
  { value: 'vivienda',      label: 'Vivienda',             icon: '🏠' },
  { value: 'alimentacion',  label: 'Alimentación',         icon: '🍎' },
  { value: 'medicinas',     label: 'Medicinas/Salud',      icon: '💊' },
  { value: 'educacion',     label: 'Educación',            icon: '📚' },
  { value: 'ropa',          label: 'Ropa e Insumos',       icon: '👕' },
  { value: 'rescate',       label: 'Rescate/Emergencias',  icon: '🆘' },
  { value: 'otro',          label: 'Otra causa',           icon: '💛' },
];

const MONEDAS = ['USD', 'EUR', 'COP', 'BRL', 'ARS', 'MXN', 'PEN', 'VES', 'GBP', 'CAD'];

interface Org { id: number; nombre: string; tipo: string; }
interface Props { onClose(): void; onSuccess(): void; }

export function AgregarDonacionModal({ onClose, onSuccess }: Props) {
  const [tipo, setTipo] = useState('dinero');
  const [categoria, setCategoria] = useState('');
  const [proposito, setProposito] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState('USD');
  const [descripcionEspecie, setDescripcionEspecie] = useState('');
  const [donante_nombre, setDonante_nombre] = useState('');
  const [donante_empresa, setDonante_empresa] = useState('');
  const [donante_pais, setDonante_pais] = useState('');
  const [donante_telefono, setDonante_telefono] = useState('');
  const [donante_email, setDonante_email] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    fetch('/api/organizaciones?page=1')
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((d: any) => setOrgs(d.results ?? []))
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!categoria || !proposito.trim() || !donante_nombre.trim() || !donante_pais.trim()) {
      setError('Categoría, propósito, nombre y país del donante son requeridos.');
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        tipo, categoria, proposito: proposito.trim(),
        donante_nombre: donante_nombre.trim(),
        donante_pais: donante_pais.trim(),
      };
      if (monto) body.monto = Number(monto);
      if (moneda) body.moneda = moneda;
      if (descripcionEspecie.trim()) body.descripcion_especie = descripcionEspecie.trim();
      if (donante_empresa.trim()) body.donante_empresa = donante_empresa.trim();
      if (donante_telefono.trim()) body.donante_telefono = donante_telefono.trim();
      if (donante_email.trim()) body.donante_email = donante_email.trim();
      if (orgId) body.organizacion_id = Number(orgId);

      const res = await fetch('/api/donaciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
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
        <div className="text-5xl mb-4">💰</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">¡Donación registrada!</h2>
        <p className="text-gray-600 text-sm mb-2">Tu donación ha sido documentada en el sistema.</p>
        <p className="text-gray-500 text-xs mb-6">Las organizaciones receptoras pueden ver esta información y contactarte para coordinar la entrega.</p>
        <button onClick={() => { onSuccess(); onClose(); }} className="w-full rounded-xl bg-[#1f7a4d] py-3 font-semibold text-white hover:bg-[#17663f]">Cerrar</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[95dvh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">💰 Registrar donación</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5">
          <div className="rounded-lg bg-[#eef6f1] border border-[#1f7a4d]/20 p-3 text-sm text-[#1f7a4d]">
            Registra aquí la donación o recaudación que realizaste. Quedará documentada públicamente para que organizaciones en Venezuela puedan contactarte y coordinar la entrega responsable.
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de donación *</label>
            <div className="grid grid-cols-3 gap-2">
              {[['dinero','💵 Dinero'],['especie','📦 Especie'],['mixto','💵📦 Mixto']].map(([v,l]) => (
                <button key={v} type="button" onClick={() => setTipo(v)}
                  className={`rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${tipo === v ? 'border-[#1f7a4d] bg-[#eef6f1] text-[#1f7a4d]' : 'border-gray-200 text-gray-700 hover:border-[#1f7a4d]/40'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Monto */}
          {(tipo === 'dinero' || tipo === 'mixto') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Monto {tipo === 'dinero' ? '*' : '(opcional)'}</label>
              <div className="flex gap-2">
                <select value={moneda} onChange={e => setMoneda(e.target.value)}
                  className="rounded-xl border border-gray-300 px-2 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none">
                  {MONEDAS.map(m => <option key={m}>{m}</option>)}
                </select>
                <input type="number" min="0" step="0.01" value={monto} onChange={e => setMonto(e.target.value)}
                  placeholder="0.00" className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
              </div>
            </div>
          )}

          {/* Descripción especie */}
          {(tipo === 'especie' || tipo === 'mixto') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">¿Qué estás donando? *</label>
              <textarea value={descripcionEspecie} onChange={e => setDescripcionEspecie(e.target.value)} rows={2}
                placeholder="Ej: 500 kg de arroz, 200 cajas de medicina, ropa usada en buen estado..."
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
            </div>
          )}

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">¿Para qué debe usarse? *</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIAS.map(c => (
                <button key={c.value} type="button" onClick={() => setCategoria(c.value)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left ${categoria === c.value ? 'border-[#1f7a4d] bg-[#eef6f1] text-[#1f7a4d]' : 'border-gray-200 text-gray-700 hover:border-[#1f7a4d]/40'}`}>
                  <span>{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Propósito */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción del propósito *</label>
            <textarea value={proposito} onChange={e => setProposito(e.target.value)} rows={3} required
              placeholder="Explica detalladamente para qué quieres que se use esta donación..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
          </div>

          {/* Donante */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Datos del donante / recaudador</p>
            <input value={donante_nombre} onChange={e => setDonante_nombre(e.target.value)} required
              placeholder="Nombre completo del responsable *"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            <input value={donante_empresa} onChange={e => setDonante_empresa(e.target.value)}
              placeholder="Empresa u organización (opcional)"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            <input value={donante_pais} onChange={e => setDonante_pais(e.target.value)} required
              placeholder="País desde donde se envía la donación *"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            <input type="tel" value={donante_telefono} onChange={e => setDonante_telefono(e.target.value)}
              placeholder="Teléfono de contacto"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            <input type="email" value={donante_email} onChange={e => setDonante_email(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none" />
          </div>

          {/* Organización receptora */}
          {orgs.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Asignar a organización (opcional)</label>
              <select value={orgId} onChange={e => setOrgId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none">
                <option value="">— Buscar organización más tarde —</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
              </select>
            </div>
          )}

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-[#1f7a4d] py-3 font-semibold text-white hover:bg-[#17663f] disabled:opacity-60">
            {loading ? 'Registrando...' : '💰 Registrar donación'}
          </button>
        </form>
      </div>
    </div>
  );
}
