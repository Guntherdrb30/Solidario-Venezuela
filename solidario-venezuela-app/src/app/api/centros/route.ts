import { getSql } from '@/lib/db';
import { sanitize, isValidPhone, isValidEmail } from '@/lib/validations';

export async function GET(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';

  if (q) {
    const search = `%${q}%`;
    const rows = await sql`
      SELECT * FROM centros_ayuda
      WHERE nombre ILIKE ${search} OR ciudad ILIKE ${search}
        OR estado ILIKE ${search} OR tipo ILIKE ${search}
      ORDER BY created_at DESC LIMIT 50
    `;
    return Response.json(rows);
  }
  const rows = await sql`SELECT * FROM centros_ayuda ORDER BY created_at DESC LIMIT 50`;
  return Response.json(rows);
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const nombre = sanitize(body.nombre);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);

  if (!nombre || !estado || !ciudad) {
    return Response.json(
      { error: 'Nombre, estado y ciudad son requeridos.' },
      { status: 400 }
    );
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
    VALUES (
      ${nombre}, ${sanitize(body.tipo)}, ${estado}, ${ciudad},
      ${sanitize(body.direccion)}, ${telefono}, ${email},
      ${sanitize(body.horario)}, ${sanitize(body.descripcion)},
      ${sanitize(body.necesidades)}, ${sanitize(body.disponible)},
      ${latitud}, ${longitud}
    )
    RETURNING *
  `;

  return Response.json(rows[0], { status: 201 });
}
