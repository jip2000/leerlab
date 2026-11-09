import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { LanguageBadge } from '@/components/ui/LanguageBadge';
import type { WordList } from '@/db/types';
import { getLanguage } from '@/data/languages';

/** Eén woordenlijst in een overzicht. */
export function ListCard({ list, count }: { list: WordList; count: number }) {
  const foreign = list.langLeft === 'nl' ? list.langRight : list.langLeft;
  return (
    <Link
      to={`/lijsten/${list.id}`}
      className="flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary"
    >
      <LanguageBadge code={foreign} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-bold">{list.title}</span>
        <span className="block text-sm text-ink-soft">
          {getLanguage(list.langLeft).name} – {getLanguage(list.langRight).name}, {count} {count === 1 ? 'woord' : 'woorden'}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-ink-soft" aria-hidden="true" />
    </Link>
  );
}
