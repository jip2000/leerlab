import { Link, useParams, useSearchParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, ChevronRight, PenLine } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { LanguageBadge } from '@/components/ui/LanguageBadge';
import { languages, type LanguageCode } from '@/data/languages';
import { getTopic, grammar } from '@/data/grammar';
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
 * #/grammatica/fr         → tabblad "Uitleg & oefeningen"
 * #/grammatica/fr?deel=werkwoorden → tabblad "Werkwoorden trainen"
 */
export function GrammarPage() {
  const { taal } = useParams();
  const [params, setParams] = useSearchParams();
  const lang = languages.find((l) => l.code === (taal as LanguageCode));

  if (lang) {
    const hasVerbs = !!verbEngines[lang.code];
    const deel: Deel = hasVerbs && params.get('deel') === 'werkwoorden' ? 'werkwoorden' : 'uitleg';
    const tabs: { id: Deel; label: string; icon: typeof BookOpen }[] = [
      { id: 'uitleg', label: 'Uitleg & oefeningen', icon: BookOpen },
      ...(hasVerbs ? [{ id: 'werkwoorden' as const, label: 'Werkwoorden trainen', icon: PenLine }] : []),
    ];
    return (
      <>
        <BackLink to="/grammatica">Alle talen</BackLink>
        <PageHeader
          title={`${lang.flag} ${lang.name}`}
          intro={hasVerbs ? 'Lees de uitleg bij een onderwerp, of train meteen je werkwoorden.' : 'Kies een onderwerp: eerst de uitleg, dan oefenen.'}
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

  return (
    <>
      <PageHeader title="Grammatica & werkwoorden" intro="Kies een taal. Daar vind je de uitleg met oefeningen én de werkwoordtrainer." />
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((l) => {
          const n = grammar[l.code]?.length ?? 0;
          const verbs = !!verbEngines[l.code];
          return (
            <li key={l.code}>
              <Link to={`/grammatica/${l.code}`} className="flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary">
                <LanguageBadge code={l.code} />
                <span className="flex-1">
                  <span className="block font-bold">{l.name}</span>
                  <span className="block text-sm text-ink-soft">
                    {n ? `${n} onderwerpen` : `${l.grammarTopics.length} onderwerpen, uitleg volgt`}
                    {verbs && ' · werkwoorden'}
                  </span>
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

function TopicList({ code }: { code: LanguageCode }) {
  const lang = languages.find((l) => l.code === code)!;
  const progress = useLiveQuery(() => db.grammarProgress.where('lang').equals(code).toArray(), [code]);
  const score = new Map((progress ?? []).map((p) => [p.topicId, p.score]));
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {lang.grammarTopics.map((t) => {
        const has = !!getTopic(code, t.id);
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
              <Link to={`/grammatica/${code}/${t.id}`} className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-primary">
                {inner}
              </Link>
            ) : (
              <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-3 opacity-70">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
