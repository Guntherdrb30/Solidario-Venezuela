import { getSql } from '@/lib/db';
import { sanitize, isValidPhone, isValidEmail } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

const TIPOS_VALIDOS = ['ong', 'fundacion', 'grupo_comunitario', 'empresa', 'iglesia', 'otro'];
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
      sql`SELECT * FROM organizaciones WHERE (nombre ILIKE ${s} OR descripcion ILIKE ${s} OR areas ILIKE ${s}) AND estado = ${estadoFilter} ORDER BY verificada DESC, created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM organizaciones WHERE (nombre ILIKE ${s} OR descripcion ILIKE ${s} OR areas ILIKE ${s}) AND estado = ${estadoFilter}`,
    ]);
  } else if (q) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM organizaciones WHERE nombre ILIKE ${s} OR descripcion ILIKE ${s} OR areas ILIKE ${s} OR ciudad ILIKE ${s} ORDER BY verificada DESC, created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM organizaciones WHERE nombre ILIKE ${s} OR descripcion ILIKE ${s} OR areas ILIKE ${s} OR ciudad ILIKE ${s}`,
    ]);
  } else if (estadoFilter) {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM organizaciones WHERE estado = ${estadoFilter} ORDER BY verificada DESC, created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM organizaciones WHERE estado = ${estadoFilter}`,
    ]);
  } else {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM organizaciones ORDER BY verificada DESC, created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM organizaciones`,
    ]);
  }

  const total = countRows[0]?.total ?? 0;
  return Response.json({ results: rows, total, page, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const nombre = sanitize(body.nombre);
  const tipo = sanitize(body.tipo);
  const descripcion = sanitize(body.descripcion);
  const contacto_nombre = sanitize(body.contacto_nombre);
  const pais_sede = sanitize(body.pais_sede) ?? 'Venezuela';

  if (!nombre || !tipo || !descripcion || !contacto_nombre) {
    return Response.json({ error: 'Nombre, tipo, descripción y contacto son requeridos.' }, { status: 400 });
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return Response.json({ error: 'Tipo de organización inválido.' }, { status: 400 });
  }

  const email = sanitize(body.email);
  if (email && !isValidEmail(email)) {
    return Response.json({ error: 'Email inválido.' }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO organizaciones (nombre, tipo, descripcion, areas, contacto_nombre, telefono, email, website, estado, ciudad, pais_sede, rif)
    VALUES (${nombre}, ${tipo}, ${descripcion}, ${sanitize(body.areas)}, ${contacto_nombre}, ${sanitize(body.telefono)}, ${email}, ${sanitize(body.website)}, ${sanitize(body.estado)}, ${sanitize(body.ciudad)}, ${pais_sede}, ${sanitize(body.rif)})
    RETURNING *
  `;
  await logAudit(request, 'crear_organizacion', 'organizaciones', rows[0].id);
  return Response.json(rows[0], { status: 201 });
}
