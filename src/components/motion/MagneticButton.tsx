import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const MotionLink = motion(Link);

interface MagneticButtonProps {
  children: ReactNode;
  /** Enlace externo o ancla (#seccion). Usa `to` para rutas internas. */
  href?: string;
  /** Ruta interna de react-router (navegación SPA, sin recarga). */
  to?: string;
  onClick?: () => void;
  variant?: 'volt' | 'ghost';
  className?: string;
  ariaLabel?: string;
}

/**
 * Botón/enlace con atracción magnética hacia el cursor.
 * Desactiva el efecto (pero mantiene el estilo) con reduced-motion o en táctil.
 */
export function MagneticButton({
  children,
  href,
  to,
  onClick,
  variant = 'volt',
  className = '',
  ariaLabel,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  function handleMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.28);
    y.set(relY * 0.32);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    'group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 will-change-transform';
  const styles =
    variant === 'volt'
      ? 'bg-volt text-bg hover:bg-volt-bright'
      : 'border border-line bg-transparent text-ink hover:border-volt hover:text-volt';

  const content = <span className="relative z-10 flex items-center gap-2.5">{children}</span>;

  const commonProps = {
    ref: ref as never,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onClick,
    style: { x: sx, y: sy },
    className: `${base} ${styles} ${className}`,
    'aria-label': ariaLabel,
  };

  if (to) {
    return (
      <MotionLink {...commonProps} to={to}>
        {content}
      </MotionLink>
    );
  }

  if (href) {
    const external = href.startsWith('http');
    return (
      <motion.a
        {...commonProps}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button {...commonProps} type="button">
      {content}
    </motion.button>
  );
}
