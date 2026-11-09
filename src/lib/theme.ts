import { useEffect } from 'react';
import { useSettings, type ThemeChoice } from './settings';

export function resolveTheme(choice: ThemeChoice, systemDark: boolean): 'light' | 'dark' {
  if (choice === 'licht') return 'light';
  if (choice === 'donker') return 'dark';
  return systemDark ? 'dark' : 'light';
}

/** Houdt <html data-theme> gelijk aan de instelling en aan het systeem. */
export function useApplyTheme() {
  const thema = useSettings((s) => s.thema);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const resolved = resolveTheme(thema, mq.matches);
      document.documentElement.dataset.theme = resolved;
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
        m.setAttribute('content', resolved === 'dark' ? '#0C1714' : '#F2F7F4');
        m.removeAttribute('media');
      });
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [thema]);
}
