import { describe, expect, it } from 'vitest';
import { candidates, pickQuestions, weight } from '@/features/verbs/trainer';
import { frEngine } from '@/features/verbs/fr';

describe('werkwoordtrainer', () => {
  it('maakt alleen bestaande combinaties (geen je bij de impératif)', () => {
    const pool = candidates(frEngine, ['parler'], ['present', 'imperatif'], [0, 1, 2, 3, 4, 5]);
    expect(pool.filter((q) => q.tense === 'present')).toHaveLength(6);
    expect(pool.filter((q) => q.tense === 'imperatif').map((q) => q.person)).toEqual([1, 3, 4]);
  });
  it('fouten wegen zwaarder', () => {
    expect(weight(undefined)).toBe(1);
    expect(weight({ correctCount: 0, wrongCount: 2 })).toBe(5);
    expect(weight({ correctCount: 10, wrongCount: 0 })).toBe(0.3);
  });
  it('kiest vaker de combinaties die je fout had', () => {
    const pool = candidates(frEngine, ['aller'], ['present'], [0, 1]);
    const stats = new Map([['fr:aller:present:0', { correctCount: 0, wrongCount: 3 }]]);
    let seed = 1;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const qs = pickQuestions(pool, 400, stats, 'fr', rnd);
    // Nooit twee keer dezelfde achter elkaar, dus hooguit de helft; wel meer dan "tu".
    expect(qs.filter((q) => q.person === 0).length).toBeGreaterThanOrEqual(qs.filter((q) => q.person === 1).length);
    for (let i = 1; i < qs.length; i++) expect(qs[i]).not.toEqual(qs[i - 1]);
  });
});
