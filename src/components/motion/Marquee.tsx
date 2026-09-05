import { type ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  /** segundos por vuelta */
  speed?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Cinta cinética infinita en CSS (independiente de JS; se pausa con
 * reduced-motion vía el media query global). Duplica el contenido para el loop.
 */
export function Marquee({ children, speed = 28, reverse = false, className = '' }: MarqueeProps) {
  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className="flex shrink-0 items-center gap-8 pr-8"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 items-center gap-8 pr-8"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
      </div>
    </div>
  );
}
