import { Volume2 } from 'lucide-react';
import type { LanguageCode } from '@/data/languages';
import { canSpeak, speak } from '@/lib/speech';
import { cn } from '@/lib/cn';

/** Luisterknop: leest de tekst voor in de juiste taal. */
export function SpeakButton({ text, lang, className }: { text: string; lang: LanguageCode; className?: string }) {
  if (!canSpeak(lang)) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text, lang)}
      aria-label={`Luister: ${text}`}
      className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface-2 hover:text-primary-ink', className)}
    >
      <Volume2 size={19} />
    </button>
  );
}
