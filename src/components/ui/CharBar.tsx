import { useState } from 'react';
import { ArrowBigUp } from 'lucide-react';
import { getLanguage, type LanguageCode } from '@/data/languages';
import { cn } from '@/lib/cn';

interface Props {
  lang: LanguageCode;
  onPick: (char: string) => void;
  className?: string;
}

/** Knoppenbalk met speciale tekens (é, ß, ñ …) voor de taal waarin je typt. */
export function CharBar({ lang, onPick, className }: Props) {
  const [upper, setUpper] = useState(false);
  const chars = getLanguage(lang).specialChars;
  if (chars.length === 0) return null;
  const show = (c: string) => (upper ? c.toLocaleUpperCase(lang) : c);
  return (
    <div
      role="toolbar"
      aria-label={`Speciale tekens ${getLanguage(lang).name}`}
      className={cn('flex gap-1 overflow-x-auto py-1', className)}
    >
      <button
        type="button"
        aria-pressed={upper}
        aria-label="Hoofdletters"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setUpper((u) => !u)}
        className={cn(
          'grid h-11 w-11 shrink-0 place-items-center rounded-xl border',
          upper ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line bg-surface text-ink-soft',
        )}
      >
        <ArrowBigUp size={20} />
      </button>
      {chars.map((c) => (
        <button
          key={c}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick(show(c))}
          className="h-11 min-w-11 shrink-0 rounded-xl border border-line bg-surface px-2 text-lg font-semibold hover:bg-surface-2"
        >
          {show(c)}
        </button>
      ))}
    </div>
  );
}
