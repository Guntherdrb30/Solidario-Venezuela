import { getSql } from '@/lib/db';
import { sanitize } from '@/lib/validations';

export async function GET() {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM avisos WHERE activo = TRUE ORDER BY created_at DESC LIMIT 10
  `;
  return Response.json(rows);
}

export async function POST(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const body = await request.json() as Record<string, unknown>;
  const titulo = sanitize(body.titulo);
  const contenido = sanitize(body.contenido);
  const tipo = sanitize(body.tipo) ?? 'info';

  if (!titulo || !contenido) {
    return Response.json({ error: 'Título y contenido requeridos.' }, { status: 400 });
  }

  const TIPOS_VALIDOS = ['info', 'alerta', 'urgente'];
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return Response.json({ error: 'Tipo inválido.' }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO avisos (titulo, contenido, tipo)
    VALUES (${titulo}, ${contenido}, ${tipo})
    RETURNING *
  `;

  return Response.json(rows[0], { status: 201 });
}
