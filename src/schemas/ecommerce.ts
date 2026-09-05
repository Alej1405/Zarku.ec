import { z } from 'zod';

/**
 * Esquemas Zod para la API pública de ecommerce del ERP (zarku-ecuador).
 * Base distinta al CMS y SIN token. Validan la respuesta en runtime antes
 * de que entre al store. Tolerantes: los campos opcionales del ERP pueden
 * venir null/ausentes.
 *
 * Trampas conocidas reflejadas aquí:
 *  - `precio_venta` llega como string decimal ("12.9900"), no como número.
 *  - `caracteristicas` es un array de objetos `{ texto }`, no de strings.
 *  - las rutas de imagen son relativas (ver `mediaUrl` en lib/media.ts).
 */

const nullableStr = z.string().nullish();

/** Una foto de producto. `path` es relativo al storage del ERP. */
export const productImageSchema = z.object({
  id: z.number(),
  path: z.string(),
  es_principal: z.boolean().default(false),
  orden: z.number().default(0),
});
export type ProductImage = z.infer<typeof productImageSchema>;

/** Categoría embebida en un producto (sin hijos ni conteo garantizados). */
/** El ERP a veces manda el nombre con espacios sobrantes ("Cintillos "). */
const trimmedStr = z.string().transform((s) => s.trim());

export const categoryRefSchema = z.object({
  id: z.number(),
  parent_id: z.number().nullable().default(null),
  nombre: trimmedStr,
  slug: z.string(),
  descripcion: nullableStr,
  imagen: nullableStr,
  banner: nullableStr,
});
export type CategoryRef = z.infer<typeof categoryRefSchema>;

export const caracteristicaSchema = z.object({
  texto: z.string(),
});
export type Caracteristica = z.infer<typeof caracteristicaSchema>;

export const productSchema = z.object({
  id: z.number(),
  store_category_id: z.number().nullable().default(null),
  nombre: trimmedStr,
  slug: z.string(),
  descripcion: nullableStr,
  precio_venta: z.string().default('0'),
  precio_distribuidor: nullableStr,
  cantidad_minima_distribuidor: z.number().nullable().default(null),
  destacado: z.boolean().default(false),
  sku: nullableStr,
  caracteristicas: z.array(caracteristicaSchema).default([]),
  store_category: categoryRefSchema.nullable().default(null),
  imagenes: z.array(productImageSchema).default([]),
  meta_titulo: nullableStr,
  meta_descripcion: nullableStr,
});
export type Product = z.infer<typeof productSchema>;

/** Categoría completa del árbol, con hijos anidados. */
export interface Category {
  id: number;
  parent_id: number | null;
  nombre: string;
  slug: string;
  descripcion?: string | null;
  imagen?: string | null;
  banner?: string | null;
  contenido?: string | null;
  products_count: number;
  destacada: boolean;
  children: Category[];
  meta_titulo?: string | null;
  meta_descripcion?: string | null;
}

export const categorySchema: z.ZodType<Category, z.ZodTypeDef, unknown> = z.lazy(() =>
  z.object({
    id: z.number(),
    parent_id: z.number().nullable().default(null),
    nombre: trimmedStr,
    slug: z.string(),
    descripcion: nullableStr,
    imagen: nullableStr,
    banner: nullableStr,
    contenido: nullableStr,
    products_count: z.number().default(0),
    destacada: z.boolean().default(false),
    children: z.array(categorySchema).default([]),
    meta_titulo: nullableStr,
    meta_descripcion: nullableStr,
  }),
);

export const categoriesSchema = z.array(categorySchema);

/** Respuesta paginada estilo Laravel de `products`. */
export const paginatedProductsSchema = z.object({
  data: z.array(productSchema),
  current_page: z.number().default(1),
  last_page: z.number().default(1),
  next_page_url: z.string().nullable().default(null),
  total: z.number().default(0),
});
export type PaginatedProducts = z.infer<typeof paginatedProductsSchema>;
