import type { Category, Product } from '@/schemas/ecommerce';

/**
 * Derivaciones del catálogo en cliente. Toda la lógica que compensa las
 * trampas de la API vive aquí, para que las páginas queden declarativas:
 *  - la API filtra por categoría EXACTA (buffs padre → 0 productos), así que
 *    la agregación de hijos la hacemos nosotros;
 *  - `products/featured` viene vacío hoy, así que hay un fallback;
 *  - `related` se deriva de la misma categoría sin pedir otro endpoint.
 */

/** El slug de la categoría hoja a la que pertenece un producto. */
export function productCategorySlug(product: Product): string | null {
  return product.store_category?.slug ?? null;
}

/** Recorre el árbol (padres + hijos) y devuelve la categoría con ese slug. */
export function findCategory(categories: Category[], slug: string): Category | null {
  for (const cat of categories) {
    if (cat.slug === slug) return cat;
    const child = cat.children.find((c) => c.slug === slug);
    if (child) return child;
  }
  return null;
}

/** El padre de una categoría hoja (o null si ya es padre / no se encuentra). */
export function findParent(categories: Category[], slug: string): Category | null {
  for (const cat of categories) {
    if (cat.children.some((c) => c.slug === slug)) return cat;
  }
  return null;
}

/** Slugs que cuentan para una categoría: ella misma + sus descendientes. */
export function categoryFilterSlugs(category: Category): string[] {
  return [category.slug, ...category.children.map((c) => c.slug)];
}

/**
 * Productos de una categoría, AGREGANDO los de sus hijos.
 * Es obligatorio: `?category=buffs` devuelve 0 aunque sus hijos tengan stock.
 */
export function productsInCategory(products: Product[], category: Category): Product[] {
  const slugs = new Set(categoryFilterSlugs(category));
  return products.filter((p) => {
    const s = productCategorySlug(p);
    return s !== null && slugs.has(s);
  });
}

/** Conteo real (agregado) de productos de una categoría. */
export function productCount(products: Product[], category: Category): number {
  return productsInCategory(products, category).length;
}

/**
 * Destacados para el carrusel. Usa los marcados `destacado`; si no hay
 * ninguno (el caso de hoy), cae a los primeros `limit` productos para que
 * la sección nunca salga vacía por descuido.
 */
export function featuredProducts(products: Product[], limit = 8): Product[] {
  const flagged = products.filter((p) => p.destacado);
  const base = flagged.length > 0 ? flagged : products;
  return base.slice(0, limit);
}

/** N productos al azar (Fisher–Yates sobre una copia). Para vitrinas rotativas. */
export function randomProducts(products: Product[], n = 5): Product[] {
  const copy = [...products];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/** Relacionados: misma categoría hoja, excluyendo el propio producto. */
export function relatedProducts(products: Product[], product: Product, limit = 6): Product[] {
  const slug = productCategorySlug(product);
  if (!slug) return [];
  return products
    .filter((p) => p.id !== product.id && productCategorySlug(p) === slug)
    .slice(0, limit);
}

/** Busca un producto por slug en la lista ya cargada. */
export function findProduct(products: Product[], slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null;
}

/**
 * Categorías (padre o hijo) que HOY tienen stock, para los estados vacíos:
 * cuando una categoría no tiene productos, ofrecemos rutas que sí llevan a algo.
 */
export function categoriesWithStock(
  categories: Category[],
  products: Product[],
  excludeSlug?: string,
): Category[] {
  const out: Category[] = [];
  for (const parent of categories) {
    if (parent.slug === excludeSlug) continue;
    // Si el padre ya tiene stock (agregando hijos), lo mostramos a él y no
    // repetimos sus hijos; así evitamos "Buffs" y "Buffs Animales" juntos.
    if (productCount(products, parent) > 0) {
      out.push(parent);
      continue;
    }
    for (const child of parent.children) {
      if (child.slug === excludeSlug) continue;
      if (productCount(products, child) > 0) out.push(child);
    }
  }
  return out;
}
