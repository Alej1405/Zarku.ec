import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useLenis } from '@/hooks/useLenis';
import { fetchHero } from '@/store/slices/heroSlice';
import { fetchAbout } from '@/store/slices/aboutSlice';
import { fetchServices } from '@/store/slices/servicesSlice';
import { fetchFaq } from '@/store/slices/faqSlice';
import { fetchContact } from '@/store/slices/contactSlice';
import { fetchProducts } from '@/store/slices/productsSlice';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Manifesto } from '@/sections/Manifesto';
import { Services } from '@/sections/Services';
import { ProductTeaser } from '@/sections/ProductTeaser';
import { Faq } from '@/sections/Faq';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const SECTION_IDS = ['inicio', 'nosotros', 'servicios', 'faq', 'contacto'];

export function Home() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  useLenis();
  useScrollSpy(SECTION_IDS);

  const [minElapsed, setMinElapsed] = useState(false);
  const settled = useAppSelector((s) =>
    [s.hero.status, s.about.status, s.services.status, s.faq.status, s.contact.status].every(
      (st) => st === 'succeeded' || st === 'failed',
    ),
  );
  const loading = !settled || !minElapsed;

  useEffect(() => {
    void dispatch(fetchHero());
    void dispatch(fetchAbout());
    void dispatch(fetchServices());
    void dispatch(fetchFaq());
    void dispatch(fetchContact());
    // Productos para la vitrina; no bloquea el loader (no entra en `settled`).
    void dispatch(fetchProducts());
  }, [dispatch]);

  // Tiempo mínimo de exhibición para evitar el parpadeo del loader.
  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 750);
    return () => clearTimeout(t);
  }, []);

  // Bloquea el scroll mientras carga.
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  // Si llegamos con un hash (ej. desde el catálogo: /#nosotros), saltamos a
  // la sección una vez que el contenido está montado y el loader se fue.
  const scrolledToHash = useRef(false);
  useEffect(() => {
    if (loading || scrolledToHash.current) return;
    const id = location.hash.replace('#', '');
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      scrolledToHash.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading, location.hash]);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen key="loader" />}</AnimatePresence>
      <ScrollProgress />
      <a
        href="#nosotros"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-modal)] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="inicio">
        <Hero />
        <ProductTeaser />
        <About />
        <Manifesto />
        <Services />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
