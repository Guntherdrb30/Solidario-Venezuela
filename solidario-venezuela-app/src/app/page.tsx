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

const SEARCH_PLACEHOLDERS: Record<Tab, string> = {
  personas:       'Buscar persona por nombre, cédula, ciudad...',
  centros:        'Buscar centro por nombre, tipo o ciudad...',
  voluntarios:    'Buscar voluntario por habilidad o ciudad...',
  denuncias:      'Buscar denuncia por tipo o ciudad...',
  rescate:        'Buscar solicitud por tipo, dirección o ciudad...',
  danos:          'Buscar daño por dirección, tipo o ciudad...',
  peritos:        'Buscar perito por profesión o ciudad...',
  donaciones:     'Buscar donación por propósito, categoría o donante...',
  organizaciones: 'Buscar organización por nombre, área o ciudad...',
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <section id="buscar" className="bg-[#17221c] py-12 px-5">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#f0d963]">
            Solidario Venezuela — Terremoto Venezuela
          </p>
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            ¿Qué necesitas buscar?
          </h1>
          <p className="mb-6 text-[#a8c4b0] text-sm">
            Selecciona una categoría y escribe tu búsqueda
          </p>

          {/* Selector de categoría */}
          <div className="mb-5 flex flex-wrap justify-center gap-2">
            {TABS.map(t => (
              <button key={t.value} type="button"
                onClick={() => {
                  handleTabChange(t.value);
                  document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  tab === t.value
                    ? t.value === 'rescate' || t.value === 'denuncias'
                      ? 'border-red-400 bg-red-600 text-white shadow-lg scale-105'
                      : t.value === 'danos'
                      ? 'border-orange-400 bg-orange-500 text-white shadow-lg scale-105'
                      : t.value === 'peritos'
                      ? 'border-blue-400 bg-blue-600 text-white shadow-lg scale-105'
                      : 'border-[#1f7a4d] bg-[#1f7a4d] text-white shadow-lg scale-105'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Buscador con placeholder contextual */}
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={SEARCH_PLACEHOLDERS[tab]}
          />

          <StatsBar />
          <div className="mt-5">
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

      {/* ── Mobile sticky bar ── */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
          className="flex flex-col gap-1 rounded-lg p-2 hover:bg-gray-100 transition-colors">
          <span className="block h-0.5 w-5 bg-gray-700 rounded-full" />
          <span className="block h-0.5 w-5 bg-gray-700 rounded-full" />
          <span className="block h-0.5 w-5 bg-gray-700 rounded-full" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-lg">{TABS.find(t => t.value === tab)?.icon}</span>
          <span className="truncate font-semibold text-gray-900">{TABS.find(t => t.value === tab)?.label}</span>
        </div>
        {tab === 'personas'      && <button onClick={() => setShowAddPersona(true)}     className="shrink-0 rounded-lg bg-[#1f7a4d] px-3 py-1.5 text-xs font-bold text-white">+ Agregar</button>}
        {tab === 'centros'       && <button onClick={() => setShowAddCentro(true)}      className="shrink-0 rounded-lg bg-[#1f7a4d] px-3 py-1.5 text-xs font-bold text-white">+ Agregar</button>}
        {tab === 'voluntarios'   && <button onClick={() => setShowAddVoluntario(true)}  className="shrink-0 rounded-lg bg-[#1f7a4d] px-3 py-1.5 text-xs font-bold text-white">🙋 Unirme</button>}
        {tab === 'denuncias'     && <button onClick={() => setShowAddDenuncia(true)}    className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">🚨 Denunciar</button>}
        {tab === 'rescate'       && <button onClick={() => setShowAddRescate(true)}     className="shrink-0 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white">🆘 SOS</button>}
        {tab === 'danos'         && <button onClick={() => setShowAddDano(true)}        className="shrink-0 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white">+ Reportar</button>}
        {tab === 'peritos'       && <button onClick={() => setShowAddPerito(true)}      className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">👷 Ofrecer</button>}
        {tab === 'donaciones'    && <button onClick={() => setShowAddDonacion(true)}    className="shrink-0 rounded-lg bg-[#1f7a4d] px-3 py-1.5 text-xs font-bold text-white">💰 Donar</button>}
        {tab === 'organizaciones'&& <button onClick={() => setShowAddOrganizacion(true)}className="shrink-0 rounded-lg bg-[#1f7a4d] px-3 py-1.5 text-xs font-bold text-white">🏛️ Registrar</button>}
      </div>

      {/* ── Overlay sidebar móvil ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Layout: Sidebar + Contenido ── */}
      <div id="resultados" className="flex items-start">

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl border-r border-gray-100
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0 lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-5">
            <div>
              <p className="font-bold text-[#17221c] text-base">🇻🇪 Solidario Venezuela</p>
              <p className="text-xs text-gray-400 mt-0.5">Terremoto Venezuela</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Secciones</p>
            <div className="space-y-0.5">
              {TABS.map(t => {
                const isActive = tab === t.value;
                const activeCls =
                  t.value === 'rescate' || t.value === 'denuncias' ? 'bg-red-600 text-white shadow-sm' :
                  t.value === 'danos'   ? 'bg-orange-500 text-white shadow-sm' :
                  t.value === 'peritos' ? 'bg-blue-600 text-white shadow-sm' :
                  'bg-[#1f7a4d] text-white shadow-sm';
                return (
                  <button key={t.value} type="button"
                    onClick={() => { handleTabChange(t.value); setSidebarOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      isActive ? activeCls : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}>
                    <span className="shrink-0 text-xl">{t.icon}</span>
                    <span className="flex-1">{t.label}</span>
                    {isActive && <span className="h-2 w-2 shrink-0 rounded-full bg-white/70" />}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="shrink-0 border-t border-gray-100 px-3 py-4 space-y-1">
            <button onClick={shareApp}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir aplicación
            </button>
            <a href="/api-docs" target="_blank" rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              API pública / Docs
            </a>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="min-w-0 flex-1 px-4 py-6 lg:px-8">

          {/* Header de sección + botón de acción */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {TABS.find(t => t.value === tab)?.icon}{' '}
                {TABS.find(t => t.value === tab)?.label}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {pagination.total > 0 ? `${pagination.total} registros encontrados` : 'Sin registros aún'}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tab === 'personas' && (
                <button onClick={() => setShowAddPersona(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] shadow-sm">
                  + Agregar Persona
                </button>
              )}
              {tab === 'centros' && (
                <button onClick={() => setShowAddCentro(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-[#1f7a4d] hover:bg-[#eef6f1]">
                  + Agregar Centro
                </button>
              )}
              {tab === 'voluntarios' && (
                <button onClick={() => setShowAddVoluntario(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] shadow-sm">
                  🙋 Ser voluntario
                </button>
              )}
              {tab === 'denuncias' && (
                <button onClick={() => setShowAddDenuncia(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 shadow-sm">
                  🚨 Hacer denuncia anónima
                </button>
              )}
              {tab === 'rescate' && (
                <button onClick={() => setShowAddRescate(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 shadow-sm">
                  🆘 Pedir rescate
                </button>
              )}
              {tab === 'danos' && (
                <button onClick={() => setShowAddDano(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 shadow-sm">
                  🏚️ Reportar daño
                </button>
              )}
              {tab === 'peritos' && (
                <button onClick={() => setShowAddPerito(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm">
                  👷 Ofrecer peritaje
                </button>
              )}
              {tab === 'donaciones' && (
                <button onClick={() => setShowAddDonacion(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] shadow-sm">
                  💰 Registrar donación
                </button>
              )}
              {tab === 'organizaciones' && (
                <button onClick={() => setShowAddOrganizacion(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] shadow-sm">
                  🏛️ Registrar organización
                </button>
              )}
            </div>
          </div>

          {/* Filtro por estado */}
          {tab !== 'denuncias' && (
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <label className="shrink-0 text-sm font-medium text-gray-600">Filtrar por estado:</label>
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

          {/* Avisos contextuales */}
          {tab === 'denuncias' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <span className="shrink-0 text-xl text-red-500">🔒</span>
              <div>
                <p className="text-sm font-semibold text-red-800">Denuncias completamente anónimas</p>
                <p className="mt-0.5 text-xs text-red-600">No almacenamos ningún dato personal. Reporta robos, extorsiones o abusos con total privacidad.</p>
              </div>
            </div>
          )}
          {tab === 'voluntarios' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#1f7a4d]/20 bg-[#eef6f1] px-4 py-3">
              <span className="shrink-0 text-2xl">🙋</span>
              <div>
                <p className="text-sm font-semibold text-[#17221c]">¿Puedes ayudar?</p>
                <p className="mt-0.5 text-xs text-[#526058]">Regístrate como voluntario para conectarte con centros y familias que necesitan apoyo.</p>
              </div>
            </div>
          )}
          {tab === 'rescate' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <span className="shrink-0 text-2xl">🆘</span>
              <div>
                <p className="text-sm font-semibold text-red-800">Solicitudes de rescate activas</p>
                <p className="mt-0.5 text-xs text-red-600">Para emergencias con riesgo de vida también llama al <strong>911</strong>.</p>
              </div>
            </div>
          )}
          {tab === 'danos' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
              <span className="shrink-0 text-2xl">🏚️</span>
              <div>
                <p className="text-sm font-semibold text-orange-800">Reportes de daños estructurales</p>
                <p className="mt-0.5 text-xs text-orange-700">Peritos e ingenieros voluntarios pueden ver estos reportes y contactar a los afectados.</p>
              </div>
            </div>
          )}
          {tab === 'peritos' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <span className="shrink-0 text-2xl">👷</span>
              <div>
                <p className="text-sm font-semibold text-blue-800">Peritos e ingenieros voluntarios</p>
                <p className="mt-0.5 text-xs text-blue-700">¿Eres ingeniero o arquitecto? ¡Regístrate y ofrece peritaje gratuito!</p>
              </div>
            </div>
          )}
          {tab === 'donaciones' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#1f7a4d]/20 bg-[#eef6f1] px-4 py-3">
              <span className="shrink-0 text-2xl">💰</span>
              <div>
                <p className="text-sm font-semibold text-[#17221c]">Donaciones documentadas públicamente</p>
                <p className="mt-0.5 text-xs text-[#526058]">Cada registro incluye propósito y datos del responsable para garantizar transparencia total.</p>
              </div>
            </div>
          )}
          {tab === 'organizaciones' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#1f7a4d]/20 bg-[#eef6f1] px-4 py-3">
              <span className="shrink-0 text-2xl">🏛️</span>
              <div>
                <p className="text-sm font-semibold text-[#17221c]">Organizaciones receptoras de donaciones</p>
                <p className="mt-0.5 text-xs text-[#526058]">ONGs, fundaciones y grupos verificados ✅ que reciben y distribuyen ayuda responsablemente.</p>
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
              <p className="mb-4 text-5xl">{TABS.find(t => t.value === tab)?.icon}</p>
              <p className="text-base font-medium text-gray-600">
                {query || estado
                  ? `No se encontraron resultados${estado ? ` en ${estado}` : ''}${query ? ` para "${query}"` : ''}`
                  : EMPTY_LABELS[tab]}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {tab === 'denuncias'     ? 'Usa el botón para registrar una denuncia anónima' :
                 tab === 'voluntarios'   ? 'Usa el botón para registrarte como voluntario' :
                 tab === 'rescate'       ? 'Usa el botón para enviar una solicitud de rescate' :
                 tab === 'danos'         ? 'Usa el botón para reportar un daño estructural' :
                 tab === 'peritos'       ? 'Usa el botón para registrarte como perito voluntario' :
                 'Usa los botones de arriba para agregar el primero'}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {pagination.total > 0 ? pagination.total : results.length} resultado{(pagination.total || results.length) !== 1 ? 's' : ''}{estado ? ` en ${estado}` : ''}
                {pagination.pages > 1 ? ` — página ${pagination.page} de ${pagination.pages}` : ''}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tab === 'personas'       && (results as any[]).map(p => <PersonaCard key={p.id} persona={p} />)}       {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                {tab === 'centros'        && (results as any[]).map(c => <CentroCard key={c.id} centro={c} />)}         {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                {tab === 'denuncias'      && (results as any[]).map(d => <DenunciaCard key={d.id} denuncia={d} />)}     {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                {tab === 'voluntarios'    && (results as any[]).map(v => <VoluntarioCard key={v.id} voluntario={v} />)} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                {tab === 'rescate'        && (results as any[]).map(r => <RescateCard key={r.id} rescate={r} />)}       {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                {tab === 'danos'          && (results as any[]).map(d => <DanoCard key={d.id} dano={d} />)}             {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                {tab === 'peritos'        && (results as any[]).map(p => <PeritoCard key={p.id} perito={p} />)}         {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                {tab === 'donaciones'     && (results as any[]).map(d => <DonacionCard key={d.id} donacion={d} />)}     {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                {tab === 'organizaciones' && (results as any[]).map(o => <OrganizacionCard key={o.id} org={o} />)}      {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
              </div>
              <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPage={handlePage} />
            </>
          )}
        </div>
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
