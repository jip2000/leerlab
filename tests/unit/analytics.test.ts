import { describe, expect, it } from 'vitest';
import { sanitizePath } from '@/lib/analytics';

describe('bezoekersteller: privacy', () => {
  it('stuurt nooit ids of de inhoud van een deellink mee', () => {
    expect(sanitizePath('/lijsten/3f2a1b4c-1234-4abc-9def-0123456789ab')).toBe('/lijsten/:id');
    expect(sanitizePath('/lijsten/3f2a1b4c-1234-4abc-9def-0123456789ab/bewerken')).toBe('/lijsten/:id/bewerken');
    expect(sanitizePath('/delen?d=eJyrVkosLcnPTc0rUbIyNDY')).toBe('/delen');
    expect(sanitizePath('/oefenen?lijsten=a,b')).toBe('/oefenen');
    expect(sanitizePath('/lijsten/start/start-sv-eten')).toBe('/lijsten/start/:id');
    expect(sanitizePath('/grammatica/fr/subjonctif')).toBe('/grammatica/fr/subjonctif');
    expect(sanitizePath('')).toBe('/');
  });
});
