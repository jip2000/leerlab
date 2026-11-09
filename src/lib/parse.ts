/**
 * Geplakte tekst omzetten naar woordparen.
 * Ondersteunt per regel: "woord = vertaling", "woord - vertaling", "woord – vertaling",
 * "woord; vertaling", "woord: vertaling" en tab-gescheiden (uit Excel / Google Sheets).
 */

export type Separator = 'tab' | '=' | '-' | ';' | ':';

export const separatorLabels: Record<Separator, string> = {
  tab: 'Tab (Excel/Sheets)',
  '=': 'Is-teken (=)',
  '-': 'Streepje (-)',
  ';': 'Puntkomma (;)',
  ':': 'Dubbele punt (:)',
};

export interface Pair {
  left: string;
  right: string;
}

// Volgorde = voorkeur bij gelijkspel. Streepjes alleen met spaties eromheen,
// zodat woorden als "week-end" of "Baden-Württemberg" heel blijven.
const patterns: Record<Separator, RegExp> = {
  tab: /\t+/,
  '=': /\s*=\s*/,
  '-': /\s+[-–—]\s+|\s*[–—]\s*/,
  ';': /\s*;\s*/,
  ':': /\s*:\s+/,
};
const order: Separator[] = ['tab', '=', '-', ';', ':'];

function splitOnce(line: string, sep: Separator): Pair | null {
  const m = patterns[sep].exec(line);
  if (!m || m.index === 0) return null;
  const left = line.slice(0, m.index).trim();
  const right = line.slice(m.index + m[0].length).trim();
  if (!left || !right) return null;
  return { left, right };
}

function lines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

/** Kiest het scheidingsteken dat in de meeste regels voorkomt. */
export function detectSeparator(text: string): Separator | null {
  const ls = lines(text);
  let best: Separator | null = null;
  let bestCount = 0;
  for (const sep of order) {
    const count = ls.filter((l) => splitOnce(l, sep)).length;
    if (count > bestCount) {
      best = sep;
      bestCount = count;
    }
  }
  return best;
}

export interface ParseResult {
  separator: Separator | null;
  pairs: Pair[];
  /** Regels die niet gesplitst konden worden. */
  skipped: string[];
}

export function parsePasted(text: string, separator?: Separator): ParseResult {
  const sep = separator ?? detectSeparator(text);
  const pairs: Pair[] = [];
  const skipped: string[] = [];
  for (const line of lines(text)) {
    const pair = sep ? splitOnce(line, sep) : null;
    if (pair) pairs.push(pair);
    else skipped.push(line);
  }
  return { separator: sep, pairs, skipped };
}
