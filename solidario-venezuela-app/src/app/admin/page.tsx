'use client';
import { useState, useEffect } from 'react';

interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  tipo: string;
  activo: boolean;
  created_at: string;
}

const TIPO_OPTS = [
  { value: 'urgente', label: '🚨 Urgente', cls: 'bg-red-100 text-red-800' },
  { value: 'alerta',  label: '⚠️ Alerta',  cls: 'bg-yellow-100 text-yellow-800' },
  { value: 'info',    label: 'ℹ️ Info',     cls: 'bg-blue-100 text-blue-800' },
];

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [auth, setAuth] = useState(false);
  const [authError, setAuthError] = useState('');
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [form, setForm] = useState({ titulo: '', contenido: '', tipo: 'urgente' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const login = async () => {
    const res = await fetch('/api/avisos');
    if (res.ok) {
      const res2 = await fetch(`/api/avisos?secret=${encodeURIComponent(secret)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: '__test__', contenido: '__test__', tipo: 'info' }) });
      if (res2.status === 401) { setAuthError('Clave incorrecta.'); return; }
      setAuth(true);
      loadAvisos();
    }
  };

  const loadAvisos = async () => {
    const r = await fetch('/api/avisos');
    setAvisos(await r.json() as Aviso[]);
  };

  useEffect(() => { if (auth) loadAvisos(); }, [auth]);

  const publicar = async () => {
    if (!form.titulo || !form.contenido) { setMsg('Completa todos los campos.'); return; }
    setLoading(true);
    setMsg('');
    const res = await fetch(`/api/avisos?secret=${encodeURIComponent(secret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg('✅ Aviso publicado.');
      setForm({ titulo: '', contenido: '', tipo: 'urgente' });
      loadAvisos();
    } else {
      const d = await res.json() as { error: string };
      setMsg(`❌ ${d.error}`);
    }
    setLoading(false);
  };

  if (!auth) return (
    <main className="min-h-screen bg-[#f8f7f2] flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm text-center">
        <p className="text-3xl mb-4">🔐</p>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Panel de administración</h1>
        <p className="text-sm text-gray-500 mb-6">Solo para coordinadores autorizados</p>
        <input
          type="password" value={secret} onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Clave de administrador"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1f7a4d] focus:outline-none mb-3" />
        {authError && <p className="text-sm text-red-600 mb-3">{authError}</p>}
        <button onClick={login}
          className="w-full rounded-lg bg-[#1f7a4d] py-2.5 text-sm font-semibold text-white hover:bg-[#17663f]">
          Ingresar
        </button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      <div className="bg-[#17221c] py-8 px-5 text-center">
        <h1 className="text-2xl font-bold text-white">🔐 Panel de administración</h1>
        <p className="text-[#a8c4b0] text-sm mt-1">Solidario Venezuela</p>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8 space-y-8">

        {/* Publicar aviso */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">📢 Publicar aviso oficial</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <div className="flex gap-2">
                {TIPO_OPTS.map(t => (
                  <button key={t.value} type="button"
                    onClick={() => setForm(f => ({ ...f, tipo: t.value }))}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      form.tipo === t.value ? 'border-[#1f7a4d] bg-[#eef6f1] text-[#1f7a4d]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                placeholder="Ej: ⚠️ Zona de evacuación activa en Los Chorros"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea value={form.contenido} onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))}
                rows={3} maxLength={500}
                placeholder="Detalle del aviso..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
            </div>
            {msg && <p className="text-sm text-gray-700">{msg}</p>}
            <button onClick={publicar} disabled={loading}
              className="rounded-lg bg-[#1f7a4d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] disabled:opacity-50">
              {loading ? 'Publicando...' : 'Publicar aviso'}
            </button>
          </div>
        </div>

        {/* Avisos activos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">📋 Avisos publicados ({avisos.length})</h2>
          {avisos.length === 0 ? (
            <p className="text-sm text-gray-400">No hay avisos publicados.</p>
          ) : (
            <div className="space-y-3">
              {avisos.map(a => {
                const t = TIPO_OPTS.find(x => x.value === a.tipo) ?? TIPO_OPTS[2];
                return (
                  <div key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3">
                    <div className="min-w-0">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${t.cls} mb-1`}>{t.label}</span>
                      <p className="text-sm font-medium text-gray-900">{a.titulo}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.contenido}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleDateString('es-VE')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
