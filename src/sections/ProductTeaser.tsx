import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { FeaturedCarousel } from '@/components/catalog/FeaturedCarousel';
import { ProductCardSkeleton } from '@/components/catalog/ProductCard';
import { Reveal } from '@/components/motion/Reveal';
import { randomProducts } from '@/lib/catalog';

/**
 * Vitrina de la Home: 5 productos al azar que rotan en cada visita, como
 * anticipo de la tienda. No bloquea el loader de la Home; carga aparte y
 * muestra skeletons mientras llega la data del ecommerce.
 */
export function ProductTeaser() {
  const data = useAppSelector((s) => s.products.data);
  const status = useAppSelector((s) => s.products.status);

  // Selección aleatoria estable; se recalcula solo cuando llega/cambia la data.
  const picks = useMemo(() => randomProducts(data ?? [], 5), [data]);

  const loading = status === 'idle' || status === 'loading';

  // Si falló o no hay productos, no dibujamos la sección (la Home no depende de ella).
  if (!loading && picks.length === 0) return null;

  return (
    <section id="tienda" className="scroll-mt-24 border-t border-line py-20 sm:py-28">
      <div className="container-x mb-10 flex flex-wrap items-end justify-between gap-5">
        <Reveal>
          <p className="label-mono mb-4">De la tienda</p>
          <h2 className="max-w-[16ch] text-display font-extrabold uppercase leading-[0.95] tracking-tight">
            Equípate para <span className="text-volt">la ruta</span>
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-volt hover:text-volt"
          >
            Ver todo el catálogo
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </div>

      {loading ? (
        <div className="container-x">
          <div
            className="no-scrollbar flex gap-4 overflow-hidden pr-6 sm:gap-5"
            style={{ marginRight: 'calc(-1 * clamp(1.25rem, 5vw, 4rem))' }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[76%] shrink-0 sm:w-[17rem] md:w-[18.5rem]">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <FeaturedCarousel products={picks} />
      )}
    </section>
  );
}
