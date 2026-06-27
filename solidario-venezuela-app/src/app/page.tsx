import Image from "next/image";

const focusAreas = [
  {
    title: "Ayuda organizada",
    description:
      "Centralizamos iniciativas, necesidades y apoyos para que cada accion tenga seguimiento.",
  },
  {
    title: "Gestion transparente",
    description:
      "La plataforma nace con una base simple para comunicar avances, prioridades y resultados.",
  },
  {
    title: "Impacto local",
    description:
      "Pensada para Venezuela, con una experiencia ligera, movil y facil de compartir.",
  },
];

const steps = [
  "Identificar necesidades reales.",
  "Conectar aliados, donantes y voluntarios.",
  "Dar seguimiento a cada iniciativa.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#1d2520]">
      <header className="border-b border-[#ddd8c8] bg-[#f8f7f2]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a className="flex items-center gap-3" href="#inicio">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#1f7a4d] text-sm font-bold text-white">
              SV
            </span>
            <span className="text-base font-semibold tracking-tight">
              Solidario Venezuela
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#526058] sm:flex">
            <a className="transition hover:text-[#1f7a4d]" href="#iniciativas">
              Iniciativas
            </a>
            <a className="transition hover:text-[#1f7a4d]" href="#proceso">
              Proceso
            </a>
            <a className="transition hover:text-[#1f7a4d]" href="#contacto">
              Contacto
            </a>
          </nav>
        </div>
      </header>

      <section id="inicio" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-[#d8c15f] bg-[#fff9dc] px-4 py-2 text-sm font-medium text-[#6c5a00]">
              Plataforma social en construccion
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-[#16201a] sm:text-6xl">
              Solidaridad organizada para apoyar a Venezuela.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#536057]">
              Una base digital sencilla para conectar iniciativas, aliados y
              personas que quieren ayudar con orden, claridad y seguimiento.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#1f7a4d] px-6 text-sm font-semibold text-white transition hover:bg-[#17663f]"
                href="#iniciativas"
              >
                Ver enfoque inicial
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#bfc7bd] px-6 text-sm font-semibold text-[#25332b] transition hover:border-[#1f7a4d] hover:text-[#1f7a4d]"
                href="#contacto"
              >
                Contactar equipo
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#ddd8c8] bg-white shadow-sm">
            <Image
              src="/solidario-hero.png"
              alt="Mesa organizada con insumos y notas para coordinar apoyo solidario"
              width={1280}
              height={720}
              priority
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="p-6">
              <div className="border-b border-[#ece7d8] pb-5">
                <p className="text-sm font-medium text-[#69766d]">Estado</p>
                <p className="mt-2 text-2xl font-semibold text-[#16201a]">
                  Primera version publicada
                </p>
              </div>
              <dl className="grid gap-5 py-6 sm:grid-cols-3 lg:grid-cols-1">
                <div>
                  <dt className="text-sm text-[#69766d]">Objetivo</dt>
                  <dd className="mt-1 font-semibold">Organizar apoyo</dd>
                </div>
                <div>
                  <dt className="text-sm text-[#69766d]">Alcance</dt>
                  <dd className="mt-1 font-semibold">Venezuela</dd>
                </div>
                <div>
                  <dt className="text-sm text-[#69766d]">Modelo</dt>
                  <dd className="mt-1 font-semibold">Aliados + iniciativas</dd>
                </div>
              </dl>
              <p className="rounded-md bg-[#f1f7f3] p-4 text-sm leading-6 text-[#385241]">
                Esta version deja lista la presencia inicial del proyecto y una
                estructura clara para crecer hacia formularios, paneles y reportes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="iniciativas" className="border-y border-[#ddd8c8] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c34d36]">
              Enfoque inicial
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[#16201a]">
              Una plataforma simple para coordinar mejor.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {focusAreas.map((area) => (
              <article
                className="rounded-lg border border-[#e2ded0] bg-[#fbfaf6] p-6"
                key={area.title}
              >
                <h3 className="text-lg font-semibold text-[#16201a]">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5d6961]">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proceso" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f7a4d]">
              Proceso
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              Del apoyo espontaneo a la gestion con seguimiento.
            </h2>
          </div>

          <ol className="grid gap-4">
            {steps.map((step, index) => (
              <li
                className="flex gap-4 rounded-lg border border-[#ddd8c8] bg-white p-5"
                key={step}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0d963] text-sm font-bold text-[#443900]">
                  {index + 1}
                </span>
                <span className="pt-1 text-base font-medium text-[#27352d]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contacto" className="bg-[#17221c] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f0d963]">
              Contacto
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-normal">
              Listo para sumar aliados, voluntarios e iniciativas verificadas.
            </h2>
          </div>
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#17221c] transition hover:bg-[#f0d963]"
            href="mailto:contacto@solidariovenezuela.org?subject=Quiero%20sumarme%20a%20Solidario%20Venezuela"
          >
            Escribir al proyecto
          </a>
        </div>
      </section>
    </main>
  );
}
