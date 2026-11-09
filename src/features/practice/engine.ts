/**
 * OEFEN-MOTOR
 *
 * Houdt bij welke kaart aan de beurt is, wat goed en fout ging, en zet foute kaarten
 * later in de ronde opnieuw klaar. Alles is "puur" (geen database), zodat het makkelijk
 * te testen is en de hele sessie als JSON bewaard kan worden (pauzeren).
 */
import type { LanguageCode } from '@/data/languages';
import type { Direction, WordItem, WordList } from '@/db/types';
import { withArticle } from '@/data/starter';

export type Mode = 'flashcards' | 'typen' | 'meerkeuze' | 'toets';

export interface Card {
  key: string; // `${wordId}:${dir}`
  wordId: string;
  listId: string;
  dir: Direction;
  prompt: string;
  promptLang: LanguageCode;
  /** Antwoord zonder lidwoord; het lidwoord staat apart (alleen als het bij de antwoordkant hoort). */
  answer: string;
  answerArticle?: string;
  answerLang: LanguageCode;
  extra?: string; // voorbeeldzin, notitie… als hint na afloop
}

export interface SessionOptions {
  mode: Mode;
  direction: Direction | 'mix';
  shuffle: boolean;
}

export interface AnswerRecord {
  key: string;
  given: string;
  correct: boolean;
  firstTry: boolean;
}

export interface EngineState {
  mode: Mode;
  cards: Card[];
  queue: string[]; // keys die nog aan de beurt komen (vooraan = nu)
  answers: AnswerRecord[];
  /** Kaarten die minstens één keer fout gingen. */
  missed: string[];
  /** Kaarten die al minstens één keer gevraagd zijn. */
  seen: string[];
}

/** Zet woorden om in kaarten, met de gekozen richting. */
export function buildCards(
  words: WordItem[],
  lists: Map<string, Pick<WordList, 'langLeft' | 'langRight'>>,
  direction: SessionOptions['direction'],
  random: () => number = Math.random,
): Card[] {
  return words.flatMap((w): Card[] => {
    const list = lists.get(w.listId);
    if (!list) return [];
    const dir: Direction = direction === 'mix' ? (random() < 0.5 ? 'lr' : 'rl') : direction;
    const extra = [w.extraForms, w.example, w.note].filter(Boolean).join(' · ') || undefined;
    return dir === 'lr'
      ? [{ key: `${w.id}:lr`, wordId: w.id, listId: w.listId, dir, prompt: withArticle(w.left, w.article), promptLang: list.langLeft, answer: w.right, answerLang: list.langRight, extra }]
      : [{ key: `${w.id}:rl`, wordId: w.id, listId: w.listId, dir, prompt: w.right, promptLang: list.langRight, answer: w.left, answerArticle: w.article, answerLang: list.langLeft, extra }];
  });
}

export function shuffled<T>(items: T[], random: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function createEngine(cards: Card[], opts: SessionOptions, random: () => number = Math.random): EngineState {
  const ordered = opts.shuffle ? shuffled(cards, random) : cards;
  return { mode: opts.mode, cards: ordered, queue: ordered.map((c) => c.key), answers: [], missed: [], seen: [] };
}

export function currentCard(s: EngineState): Card | undefined {
  const key = s.queue[0];
  return key ? s.cards.find((c) => c.key === key) : undefined;
}

export const isFinished = (s: EngineState) => s.queue.length === 0;

/** Hoeveel plekken verderop een foute kaart terugkomt. */
const RETRY_GAP = 3;

/**
 * Verwerk een antwoord op de huidige kaart.
 * Fout (behalve in de toets) → de kaart komt een paar kaarten later terug.
 */
export function answerCard(s: EngineState, correct: boolean, given = ''): EngineState {
  const [key, ...rest] = s.queue;
  if (!key) return s;
  const firstTry = !s.seen.includes(key);
  const queue = [...rest];
  const missed = !correct && !s.missed.includes(key) ? [...s.missed, key] : s.missed;
  if (!correct && s.mode !== 'toets') queue.splice(Math.min(RETRY_GAP, queue.length), 0, key);
  return {
    ...s,
    queue,
    missed,
    seen: firstTry ? [...s.seen, key] : s.seen,
    answers: [...s.answers, { key, given, correct, firstTry }],
  };
}

export interface Summary {
  total: number;
  /** Goed bij de eerste poging. */
  correctFirstTry: number;
  percentage: number;
  missed: Card[];
}

export function summarize(s: EngineState): Summary {
  const total = s.cards.length;
  const correctFirstTry = s.answers.filter((a) => a.firstTry && a.correct).length;
  return {
    total,
    correctFirstTry,
    percentage: total ? Math.round((correctFirstTry / total) * 100) : 0,
    missed: s.cards.filter((c) => s.missed.includes(c.key)),
  };
}

/** Voortgang voor de balk bovenin: hoeveel kaarten zijn "af". */
export function progress(s: EngineState): { done: number; total: number } {
  const remaining = new Set(s.queue).size;
  return { done: s.cards.length - remaining, total: s.cards.length };
}
