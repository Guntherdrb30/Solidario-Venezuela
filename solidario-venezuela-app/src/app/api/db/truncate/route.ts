import { getSql } from '@/lib/db';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.TRUNCATE_SECRET) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const sql = getSql();
  await sql`TRUNCATE TABLE personas, centros_ayuda RESTART IDENTITY`;

  return Response.json({ ok: true, message: 'Datos eliminados. Tablas vacías y contadores reiniciados.' });
}
