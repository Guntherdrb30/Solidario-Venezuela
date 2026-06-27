'use client';
import { useState, useRef } from 'react';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED.includes(file.type)) {
      setError('Solo JPG, PNG o WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Máximo 5MB.');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Error al subir imagen.');
      onChange(data.url!);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="preview" className="h-24 w-24 rounded-lg object-cover border border-gray-200" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#1f7a4d] hover:text-[#1f7a4d] transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-xs">Subiendo...</span>
          ) : (
            <>
              <span className="text-2xl leading-none">+</span>
              <span className="text-xs mt-1">Subir foto</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
