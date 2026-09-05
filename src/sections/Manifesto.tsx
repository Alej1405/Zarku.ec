import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { TopoLines } from '@/components/motion/TopoLines';

const LINE = 'Más que ropa: somos tus compañeros de viaje hacia';

export function Manifesto() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ghostX = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['12%', '-18%']);
  const topoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);
  const topoRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-8, 8]);

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[85vh] items-center overflow-hidden py-28"
    >
      {/* Palabra fantasma en parallax */}
      <motion.span
        aria-hidden
        style={{ x: ghostX }}
        className="pointer-events-none absolute left-0 top-1/2 -z-10 -translate-y-1/2 select-none whitespace-nowrap font-display text-[26vw] font-black uppercase leading-none text-transparent [-webkit-text-stroke:1px_color-mix(in_oklch,var(--color-volt)_22%,transparent)]"
      >
        Urku
      </motion.span>

      {/* Contornos topográficos en parallax */}
      <motion.div
        aria-hidden
        style={{ y: topoY, rotate: topoRot }}
        className="pointer-events-none absolute -right-[10%] top-1/2 -z-10 h-[130%] w-[60%] -translate-y-1/2 [mask-image:radial-gradient(circle_at_center,black_50%,transparent_78%)]"
      >
        <TopoLines className="h-full w-full" rings={11} />
      </motion.div>

      <div className="container-x relative z-10">
        <Reveal>
          <p className="label-mono mb-8 flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-volt" />
            Manifiesto
          </p>
        </Reveal>

        <Parallax amount={40}>
          <h2 className="max-w-[20ch] text-display font-extrabold leading-[1.05]">
            {LINE}{' '}
            <span className="text-volt">cada cumbre.</span>
          </h2>
        </Parallax>

        <Reveal delay={0.15}>
          <p className="mt-10 max-w-[52ch] text-lg text-muted">
            Abrigamos tu espíritu en los climas más agrestes de la naturaleza y somos la comodidad
            en cada paso hacia tus objetivos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
