import { getSql } from '@/lib/db';
import { logAudit } from '@/lib/audit';

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as { organizacion_id: number; estrellas: number; comentario?: string };

  const { organizacion_id, estrellas, comentario } = body;

  if (!organizacion_id || !estrellas) {
    return Response.json({ error: 'organizacion_id y estrellas son requeridos.' }, { status: 400 });
  }
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
    return Response.json({ error: 'Las estrellas deben ser un número entre 1 y 5.' }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO organizacion_valoraciones (organizacion_id, estrellas, comentario)
    VALUES (${organizacion_id}, ${estrellas}, ${comentario ?? null})
    RETURNING *
  `;
  await logAudit(request, 'valorar_organizacion', 'organizacion_valoraciones', rows[0].id);
  return Response.json(rows[0], { status: 201 });
}
