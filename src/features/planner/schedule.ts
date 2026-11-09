/**
 * LEERSCHEMA voor een toets.
 *
 * - Woorden worden verdeeld over de dagen tot de toets (niet op de toetsdag zelf).
 * - De laatste 2 dagen (bij weinig tijd: de laatste dag) herhaal je alles.
 * - Elke dag krijgt een schatting in minuten.
 */
import { addDays, dayKey } from '@/features/progress/streak';

export interface ListSize {
  listId: string;
  title: string;
  words: number;
}

export type Task =
  | { kind: 'leren'; listId: string; title: string; from: number; to: number } // woorden [from, to)
  | { kind: 'herhalen'; listIds: string[]; words: number }
  | { kind: 'grammatica'; topicIds: string[] };

export interface PlanDay {
  date: string;
  tasks: Task[];
  minutes: number;
}

const MIN_PER_NEW = 0.6;
const MIN_PER_REVIEW = 0.25;

export function daysBetween(from: string, to: string): number {
  const [a, b] = [from, to].map((d) => {
    const [y, m, dd] = d.split('-').map(Number) as [number, number, number];
    return Date.UTC(y, m - 1, dd);
  });
  return Math.round((b! - a!) / 86_400_000);
}

export function makePlan(today: string, testDate: string, lists: ListSize[], topicIds: string[] = []): PlanDay[] {
  const days = daysBetween(today, testDate); // dagen vóór de toets
  if (days <= 0) return [];
  const total = lists.reduce((s, l) => s + l.words, 0);
  const reviewDays = days >= 4 ? 2 : 1;
  const learnDays = Math.max(1, days - reviewDays);
  const plan: PlanDay[] = Array.from({ length: days }, (_, i) => ({ date: addDays(today, i), tasks: [], minutes: 0 }));

  // Alle woorden achter elkaar, eerlijk verdeeld over de leerdagen.
  const flat: { listId: string; title: string; index: number }[] = [];
  for (const l of lists) for (let i = 0; i < l.words; i++) flat.push({ listId: l.listId, title: l.title, index: i });
  const perDay = Math.ceil(flat.length / learnDays);
  for (let d = 0; d < learnDays; d++) {
    const chunk = flat.slice(d * perDay, (d + 1) * perDay);
    // Groepeer per lijst (een dag kan het eind van lijst A en het begin van lijst B hebben).
    const byList = new Map<string, { title: string; from: number; to: number }>();
    for (const w of chunk) {
      const e = byList.get(w.listId);
      if (e) e.to = w.index + 1;
      else byList.set(w.listId, { title: w.title, from: w.index, to: w.index + 1 });
    }
    for (const [listId, e] of byList) plan[d]!.tasks.push({ kind: 'leren', listId, ...e });
    plan[d]!.minutes += Math.ceil(chunk.length * MIN_PER_NEW);
    // Vanaf dag 2: ook even herhalen wat je al geleerd hebt.
    if (d > 0 && d * perDay > 0) plan[d]!.minutes += Math.ceil(Math.min(d * perDay, total) * MIN_PER_REVIEW * 0.5);
  }
  for (let d = learnDays; d < days; d++) {
    plan[d]!.tasks.push({ kind: 'herhalen', listIds: lists.map((l) => l.listId), words: total });
    plan[d]!.minutes += Math.max(5, Math.ceil(total * MIN_PER_REVIEW));
  }
  if (topicIds.length) {
    // Grammatica: halverwege en op de laatste dag.
    for (const d of new Set([Math.floor((days - 1) / 2), days - 1])) {
      plan[d]!.tasks.push({ kind: 'grammatica', topicIds });
      plan[d]!.minutes += 5 * topicIds.length;
    }
  }
  for (const p of plan) p.minutes = Math.max(p.minutes, p.tasks.length ? 5 : 0);
  return plan;
}

export const todayKey = () => dayKey();

export function describeTask(t: Task): string {
  if (t.kind === 'leren') return `${t.title}: woord ${t.from + 1}–${t.to} leren`;
  if (t.kind === 'herhalen') return `Alles herhalen (${t.words} woorden)`;
  return 'Grammatica oefenen';
}
