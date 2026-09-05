import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, MessageCircle, Mountain } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts } from '@/store/slices/productsSlice';
import { CatalogShell } from '@/components/catalog/CatalogShell';
import { SectionError } from '@/components/layout/SectionError';
import { FeaturedCarousel } from '@/components/catalog/FeaturedCarousel';
import { RichText } from '@/components/catalog/RichText';
import { ProductGridSkeleton } from '@/components/catalog/ProductGrid';
import { formatPrice, productImages } from '@/lib/media';
import { whatsappLink } from '@/lib/format';
import { findProduct, relatedProducts } from '@/lib/catalog';
import type { Product as Prod } from '@/schemas/ecommerce';

function Gallery({ product }: { product: Prod }) {
  const images = productImages(product);
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-[4/5] w-full place-items-center rounded-2xl border border-line bg-surface text-line">
        <Mountain size={56} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <ul className="no-scrollbar flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
          {images.map((src, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={i === active ? 'true' : undefined}
                className={`block h-20 w-16 overflow-hidden rounded-lg border transition-colors sm:h-[5.5rem] sm:w-[4.5rem] ${
                  i === active ? 'border-volt' : 'border-line hover:border-volt/50'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-line bg-surface">
        <img
          src={images[active]}
          alt={product.nombre}
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
    </div>
  );
}

export default function Product() {
  const { slug = '' } = useParams();
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.products);
  const contact = useAppSelector((s) => s.contact.data);

  const loading = products.status === 'idle' || products.status === 'loading';
  const failed = products.status === 'failed';
  const productList = products.data ?? [];
  const product = findProduct(productList, slug);

  useEffect(() => {
    document.title = product ? `${product.nombre} — Zarku` : 'Producto — Zarku';
  }, [product]);

  const related = product ? relatedProducts(productList, product) : [];
  const price = product ? formatPrice(product.precio_venta) : '';
  const waPhone = contact?.whatsapp ?? contact?.telefono;
  const waLink = product
    ? whatsappLink(waPhone, `Hola Zarku, quiero pedir: ${product.nombre} (${price}) 🏔️`)
    : '#';

  return (
    <CatalogShell>
      {loading ? (
        <ProductLoading />
      ) : failed ? (
        <SectionError message={products.error} onRetry={() => void dispatch(fetchProducts())} />
      ) : !product ? (
        <NotFoundProduct />
      ) : (
        <>
          <article className="container-x py-10 sm:py-14">
            <Link
              to={product.store_category ? `/catalogo/${product.store_category.slug}` : '/catalogo'}
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-volt"
            >
              <ArrowLeft size={16} />
              {product.store_category?.nombre?.trim() || 'Catálogo'}
            </Link>

            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              <Gallery product={product} />

              {/* Panel sticky */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h1 className="text-display font-extrabold uppercase leading-[0.98] tracking-tight">
                  {product.nombre}
                </h1>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-medium tabular-nums text-volt sm:text-4xl">
                    {price}
                  </span>
                  <span className="text-sm text-muted">IVA incluido</span>
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-volt px-6 py-4 text-base font-semibold text-bg transition-colors hover:bg-volt-bright"
                >
                  <MessageCircle size={20} />
                  Pedir por WhatsApp
                </a>
                <p className="mt-3 text-center text-xs text-muted">
                  Te respondemos con formas de pago y envío a todo el Ecuador.
                </p>

                {product.caracteristicas.length > 0 && (
                  <ul className="mt-9 grid gap-x-6 gap-y-3 border-t border-line pt-8 sm:grid-cols-2">
                    {product.caracteristicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
                        <Check size={16} className="mt-0.5 shrink-0 text-volt" />
                        <span>{c.texto}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {product.descripcion && (
                  <div className="mt-9 border-t border-line pt-8">
                    <RichText html={product.descripcion} />
                  </div>
                )}
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <section className="border-t border-line py-14 sm:py-20">
              <div className="container-x mb-8">
                <h2 className="text-title font-bold uppercase tracking-tight">También te sirve</h2>
              </div>
              <FeaturedCarousel products={related} />
            </section>
          )}
        </>
      )}
    </CatalogShell>
  );
}

function ProductLoading() {
  return (
    <div className="container-x py-10 sm:py-14">
      <div className="h-4 w-28 animate-pulse rounded bg-surface-2" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div className="aspect-[4/5] animate-pulse rounded-2xl border border-line bg-surface" />
        <div>
          <div className="h-10 w-3/4 animate-pulse rounded bg-surface" />
          <div className="mt-6 h-9 w-32 animate-pulse rounded bg-surface-2" />
          <div className="mt-8 h-14 w-full animate-pulse rounded-full bg-surface" />
        </div>
      </div>
      <div className="mt-16">
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}

function NotFoundProduct() {
  return (
    <div className="container-x flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-volt">Sin rastro</p>
      <h1 className="mt-4 text-display font-extrabold uppercase">Producto no encontrado</h1>
      <p className="mt-4 max-w-md text-muted">
        Este producto no existe o ya no está disponible.
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
