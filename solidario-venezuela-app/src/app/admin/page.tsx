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

interface ApiToken {
  id: number;
  nombre: string;
  token: string;
  dominio: string;
  activo: boolean;
  usos: number;
  ultimo_uso?: string;
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
  const [activeSection, setActiveSection] = useState<'avisos' | 'tokens' | 'logs'>('avisos');

  // Avisos
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [form, setForm] = useState({ titulo: '', contenido: '', tipo: 'urgente' });
  const [avisoLoading, setAvisoLoading] = useState(false);
  const [avisoMsg, setAvisoMsg] = useState('');

  // Tokens
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [tokenForm, setTokenForm] = useState({ nombre: '', dominio: '' });
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenMsg, setTokenMsg] = useState('');
  const [newToken, setNewToken] = useState('');

  // Logs
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const login = async () => {
    setAuthError('');
    const res = await fetch(`/api/admin/tokens?secret=${encodeURIComponent(secret)}`);
    if (res.status === 401) { setAuthError('Clave incorrecta.'); return; }
    if (res.ok) {
      setTokens(await res.json() as ApiToken[]);
      setAuth(true);
    }
  };

  const loadAvisos = async () => {
    const r = await fetch('/api/avisos');
    setAvisos(await r.json() as Aviso[]);
  };

  const loadTokens = async () => {
    const r = await fetch(`/api/admin/tokens?secret=${encodeURIComponent(secret)}`);
    if (r.ok) setTokens(await r.json() as ApiToken[]);
  };

  const loadLogs = async () => {
    const r = await fetch(`/api/admin/logs?secret=${encodeURIComponent(secret)}`);
    if (r.ok) setLogs(await r.json() as AuditLog[]);
  };

  useEffect(() => {
    if (auth) { loadAvisos(); loadLogs(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const publicarAviso = async () => {
    if (!form.titulo || !form.contenido) { setAvisoMsg('Completa todos los campos.'); return; }
    setAvisoLoading(true); setAvisoMsg('');
    const res = await fetch(`/api/avisos?secret=${encodeURIComponent(secret)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    if (res.ok) {
      setAvisoMsg('✅ Aviso publicado.');
      setForm({ titulo: '', contenido: '', tipo: 'urgente' });
      loadAvisos();
    } else {
      const d = await res.json() as { error: string };
      setAvisoMsg(`❌ ${d.error}`);
    }
    setAvisoLoading(false);
  };

  const crearToken = async () => {
    if (!tokenForm.nombre || !tokenForm.dominio) { setTokenMsg('Nombre y dominio son requeridos.'); return; }
    setTokenLoading(true); setTokenMsg(''); setNewToken('');
    const res = await fetch(`/api/admin/tokens?secret=${encodeURIComponent(secret)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tokenForm),
    });
    if (res.ok) {
      const data = await res.json() as ApiToken;
      setNewToken(data.token);
      setTokenMsg('✅ Token creado. Copia el token ahora — no se mostrará de nuevo.');
      setTokenForm({ nombre: '', dominio: '' });
      loadTokens();
    } else {
      const d = await res.json() as { error: string };
      setTokenMsg(`❌ ${d.error}`);
    }
    setTokenLoading(false);
  };

  const revocarToken = async (id: number) => {
    if (!confirm('¿Revocar este token? El acceso desde ese dominio quedará bloqueado.')) return;
    await fetch(`/api/admin/tokens?secret=${encodeURIComponent(secret)}&id=${id}`, { method: 'DELETE' });
    loadTokens();
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

      {/* Navegación */}
      <div className="border-b border-gray-200 bg-white px-5">
        <div className="mx-auto max-w-3xl flex gap-1 overflow-x-auto">
          {([
            ['avisos',  '📢 Avisos'],
            ['tokens',  '🔑 Tokens API'],
            ['logs',    '🔍 Actividad'],
          ] as const).map(([v, l]) => (
            <button key={v} onClick={() => setActiveSection(v)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeSection === v
                  ? 'border-[#1f7a4d] text-[#1f7a4d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8 space-y-8">

        {/* ── AVISOS ── */}
        {activeSection === 'avisos' && (<>
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
                  placeholder="Ej: ⚠️ Zona de evacuación activa"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea value={form.contenido} onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))}
                  rows={3} maxLength={500} placeholder="Detalle del aviso..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none resize-none" />
              </div>
              {avisoMsg && <p className="text-sm text-gray-700">{avisoMsg}</p>}
              <button onClick={publicarAviso} disabled={avisoLoading}
                className="rounded-lg bg-[#1f7a4d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] disabled:opacity-50">
                {avisoLoading ? 'Publicando...' : 'Publicar aviso'}
              </button>
            </div>
          </div>

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
        </>)}

        {/* ── TOKENS API ── */}
        {activeSection === 'tokens' && (<>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-2">🔑 Crear token de API</h2>
            <p className="text-sm text-gray-500 mb-4">
              Cada token funciona exclusivamente desde el dominio registrado. Para una plataforma diferente se debe crear un token distinto.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Plataforma</label>
                <input value={tokenForm.nombre} onChange={e => setTokenForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Cruz Roja Colombia, UNICEF Venezuela..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dominio autorizado</label>
                <input value={tokenForm.dominio} onChange={e => setTokenForm(f => ({ ...f, dominio: e.target.value }))}
                  placeholder="Ej: cruzroja.org.co  (sin https://)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none" />
                <p className="text-xs text-gray-400 mt-1">El token solo funcionará desde peticiones que vengan de ese dominio.</p>
              </div>

              {newToken && (
                <div className="rounded-xl bg-yellow-50 border-2 border-yellow-300 p-4">
                  <p className="text-xs font-bold text-yellow-800 mb-2">⚠️ Copia este token AHORA — no se mostrará de nuevo:</p>
                  <code className="block bg-yellow-100 rounded-lg px-3 py-2 text-xs font-mono break-all text-yellow-900 select-all">{newToken}</code>
                  <button onClick={() => { void navigator.clipboard.writeText(newToken); }}
                    className="mt-2 rounded-lg bg-yellow-200 px-3 py-1.5 text-xs font-medium text-yellow-900 hover:bg-yellow-300">
                    📋 Copiar al portapapeles
                  </button>
                </div>
              )}

              {tokenMsg && (
                <p className={`text-sm ${tokenMsg.startsWith('✅') ? 'text-green-700' : 'text-red-600'}`}>{tokenMsg}</p>
              )}

              <button onClick={crearToken} disabled={tokenLoading}
                className="rounded-lg bg-[#1f7a4d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] disabled:opacity-50">
                {tokenLoading ? 'Creando...' : '🔑 Generar token'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                📋 Tokens ({tokens.filter(t => t.activo).length} activos)
              </h2>
              <button onClick={loadTokens} className="text-xs text-[#1f7a4d] hover:underline">Actualizar</button>
            </div>
            {tokens.length === 0 ? (
              <p className="text-sm text-gray-400">No hay tokens creados todavía.</p>
            ) : (
              <div className="space-y-3">
                {tokens.map(t => (
                  <div key={t.id}
                    className={`rounded-xl border p-4 ${t.activo ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-semibold text-gray-900">{t.nombre}</p>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            t.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {t.activo ? '● Activo' : '○ Revocado'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">🌐 <span className="font-mono">{t.dominio}</span></p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Usos: <strong>{t.usos}</strong>
                          {' · '}Creado: {new Date(t.created_at).toLocaleDateString('es-VE')}
                          {t.ultimo_uso ? ` · Último uso: ${new Date(t.ultimo_uso).toLocaleDateString('es-VE')}` : ''}
                        </p>
                        <p className="text-xs text-gray-300 font-mono mt-1">{t.token.slice(0, 18)}…</p>
                      </div>
                      {t.activo && (
                        <button onClick={() => revocarToken(t.id)}
                          className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                          Revocar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#eef6f1] border border-[#1f7a4d]/20 p-4 text-sm text-[#1f7a4d]">
            <p className="font-semibold mb-1">¿Cómo usar los tokens?</p>
            <p className="text-xs">La plataforma externa debe incluir el token en sus peticiones así:</p>
            <code className="block mt-2 bg-white/60 rounded-lg px-3 py-2 text-xs font-mono">
              Authorization: Bearer sv_xxxxxxxx<br />
              — o —<br />
              GET /api/donaciones?token=sv_xxxxxxxx
            </code>
            <p className="text-xs mt-2">El token solo funciona si la petición proviene del dominio registrado.</p>
          </div>
        </>)}

        {/* ── LOGS ── */}
        {activeSection === 'logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">🔍 Registro de actividad ({logs.length})</h2>
              <button onClick={loadLogs} className="text-xs text-[#1f7a4d] hover:underline">Actualizar</button>
            </div>
            <p className="text-xs text-gray-400 mb-4">IP, dispositivo y hora de cada registro. Las denuncias anónimas no se registran.</p>
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
                          {new Date(log.created_at).toLocaleDateString('es-VE')}{' '}
                          {new Date(log.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2 pr-3">
                          <span className="rounded-full bg-green-50 text-green-700 px-2 py-0.5 font-medium">{log.accion}</span>
                        </td>
                        <td className="py-2 pr-3 text-gray-600">{log.tabla} #{log.record_id ?? '—'}</td>
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
