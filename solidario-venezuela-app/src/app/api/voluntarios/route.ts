import { getSql } from '@/lib/db';
import { sanitize, isValidPhone } from '@/lib/validations';

const HABILIDADES_VALIDAS = [
  'Médico / Enfermero', 'Rescatista / Primeros auxilios', 'Logística y transporte',
  'Cocina y alimentación', 'Construcción / Obras', 'Psicología y apoyo emocional',
  'Comunicaciones', 'Educación', 'Otro',
];

const PAGE_SIZE = 24;

export async function GET(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const estadoFilter = searchParams.get('estado')?.trim() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const offset = (page - 1) * PAGE_SIZE;

  let rows, countRows;
  if (q && estadoFilter) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM voluntarios WHERE (nombre ILIKE ${s} OR habilidad ILIKE ${s} OR ciudad ILIKE ${s}) AND estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM voluntarios WHERE (nombre ILIKE ${s} OR habilidad ILIKE ${s} OR ciudad ILIKE ${s}) AND estado = ${estadoFilter}`,
    ]);
  } else if (q) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM voluntarios WHERE nombre ILIKE ${s} OR habilidad ILIKE ${s} OR ciudad ILIKE ${s} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM voluntarios WHERE nombre ILIKE ${s} OR habilidad ILIKE ${s} OR ciudad ILIKE ${s}`,
    ]);
  } else if (estadoFilter) {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM voluntarios WHERE estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM voluntarios WHERE estado = ${estadoFilter}`,
    ]);
  } else {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM voluntarios ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM voluntarios`,
    ]);
  }

  const total = countRows[0]?.total ?? 0;
  return Response.json({ results: rows, total, page, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const nombre = sanitize(body.nombre);
  const habilidad = sanitize(body.habilidad);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);

  if (!nombre || !habilidad || !estado || !ciudad) {
    return Response.json({ error: 'Nombre, habilidad, estado y ciudad son requeridos.' }, { status: 400 });
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
    VALUES (${nombre}, ${habilidad}, ${estado}, ${ciudad}, ${telefono}, ${sanitize(body.disponibilidad)})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}
