import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Dumbbell } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BackLink } from '@/components/ui/BackLink';
import { Button } from '@/components/ui/Button';
import { getLanguage, type LanguageCode } from '@/data/languages';
import { exercisesOf, getTopic } from '@/data/grammar';
import { db, newId } from '@/db/db';
import { Blocks } from '@/features/grammar/components/Blocks';
import { ExerciseView } from '@/features/grammar/components/ExerciseView';
import { shuffled } from '@/features/practice/engine';
import { finishRewards, getProfile, recordAnswer, type Profile } from '@/features/progress/repo';
import { XP_FINISH } from '@/features/progress/xp';
import { useSettings } from '@/lib/settings';
import { celebrate, fireworks } from '@/lib/confetti';
import { HomeButton, WellDone } from '@/components/ui/WellDone';
import { cn } from '@/lib/cn';
import { toast } from '@/lib/toast';
import { NotFoundPage } from './NotFoundPage';
import { TopicVideos } from '@/features/videos/TopicVideos';
import { FREE_GRAMMAR_TOPICS, usePlusAccess } from '@/lib/plan';
import { PlusGate } from '@/features/account/PlusGate';
import { filterBlocks, filterExercises, selectedCases, topicUsesCases } from '@/features/grammar/cases';
import { CaseChooser } from '@/features/grammar/components/CaseChooser';
import { PartChooser } from '@/features/grammar/components/PartChooser';
import { filterBlocksByPart, filterExercisesByPart, partKey, selectedParts } from '@/features/grammar/parts';

const ROUND = 8;

