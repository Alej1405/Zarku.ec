import type { z } from 'zod';

const BASE_URL = import.meta.env.VITE_CMS_BASE_URL;
const TOKEN = import.meta.env.VITE_CMS_TOKEN;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Trae un recurso del CMS y lo valida con su esquema Zod.
 * Si la respuesta no cumple el esquema, lanza ApiError (el slice lo captura).
 */
export async function fetchResource<T>(
  path: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
      },
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError('No se pudo conectar con el servidor.');
  }

  if (!res.ok) {
    throw new ApiError(`Error ${res.status} al cargar «${path}».`, res.status);
  }

  const json: unknown = await res.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    if (import.meta.env.DEV) {
      console.error(`[CMS] Validación fallida en «${path}»:`, parsed.error.issues);
    }
    throw new ApiError(`Datos inválidos recibidos de «${path}».`);
  }

  return parsed.data;
}
