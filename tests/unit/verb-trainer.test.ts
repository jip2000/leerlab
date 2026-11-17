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
    const pool = candidates(frEngine, ['aller', 'être'], ['present'], [0, 1, 2, 3, 4, 5]);
    const stats = new Map([['fr:aller:present:0', { correctCount: 0, wrongCount: 3 }]]);
    let seed = 1;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    let hard = 0;
    let other = 0;
    for (let k = 0; k < 300; k++) {
      const qs = pickQuestions(pool, 3, stats, 'fr', rnd);
      if (qs.some((q) => q.verb === 'aller' && q.person === 0)) hard++;
      if (qs.some((q) => q.verb === 'aller' && q.person === 1)) other++;
    }
    expect(hard).toBeGreaterThan(other * 2);
  });
  it('nooit twee keer dezelfde vraag in een ronde', () => {
    const pool = candidates(frEngine, ['aller', 'être'], ['present'], [0, 1, 2, 3, 4, 5]);
    const qs = pickQuestions(pool, 15, new Map(), 'fr');
    expect(qs).toHaveLength(12); // er zijn maar 12 combinaties
    expect(new Set(qs.map((q) => `${q.verb}:${q.person}`)).size).toBe(12);
    expect(pickQuestions(pool, 5, new Map(), 'fr')).toHaveLength(5);
  });
});
