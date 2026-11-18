import { describe, expect, it } from 'vitest';
import { getTopic, exercisesOf } from '@/data/grammar';
import { casesOfExercise, filterBlocks, filterExercises, selectedCases, topicUsesCases } from '@/features/grammar/cases';

const naamvallen = getTopic('de', 'naamvallen')!;

describe('naamvallen kiezen', () => {
  it('niets gekozen = alles aan', () => {
    expect([...selectedCases('de', {})]).toEqual(['nom', 'gen', 'dat', 'akk']); // schoolvolgorde 1e-4e
    expect([...selectedCases('de', { de: [] })]).toHaveLength(4);
    expect([...selectedCases('de', { de: ['akk', 'onzin'] })]).toEqual(['akk']);
  });

  it('alles aan verandert niets', () => {
    const on = selectedCases('de', {});
    expect(filterBlocks('de', naamvallen.blocks, on)).toEqual(naamvallen.blocks);
    expect(filterExercises('de', exercisesOf(naamvallen), on)).toEqual(exercisesOf(naamvallen));
  });

  it('Duits zonder Genitiv en Dativ: tabelrijen en oefeningen verdwijnen', () => {
    const on = new Set(['nom', 'akk']);
    const table = filterBlocks('de', naamvallen.blocks, on).find((b) => b.type === 'table')!;
    expect(table.type === 'table' && table.rows.map((r) => r[0])).toEqual(['Nominativ', 'Akkusativ']);
    const ex = filterExercises('de', exercisesOf(naamvallen), on);
    for (const e of ex) {
      const c = casesOfExercise('de', e);
      expect(c.length === 0 || c.some((x) => on.has(x))).toBe(true);
      if (e.type === 'table') expect(e.rows.map((r) => r.label).every((l) => ['Nominativ', 'Akkusativ'].includes(l))).toBe(true);
    }
    expect(ex.some((e) => e.type === 'gap' && e.answer === 'des')).toBe(false);
    expect(ex.some((e) => e.type === 'gap' && e.answer === 'den')).toBe(true);
  });

  it('kolommen met een naamval als kop vallen weg', () => {
    const t = getTopic('de', 'personalpronomen')!;
    const table = filterBlocks('de', t.blocks, new Set(['nom', 'akk']))[0]!;
    expect(table.type === 'table' && table.head).toEqual(['Nominativ', 'Akkusativ']);
    expect(table.type === 'table' && table.rows[2]).toEqual(['er', 'ihn']);
  });

  it('Latijn: afkortingen als "abl. ev" en tekst in oefeningen', () => {
    const t = getTopic('la', 'declinaties')!;
    const on = new Set(['nom', 'gen', 'dat', 'acc']);
    const blocks = filterBlocks('la', t.blocks, on);
    for (const b of blocks) if (b.type === 'table') expect(b.rows.some((r) => r[0] === 'ablativus')).toBe(false);
    const ex = filterExercises('la', exercisesOf(t), on);
    expect(ex.some((e) => e.type === 'gap' && /ablativus/.test(e.sentence))).toBe(false);
    expect(ex.some((e) => e.type === 'gap' && /genitivus/.test(e.sentence))).toBe(true);
  });

  it('Oudgrieks: foute keuzes over uitgezette naamvallen weg, goede index klopt', () => {
    const t = getTopic('grc', 'lidwoord')!;
    const on = new Set(['nom', 'acc']);
    for (const e of filterExercises('grc', exercisesOf(t), on)) {
      if (e.type !== 'choice') continue;
      expect(e.answer).toBeGreaterThanOrEqual(0);
      expect(e.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('weet welke onderwerpen over naamvallen gaan', () => {
    expect(topicUsesCases('de', naamvallen)).toBe(true);
    expect(topicUsesCases('de', getTopic('de', 'woordvolgorde')!)).toBe(false);
    expect(topicUsesCases('fr', naamvallen)).toBe(false); // Frans heeft geen naamvallen
  });
});

import { filterBlocksByPart, filterExercisesByPart, selectedParts } from '@/features/grammar/parts';

describe('onderdelen per onderwerp', () => {
  const vz = getTopic('de', 'voorzetsels')!;
  it('standaard alles aan, en elk onderdeel heeft genoeg oefeningen', () => {
    expect([...selectedParts(vz, undefined)]).toEqual(['akk', 'dat', 'wissel', 'samen']);
    for (const p of vz.parts!) expect(filterExercisesByPart(exercisesOf(vz), new Set([p.id])).length).toBeGreaterThanOrEqual(5);
  });
  it('alleen wisselvoorzetsels: andere uitleg en oefeningen weg', () => {
    const on = new Set(['wissel']);
    expect(filterBlocksByPart(vz.blocks, on).every((b) => !b.part || b.part === 'wissel')).toBe(true);
    expect(filterExercisesByPart(exercisesOf(vz), on).every((e) => e.part === 'wissel')).toBe(true);
  });
  it('elke oefening in een onderwerp met onderdelen hoort bij een bestaand onderdeel', () => {
    for (const id of ['naamvallen', 'voorzetsels', 'adjektivdeklination']) {
      const t = getTopic('de', id)!;
      const ids = t.parts!.map((p) => p.id);
      for (const e of exercisesOf(t)) expect(ids).toContain(e.part);
    }
  });
});
