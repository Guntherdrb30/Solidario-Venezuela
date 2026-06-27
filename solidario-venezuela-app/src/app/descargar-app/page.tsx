import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Descargar app | Solidario Venezuela",
  description:
    "Instrucciones para instalar Solidario Venezuela como aplicacion en iPhone y Android.",
};

const iosSteps = [
  "Abre solidario-venezuela.vercel.app en Safari.",
  "Toca el boton Compartir del navegador.",
  "Selecciona Agregar a pantalla de inicio.",
  "Confirma el nombre Solidario Venezuela y toca Agregar.",
];

const androidSteps = [
  "Abre solidario-venezuela.vercel.app en Chrome.",
  "Toca el menu de tres puntos.",
  "Selecciona Instalar app o Agregar a pantalla principal.",
  "Confirma la instalacion para abrirla como aplicacion.",
];

export default function DownloadAppPage() {
  return (
    <main className="bg-[#f8f7f2] text-[#1d2520]">
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f7a4d]">
            Descargar app
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-[#16201a] sm:text-5xl">
            Instala Solidario Venezuela en tu telefono.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#536057]">
            Solidario Venezuela funciona como una app web. No necesitas buscarla
            en una tienda: puedes agregarla a la pantalla principal de tu iPhone
            o Android y abrirla con un toque.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold text-[#16201a]">
              En iPhone
            </h2>
            <ol className="mt-6 grid gap-4">
              {iosSteps.map((step, index) => (
                <li className="flex gap-4" key={step}>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1f7a4d] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm leading-6 text-[#526058]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold text-[#16201a]">
              En Android
            </h2>
            <ol className="mt-6 grid gap-4">
              {androidSteps.map((step, index) => (
                <li className="flex gap-4" key={step}>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0d963] text-sm font-bold text-[#443900]">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm leading-6 text-[#526058]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className="mt-8 rounded-lg border border-[#d3dfd7] bg-[#eef6f1] p-6">
          <h2 className="text-xl font-semibold text-[#16201a]">
            Nota importante
          </h2>
          <p className="mt-3 leading-7 text-[#536057]">
            Esta instalacion no recopila informacion adicional por si sola. Los
            registros tecnicos de seguridad se usan para proteger la plataforma,
            detectar abuso y cuidar a las personas que participan.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#1f7a4d] px-5 text-sm font-semibold text-white transition hover:bg-[#17663f]"
            href="/"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
