import { describe, expect, it } from 'vitest';
import { getLanguage, languages } from '@/data/languages';

describe('talenconfiguratie', () => {
  it('bevat alle 19 talen uit de opdracht', () => {
    expect(languages.map((l) => l.code).sort()).toEqual(
      ['cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'fy', 'grc', 'it', 'la', 'nl', 'no', 'pl', 'pt', 'ru', 'sv', 'tr'],
    );
  });

  it('heeft unieke codes en geldige kleuren', () => {
    const codes = new Set(languages.map((l) => l.code));
    expect(codes.size).toBe(languages.length);
    for (const l of languages) expect(l.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('heeft speciale tekens voor elke taal behalve Engels, zonder dubbele', () => {
    for (const l of languages) {
      if (l.code === 'en') continue;
      expect(l.specialChars.length, l.name).toBeGreaterThan(0);
      expect(new Set(l.specialChars).size, l.name).toBe(l.specialChars.length);
    }
  });

  it('heeft het volledige Russische alfabet (33 letters)', () => {
    expect(getLanguage('ru').specialChars).toHaveLength(33);
  });

  it('heeft unieke onderwerp-ids per taal', () => {
    for (const l of languages) {
      const ids = l.grammarTopics.map((t) => t.id);
      expect(new Set(ids).size, l.name).toBe(ids.length);
    }
  });

  it('gooit een fout bij een onbekende taal', () => {
    // @ts-expect-error bewust een verkeerde code
    expect(() => getLanguage('xx')).toThrow();
  });
});

describe('toegankelijkheid', () => {
  const lum = (hex: string) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
  };
  it('elke vak-kleur heeft genoeg contrast met witte tekst (WCAG AA, 4.5:1)', () => {
    for (const l of languages) expect((1.05) / (lum(l.color) + 0.05), l.name).toBeGreaterThanOrEqual(4.5);
  });
});
