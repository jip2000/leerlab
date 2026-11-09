/** Gegevens voor de grafieken, uit de dagactiviteit. */
import type { DayActivity } from '@/db/types';
import { addDays, weekDays } from '@/features/progress/streak';

export interface Point {
  key: string;
  label: string;
  value: number;
}

const fmtDay = (d: string) => new Date(`${d}T12:00`).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });

/** Minuten per dag voor de laatste n dagen (t/m vandaag). */
export function dailyMinutes(days: DayActivity[], today: string, n = 14): Point[] {
  const m = new Map(days.map((d) => [d.id, d.seconds]));
  return Array.from({ length: n }, (_, i) => {
    const key = addDays(today, i - n + 1);
    return { key, label: fmtDay(key), value: Math.round((m.get(key) ?? 0) / 60) };
  });
}

/** Minuten per week (ma–zo) voor de laatste n weken. */
export function weeklyMinutes(days: DayActivity[], today: string, n = 12): Point[] {
  const m = new Map(days.map((d) => [d.id, d.seconds]));
  const monday = weekDays(today)[0]!;
  return Array.from({ length: n }, (_, i) => {
    const start = addDays(monday, (i - n + 1) * 7);
    let s = 0;
    for (let d = 0; d < 7; d++) s += m.get(addDays(start, d)) ?? 0;
    return { key: start, label: `wk ${fmtDay(start)}`, value: Math.round(s / 60) };
  });
}

/** Kalender: weken (kolommen) × dagen (ma–zo), met niveau 0–4 op basis van het aantal antwoorden. */
export function heatmap(days: DayActivity[], today: string, weeks = 20): { date: string; answers: number; level: number; future: boolean }[][] {
  const m = new Map(days.map((d) => [d.id, d.answers]));
  const max = Math.max(1, ...days.map((d) => d.answers));
  const monday = weekDays(today)[0]!;
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = addDays(monday, (w - weeks + 1) * 7 + d);
      const answers = m.get(date) ?? 0;
      const level = answers === 0 ? 0 : Math.min(4, Math.ceil((answers / max) * 4));
      return { date, answers, level, future: date > today };
    }),
  );
}

/** Mooie bovengrens voor de y-as: 0, 5, 10, 15, 20, 30, 60 … */
export function niceMax(v: number): number {
  // Even getallen, zodat de middelste lijn ook een heel getal is.
  for (const n of [10, 20, 30, 40, 60, 80, 120, 160, 240, 300, 480, 600]) if (v <= n) return n;
  return Math.ceil(v / 100) * 100;
}
