import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from '@/pages/Home';

// Las páginas del catálogo cargan bajo demanda: no lastran el bundle inicial
// de la Home (que ya arrastra Three.js).
const Catalog = lazy(() => import('@/pages/Catalog'));
const Category = lazy(() => import('@/pages/Category'));
const Product = lazy(() => import('@/pages/Product'));
const Blog = lazy(() => import('@/pages/Blog'));
const Article = lazy(() => import('@/pages/Article'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// `appBooted` es false hasta que la SPA monta una vez (se marca en un efecto de
// App). Un full-load reinicia el módulo → false; una navegación interna → true.
// Así "entrar a zarku.ec" desde un móvil abre el catálogo, pero tocar "Inicio"
// dentro de la SPA sí muestra la Home. El inicializador solo LEE (es puro).
let appBooted = false;

function IndexRoute() {
  const [redirectToCatalog] = useState(() => {
    if (appBooted) return false;
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });

  if (redirectToCatalog) return <Navigate to="/catalogo" replace />;
  return <Home />;
}

export function App() {
  useEffect(() => {
    appBooted = true;
  }, []);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<IndexRoute />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/catalogo/:slug" element={<Category />} />
        <Route path="/producto/:slug" element={<Product />} />
        <Route path="/noticias" element={<Blog />} />
        <Route path="/noticias/:slug" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
