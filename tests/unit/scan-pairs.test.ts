import { describe, expect, it } from 'vitest';
import { findColumnBoundary, groupRows, wordsToPairs, type OcrWord } from '@/features/scan/pairs';

/** Maakt woorden op een regel: [tekst, x] met vaste hoogte. */
function row(y: number, ...items: [string, number, number?][]): OcrWord[] {
  return items.map(([text, x, conf = 95]) => ({ text, conf, x0: x, x1: x + text.length * 9, y0: y, y1: y + 18 }));
}

describe('OCR: regels vormen', () => {
  it('zet woorden op dezelfde hoogte in één regel, ook als ze een beetje scheef staan', () => {
    const words = [...row(100, ['la', 10], ['maison', 40]), ...row(103, ['het', 300], ['huis', 340]), ...row(140, ['le', 10])];
    const rows = groupRows(words);
    expect(rows).toHaveLength(2);
    expect(rows[0]!.map((w) => w.text)).toEqual(['la', 'maison', 'het', 'huis']);
  });
});

describe('OCR: woordparen', () => {
  it('splitst op een scheidingsteken', () => {
    const words = [...row(10, ['la', 10], ['maison', 40], ['=', 110], ['het', 130], ['huis', 170]), ...row(40, ['le', 10], ['chien', 40], ['=', 110], ['de', 130], ['hond', 160])];
    expect(wordsToPairs(words).pairs).toEqual([
      { left: 'la maison', right: 'het huis', unsure: false },
      { left: 'le chien', right: 'de hond', unsure: false },
    ]);
  });

  it('koppelt twee kolommen via de posities van de woorden', () => {
    const words = [
      ...row(10, ['Unité', 10], ['3', 70]),
      ...row(40, ['la', 10], ['maison', 40], ['het', 300], ['huis', 340]),
      ...row(70, ['le', 10], ['chien', 40], ['de', 300], ['hond', 330]),
      ...row(100, ["l'école", 10], ['de', 300], ['school', 330]),
      ...row(130, ['aujourd’hui', 10], ['vandaag', 300]),
      ...row(160, ['42', 200]),
    ];
    expect(findColumnBoundary(groupRows(words))).not.toBeNull();
    const r = wordsToPairs(words);
    expect(r.pairs.map((p) => [p.left, p.right])).toEqual([
      ['la maison', 'het huis'],
      ['le chien', 'de hond'],
      ["l'école", 'de school'],
      ['aujourd’hui', 'vandaag'],
    ]);
    expect(r.skipped).toEqual(['Unité 3']); // kopje
  });

  it('woorden met een streepje erin blijven heel in kolommen', () => {
    const words = [
      ...row(40, ['le', 10], ['week-end', 40], ['het', 300], ['weekend', 340]),
      ...row(70, ['le', 10], ['chien', 40], ['de', 300], ['hond', 330]),
      ...row(100, ['la', 10], ['mer', 40], ['de', 300], ['zee', 330]),
    ];
    expect(wordsToPairs(words).pairs[0]).toMatchObject({ left: 'le week-end', right: 'het weekend' });
  });

  it('markeert onzekere herkenning', () => {
    const words = [...row(10, ['la', 10], ['mer', 40, 45], ['=', 90], ['de', 110], ['zee', 140])];
    expect(wordsToPairs(words).pairs[0]!.unsure).toBe(true);
  });

  it('gooit paginanummers en losse tekens weg', () => {
    const words = [...row(10, ['12', 10]), ...row(40, ['|', 10]), ...row(70, ['oui', 10], ['=', 50], ['ja', 70])];
    const r = wordsToPairs(words);
    expect(r.pairs).toHaveLength(1);
    expect(r.skipped).toEqual([]);
  });
});

describe('OCR: scheve foto', () => {
  it('koppelt woorden die door scheefstand iets lager staan', () => {
    const words = [
      ...row(40, ['la', 10], ['plage', 40]), ...row(49, ['het', 300], ['strand', 340]),
      ...row(80, ['le', 10], ['soleil', 40]), ...row(91, ['de', 300], ['zon', 330]),
      ...row(120, ['nager', 10]), ...row(133, ['zwemmen', 300]),
    ];
    expect(wordsToPairs(words).pairs.map((p) => [p.left, p.right])).toEqual([
      ['la plage', 'het strand'],
      ['le soleil', 'de zon'],
      ['nager', 'zwemmen'],
    ]);
  });
});

describe('OCR: los woord', () => {
  it('voegt een woord dat net iets lager staat bij de vorige regel', () => {
    const words = [
      ...row(40, ['le', 10], ['chien', 40], ['de', 300], ['hond', 330]),
      ...row(80, ['le', 10], ['week-end', 40], ['het', 300]), ...row(90, ['weekend', 340]),
      ...row(120, ['la', 10], ['mer', 40], ['de', 300], ['zee', 330]),
    ];
    expect(wordsToPairs(words).pairs.map((p) => p.right)).toEqual(['de hond', 'het weekend', 'de zee']);
  });
});
