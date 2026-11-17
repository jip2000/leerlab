/**
 * Vragen kiezen voor de werkwoordtrainer.
 * Combinaties (werkwoord + tijd + persoon) die je vaak fout had, komen vaker terug.
 */
import { db } from '@/db/db';
import type { LanguageCode } from '@/data/languages';
import type { VerbEngine } from './types';

export type VerbMode = 'los' | 'rijtje' | 'zin' | 'omgekeerd';

export interface VerbQuestion {
  verb: string;
  tense: string;
  person: number;
}

export interface Stat {
  correctCount: number;
  wrongCount: number;
}

export const statKey = (lang: string, q: VerbQuestion) => `${lang}:${q.verb}:${q.tense}:${q.person}`;

/** Gewicht: fout → vaker, goed → iets minder vaak. */
export function weight(s: Stat | undefined): number {
  if (!s) return 1;
  return Math.min(6, Math.max(0.3, 1 + 2 * s.wrongCount - 0.5 * s.correctCount));
}

export function candidates(engine: VerbEngine, verbs: string[], tenses: string[], persons: number[]): VerbQuestion[] {
  const out: VerbQuestion[] = [];
  for (const verb of verbs)
    for (const tense of tenses) {
      const t = engine.tenses.find((x) => x.id === tense);
      const forms = engine.conjugate(verb, tense);
      for (const person of persons) if ((t?.persons ?? [0, 1, 2, 3, 4, 5]).includes(person) && forms[person]) out.push({ verb, tense, person });
    }
  return out;
}

/**
 * Kiest n vragen, gewogen naar je fouten. Elke combinatie (werkwoord + tijd + persoon)
 * komt hooguit één keer voor: zijn er minder combinaties dan n, dan worden het er minder.
 * (Een fout antwoord komt tijdens het oefenen nog één keer terug; dat regelt de oefenpagina.)
 */
export function pickQuestions(pool: VerbQuestion[], n: number, stats: Map<string, Stat>, lang: string, random = Math.random): VerbQuestion[] {
  const left = pool.map((q) => ({ q, w: weight(stats.get(statKey(lang, q))) }));
  const out: VerbQuestion[] = [];
  while (out.length < n && left.length > 0) {
    const total = left.reduce((t, x) => t + x.w, 0);
    let r = random() * total;
    let idx = 0;
    while (idx < left.length - 1 && r >= left[idx]!.w) r -= left[idx++]!.w;
    out.push({ ...left[idx]!.q });
    left.splice(idx, 1);
  }
  return out;
}

export async function loadStats(lang: LanguageCode): Promise<Map<string, Stat>> {
  return new Map((await db.verbProgress.where('lang').equals(lang).toArray()).map((p) => [p.id, p]));
}

export async function recordVerb(lang: LanguageCode, q: VerbQuestion, correct: boolean) {
  const id = statKey(lang, q);
  await db.transaction('rw', db.verbProgress, async () => {
    const cur = (await db.verbProgress.get(id)) ?? { id, lang, verb: q.verb, tense: q.tense, person: String(q.person), correctCount: 0, wrongCount: 0 };
    await db.verbProgress.put({ ...cur, correctCount: cur.correctCount + (correct ? 1 : 0), wrongCount: cur.wrongCount + (correct ? 0 : 1) });
  });
}
