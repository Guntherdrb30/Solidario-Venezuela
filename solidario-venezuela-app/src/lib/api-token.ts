import { getSql } from './db';

export async function validateApiToken(request: Request): Promise<{ ok: boolean; error?: string }> {
  const origin = request.headers.get('origin') ?? '';
  const host = request.headers.get('host') ?? '';
  const ownDomain = process.env.VERCEL_URL ?? 'solidario-venezuela.vercel.app';

  // Allow requests from our own domain (same-origin, no token needed)
  if (!origin || origin.includes(ownDomain) || origin.includes('localhost')) {
    return { ok: true };
  }

  // External origin — require a token
  const authHeader = request.headers.get('authorization') ?? '';
  const url = new URL(request.url);
  const tokenParam = url.searchParams.get('token') ?? '';
  const rawToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : tokenParam;

  if (!rawToken) {
    return { ok: false, error: 'Se requiere token de API. Contacta al administrador para obtener acceso.' };
  }

  const sql = getSql();
  const rows = await sql`SELECT * FROM api_tokens WHERE token = ${rawToken} AND activo = TRUE LIMIT 1`;
  if (!rows.length) {
    return { ok: false, error: 'Token inválido o desactivado.' };
  }

  const record = rows[0];
  const allowedDomain = record.dominio as string;

  // Check the origin matches the registered domain
  if (!origin.includes(allowedDomain) && !allowedDomain.includes('*')) {
    return { ok: false, error: `Este token no está autorizado para el dominio ${origin}. Crea un token específico para tu plataforma.` };
  }

  // Update usage stats (don't await — fire and forget)
  sql`UPDATE api_tokens SET usos = usos + 1, ultimo_uso = NOW() WHERE id = ${record.id}`.catch(() => {});

  return { ok: true };
}
