import { getSql } from '@/lib/db';
import { sanitize, isValidPhone } from '@/lib/validations';

const HABILIDADES_VALIDAS = [
  'Médico / Enfermero', 'Rescatista / Primeros auxilios', 'Logística y transporte',
  'Cocina y alimentación', 'Construcción / Obras', 'Psicología y apoyo emocional',
  'Comunicaciones', 'Educación', 'Otro',
];

export async function GET(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const estadoFilter = searchParams.get('estado')?.trim() ?? '';

  let rows;
  if (q && estadoFilter) {
    const search = `%${q}%`;
    rows = await sql`
      SELECT * FROM voluntarios
      WHERE (nombre ILIKE ${search} OR habilidad ILIKE ${search} OR ciudad ILIKE ${search})
        AND estado = ${estadoFilter}
      ORDER BY created_at DESC LIMIT 50
    `;
  } else if (q) {
    const search = `%${q}%`;
    rows = await sql`
      SELECT * FROM voluntarios
      WHERE nombre ILIKE ${search} OR habilidad ILIKE ${search} OR ciudad ILIKE ${search}
      ORDER BY created_at DESC LIMIT 50
    `;
  } else if (estadoFilter) {
    rows = await sql`
      SELECT * FROM voluntarios WHERE estado = ${estadoFilter}
      ORDER BY created_at DESC LIMIT 50
    `;
  } else {
    rows = await sql`SELECT * FROM voluntarios ORDER BY created_at DESC LIMIT 50`;
  }

  return Response.json(rows);
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const nombre = sanitize(body.nombre);
  const habilidad = sanitize(body.habilidad);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);

  if (!nombre || !habilidad || !estado || !ciudad) {
    return Response.json(
      { error: 'Nombre, habilidad, estado y ciudad son requeridos.' },
      { status: 400 }
    );
  }

  if (!HABILIDADES_VALIDAS.includes(habilidad)) {
    return Response.json({ error: 'Habilidad inválida.' }, { status: 400 });
  }

  const telefono = sanitize(body.telefono);
  if (telefono && !isValidPhone(telefono)) {
    return Response.json({ error: 'Teléfono inválido.' }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO voluntarios (nombre, habilidad, estado, ciudad, telefono, disponibilidad)
    VALUES (
      ${nombre}, ${habilidad}, ${estado}, ${ciudad},
      ${telefono}, ${sanitize(body.disponibilidad)}
    )
    RETURNING *
  `;

  return Response.json(rows[0], { status: 201 });
}
