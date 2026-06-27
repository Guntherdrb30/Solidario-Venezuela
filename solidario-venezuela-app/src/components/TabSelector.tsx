'use client';

type Tab = 'personas' | 'centros';

interface Props {
  value: Tab;
  onChange: (v: Tab) => void;
}

export function TabSelector({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
      {(['personas', 'centros'] as Tab[]).map(tab => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
            value === tab
              ? 'bg-[#1f7a4d] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab === 'personas' ? '👤 Personas' : '🏠 Centros de Ayuda'}
        </button>
      ))}
    </div>
  );
}
