import { getSql } from '@/lib/db';

const ESTADOS_VALIDOS = ['buscando', 'encontrado', 'descartado'];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getSql();
  const body = await request.json() as { estado_busqueda: string };

  if (!ESTADOS_VALIDOS.includes(body.estado_busqueda)) {
    return Response.json({ error: 'Estado inválido.' }, { status: 400 });
  }

  const rows = await sql`
    UPDATE personas SET estado_busqueda = ${body.estado_busqueda}, updated_at = NOW()
    WHERE id = ${Number(id)}
    RETURNING id, nombre, apellido, estado_busqueda
  `;
  if (!rows[0]) return Response.json({ error: 'Persona no encontrada.' }, { status: 404 });
  return Response.json(rows[0]);
}
