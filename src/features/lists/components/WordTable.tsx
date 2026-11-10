import type { LanguageCode } from '@/data/languages';
import { SpeakButton } from '@/components/ui/SpeakButton';
import { withArticle } from '@/data/starter';
import { WordImage } from '@/components/ui/WordImage';

export interface WordRow {
  left: string;
  right: string;
  article?: string;
  extraForms?: string;
  example?: string;
  note?: string;
  imageId?: string;
}

/** Woorden netjes onder elkaar, met luisterknoppen. */
export function WordTable({ words, langLeft, langRight }: { words: WordRow[]; langLeft: LanguageCode; langRight: LanguageCode }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      {words.map((w, i) => {
        const left = withArticle(w.left, w.article);
        return (
          <li key={i} className="grid grid-cols-[1fr_1fr] gap-x-3 px-3 py-2 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              {w.imageId && <WordImage id={w.imageId} className="h-10 w-10 shrink-0" alt="" />}
              <span className="min-w-0 font-semibold break-words" lang={langLeft}>
                {left}
              </span>
              <SpeakButton text={left} lang={langLeft} className="ml-auto" />
            </div>
            <div className="flex min-w-0 items-center gap-1 border-l border-line pl-3">
              <span className="min-w-0 break-words" lang={langRight}>
                {w.right}
              </span>
              <SpeakButton text={w.right} lang={langRight} className="ml-auto" />
            </div>
            {(w.extraForms || w.example || w.note) && (
              <div className="col-span-2 pb-1 text-sm text-ink-soft">
                {w.extraForms && <p>{w.extraForms}</p>}
                {w.example && (
                  <p className="italic" lang={langLeft}>
                    {w.example}
                  </p>
                )}
                {w.note && <p>💡 {w.note}</p>}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
