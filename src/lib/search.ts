import { languages } from '@/data/languages';

export interface SearchResult {
  kind: 'pagina' | 'grammatica' | 'lijst' | 'woord';
  title: string;
  subtitle: string;
  to: string;
}

/** Maakt tekst vergelijkbaar: kleine letters en zonder accenten ("Présent" → "present"). */
export function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export interface SearchData {
  lists: { id: string; title: string }[];
  words: { listId: string; left: string; right: string }[];
}

/** Zoekt in je lijsten, woorden, pagina's en grammatica-onderwerpen. */
export function search(
  query: string,
  pages: { path: string; label: string }[],
  limit = 8,
  data: SearchData = { lists: [], words: [] },
): SearchResult[] {
  const q = fold(query.trim());
  if (!q) return [];
  const words = q.split(/\s+/);
  const matches = (text: string) => words.every((w) => fold(text).includes(w));

  const results: SearchResult[] = [];
  const titles = new Map(data.lists.map((l) => [l.id, l.title]));
  for (const l of data.lists) {
    if (matches(l.title)) results.push({ kind: 'lijst', title: l.title, subtitle: 'Woordenlijst', to: `/lijsten/${l.id}` });
  }
  let wordHits = 0;
  for (const w of data.words) {
    if (wordHits >= 5) break;
    if (matches(`${w.left} ${w.right}`)) {
      wordHits++;
      results.push({ kind: 'woord', title: `${w.left} – ${w.right}`, subtitle: `Woord in ${titles.get(w.listId) ?? 'een lijst'}`, to: `/lijsten/${w.listId}` });
    }
  }
  for (const p of pages) {
    if (matches(p.label)) results.push({ kind: 'pagina', title: p.label, subtitle: 'Pagina', to: p.path });
  }
  for (const lang of languages) {
    for (const topic of lang.grammarTopics) {
      if (matches(`${topic.title} ${lang.name}`)) {
        results.push({
          kind: 'grammatica',
          title: topic.title,
          subtitle: `Grammatica ${lang.name}`,
          to: `/grammatica/${lang.code}`,
        });
      }
    }
  }
  return results.slice(0, limit);
}
