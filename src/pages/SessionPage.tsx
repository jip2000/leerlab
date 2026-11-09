import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { NotFoundPage } from './NotFoundPage';
import { answerCard, answerKey, currentCard, GAME_MODES, isFinished, progress, summarize, type Card, type EngineState, type Summary } from '@/features/practice/engine';
import { getSession, saveSessionState, startSession, type SessionData, type StoredSession } from '@/features/practice/repo';
import { modeLabels } from '@/features/practice/labels';
import { FlashcardView } from '@/features/practice/components/FlashcardView';
import { TypeView } from '@/features/practice/components/TypeView';
import { ChoiceView } from '@/features/practice/components/ChoiceView';
import { SummaryView } from '@/features/practice/components/SummaryView';
import { MatchGame } from '@/features/practice/components/MatchGame';
import { SpeedRound } from '@/features/practice/components/SpeedRound';
import { LearnMode } from '@/features/practice/components/LearnMode';
import { finishRewards, getProfile, recordAnswer, recordWordResult, type Profile, type Rewards } from '@/features/progress/repo';
import { XP_FINISH, XP_PERFECT, xpForAnswer } from '@/features/progress/xp';
import { db } from '@/db/db';
import { updateAppBadge } from '@/lib/appBadge';
import { grade as toGrade } from '@/lib/grade';
import { useSettings } from '@/lib/settings';
import { speak } from '@/lib/speech';
import { toast } from '@/lib/toast';

async function getMeta(key: string): Promise<number | undefined> {
  return (await db.meta.get(key))?.value as number | undefined;
}

