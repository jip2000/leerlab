import { describe, expect, it } from 'vitest';
import { verbEngines } from '@/features/verbs/registry';
import { hasLevels, levelSentence } from '@/features/verbs/levels';
import type { LanguageCode } from '@/data/languages';

const make = (lang: LanguageCode, verb: string, tense: string, person: number, level: 1 | 2 | 3) => {
  const e = verbEngines[lang]!;
  const s = levelSentence(lang, e.sentence(verb, tense, person), { verb, tense, person }, level);
  return s ? `${s.before}___${s.after}` : '';
};

describe('moeilijkheid van de zinnen', () => {
  it('makkelijk = de zin van de motor', () => {
    expect(make('de', 'machen', 'praesens', 0, 1)).toBe('Ich ___ (jetzt)');
  });

  it('gemiddeld en moeilijk: langer, met een echt onderwerp bij hij/zij', () => {
    const m = make('de', 'machen', 'perfekt', 2, 2);
    expect(m).toMatch(/„(Mein Bruder|Der Nachbar|Paul) ___ \(gestern\)“$/);
    const h = make('de', 'machen', 'perfekt', 5, 3);
    expect(h).toMatch(/„(Meine Eltern|Die Nachbarn|Meine Freunde) ___/);
    expect(h.length).toBeGreaterThan(100);
  });

  it('Frans: "qu’il" wordt "que mon frère", hoofdletter blijft', () => {
    expect(make('fr', 'parler', 'subjonctif', 2, 2)).toMatch(/Il faut que (mon frère|le voisin|Paul) ___/);
    expect(make('fr', 'parler', 'plus-que-parfait', 5, 2)).toMatch(/« (Mes parents|Les voisins|Mes cousins) ___/);
  });

  it('elke taal met zinnen geeft een geldige zin op elk niveau', () => {
    for (const [lang, e] of Object.entries(verbEngines) as [LanguageCode, NonNullable<(typeof verbEngines)['fr']>][]) {
      if (!hasLevels(lang)) continue;
      for (const t of e.tenses) for (const p of [0, 2, 5]) for (const lvl of [1, 2, 3] as const) {
        const s = make(lang, e.verbs[0]!.inf, t.id, p, lvl);
        if (!e.sentence(e.verbs[0]!.inf, t.id, p)) continue;
        expect(s).toContain('___');
        // Bij hij/zij (mv) staat er een echt onderwerp, geen voornaamwoord tussen haakjes.
        if (lvl > 1 && p !== 0 && !t.id.startsWith('imperat')) expect(s).not.toMatch(/^\S.*\((él|ellos|lui\/lei|loro|ele|eles)\) ___/);
      }
    }
  });

  it('Latijn heeft geen niveaus (alleen losse vormen)', () => {
    expect(hasLevels('la')).toBe(false);
  });
});
