import { describe, expect, it } from 'vitest';
import { acceptedForms, checkAnswer, expandOptional, splitAlternatives } from '@/lib/check';
import { levenshtein } from '@/lib/levenshtein';
import { diffChars } from '@/lib/diff';
import { grade, formatGrade } from '@/lib/grade';
import { defaultSettings, type CheckRules } from '@/lib/settings';

const rules: CheckRules = { ...defaultSettings.nakijkregels };
const strict: CheckRules = { ignoreCase: false, ignoreAccents: false, ignorePunctuation: false, allowTypos: false, countArticle: true };

describe('levenshtein', () => {
  it('telt bewerkingen', () => {
    expect(levenshtein('maison', 'maison')).toBe(0);
    expect(levenshtein('maison', 'maisn')).toBe(1);
    expect(levenshtein('école', 'ecole')).toBe(1);
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });
});

describe('meerdere antwoorden en haakjes', () => {
  it('splitst op ; en /', () => {
    expect(splitAlternatives('huis; woning / pand')).toEqual(['huis', 'woning', 'pand']);
  });
  it('maakt haakjes optioneel', () => {
    expect(expandOptional('(zich) wassen').sort()).toEqual(['wassen', 'zich wassen']);
    expect(expandOptional('(se) laver (les mains)')).toHaveLength(4);
  });
  it('accepteert elk alternatief', () => {
    expect(checkAnswer('woning', 'huis; woning', rules).result).toBe('goed');
    expect(checkAnswer('pand', 'huis / pand', rules).result).toBe('goed');
    expect(checkAnswer('wassen', '(zich) wassen', rules).result).toBe('goed');
    expect(checkAnswer('zich wassen', '(zich) wassen', rules).result).toBe('goed');
  });
});

describe('hoofdletters', () => {
  it('negeert hoofdletters als dat is ingesteld', () => {
    expect(checkAnswer('PARIS', 'Paris', rules).result).toBe('goed');
  });
  it('telt hoofdletters als dat is ingesteld', () => {
    expect(checkAnswer('paris', 'Paris', strict).result).toBe('fout');
    expect(checkAnswer('paris', 'Paris', { ...strict, allowTypos: true }).result).toBe('bijna');
  });
});

describe('accenten', () => {
  it('accenten negeren: goed, maar met het juiste accent erbij', () => {
    const r = checkAnswer('ecole', 'école', { ...rules, ignoreAccents: true });
    expect(r).toEqual({ result: 'goed', expected: 'école', note: 'accent' });
  });
  it('accenten tellen: één accent fout = bijna goed (typfout-regel)', () => {
    expect(checkAnswer('ecole', 'école', { ...rules, ignoreAccents: false }).result).toBe('bijna');
    expect(checkAnswer('ecole', 'école', strict).result).toBe('fout');
  });
  it('Duitse ß en umlaut', () => {
    expect(checkAnswer('Strasse', 'Straße', { ...rules, ignoreAccents: true }).result).not.toBe('goed'); // ß is geen accent
    expect(checkAnswer('Madchen', 'Mädchen', { ...rules, ignoreAccents: true }).result).toBe('goed');
  });
});

describe('leestekens en spaties', () => {
  it('negeert leestekens en spaties aan begin en eind', () => {
    expect(checkAnswer('  het huis! ', 'het huis', rules).result).toBe('goed');
    expect(checkAnswer('¿Cómo estás?', 'cómo estás', rules).result).toBe('goed');
  });
  it('maakt apostrofs gelijk', () => {
    expect(checkAnswer('l’école', "l'école", rules).result).toBe('goed');
  });
  it('dubbele spaties binnenin tellen niet', () => {
    expect(checkAnswer('het  huis', 'het huis', strict).result).toBe('goed');
  });
});

describe('typfouten', () => {
  it('één letter fout = bijna goed', () => {
    expect(checkAnswer('maisom', 'maison', rules)).toEqual({ result: 'bijna', expected: 'maison', note: 'typfout' });
  });
  it('twee letters fout = fout', () => {
    expect(checkAnswer('maizom', 'maison', rules).result).toBe('fout');
  });
  it('korte woorden (minder dan 4 letters) moeten precies goed', () => {
    expect(checkAnswer('ja', 'je', rules).result).toBe('fout');
  });
  it('typfouten uit = gewoon fout', () => {
    expect(checkAnswer('maisom', 'maison', { ...rules, allowTypos: false }).result).toBe('fout');
  });
});

describe('lidwoord', () => {
  it('lidwoord telt mee: zonder lidwoord is (bijna) fout', () => {
    expect(checkAnswer('la maison', 'maison', rules, 'la').result).toBe('goed');
    expect(checkAnswer('le maison', 'maison', rules, 'la').result).toBe('bijna');
    expect(checkAnswer('maison', 'maison', { ...rules, allowTypos: false }, 'la').result).toBe('fout');
  });
  it('lidwoord telt niet mee: met én zonder is goed', () => {
    const r = { ...rules, countArticle: false };
    expect(checkAnswer('maison', 'maison', r, 'la').result).toBe('goed');
    expect(checkAnswer('la maison', 'maison', r, 'la').result).toBe('goed');
  });
  it("l' plakt aan het woord", () => {
    expect(acceptedForms('école', "l'", { countArticle: true })).toEqual(["l'école"]);
    expect(checkAnswer("l'école", 'école', rules, "l'").result).toBe('goed');
  });
});

describe('leeg antwoord', () => {
  it('is fout en toont het eerste antwoord', () => {
    expect(checkAnswer('', 'huis; woning', rules)).toEqual({ result: 'fout', expected: 'huis' });
  });
});

describe('verschil markeren', () => {
  it('markeert ontbrekende en extra letters', () => {
    expect(diffChars('ecole', 'école')).toEqual([
      { text: 'é', kind: 'mist' },
      { text: 'e', kind: 'teveel' },
      { text: 'cole', kind: 'zelfde' },
    ]);
    expect(diffChars('huis', 'huis')).toEqual([{ text: 'huis', kind: 'zelfde' }]);
  });
});

describe('cijfer', () => {
  it('rekent zoals op school', () => {
    expect(grade(20, 20)).toBe(10);
    expect(grade(0, 20)).toBe(1);
    expect(grade(15, 20)).toBe(7.8);
    expect(formatGrade(7.75)).toBe('7,8');
    expect(formatGrade(10)).toBe('10,0');
  });
});

describe('haakjes midden in een woord', () => {
  it('"allé(e)s" → allés en allées', () => {
    expect(expandOptional('nous sommes allé(e)s').sort()).toEqual(['nous sommes allées', 'nous sommes allés']);
    expect(expandOptional('vous êtes allé(e)(s)')).toHaveLength(4);
    expect(checkAnswer('je suis allée', 'je suis allé(e)', rules).result).toBe('goed');
  });
});
