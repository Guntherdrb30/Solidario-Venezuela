import Link from "next/link";

const navItems = [
  { href: "/#iniciativas", label: "Iniciativas" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/seguridad", label: "Seguridad" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#ddd8c8] bg-[#f8f7f2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#1f7a4d] text-sm font-bold text-white">
            SV
          </span>
          <span className="text-base font-semibold tracking-tight">
            Solidario Venezuela
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[#526058] md:flex">
          {navItems.map((item) => (
            <Link
              className="transition hover:text-[#1f7a4d]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#1f7a4d] px-4 text-sm font-semibold text-white transition hover:bg-[#17663f]"
          href="/descargar-app"
        >
          Descargar app
        </Link>
      </div>
    </header>
  );
}
