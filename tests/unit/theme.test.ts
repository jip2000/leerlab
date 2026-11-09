import { describe, expect, it } from 'vitest';
import { resolveTheme } from '@/lib/theme';

describe('thema', () => {
  it('volgt het systeem bij "systeem"', () => {
    expect(resolveTheme('systeem', true)).toBe('dark');
    expect(resolveTheme('systeem', false)).toBe('light');
  });
  it('negeert het systeem bij een vaste keuze', () => {
    expect(resolveTheme('licht', true)).toBe('light');
    expect(resolveTheme('donker', false)).toBe('dark');
  });
});
