import { describe, expect, it } from 'vitest';
import { verbEngines } from '@/features/verbs/registry';
import { variants } from '@/features/verbs/table';
import { checkAnswer } from '@/lib/check';
import { defaultSettings } from '@/lib/settings';
import type { LanguageCode } from '@/data/languages';

const nieuw: LanguageCode[] = ['nl', 'grc', 'sv', 'da', 'no', 'pl', 'cs', 'fi', 'el', 'ru', 'tr', 'fy'];
const goed = (lang: LanguageCode, inf: string, tense: string, p: number, typed: string) =>
  checkAnswer(typed, verbEngines[lang]!.answer(inf, tense, p), { ...defaultSettings.nakijkregels, allowTypos: false }).result === 'goed';

describe('werkwoorden voor alle talen', () => {
  it('elke taal heeft nu een werkwoordtrainer', () => {
    for (const l of nieuw) expect(verbEngines[l], l).toBeDefined();
  });

  it('elke tabel is compleet: 6 vormen per tijd, en de getoonde vorm telt als goed', () => {
    for (const lang of nieuw) {
      const e = verbEngines[lang]!;
      expect(e.verbs.length, lang).toBeGreaterThanOrEqual(9);
      for (const v of e.verbs)
        for (const t of e.tenses) {
          const forms = [0, 1, 2, 3, 4, 5].map((p) => e.bare(v.inf, t.id, p));
          const filled = forms.filter(Boolean).length;
          expect(filled === 0 || filled === 6, `${lang} ${v.inf} ${t.id}`).toBe(true);
          for (let p = 0; p < 6; p++) if (forms[p]) expect(goed(lang, v.inf, t.id, p, variants(forms[p]!)[0]!), `${lang} ${v.inf} ${t.id} ${p}`).toBe(true);
        }
    }
  });

  it('varianten en optionele letters', () => {
    expect(variants('λύουσι(ν)')).toEqual(['λύουσι', 'λύουσιν']);
    expect(variants('sa / sade')).toEqual(['sa', 'sade']);
  });

  it('kloppende vormen (steekproef)', () => {
    const e = (l: LanguageCode) => verbEngines[l]!;
    expect(e('nl').conjugate('zijn', 'tt')).toEqual(['ik ben', 'jij bent', 'hij is', 'wij zijn', 'jullie zijn', 'zij zijn']);
    expect(e('nl').bare('gaan', 'vtt', 2)).toBe('is gegaan');
    expect(goed('nl', 'lopen', 'vtt', 0, 'ben gelopen')).toBe(true);
    expect(goed('nl', 'lopen', 'vtt', 0, 'heb gelopen')).toBe(true);
    expect(e('sv').bare('gå', 'preteritum', 4)).toBe('gick');
    expect(e('da').bare('gå', 'perfekt', 0)).toBe('er gået');
    expect(e('pl').bare('móc', 'przeszly', 0)).toBe('mogłem');
    expect(e('pl').bare('móc', 'przeszly', 2)).toBe('mógł');
    expect(e('pl').bare('iść', 'przeszly', 3)).toBe('szliśmy');
    expect(e('cs').bare('být', 'minuly', 0)).toBe('byl jsem');
    expect(e('fi').bare('tehdä', 'imperfekti', 5)).toBe('tekivät');
    expect(e('tr').conjugate('gelmek', 'gecmis')).toEqual(['ben geldim', 'sen geldin', 'o geldi', 'biz geldik', 'siz geldiniz', 'onlar geldiler']);
    expect(e('tr').bare('yapmak', 'gecmis', 4)).toBe('yaptınız');
    expect(e('tr').bare('okumak', 'gecmis', 5)).toBe('okudular');
    expect(e('tr').bare('görmek', 'simdiki', 3)).toBe('görüyoruz');
    expect(e('grc').conjugate('λύω', 'imperfectum')).toEqual(['ἔλυον', 'ἔλυες', 'ἔλυε(ν)', 'ἐλύομεν', 'ἐλύετε', 'ἔλυον']);
    expect(e('grc').bare('γράφω', 'aoristus', 3)).toBe('ἐγράψαμεν');
    expect(e('el').bare('γράφω', 'aoristos', 0)).toBe('έγραψα');
  });

  it('hulp bij typen: voornaamwoord mag, accenten (Oudgrieks) en ё (Russisch) zijn niet verplicht', () => {
    expect(goed('sv', 'vara', 'presens', 0, 'jag är')).toBe(true);
    expect(goed('pl', 'być', 'teraz', 2, 'ona jest')).toBe(true);
    expect(goed('grc', 'λύω', 'praesens', 5, 'λυουσιν')).toBe(true);
    expect(goed('ru', 'жить', 'nastoyashchee', 1, 'живешь')).toBe(true);
    expect(goed('ru', 'быть', 'proshedshee', 3, 'мы были')).toBe(true);
  });
});
