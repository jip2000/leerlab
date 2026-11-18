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
    const engine = verbEngines[lang.code];
    const nTopics = lang.grammarTopics.filter((t) => getTopic(lang.code, t.id)).length;
    const tabs: { id: Deel; label: string; sub: string; icon: typeof BookOpen }[] = [
      { id: 'uitleg', label: 'Grammatica', sub: `Leerpad met ${nTopics} onderwerpen`, icon: BookOpen },
      ...(engine ? [{ id: 'werkwoorden' as const, label: 'Werkwoorden', sub: `${engine.verbs.length} werkwoorden · ${engine.tenses.length} tijden`, icon: PenLine }] : []),
    ];
    return (
      <>
        <BackLink to="/grammatica">Alle talen</BackLink>
        <PageHeader
          title={`${lang.flag} ${lang.name}`}
          intro={hasVerbs ? 'Wat wil je doen?' : 'Volg het leerpad: eerst de uitleg, dan oefenen.'}
        />
        {tabs.length > 1 && (
          <div role="tablist" aria-label="Onderdeel" className="mb-6 grid grid-cols-2 gap-3">
            {tabs.map(({ id, label, sub, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={deel === id}
                aria-controls="deel-paneel"
                onClick={() => setParams(id === 'werkwoorden' ? { deel: id } : {}, { replace: true })}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-[var(--radius-card)] border-2 p-4 text-left transition-colors sm:flex-row sm:items-center sm:gap-3',
                  deel === id ? 'border-primary bg-primary-soft' : 'border-line bg-surface hover:border-primary',
                )}
              >
                <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', deel === id ? 'bg-primary text-on-primary' : 'bg-surface-2 text-ink-soft')}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-lg font-extrabold">{label}</span>
                  <span className="block text-sm text-ink-soft">{sub}</span>
                </span>
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
  // Leerpad: de onderwerpen in volgorde (makkelijk → moeilijk); zonder uitleg laten we ze weg.
  const path = lang.grammarTopics.filter((t) => getTopic(code, t.id));
  const later = lang.grammarTopics.length - path.length;
  const done = path.filter((t) => (score.get(t.id) ?? 0) >= 80).length;
  const next = path.find((t) => (score.get(t.id) ?? 0) < 80);
  const status = (id: string) => {
    const s = score.get(id);
    if (s === undefined) return { text: 'nieuw', cls: 'text-ink-soft' };
    if (s >= 80) return { text: `✓ ${s}%`, cls: 'bg-primary-soft text-primary-ink' };
    return { text: `bezig ${s}%`, cls: 'bg-marker/50' };
  };
  if (path.length === 0) return <p className="text-ink-soft">De uitleg voor deze taal komt eraan.</p>;
  return (
    <div className="flex flex-col gap-4">
      {next ? (
        <Link
          to={`/grammatica/${code}/${next.id}`}
          className="flex items-center gap-3 rounded-[var(--radius-card)] bg-primary p-4 text-on-primary shadow-soft hover:bg-primary-hover"
        >
          <span className="flex-1">
            <span className="block text-sm">{done === 0 ? 'Begin hier' : 'Ga verder'}</span>
            <span className="block text-lg font-extrabold">{path.indexOf(next) + 1}. {next.title}</span>
          </span>
          <ChevronRight size={24} aria-hidden="true" />
        </Link>
      ) : (
        <p className="rounded-[var(--radius-card)] bg-primary-soft p-4 font-bold text-primary-ink">🎉 Je hebt alle onderwerpen gehaald!</p>
      )}
      <p className="text-sm text-ink-soft">{done} van {path.length} onderwerpen gehaald (80% of meer).</p>
      <ol className="grid gap-2 sm:grid-cols-2">
        {path.map((t, i) => {
          const st = status(t.id);
          const isNext = t.id === next?.id;
          return (
            <li key={t.id}>
              <Link
                to={`/grammatica/${code}/${t.id}`}
                className={cn('flex min-h-14 items-center gap-3 rounded-2xl border bg-surface px-4 py-3 transition-colors hover:border-primary', isNext ? 'border-2 border-primary' : 'border-line')}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-bold" aria-hidden="true">{i + 1}</span>
                <span className="min-w-0 flex-1 font-semibold">{t.title}</span>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-bold ${st.cls}`}>{st.text}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {later > 0 && <p className="text-sm text-ink-soft">Er komen nog {later} onderwerpen bij.</p>}
    </div>
  );
}
