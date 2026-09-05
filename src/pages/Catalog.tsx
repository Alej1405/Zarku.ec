import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchCategoriesThunk } from '@/store/slices/categoriesSlice';
import { CatalogShell } from '@/components/catalog/CatalogShell';
import { SectionError } from '@/components/layout/SectionError';
import { FeaturedCarousel } from '@/components/catalog/FeaturedCarousel';
import { ProductCardSkeleton } from '@/components/catalog/ProductCard';
import { CategoryStratum, CategoryStratumSkeleton } from '@/components/catalog/CategoryStratum';
import { TopoLines } from '@/components/motion/TopoLines';
import { Reveal } from '@/components/motion/Reveal';
import { featuredProducts, productCount } from '@/lib/catalog';

export default function Catalog() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.products);
  const categories = useAppSelector((s) => s.categories);

  useEffect(() => {
    document.title = 'Catálogo — Zarku';
  }, []);

  const loading =
    products.status === 'idle' ||
    products.status === 'loading' ||
    categories.status === 'idle' ||
    categories.status === 'loading';
  const failed = products.status === 'failed' || categories.status === 'failed';

  const productList = products.data ?? [];
  const categoryList = categories.data ?? [];
  const featured = featuredProducts(productList);

  return (
    <CatalogShell>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 hidden w-[640px] -translate-y-1/2 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)] md:block"
        >
          <TopoLines className="h-[640px] w-[640px]" rings={11} />
        </div>

        <div className="container-x relative py-16 sm:py-24">
          <Reveal>
            <p className="label-mono mb-5">Tienda · Zarku Ecuador</p>
            <h1 className="max-w-[14ch] text-hero font-extrabold uppercase leading-[0.92] tracking-tight">
              Elige tu ruta.
            </h1>
            <p className="mt-6 max-w-[44ch] text-lg text-muted">
              Accesorios técnicos fabricados en Ecuador. Para el páramo y para la ciudad —
              diseñados para el movimiento, hechos para resistir.
            </p>
          </Reveal>
        </div>
      </section>

      {failed ? (
        <SectionError
          message={products.error ?? categories.error}
          onRetry={() => {
            void dispatch(fetchProducts());
            void dispatch(fetchCategoriesThunk());
          }}
        />
      ) : (
        <>
          {/* ---------- Destacados ---------- */}
          <section className="py-14 sm:py-20">
            <div className="container-x mb-8 flex items-end justify-between gap-4">
              <h2 className="text-title font-bold uppercase tracking-tight">Destacados</h2>
              {!loading && featured.length > 0 && (
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  {String(featured.length).padStart(2, '0')} piezas
                </span>
              )}
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
              <FeaturedCarousel products={featured} />
            )}
          </section>

          {/* ---------- Estratos de categoría ---------- */}
          <section className="border-t border-line">
            <div className="container-x py-6">
              <p className="label-mono">Zonas del mapa</p>
            </div>
            {loading ? (
              <>
                <CategoryStratumSkeleton />
                <CategoryStratumSkeleton />
                <CategoryStratumSkeleton />
              </>
            ) : (
              categoryList.map((cat) => (
                <CategoryStratum
                  key={cat.id}
                  category={cat}
                  count={productCount(productList, cat)}
                />
              ))
            )}
          </section>
        </>
      )}
    </CatalogShell>
  );
}
