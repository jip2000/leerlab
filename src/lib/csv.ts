/**
 * CSV lezen en schrijven. Excel in Nederland gebruikt vaak ";" als scheidingsteken,
 * Google Sheets ",". Bij lezen wordt dat automatisch herkend.
 */

export const csvColumns = ['links', 'rechts', 'lidwoord', 'extra vormen', 'voorbeeldzin', 'notitie'] as const;

export interface CsvRow {
  left: string;
  right: string;
  article?: string;
  extraForms?: string;
  example?: string;
  note?: string;
}

function escape(value: string, delimiter: string): string {
  if (value.includes('"') || value.includes(delimiter) || /[\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsv(rows: CsvRow[], delimiter = ';'): string {
  const out = [csvColumns.join(delimiter)];
  for (const r of rows) {
    out.push(
      [r.left, r.right, r.article ?? '', r.extraForms ?? '', r.example ?? '', r.note ?? '']
        .map((v) => escape(v, delimiter))
        .join(delimiter),
    );
  }
  // BOM zodat Excel de accenten goed toont.
  return '﻿' + out.join('\r\n') + '\r\n';
}

/** Splitst CSV-tekst in cellen; ondersteunt aanhalingstekens en enters binnen een cel. */
export function parseCsvCells(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delimiter) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

export function detectDelimiter(text: string): string {
  const first = text.replace(/^﻿/, '').split(/\r?\n/)[0] ?? '';
  const counts = [';', ',', '\t'].map((d) => [d, first.split(d).length - 1] as const);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0]![1] > 0 ? counts[0]![0] : ';';
}

export function parseCsv(text: string): CsvRow[] {
  const cells = parseCsvCells(text, detectDelimiter(text));
  const header = cells[0]?.map((c) => c.trim().toLowerCase());
  const hasHeader = !!header && (header[0] === 'links' || header[0] === 'left' || header[0] === 'woord');
  const body = hasHeader ? cells.slice(1) : cells;
  const opt = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);
  return body
    .map((c) => ({
      left: (c[0] ?? '').trim(),
      right: (c[1] ?? '').trim(),
      article: opt(c[2]),
      extraForms: opt(c[3]),
      example: opt(c[4]),
      note: opt(c[5]),
    }))
    .filter((r) => r.left && r.right);
}
