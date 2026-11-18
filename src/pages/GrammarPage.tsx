import { Link, useParams, useSearchParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, ChevronRight, PenLine } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { LanguageBadge } from '@/components/ui/LanguageBadge';
import { languages, type LanguageCode } from '@/data/languages';
import { getTopic } from '@/data/grammar';
import { db } from '@/db/db';
import { verbEngines } from '@/features/verbs/registry';
import { PlusGate } from '@/features/account/PlusGate';
import { VerbsPage } from '@/pages/VerbsPage';
import { cn } from '@/lib/cn';
import { casesOf } from '@/features/grammar/cases';
import { CaseChooser } from '@/features/grammar/components/CaseChooser';

const sorted = [...languages].sort((a, b) => a.grammarPriority - b.grammarPriority);

type Deel = 'uitleg' | 'werkwoorden';

/**
 * Grammatica & werkwoorden: één plek per taal.
 * #/grammatica            → kies een taal
 * #/grammatica/fr         → tabblad "Grammatica"
 * #/grammatica/fr?deel=werkwoorden → tabblad "Werkwoorden"
 */
export function GrammarPage() {
  const { taal } = useParams();
  const [params, setParams] = useSearchParams();
  const lang = languages.find((l) => l.code === (taal as LanguageCode));

  if (lang) {
    const hasVerbs = !!verbEngines[lang.code];
    const deel: Deel = hasVerbs && params.get('deel') === 'werkwoorden' ? 'werkwoorden' : 'uitleg';
    const tabs: { id: Deel; label: string; icon: typeof BookOpen }[] = [
      { id: 'uitleg', label: 'Grammatica', icon: BookOpen },
      ...(hasVerbs ? [{ id: 'werkwoorden' as const, label: 'Werkwoorden', icon: PenLine }] : []),
    ];
    return (
      <>
        <BackLink to="/grammatica">Alle talen</BackLink>
        <PageHeader
          title={`${lang.flag} ${lang.name}`}
          intro={deel === 'werkwoorden' ? 'Kies in 3 stappen wat je wilt oefenen en druk op Start.' : 'Kies een onderwerp. Je leest eerst de uitleg en daarna oefen je.'}
        />
        {tabs.length > 1 && (
          <div role="tablist" aria-label="Onderdeel" className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-surface-2 p-1 sm:inline-grid sm:min-w-[440px]">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={deel === id}
                aria-controls="deel-paneel"
                onClick={() => setParams(id === 'werkwoorden' ? { deel: id } : {}, { replace: true })}
                className={cn(
                  'flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition-colors sm:text-base',
                  deel === id ? 'bg-surface text-primary-ink shadow-soft' : 'text-ink-soft hover:text-ink',
                )}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        )}
        <div id="deel-paneel" role={tabs.length > 1 ? 'tabpanel' : undefined} aria-labelledby={tabs.length > 1 ? `tab-${deel}` : undefined}>
          {deel === 'werkwoorden' ? (
            <PlusGate feature="werkwoorden">
              <VerbsPage lang={lang.code} />
            </PlusGate>
          ) : (
            <>
              {casesOf(lang.code).length > 0 && <CaseChooser lang={lang.code} className="mb-5" />}
              <TopicList code={lang.code} />
            </>
          )}
        </div>
      </>
    );
  }

  const main = sorted.filter((l) => l.grammarPriority === 1);
  const rest = sorted.filter((l) => l.grammarPriority !== 1);
  return (
    <>
      <PageHeader title="Grammatica & werkwoorden" intro="Welke taal leer je? Kies hem hieronder." />
      <h2 className="mb-2 text-sm font-bold tracking-wide text-ink-soft uppercase">Veel gekozen</h2>
      <ul className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {main.map((l) => (
          <li key={l.code}>
            <Link to={`/grammatica/${l.code}`} className="flex h-full flex-col items-center gap-2 rounded-[var(--radius-card)] border-2 border-line bg-surface px-3 py-5 text-center transition-colors hover:border-primary">
              <LanguageBadge code={l.code} />
              <span className="text-lg font-extrabold">{l.name}</span>
              <span className="text-sm text-ink-soft">{verbEngines[l.code] ? 'Grammatica en werkwoorden' : 'Grammatica'}</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mb-2 text-sm font-bold tracking-wide text-ink-soft uppercase">Meer talen</h2>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((l) => (
          <li key={l.code}>
            <Link to={`/grammatica/${l.code}`} className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5 transition-colors hover:border-primary">
              <LanguageBadge code={l.code} />
              <span className="flex-1">
                <span className="block font-bold">{l.name}</span>
                <span className="block text-sm text-ink-soft">{verbEngines[l.code] ? 'Grammatica en werkwoorden' : 'Grammatica'}</span>
              </span>
              <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function TopicList({ code }: { code: LanguageCode }) {
  const lang = languages.find((l) => l.code === code)!;
  const progress = useLiveQuery(() => db.grammarProgress.where('lang').equals(code).toArray(), [code]);
  const score = new Map((progress ?? []).map((p) => [p.topicId, p.score]));
  // Onderwerpen zonder uitleg laten we weg; tijden (gemaakt met de werkwoordmotor) apart.
  const ready = lang.grammarTopics.map((t) => ({ ...t, content: getTopic(code, t.id) })).filter((t) => t.content);
  const groups = [
    { title: 'Regels', items: ready.filter((t) => typeof t.content!.exercises !== 'function') },
    { title: 'Werkwoordstijden', items: ready.filter((t) => typeof t.content!.exercises === 'function') },
  ].filter((g) => g.items.length > 0);
  const later = lang.grammarTopics.length - ready.length;
  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <section key={g.title}>
          {groups.length > 1 && <h2 className="mb-2 text-lg font-bold">{g.title}</h2>}
          <ul className="grid gap-2 sm:grid-cols-2">
            {g.items.map((t) => {
              const s = score.get(t.id);
              return (
                <li key={t.id}>
                  <Link to={`/grammatica/${code}/${t.id}`} className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary">
                    <span className="min-w-0 flex-1 font-semibold">{t.title}</span>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-bold ${s === undefined ? 'text-ink-soft' : s >= 80 ? 'bg-primary-soft text-primary-ink' : 'bg-marker/50'}`}>
                      {s === undefined ? 'nieuw' : `${s}%`}
                    </span>
                    <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      {ready.length === 0 && <p className="text-ink-soft">De uitleg voor deze taal komt eraan.</p>}
      {later > 0 && ready.length > 0 && <p className="text-sm text-ink-soft">Er komen nog {later} onderwerpen bij.</p>}
    </div>
  );
}