export function GrammarTopicPage() {
  const { taal, onderwerp } = useParams();
  const lang = taal as LanguageCode;
  const topic = getTopic(lang, onderwerp ?? '');
  const info = getLanguage(lang)?.grammarTopics.find((t) => t.id === onderwerp);
  const dagdoel = useSettings((s) => s.dagdoel);
  const plusOk = usePlusAccess('grammatica-oefenen');
  const [tab, setTab] = useState<'uitleg' | 'oefenen'>('uitleg');
  const [round, setRound] = useState(0);
  const savedCases = useSettings((s) => s.naamvallen);
  const on = useMemo(() => selectedCases(lang, savedCases), [lang, savedCases]);
  const savedParts = useSettings((s) => (topic ? s.onderdelen[partKey(lang, topic.id)] : undefined));
  const parts = useMemo(() => (topic ? selectedParts(topic, savedParts) : new Set<string>()), [topic, savedParts]);
  const exercises = useMemo(
    () => (topic ? shuffled(filterExercises(lang, filterExercisesByPart(exercisesOf(topic), parts), on)).slice(0, ROUND) : []),
    [topic, round, on, parts],
  );
  const [index, setIndex] = useState(0);
  const [good, setGood] = useState(0);
  const before = useRef<Profile | null>(null);
  const last = useRef(Date.now());
  const busy = useRef(false);

  if (!topic || !info) return <NotFoundPage />;
  const done = index >= exercises.length;
  const score = exercises.length ? Math.round((good / exercises.length) * 100) : 0;

  const start = async () => {
    before.current = await getProfile();
    last.current = Date.now();
    setIndex(0);
    setGood(0);
    setRound((r) => r + 1);
    setTab('oefenen');
  };

  const answered = async (ok: boolean) => {
    if (busy.current) return; // al bezig met deze vraag (dubbel Enter of dubbelklik)
    busy.current = true;
    try {
      const now = Date.now();
      await recordAnswer({ correct: ok, xp: ok ? 10 : 1, seconds: Math.min(now - last.current, 60_000) / 1000 });
      last.current = now;
      const newGood = good + (ok ? 1 : 0);
      setGood(newGood);
      if (index + 1 >= exercises.length) {
        const pct = Math.round((newGood / exercises.length) * 100);
        const id = `${lang}:${topic.id}`;
        const prev = await db.grammarProgress.get(id);
        await db.grammarProgress.put({ id, lang, topicId: topic.id, score: Math.max(pct, prev?.score ?? 0), lastAt: now });
        await db.sessions.add({ id: newId(), type: `grammatica-${lang}`, listIds: [], startedAt: now, endedAt: now, score: pct, answers: [] });
        const r = await finishRewards(before.current ?? (await getProfile()), { mode: 'grammatica', total: exercises.length, percentage: pct }, XP_FINISH, dagdoel);
        fireworks();
        if (pct === 100 || r.badges.length) celebrate(pct === 100);
        for (const b of r.badges) toast(`${b.emoji} Nieuwe badge: ${b.title}`);
      }
      setIndex((i) => i + 1);
    } finally {
      busy.current = false;
    }
  };

  return (
    <>
      <BackLink to={`/grammatica/${lang}`}>{getLanguage(lang).name}</BackLink>
      <PageHeader title={info.title} />
      <div role="tablist" aria-label="Onderdeel" className="mb-5 inline-flex rounded-2xl bg-surface-2 p-1">
        {(['uitleg', 'oefenen'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => (t === 'oefenen' && tab !== 'oefenen' ? void start() : setTab(t))}
            className={cn('flex h-11 items-center gap-2 rounded-xl px-5 font-semibold', tab === t ? 'bg-surface shadow-soft' : 'text-ink-soft')}
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs text-on-primary" aria-hidden="true">{t === 'uitleg' ? 1 : 2}</span>
            {t === 'uitleg' ? 'Uitleg lezen' : 'Oefenen'}
          </button>
        ))}
      </div>

      {tab === 'uitleg' && (
        <>
          <div className="mb-5 grid gap-3 lg:grid-cols-2">
            <PartChooser lang={lang} topic={topic} />
            {topicUsesCases(lang, topic) && <CaseChooser lang={lang} />}
          </div>
          <Blocks blocks={filterBlocks(lang, filterBlocksByPart(topic.blocks, parts), on)} lang={lang} />
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border-2 border-primary bg-primary-soft p-4">
            <p className="flex-1 font-semibold">Klaar met lezen? Oefen nu {ROUND} vragen over dit onderwerp.</p>
            <Button size="lg" icon={<Dumbbell size={20} aria-hidden="true" />} onClick={() => void start()}>
              Ga oefenen
            </Button>
          </div>
          <TopicVideos link={{ kind: 'grammar', id: `${lang}:${topic.id}` }} />
        </>
      )}

      {tab === 'oefenen' && !plusOk && (getLanguage(lang).grammarTopics.findIndex((t) => t.id === topic.id) >= FREE_GRAMMAR_TOPICS) && (
        <PlusGate feature="grammatica-oefenen">{null}</PlusGate>
      )}
      {tab === 'oefenen' && (plusOk || getLanguage(lang).grammarTopics.findIndex((t) => t.id === topic.id) < FREE_GRAMMAR_TOPICS) && (
        <div className="mx-auto max-w-lg">
          {exercises.length === 0 ? (
            <p className="rounded-2xl bg-surface-2 p-5 text-center font-semibold">Met wat je gekozen hebt, zijn er hier geen oefeningen. Zet bij de uitleg nog een naamval of onderdeel aan.</p>
          ) : !done ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Voortgang" aria-valuemin={0} aria-valuemax={exercises.length} aria-valuenow={index}>
                  <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(index / exercises.length) * 100}%` }} />
                </div>
                <span className="text-sm font-semibold text-ink-soft tabular-nums">{index}/{exercises.length}</span>
              </div>
              <ExerciseView key={`${round}-${index}`} ex={exercises[index]!} lang={lang} onDone={(ok) => void answered(ok)} />
              <button type="button" onClick={() => setTab('uitleg')} className="mt-4 h-11 text-sm font-semibold text-primary-ink underline underline-offset-2">
                Terug naar de uitleg
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4">
            <WellDone />
            <div className="flex flex-col gap-4 rounded-[28px] border border-line bg-surface p-8 text-center shadow-soft">
              <p className="text-[56px] leading-none font-extrabold"><span className="marker">{score}%</span></p>
              <p className="text-lg font-bold">{score === 100 ? 'Alles goed!' : score >= 70 ? 'Lekker bezig!' : 'Lees de uitleg nog eens en probeer het opnieuw.'}</p>
              <Button size="lg" className="justify-center" onClick={() => void start()}>Nieuwe ronde</Button>
              <Button size="lg" variant="secondary" className="justify-center" onClick={() => setTab('uitleg')}>Naar de uitleg</Button>
            </div>
            <HomeButton />
            </div>
          )}
        </div>
      )}
    </>
  );
}
