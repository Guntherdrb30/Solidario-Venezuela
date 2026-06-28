'use client';
import { useState, useEffect } from 'react';

interface AuditLog {
  id: number;
  accion: string;
  tabla: string;
  record_id: number | null;
  ip: string;
  user_agent: string;
  created_at: string;
}

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
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeSection, setActiveSection] = useState<'avisos' | 'logs'>('avisos');
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

  const loadLogs = async () => {
    const r = await fetch(`/api/admin/logs?secret=${encodeURIComponent(secret)}`);
    if (r.ok) setLogs(await r.json() as AuditLog[]);
  };

  useEffect(() => {
    if (auth) {
      loadAvisos();
      loadLogs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

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
        <div className="mt-4 inline-flex gap-1 rounded-lg bg-white/10 p-1">
          <button onClick={() => setActiveSection('avisos')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${activeSection === 'avisos' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'}`}>
            📢 Avisos
          </button>
          <button onClick={() => setActiveSection('logs')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${activeSection === 'logs' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'}`}>
            🔍 Registro de actividad
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8 space-y-8">

        {/* Sección: avisos */}
        {activeSection === 'avisos' && <>

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

        </>}

        {/* Sección: logs de auditoría */}
        {activeSection === 'logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">🔍 Registro de actividad ({logs.length})</h2>
              <button onClick={loadLogs} className="text-xs text-[#1f7a4d] hover:underline">Actualizar</button>
            </div>
            <p className="text-xs text-gray-400 mb-4">IP, dispositivo y hora de cada acción de registro en la plataforma. Las denuncias anónimas no se registran.</p>
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400">No hay registros aún.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-gray-500">
                      <th className="pb-2 pr-3 font-medium">Fecha / Hora</th>
                      <th className="pb-2 pr-3 font-medium">Acción</th>
                      <th className="pb-2 pr-3 font-medium">Registro #</th>
                      <th className="pb-2 pr-3 font-medium">IP</th>
                      <th className="pb-2 font-medium">Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-2 pr-3 text-gray-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleDateString('es-VE')} {new Date(log.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2 pr-3">
                          <span className="rounded-full bg-green-50 text-green-700 px-2 py-0.5 font-medium">{log.accion}</span>
                        </td>
                        <td className="py-2 pr-3 text-gray-600">
                          {log.tabla} #{log.record_id ?? '—'}
                        </td>
                        <td className="py-2 pr-3 font-mono text-gray-700">{log.ip}</td>
                        <td className="py-2 text-gray-400 max-w-[200px] truncate" title={log.user_agent}>
                          {log.user_agent.replace(/\(.*?\)/g, '').slice(0, 60)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
