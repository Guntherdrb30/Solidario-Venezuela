'use client';
import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { TabSelector } from '@/components/TabSelector';
import { PersonaCard } from '@/components/PersonaCard';
import { CentroCard } from '@/components/CentroCard';
import { AgregarPersonaModal } from '@/components/AgregarPersonaModal';
import { AgregarCentroModal } from '@/components/AgregarCentroModal';

type Tab = 'personas' | 'centros';

export default function Home() {
  const [tab, setTab] = useState<Tab>('personas');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPersona, setShowAddPersona] = useState(false);
  const [showAddCentro, setShowAddCentro] = useState(false);

  const fetchResults = useCallback(async (q: string, currentTab: Tab) => {
    setLoading(true);
    try {
      const endpoint = currentTab === 'personas' ? '/api/personas' : '/api/centros';
      const res = await fetch(`${endpoint}?q=${encodeURIComponent(q)}`);
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
  };

  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      {/* Hero con buscador */}
      <section className="bg-[#17221c] py-14 px-5">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#f0d963]">
            Solidario Venezuela
          </p>
          <h1 className="mb-8 text-3xl font-bold text-white sm:text-4xl">
            Busca personas o centros de ayuda en Venezuela
          </h1>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {/* Contenido */}
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Tabs + acciones */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabSelector value={tab} onChange={handleTabChange} />
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddPersona(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17663f] transition-colors shadow-sm"
            >
              <span className="text-lg leading-none">+</span> Agregar Persona
            </button>
            <button
              onClick={() => setShowAddCentro(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#1f7a4d] px-4 py-2.5 text-sm font-semibold text-[#1f7a4d] hover:bg-[#eef6f1] transition-colors"
            >
              <span className="text-lg leading-none">+</span> Agregar Centro
            </button>
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#1f7a4d] border-t-transparent" />
            <p className="text-sm">Buscando...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">{tab === 'personas' ? '👤' : '🏠'}</p>
            <p className="text-base font-medium text-gray-600">
              {query
                ? `No se encontraron resultados para "${query}"`
                : tab === 'personas'
                ? 'No hay personas registradas aún'
                : 'No hay centros de ayuda registrados aún'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Usa los botones de arriba para agregar el primero
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tab === 'personas'
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (results as any[]).map(p => <PersonaCard key={p.id} persona={p} />)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                : (results as any[]).map(c => <CentroCard key={c.id} centro={c} />)}
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
    </main>
  );
}
