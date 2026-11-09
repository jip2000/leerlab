/**
 * Oefensessies bewaren, zodat je kunt pauzeren en later verder kunt.
 */
import { db, newId } from '@/db/db';
import type { PracticeSession, WordItem, WordList } from '@/db/types';
import { getWords } from '@/features/lists/repo';
import { buildCards, createEngine, toListening, type EngineState, type SessionOptions, type Summary } from './engine';

export interface SessionData {
  options: SessionOptions;
  engine: EngineState;
  xp: number;
  lastAnswerAt: number;
  summary?: Summary & { grade?: number };
  /** Hoe "voor" de sessie de streak en het level waren (voor de beloningen). */
}

export type StoredSession = PracticeSession & { state: SessionData };

export interface StartOptions extends SessionOptions {
  listIds: string[];
  onlyHard: boolean;
  /** Alleen deze kaarten (bijv. "oefen alleen je fouten"). */
  cardKeys?: string[];
}

/** Woorden die je minstens één keer fout had. */
export async function hardWordIds(listIds: string[]): Promise<Set<string>> {
  const reviews = await db.reviews.where('listId').anyOf(listIds).toArray();
  return new Set(reviews.filter((r) => r.wrongCount > 0).map((r) => r.wordId));
}

export async function startSession(o: StartOptions): Promise<string> {
  const lists = (await db.lists.bulkGet(o.listIds)).filter((l): l is WordList => !!l);
  let words: WordItem[] = (await Promise.all(lists.map((l) => getWords(l.id)))).flat();
  if (o.onlyHard) {
    const hard = await hardWordIds(o.listIds);
    words = words.filter((w) => hard.has(w.id));
  }
  let cards = buildCards(words, new Map(lists.map((l) => [l.id, l])), o.direction);
  if (o.cardKeys) {
    // Bij "alleen je fouten": precies dezelfde kaarten (en richting) als in de vorige ronde.
    const all = [...buildCards(words, new Map(lists.map((l) => [l.id, l])), 'lr'), ...buildCards(words, new Map(lists.map((l) => [l.id, l])), 'rl')];
    cards = o.cardKeys.map((k) => all.find((c) => c.key === k)).filter((c): c is NonNullable<typeof c> => !!c);
  }
  if (o.mode === 'luisteren') cards = cards.map(toListening);
  if (cards.length === 0) throw new Error('Geen woorden om te oefenen.');
  const id = newId();
  const now = Date.now();
  const options: SessionOptions = { mode: o.mode, direction: o.direction, shuffle: o.shuffle };
  const session: StoredSession = {
    id,
    type: o.mode,
    listIds: o.listIds,
    startedAt: now,
    answers: [],
    state: { options, engine: createEngine(cards, options), xp: 0, lastAnswerAt: now },
  };
  // Er is maar één onafgemaakte sessie tegelijk: oude wordt weggegooid.
  await discardOpenSessions();
  await db.sessions.add(session);
  return id;
}

export async function getSession(id: string): Promise<StoredSession | undefined> {
  return (await db.sessions.get(id)) as StoredSession | undefined;
}

export async function saveSessionState(id: string, state: SessionData, done?: { score: number }) {
  await db.sessions.update(id, { state, ...(done ? { endedAt: Date.now(), score: done.score } : {}) });
}

export async function openSession(): Promise<StoredSession | undefined> {
  const open = await db.sessions.filter((s) => !s.endedAt).toArray();
  return open.sort((a, b) => b.startedAt - a.startedAt)[0] as StoredSession | undefined;
}

export async function discardOpenSessions() {
  await db.sessions.filter((s) => !s.endedAt).delete();
}
