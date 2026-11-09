/**
 * Voortgang opslaan: XP en oefentijd per dag, streak, bevriezers en badges.
 */
import { db } from '@/db/db';
import type { DayActivity } from '@/db/types';
import { applyFreezes, computeStreak, dayKey, MAX_FREEZES, type StreakInfo } from './streak';
import { levelFromXp } from './xp';
import { newlyEarned, type BadgeDef, type BadgeStats } from './badges';
import type { Settings } from '@/lib/settings';
import { schedule } from '@/features/srs/leitner';

async function getMeta<T>(key: string, fallback: T): Promise<T> {
  return ((await db.meta.get(key))?.value as T | undefined) ?? fallback;
}
const setMeta = (key: string, value: unknown) => db.meta.put({ key, value });

/** Telt een antwoord op bij vandaag. Seconden = actieve oefentijd sinds het vorige antwoord. */
export async function recordAnswer(a: { correct: boolean; xp: number; seconds: number }, today = dayKey()): Promise<void> {
  await db.transaction('rw', db.days, async () => {
    const d: DayActivity = (await db.days.get(today)) ?? { id: today, xp: 0, answers: 0, correct: 0, seconds: 0 };
    await db.days.put({
      ...d,
      xp: d.xp + a.xp,
      answers: d.answers + 1,
      correct: d.correct + (a.correct ? 1 : 0),
      seconds: d.seconds + Math.max(0, Math.round(a.seconds)),
    });
  });
}

export async function addXp(xp: number, today = dayKey()): Promise<void> {
  await db.transaction('rw', db.days, async () => {
    const d: DayActivity = (await db.days.get(today)) ?? { id: today, xp: 0, answers: 0, correct: 0, seconds: 0 };
    await db.days.put({ ...d, xp: d.xp + xp });
  });
}

/**
 * Houdt per woord bij hoe vaak het goed en fout ging (voor "alleen moeilijke woorden")
 * en plant de volgende herhaling (Leitner-bakjes).
 */
export async function recordWordResult(r: { wordId: string; listId: string; dir: 'lr' | 'rl'; correct: boolean }, now = Date.now()) {
  const id = `${r.wordId}:${r.dir}`;
  await db.transaction('rw', db.reviews, async () => {
    const cur = (await db.reviews.get(id)) ?? {
      id, wordId: r.wordId, listId: r.listId, direction: r.dir, box: 0, interval: 0, ease: 2.5, dueAt: 0, correctCount: 0, wrongCount: 0,
    };
    await db.reviews.put({
      ...cur,
      ...schedule(cur, r.correct, now),
      correctCount: cur.correctCount + (r.correct ? 1 : 0),
      wrongCount: cur.wrongCount + (r.correct ? 0 : 1),
    });
  });
}

async function verbsCorrect(): Promise<number> {
  let n = 0;
  await db.verbProgress.each((p) => (n += p.correctCount));
  return n;
}

async function activeAndFrozen() {
  const days = await db.days.toArray();
  const active = new Set(days.filter((d) => d.answers > 0).map((d) => d.id));
  const frozen = new Set(await getMeta<string[]>('frozenDays', []));
  return { days, active, frozen };
}

/**
 * Bij het openen van de app: gemiste dagen bevriezen als dat kan.
 * Geeft het aantal bevroren dagen terug (voor een melding).
 */
export async function reconcileStreak(today = dayKey()): Promise<number> {
  const { active, frozen } = await activeAndFrozen();
  const freezes = await getMeta('freezes', 0);
  const { freeze, freezesLeft } = applyFreezes(active, frozen, freezes, today);
  if (freeze.length === 0) return 0;
  await setMeta('frozenDays', [...frozen, ...freeze]);
  await setMeta('freezes', freezesLeft);
  return freeze.length;
}

export interface Profile {
  streak: StreakInfo;
  freezes: number;
  xp: number;
  level: ReturnType<typeof levelFromXp>;
  correctTotal: number;
  today: DayActivity;
  week: Map<string, 'actief' | 'bevroren'>;
  badges: Map<string, number>;
}

