import { Link, useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, Camera, ChevronRight, PenLine } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { LanguageBadge } from '@/components/ui/LanguageBadge';
import { getLanguage, isExtraTaal, languages, ookOpSchool, schoolTalen, type LanguageCode } from '@/data/languages';
import { getTopic } from '@/data/grammar';
import { db } from '@/db/db';
import { verbEngines } from '@/features/verbs/registry';
import { PlusGate } from '@/features/account/PlusGate';
import { VerbsPage } from '@/pages/VerbsPage';
import { cn } from '@/lib/cn';
import { casesOf } from '@/features/grammar/cases';
import { CaseChooser } from '@/features/grammar/components/CaseChooser';
import { explanationTopicIds } from '@/features/grammar/tenseLinks';


/**
 * Grammatica & werkwoorden: één pagina per taal.
 * #/grammatica     → kies een taal (schooltalen groot bovenaan, daarna extra talen)
 * #/grammatica/fr  → eerst tijden kiezen en werkwoorden oefenen, daaronder de overige grammatica
 */
export function GrammarPage() {
  const { taal } = useParams();
  const lang = languages.find((l) => l.code === (taal as LanguageCode));

  if (lang) {
    const hasVerbs = !!verbEngines[lang.code];
    return (
      <>
        <BackLink to="/grammatica">Alle talen</BackLink>
        <PageHeader
          title={`${lang.flag} ${lang.name}`}
          intro={hasVerbs ? 'Kies bovenaan wat je wilt oefenen, daarna in welke tijden, en druk op Start.' : 'Volg het leerpad: eerst de uitleg, dan oefenen.'}
        />
        <Link
          to={`/grammatica/${lang.code}/foto`}
          className="mb-8 flex items-center gap-4 rounded-[var(--radius-card)] border-2 border-dashed border-primary bg-primary-soft/50 p-4 transition-colors hover:bg-primary-soft"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-on-primary"><Camera size={24} aria-hidden="true" /></span>
          <span className="flex-1">
            <span className="block text-lg font-extrabold">Foto van je boek → oefeningen</span>
            <span className="block text-sm text-ink-soft">Maak een foto van de grammatica die je moet leren. Woordwerk zoekt uit wat het is en zet het klaar om te oefenen.</span>
          </span>
          <ChevronRight size={22} className="shrink-0 text-ink-soft" aria-hidden="true" />
        </Link>
        {hasVerbs && (
          <section aria-labelledby="ww-kop" className="mb-10">
            <h2 id="ww-kop" className="mb-3 flex items-center gap-2 text-xl font-extrabold"><PenLine size={22} aria-hidden="true" /> Oefenen</h2>
            <PlusGate feature="werkwoorden">
              <VerbsPage lang={lang.code} />
            </PlusGate>
          </section>
        )}
        <section aria-labelledby="gr-kop">
          <h2 id="gr-kop" className="mb-3 flex items-center gap-2 text-xl font-extrabold"><BookOpen size={22} aria-hidden="true" /> {hasVerbs ? 'Uitleg lezen' : 'Grammatica'}</h2>
          {!hasVerbs && casesOf(lang.code).length > 0 && <CaseChooser lang={lang.code} className="mb-5" />}
          <TopicList code={lang.code} skipTenses={hasVerbs} />
        </section>
      </>
    );
  }

  const school = schoolTalen.map(getLanguage);
  const ook = ookOpSchool.map(getLanguage);
  const extra = languages.filter((l) => isExtraTaal(l.code));
  const sub = (code: LanguageCode) => (verbEngines[code] ? 'Grammatica en werkwoorden' : 'Grammatica');
  return (
    <>
      <PageHeader title="Grammatica & werkwoorden" intro="Welke taal leer je? Kies hem hieronder." />
      <section aria-labelledby="school-kop" className="mb-8 rounded-[28px] border-2 border-primary/40 bg-primary-soft/40 p-4 sm:p-5">
        <h2 id="school-kop" className="mb-3 text-lg font-extrabold">⭐ Talen op school</h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {school.map((l) => (
            <li key={l.code}>
              <Link to={`/grammatica/${l.code}`} className="flex h-full flex-col items-center gap-2 rounded-[var(--radius-card)] border-2 border-line bg-surface px-3 py-5 text-center shadow-soft transition-colors hover:border-primary">
                <span className="text-3xl" aria-hidden="true">{l.flag}</span>
                <span className="text-xl font-extrabold">{l.name}</span>
                <span className="text-sm text-ink-soft">{sub(l.code)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="mt-4 mb-2 text-sm font-bold text-ink-soft">Ook op school</h3>
        <ul className="grid gap-2 sm:grid-cols-3">
          {ook.map((l) => (
            <li key={l.code}>
              <Link to={`/grammatica/${l.code}`} className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5 transition-colors hover:border-primary">
                <LanguageBadge code={l.code} />
                <span className="flex-1">
                  <span className="block font-bold">{l.name}</span>
                  <span className="block text-sm text-ink-soft">{sub(l.code)}</span>
                </span>
                <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="extra-kop">
        <h2 id="extra-kop" className="mb-1 text-lg font-extrabold">🌍 Extra talen</h2>
        <p className="mb-3 text-sm text-ink-soft">Talen die je meestal niet op school krijgt. Nieuw in een taal? Kijk ook bij <Link to="/nieuwe-taal" className="font-semibold text-primary-ink underline underline-offset-2">Nieuwe taal proberen</Link>.</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {extra.map((l) => (
            <li key={l.code}>
              <Link to={`/grammatica/${l.code}`} className="flex min-h-12 items-center gap-2.5 rounded-2xl border border-line bg-surface px-3 py-2 transition-colors hover:border-primary">
                <LanguageBadge code={l.code} />
                <span className="font-semibold">{l.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function TopicList({ code, skipTenses }: { code: LanguageCode; skipTenses?: boolean }) {
  const lang = languages.find((l) => l.code === code)!;
  const progress = useLiveQuery(() => db.grammarProgress.where('lang').equals(code).toArray(), [code]);
  const score = new Map((progress ?? []).map((p) => [p.topicId, p.score]));
  // Leerpad: de onderwerpen in volgorde (makkelijk → moeilijk); zonder uitleg laten we ze weg.
  // De uitleg van elke tijd staat al bovenaan bij die tijd; die laten we hier weg.
  const skip = skipTenses ? explanationTopicIds(code) : new Set<string>();
  const all = lang.grammarTopics.filter((t) => !skip.has(t.id));
  const path = all.filter((t) => getTopic(code, t.id));
  const later = all.length - path.length;
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
