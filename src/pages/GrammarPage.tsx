import { Link, useParams } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { LanguageBadge } from '@/components/ui/LanguageBadge';
import { languages, type LanguageCode } from '@/data/languages';

const sorted = [...languages].sort((a, b) => a.grammarPriority - b.grammarPriority);

export function GrammarPage() {
  const { taal } = useParams();
  const lang = languages.find((l) => l.code === (taal as LanguageCode));

  if (lang) {
    return (
      <>
        <Link to="/grammatica" className="mb-3 inline-flex h-11 items-center text-sm font-semibold text-ink-soft hover:text-ink">
          ← Alle talen
        </Link>
        <PageHeader title={`Grammatica ${lang.name}`} intro="Uitleg en oefeningen per onderwerp komen in fase 6." />
        <ul className="grid gap-2 sm:grid-cols-2">
          {lang.grammarTopics.map((t) => (
            <li key={t.id} className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
              <span className="font-semibold">{t.title}</span>
              <span className="text-sm text-ink-soft">0%</span>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Grammatica" intro="Kies een taal en daarna een onderwerp." />
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((l) => (
          <li key={l.code}>
            <Link
              to={`/grammatica/${l.code}`}
              className="flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary"
            >
              <LanguageBadge code={l.code} />
              <span className="flex-1">
                <span className="block font-bold">{l.name}</span>
                <span className="block text-sm text-ink-soft">{l.grammarTopics.length} onderwerpen</span>
              </span>
              <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