export async function getProfile(today = dayKey()): Promise<Profile> {
  const { days, active, frozen } = await activeAndFrozen();
  const xp = days.reduce((s, d) => s + d.xp, 0);
  const week = new Map<string, 'actief' | 'bevroren'>();
  for (const k of frozen) week.set(k, 'bevroren');
  for (const k of active) week.set(k, 'actief');
  return {
    streak: computeStreak(active, frozen, today),
    freezes: await getMeta('freezes', 0),
    xp,
    level: levelFromXp(xp),
    correctTotal: days.reduce((s, d) => s + d.correct, 0),
    today: days.find((d) => d.id === today) ?? { id: today, xp: 0, answers: 0, correct: 0, seconds: 0 },
    week,
    badges: new Map((await db.badges.toArray()).map((b) => [b.id, b.earnedAt])),
  };
}

export function goalProgress(today: DayActivity, goal: Settings['dagdoel']): { done: number; target: number; reached: boolean } {
  const done = goal.type === 'minuten' ? Math.floor(today.seconds / 60) : today.correct;
  return { done, target: goal.aantal, reached: done >= goal.aantal };
}

export interface Rewards {
  streakBefore: number;
  streakAfter: number;
  levelBefore: number;
  levelAfter: number;
  freezeEarned: boolean;
  goalJustReached: boolean;
  badges: BadgeDef[];
}

/**
 * Na een oefening: bonus-XP geven, bevriezer verdienen, nieuwe badges uitdelen.
 * `before` is het profiel van vóór de oefening.
 */
export async function finishRewards(
  before: Profile,
  session: NonNullable<BadgeStats['session']>,
  bonusXp: number,
  goal: Settings['dagdoel'],
  today = dayKey(),
): Promise<Rewards> {
  if (bonusXp > 0) await addXp(bonusXp, today);
  let after = await getProfile(today);

  // Bevriezer verdienen bij elke 7 dagen streak (één keer per mijlpaal).
  let freezeEarned = false;
  const lastAward = await getMeta('freezeAwardStreak', 0);
  if (after.streak.count > 0 && after.streak.count % 7 === 0 && after.streak.count !== lastAward && after.freezes < MAX_FREEZES) {
    await setMeta('freezes', after.freezes + 1);
    await setMeta('freezeAwardStreak', after.streak.count);
    freezeEarned = true;
    after = await getProfile(today);
  }

  const goalBefore = goalProgress(before.today, goal).reached;
  const goalAfter = goalProgress(after.today, goal).reached;
  const stats: BadgeStats = {
    lists: await db.lists.count(),
    sessions: await db.sessions.filter((s) => !!s.endedAt).count(),
    streak: after.streak.count,
    correctTotal: after.correctTotal,
    xp: after.xp,
    level: after.level.level,
    goalReachedToday: goalAfter,
    verbsCorrect: await verbsCorrect(),
    session,
  };
  const badges = newlyEarned(stats, new Set(after.badges.keys()));
  const now = Date.now();
  await db.badges.bulkPut(badges.map((b) => ({ id: b.id, earnedAt: now })));

  return {
    streakBefore: before.streak.count,
    streakAfter: after.streak.count,
    levelBefore: before.level.level,
    levelAfter: after.level.level,
    freezeEarned,
    goalJustReached: !goalBefore && goalAfter,
    badges,
  };
}

/** Badges die je zonder te oefenen kunt halen (bijv. "Eerste lijst"). */
export async function checkQuietBadges(): Promise<BadgeDef[]> {
  const p = await getProfile();
  const stats: BadgeStats = {
    lists: await db.lists.count(),
    sessions: await db.sessions.filter((s) => !!s.endedAt).count(),
    streak: p.streak.count,
    correctTotal: p.correctTotal,
    xp: p.xp,
    level: p.level.level,
    goalReachedToday: false,
    verbsCorrect: await verbsCorrect(),
  };
  const badges = newlyEarned(stats, new Set(p.badges.keys()));
  await db.badges.bulkPut(badges.map((b) => ({ id: b.id, earnedAt: Date.now() })));
  return badges;
}
