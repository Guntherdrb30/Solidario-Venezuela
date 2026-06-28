import { getSql } from '@/lib/db';
import { sanitize, isValidPhone } from '@/lib/validations';

const TIPOS_VALIDOS = ['vivienda', 'edificio', 'escuela', 'hospital', 'comercio', 'puente', 'infraestructura', 'otro'];
const SEVERIDADES_VALIDAS = ['leve', 'moderado', 'grave', 'colapso'];
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
      sql`SELECT * FROM danos_estructurales WHERE (ciudad ILIKE ${s} OR direccion ILIKE ${s} OR tipo_inmueble ILIKE ${s}) AND estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM danos_estructurales WHERE (ciudad ILIKE ${s} OR direccion ILIKE ${s} OR tipo_inmueble ILIKE ${s}) AND estado = ${estadoFilter}`,
    ]);
  } else if (q) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM danos_estructurales WHERE ciudad ILIKE ${s} OR direccion ILIKE ${s} OR tipo_inmueble ILIKE ${s} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM danos_estructurales WHERE ciudad ILIKE ${s} OR direccion ILIKE ${s} OR tipo_inmueble ILIKE ${s}`,
    ]);
  } else if (estadoFilter) {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM danos_estructurales WHERE estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM danos_estructurales WHERE estado = ${estadoFilter}`,
    ]);
  } else {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM danos_estructurales ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM danos_estructurales`,
    ]);
  }

  const total = countRows[0]?.total ?? 0;
  return Response.json({ results: rows, total, page, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const tipo_inmueble = sanitize(body.tipo_inmueble);
  const severidad = sanitize(body.severidad);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);
  const direccion = sanitize(body.direccion);

  if (!tipo_inmueble || !severidad || !estado || !ciudad || !direccion) {
    return Response.json({ error: 'Tipo, severidad, estado, ciudad y dirección son requeridos.' }, { status: 400 });
  }
  if (!TIPOS_VALIDOS.includes(tipo_inmueble)) {
    return Response.json({ error: 'Tipo de inmueble inválido.' }, { status: 400 });
  }
  if (!SEVERIDADES_VALIDAS.includes(severidad)) {
    return Response.json({ error: 'Severidad inválida.' }, { status: 400 });
  }

  const contacto_telefono = sanitize(body.contacto_telefono);
  if (contacto_telefono && !isValidPhone(contacto_telefono)) {
    return Response.json({ error: 'Teléfono inválido.' }, { status: 400 });
  }

  const latitud = body.latitud ? Number(body.latitud) : null;
  const longitud = body.longitud ? Number(body.longitud) : null;
  const personas_afectadas = body.personas_afectadas ? Number(body.personas_afectadas) : null;

  const rows = await sql`
    INSERT INTO danos_estructurales (tipo_inmueble, severidad, estado, ciudad, direccion, descripcion, foto_url, personas_afectadas, contacto_nombre, contacto_telefono, latitud, longitud)
    VALUES (${tipo_inmueble}, ${severidad}, ${estado}, ${ciudad}, ${direccion}, ${sanitize(body.descripcion)}, ${sanitize(body.foto_url)}, ${personas_afectadas}, ${sanitize(body.contacto_nombre)}, ${contacto_telefono}, ${latitud}, ${longitud})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}
