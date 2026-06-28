import { getSql } from '@/lib/db';
import { sanitize, isValidPhone } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

const TIPOS_VALIDOS = ['personas_atrapadas', 'heridos', 'incendio', 'derrumbe', 'fuga_gas', 'otro'];
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
      sql`SELECT * FROM solicitudes_rescate WHERE (ciudad ILIKE ${s} OR direccion ILIKE ${s} OR tipo_emergencia ILIKE ${s}) AND estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM solicitudes_rescate WHERE (ciudad ILIKE ${s} OR direccion ILIKE ${s} OR tipo_emergencia ILIKE ${s}) AND estado = ${estadoFilter}`,
    ]);
  } else if (q) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM solicitudes_rescate WHERE ciudad ILIKE ${s} OR direccion ILIKE ${s} OR tipo_emergencia ILIKE ${s} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM solicitudes_rescate WHERE ciudad ILIKE ${s} OR direccion ILIKE ${s} OR tipo_emergencia ILIKE ${s}`,
    ]);
  } else if (estadoFilter) {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM solicitudes_rescate WHERE estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM solicitudes_rescate WHERE estado = ${estadoFilter}`,
    ]);
  } else {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM solicitudes_rescate ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM solicitudes_rescate`,
    ]);
  }

  const total = countRows[0]?.total ?? 0;
  return Response.json({ results: rows, total, page, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const tipo_emergencia = sanitize(body.tipo_emergencia);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);
  const direccion = sanitize(body.direccion);
  const descripcion = sanitize(body.descripcion);

  if (!tipo_emergencia || !estado || !ciudad || !direccion || !descripcion) {
    return Response.json({ error: 'Tipo, estado, ciudad, dirección y descripción son requeridos.' }, { status: 400 });
  }
  if (!TIPOS_VALIDOS.includes(tipo_emergencia)) {
    return Response.json({ error: 'Tipo de emergencia inválido.' }, { status: 400 });
  }

  const contacto_telefono = sanitize(body.contacto_telefono);
  if (contacto_telefono && !isValidPhone(contacto_telefono)) {
    return Response.json({ error: 'Teléfono inválido.' }, { status: 400 });
  }

  const latitud = body.latitud ? Number(body.latitud) : null;
  const longitud = body.longitud ? Number(body.longitud) : null;
  const personas_involucradas = body.personas_involucradas ? Number(body.personas_involucradas) : null;

  const rows = await sql`
    INSERT INTO solicitudes_rescate (tipo_emergencia, estado, ciudad, direccion, descripcion, personas_involucradas, contacto_nombre, contacto_telefono, latitud, longitud)
    VALUES (${tipo_emergencia}, ${estado}, ${ciudad}, ${direccion}, ${descripcion}, ${personas_involucradas}, ${sanitize(body.contacto_nombre)}, ${contacto_telefono}, ${latitud}, ${longitud})
    RETURNING *
  `;
  await logAudit(request, 'crear_rescate', 'solicitudes_rescate', rows[0].id);
  return Response.json(rows[0], { status: 201 });
}
