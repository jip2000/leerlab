import type { WordList } from '@/db/types';

export type Sort = 'naam' | 'nieuw';

export function sortLists(lists: WordList[], sort: Sort): WordList[] {
  return [...lists].sort((a, b) =>
    sort === 'naam' ? a.title.localeCompare(b.title, 'nl', { numeric: true }) : b.updatedAt - a.updatedAt,
  );
}
