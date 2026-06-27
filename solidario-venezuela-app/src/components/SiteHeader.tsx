import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#ddd8c8] bg-[#f8f7f2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span
            className="flex size-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #FFD100 33.3%, #002D62 33.3%, #002D62 66.6%, #CF142B 66.6%)' }}
          >
            <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>SV</span>
          </span>
          <span className="text-base font-semibold tracking-tight text-[#16201a]">
            Solidario Venezuela
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[#526058] md:flex">
          <Link className="transition hover:text-[#1f7a4d]" href="/">
            Personas
          </Link>
          <Link className="transition hover:text-[#1f7a4d]" href="/">
            Centros de Ayuda
          </Link>
          <Link className="transition hover:text-[#1f7a4d]" href="/seguridad">
            Seguridad
          </Link>
        </nav>

        <Link
          href="/"
          className="inline-flex min-h-9 items-center justify-center rounded-md bg-[#1f7a4d] px-4 text-sm font-semibold text-white transition hover:bg-[#17663f]"
        >
          Buscar
        </Link>
      </div>
    </header>
  );
}
