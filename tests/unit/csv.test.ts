import { describe, expect, it } from 'vitest';
import { parseCsv, toCsv } from '@/lib/csv';

describe('CSV', () => {
  it('schrijft en leest dezelfde woorden terug (ook met ; " en enters)', () => {
    const rows = [
      { left: 'la maison', right: 'het huis; de woning', article: 'la' },
      { left: 'dire', right: 'zeggen', example: 'Il dit "bonjour".\nEt toi ?' },
    ];
    expect(parseCsv(toCsv(rows))).toEqual([
      { left: 'la maison', right: 'het huis; de woning', article: 'la', extraForms: undefined, example: undefined, note: undefined },
      { left: 'dire', right: 'zeggen', article: undefined, extraForms: undefined, example: 'Il dit "bonjour".\nEt toi ?', note: undefined },
    ]);
  });

  it('leest CSV met komma’s en zonder kopregel', () => {
    expect(parseCsv('der Hund,de hond\ndie Katze,de kat')).toEqual([
      expect.objectContaining({ left: 'der Hund', right: 'de hond' }),
      expect.objectContaining({ left: 'die Katze', right: 'de kat' }),
    ]);
  });

  it('slaat rijen zonder twee kanten over', () => {
    expect(parseCsv('links;rechts\nalleen links;\n;\nja;yes')).toHaveLength(1);
  });
});
