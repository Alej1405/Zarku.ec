import { type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  as?: 'div' | 'span' | 'li' | 'section';
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Realza un contenido ya visible con una entrada al hacer scroll.
 * Con reduced-motion, renderiza sin transform (solo un crossfade mínimo).
 */
export function Reveal({ children, as = 'div', delay = 0, y = 24, className }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y, filter: reduce ? 'blur(0px)' : 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </MotionTag>
  );
}
