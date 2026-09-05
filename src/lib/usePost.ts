import { useEffect, useState } from 'react';
import { fetchResource } from '@/lib/api';
import { postSchema, type Post } from '@/schemas/cms';

type Status = 'loading' | 'succeeded' | 'failed';

interface Inner {
  status: Status;
  post: Post | null;
  error: string | null;
  forSlug: string;
}

export interface PostState {
  status: Status;
  post: Post | null;
  error: string | null;
}

/**
 * Trae una noticia por slug del CMS (base + token vía fetchResource). Dato por
 * página, no global: hook local con AbortController en vez de un slice.
 * El estado guarda `forSlug` para derivar "cargando" al cambiar de slug, sin
 * un setState síncrono dentro del efecto.
 */
export function usePost(slug: string): PostState {
  const [state, setState] = useState<Inner>({
    status: 'loading',
    post: null,
    error: null,
    forSlug: slug,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchResource(`posts/${slug}`, postSchema, controller.signal)
      .then((post) => setState({ status: 'succeeded', post, error: null, forSlug: slug }))
      .catch((err: unknown) => {
        if ((err as Error)?.name === 'AbortError') return;
        setState({
          status: 'failed',
          post: null,
          error: err instanceof Error ? err.message : 'No se pudo cargar la noticia.',
          forSlug: slug,
        });
      });

    return () => controller.abort();
  }, [slug]);

  // Si el estado pertenece a otro slug (cambio de ruta), estamos cargando.
  if (state.forSlug !== slug) {
    return { status: 'loading', post: null, error: null };
  }
  return { status: state.status, post: state.post, error: state.error };
}
