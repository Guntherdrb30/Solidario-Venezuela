import { getSql } from '@/lib/db';

export async function GET() {
  const sql = getSql();

  const [personas, centros, voluntarios, denuncias] = await Promise.all([
    sql`SELECT
      COUNT(*) FILTER (WHERE estado_busqueda = 'buscando')   AS buscando,
      COUNT(*) FILTER (WHERE estado_busqueda = 'encontrado') AS encontrado,
      COUNT(*) AS total
    FROM personas`,
    sql`SELECT COUNT(*) AS total FROM centros_ayuda`,
    sql`SELECT COUNT(*) AS total FROM voluntarios`,
    sql`SELECT COUNT(*) AS total FROM denuncias`,
  ]);

  return Response.json({
    personas: {
      total:      Number(personas[0].total),
      buscando:   Number(personas[0].buscando),
      encontrado: Number(personas[0].encontrado),
    },
    centros:     Number(centros[0].total),
    voluntarios: Number(voluntarios[0].total),
    denuncias:   Number(denuncias[0].total),
  });
}
