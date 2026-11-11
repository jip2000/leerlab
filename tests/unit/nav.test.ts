import { describe, expect, it } from 'vitest';
import { isNavActive, navItems, pageLabel, searchPages } from '@/components/layout/nav';
import { search } from '@/lib/search';

const item = (path: string) => navItems.find((i) => i.path === path)!;

describe('hoofdmenu', () => {
  it('Werkwoorden is geen los menu-item meer: het hoort bij Grammatica', () => {
    expect(navItems.map((i) => i.path)).not.toContain('/werkwoorden');
  });

  it('Grammatica staat in de tabbalk op mobiel, en het blijven vier knoppen plus "Meer"', () => {
    expect(item('/grammatica').tab).toBe(true);
    expect(navItems.filter((i) => i.tab)).toHaveLength(4);
  });

  it('Grammatica is actief op zijn eigen pagina’s én bij de werkwoordtrainer', () => {
    const grammatica = item('/grammatica');
    for (const path of ['/grammatica', '/grammatica/fr', '/grammatica/fr/subjonctif', '/werkwoorden', '/werkwoorden/oefenen']) {
      expect(isNavActive(grammatica, path), path).toBe(true);
    }
    for (const path of ['/', '/oefenen', '/oefenen/abc', '/grammaticaal']) {
      expect(isNavActive(grammatica, path), path).toBe(false);
    }
  });

  it('Home is alleen actief op de startpagina', () => {
    expect(isNavActive(item('/'), '/')).toBe(true);
    expect(isNavActive(item('/'), '/lijsten')).toBe(false);
  });

  it('paginatitel: de werkwoordtrainer houdt zijn eigen naam', () => {
    expect(pageLabel('/werkwoorden')).toBe('Werkwoorden');
    expect(pageLabel('/werkwoorden/oefenen')).toBe('Werkwoorden');
    expect(pageLabel('/grammatica/fr')).toBe('Grammatica');
    expect(pageLabel('/oefenen/abc')).toBe('Oefenen');
  });

  it('paginatitel: Home en onbekende pagina’s krijgen geen eigen naam', () => {
    expect(pageLabel('/')).toBeUndefined();
    expect(pageLabel('/privacy')).toBeUndefined();
  });

  it('zoeken vindt de werkwoordtrainer nog steeds als pagina', () => {
    expect(search('werkw', searchPages)[0]).toMatchObject({ kind: 'pagina', title: 'Werkwoorden', to: '/werkwoorden' });
  });
});
