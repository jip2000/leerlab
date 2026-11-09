/**
 * SLIM HERHALEN met het Leitner-systeem (5 bakjes).
 *
 * - Goed → het woord gaat een bakje verder en komt pas later terug.
 * - Fout → terug naar bakje 1: morgen (of nog vandaag) opnieuw.
 *
 *   bakje:      1    2    3    4    5
 *   wachten:    1    2    4    8   16 dagen
 */
import type { ReviewState } from '@/db/types';

export const BOX_DAYS = [0, 1, 2, 4, 8, 16] as const; // index = bakje
export const MAX_BOX = 5;
const DAY = 24 * 60 * 60 * 1000;

export function startOfDay(t: number): number {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function endOfDay(t: number): number {
  return startOfDay(t) + DAY - 1;
}

/** Nieuwe planning na een antwoord. */
export function schedule(state: Pick<ReviewState, 'box'>, correct: boolean, now: number): { box: number; interval: number; dueAt: number } {
  if (!correct) return { box: 1, interval: 0, dueAt: now }; // nog vandaag terug
  const box = Math.min(MAX_BOX, Math.max(1, state.box + 1));
  const interval = BOX_DAYS[box]!;
  // Gebruik kalenderdagen, zodat "over 2 dagen" niet afhangt van het uur.
  const d = new Date(startOfDay(now));
  d.setDate(d.getDate() + interval);
  return { box, interval, dueAt: d.getTime() };
}

export function isDue(r: Pick<ReviewState, 'dueAt' | 'box'>, now: number): boolean {
  return r.box > 0 && r.dueAt <= endOfDay(now);
}

/** Hoe goed ken je een lijst: groen (bakje 4-5), oranje (2-3), rood (1 of nooit gezien). */
export function mastery(boxes: number[], total: number): { known: number; almost: number; learning: number } {
  const known = boxes.filter((b) => b >= 4).length;
  const almost = boxes.filter((b) => b === 2 || b === 3).length;
  return { known, almost, learning: total - known - almost };
}
