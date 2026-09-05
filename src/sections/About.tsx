import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { Reveal } from '@/components/motion/Reveal';
import { Counter } from '@/components/motion/Counter';

const FALLBACK_NUMEROS = [
  { valor: '500+', etiqueta: 'Productos vendidos' },
  { valor: '5+', etiqueta: 'Años en el mercado' },
];

interface Parsed {
  etymology: { term: string; meaning: string }[];
  prose: string[];
}

/** Extrae el par Kichwa (Samay - Espíritu / Urku - Montaña) del texto del ERP. */
function parseAbout(desc?: string | null): Parsed {
  if (!desc) return { etymology: [], prose: [] };
  const etymology: Parsed['etymology'] = [];
  const prose: string[] = [];
  for (const block of desc.split('\n\n')) {
    const lines = block.split('\n');
    const proseLines: string[] = [];
    for (const line of lines) {
      const m = line.match(/^([A-Za-zÁÉÍÓÚñ]+)\s*[-–—]\s*(.+)$/);
      if (m && m[1].length <= 12) etymology.push({ term: m[1], meaning: m[2] });
      else if (line.replace(/^Naming:\s*/i, '').trim()) {
        proseLines.push(line.replace(/^Naming:\s*/i, '').trim());
      }
    }
    if (proseLines.length) prose.push(proseLines.join(' '));
  }
  return { etymology, prose };
}

export function About() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const about = useAppSelector((s) => s.about.data);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

  const { etymology, prose } = parseAbout(about?.descripcion);
  const numeros = about?.numeros?.length ? about.numeros : FALLBACK_NUMEROS;
  const image =
    about?.imagen ?? 'https://erp.mashaec.net/storage/cms/about/01KWQDZ85EMJN2411BR2A5XT2X.jpg';

  return (
    <section id="nosotros" className="relative scroll-mt-20 py-24 sm:py-32">
      <div
        ref={ref}
        className="container-x relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]"
      >
        {/* Imagen enmarcada */}
        <Reveal className="relative order-2 lg:order-1">
          <motion.div
            style={{ y: imgY }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-[#1e1e1c]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px bottom-1/2 opacity-60 [background:radial-gradient(ellipse_at_50%_30%,color-mix(in_oklch,var(--color-volt)_14%,transparent),transparent_70%)]"
            />
            <img
              src={image}
              alt="Identidad de Zarku — el espíritu de la montaña"
              className="absolute inset-0 h-full w-full object-contain p-6"
              loading="lazy"
            />
            <span className="absolute left-5 top-5 h-6 w-6 border-l-2 border-t-2 border-volt" />
            <span className="absolute bottom-5 right-5 h-6 w-6 border-b-2 border-r-2 border-volt" />
            <p className="absolute bottom-5 left-5 font-mono text-[0.7rem] tracking-widest text-ink/90">
              EST. ECUADOR
            </p>
          </motion.div>
        </Reveal>

        {/* Texto */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <h2 className="text-display font-extrabold">
              {about?.titulo?.replace(/[¿?]/g, '').trim() || 'Qué es Zarku'}
            </h2>
          </Reveal>

          {etymology.length > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-3">
                {etymology.map((e) => (
                  <div
                    key={e.term}
                    className="rounded-xl border border-line bg-surface/60 px-5 py-4"
                  >
                    <span className="font-display text-xl font-bold text-volt">{e.term}</span>
                    <span className="ml-2 text-sm text-muted">— {e.meaning}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <div className="mt-8 space-y-4">
            {prose.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="max-w-[60ch] text-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          {/* Números */}
          <Reveal delay={0.1}>
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:max-w-md">
              {numeros.map((n) => (
                <div key={n.etiqueta}>
                  <dt className="sr-only">{n.etiqueta}</dt>
                  <dd>
                    <Counter
                      value={n.valor}
                      className="font-display text-4xl font-extrabold text-ink sm:text-5xl"
                    />
                    <span className="mt-1 block text-sm text-muted">{n.etiqueta.trim()}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
