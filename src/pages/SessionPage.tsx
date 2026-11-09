import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { NotFoundPage } from './NotFoundPage';
import { answerCard, currentCard, isFinished, progress, summarize, type Card } from '@/features/practice/engine';
import { getSession, saveSessionState, startSession, type SessionData, type StoredSession } from '@/features/practice/repo';
import { modeLabels } from '@/features/practice/labels';
import { FlashcardView } from '@/features/practice/components/FlashcardView';
import { TypeView } from '@/features/practice/components/TypeView';
import { ChoiceView } from '@/features/practice/components/ChoiceView';
import { SummaryView } from '@/features/practice/components/SummaryView';
import { finishRewards, getProfile, recordAnswer, recordWordResult, type Profile, type Rewards } from '@/features/progress/repo';
import { XP_FINISH, XP_PERFECT, xpForAnswer } from '@/features/progress/xp';
import { updateAppBadge } from '@/lib/appBadge';
import { grade as toGrade } from '@/lib/grade';
import { useSettings } from '@/lib/settings';
import { speak } from '@/lib/speech';
import { toast } from '@/lib/toast';

export function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<StoredSession | null | undefined>(undefined);
  const [data, setData] = useState<SessionData | null>(null);
  const [rewards, setRewards] = useState<Rewards | undefined>();
  const before = useRef<Profile | null>(null);
  const busy = useRef(false);
  // Altijd de nieuwste stand, ook in oude callbacks (bijv. van een kaart die nog wegschuift).
  const dataRef = useRef<SessionData | null>(null);
  dataRef.current = data;
  const voorlezen = useSettings((s) => s.voorlezen);
  const dagdoel = useSettings((s) => s.dagdoel);

  useEffect(() => {
    void (async () => {
      const s = await getSession(id ?? '');
      if (!s) return setSession(null);
      // Pauze telt niet als oefentijd.
      const d = { ...s.state, lastAnswerAt: Date.now() };
      before.current = await getProfile();
      setSession(s);
      setData(d);
    })();
  }, [id]);

  const card = data ? currentCard(data.engine) : undefined;

  // Automatisch voorlezen (instelling).
  useEffect(() => {
    if (voorlezen && card && data?.options.mode !== 'toets') speak(card.prompt, card.promptLang);
  }, [card?.key, data?.engine.answers.length]);

  const onAnswer = useCallback(
    async (cardKey: string, correct: boolean, given = '') => {
      const data = dataRef.current;
      if (!data || !session || busy.current) return;
      const c = currentCard(data.engine);
      // Alleen een antwoord op de kaart die nú aan de beurt is telt.
      if (!c || c.key !== cardKey) return;
      busy.current = true;
      try {
      const now = Date.now();
      const seconds = Math.min(now - data.lastAnswerAt, 60_000) / 1000;
      const firstTry = !data.engine.seen.includes(c.key);
      const xp = xpForAnswer(data.options.mode, correct);
      const engine = answerCard(data.engine, correct, given);
      let next: SessionData = { ...data, engine, xp: data.xp + xp, lastAnswerAt: now };

      await recordAnswer({ correct, xp, seconds });
      if (firstTry) await recordWordResult({ wordId: c.wordId, listId: c.listId, dir: c.dir, correct });

      if (isFinished(engine)) {
        const summary = summarize(engine);
        const g = data.options.mode === 'toets' ? toGrade(summary.correctFirstTry, summary.total) : undefined;
        const bonus = XP_FINISH + (summary.percentage === 100 && summary.total >= 5 ? XP_PERFECT : 0);
        next = { ...next, xp: next.xp + bonus, summary: { ...summary, grade: g } };
        await saveSessionState(session.id, next, { score: summary.percentage });
        setData(next);
        dataRef.current = next;
        const r = await finishRewards(before.current ?? (await getProfile()), { mode: data.options.mode, total: summary.total, percentage: summary.percentage, grade: g }, bonus, dagdoel);
        setRewards(r);
        void updateAppBadge(r.streakAfter);
      } else {
        await saveSessionState(session.id, next);
        setData(next);
        dataRef.current = next;
      }
      } finally {
        busy.current = false;
      }
    },
    [session, dagdoel],
  );

  const restart = async (cards?: Card[]) => {
    if (!session || !data) return;
    const newId = await startSession({
      listIds: session.listIds,
      ...data.options,
      onlyHard: false,
      cardKeys: cards?.map((c) => c.key),
    });
    setRewards(undefined);
    navigate(`/oefenen/${newId}`, { replace: true });
  };

  if (session === null) return <NotFoundPage />;
  if (!session || !data) return null;

  const mode = data.options.mode;
  const { done, total } = progress(data.engine);
  const finished = isFinished(data.engine);

  if (finished && data.summary) {
    return (
      <SummaryView
        mode={mode}
        summary={data.summary}
        grade={data.summary.grade}
        xp={data.xp}
        rewards={rewards}
        onRetryMistakes={(cards) => void restart(cards)}
        onAgain={() => void restart()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            toast('Oefening bewaard. Je kunt later verdergaan.');
            navigate('/oefenen');
          }}
          aria-label="Pauzeren en stoppen"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface-2 hover:text-ink"
        >
          <X size={22} />
        </button>
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-label="Voortgang"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${(done / total) * 100}%` }} />
        </div>
        <span className="w-16 shrink-0 text-right text-sm font-semibold text-ink-soft tabular-nums">
          {done}/{total}
        </span>
      </div>
      <p className="-mt-2 text-center text-sm font-semibold text-ink-soft">{modeLabels[mode]}</p>

      {/* Geen uitgaande animatie: de nieuwe kaart staat er meteen, zodat snel typen nooit in de vorige kaart belandt. */}
      {card && (
          <motion.div
            key={`${card.key}-${data.engine.answers.length}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
          >
            {mode === 'flashcards' && <FlashcardView card={card} onAnswer={(knew) => void onAnswer(card.key, knew)} />}
            {(mode === 'typen' || mode === 'toets') && <TypeView card={card} test={mode === 'toets'} onAnswer={(ok, g) => void onAnswer(card.key, ok, g)} />}
            {mode === 'meerkeuze' && <ChoiceView card={card} pool={data.engine.cards} onAnswer={(ok, g) => void onAnswer(card.key, ok, g)} />}
          </motion.div>
      )}
    </div>
  );
}
