import Link from "next/link";

const legalLinks = [
  { href: "/cookies", label: "Cookies y privacidad" },
  { href: "/terminos", label: "Terminos y condiciones" },
  { href: "/seguridad", label: "Seguridad" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ddd8c8] bg-[#f8f7f2]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-sm text-[#5d6961] sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>Solidario Venezuela. Ayuda humanitaria organizada con responsabilidad.</p>
        <nav className="flex flex-wrap gap-4">
          {legalLinks.map((link) => (
            <Link
              className="font-medium transition hover:text-[#1f7a4d]"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
