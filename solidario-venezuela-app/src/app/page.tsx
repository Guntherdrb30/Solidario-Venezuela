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
import { StatsBar } from '@/components/StatsBar';
import { AvisoBanner } from '@/components/AvisoBanner';
import { AgregarPersonaModal } from '@/components/AgregarPersonaModal';
import { AgregarCentroModal } from '@/components/AgregarCentroModal';
import { AgregarDenunciaModal } from '@/components/AgregarDenunciaModal';
import { AgregarVoluntarioModal } from '@/components/AgregarVoluntarioModal';
import { AgregarRescateModal } from '@/components/AgregarRescateModal';
import { AgregarDanoModal } from '@/components/AgregarDanoModal';
import { AgregarPeritoModal } from '@/components/AgregarPeritoModal';
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

type Tab = 'personas' | 'centros' | 'voluntarios' | 'denuncias' | 'rescate' | 'danos' | 'peritos';

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: 'personas',    label: 'Personas',         icon: '👤' },
  { value: 'centros',     label: 'Centros de Ayuda', icon: '🏠' },
  { value: 'voluntarios', label: 'Voluntarios',      icon: '🙋' },
  { value: 'rescate',     label: 'Rescate',          icon: '🆘' },
  { value: 'danos',       label: 'Daños',            icon: '🏚️' },
  { value: 'peritos',     label: 'Peritos',          icon: '👷' },
  { value: 'denuncias',   label: 'Denuncias',        icon: '🚨' },
];

const ENDPOINTS: Record<Tab, string> = {
  personas:    '/api/personas',
  centros:     '/api/centros',
  denuncias:   '/api/denuncias',
  voluntarios: '/api/voluntarios',
  rescate:     '/api/rescate',
  danos:       '/api/danos',
  peritos:     '/api/peritos',
};

const EMPTY_LABELS: Record<Tab, string> = {
  personas:    'No hay personas registradas aún',
  centros:     'No hay centros de ayuda registrados aún',
  denuncias:   'No hay denuncias registradas aún',
  voluntarios: 'No hay voluntarios registrados aún',
  rescate:     'No hay solicitudes de rescate activas',
  danos:       'No hay reportes de daños estructurales',
  peritos:     'No hay peritos voluntarios registrados aún',
};

export default function Home() {
  const [tab, setTab] = useState<Tab>('personas');
  const [query, setQuery] = useState('');
  const [estado, setEstado] = useState('');
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPersona, setShowAddPersona] = useState(false);
  const [showAddCentro, setShowAddCentro] = useState(false);
  const [showAddDenuncia, setShowAddDenuncia] = useState(false);
  const [showAddVoluntario, setShowAddVoluntario] = useState(false);
  const [showAddRescate, setShowAddRescate] = useState(false);
  const [showAddDano, setShowAddDano] = useState(false);
  const [showAddPerito, setShowAddPerito] = useState(false);

  const fetchResults = useCallback(async (q: string, currentTab: Tab, est: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (est && currentTab !== 'denuncias') params.set('estado', est);
      const res = await fetch(`${ENDPOINTS[currentTab]}?${params}`);
      const data = await res.json() as unknown[];
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchResults(query, tab, estado), 300);
    return () => clearTimeout(t);
  }, [query, tab, estado, fetchResults]);

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setQuery('');
    setResults([]);
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
              {results.length} resultado{results.length !== 1 ? 's' : ''}{estado ? ` en ${estado}` : ''}
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
            </div>
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
    </main>
  );
}
