import { describe, expect, it } from 'vitest';
import { detectSeparator, parsePasted } from '@/lib/parse';

describe('plakken: scheidingsteken herkennen', () => {
  it('herkent =', () => {
    const r = parsePasted('la maison = het huis\nl\'école = de school');
    expect(r.separator).toBe('=');
    expect(r.pairs).toEqual([
      { left: 'la maison', right: 'het huis' },
      { left: "l'école", right: 'de school' },
    ]);
  });

  it('herkent tabs uit Excel', () => {
    expect(parsePasted('das Haus\thet huis\nder Hund\tde hond').pairs[1]).toEqual({ left: 'der Hund', right: 'de hond' });
    expect(detectSeparator('a\tb')).toBe('tab');
  });

  it('splitst op een streepje met spaties, maar niet in "week-end"', () => {
    const r = parsePasted('le week-end - het weekend\naujourd\'hui – vandaag');
    expect(r.separator).toBe('-');
    expect(r.pairs).toEqual([
      { left: 'le week-end', right: 'het weekend' },
      { left: "aujourd'hui", right: 'vandaag' },
    ]);
  });

  it('herkent ; en houdt verdere ; als meerdere antwoorden', () => {
    const r = parsePasted('la maison; het huis; de woning\nle chien; de hond');
    expect(r.separator).toBe(';');
    expect(r.pairs[0]).toEqual({ left: 'la maison', right: 'het huis; de woning' });
  });

  it('herkent dubbele punt', () => {
    expect(parsePasted('rosa: roos\nlupus: wolf').pairs).toHaveLength(2);
  });

  it('slaat lege regels over en meldt regels zonder scheidingsteken', () => {
    const r = parsePasted('\n  Unité 3  \nla mer = de zee\n\n');
    expect(r.pairs).toHaveLength(1);
    expect(r.skipped).toEqual(['Unité 3']);
  });

  it('laat je zelf een scheidingsteken kiezen', () => {
    const r = parsePasted('a - b = c', '=');
    expect(r.pairs[0]).toEqual({ left: 'a - b', right: 'c' });
  });
});
