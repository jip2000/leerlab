import { describe, expect, it } from 'vitest';
import { decodeSharedList, encodeSharedList, type SharedList } from '@/lib/share';

describe('delen via link', () => {
  it('pakt een lijst in en weer uit', async () => {
    const list: SharedList = {
      v: 1,
      title: 'Unité 2 – woorden',
      langLeft: 'fr',
      langRight: 'nl',
      book: { title: 'Grandes Lignes', year: 4, level: 'vwo', chapter: '2' },
      words: [['la maison', 'het huis', 'la'], ['être', 'zijn'], ['œil', 'oog; ogen']],
    };
    const code = await encodeSharedList(list);
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/); // veilig in een link
    expect(await decodeSharedList(code)).toEqual(list);
  });

  it('geeft een duidelijke fout bij een kapotte link', async () => {
    await expect(decodeSharedList('kapot')).rejects.toThrow();
  });
});
