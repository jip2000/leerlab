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
    expect(r[0]).toMatchObject({ kind: 'grammatica', to: '/grammatica/fr/passe-compose' });
  });

  it('kan op taal filteren', () => {
    const r = search('naamvallen duits', pages);
    expect(r).toHaveLength(1);
    expect(r[0]?.to).toBe('/grammatica/de/naamvallen');
  });

  it('geeft niets bij een lege zoekopdracht', () => {
    expect(search('   ', pages)).toEqual([]);
  });
});

describe('zoeken in je eigen lijsten', () => {
  const data = {
    lists: [{ id: 'a', title: 'Unité 3 – vocabulaire' }],
    words: [
      { listId: 'a', left: "l'école", right: 'de school' },
      { listId: 'a', left: 'la maison', right: 'het huis' },
    ],
  };
  it('vindt lijsten op titel', () => {
    expect(search('unite 3', pages, 8, data)[0]).toMatchObject({ kind: 'lijst', to: '/lijsten/a' });
  });
  it('vindt woorden aan beide kanten, zonder accenten', () => {
    expect(search('ecole', pages, 8, data)[0]).toMatchObject({ kind: 'woord', subtitle: 'Woord in Unité 3 – vocabulaire' });
    expect(search('huis', pages, 8, data)[0]).toMatchObject({ kind: 'woord', title: 'la maison – het huis' });
  });
});
