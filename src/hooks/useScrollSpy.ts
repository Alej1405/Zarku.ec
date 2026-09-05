import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { setActiveSection } from '@/store/slices/uiSlice';

/**
 * Observa las secciones y marca la activa en el store (para el navbar).
 * Usa IntersectionObserver — barato y sin listeners de scroll.
 */
export function useScrollSpy(ids: string[]) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) dispatch(setActiveSection(visible.target.id));
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids, dispatch]);
}
