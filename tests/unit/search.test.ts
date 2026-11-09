import { describe, expect, it } from 'vitest';
import { fold, search } from '@/lib/search';

const pages = [
  { path: '/', label: 'Home' },
  { path: '/werkwoorden', label: 'Werkwoorden' },
];

describe('zoeken', () => {
  it('negeert hoofdletters en accenten', () => {
    expect(fold('Présent Ça')).toBe('present ca');
  });

  it('vindt pagina’s', () => {
    expect(search('werkw', pages)[0]).toMatchObject({ kind: 'pagina', to: '/werkwoorden' });
  });

  it('vindt grammatica-onderwerpen zonder accent te typen', () => {
    const r = search('passe compose', pages);
    expect(r[0]).toMatchObject({ kind: 'grammatica', to: '/grammatica/fr' });
  });

  it('kan op taal filteren', () => {
    const r = search('naamvallen duits', pages);
    expect(r).toHaveLength(1);
    expect(r[0]?.to).toBe('/grammatica/de');
  });

  it('geeft niets bij een lege zoekopdracht', () => {
    expect(search('   ', pages)).toEqual([]);
  });
});
