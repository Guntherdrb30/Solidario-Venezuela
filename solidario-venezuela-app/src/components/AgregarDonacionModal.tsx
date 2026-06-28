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

interface Org { id: number; nombre: string; tipo: string; avg_rating?: number; count_valoraciones?: number; count_donaciones?: number; telefono?: string; }
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
              <p className="text-xs text-gray-400 mb-2">Selecciona la organización que recibirá y distribuirá tu donación.</p>
              <div className="space-y-2 max-h-56 overflow-y-auto rounded-xl border border-gray-200 p-2">
                <label className={`flex items-start gap-3 rounded-lg p-2.5 cursor-pointer transition-colors ${orgId === '' ? 'bg-gray-50 border border-gray-200' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="org" value="" checked={orgId === ''} onChange={() => setOrgId('')} className="mt-1 accent-[#1f7a4d]" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Buscar organización más tarde</p>
                    <p className="text-xs text-gray-400">La donación quedará visible para que organizaciones te contacten</p>
                  </div>
                </label>
                {orgs.map(o => {
                  const stars = o.avg_rating && o.avg_rating > 0 ? `⭐ ${o.avg_rating.toFixed(1)}` : '';
                  const donCount = o.count_donaciones ? `· ${o.count_donaciones} don.` : '';
                  return (
                    <label key={o.id} className={`flex items-start gap-3 rounded-lg p-2.5 cursor-pointer transition-colors ${orgId === String(o.id) ? 'bg-[#eef6f1] border border-[#1f7a4d]/30' : 'hover:bg-gray-50'}`}>
                      <input type="radio" name="org" value={o.id} checked={orgId === String(o.id)} onChange={() => setOrgId(String(o.id))} className="mt-1 accent-[#1f7a4d]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800">{o.nombre}</p>
                          {stars && <span className="text-xs text-yellow-600">{stars}</span>}
                          {donCount && <span className="text-xs text-gray-400">{donCount}</span>}
                        </div>
                        {o.telefono && (
                          <a href={`https://wa.me/${o.telefono.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="mt-0.5 inline-flex items-center gap-1 text-xs text-green-700 hover:text-green-900">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Consultar por WhatsApp
                          </a>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
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
