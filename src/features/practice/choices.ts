/**
 * Foute opties voor meerkeuze. Ze komen uit dezelfde kaarten en lijken bij voorkeur
 * op het goede antwoord: ongeveer even lang, zelfde soort begin (lidwoord, "to ", "se ").
 */
import type { Card } from './engine';
import { shuffled } from './engine';
import { withArticle } from '@/data/starter';

export const shownAnswer = (c: Card) => withArticle(c.answer, c.answerArticle);

function firstWord(s: string) {
  return s.split(/\s+/)[0]!.toLowerCase();
}

function similarity(a: string, b: string): number {
  let score = -Math.abs(a.length - b.length);
  if (a.includes(' ') === b.includes(' ')) score += 2;
  if (firstWord(a) === firstWord(b)) score += 3; // zelfde lidwoord of hulpwoord
  return score;
}

/** Geeft 4 (of minder, bij een kleine lijst) unieke opties terug, in willekeurige volgorde. */
export function makeChoices(card: Card, pool: Card[], random: () => number = Math.random, count = 4): string[] {
  const right = shownAnswer(card);
  const candidates = [...new Set(pool.filter((c) => c.key !== card.key && c.answerLang === card.answerLang).map(shownAnswer))].filter(
    (a) => a.toLowerCase() !== right.toLowerCase(),
  );
  // Sorteer op gelijkenis, met een beetje toeval zodat het niet steeds dezelfde opties zijn.
  const ranked = shuffled(candidates, random)
    .map((a) => ({ a, s: similarity(a, right) + random() * 2 }))
    .sort((x, y) => y.s - x.s)
    .map((x) => x.a);
  return shuffled([right, ...ranked.slice(0, count - 1)], random);
}
