import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { useLogo } from '@/hooks/useLogo';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Marquee } from '@/components/motion/Marquee';
import { HeroTerrain } from '@/components/three/HeroTerrain';

const FALLBACK_HEADLINE = 'Creados para el movimiento. Diseñados para resistir.';
const FALLBACK_BODY =
  'En Zarku transformamos el rendimiento en estilo. Buffs, cuellos tubulares seamless, cintillos y gorros de lana con tejidos premium para tus aventuras.';

const KEYWORDS = [
  'BUFFS',
  'CUELLOS TUBULARES',
  'SEAMLESS',
  'PROTECCIÓN UV 50+',
  'CINTILLOS',
  'GORROS DE LANA',
  'SECADO RÁPIDO',
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: '110%' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const logo = useLogo();
  const ref = useRef<HTMLElement>(null);
  const hero = useAppSelector((s) => s.hero.data);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const iso = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const isoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // La descripción del ERP trae titular + cuerpo separados por doble salto.
  const parts = hero?.descripcion?.split('\n\n').map((p) => p.trim()) ?? [];
  const headline = parts[0] || FALLBACK_HEADLINE;
  const body = parts.slice(1).join(' ') || FALLBACK_BODY;
  const words = headline.split(' ');

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-28 pt-8 md:pb-0 md:pt-[68px]"
    >
      {/* Terreno topográfico WebGL */}
      <HeroTerrain />

      {/* Scrim para legibilidad del texto sobre el terreno */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] [background:linear-gradient(105deg,var(--color-bg)_0%,color-mix(in_oklch,var(--color-bg)_82%,transparent)_34%,transparent_60%),linear-gradient(to_top,var(--color-bg)_2%,transparent_38%)]"
      />

      {/* Isotipo de fondo con parallax + glow volt */}
      <motion.div
        aria-hidden
        style={{ y: iso, scale: isoScale }}
        className="pointer-events-none absolute -right-[12%] top-1/2 hidden -translate-y-1/2 md:block"
      >
        <div className="absolute inset-0 -z-10 rounded-full bg-volt/20 blur-[120px]" />
        <img
          src={logo}
          alt=""
          className="h-[min(78vh,720px)] w-auto opacity-90 [mask-image:radial-gradient(circle_at_center,black_60%,transparent_100%)]"
        />
      </motion.div>

      {/* Halo volt superior */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-volt/10 blur-[130px]"
      />

      <motion.div style={{ opacity: fade }} className="container-x relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="label-mono mb-7 flex items-center gap-3"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-volt" />
          Samay · Urku — el espíritu de la montaña
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-[16ch] text-hero font-extrabold uppercase leading-[0.95]"
        >
          {words.map((w, i) => (
            <span key={`${w}-${i}`} className="mr-[0.28em] inline-block overflow-hidden py-[0.05em]">
              <motion.span
                variants={word}
                className={`inline-block ${
                  /resistir|movimiento/i.test(w) ? 'text-volt' : 'text-ink'
                }`}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 max-w-[52ch] text-base text-muted sm:text-lg"
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton to="/catalogo" variant="volt">
            Explorar catálogo
            <ArrowUpRight size={17} />
          </MagneticButton>
          <MagneticButton href="#nosotros" variant="ghost">
            Conoce la marca
            <ArrowDown size={17} />
          </MagneticButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-14 font-mono text-xs tracking-widest text-muted/70"
        >
          QUITO · ECUADOR — 0°13′S 78°30′O
        </motion.p>
      </motion.div>

      {/* Marquee inferior */}
      <div className="relative z-10 mt-14 border-y border-line/60 py-4">
        <Marquee speed={30}>
          {KEYWORDS.map((k) => (
            <span key={k} className="flex items-center gap-8">
              <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink/80">
                {k}
              </span>
              <span className="text-volt">✳</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
