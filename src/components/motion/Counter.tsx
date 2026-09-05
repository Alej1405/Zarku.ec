import { useEffect, useRef } from 'react';
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from 'framer-motion';

interface CounterProps {
  /** valor crudo del ERP, ej. "500+" · "5+" · "24/7" */
  value: string;
  className?: string;
}

/**
 * Anima la parte numérica de un valor manteniendo su prefijo/sufijo
 * ("500+" cuenta 0→500 y conserva el "+"). Si no hay número, lo muestra tal cual.
 */
export function Counter({ value, className }: CounterProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const match = value.match(/^(\D*)(\d[\d.,]*)(.*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? Number(match[2].replace(/[.,]/g, '')) : NaN;
  const suffix = match?.[3] ?? '';

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;
    if (reduce) {
      count.set(target);
      return;
    }
    const controls = animate(count, target, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, target, reduce, count]);

  if (Number.isNaN(target)) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
