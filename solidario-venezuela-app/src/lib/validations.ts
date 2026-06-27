export function isValidCedula(numero: string): boolean {
  return /^\d{6,8}$/.test(numero);
}

export function isValidPhone(phone: string): boolean {
  return /^(0412|0414|0416|0422|0424|0426|02\d{2})\d{7}$/.test(phone);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitize(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
