import { z } from 'zod';

/**
 * Esquemas Zod para el CMS del ERP (zarku-ecuador).
 * Validan la respuesta en runtime antes de que entre al store.
 * Tolerantes: los campos opcionales del ERP pueden venir null/ausentes.
 */

const nullableStr = z.string().nullable().optional();

export const heroSchema = z.object({
  titulo: z.string().default('ZARKU'),
  subtitulo: nullableStr,
  descripcion: nullableStr,
  imagen: nullableStr,
  cta_texto: nullableStr,
  cta_url: nullableStr,
});
export type Hero = z.infer<typeof heroSchema>;

export const numeroSchema = z.object({
  valor: z.string(),
  etiqueta: z.string(),
});
export type Numero = z.infer<typeof numeroSchema>;

export const aboutSchema = z.object({
  titulo: z.string().default('¿Qué es Zarku?'),
  descripcion: nullableStr,
  imagen: nullableStr,
  por_que_nosotros: z.array(z.string()).default([]),
  numeros: z.array(numeroSchema).default([]),
  caracteristicas: z.array(z.string()).default([]),
});
export type About = z.infer<typeof aboutSchema>;

export const serviceSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  descripcion: z.string().default(''),
  caracteristicas: z.array(z.string()).default([]),
  icono: nullableStr,
  imagen: nullableStr,
});
export type Service = z.infer<typeof serviceSchema>;
export const servicesSchema = z.array(serviceSchema);

export const faqSchema = z.object({
  id: z.number(),
  pregunta: z.string(),
  respuesta: z.string().default(''),
});
export type Faq = z.infer<typeof faqSchema>;
export const faqListSchema = z.array(faqSchema);

export const redesSchema = z
  .object({
    facebook: nullableStr,
    instagram: nullableStr,
    tiktok: nullableStr,
    youtube: nullableStr,
    x: nullableStr,
  })
  .partial()
  .default({});

/**
 * Blog / noticias. La lista (`posts`) trae `extracto` pero no `contenido`;
 * el detalle (`posts/{slug}`) trae `contenido` (HTML) pero no `extracto`.
 * `imagen` viene como URL absoluta. Un solo esquema tolerante cubre ambos.
 */
export const postSchema = z.object({
  id: z.number(),
  titulo: z.string().default('Sin título'),
  slug: z.string(),
  imagen: nullableStr,
  extracto: nullableStr,
  contenido: nullableStr,
  publicado_en: nullableStr,
});
export type Post = z.infer<typeof postSchema>;
export const postsListSchema = z.array(postSchema);

export const contactSchema = z.object({
  direccion: nullableStr,
  telefono: nullableStr,
  email: nullableStr,
  whatsapp: nullableStr,
  mapa_embed: nullableStr,
  redes: redesSchema,
});
export type Contact = z.infer<typeof contactSchema>;
export type Redes = z.infer<typeof redesSchema>;
