import { getSql } from './db';

export async function logAudit(request: Request, accion: string, tabla: string, record_id: number | null = null) {
  try {
    const sql = getSql();
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'desconocida';
    const user_agent = request.headers.get('user-agent') ?? '';

    await sql`
      INSERT INTO audit_logs (accion, tabla, record_id, ip, user_agent)
      VALUES (${accion}, ${tabla}, ${record_id}, ${ip}, ${user_agent})
    `;
  } catch {
    // never block the request if audit fails
  }
}
