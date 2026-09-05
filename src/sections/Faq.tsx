import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Reveal } from '@/components/motion/Reveal';
import { SectionError } from '@/components/layout/SectionError';
import { fetchFaq } from '@/store/slices/faqSlice';

export function Faq() {
  const dispatch = useAppDispatch();
  const faqs = useAppSelector((s) => s.faq.data) ?? [];
  const status = useAppSelector((s) => s.faq.status);
  const error = useAppSelector((s) => s.faq.error);
  const [open, setOpen] = useState<number | null>(0);

  if (status === 'failed') {
    return (
      <section id="faq" className="scroll-mt-20 py-24 sm:py-32">
        <SectionError message={error} onRetry={() => void dispatch(fetchFaq())} />
      </section>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="text-display font-extrabold">
              Todo lo que <span className="text-volt">necesitas saber.</span>
            </h2>
            <p className="mt-5 max-w-[34ch] text-muted">
              Envíos, cuidado del producto y todo lo que preguntan antes de comprar.
            </p>
          </Reveal>
        </div>

        <ul className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${f.id}`;
            const btnId = `faq-btn-${f.id}`;
            return (
              <Reveal as="li" key={f.id} delay={Math.min(i * 0.04, 0.2)}>
                <div className="border-b border-line">
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-lg font-semibold text-ink sm:text-xl">{f.pregunta}</span>
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                          isOpen ? 'border-volt bg-volt text-bg' : 'border-line text-muted'
                        }`}
                      >
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <Plus size={18} />
                        </motion.span>
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[65ch] whitespace-pre-line pb-7 pr-12 text-muted">
                          {f.respuesta}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
