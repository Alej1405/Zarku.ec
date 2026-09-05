import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CatalogShell } from '@/components/catalog/CatalogShell';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página no encontrada — Zarku';
  }, []);

  return (
    <CatalogShell>
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-volt">Error 404</p>
        <h1 className="mt-4 text-hero font-extrabold uppercase leading-[0.92]">Fuera de ruta</h1>
        <p className="mt-5 max-w-md text-muted">
          La página que buscas no existe. Volvamos al mapa.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-volt px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-volt-bright"
          >
            Ir al inicio
          </Link>
          <Link
            to="/catalogo"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-volt hover:text-volt"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </CatalogShell>
  );
}
