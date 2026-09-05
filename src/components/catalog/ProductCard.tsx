import { Link } from 'react-router-dom';
import { Mountain } from 'lucide-react';
import type { Product } from '@/schemas/ecommerce';
import { formatPrice, productImages } from '@/lib/media';

/**
 * Producto en grilla o carrusel. Sin caja: la foto 4:5 sobre el fondo de
 * página, nombre y precio agrupados debajo por espacio. Al hover, si hay una
 * segunda foto, se hace crossfade a ella (artesanía de ecommerce: el dato ya
 * viene). Toda la tarjeta es el enlace a la ficha.
 */
export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const images = productImages(product);
  const primary = images[0];
  const secondary = images[1];

  return (
    <Link
      to={`/producto/${product.slug}`}
      className={`group block ${className ?? ''}`}
      aria-label={`${product.nombre} — ${formatPrice(product.precio_venta)}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line/60 bg-surface">
        {primary ? (
          <>
            <img
              src={primary}
              alt={product.nombre}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
            />
            {secondary && (
              <img
                src={secondary}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="grid h-full w-full place-items-center text-line">
            <Mountain size={40} strokeWidth={1.5} />
          </div>
        )}
        {/* Aro volt sutil al hover, sin rellenar la tarjeta */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent transition-colors duration-300 group-hover:ring-volt/40" />
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-volt">
          {product.nombre}
        </h3>
        <span className="shrink-0 font-mono text-sm tabular-nums text-volt">
          {formatPrice(product.precio_venta)}
        </span>
      </div>
    </Link>
  );
}

/** Esqueleto con la forma final: bloque 4:5 + dos líneas. Nunca un spinner. */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`block ${className ?? ''}`} aria-hidden>
      <div className="aspect-[4/5] animate-pulse rounded-xl border border-line/60 bg-surface" />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div className="h-3.5 w-24 animate-pulse rounded bg-surface-2" />
        <div className="h-3.5 w-12 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}