export function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<StoredSession | null | undefined>(undefined);
  const [data, setData] = useState<SessionData | null>(null);
  const [rewards, setRewards] = useState<Rewards | undefined>();
  const [extra, setExtra] = useState<string | undefined>();
  const before = useRef<Profile | null>(null);
  const busy = useRef(false);
  // Altijd de nieuwste stand, ook in oude callbacks.
  const dataRef = useRef<SessionData | null>(null);
  dataRef.current = data;
  const voorlezen = useSettings((s) => s.voorlezen);
  const dagdoel = useSettings((s) => s.dagdoel);

  useEffect(() => {
    void (async () => {
      const s = await getSession(id ?? '');
      if (!s) return setSession(null);
      before.current = await getProfile();
      setSession(s);
      setData({ ...s.state, lastAnswerAt: Date.now() }); // pauze telt niet als oefentijd
      setRewards(undefined);
      setExtra(undefined);
    })();
  }, [id]);

  const mode = data?.options.mode;
  const card = data ? currentCard(data.engine) : undefined;

  useEffect(() => {
    if (voorlezen && card && mode !== 'toets' && mode !== 'luisteren' && !GAME_MODES.includes(mode!)) speak(card.prompt, card.promptLang);
  }, [card?.key, data?.engine.answers.length]);

  /** Antwoord vastleggen (XP, dag, woord) — voor alle modi. */
  const record = async (c: Card, correct: boolean, firstTry: boolean) => {
    const d = dataRef.current!;
    const now = Date.now();
    const xp = xpForAnswer(d.options.mode, correct);
    await recordAnswer({ correct, xp, seconds: Math.min(now - d.lastAnswerAt, 60_000) / 1000 });
    if (firstTry) await recordWordResult({ wordId: c.wordId, listId: c.listId, dir: c.dir, correct });
    return { xp, now };
  };

  /** Afronden: bonus-XP, beloningen, sessie als klaar markeren. */
  const complete = async (next: SessionData, summary: Summary) => {
    const g = next.options.mode === 'toets' ? toGrade(summary.correctFirstTry, summary.total) : undefined;
    const bonus = XP_FINISH + (summary.percentage === 100 && summary.total >= 5 ? XP_PERFECT : 0);
    const final = { ...next, xp: next.xp + bonus, summary: { ...summary, grade: g } };
    await saveSessionState(session!.id, final, { score: summary.percentage });
    setData(final);
    dataRef.current = final;
    const r = await finishRewards(before.current ?? (await getProfile()), { mode: next.options.mode, total: summary.total, percentage: summary.percentage, grade: g }, bonus, dagdoel);
    setRewards(r);
    void updateAppBadge(r.streakAfter);
  };

  /** Gewone modi: de kaart die nu aan de beurt is. */
  const onAnswer = useCallback(
    async (cardKey: string, correct: boolean, given = '') => {
      const d = dataRef.current;
      if (!d || !session || busy.current) return;
      const c = currentCard(d.engine);
      if (!c || c.key !== cardKey) return; // alleen de kaart die nú aan de beurt is
      busy.current = true;
      try {
        const { xp, now } = await record(c, correct, !d.engine.seen.includes(c.key));
        const engine = answerCard(d.engine, correct, given);
        const next: SessionData = { ...d, engine, xp: d.xp + xp, lastAnswerAt: now };
        if (isFinished(engine)) await complete(next, summarize(engine));
        else {
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

  /** Spellen: een willekeurige kaart (koppelen) of een vrije stroom (snel, leren). */
  const onGameAnswer = async (c: Card, correct: boolean, updateEngine?: (e: EngineState) => EngineState) => {
    const d = dataRef.current!;
    const firstTry = !d.engine.seen.includes(c.key);
    // Meteen bijwerken (ook "gezien"), zodat snelle antwoorden achter elkaar goed tellen.
    const engine = updateEngine ? updateEngine(d.engine) : { ...d.engine, seen: firstTry ? [...d.engine.seen, c.key] : d.engine.seen };
    dataRef.current = { ...d, engine };
    const { xp, now } = await record(c, correct, firstTry);
    const next = { ...dataRef.current, xp: dataRef.current.xp + xp, lastAnswerAt: now };
    setData(next);
    dataRef.current = next;
  };

  const restart = async (cards?: Card[]) => {
    if (!session || !data) return;
    const newId = await startSession({ listIds: session.listIds, ...data.options, onlyHard: false, cardKeys: cards?.map((c) => c.key) });
    navigate(`/oefenen/${newId}`, { replace: true });
  };

  if (session === null) return <NotFoundPage />;
  if (!session || !data || !mode) return null;

  if (data.summary) {
    return (
      <SummaryView
        mode={mode}
        summary={data.summary}
        grade={data.summary.grade}
        xp={data.xp}
        rewards={rewards}
        extra={extra}
        onRetryMistakes={(cards) => void restart(cards)}
        onAgain={() => void restart()}
      />
    );
  }

  const { done, total } = progress(data.engine);
  const cards = data.engine.cards;
  const listKey = session.listIds.slice().sort().join(',');
  const game = GAME_MODES.includes(mode);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (!game) toast('Oefening bewaard. Je kunt later verdergaan.');
            navigate('/oefenen');
          }}
          aria-label="Pauzeren en stoppen"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface-2 hover:text-ink"
        >
          <X size={22} />
        </button>
        {game ? (
          <p className="flex-1 text-center font-bold">{modeLabels[mode]}</p>
        ) : (
          <>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Voortgang" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
              <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${(done / total) * 100}%` }} />
            </div>
            <span className="w-16 shrink-0 text-right text-sm font-semibold text-ink-soft tabular-nums">
              {done}/{total}
            </span>
          </>
        )}
      </div>
      {!game && <p className="-mt-2 text-center text-sm font-semibold text-ink-soft">{modeLabels[mode]}</p>}

      {mode === 'koppelen' && (
        <MatchGame
          cards={cards}
          onPair={(key, ok) => {
            const c = cards.find((x) => x.key === key)!;
            void onGameAnswer(c, ok, (e) => answerKey(e, key, ok));
          }}
          onDone={async (seconds) => {
            const best = await getMeta(`koppelen:${listKey}`);
            const isRecord = best === undefined || seconds < best;
            if (isRecord) await db.meta.put({ key: `koppelen:${listKey}`, value: seconds });
            setExtra(`Tijd: ${seconds} seconden${isRecord ? '. Nieuw record!' : `. Record: ${best} s`}`);
            await complete(dataRef.current!, summarize(dataRef.current!.engine));
          }}
        />
      )}
      {mode === 'snel' && (
        <SpeedRound
          cards={cards}
          onAnswer={(c, ok) => void onGameAnswer(c, ok)}
          onDone={async (r) => {
            const score = r.answers.filter((a) => a.correct).length;
            const best = (await getMeta(`snel:${listKey}`)) ?? 0;
            if (score > best) await db.meta.put({ key: `snel:${listKey}`, value: score });
            setExtra(`Score: ${score}, beste combo: ${r.bestCombo}×${score > best ? '. Nieuw record!' : `. Record: ${best}`}`);
            const missed = [...new Map(r.answers.filter((a) => !a.correct).map((a) => [a.card.key, a.card])).values()];
            const n = r.answers.length;
            await complete(dataRef.current!, { total: n, correctFirstTry: score, percentage: n ? Math.round((score / n) * 100) : 0, missed });
          }}
        />
      )}
      {mode === 'leren' && (
        <LearnMode
          cards={cards}
          onAnswer={(c, ok) => void onGameAnswer(c, ok)}
          onDone={async (r) => {
            const missed = cards.filter((c) => r.missed.has(c.key));
            const n = cards.length;
            const correct = n - missed.length;
            await complete(dataRef.current!, { total: n, correctFirstTry: correct, percentage: Math.round((correct / n) * 100), missed });
          }}
        />
      )}

      {/* Geen uitgaande animatie: de nieuwe kaart staat er meteen, zodat snel typen nooit in de vorige kaart belandt. */}
      {card && !game && (
        <motion.div key={`${card.key}-${data.engine.answers.length}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}>
          {mode === 'flashcards' && <FlashcardView card={card} onAnswer={(knew) => void onAnswer(card.key, knew)} />}
          {(mode === 'typen' || mode === 'toets' || mode === 'luisteren') && (
            <TypeView card={card} test={mode === 'toets'} listen={mode === 'luisteren'} onAnswer={(ok, g) => void onAnswer(card.key, ok, g)} />
          )}
          {mode === 'meerkeuze' && <ChoiceView card={card} pool={cards} onAnswer={(ok, g) => void onAnswer(card.key, ok, g)} />}
        </motion.div>
      )}
    </div>
  );
}
