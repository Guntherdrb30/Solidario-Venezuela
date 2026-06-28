'use client';
import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { PersonaCard } from '@/components/PersonaCard';
import { CentroCard } from '@/components/CentroCard';
import { DenunciaCard } from '@/components/DenunciaCard';
import { VoluntarioCard } from '@/components/VoluntarioCard';
import { RescateCard } from '@/components/RescateCard';
import { DanoCard } from '@/components/DanoCard';
import { PeritoCard } from '@/components/PeritoCard';
import { DonacionCard } from '@/components/DonacionCard';
import { OrganizacionCard } from '@/components/OrganizacionCard';
import { StatsBar } from '@/components/StatsBar';
import { AvisoBanner } from '@/components/AvisoBanner';
import { AgregarPersonaModal } from '@/components/AgregarPersonaModal';
import { AgregarCentroModal } from '@/components/AgregarCentroModal';
import { AgregarDenunciaModal } from '@/components/AgregarDenunciaModal';
import { AgregarVoluntarioModal } from '@/components/AgregarVoluntarioModal';
import { AgregarRescateModal } from '@/components/AgregarRescateModal';
import { AgregarDanoModal } from '@/components/AgregarDanoModal';
import { AgregarPeritoModal } from '@/components/AgregarPeritoModal';
import { AgregarDonacionModal } from '@/components/AgregarDonacionModal';
import { AgregarOrganizacionModal } from '@/components/AgregarOrganizacionModal';
import { Pagination } from '@/components/Pagination';
import { ESTADOS_VENEZUELA } from '@/lib/venezuela-data';

async function shareApp() {
  const url = window.location.origin;
  const text = 'Solidario Venezuela — Encuentra personas desaparecidas y centros de ayuda tras el terremoto en Venezuela.';
  if (navigator.share) {
    await navigator.share({ title: 'Solidario Venezuela', text, url });
  } else {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    alert('Enlace copiado al portapapeles.');
  }
}

type Tab = 'donaciones' | 'organizaciones' | 'personas' | 'centros' | 'voluntarios' | 'denuncias' | 'rescate' | 'danos' | 'peritos';

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: 'donaciones',    label: 'Donaciones',       icon: '💰' },
  { value: 'organizaciones',label: 'Organizaciones',   icon: '🏛️' },
  { value: 'personas',      label: 'Personas',         icon: '👤' },
  { value: 'centros',       label: 'Centros de Ayuda', icon: '🏠' },
  { value: 'voluntarios',   label: 'Voluntarios',      icon: '🙋' },
  { value: 'rescate',       label: 'Rescate',          icon: '🆘' },
  { value: 'danos',         label: 'Daños',            icon: '🏚️' },
  { value: 'peritos',       label: 'Peritos',          icon: '👷' },
  { value: 'denuncias',     label: 'Denuncias',        icon: '🚨' },
];

const ENDPOINTS: Record<Tab, string> = {
  donaciones:    '/api/donaciones',
  organizaciones:'/api/organizaciones',
  personas:      '/api/personas',
  centros:       '/api/centros',
  denuncias:     '/api/denuncias',
  voluntarios:   '/api/voluntarios',
  rescate:       '/api/rescate',
  danos:         '/api/danos',
  peritos:       '/api/peritos',
};

const EMPTY_LABELS: Record<Tab, string> = {
  donaciones:    'No hay donaciones registradas aún',
  organizaciones:'No hay organizaciones registradas aún',
  personas:      'No hay personas registradas aún',
  centros:       'No hay centros de ayuda registrados aún',
  denuncias:     'No hay denuncias registradas aún',
  voluntarios:   'No hay voluntarios registrados aún',
  rescate:       'No hay solicitudes de rescate activas',
  danos:         'No hay reportes de daños estructurales',
  peritos:       'No hay peritos voluntarios registrados aún',
};

