import { describe, expect, it } from 'vitest';
import { starterLists, withArticle } from '@/data/starter';
import { languages } from '@/data/languages';

const allowedArticles: Record<string, string[]> = {
  it: ['il', 'la', "l'", 'lo'],
  pt: ['o', 'a'],
  sv: ['en', 'ett'],
  da: ['en', 'et'],
  no: ['en', 'ei', 'et'],
  el: ['ο', 'η', 'το'],
};

describe('startlijsten', () => {
  it('horen bij bestaande talen en hebben unieke ids', () => {
    const codes = new Set(languages.map((l) => l.code));
    for (const s of starterLists) expect(codes.has(s.lang)).toBe(true);
    expect(new Set(starterLists.map((s) => s.id)).size).toBe(starterLists.length);
  });

  it('bevatten geen lege of dubbele woorden', () => {
    for (const s of starterLists) {
      expect(s.words.length, s.id).toBeGreaterThanOrEqual(8);
      const lefts = s.words.map((w) => w[0]);
      expect(new Set(lefts).size, s.id).toBe(lefts.length);
      for (const [w, t] of s.words) {
        expect(w.trim(), s.id).toBe(w);
        expect(t.trim(), s.id).toBe(t);
        expect(w && t).toBeTruthy();
      }
    }
  });

  it('getallenlijsten hebben precies 1 t/m 10', () => {
    for (const s of starterLists.filter((s) => s.id.endsWith('getallen'))) {
      expect(s.words.map((w) => w[1])).toEqual(['een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien']);
    }
  });

  it('gebruiken alleen lidwoorden die in die taal bestaan', () => {
    for (const s of starterLists) {
      for (const [, , art] of s.words) {
        if (art) expect(allowedArticles[s.lang], `${s.id}: ${art}`).toContain(art);
      }
    }
  });

  it('plakt lidwoord en woord goed aan elkaar', () => {
    expect(withArticle('acqua', "l'")).toBe("l'acqua");
    expect(withArticle('bröd', 'ett')).toBe('ett bröd');
    expect(withArticle('chleb')).toBe('chleb');
  });
});
