import type { Product } from '@/schemas/ecommerce';
import { ProductCard, ProductCardSkeleton } from '@/components/catalog/ProductCard';

/**
 * Grilla de productos sin breakpoints (`auto-fit`). Deliberadamente sin
 * animación por celda: el catálogo se escanea, y animar cada celda que el ojo
 * recorre estorba (ver CATALOG.md, MOTION_INTENSITY bajo).
 */
const GRID = 'grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-x-5 gap-y-9 sm:gap-y-11';

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={GRID}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
