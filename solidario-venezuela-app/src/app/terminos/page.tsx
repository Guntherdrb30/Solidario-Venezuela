import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminos y condiciones | Solidario Venezuela",
  description:
    "Condiciones de uso responsable para la plataforma humanitaria Solidario Venezuela.",
};

const responsibilities = [
  "Usar la plataforma solo para fines humanitarios, solidarios y comunitarios.",
  "No publicar informacion falsa, discriminatoria, violenta o que ponga en riesgo a terceros.",
  "No intentar acceder a areas, datos o funciones sin autorizacion.",
  "Respetar la privacidad de beneficiarios, voluntarios, aliados y donantes.",
];

export default function TermsPage() {
  return (
    <main className="bg-[#f8f7f2] text-[#1d2520]">
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c34d36]">
          Condiciones
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-[#16201a]">
          Terminos y condiciones de uso responsable
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#536057]">
          Solidario Venezuela es una plataforma creada para coordinar ayuda
          humanitaria, apoyo social e iniciativas comunitarias. Su uso requiere
          responsabilidad, respeto por la dignidad humana y proteccion de datos.
        </p>

        <div className="mt-10 grid gap-5">
          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">Uso permitido</h2>
            <p className="mt-3 leading-7 text-[#536057]">
              La plataforma debe utilizarse para comunicar, organizar, registrar
              o apoyar iniciativas humanitarias. Cualquier funcion futura de
              donaciones, voluntariado, solicitudes o reportes debera usarse con
              informacion verdadera y verificable.
            </p>
          </section>

          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">
              Responsabilidades del usuario
            </h2>
            <ul className="mt-5 grid gap-3">
              {responsibilities.map((item) => (
                <li className="rounded-md bg-[#f1f7f3] p-4 text-sm" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">
              Proteccion de personas vulnerables
            </h2>
            <p className="mt-3 leading-7 text-[#536057]">
              No se debe publicar informacion sensible de personas vulnerables
              sin autorizacion y sin evaluar riesgos. La plataforma debe evitar
              exposicion innecesaria de ubicaciones, datos medicos, documentos,
              imagenes o historias personales.
            </p>
          </section>

          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">
              Seguridad y bloqueo de abuso
            </h2>
            <p className="mt-3 leading-7 text-[#536057]">
              Podemos registrar eventos tecnicos de seguridad, bloquear trafico
              abusivo, investigar intentos de acceso no autorizado y conservar
              registros razonables para proteger la plataforma y a sus usuarios.
            </p>
          </section>

          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">Aviso legal</h2>
            <p className="mt-3 leading-7 text-[#536057]">
              Estos terminos son una base inicial y no sustituyen una revision
              legal profesional. Antes de manejar donaciones, datos sensibles o
              operaciones con terceros, el documento debe ser revisado por un
              abogado segun la jurisdiccion aplicable.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
