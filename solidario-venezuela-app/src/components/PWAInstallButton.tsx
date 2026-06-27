'use client';
import { useEffect, useState } from 'react';

export function PWAInstallButton() {
  const [prompt, setPrompt] = useState<Event | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()) && !(window as unknown as Record<string, unknown>).MSStream;
    setIsIOS(ios);

    const handler = (e: Event) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (prompt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prompt as any).prompt();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { outcome } = await (prompt as any).userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (installed || (!prompt && !isIOS)) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#1f7a4d] bg-[#eef6f1] px-3 py-1.5 text-sm font-semibold text-[#1f7a4d] hover:bg-[#d9ede3] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Instalar app
      </button>

      {/* Modal iOS */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => setShowIOSGuide(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Instalar en iPhone / iPad</h3>
                <p className="text-xs text-gray-500 mt-0.5">Sigue estos 3 pasos en Safari</p>
              </div>
              <button onClick={() => setShowIOSGuide(false)} className="text-gray-400 text-xl leading-none">✕</button>
            </div>

            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f7a4d] text-white text-sm font-bold">1</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Toca el botón compartir</p>
                  <p className="text-xs text-gray-500 mt-0.5">El ícono de la caja con una flecha ↑ en la barra inferior de Safari</p>
                  <span className="mt-1 inline-block text-2xl">
                    <svg className="w-6 h-6 text-blue-500 inline" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L8 6h3v8h2V6h3L12 2zm-7 14v4h14v-4h-2v2H7v-2H5z"/>
                    </svg>
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f7a4d] text-white text-sm font-bold">2</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Busca <strong>"Añadir a pantalla de inicio"</strong></p>
                  <p className="text-xs text-gray-500 mt-0.5">Desplázate hacia abajo en el menú de opciones</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f7a4d] text-white text-sm font-bold">3</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Toca <strong>"Añadir"</strong></p>
                  <p className="text-xs text-gray-500 mt-0.5">La app aparecerá en tu pantalla de inicio como una aplicación nativa</p>
                </div>
              </li>
            </ol>

            <div className="mt-5 rounded-xl bg-[#eef6f1] border border-[#1f7a4d]/20 px-4 py-3 text-center">
              <p className="text-xs text-[#1f7a4d] font-medium">
                📱 Solidario Venezuela funcionará sin internet una vez instalada
              </p>
            </div>

            <button onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-lg bg-[#1f7a4d] py-2.5 text-sm font-semibold text-white hover:bg-[#17663f]">
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
