import { getSql } from '@/lib/db';
import { sanitize } from '@/lib/validations';
import { randomBytes } from 'crypto';

function checkAdmin(request: Request): boolean {
  const { searchParams } = new URL(request.url);
  return searchParams.get('secret') === process.env.ADMIN_SECRET;
}

export async function GET(request: Request) {
  if (!checkAdmin(request)) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const sql = getSql();
  const rows = await sql`SELECT * FROM api_tokens ORDER BY created_at DESC`;
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const nombre = sanitize(body.nombre);
  const dominio = sanitize(body.dominio);

  if (!nombre || !dominio) {
    return Response.json({ error: 'Nombre y dominio son requeridos.' }, { status: 400 });
  }

  // Generate a secure random token
  const token = `sv_${randomBytes(24).toString('hex')}`;

  const rows = await sql`
    INSERT INTO api_tokens (nombre, token, dominio)
    VALUES (${nombre}, ${token}, ${dominio})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}

export async function DELETE(request: Request) {
  if (!checkAdmin(request)) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') ?? '0');
  if (!id) return Response.json({ error: 'ID requerido.' }, { status: 400 });

  await sql`UPDATE api_tokens SET activo = FALSE WHERE id = ${id}`;
  return Response.json({ ok: true });
}
