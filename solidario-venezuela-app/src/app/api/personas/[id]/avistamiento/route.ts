import { getSql } from '@/lib/db';
import { sanitize } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM avistamientos WHERE persona_id = ${Number(id)}
    ORDER BY created_at DESC LIMIT 20
  `;
  return Response.json(rows);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const lugar = sanitize(body.lugar);
  const descripcion = sanitize(body.descripcion);

  if (!lugar || !descripcion) {
    return Response.json({ error: 'Lugar y descripción son requeridos.' }, { status: 400 });
  }
  if (descripcion.length < 10) {
    return Response.json({ error: 'La descripción debe tener al menos 10 caracteres.' }, { status: 400 });
  }

  const persona = await sql`SELECT id FROM personas WHERE id = ${Number(id)} LIMIT 1`;
  if (!persona[0]) return Response.json({ error: 'Persona no encontrada.' }, { status: 404 });

  const rows = await sql`
    INSERT INTO avistamientos (persona_id, fecha, lugar, descripcion)
    VALUES (${Number(id)}, ${sanitize(body.fecha)}, ${lugar}, ${descripcion})
    RETURNING *
  `;
  return Response.json(rows[0], { status: 201 });
}
