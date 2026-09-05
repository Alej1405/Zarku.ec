import { ArrowUpRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { TopoLines } from '@/components/motion/TopoLines';
import { SectionError } from '@/components/layout/SectionError';
import { fetchServices } from '@/store/slices/servicesSlice';
import type { Service } from '@/schemas/cms';

const FALLBACK: Service[] = [
  {
    id: 1,
    titulo: 'Tecnología Sin Costuras (Seamless)',
    descripcion:
      'Cuellos tubulares en una sola pieza con tecnología tubular continua: comodidad absoluta y ajuste como una segunda piel, sin rozaduras.',
    caracteristicas: [],
    icono: '🚫',
    imagen: null,
  },
  {
    id: 2,
    titulo: 'Máxima Transpirabilidad y Secado Rápido',
    descripcion:
      'Microfibra de alta tecnología que expulsa la humedad hacia el exterior. Te mantiene fresco y seco en los entrenamientos más intensos.',
    caracteristicas: [],
    icono: '💨',
    imagen: null,
  },
  {
    id: 3,
    titulo: 'Protección UV Avanzada',
    descripcion:
      'Protección solar integrada para rostro, cuello y cabeza durante tus rutas de ciclismo, senderismo o running al aire libre.',
    caracteristicas: [],
    icono: '☀️',
    imagen: null,
  },
];

export function Services() {
  const dispatch = useAppDispatch();
  const services = useAppSelector((s) => s.services.data);
  const status = useAppSelector((s) => s.services.status);
  const error = useAppSelector((s) => s.services.error);
  const list = services?.length ? services : FALLBACK;

  if (status === 'failed' && !services?.length) {
    return (
      <section id="servicios" className="scroll-mt-20 py-24 sm:py-32">
        <SectionError message={error} onRetry={() => void dispatch(fetchServices())} />
      </section>
    );
  }

  return (
    <section id="servicios" className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32">
      <Parallax
        amount={120}
        className="pointer-events-none absolute -left-[18%] top-0 -z-10 h-full w-[55%] opacity-60 [mask-image:radial-gradient(circle_at_40%_40%,black,transparent_70%)]"
      >
        <TopoLines className="h-full w-full" rings={8} />
      </Parallax>

      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Encabezado sticky */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="label-mono mb-5 flex items-center gap-2">
                <span className="text-volt">{String(list.length).padStart(2, '0')}</span>
                capacidades técnicas
              </p>
              <h2 className="text-display font-extrabold">
                Ingeniería que <span className="text-volt">resiste tu ritmo.</span>
              </h2>
              <p className="mt-6 max-w-[42ch] text-muted">
                Cada prenda Zarku se fabrica con materiales que rinden en clima agreste. No es moda:
                es rendimiento medible.
              </p>
            </Reveal>
          </div>

          {/* Lista tipo spec-sheet */}
          <ul className="border-t border-line">
            {list.map((s, i) => (
              <Reveal as="li" key={s.id} delay={Math.min(i * 0.05, 0.3)}>
                <article className="group relative grid grid-cols-[auto_1fr] items-start gap-5 border-b border-line py-7 transition-colors duration-300 sm:grid-cols-[auto_1fr_auto] sm:gap-7 sm:py-8">
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 scale-[0.98] rounded-xl bg-surface/0 transition-all duration-300 group-hover:scale-100 group-hover:bg-surface/60"
                  />
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface text-2xl transition-colors duration-300 group-hover:border-volt/50 sm:h-14 sm:w-14"
                    aria-hidden
                  >
                    {s.icono || '✳'}
                  </span>
                  <div>
                    <h3 className="text-title font-bold leading-tight text-ink">{s.titulo}</h3>
                    <p className="mt-2 max-w-[58ch] text-sm text-muted sm:text-base">
                      {s.descripcion}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center gap-4 self-center pl-[4.25rem] sm:col-span-1 sm:pl-1">
                    <span className="hidden font-mono text-xs text-muted/60 sm:block">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="translate-x-0 text-muted/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-volt"
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
