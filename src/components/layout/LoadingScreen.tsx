import { motion, useReducedMotion } from 'framer-motion';
import { useLogo } from '@/hooks/useLogo';

/**
 * Pantalla de carga de marca: isotipo con anillo de pulso volt mientras
 * se asientan los datos del ERP. Se desmonta con un fade (AnimatePresence en App).
 */
export function LoadingScreen() {
  const reduce = useReducedMotion();
  const logo = useLogo();

  return (
    <motion.div
      className="grain fixed inset-0 z-[var(--z-modal)] flex flex-col items-center justify-center bg-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/10 blur-[120px]"
      />

      <div className="relative grid place-items-center">
        {/* Anillos de pulso */}
        {!reduce && (
          <>
            <span
              className="absolute h-24 w-24 rounded-full border border-volt/40"
              style={{ animation: 'pulse-ring 2s ease-out infinite' }}
            />
            <span
              className="absolute h-24 w-24 rounded-full border border-volt/40"
              style={{ animation: 'pulse-ring 2s ease-out infinite', animationDelay: '1s' }}
            />
          </>
        )}

        <motion.img
          src={logo}
          alt="Cargando Zarku"
          className="relative h-20 w-20 rounded-2xl"
          animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <img src="/brand/logo_blanco.png" alt="" className="h-4 w-auto opacity-80" />
        <div className="h-px w-40 overflow-hidden bg-line">
          {!reduce && (
            <motion.div
              className="h-full w-1/3 bg-volt"
              animate={{ x: ['-120%', '360%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>
        <p className="label-mono !text-[0.65rem]">El espíritu de tu pasión</p>
      </div>
    </motion.div>
  );
}
