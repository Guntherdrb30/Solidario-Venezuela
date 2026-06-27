import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies y privacidad | Solidario Venezuela",
  description:
    "Politica de cookies, privacidad y registros de seguridad de Solidario Venezuela.",
};

const dataItems = [
  "Direccion IP aproximada recibida por el servidor.",
  "Navegador, sistema operativo y dispositivo reportado por el usuario.",
  "Ruta visitada, fecha, hora y tipo de evento de seguridad.",
  "Preferencia de consentimiento de cookies y privacidad.",
];

export default function CookiesPage() {
  return (
    <main className="bg-[#f8f7f2] text-[#1d2520]">
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f7a4d]">
          Privacidad
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-[#16201a]">
          Cookies, privacidad y registros de seguridad
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#536057]">
          Solidario Venezuela es una plataforma orientada a ayuda humanitaria.
          Por eso tratamos la informacion con responsabilidad, minimizacion de
          datos y enfoque de proteccion para personas, aliados e iniciativas.
        </p>

        <div className="mt-10 grid gap-5">
          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">Que cookies usamos</h2>
            <p className="mt-3 leading-7 text-[#536057]">
              Usamos cookies necesarias para recordar preferencias basicas,
              como el consentimiento de privacidad y seguridad. En esta fase no
              usamos cookies publicitarias ni perfiles comerciales.
            </p>
          </section>

          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">
              Datos tecnicos de seguridad
            </h2>
            <p className="mt-3 leading-7 text-[#536057]">
              Para proteger la plataforma y a las personas que la usan, podemos
              guardar registros tecnicos cuando se acepta el aviso o cuando una
              actividad sea necesaria para seguridad, prevencion de abuso,
              investigacion de incidentes o cumplimiento operativo.
            </p>
            <ul className="mt-5 grid gap-3">
              {dataItems.map((item) => (
                <li className="rounded-md bg-[#f1f7f3] p-4 text-sm" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">Uso responsable</h2>
            <p className="mt-3 leading-7 text-[#536057]">
              La informacion no debe usarse para perseguir, discriminar,
              exponer, acosar o poner en riesgo a beneficiarios, voluntarios,
              aliados o donantes. Cualquier uso abusivo puede ser bloqueado y
              registrado para investigacion.
            </p>
          </section>

          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">Derechos y contacto</h2>
            <p className="mt-3 leading-7 text-[#536057]">
              Si una persona necesita consultar, corregir o solicitar revision
              de informacion asociada a su participacion, puede escribir al
              equipo del proyecto. En fases posteriores se habilitara un canal
              formal de privacidad dentro del panel.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
