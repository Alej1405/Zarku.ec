/** Utilidades de formato para datos de contacto (Ecuador). */

/** "0979000505" → "+593 97 900 0505" (visual). */
export function formatPhone(raw?: string | null): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    const n = digits.slice(1);
    return `+593 ${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5)}`;
  }
  return raw;
}

/** Número internacional para wa.me / tel: a partir de un móvil ecuatoriano. */
export function toIntlNumber(raw?: string | null): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `593${digits.slice(1)}`;
  return digits;
}

/**
 * Número para WhatsApp: el campo `whatsapp` del ERP si de verdad es un número;
 * si no (vacío, o texto como "Ecuador"), el teléfono de contacto.
 */
export function numeroWhatsapp(whatsapp?: string | null, telefono?: string | null): string | null {
  const digitos = (whatsapp ?? '').replace(/\D/g, '');
  return digitos.length >= 7 ? (whatsapp as string) : (telefono ?? null);
}

export function whatsappLink(raw?: string | null, message?: string): string {
  const num = toIntlNumber(raw);
  const q = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${num}${q}`;
}

/** Fecha ISO → "17 jul 2026" (es-EC). Devuelve '' si no es válida. */
export function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-EC', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}
