import { Link, useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { LanguageBadge } from '@/components/ui/LanguageBadge';
import { languages, type LanguageCode } from '@/data/languages';
import { getTopic, grammar } from '@/data/grammar';
import { GrammarHeader } from '@/features/grammar/components/GrammarHeader';
import { db } from '@/db/db';

const sorted = [...languages].sort((a, b) => a.grammarPriority - b.grammarPriority);

export function GrammarPage() {
  const { taal } = useParams();
  const lang = languages.find((l) => l.code === (taal as LanguageCode));
  const progress = useLiveQuery(() => (lang ? db.grammarProgress.where('lang').equals(lang.code).toArray() : []), [lang?.code]);

  if (lang) {
    const score = new Map((progress ?? []).map((p) => [p.topicId, p.score]));
    return (
      <>
        <BackLink to="/grammatica">Alle talen</BackLink>
        <PageHeader title={`Grammatica ${lang.name}`} intro="Kies een onderwerp: eerst de uitleg, dan oefenen." />
        <ul className="grid gap-2 sm:grid-cols-2">
          {lang.grammarTopics.map((t) => {
            const has = !!getTopic(lang.code, t.id);
            const s = score.get(t.id);
            const inner = (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{t.title}</span>
                  {!has && <span className="block text-sm text-ink-soft">Uitleg volgt nog</span>}
                </span>
                {has && (
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-bold ${s === undefined ? 'text-ink-soft' : s >= 80 ? 'bg-primary-soft text-primary-ink' : 'bg-marker/50'}`}>
                    {s === undefined ? 'nieuw' : `${s}%`}
                  </span>
                )}
                {has && <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />}
              </>
            );
            return (
              <li key={t.id}>
                {has ? (
                  <Link to={`/grammatica/${lang.code}/${t.id}`} className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary">
                    {inner}
                  </Link>
                ) : (
                  <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-3 opacity-70">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <>
      <GrammarHeader intro="Kies een taal en daarna een onderwerp." />
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((l) => {
          const n = grammar[l.code]?.length ?? 0;
          return (
            <li key={l.code}>
              <Link to={`/grammatica/${l.code}`} className="flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary">
                <LanguageBadge code={l.code} />
                <span className="flex-1">
                  <span className="block font-bold">{l.name}</span>
                  <span className="block text-sm text-ink-soft">{n ? `${n} onderwerpen met uitleg` : `${l.grammarTopics.length} onderwerpen, uitleg volgt`}</span>
                </span>
                <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
