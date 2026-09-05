import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useLenis } from '@/hooks/useLenis';
import { fetchContact } from '@/store/slices/contactSlice';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchCategoriesThunk } from '@/store/slices/categoriesSlice';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

/**
 * Cascarón de las páginas del catálogo: Navbar + contenido + Footer, con
 * smooth-scroll y datos garantizados. Dispara los recursos solo si están
 * `idle`, así navegar entre catálogo y home no vuelve a pedir nada.
 */
export function CatalogShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  useLenis();

  const contactStatus = useAppSelector((s) => s.contact.status);
  const productsStatus = useAppSelector((s) => s.products.status);
  const categoriesStatus = useAppSelector((s) => s.categories.status);

  useEffect(() => {
    if (contactStatus === 'idle') void dispatch(fetchContact());
    if (productsStatus === 'idle') void dispatch(fetchProducts());
    if (categoriesStatus === 'idle') void dispatch(fetchCategoriesThunk());
  }, [dispatch, contactStatus, productsStatus, categoriesStatus]);

  // Cada ruta nueva empieza arriba.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <>
      <ScrollProgress />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-modal)] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="min-h-screen pt-[68px] md:pt-[92px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
