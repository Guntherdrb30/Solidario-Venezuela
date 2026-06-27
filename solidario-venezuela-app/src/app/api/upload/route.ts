import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return Response.json({ error: 'No se proporcionó archivo.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: 'Solo se permiten imágenes JPG, PNG o WebP.' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'La imagen no puede superar 5MB.' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const blob = await put(`personas/${Date.now()}.${ext}`, file, { access: 'public' });

  return Response.json({ url: blob.url });
}
