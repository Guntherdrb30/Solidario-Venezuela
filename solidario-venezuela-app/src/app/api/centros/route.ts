import { getSql } from '@/lib/db';
import { sanitize, isValidPhone, isValidEmail } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

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
      sql`SELECT * FROM centros_ayuda WHERE (nombre ILIKE ${s} OR ciudad ILIKE ${s} OR tipo ILIKE ${s}) AND estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM centros_ayuda WHERE (nombre ILIKE ${s} OR ciudad ILIKE ${s} OR tipo ILIKE ${s}) AND estado = ${estadoFilter}`,
    ]);
  } else if (q) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM centros_ayuda WHERE nombre ILIKE ${s} OR ciudad ILIKE ${s} OR estado ILIKE ${s} OR tipo ILIKE ${s} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM centros_ayuda WHERE nombre ILIKE ${s} OR ciudad ILIKE ${s} OR estado ILIKE ${s} OR tipo ILIKE ${s}`,
    ]);
  } else if (estadoFilter) {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM centros_ayuda WHERE estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM centros_ayuda WHERE estado = ${estadoFilter}`,
    ]);
  } else {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM centros_ayuda ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM centros_ayuda`,
    ]);
  }

  const total = countRows[0]?.total ?? 0;
  return Response.json({ results: rows, total, page, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const nombre = sanitize(body.nombre);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);

  if (!nombre || !estado || !ciudad) {
    return Response.json({ error: 'Nombre, estado y ciudad son requeridos.' }, { status: 400 });
  }

  const telefono = sanitize(body.telefono);
  if (telefono && !isValidPhone(telefono)) {
    return Response.json({ error: 'Teléfono inválido.' }, { status: 400 });
  }

  const email = sanitize(body.email);
  if (email && !isValidEmail(email)) {
    return Response.json({ error: 'Email inválido.' }, { status: 400 });
  }

  const latitud = body.latitud ? Number(body.latitud) : null;
  const longitud = body.longitud ? Number(body.longitud) : null;

  const rows = await sql`
    INSERT INTO centros_ayuda (nombre, tipo, estado, ciudad, direccion, telefono, email, horario, descripcion, necesidades, disponible, latitud, longitud)
    VALUES (${nombre}, ${sanitize(body.tipo)}, ${estado}, ${ciudad}, ${sanitize(body.direccion)}, ${telefono}, ${email}, ${sanitize(body.horario)}, ${sanitize(body.descripcion)}, ${sanitize(body.necesidades)}, ${sanitize(body.disponible)}, ${latitud}, ${longitud})
    RETURNING *
  `;
  await logAudit(request, 'crear_centro', 'centros_ayuda', rows[0].id);
  return Response.json(rows[0], { status: 201 });
}
