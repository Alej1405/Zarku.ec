import { lazy, Suspense, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const TerrainScene = lazy(() => import('@/components/three/TerrainScene'));

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Fondo WebGL del hero (terreno topográfico). Se monta solo si el navegador
 * soporta WebGL; en reduced-motion renderiza un fotograma estático.
 * Lazy-loaded para no bloquear el primer render.
 */
export function HeroTerrain() {
  const reduce = useReducedMotion();
  // Detección de características de una sola vez (cliente): en pantallas ≥768px
  // y con soporte WebGL. Se calcula en el primer render (inicializador perezoso)
  // en vez de en un efecto, para no disparar un render en cascada.
  const [ok] = useState(() => {
    if (typeof window === 'undefined') return false;
    const enoughSpace = window.matchMedia('(min-width: 768px)').matches;
    return enoughSpace && supportsWebGL();
  });

  if (!ok) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 top-1/4 -z-0 [mask-image:linear-gradient(to_bottom,transparent,black_28%,black_88%,transparent)]"
    >
      <Suspense fallback={null}>
        <TerrainScene reduce={!!reduce} />
      </Suspense>
    </div>
  );
}
