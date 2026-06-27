import { getSql } from '@/lib/db';
import { sanitize, isValidCedula, isValidPhone, isValidEmail } from '@/lib/validations';

export async function GET(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const estadoFilter = searchParams.get('estado')?.trim() ?? '';

  if (q && estadoFilter) {
    const search = `%${q}%`;
    const rows = await sql`
      SELECT * FROM personas
      WHERE (nombre ILIKE ${search} OR apellido ILIKE ${search}
        OR cedula_numero ILIKE ${search} OR ciudad ILIKE ${search})
      AND estado = ${estadoFilter}
      ORDER BY created_at DESC LIMIT 50
    `;
    return Response.json(rows);
  }
  if (q) {
    const search = `%${q}%`;
    const rows = await sql`
      SELECT * FROM personas
      WHERE nombre ILIKE ${search} OR apellido ILIKE ${search}
        OR cedula_numero ILIKE ${search} OR ciudad ILIKE ${search}
      ORDER BY created_at DESC LIMIT 50
    `;
    return Response.json(rows);
  }
  if (estadoFilter) {
    const rows = await sql`
      SELECT * FROM personas WHERE estado = ${estadoFilter}
      ORDER BY created_at DESC LIMIT 50
    `;
    return Response.json(rows);
  }
  const rows = await sql`SELECT * FROM personas ORDER BY created_at DESC LIMIT 50`;
  return Response.json(rows);
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const nombre = sanitize(body.nombre);
  const apellido = sanitize(body.apellido);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);

  if (!nombre || !apellido || !estado || !ciudad) {
    return Response.json(
      { error: 'Nombre, apellido, estado y ciudad son requeridos.' },
      { status: 400 }
    );
  }

  const cedula_tipo = sanitize(body.cedula_tipo);
  const cedula_numero = sanitize(body.cedula_numero);
  if (cedula_numero && !isValidCedula(cedula_numero)) {
    return Response.json({ error: 'Cédula inválida. Ingrese entre 6 y 8 dígitos.' }, { status: 400 });
  }

  const telefono = sanitize(body.telefono);
  if (telefono && !isValidPhone(telefono)) {
    return Response.json({ error: 'Teléfono inválido. Formato: 04121234567' }, { status: 400 });
  }

  const email = sanitize(body.email);
  if (email && !isValidEmail(email)) {
    return Response.json({ error: 'Email inválido.' }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO personas (
      nombre, apellido, cedula_tipo, cedula_numero, fecha_nacimiento,
      genero, estado, ciudad, telefono, email, foto_url,
      ultima_vez_fecha, ultima_vez_lugar, descripcion, estado_busqueda
    ) VALUES (
      ${nombre}, ${apellido}, ${cedula_tipo}, ${cedula_numero},
      ${sanitize(body.fecha_nacimiento)}, ${sanitize(body.genero)},
      ${estado}, ${ciudad}, ${telefono}, ${email},
      ${sanitize(body.foto_url)}, ${sanitize(body.ultima_vez_fecha)},
      ${sanitize(body.ultima_vez_lugar)}, ${sanitize(body.descripcion)},
      ${sanitize(body.estado_busqueda) ?? 'buscando'}
    )
    RETURNING *
  `;

  return Response.json(rows[0], { status: 201 });
}
