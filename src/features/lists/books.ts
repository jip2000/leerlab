import type { LanguageCode } from '@/data/languages';
import type { BookInfo } from '@/db/types';

/**
 * Bekende lesmethodes, alleen als suggestie bij het typen van de boeknaam.
 * Je kunt altijd zelf een andere naam typen. (Er staan géén woorden uit deze boeken in Woordwerk.)
 */
export const bookSuggestions: Partial<Record<LanguageCode, string[]>> = {
  fr: ['Grandes Lignes', "D'accord"],
  de: ['Neue Kontakte', 'Na klar!'],
  en: ['Stepping Stones', 'All Right!', 'New Interface'],
};

export const levels = ['vmbo-b', 'vmbo-k', 'vmbo-gt', 'havo', 'vwo', 'gymnasium'] as const;
export const years = [1, 2, 3, 4, 5, 6] as const;

/** Unieke sleutel voor "dit boek in dit leerjaar op dit niveau". */
export function bookKey(b: BookInfo): string {
  return [b.title.trim().toLowerCase(), b.year ?? '', b.level ?? ''].join('|');
}

/** Bijv. "4 vwo", "havo" of "" als niets is ingevuld. */
export function yearLevelLabel(b: Pick<BookInfo, 'year' | 'level'>): string {
  return [b.year, b.level].filter(Boolean).join(' ');
}

/** Sorteert hoofdstukken natuurlijk: 2 komt vóór 10. */
export function compareChapters(a: string, b: string): number {
  return a.localeCompare(b, 'nl', { numeric: true, sensitivity: 'base' });
}
