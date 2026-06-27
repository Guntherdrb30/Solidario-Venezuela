import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de seguridad | Solidario Venezuela",
  description:
    "Base de seguridad, auditoria y registro de eventos para Solidario Venezuela.",
};

const capturedEvents = [
  {
    name: "Consentimiento",
    description:
      "Registra cuando una persona acepta o limita el uso de cookies y registros tecnicos.",
  },
  {
    name: "Rutas sospechosas",
    description:
      "Detecta intentos comunes como acceso a .env, wp-admin, phpMyAdmin o rutas administrativas inexistentes.",
  },
  {
    name: "Actividad futura de cuenta",
    description:
      "Preparado para login, recuperacion de acceso, cambios de perfil y acciones administrativas.",
  },
];

export default function SecurityPage() {
  return (
    <main className="bg-[#f8f7f2] text-[#1d2520]">
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f7a4d]">
            Seguridad
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-[#16201a]">
            Registro base de seguridad y auditoria.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#536057]">
            Esta area documenta como la plataforma registra eventos tecnicos
            para proteger a usuarios, aliados e iniciativas. En esta fase los
            eventos se emiten como logs estructurados en Vercel.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {capturedEvents.map((event) => (
            <article
              className="rounded-lg border border-[#ddd8c8] bg-white p-6"
              key={event.name}
            >
              <h2 className="text-xl font-semibold text-[#16201a]">
                {event.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#536057]">
                {event.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-lg border border-[#ddd8c8] bg-white p-6">
            <h2 className="text-2xl font-semibold">Campos registrados</h2>
            <ul className="mt-5 grid gap-3 text-sm text-[#536057]">
              <li>Fecha y hora del evento.</li>
              <li>Tipo, severidad y ruta asociada.</li>
              <li>IP reportada por Vercel o cabeceras proxy confiables.</li>
              <li>User agent y referer cuando estan disponibles.</li>
              <li>Mensaje tecnico sin exponer secretos.</li>
            </ul>
          </section>

          <section className="rounded-lg border border-[#ddd8c8] bg-[#17221c] p-6 text-white">
            <h2 className="text-2xl font-semibold">Como revisar hoy</h2>
            <p className="mt-3 leading-7 text-white/75">
              En Vercel entra a Logs y busca estas etiquetas:
            </p>
            <div className="mt-5 grid gap-3 font-mono text-sm">
              <code className="rounded-md bg-white/10 p-3">solidario.security.audit</code>
              <code className="rounded-md bg-white/10 p-3">solidario.security.probe</code>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/70">
              La siguiente fase debe guardar estos eventos en Neon/PostgreSQL
              con acceso solo para usuarios root o administradores autorizados.
            </p>
          </section>
        </div>

        <section className="mt-10 rounded-lg border border-[#d3dfd7] bg-[#eef6f1] p-6">
          <h2 className="text-2xl font-semibold text-[#16201a]">
            Proximo paso tecnico
          </h2>
          <p className="mt-3 leading-7 text-[#536057]">
            Agregar autenticacion por roles, modelo SecurityLog en Prisma,
            filtros por fecha/IP/severidad y retencion de datos. Eso convertira
            este centro en un panel privado real de auditoria.
          </p>
        </section>
      </section>
    </main>
  );
}
