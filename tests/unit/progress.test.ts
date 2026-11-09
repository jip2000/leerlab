import { describe, expect, it } from 'vitest';
import { addDays, applyFreezes, computeStreak, dayKey, weekDays } from '@/features/progress/streak';
import { levelFromXp, xpToNext } from '@/features/progress/xp';
import { badgeDefs, newlyEarned, type BadgeStats } from '@/features/progress/badges';

const T = '2026-11-09'; // maandag

describe('datums', () => {
  it('rekent over maand- en jaargrenzen', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
  it('geeft de week van maandag t/m zondag', () => {
    expect(weekDays('2026-11-11')).toEqual(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15']);
  });
});

describe('streak', () => {
  const days = (...ks: string[]) => new Set(ks);
  it('telt dagen op rij inclusief vandaag', () => {
    expect(computeStreak(days(T, addDays(T, -1), addDays(T, -2)), days(), T)).toEqual({ count: 3, todayDone: true });
  });
  it('loopt door als je vandaag nog niet hebt geoefend', () => {
    expect(computeStreak(days(addDays(T, -1), addDays(T, -2)), days(), T)).toEqual({ count: 2, todayDone: false });
  });
  it('is 0 als je gisteren én vandaag niet oefende', () => {
    expect(computeStreak(days(addDays(T, -2)), days(), T).count).toBe(0);
  });
  it('een bevroren dag houdt de streak heel', () => {
    expect(computeStreak(days(T, addDays(T, -2), addDays(T, -3)), days(addDays(T, -1)), T).count).toBe(3);
  });
});

describe('bevriezers', () => {
  const days = (...ks: string[]) => new Set(ks);
  it('bevriest één gemiste dag als je een bevriezer hebt', () => {
    expect(applyFreezes(days(addDays(T, -2)), days(), 1, T)).toEqual({ freeze: [addDays(T, -1)], freezesLeft: 0 });
  });
  it('doet niets als er te veel dagen gemist zijn', () => {
    expect(applyFreezes(days(addDays(T, -4)), days(), 2, T)).toEqual({ freeze: [], freezesLeft: 2 });
  });
  it('doet niets zonder bevriezers of zonder gemiste dag', () => {
    expect(applyFreezes(days(addDays(T, -2)), days(), 0, T).freeze).toEqual([]);
    expect(applyFreezes(days(addDays(T, -1)), days(), 2, T).freeze).toEqual([]);
  });
  it('doet niets als je nog nooit geoefend hebt', () => {
    expect(applyFreezes(days(), days(), 2, T).freeze).toEqual([]);
  });
});

describe('levels', () => {
  it('begint op level 1', () => {
    expect(levelFromXp(0)).toEqual({ level: 1, into: 0, needed: 100 });
  });
  it('wordt steeds iets moeilijker', () => {
    expect(xpToNext(1)).toBe(100);
    expect(xpToNext(2)).toBe(150);
    expect(levelFromXp(100)).toEqual({ level: 2, into: 0, needed: 150 });
    expect(levelFromXp(260).level).toBe(3);
  });
});

describe('badges', () => {
  const base: BadgeStats = { lists: 0, sessions: 0, streak: 0, correctTotal: 0, xp: 0, level: 1, goalReachedToday: false };
  it('hebben unieke ids', () => {
    expect(new Set(badgeDefs.map((b) => b.id)).size).toBe(badgeDefs.length);
  });
  it('geeft alleen nieuwe badges', () => {
    const s = { ...base, lists: 1, sessions: 1 };
    expect(newlyEarned(s, new Set()).map((b) => b.id)).toEqual(['eerste-lijst', 'eerste-oefening']);
    expect(newlyEarned(s, new Set(['eerste-lijst'])).map((b) => b.id)).toEqual(['eerste-oefening']);
  });
  it('foutloos telt alleen bij minstens 10 woorden', () => {
    expect(newlyEarned({ ...base, session: { mode: 'typen', total: 5, percentage: 100 } }, new Set())).toEqual([]);
    expect(newlyEarned({ ...base, session: { mode: 'typen', total: 10, percentage: 100 } }, new Set()).map((b) => b.id)).toEqual(['foutloos']);
  });
});
