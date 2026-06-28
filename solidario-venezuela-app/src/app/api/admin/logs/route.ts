import { getSql } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const sql = getSql();
  const rows = await sql`
    SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200
  `;
  return Response.json(rows);
}
