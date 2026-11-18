import { useEffect, useRef } from 'react';

/**
 * Na het nakijken: Enter = "Volgende", waar de cursor ook staat (goed of fout maakt niet uit).
 * Staat de focus op een knop of link, dan doet die knop het zelf (anders gaat het dubbel).
 */
export function useEnterToContinue(active: boolean, onNext: () => void) {
  const next = useRef(onNext);
  next.current = onNext;
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat || e.isComposing || e.defaultPrevented) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'TEXTAREA') return;
      e.preventDefault();
      next.current();
    };
    // Pas na déze toetsaanslag luisteren: de Enter van "Nakijken" telt niet ook als "Volgende".
    const id = window.setTimeout(() => window.addEventListener('keydown', onKey), 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);
}
