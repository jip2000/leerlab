import { describe, expect, it } from 'vitest';
import { endOfDay, isDue, mastery, schedule, startOfDay } from '@/features/srs/leitner';

const NOW = new Date(2026, 10, 9, 15, 30).getTime(); // 9 nov 15:30
const day = (d: number) => new Date(2026, 10, d).getTime();

describe('Leitner', () => {
  it('nieuw woord goed → bakje 1, morgen terug', () => {
    expect(schedule({ box: 0 }, true, NOW)).toEqual({ box: 1, interval: 1, dueAt: day(10) });
  });
  it('steeds goed → steeds langer wachten', () => {
    expect(schedule({ box: 1 }, true, NOW).dueAt).toBe(day(11));
    expect(schedule({ box: 2 }, true, NOW).dueAt).toBe(day(13));
    expect(schedule({ box: 3 }, true, NOW).dueAt).toBe(day(17));
    expect(schedule({ box: 4 }, true, NOW).dueAt).toBe(day(25));
  });
  it('blijft in bakje 5', () => {
    expect(schedule({ box: 5 }, true, NOW).box).toBe(5);
  });
  it('fout → terug naar bakje 1, nog vandaag', () => {
    expect(schedule({ box: 4 }, false, NOW)).toEqual({ box: 1, interval: 0, dueAt: NOW });
  });
  it('werkt over de maandgrens', () => {
    const nov30 = new Date(2026, 10, 30, 9).getTime();
    expect(schedule({ box: 2 }, true, nov30).dueAt).toBe(new Date(2026, 11, 4).getTime());
  });
  it('vandaag te herhalen = gepland vóór het eind van vandaag', () => {
    expect(isDue({ box: 2, dueAt: day(9) + 20 * 3600e3 }, NOW)).toBe(true);
    expect(isDue({ box: 2, dueAt: day(10) }, NOW)).toBe(false);
    expect(isDue({ box: 0, dueAt: 0 }, NOW)).toBe(false); // nog nooit geleerd
    expect(endOfDay(NOW) - startOfDay(NOW)).toBe(86_400_000 - 1);
  });
  it('telt gekend / bijna / nog leren', () => {
    expect(mastery([5, 4, 3, 2, 1], 7)).toEqual({ known: 2, almost: 2, learning: 3 });
  });
});
