import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame, RotateCcw, Snowflake, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import type { Rewards } from '@/features/progress/repo';
import { celebrate, stopConfetti } from '@/lib/confetti';
import { formatGrade } from '@/lib/grade';
import { play } from '@/lib/sounds';
import type { Card, Mode, Summary } from '../engine';
import { shownAnswer } from '../choices';

const cheer = (p: number) =>
  p === 100 ? 'Alles goed, top!' : p >= 80 ? 'Lekker bezig!' : p >= 55 ? 'Goed geoefend. Nog even de fouten?' : 'Goed dat je oefent. Morgen weer verder?';

/** Uitslag na een oefening, met beloningen. */
export function SummaryView({
  mode, summary, grade, xp, rewards, extra, onRetryMistakes, onAgain,
}: {
  extra?: string;
  mode: Mode;
  summary: Summary;
  grade?: number;
  xp: number;
  rewards?: Rewards;
  onRetryMistakes: (cards: Card[]) => void;
  onAgain: () => void;
}) {
  const levelUp = rewards && rewards.levelAfter > rewards.levelBefore;
  const streakUp = rewards && rewards.streakAfter > rewards.streakBefore;

  useEffect(() => stopConfetti, []);

  useEffect(() => {
    if (!rewards) return;
    const special = summary.percentage === 100 || rewards.badges.length > 0 || levelUp;
    play(special ? 'beloning' : 'klaar');
    if (special) celebrate(summary.percentage === 100 || !!levelUp);
  }, [rewards]); // alleen als de beloningen binnen zijn

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <div className="flex flex-col items-center gap-1 rounded-[28px] border border-line bg-surface px-6 py-8 text-center shadow-soft">
        {mode === 'toets' && grade !== undefined ? (
          <>
            <span className="text-sm font-semibold text-ink-soft">Je cijfer</span>
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className={`text-[72px] leading-none font-extrabold tracking-[-0.04em] ${grade >= 5.5 ? 'text-primary-ink' : 'text-danger'}`}
            >
              <span className="marker">{formatGrade(grade)}</span>
            </motion.span>
            <span className="mt-1 text-ink-soft">
              {summary.correctFirstTry} van {summary.total} goed ({summary.percentage}%)
            </span>
          </>
        ) : (
          <>
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="text-[64px] leading-none font-extrabold tracking-[-0.04em]"
            >
              <span className="marker">{summary.percentage}%</span>
            </motion.span>
            <span className="mt-1 text-ink-soft">
              {summary.correctFirstTry} van {summary.total} in één keer goed
            </span>
          </>
        )}
        <p className="mt-3 text-lg font-bold">{cheer(summary.percentage)}</p>
        {extra && <p className="mt-1 font-semibold text-primary-ink">{extra}</p>}
      </div>

      {/* Beloningen */}
      <ul className="grid grid-cols-2 gap-2" aria-label="Beloningen">
        <li className="flex items-center gap-3 rounded-2xl bg-primary-soft p-3">
          <span className="text-2xl font-extrabold text-primary-ink">+{xp}</span>
          <span className="text-sm font-semibold text-primary-ink">XP verdiend</span>
        </li>
        <li className="flex items-center gap-3 rounded-2xl bg-marker/40 p-3">
          <motion.span
            animate={streakUp ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-marker-ink"
          >
            <Flame size={26} aria-hidden="true" />
          </motion.span>
          <span className="text-sm font-semibold">
            {rewards ? `${rewards.streakAfter} ${rewards.streakAfter === 1 ? 'dag' : 'dagen'} op rij` : '…'}
            {streakUp && <span className="block text-xs">Streak verlengd!</span>}
          </span>
        </li>
        {levelUp && (
          <li className="col-span-2 rounded-2xl bg-primary p-3 text-center font-extrabold text-on-primary">🚀 Level {rewards.levelAfter} bereikt!</li>
        )}
        {rewards?.goalJustReached && (
          <li className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border-2 border-primary p-3 font-bold text-primary-ink">
            <Target size={20} aria-hidden="true" /> Dagdoel gehaald!
          </li>
        )}
        {rewards?.freezeEarned && (
          <li className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border-2 border-line p-3 font-bold">
            <Snowflake size={20} aria-hidden="true" className="text-[#2F6FDB]" /> Bevriezer verdiend: mis je een dag, dan blijft je streak heel.
          </li>
        )}
      </ul>

      {rewards && rewards.badges.length > 0 && (
        <section>
          <h2 className="mb-2 font-bold">Nieuwe {rewards.badges.length === 1 ? 'badge' : 'badges'}</h2>
          <ul className="grid gap-2">
            {rewards.badges.map((b, i) => (
              <motion.li
                key={b.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"
              >
                <span className="text-3xl" aria-hidden="true">
                  {b.emoji}
                </span>
                <span>
                  <span className="block font-bold">{b.title}</span>
                  <span className="block text-sm text-ink-soft">{b.description}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      {summary.missed.length > 0 && (
        <section>
          <h2 className="mb-2 font-bold">Deze had je fout</h2>
          <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
            {summary.missed.map((c) => (
              <li key={c.key} className="grid grid-cols-2 gap-3 px-4 py-2.5">
                <span lang={c.promptLang}>{c.prompt}</span>
                <span className="font-semibold" lang={c.answerLang}>
                  {shownAnswer(c)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col gap-2">
        {summary.missed.length > 0 && (
          <Button size="lg" className="justify-center" onClick={() => onRetryMistakes(summary.missed)}>
            Oefen alleen je fouten ({summary.missed.length})
          </Button>
        )}
        <Button size="lg" variant="secondary" className="justify-center" icon={<RotateCcw size={18} aria-hidden="true" />} onClick={onAgain}>
          Nog een keer
        </Button>
        <ButtonLink to="/" variant="secondary" className="h-13 justify-center">
          Klaar
        </ButtonLink>
      </div>
    </div>
  );
}
