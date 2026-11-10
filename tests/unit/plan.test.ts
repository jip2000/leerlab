import { describe, expect, it } from 'vitest';
import { canUse } from '@/lib/plan';

describe('gratis en Plus', () => {
  it('zolang Plus uit staat, is alles gratis', () => {
    expect(canUse('scannen', 'gratis', false)).toBe(true);
  });
  it('als Plus aan staat: alleen met Plus', () => {
    expect(canUse('scannen', 'gratis', true)).toBe(false);
    expect(canUse('scannen', 'plus', true)).toBe(true);
  });
});
