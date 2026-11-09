import { describe, expect, it } from 'vitest';
import { answerCard, buildCards, createEngine, currentCard, isFinished, progress, summarize, type Card } from '@/features/practice/engine';
import { makeChoices } from '@/features/practice/choices';
import type { WordItem } from '@/db/types';

// Voorspelbare "toeval"-generator voor tests.
function seeded(seed = 1) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

const words: WordItem[] = [
  { id: 'a', listId: 'L', left: 'maison', right: 'huis', article: 'la', position: 0 },
  { id: 'b', listId: 'L', left: 'chien', right: 'hond', article: 'le', position: 1 },
  { id: 'c', listId: 'L', left: 'école', right: 'school', article: "l'", position: 2 },
  { id: 'd', listId: 'L', left: 'mer', right: 'zee', article: 'la', position: 3 },
  { id: 'e', listId: 'L', left: 'pain', right: 'brood', article: 'le', position: 4 },
];
const lists = new Map([['L', { langLeft: 'fr' as const, langRight: 'nl' as const }]]);

describe('kaarten maken', () => {
  it('links → rechts: lidwoord in de vraag', () => {
    const [c] = buildCards(words, lists, 'lr');
    expect(c).toMatchObject({ prompt: 'la maison', answer: 'huis', promptLang: 'fr', answerLang: 'nl' });
    expect(c!.answerArticle).toBeUndefined();
  });
  it('rechts → links: lidwoord bij het antwoord', () => {
    const [c] = buildCards(words, lists, 'rl');
    expect(c).toMatchObject({ prompt: 'huis', answer: 'maison', answerArticle: 'la', answerLang: 'fr' });
  });
  it('door elkaar: beide richtingen komen voor', () => {
    const dirs = buildCards(words, lists, 'mix', seeded(7)).map((c) => c.dir);
    expect(new Set(dirs).size).toBe(2);
  });
});

describe('sessie', () => {
  const cards = buildCards(words, lists, 'lr');

  it('op volgorde blijft de volgorde gelijk', () => {
    const s = createEngine(cards, { mode: 'typen', direction: 'lr', shuffle: false });
    expect(currentCard(s)!.wordId).toBe('a');
  });

  it('husselen verandert de volgorde maar houdt alle kaarten', () => {
    const s = createEngine(cards, { mode: 'typen', direction: 'lr', shuffle: true }, seeded(3));
    expect(s.queue).not.toEqual(cards.map((c) => c.key));
    expect([...s.queue].sort()).toEqual(cards.map((c) => c.key).sort());
  });

  it('een foute kaart komt 3 kaarten later terug', () => {
    let s = createEngine(cards, { mode: 'typen', direction: 'lr', shuffle: false });
    s = answerCard(s, false, 'fout');
    expect(s.queue).toEqual(['b:lr', 'c:lr', 'd:lr', 'a:lr', 'e:lr']);
    expect(progress(s)).toEqual({ done: 0, total: 5 });
  });

  it('aan het eind van de rij komt hij achteraan', () => {
    let s = createEngine(cards.slice(0, 2), { mode: 'flashcards', direction: 'lr', shuffle: false });
    s = answerCard(s, false);
    expect(s.queue).toEqual(['b:lr', 'a:lr']);
  });

  it('telt voor de score alleen de eerste poging', () => {
    let s = createEngine(cards, { mode: 'typen', direction: 'lr', shuffle: false });
    s = answerCard(s, false); // a fout
    while (!isFinished(s)) s = answerCard(s, true);
    const sum = summarize(s);
    expect(sum).toMatchObject({ total: 5, correctFirstTry: 4, percentage: 80 });
    expect(sum.missed.map((c) => c.wordId)).toEqual(['a']);
  });

  it('toets: elke kaart één keer, fout komt niet terug', () => {
    let s = createEngine(cards, { mode: 'toets', direction: 'lr', shuffle: false });
    s = answerCard(s, false);
    expect(s.queue).toHaveLength(4);
    while (!isFinished(s)) s = answerCard(s, true);
    expect(s.answers).toHaveLength(5);
  });

  it('is als JSON te bewaren en terug te laden (pauzeren)', () => {
    let s = createEngine(cards, { mode: 'typen', direction: 'lr', shuffle: false });
    s = answerCard(s, true);
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
});

describe('meerkeuze', () => {
  const cards = buildCards(words, lists, 'rl');
  it('geeft 4 unieke opties met precies één goede', () => {
    for (let seed = 1; seed < 20; seed++) {
      const opts = makeChoices(cards[0]!, cards, seeded(seed));
      expect(opts).toHaveLength(4);
      expect(new Set(opts).size).toBe(4);
      expect(opts.filter((o) => o === 'la maison')).toHaveLength(1);
    }
  });
  it('kiest bij voorkeur opties met hetzelfde lidwoord', () => {
    const opts = makeChoices(cards[0]!, cards, seeded(2), 2);
    expect(opts).toContain('la mer');
  });
  it('werkt ook met een kleine lijst', () => {
    expect(makeChoices(cards[0]!, cards.slice(0, 2), seeded(1))).toHaveLength(2);
  });
  it('gebruikt geen antwoorden in een andere taal', () => {
    const mixed: Card[] = [...cards, ...buildCards(words, lists, 'lr')];
    for (const o of makeChoices(cards[0]!, mixed, seeded(5))) expect(['huis', 'hond', 'school', 'zee', 'brood']).not.toContain(o);
  });
});
