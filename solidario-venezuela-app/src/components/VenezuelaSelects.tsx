'use client';
import { ESTADOS_VENEZUELA, CIUDADES_POR_ESTADO } from '@/lib/venezuela-data';

interface Props {
  estado: string;
  ciudad: string;
  onEstadoChange: (v: string) => void;
  onCiudadChange: (v: string) => void;
  required?: boolean;
}

export function VenezuelaSelects({ estado, ciudad, onEstadoChange, onCiudadChange, required }: Props) {
  const ciudades = estado ? (CIUDADES_POR_ESTADO[estado] ?? []) : [];

  const handleEstado = (v: string) => {
    onEstadoChange(v);
    onCiudadChange('');
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={estado}
          onChange={e => handleEstado(e.target.value)}
          required={required}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none"
        >
          <option value="">Seleccionar estado...</option>
          {ESTADOS_VENEZUELA.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ciudad {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={ciudad}
          onChange={e => onCiudadChange(e.target.value)}
          required={required}
          disabled={!estado}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1f7a4d] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">Seleccionar ciudad...</option>
          {ciudades.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
