import { languages } from '@/data/languages';

export interface SearchResult {
  kind: 'pagina' | 'grammatica';
  title: string;
  subtitle: string;
  to: string;
}

/** Maakt tekst vergelijkbaar: kleine letters en zonder accenten ("Présent" → "present"). */
export function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/**
 * Zoekt in pagina's en grammatica-onderwerpen.
 * (Woordenlijsten en woorden komen erbij in fase 2.)
 */
export function search(query: string, pages: { path: string; label: string }[], limit = 8): SearchResult[] {
  const q = fold(query.trim());
  if (!q) return [];
  const words = q.split(/\s+/);
  const matches = (text: string) => words.every((w) => fold(text).includes(w));

  const results: SearchResult[] = [];
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
