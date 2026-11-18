import { describe, expect, it } from 'vitest';
import { NIEUW_ADRES, nieuwAdresVoor, opOudAdres } from '@/features/verhuizing/verhuizing';

describe('verhuizing naar woordwerk.online', () => {
  it('herkent het oude GitHub-adres', () => {
    expect(opOudAdres('jip2000.github.io')).toBe(true);
    expect(opOudAdres('woordwerk.online')).toBe(false);
    expect(opOudAdres('woordwerk.pages.dev')).toBe(false);
    expect(opOudAdres('localhost')).toBe(false);
  });
  it('houdt de pagina vast bij het doorsturen', () => {
    expect(nieuwAdresVoor('#/lijsten')).toBe(`${NIEUW_ADRES}#/lijsten`);
    expect(nieuwAdresVoor('')).toBe(NIEUW_ADRES);
  });
});
