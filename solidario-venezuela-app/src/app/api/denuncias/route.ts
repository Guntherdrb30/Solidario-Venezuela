import { getSql } from '@/lib/db';
import { sanitize } from '@/lib/validations';

const TIPOS_VALIDOS = ['robo', 'extorsion', 'abuso_autoridad', 'secuestro', 'vandalismo', 'otro'];
const PAGE_SIZE = 24;

export async function GET(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const offset = (page - 1) * PAGE_SIZE;

  let rows, countRows;
  if (q) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM denuncias WHERE tipo ILIKE ${s} OR ciudad ILIKE ${s} OR estado ILIKE ${s} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM denuncias WHERE tipo ILIKE ${s} OR ciudad ILIKE ${s} OR estado ILIKE ${s}`,
    ]);
  } else {
    [rows, countRows] = await Promise.all([
      sql`SELECT * FROM denuncias ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM denuncias`,
    ]);
  }

  const total = countRows[0]?.total ?? 0;
  return Response.json({ results: rows, total, page, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const tipo = sanitize(body.tipo);
  const estado = sanitize(body.estado);
  const ciudad = sanitize(body.ciudad);
  const descripcion = sanitize(body.descripcion);

  if (!tipo || !estado || !ciudad || !descripcion) {
    return Response.json({ error: 'Tipo, estado, ciudad y descripción son requeridos.' }, { status: 400 });
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return Response.json({ error: 'Tipo de denuncia inválido.' }, { status: 400 });
  }
  if (descripcion.length < 10) {
    return Response.json({ error: 'La descripción debe tener al menos 10 caracteres.' }, { status: 400 });
  }

  const latitud = body.latitud ? Number(body.latitud) : null;
  const longitud = body.longitud ? Number(body.longitud) : null;

  const rows = await sql`
    INSERT INTO denuncias (tipo, estado, ciudad, descripcion, fecha_hecho, latitud, longitud)
    VALUES (${tipo}, ${estado}, ${ciudad}, ${descripcion}, ${sanitize(body.fecha_hecho)}, ${latitud}, ${longitud})
    RETURNING id, tipo, estado, ciudad, created_at
  `;
  return Response.json(rows[0], { status: 201 });
}
