import { useEffect } from 'react';

/**
 * Zet <html data-typing> zolang er een tekstveld actief is. Op mobiel is dan het
 * toetsenbord open; de CSS verbergt dan de tabbalk zodat die de invoer niet bedekt.
 * Het terugzetten gebeurt met een korte vertraging, zodat een tik op een knop
 * niet "wegspringt" doordat de tabbalk precies dan terugkomt.
 */
export function useTypingAttribute() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const isText = (el: EventTarget | null) =>
      el instanceof HTMLTextAreaElement ||
      (el instanceof HTMLInputElement && !['checkbox', 'radio', 'button', 'submit', 'file', 'range', 'color'].includes(el.type));
    const onIn = (e: FocusEvent) => {
      // Alleen bij een tekstveld direct reageren; anders ruimt de (vertraagde) focusout het op.
      if (isText(e.target)) {
        clearTimeout(timer);
        root.dataset.typing = '';
      }
    };
    const onOut = () => {
      clearTimeout(timer);
      timer = setTimeout(() => delete root.dataset.typing, 250);
    };
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);
}
