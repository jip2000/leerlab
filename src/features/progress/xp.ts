import type { Mode } from '@/features/practice/engine';

/** XP per goed antwoord, per oefenvorm. Een fout antwoord geeft 1 XP (je deed wel je best). */
export const XP_PER_CORRECT: Record<Mode, number> = { flashcards: 5, meerkeuze: 8, typen: 10, toets: 10, luisteren: 10, koppelen: 4, snel: 4, leren: 6 };
export const XP_WRONG = 1;
export const XP_FINISH = 20;
export const XP_PERFECT = 20;

export function xpForAnswer(mode: Mode, correct: boolean): number {
  return correct ? XP_PER_CORRECT[mode] : XP_WRONG;
}

/** XP nodig om van level n naar n+1 te gaan. */
export const xpToNext = (level: number) => 100 + 50 * (level - 1);

export function levelFromXp(xp: number): { level: number; into: number; needed: number } {
  let level = 1;
  let rest = xp;
  while (rest >= xpToNext(level)) {
    rest -= xpToNext(level);
    level++;
  }
  return { level, into: rest, needed: xpToNext(level) };
}
