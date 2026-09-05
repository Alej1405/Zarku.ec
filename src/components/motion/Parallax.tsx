import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: ReactNode;
  /** Desplazamiento en px a lo largo del recorrido (positivo = sube al hacer scroll). */
  amount?: number;
  className?: string;
}

/** Envuelve contenido con un desplazamiento vertical ligado al scroll (profundidad). */
export function Parallax({ children, amount = 80, className }: ParallaxProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [amount, -amount]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
