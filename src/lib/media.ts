import type { Product } from '@/schemas/ecommerce';

const STORAGE_URL = import.meta.env.VITE_ERP_STORAGE_URL;

/**
 * Convierte una ruta relativa del ERP (`store/products/x.png`) en URL absoluta.
 * Acepta null/undefined y rutas ya absolutas sin romperse.
 */
export function mediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${STORAGE_URL}/${path.replace(/^\/+/, '')}`;
}

/**
 * "12.9900" → "$12.99". El ERP manda el precio como string decimal.
 * Devuelve cadena vacía si no hay un número válido.
 */
export function formatPrice(raw?: string | number | null): string {
  if (raw === null || raw === undefined || raw === '') return '';
  const value = typeof raw === 'number' ? raw : Number.parseFloat(raw);
  if (!Number.isFinite(value)) return '';
  return `$${value.toFixed(2)}`;
}

/** Imágenes de un producto ordenadas: la principal primero, luego por `orden`. */
export function productImages(product: Product): string[] {
  return [...product.imagenes]
    .sort((a, b) => Number(b.es_principal) - Number(a.es_principal) || a.orden - b.orden)
    .map((img) => mediaUrl(img.path))
    .filter((url): url is string => Boolean(url));
}

/** Primera imagen utilizable de un producto (o undefined). */
export function primaryImage(product: Product): string | undefined {
  return productImages(product)[0];
}
