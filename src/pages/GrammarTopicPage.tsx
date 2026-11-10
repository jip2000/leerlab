import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { BookOpen, Dumbbell } from 'lucide-react';
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
import { celebrate } from '@/lib/confetti';
import { cn } from '@/lib/cn';
import { toast } from '@/lib/toast';
import { NotFoundPage } from './NotFoundPage';
import { TopicVideos } from '@/features/videos/TopicVideos';
import { FREE_GRAMMAR_TOPICS, usePlusAccess } from '@/lib/plan';
import { PlusGate } from '@/features/account/PlusGate';

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
  const exercises = useMemo(() => (topic ? shuffled(exercisesOf(topic)).slice(0, ROUND) : []), [topic, round]);
  const [index, setIndex] = useState(0);
  const [good, setGood] = useState(0);
  const before = useRef<Profile | null>(null);
  const last = useRef(Date.now());

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
      if (pct === 100 || r.badges.length) celebrate(pct === 100);
      for (const b of r.badges) toast(`${b.emoji} Nieuwe badge: ${b.title}`);
    }
    setIndex((i) => i + 1);
  };

  return (
    <>
      <BackLink to={`/grammatica/${lang}`}>Grammatica {getLanguage(lang).name}</BackLink>
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
            {t === 'uitleg' ? <BookOpen size={18} aria-hidden="true" /> : <Dumbbell size={18} aria-hidden="true" />}
            {t === 'uitleg' ? 'Uitleg' : 'Oefenen'}
          </button>
        ))}
      </div>

      {tab === 'uitleg' && (
        <>
          <Blocks blocks={topic.blocks} lang={lang} />
          <Button size="lg" className="mt-6" icon={<Dumbbell size={20} aria-hidden="true" />} onClick={() => void start()}>
            Oefenen
          </Button>
          <TopicVideos link={{ kind: 'grammar', id: `${lang}:${topic.id}` }} />
        </>
      )}

      {tab === 'oefenen' && !plusOk && (getLanguage(lang).grammarTopics.findIndex((t) => t.id === topic.id) >= FREE_GRAMMAR_TOPICS) && (
        <PlusGate feature="grammatica-oefenen">{null}</PlusGate>
      )}
      {tab === 'oefenen' && (plusOk || getLanguage(lang).grammarTopics.findIndex((t) => t.id === topic.id) < FREE_GRAMMAR_TOPICS) && (
        <div className="mx-auto max-w-lg">
          {!done ? (
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
            <div className="flex flex-col gap-4 rounded-[28px] border border-line bg-surface p-8 text-center shadow-soft">
              <p className="text-[56px] leading-none font-extrabold"><span className="marker">{score}%</span></p>
              <p className="text-lg font-bold">{score === 100 ? 'Alles goed!' : score >= 70 ? 'Lekker bezig!' : 'Lees de uitleg nog eens en probeer het opnieuw.'}</p>
              <Button size="lg" className="justify-center" onClick={() => void start()}>Nieuwe ronde</Button>
              <Button size="lg" variant="secondary" className="justify-center" onClick={() => setTab('uitleg')}>Naar de uitleg</Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
