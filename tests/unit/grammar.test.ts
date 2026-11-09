import { describe, expect, it } from 'vitest';
import { exercisesOf, grammar } from '@/data/grammar';
import { getLanguage, type LanguageCode } from '@/data/languages';
import { checkAnswer } from '@/lib/check';
import { defaultSettings } from '@/lib/settings';

describe('grammatica-inhoud', () => {
  for (const [lang, topics] of Object.entries(grammar) as [LanguageCode, NonNullable<(typeof grammar)['fr']>][]) {
    it(`${lang}: elk onderwerp uit de talenlijst heeft inhoud`, () => {
      const ids = getLanguage(lang).grammarTopics.map((t) => t.id);
      for (const id of ids) expect(topics.some((t) => t.id === id), `${lang}/${id}`).toBe(true);
      for (const t of topics) expect(ids, `${lang}/${t.id} staat niet in languages.ts`).toContain(t.id);
    });

    it(`${lang}: oefeningen zijn geldig (ook de gegenereerde, 10× gemaakt)`, () => {
      for (const t of topics) {
        expect(t.blocks.length, t.id).toBeGreaterThan(0);
        for (let round = 0; round < (typeof t.exercises === 'function' ? 10 : 1); round++) {
          const ex = exercisesOf(t);
          expect(ex.length, t.id).toBeGreaterThanOrEqual(5);
          for (const e of ex) {
            switch (e.type) {
              case 'gap':
                expect(e.sentence, t.id).toContain('___');
                expect(e.answer.trim(), t.id).not.toBe('');
                break;
              case 'choice':
                expect(e.options.length, t.id).toBeGreaterThanOrEqual(2);
                expect(e.answer, t.id).toBeGreaterThanOrEqual(0);
                expect(e.answer, t.id).toBeLessThan(e.options.length);
                expect(new Set(e.options).size, `${t.id}: dubbele opties ${e.options}`).toBe(e.options.length);
                break;
              case 'table':
                for (const r of e.rows) expect(r.answer.trim(), t.id).not.toBe('');
                break;
              case 'translate':
              case 'fix':
                expect(e.answer.trim(), t.id).not.toBe('');
                break;
              case 'order':
                expect(e.words.length, t.id).toBeGreaterThanOrEqual(3);
                break;
            }
          }
        }
      }
    });
  }

  it('fout-zoek-opgaven: de foute zin is echt anders dan de goede', () => {
    for (const topics of Object.values(grammar))
      for (const t of topics!)
        for (const e of exercisesOf(t))
          if (e.type === 'fix') expect(checkAnswer(e.sentence, e.answer, { ...defaultSettings.nakijkregels, allowTypos: false }).result, `${t.id}: ${e.sentence}`).toBe('fout');
  });
});
