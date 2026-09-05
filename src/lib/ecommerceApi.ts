import type { z } from 'zod';
import { ApiError } from '@/lib/api';
import {
  categoriesSchema,
  paginatedProductsSchema,
  type Category,
  type Product,
} from '@/schemas/ecommerce';

/**
 * Cliente de la API pública de ecommerce del ERP.
 * A diferencia del CMS (`lib/api.ts`), esta base NO lleva token: es pública.
 * Igual que allá, cada respuesta se valida con Zod antes de entrar al store.
 */

const BASE_URL = import.meta.env.VITE_ECOMMERCE_BASE_URL;

async function getJson<T>(
  path: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/${path}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError('No se pudo conectar con la tienda.');
  }

  if (!res.ok) {
    throw new ApiError(`Error ${res.status} al cargar «${path}».`, res.status);
  }

  const json: unknown = await res.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    if (import.meta.env.DEV) {
      console.error(`[ecommerce] Validación fallida en «${path}»:`, parsed.error.issues);
    }
    throw new ApiError(`Datos inválidos recibidos de «${path}».`);
  }

  return parsed.data;
}

/**
 * Trae TODOS los productos recorriendo la paginación estilo Laravel.
 * El endpoint fija 24 por página e ignora `per_page`, así que seguimos
 * `next_page_url` hasta agotarlo. El catálogo es chico; en la práctica es
 * una sola página, pero el bucle lo deja a prueba de crecimiento.
 */
export async function fetchAllProducts(signal?: AbortSignal): Promise<Product[]> {
  const all: Product[] = [];
  let page = 1;
  // Tope de seguridad para no colgar la app si el backend nunca cierra la paginación.
  const MAX_PAGES = 40;

  while (page <= MAX_PAGES) {
    const res = await getJson(`products?page=${page}`, paginatedProductsSchema, signal);
    all.push(...res.data);
    if (!res.next_page_url || res.current_page >= res.last_page) break;
    page += 1;
  }

  return all;
}

export function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  return getJson('categories', categoriesSchema, signal);
}
