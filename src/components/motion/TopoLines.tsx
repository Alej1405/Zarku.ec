import { useMemo } from 'react';

interface TopoLinesProps {
  className?: string;
  /** número de contornos concéntricos */
  rings?: number;
}

/**
 * Curvas de nivel topográficas (contornos concéntricos irregulares), como un
 * mapa de elevación de montaña. Generadas con armónicos deterministas → SVG.
 */
export function TopoLines({ className = '', rings = 9 }: TopoLinesProps) {
  const paths = useMemo(() => {
    const cx = 300;
    const cy = 300;
    const steps = 120;
    // Perturbación radial con varios armónicos (silueta irregular estable).
    const harmonics = [
      { k: 3, amp: 26, phase: 0.6 },
      { k: 5, amp: 14, phase: 2.1 },
      { k: 7, amp: 9, phase: 4.2 },
    ];
    const out: string[] = [];
    for (let r = 0; r < rings; r++) {
      const base = 24 + r * 30;
      let d = '';
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        let rad = base;
        for (const h of harmonics) {
          rad += Math.sin(a * h.k + h.phase + r * 0.35) * h.amp * (1 - r / (rings * 2.2));
        }
        const x = cx + Math.cos(a) * rad;
        const y = cy + Math.sin(a) * rad * 0.82;
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      out.push(d + 'Z');
    }
    return out;
  }, [rings]);

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="var(--color-volt)"
          strokeWidth={1}
          strokeOpacity={0.14 + (i / paths.length) * 0.16}
        />
      ))}
    </svg>
  );
}
