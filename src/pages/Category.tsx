import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchCategoriesThunk } from '@/store/slices/categoriesSlice';
import { CatalogShell } from '@/components/catalog/CatalogShell';
import { SectionError } from '@/components/layout/SectionError';
import { ProductGrid, ProductGridSkeleton } from '@/components/catalog/ProductGrid';
import { FeaturedCarousel } from '@/components/catalog/FeaturedCarousel';
import { RichText } from '@/components/catalog/RichText';
import { Reveal } from '@/components/motion/Reveal';
import { mediaUrl } from '@/lib/media';
import {
  findCategory,
  findParent,
  productsInCategory,
  productCount,
  categoriesWithStock,
} from '@/lib/catalog';
import type { Category as Cat } from '@/schemas/ecommerce';

/** Fila de sub-navegación: hermanas de una categoría dentro de un padre. */
function ChildChips({
  siblings,
  activeSlug,
  parentSlug,
  products,
}: {
  siblings: Cat[];
  activeSlug: string;
  parentSlug: string;
  products: ReturnType<typeof productsInCategory>;
}) {
  if (siblings.length === 0) return null;
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      <Link
        to={`/catalogo/${parentSlug}`}
        aria-current={activeSlug === parentSlug ? 'page' : undefined}
        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          activeSlug === parentSlug
            ? 'border-volt bg-volt/10 text-volt'
            : 'border-line text-muted hover:border-volt/60 hover:text-ink'
        }`}
      >
        Todos
      </Link>
      {siblings.map((c) => {
        const n = productCount(products, c);
        const active = c.slug === activeSlug;
        const empty = n === 0;
        const label = (
          <>
            {c.nombre}
            <span className="ml-2 font-mono text-xs tabular-nums opacity-70">{n}</span>
          </>
        );
        if (empty) {
          return (
            <span
              key={c.id}
              className="shrink-0 cursor-not-allowed rounded-full border border-line/60 px-4 py-2 text-sm font-medium text-muted/50"
              title="Sin productos por ahora"
            >
              {label}
            </span>
          );
        }
        return (
          <Link
            key={c.id}
            to={`/catalogo/${c.slug}`}
            aria-current={active ? 'page' : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? 'border-volt bg-volt/10 text-volt'
                : 'border-line text-muted hover:border-volt/60 hover:text-ink'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Category() {
  const { slug = '' } = useParams();
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.products);
  const categories = useAppSelector((s) => s.categories);

  const loading =
    products.status === 'idle' ||
    products.status === 'loading' ||
    categories.status === 'idle' ||
    categories.status === 'loading';
  const failed = products.status === 'failed' || categories.status === 'failed';

  const productList = products.data ?? [];
  const categoryList = categories.data ?? [];
  const category = findCategory(categoryList, slug);
  const parent = category ? findParent(categoryList, slug) : null;

  useEffect(() => {
    document.title = category ? `${category.nombre} — Zarku` : 'Catálogo — Zarku';
  }, [category]);

  const items = category ? productsInCategory(productList, category) : [];
  const count = items.length;
  const zonas = category?.children.length ?? 0;

  // Hermanas para los chips: si es hijo, las del padre; si es padre con hijos,
  // las suyas. La categoría "raíz" del grupo para el chip "Todos".
  const chipParent = parent ?? category;
  const siblings = parent ? parent.children : (category?.children ?? []);

  const banner = category ? mediaUrl(category.banner) ?? mediaUrl(category.imagen) : undefined;

  return (
    <CatalogShell>
      {loading ? (
        <CategoryLoading />
      ) : failed ? (
        <SectionError
          message={products.error ?? categories.error}
          onRetry={() => {
            void dispatch(fetchProducts());
            void dispatch(fetchCategoriesThunk());
          }}
        />
      ) : !category ? (
        <NotFoundCategory />
      ) : (
        <>
          {/* ---------- Cabecera con banner ---------- */}
          <header className="relative overflow-hidden border-b border-line">
            {banner && (
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
                style={{ backgroundImage: `url("${banner}")` }}
              />
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
            <div className="container-x relative py-14 sm:py-20">
              <Reveal>
                <Link
                  to="/catalogo"
                  className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-volt"
                >
                  <ArrowLeft size={16} /> Catálogo
                </Link>
                <h1 className="max-w-[16ch] text-display font-extrabold uppercase leading-[0.95] tracking-tight">
                  {category.nombre}
                </h1>
                {category.descripcion && (
                  <p className="mt-5 max-w-[46ch] text-lg text-muted">{category.descripcion}</p>
                )}
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  {count} {count === 1 ? 'producto' : 'productos'}
                  {zonas > 0 && ` · ${zonas} ${zonas === 1 ? 'zona' : 'zonas'}`}
                </p>
              </Reveal>
            </div>
          </header>

          {/* ---------- Sub-navegación de hijos ---------- */}
          {siblings.length > 0 && (
            <div className="border-b border-line">
              <div className="container-x py-4">
                <ChildChips
                  siblings={siblings}
                  activeSlug={slug}
                  parentSlug={chipParent?.slug ?? slug}
                  products={productList}
                />
              </div>
            </div>
          )}

          {/* ---------- Destacados de la zona (solo si vale la pena) ---------- */}
          {count > 8 && (
            <section className="py-12">
              <div className="container-x mb-7">
                <h2 className="text-title font-bold uppercase tracking-tight">Destacados de la zona</h2>
              </div>
              <FeaturedCarousel products={items.slice(0, 8)} />
            </section>
          )}

          {/* ---------- Grilla o estado vacío ---------- */}
          <section className="container-x py-12 sm:py-16">
            {count > 0 ? (
              <ProductGrid products={items} />
            ) : (
              <EmptyCategory category={category} categoryList={categoryList} products={productList} />
            )}
          </section>

          {/* ---------- Contenido editorial del ERP ---------- */}
          {category.contenido && (
            <section className="border-t border-line">
              <div className="container-x max-w-[64ch] py-14 sm:py-20">
                <RichText html={category.contenido} />
              </div>
            </section>
          )}
        </>
      )}
    </CatalogShell>
  );
}

/** Categoría sin productos: no dibujamos grilla vacía; ofrecemos rutas con stock. */
function EmptyCategory({
  category,
  categoryList,
  products,
}: {
  category: Cat;
  categoryList: Cat[];
  products: ReturnType<typeof productsInCategory>;
}) {
  const alternatives = categoriesWithStock(categoryList, products, category.slug).slice(0, 6);
  return (
    <div className="rounded-2xl border border-line bg-surface/40 px-6 py-14 text-center sm:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-volt">Muy pronto</p>
      <h2 className="mt-4 text-title font-bold">Estamos tejiendo esta línea</h2>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Todavía no hay productos publicados en {category.nombre}. Mientras tanto, estas zonas ya
        tienen stock:
      </p>
      {alternatives.length > 0 && (
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {alternatives.map((c) => (
            <Link
              key={c.id}
              to={`/catalogo/${c.slug}`}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-volt hover:text-volt"
            >
              {c.nombre}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryLoading() {
  return (
    <>
      <div className="border-b border-line">
        <div className="container-x py-14 sm:py-20">
          <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
          <div className="mt-6 h-12 w-64 animate-pulse rounded bg-surface" />
          <div className="mt-5 h-4 w-80 max-w-full animate-pulse rounded bg-surface-2" />
        </div>
      </div>
      <div className="container-x py-12 sm:py-16">
        <ProductGridSkeleton count={8} />
      </div>
    </>
  );
}

function NotFoundCategory() {
  return (
    <div className="container-x flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-volt">Sin ruta</p>
      <h1 className="mt-4 text-display font-extrabold uppercase">Categoría no encontrada</h1>
      <p className="mt-4 max-w-md text-muted">
        La categoría que buscas no existe o cambió de nombre.
      </p>
      <Link
        to="/catalogo"
        className="mt-8 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-volt-bright"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
