import { getSql } from '@/lib/db';
import { sanitize, isValidPhone } from '@/lib/validations';

const TIPOS_VALIDOS = ['personas_atrapadas', 'heridos', 'incendio', 'derrumbe', 'fuga_gas', 'otro'];

export async function GET(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const estadoFilter = searchParams.get('estado')?.trim() ?? '';

  let rows;
  if (q && estadoFilter) {
    const s = `%${q}%`;
    rows = await sql`SELECT * FROM solicitudes_rescate WHERE (ciudad ILIKE ${s} OR direccion ILIKE ${s} OR descripcion ILIKE ${s}) AND estado = ${estadoFilter} ORDER BY created_at DESC LIMIT 50`;
  } else if (q) {
    const s = `%${q}%`;
    rows = await sql`SELECT * FROM solicitudes_rescate WHERE ciudad ILIKE ${s} OR direccion ILIKE ${s} OR descripcion ILIKE ${s} ORDER BY created_at DESC LIMIT 50`;
  } else if (estadoFilter) {
    rows = await sql`SELECT * FROM solicitudes_rescate WHERE estado = ${estadoFilter} ORDER BY created_at DESC LIMIT 50`;
  } else {
    rows = await sql`SELECT * FROM solicitudes_rescate ORDER BY created_at DESC LIMIT 100`;
  }
  return Response.json(rows);
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
  if (descripcion.length < 10) {
    return Response.json({ error: 'La descripción debe tener al menos 10 caracteres.' }, { status: 400 });
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
  return Response.json(rows[0], { status: 201 });
}
