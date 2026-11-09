import { describe, expect, it } from 'vitest';
import { dailyMinutes, heatmap, niceMax, weeklyMinutes } from '@/features/stats/data';

const T = '2026-11-11'; // woensdag
const days = [
  { id: '2026-11-11', xp: 50, answers: 20, correct: 15, seconds: 600 },
  { id: '2026-11-10', xp: 10, answers: 5, correct: 5, seconds: 90 },
  { id: '2026-11-02', xp: 10, answers: 40, correct: 30, seconds: 1200 },
];

describe('statistieken', () => {
  it('minuten per dag, laatste dag = vandaag', () => {
    const p = dailyMinutes(days, T, 7);
    expect(p).toHaveLength(7);
    expect(p.at(-1)).toMatchObject({ key: T, value: 10 });
    expect(p.at(-2)!.value).toBe(2);
    expect(p[0]!.value).toBe(0);
  });
  it('minuten per week', () => {
    const p = weeklyMinutes(days, T, 2);
    expect(p.map((x) => x.value)).toEqual([20, 12]); // week van 2 nov: 20 min; deze week: 10 + 1,5 → 12
  });
  it('heatmap: niveaus 0–4, toekomst gemarkeerd', () => {
    const h = heatmap(days, T, 2);
    expect(h).toHaveLength(2);
    expect(h[1]![2]).toMatchObject({ date: T, level: 2, future: false }); // 20 van max 40 → 2
    expect(h[0]![0]).toMatchObject({ date: '2026-11-02', level: 4 });
    expect(h[1]![6]!.future).toBe(true);
  });
  it('mooie maximumwaarde', () => {
    expect(niceMax(0)).toBe(10);
    expect(niceMax(12)).toBe(20);
    expect(niceMax(700)).toBe(700);
  });
});
