import { getSql } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getSql();
  const rows = await sql`SELECT * FROM personas WHERE id = ${Number(id)} LIMIT 1`;
  if (!rows[0]) return Response.json({ error: 'No encontrado.' }, { status: 404 });
  return Response.json(rows[0]);
}
