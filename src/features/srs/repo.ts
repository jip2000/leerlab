import { db } from '@/db/db';
import { endOfDay } from './leitner';

/** Kaarten (woord + richting) die vandaag herhaald moeten worden. */
export async function dueToday(now = Date.now()) {
  const due = await db.reviews.where('dueAt').belowOrEqual(endOfDay(now)).filter((r) => r.box > 0).toArray();
  // Alleen woorden die nog bestaan.
  const words = await db.words.bulkGet(due.map((r) => r.wordId));
  return due.filter((_, i) => !!words[i]);
}

/** Per lijst: in welk bakje zit elk woord (hoogste van beide richtingen). */
export async function boxesForList(listId: string): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  for (const r of await db.reviews.where('listId').equals(listId).toArray()) map.set(r.wordId, Math.max(map.get(r.wordId) ?? 0, r.box));
  return map;
}

/** Start een herhaalsessie met alle kaarten die vandaag aan de beurt zijn. */
export async function startReview(): Promise<string | null> {
  const { startSession } = await import('@/features/practice/repo');
  const due = await dueToday();
  if (due.length === 0) return null;
  return startSession({
    listIds: [...new Set(due.map((r) => r.listId))],
    mode: 'typen',
    direction: 'lr',
    shuffle: true,
    onlyHard: false,
    cardKeys: due.map((r) => r.id),
  });
}
