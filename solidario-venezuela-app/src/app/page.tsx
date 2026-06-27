'use client';
import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { PersonaCard } from '@/components/PersonaCard';
import { CentroCard } from '@/components/CentroCard';
import { DenunciaCard } from '@/components/DenunciaCard';
import { AgregarPersonaModal } from '@/components/AgregarPersonaModal';
import { AgregarCentroModal } from '@/components/AgregarCentroModal';
import { AgregarDenunciaModal } from '@/components/AgregarDenunciaModal';

async function shareApp() {
  const url = window.location.origin;
  const text = 'Solidario Venezuela — Encuentra personas desplazadas y centros de ayuda en Venezuela.';
  if (navigator.share) {
    await navigator.share({ title: 'Solidario Venezuela', text, url });
  } else {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    alert('Enlace copiado al portapapeles.');
  }
}

type Tab = 'personas' | 'centros' | 'denuncias';

const TABS: { value: Tab; label: string; icon: string }[] = [
  { value: 'personas',   label: 'Personas',        icon: '👤' },
  { value: 'centros',    label: 'Centros de Ayuda', icon: '🏠' },
  { value: 'denuncias',  label: 'Denuncias',        icon: '🚨' },
];

const ENDPOINTS: Record<Tab, string> = {
  personas:  '/api/personas',
  centros:   '/api/centros',
  denuncias: '/api/denuncias',
};

const EMPTY_LABELS: Record<Tab, string> = {
  personas:  'No hay personas registradas aún',
  centros:   'No hay centros de ayuda registrados aún',
  denuncias: 'No hay denuncias registradas aún',
};

export default function Home() {
  const [tab, setTab] = useState<Tab>('personas');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPersona, setShowAddPersona] = useState(false);
  const [showAddCentro, setShowAddCentro] = useState(false);
  const [showAddDenuncia, setShowAddDenuncia] = useState(false);

  const fetchResults = useCallback(async (q: string, currentTab: Tab) => {
    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINTS[currentTab]}?q=${encodeURIComponent(q)}`);
      const data = await res.json() as unknown[];
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchResults(query, tab), 300);
    return () => clearTimeout(t);
  }, [query, tab, fetchResults]);

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setQuery('');
    setResults([]);
  };

  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      {/* Hero */}
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
          <div className="mt-6">
            <button
              onClick={shareApp}
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

      {/* Contenido */}
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Tabs + acciones */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab bar */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            {TABS.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTabChange(t.value)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.value
                    ? t.value === 'denuncias'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-[#1f7a4d] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {tab === 'personas' && (
              <button
                onClick={() => setShowAddPersona(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] transition-colors shadow-sm">
                <span className="text-lg leading-none">+</span> Agregar Persona
              </button>
            )}
            {tab === 'centros' && (
              <button
                onClick={() => setShowAddCentro(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-[#1f7a4d] hover:bg-[#eef6f1] transition-colors">
                <span className="text-lg leading-none">+</span> Agregar Centro
              </button>
            )}
            {tab === 'denuncias' && (
              <button
                onClick={() => setShowAddDenuncia(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm">
                🚨 Hacer denuncia anónima
              </button>
            )}
          </div>
        </div>

        {/* Aviso privacidad denuncias */}
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
              {query ? `No se encontraron resultados para "${query}"` : EMPTY_LABELS[tab]}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {tab === 'denuncias'
                ? 'Usa el botón de arriba para registrar una denuncia anónima'
                : 'Usa los botones de arriba para agregar el primero'}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
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
            </div>
          </>
        )}
      </div>

      <AgregarPersonaModal
        open={showAddPersona}
        onClose={() => setShowAddPersona(false)}
        onSuccess={() => fetchResults(query, tab)}
      />
      <AgregarCentroModal
        open={showAddCentro}
        onClose={() => setShowAddCentro(false)}
        onSuccess={() => fetchResults(query, tab)}
      />
      <AgregarDenunciaModal
        open={showAddDenuncia}
        onClose={() => setShowAddDenuncia(false)}
        onSuccess={() => fetchResults(query, tab)}
      />
    </main>
  );
}