export default function Home() {
  const [tab, setTab] = useState<Tab>('personas');
  const [query, setQuery] = useState('');
  const [estado, setEstado] = useState('');
  const [results, setResults] = useState<unknown[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddPersona, setShowAddPersona] = useState(false);
  const [showAddCentro, setShowAddCentro] = useState(false);
  const [showAddDenuncia, setShowAddDenuncia] = useState(false);
  const [showAddVoluntario, setShowAddVoluntario] = useState(false);
  const [showAddRescate, setShowAddRescate] = useState(false);
  const [showAddDano, setShowAddDano] = useState(false);
  const [showAddPerito, setShowAddPerito] = useState(false);
  const [showAddDonacion, setShowAddDonacion] = useState(false);
  const [showAddOrganizacion, setShowAddOrganizacion] = useState(false);

  const fetchResults = useCallback(async (q: string, currentTab: Tab, est: string, p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (est && currentTab !== 'denuncias') params.set('estado', est);
      if (p > 1) params.set('page', String(p));
      const res = await fetch(`${ENDPOINTS[currentTab]}?${params}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await res.json() as any;
      if (data && typeof data === 'object' && 'results' in data) {
        setResults(Array.isArray(data.results) ? data.results : []);
        setPagination({ total: data.total ?? 0, page: data.page ?? 1, pages: data.pages ?? 1 });
      } else {
        setResults(Array.isArray(data) ? data : []);
        setPagination({ total: 0, page: 1, pages: 1 });
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    const t = setTimeout(() => fetchResults(query, tab, estado, 1), 300);
    return () => clearTimeout(t);
  }, [query, tab, estado, fetchResults]);

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setQuery('');
    setPage(1);
    setResults([]);
  };

  const handlePage = (n: number) => {
    setPage(n);
    fetchResults(query, tab, estado, n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      {/* ── Hero ── */}
      <section id="buscar" className="bg-[#17221c] py-14 px-5">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#f0d963]">
            Solidario Venezuela — Terremoto Venezuela
          </p>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Busca personas desaparecidas o centros de ayuda
          </h1>
          <p className="mb-8 text-[#a8c4b0] text-base sm:text-lg">
            Apoyo a damnificados y afectados por el terremoto en Venezuela
          </p>
          <SearchBar value={query} onChange={setQuery} />
          <StatsBar />
          <div className="mt-6">
            <button onClick={shareApp}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir esta aplicación
            </button>
          </div>
        </div>
      </section>

      {/* ── Sub-hero: Donaciones ── */}
      <section className="bg-gradient-to-br from-[#1a3a2a] to-[#0f2a1a] py-10 px-5 border-t border-white/10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-[#f0d963] text-xs font-semibold uppercase tracking-widest mb-3">Nueva sección — Transparencia en donaciones</p>
              <h2 className="text-2xl font-bold text-white mb-3">
                ¿Recaudaste o quieres donar? Regístralo aquí.
              </h2>
              <p className="text-[#a8c4b0] text-sm leading-relaxed mb-4">
                Uno de los mayores problemas en emergencias es que las donaciones no llegan a su destino.
                Esta plataforma documenta públicamente cada donación — quién la hizo, cuánto es, para qué debe usarse —
                y conecta a los donantes con organizaciones verificadas en Venezuela que pueden recibirla responsablemente.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { handleTabChange('donaciones'); document.getElementById('buscar')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f0d963] px-5 py-2.5 text-sm font-bold text-[#17221c] hover:bg-yellow-300 transition-colors">
                  💰 Registrar donación
                </button>
                <button onClick={() => { handleTabChange('organizaciones'); document.getElementById('buscar')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                  🏛️ Ver organizaciones
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {[
                { icon: '💰', label: 'Documenta', desc: 'Registra monto, tipo y propósito' },
                { icon: '🏛️', label: 'Conecta', desc: 'Encuentra org. verificadas' },
                { icon: '📋', label: 'Transparencia', desc: 'Todo queda documentado' },
                { icon: '✅', label: 'Trazabilidad', desc: 'Responsables reales identificados' },
              ].map(item => (
                <div key={item.label} className="rounded-xl bg-white/10 border border-white/10 p-3 text-center">
                  <p className="text-2xl mb-1">{item.icon}</p>
                  <p className="text-xs font-bold text-white">{item.label}</p>
                  <p className="text-xs text-[#a8c4b0] mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Avisos oficiales ── */}
      <AvisoBanner />

      {/* ── Contenido ── */}
      <div className="mx-auto max-w-6xl px-5 py-8">

        {/* Tabs + acciones */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="inline-flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            {TABS.map(t => (
              <button key={t.value} type="button" onClick={() => handleTabChange(t.value)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tab === t.value
                    ? t.value === 'denuncias'
                      ? 'bg-red-600 text-white shadow-sm'
                      : t.value === 'rescate'
                      ? 'bg-red-700 text-white shadow-sm'
                      : t.value === 'danos'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : t.value === 'peritos'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#1f7a4d] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {tab === 'personas' && (
              <button onClick={() => setShowAddPersona(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] transition-colors shadow-sm">
                + Agregar Persona
              </button>
            )}
            {tab === 'centros' && (
              <button onClick={() => setShowAddCentro(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-[#1f7a4d] hover:bg-[#eef6f1] transition-colors">
                + Agregar Centro
              </button>
            )}
            {tab === 'voluntarios' && (
              <button onClick={() => setShowAddVoluntario(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] transition-colors shadow-sm">
                🙋 Ser voluntario
              </button>
            )}
            {tab === 'denuncias' && (
              <button onClick={() => setShowAddDenuncia(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm">
                🚨 Hacer denuncia anónima
              </button>
            )}
            {tab === 'rescate' && (
              <button onClick={() => setShowAddRescate(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 transition-colors shadow-sm">
                🆘 Pedir rescate
              </button>
            )}
            {tab === 'danos' && (
              <button onClick={() => setShowAddDano(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 transition-colors shadow-sm">
                🏚️ Reportar daño
              </button>
            )}
            {tab === 'peritos' && (
              <button onClick={() => setShowAddPerito(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
                👷 Ofrecer peritaje
              </button>
            )}
            {tab === 'donaciones' && (
              <button onClick={() => setShowAddDonacion(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] transition-colors shadow-sm">
                💰 Registrar donación
              </button>
            )}
            {tab === 'organizaciones' && (
              <button onClick={() => setShowAddOrganizacion(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] transition-colors shadow-sm">
                🏛️ Registrar organización
              </button>
            )}
          </div>
        </div>

        {/* Filtro por estado */}
        {tab !== 'denuncias' && (
          <div className="mb-5 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 shrink-0">Filtrar por estado:</label>
            <select value={estado} onChange={e => setEstado(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-[#1f7a4d] focus:outline-none shadow-sm">
              <option value="">Todos los estados</option>
              {ESTADOS_VENEZUELA.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {estado && (
              <button onClick={() => setEstado('')} className="text-xs text-gray-400 hover:text-gray-700">
                ✕ Limpiar
              </button>
            )}
          </div>
        )}

        {/* Avisos contextuales por tab */}
        {tab === 'denuncias' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <span className="text-red-500 text-xl shrink-0">🔒</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Denuncias completamente anónimas</p>
              <p className="text-xs text-red-600 mt-0.5">
                No almacenamos ningún dato personal. Puedes reportar robos, extorsiones, abusos de autoridad u otras anomalías con total privacidad.
              </p>
            </div>
          </div>
        )}
        {tab === 'voluntarios' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-[#eef6f1] border border-[#1f7a4d]/20 px-4 py-3">
            <span className="text-2xl shrink-0">🙋</span>
            <div>
              <p className="text-sm font-semibold text-[#17221c]">¿Puedes ayudar?</p>
              <p className="text-xs text-[#526058] mt-0.5">
                Regístrate como voluntario para conectarte con centros y familias que necesitan apoyo.
              </p>
            </div>
          </div>
        )}
        {tab === 'rescate' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <span className="text-2xl shrink-0">🆘</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Solicitudes de rescate activas</p>
              <p className="text-xs text-red-600 mt-0.5">
                Para emergencias con riesgo de vida también llama al <strong>911</strong>. Estas solicitudes son visibles para brigadas y voluntarios de rescate.
              </p>
            </div>
          </div>
        )}
        {tab === 'danos' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3">
            <span className="text-2xl shrink-0">🏚️</span>
            <div>
              <p className="text-sm font-semibold text-orange-800">Reportes de daños estructurales</p>
              <p className="text-xs text-orange-700 mt-0.5">
                Peritos e ingenieros voluntarios pueden ver estos reportes y contactar a los afectados para ofrecer evaluación gratuita.
              </p>
            </div>
          </div>
        )}
        {tab === 'peritos' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
            <span className="text-2xl shrink-0">👷</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">Peritos e ingenieros voluntarios</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Profesionales del área que ofrecen peritaje gratuito a los afectados por el terremoto. ¿Eres ingeniero o arquitecto? ¡Regístrate!
              </p>
            </div>
          </div>
        )}
        {tab === 'donaciones' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-[#eef6f1] border border-[#1f7a4d]/20 px-4 py-3">
            <span className="text-2xl shrink-0">💰</span>
            <div>
              <p className="text-sm font-semibold text-[#17221c]">Donaciones documentadas públicamente</p>
              <p className="text-xs text-[#526058] mt-0.5">
                Personas, empresas y organizaciones que recaudaron o desean donar. Cada registro incluye el propósito y los datos del responsable para garantizar transparencia.
              </p>
            </div>
          </div>
        )}
        {tab === 'organizaciones' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-[#eef6f1] border border-[#1f7a4d]/20 px-4 py-3">
            <span className="text-2xl shrink-0">🏛️</span>
            <div>
              <p className="text-sm font-semibold text-[#17221c]">Organizaciones receptoras de donaciones</p>
              <p className="text-xs text-[#526058] mt-0.5">
                ONGs, fundaciones, grupos comunitarios e iglesias que reciben y distribuyen ayuda. Las marcadas con ✅ han sido verificadas por el equipo de Solidario Venezuela.
              </p>
            </div>
          </div>
        )}

        {/* Resultados */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#1f7a4d] border-t-transparent" />
            <p className="text-sm">Buscando...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">{TABS.find(t => t.value === tab)?.icon}</p>
            <p className="text-base font-medium text-gray-600">
              {query || estado ? `No se encontraron resultados${estado ? ` en ${estado}` : ''}${query ? ` para "${query}"` : ''}` : EMPTY_LABELS[tab]}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {tab === 'denuncias'
                ? 'Usa el botón de arriba para registrar una denuncia anónima'
                : tab === 'voluntarios'
                ? 'Usa el botón para registrarte como voluntario'
                : tab === 'rescate'
                ? 'Usa el botón para enviar una solicitud de rescate'
                : tab === 'danos'
                ? 'Usa el botón para reportar un daño estructural'
                : tab === 'peritos'
                ? 'Usa el botón para registrarte como perito voluntario'
                : 'Usa los botones de arriba para agregar el primero'}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">
              {pagination.total > 0 ? pagination.total : results.length} resultado{(pagination.total || results.length) !== 1 ? 's' : ''}{estado ? ` en ${estado}` : ''}
              {pagination.pages > 1 ? ` — página ${pagination.page} de ${pagination.pages}` : ''}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tab === 'personas' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(p => <PersonaCard key={p.id} persona={p} />)}
              {tab === 'centros' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(c => <CentroCard key={c.id} centro={c} />)}
              {tab === 'denuncias' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(d => <DenunciaCard key={d.id} denuncia={d} />)}
              {tab === 'voluntarios' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(v => <VoluntarioCard key={v.id} voluntario={v} />)}
              {tab === 'rescate' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(r => <RescateCard key={r.id} rescate={r} />)}
              {tab === 'danos' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(d => <DanoCard key={d.id} dano={d} />)}
              {tab === 'peritos' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(p => <PeritoCard key={p.id} perito={p} />)}
              {tab === 'donaciones' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(d => <DonacionCard key={d.id} donacion={d} />)}
              {tab === 'organizaciones' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results as any[]).map(o => <OrganizacionCard key={o.id} org={o} />)}
            </div>
            <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPage={handlePage} />
          </>
        )}
      </div>

      {showAddPersona && <AgregarPersonaModal open={showAddPersona} onClose={() => setShowAddPersona(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
      {showAddCentro && <AgregarCentroModal open={showAddCentro} onClose={() => setShowAddCentro(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
      {showAddDenuncia && <AgregarDenunciaModal open={showAddDenuncia} onClose={() => setShowAddDenuncia(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
      {showAddVoluntario && <AgregarVoluntarioModal open={showAddVoluntario} onClose={() => setShowAddVoluntario(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
      {showAddRescate && <AgregarRescateModal onClose={() => setShowAddRescate(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
      {showAddDano && <AgregarDanoModal onClose={() => setShowAddDano(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
      {showAddPerito && <AgregarPeritoModal onClose={() => setShowAddPerito(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
      {showAddDonacion && <AgregarDonacionModal onClose={() => setShowAddDonacion(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
      {showAddOrganizacion && <AgregarOrganizacionModal onClose={() => setShowAddOrganizacion(false)} onSuccess={() => fetchResults(query, tab, estado)} />}
    </main>
  );
}
