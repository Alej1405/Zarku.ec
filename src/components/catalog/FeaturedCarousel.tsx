import { useCallback, useRef, useState } from 'react';
import type { Product } from '@/schemas/ecommerce';
import { ProductCard } from '@/components/catalog/ProductCard';

/**
 * Carrusel de destacados. Sin autoplay: el movimiento lo pone la persona
 * (arrastre por puntero + scroll-snap nativo + teclado por foco de tarjeta).
 * El track se sale por la derecha hasta el borde del viewport para comunicar
 * "hay más" sin escribirlo. El progreso es una hairline volt ligada al scroll.
 */
export function FeaturedCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef<{ active: boolean; startX: number; startScroll: number; moved: boolean }>({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    // Solo arrastre con puntero fino (mouse/trackpad); el táctil ya scrollea.
    if (e.pointerType === 'touch') return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  // Si el pointerup viene de un arrastre real, cancelamos el click que dispara
  // el enlace de la tarjeta (para no navegar al soltar tras arrastrar).
  const onClickCapture = (e: React.MouseEvent<HTMLUListElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="select-none">
      {/* El track vive en .container-x para alinear su inicio con el heading,
          y sangra a la derecha con margen negativo para el efecto "hay más". */}
      <div className="container-x">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onClickCapture}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 pr-6 sm:gap-5"
          style={{ cursor: 'grab', marginRight: 'calc(-1 * clamp(1.25rem, 5vw, 4rem))' }}
        >
          {products.map((p) => (
            <li key={p.id} className="w-[76%] shrink-0 snap-start sm:w-[17rem] md:w-[18.5rem]">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>

      {/* Progreso: hairline que se llena con el scroll del track */}
      <div className="container-x mt-6">
        <div className="h-px w-full bg-line">
          <div
            className="h-px origin-left bg-volt transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${Math.max(0.04, progress)})` }}
          />
        </div>
      </div>
    </div>
  );
}
