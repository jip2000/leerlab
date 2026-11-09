/**
 * STREAK: hoeveel dagen op rij je hebt geoefend.
 *
 * - Een dag telt als je die dag minstens één vraag hebt beantwoord.
 * - Heb je vandaag nog niet geoefend, dan loopt je streak nog door tot middernacht.
 * - Bevriezer (🧊): mis je een dag, dan wordt automatisch een bevriezer gebruikt
 *   en blijft je streak heel. Je verdient er één bij elke 7 dagen streak (max. 2).
 */

/** Datum als "2026-11-09" in de eigen tijdzone. */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return dayKey(new Date(y, m - 1, d + n));
}

export const MAX_FREEZES = 2;

export interface StreakInfo {
  count: number;
  todayDone: boolean;
}

export function computeStreak(active: Set<string>, frozen: Set<string>, today: string): StreakInfo {
  const counts = (k: string) => active.has(k) || frozen.has(k);
  const todayDone = active.has(today);
  let day = counts(today) ? today : addDays(today, -1);
  let count = 0;
  while (counts(day)) {
    if (active.has(day)) count++; // bevroren dagen houden de streak heel, maar tellen niet mee
    day = addDays(day, -1);
  }
  return { count, todayDone };
}

/**
 * Kijkt of er gemiste dagen zijn sinds de laatste oefendag (vóór vandaag).
 * Zijn het er niet meer dan je bevriezers, dan worden ze bevroren.
 */
export function applyFreezes(
  active: Set<string>,
  frozen: Set<string>,
  freezes: number,
  today: string,
): { freeze: string[]; freezesLeft: number } {
  const counts = (k: string) => active.has(k) || frozen.has(k);
  const gap: string[] = [];
  let day = addDays(today, -1);
  // Zoek maximaal een maand terug naar de laatste dag die meetelt.
  for (let i = 0; i < 31 && !counts(day); i++) {
    gap.push(day);
    day = addDays(day, -1);
  }
  const hasEarlier = counts(day);
  if (!hasEarlier || gap.length === 0 || gap.length > freezes) return { freeze: [], freezesLeft: freezes };
  return { freeze: gap, freezesLeft: freezes - gap.length };
}

/** Week (ma t/m zo) rond vandaag, voor de bolletjes op de beginpagina. */
export function weekDays(today: string): string[] {
  const [y, m, d] = today.split('-').map(Number) as [number, number, number];
  const weekday = (new Date(y, m - 1, d).getDay() + 6) % 7; // 0 = maandag
  return Array.from({ length: 7 }, (_, i) => addDays(today, i - weekday));
}
