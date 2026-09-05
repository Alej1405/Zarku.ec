import { motion, useScroll, useSpring } from 'framer-motion';

/** Barra de progreso de scroll (volt) fija en el borde superior. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[var(--z-overlay)] h-[3px] origin-left bg-volt"
    />
  );
}
