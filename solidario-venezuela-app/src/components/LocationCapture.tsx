'use client';
import { useState } from 'react';

interface Props {
  latitud: string;
  longitud: string;
  onCapture: (lat: string, lng: string) => void;
}

export function LocationCapture({ latitud, longitud, onCapture }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const capture = () => {
    if (!navigator.geolocation) {
      setError('Tu dispositivo no soporta geolocalización.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      pos => {
        onCapture(pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6));
        setLoading(false);
      },
      () => {
        setError('No se pudo obtener la ubicación. Verifica los permisos.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const clear = () => onCapture('', '');

  const hasCoords = latitud && longitud;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ubicación GPS <span className="text-gray-400 font-normal">(opcional)</span>
      </label>
      {hasCoords ? (
        <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
          <span className="text-green-700 text-sm">
            📍 {latitud}, {longitud}
          </span>
          <a
            href={`https://www.google.com/maps?q=${latitud},${longitud}`}
            target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#1f7a4d] underline shrink-0">
            Ver en mapa
          </a>
          <button type="button" onClick={clear}
            className="ml-auto text-xs text-gray-400 hover:text-red-500">
            Eliminar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={capture}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <span>📍</span>
          )}
          {loading ? 'Obteniendo ubicación...' : 'Capturar mi ubicación actual'}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
