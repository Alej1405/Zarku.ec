import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '@/schemas/ecommerce';
import { mediaUrl } from '@/lib/media';

/**
 * Franja de categoría: un estrato a sangre, no una tarjeta. El banner vive de
 * fondo enmascarado hacia la izquierda para que el nombre siempre tenga
 * contraste; al hover sube y crece la hairline volt superior. Sin radio: las
 * franjas se tocan entre sí, separadas por `border-line`.
 *
 * Si la categoría (agregando hijos) no tiene stock, no enlaza: dice "Muy
 * pronto" y comunica que la línea existe y viene en camino.
 */
export function CategoryStratum({ category, count }: { category: Category; count: number }) {
  const banner = mediaUrl(category.banner) ?? mediaUrl(category.imagen);
  const childNames = category.children.map((c) => c.nombre);
  const zonas = category.children.length;
  const hasStock = count > 0;

  const meta = hasStock
    ? [zonas > 0 ? `${zonas} ${zonas === 1 ? 'zona' : 'zonas'}` : null, `${count} ${count === 1 ? 'producto' : 'productos'}`]
        .filter(Boolean)
        .join(' · ')
    : 'Muy pronto';

  const inner = (
    <>
      {/* Banner de fondo, enmascarado hacia la izquierda */}
      {banner && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-25 transition-all duration-700 ease-[var(--ease-out-expo)] [mask-image:linear-gradient(to_left,black_10%,transparent_85%)] group-hover:scale-[1.04] group-hover:opacity-[0.55]"
          style={{ backgroundImage: `url("${banner}")` }}
        />
      )}
      {/* Velo para asegurar legibilidad del nombre */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent"
      />
      {/* Hairline volt superior que crece al hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-volt transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
      />

      <div className="container-x relative flex h-full items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-display font-extrabold uppercase leading-[0.95] tracking-tight text-ink">
            {category.nombre}
          </h3>
          {childNames.length > 0 && (
            <p className="mt-2 truncate text-sm text-muted">
              {childNames.join('   ·   ')}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <span className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted sm:text-xs sm:tracking-[0.14em]">
            {meta}
          </span>
          {hasStock && (
            <span className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors duration-300 group-hover:border-volt group-hover:text-volt">
              <ArrowUpRight size={20} />
            </span>
          )}
        </div>
      </div>
    </>
  );

  const base =
    'group relative block h-[clamp(150px,26vh,240px)] overflow-hidden border-b border-line';

  if (!hasStock) {
    return (
      <div className={`${base} cursor-default opacity-70`} aria-label={`${category.nombre} — muy pronto`}>
        {inner}
      </div>
    );
  }

  return (
    <Link to={`/catalogo/${category.slug}`} className={base} aria-label={`Ver ${category.nombre}`}>
      {inner}
    </Link>
  );
}

export function CategoryStratumSkeleton() {
  return (
    <div className="h-[clamp(150px,26vh,240px)] animate-pulse border-b border-line bg-surface/40" aria-hidden>
      <div className="container-x flex h-full items-center">
        <div className="h-8 w-52 rounded bg-surface-2" />
      </div>
    </div>
  );
}
