import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db/db';
import { finishRewards, getProfile, goalProgress, reconcileStreak, recordAnswer, recordWordResult } from '@/features/progress/repo';
import { addDays } from '@/features/progress/streak';

const T = '2026-11-09';
const goal = { type: 'woorden' as const, aantal: 3 };

beforeEach(async () => {
  await Promise.all([db.days.clear(), db.meta.clear(), db.badges.clear(), db.sessions.clear(), db.lists.clear(), db.reviews.clear()]);
});

describe('voortgang opslaan', () => {
  it('telt antwoorden en XP op per dag', async () => {
    await recordAnswer({ correct: true, xp: 10, seconds: 4 }, T);
    await recordAnswer({ correct: false, xp: 1, seconds: 6 }, T);
    const p = await getProfile(T);
    expect(p.today).toEqual({ id: T, xp: 11, answers: 2, correct: 1, seconds: 10 });
    expect(p.streak).toEqual({ count: 1, todayDone: true });
    expect(goalProgress(p.today, goal)).toEqual({ done: 1, target: 3, reached: false });
  });

  it('houdt goed/fout per woord bij', async () => {
    await recordWordResult({ wordId: 'w', listId: 'L', dir: 'lr', correct: false });
    await recordWordResult({ wordId: 'w', listId: 'L', dir: 'lr', correct: true });
    expect(await db.reviews.get('w:lr')).toMatchObject({ correctCount: 1, wrongCount: 1 });
  });

  it('gebruikt een bevriezer voor een gemiste dag', async () => {
    await recordAnswer({ correct: true, xp: 10, seconds: 1 }, addDays(T, -2));
    await db.meta.put({ key: 'freezes', value: 1 });
    expect(await reconcileStreak(T)).toBe(1);
    const p = await getProfile(T);
    expect(p.freezes).toBe(0);
    expect(p.streak.count).toBe(1);
    expect(p.week.get(addDays(T, -1))).toBe('bevroren');
  });

  it('deelt na een oefening badges, bonus-XP en een bevriezer uit', async () => {
    for (let i = 6; i >= 1; i--) await recordAnswer({ correct: true, xp: 10, seconds: 60 }, addDays(T, -i));
    const before = await getProfile(T);
    for (let i = 0; i < 3; i++) await recordAnswer({ correct: true, xp: 10, seconds: 5 }, T);
    await db.sessions.add({ id: 's', type: 'typen', listIds: [], startedAt: 1, endedAt: 2, answers: [] });
    const r = await finishRewards(before, { mode: 'typen', total: 3, percentage: 100 }, 20, goal, T);
    expect(r.streakBefore).toBe(6);
    expect(r.streakAfter).toBe(7);
    expect(r.freezeEarned).toBe(true);
    expect(r.goalJustReached).toBe(true);
    expect(r.badges.map((b) => b.id)).toEqual(expect.arrayContaining(['eerste-oefening', 'dagdoel', 'streak-3', 'streak-7']));
    const p = await getProfile(T);
    expect(p.freezes).toBe(1);
    expect(p.xp).toBe(60 * 1 + 30 + 20);
    // Nog een keer afronden geeft niet opnieuw dezelfde badges of bevriezer.
    const r2 = await finishRewards(p, { mode: 'typen', total: 3, percentage: 100 }, 20, goal, T);
    expect(r2.badges).toEqual([]);
    expect(r2.freezeEarned).toBe(false);
  });
});
