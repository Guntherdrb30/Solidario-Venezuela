import { getSql } from '@/lib/db';
import { sanitize, isValidPhone, isValidEmail } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

const PROFESIONES_VALIDAS = ['Ingeniero Civil', 'Arquitecto', 'Técnico en Construcción', 'Ingeniero Estructural', 'Inspector de Obra', 'Otro'];
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
      sql`SELECT * FROM peritos WHERE (nombre ILIKE ${s} OR profesion ILIKE ${s} OR ciudad ILIKE ${s}) AND estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM peritos WHERE (nombre ILIKE ${s} OR profesion ILIKE ${s} OR ciudad ILIKE ${s}) AND estado = ${estadoFilter}`,
    ]);
  } else if (q) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM peritos WHERE nombre ILIKE ${s} OR profesion ILIKE ${s} OR ciudad ILIKE ${s} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM peritos WHERE nombre ILIKE ${s} OR profesion ILIKE ${s} OR ciudad ILIKE ${s}`,
    ]);
  } else if (estadoFilter) {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM peritos WHERE estado = ${estadoFilter} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM peritos WHERE estado = ${estadoFilter}`,
    ]);
  } else {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM peritos ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM peritos`,
    ]);
  }

  const total = countRows[0]?.total ?? 0;
  return Response.json({ results: rows, total, page, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const nombre = sanitize(body.nombre);
  const profesion = sanitize(body.profesion);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);

  if (!nombre || !profesion || !estado || !ciudad) {
    return Response.json({ error: 'Nombre, profesión, estado y ciudad son requeridos.' }, { status: 400 });
  }
  if (!PROFESIONES_VALIDAS.includes(profesion)) {
    return Response.json({ error: 'Profesión inválida.' }, { status: 400 });
  }

  const telefono = sanitize(body.telefono);
  if (telefono && !isValidPhone(telefono)) {
    return Response.json({ error: 'Teléfono inválido.' }, { status: 400 });
  }

  const email = sanitize(body.email);
  if (email && !isValidEmail(email)) {
    return Response.json({ error: 'Email inválido.' }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO peritos (nombre, profesion, numero_colegiado, estado, ciudad, telefono, email)
    VALUES (${nombre}, ${profesion}, ${sanitize(body.numero_colegiado)}, ${estado}, ${ciudad}, ${telefono}, ${email})
    RETURNING *
  `;
  await logAudit(request, 'crear_perito', 'peritos', rows[0].id);
  return Response.json(rows[0], { status: 201 });
}
