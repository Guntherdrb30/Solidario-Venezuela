import { getSql } from '@/lib/db';
import { sanitize, isValidPhone, isValidEmail } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

const CATEGORIAS_VALIDAS = ['damnificados', 'ninos', 'vivienda', 'alimentacion', 'medicinas', 'educacion', 'ropa', 'rescate', 'otro'];
const TIPOS_VALIDOS = ['dinero', 'especie', 'mixto'];
const PAGE_SIZE = 24;

export async function GET(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const categoria = searchParams.get('categoria')?.trim() ?? '';
  const estado = searchParams.get('estado')?.trim() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const offset = (page - 1) * PAGE_SIZE;

  let rows, countRows;

  if (q) {
    const s = `%${q}%`;
    [rows, countRows] = await Promise.all([
      sql`SELECT d.*, o.nombre as org_nombre FROM donaciones d LEFT JOIN organizaciones o ON d.organizacion_id = o.id WHERE (d.donante_empresa ILIKE ${s} OR d.donante_pais ILIKE ${s} OR d.proposito ILIKE ${s} OR d.categoria ILIKE ${s}) ORDER BY d.created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM donaciones WHERE donante_empresa ILIKE ${s} OR donante_pais ILIKE ${s} OR proposito ILIKE ${s} OR categoria ILIKE ${s}`,
    ]);
  } else if (categoria) {
    [rows, countRows] = await Promise.all([
      sql`SELECT d.*, o.nombre as org_nombre FROM donaciones d LEFT JOIN organizaciones o ON d.organizacion_id = o.id WHERE d.categoria = ${categoria} ORDER BY d.created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM donaciones WHERE categoria = ${categoria}`,
    ]);
  } else {
    [rows, countRows] = await Promise.all([
      sql`SELECT d.*, o.nombre as org_nombre FROM donaciones d LEFT JOIN organizaciones o ON d.organizacion_id = o.id ORDER BY d.created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int AS total FROM donaciones`,
    ]);
  }

  const total = countRows[0]?.total ?? 0;
  return Response.json({ results: rows, total, page, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(request: Request) {
  const sql = getSql();
  const body = await request.json() as Record<string, unknown>;

  const tipo = sanitize(body.tipo) ?? 'dinero';
  const categoria = sanitize(body.categoria);
  const proposito = sanitize(body.proposito);
  const donante_nombre = sanitize(body.donante_nombre);
  const donante_pais = sanitize(body.donante_pais);

  if (!categoria || !proposito || !donante_nombre || !donante_pais) {
    return Response.json({ error: 'Categoría, propósito, nombre del donante y país son requeridos.' }, { status: 400 });
  }
  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
    return Response.json({ error: 'Categoría inválida.' }, { status: 400 });
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return Response.json({ error: 'Tipo inválido.' }, { status: 400 });
  }

  const donante_telefono = sanitize(body.donante_telefono);
  const donante_email = sanitize(body.donante_email);
  if (donante_email && !isValidEmail(donante_email)) {
    return Response.json({ error: 'Email inválido.' }, { status: 400 });
  }

  const monto = body.monto ? Number(body.monto) : null;
  const organizacion_id = body.organizacion_id ? Number(body.organizacion_id) : null;

  const rows = await sql`
    INSERT INTO donaciones (tipo, monto, moneda, descripcion_especie, categoria, proposito, donante_nombre, donante_empresa, donante_telefono, donante_email, donante_pais, organizacion_id)
    VALUES (${tipo}, ${monto}, ${sanitize(body.moneda) ?? 'USD'}, ${sanitize(body.descripcion_especie)}, ${categoria}, ${proposito}, ${donante_nombre}, ${sanitize(body.donante_empresa)}, ${donante_telefono}, ${donante_email}, ${donante_pais}, ${organizacion_id})
    RETURNING *
  `;
  await logAudit(request, 'crear_donacion', 'donaciones', rows[0].id);
  return Response.json(rows[0], { status: 201 });
}
