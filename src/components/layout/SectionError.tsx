import { RotateCw, TriangleAlert } from 'lucide-react';

interface SectionErrorProps {
  title?: string;
  message?: string | null;
  onRetry: () => void;
}

/**
 * Estado de error por sección: cuando un endpoint del ERP falla, en vez de
 * desaparecer en silencio mostramos un aviso claro con reintento.
 */
export function SectionError({ title = 'No pudimos cargar esta sección', message, onRetry }: SectionErrorProps) {
  return (
    <div className="container-x py-20">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-line bg-surface/50 px-8 py-12 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-volt">
          <TriangleAlert size={22} />
        </span>
        <h3 className="mt-5 text-title font-bold">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          {message || 'Revisa tu conexión e inténtalo de nuevo.'}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-volt-bright"
        >
          <RotateCw size={16} />
          Reintentar
        </button>
      </div>
    </div>
  );
}
