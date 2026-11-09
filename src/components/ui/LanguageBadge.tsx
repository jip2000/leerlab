import { getLanguage, languageTag, type LanguageCode } from '@/data/languages';
import { cn } from '@/lib/cn';

/** Gekleurd blokje met de taalcode (bijv. FR). Werkt ook waar vlag-emoji's niet goed tonen. */
export function LanguageBadge({ code, className }: { code: LanguageCode; className?: string }) {
  const lang = getLanguage(code);
  return (
    <span
      aria-hidden="true"
      className={cn('inline-grid h-9 min-w-9 place-items-center rounded-[10px] px-1.5 text-xs font-extrabold tracking-wide text-white', className)}
      style={{ backgroundColor: lang.color }}
    >
      {languageTag(code)}
    </span>
  );
}
