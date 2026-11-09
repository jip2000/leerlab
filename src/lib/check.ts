/**
 * NAKIJKEN
 *
 * Vergelijkt wat je typt met het goede antwoord, volgens de nakijkregels uit Instellingen.
 *
 * - Meerdere goede antwoorden: "huis; woning" of "huis / woning" → allebei goed.
 * - Optioneel deel tussen haakjes: "(zich) wassen" → "wassen" en "zich wassen" zijn goed.
 * - Lidwoord: als het lidwoord niet meetelt, mag je het weglaten (of toevoegen).
 */
import type { CheckRules } from './settings';
import { levenshtein } from './levenshtein';
import { withArticle } from '@/data/starter';

export type CheckResult =
  | { result: 'goed'; expected: string; note?: 'accent' | 'hoofdletters' }
  | { result: 'bijna'; expected: string; note: 'typfout' }
  | { result: 'fout'; expected: string };

const stripAccents = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC');

/** Basis-opschoning die altijd gebeurt: apostrofs gelijk maken, dubbele spaties weg. */
function tidy(s: string, rules: CheckRules): string {
  let t = s.normalize('NFC').replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim();
  if (rules.ignorePunctuation) t = t.replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, '');
  return t;
}

/** "huis; woning / (de) woning" → ["huis", "woning", "(de) woning"] */
export function splitAlternatives(answer: string): string[] {
  return answer
    .split(/\s*[;/]\s*/)
    .map((a) => a.trim())
    .filter(Boolean);
}

/** "(zich) wassen" → ["zich wassen", "wassen"]. Werkt ook met meerdere haakjes. */
export function expandOptional(answer: string): string[] {
  const m = /\(([^()]*)\)/.exec(answer);
  if (!m) return [answer.replace(/\s+/g, ' ').trim()];
  const before = answer.slice(0, m.index);
  const after = answer.slice(m.index + m[0].length);
  // Midden in een woord ("allé(e)s") zonder spatie weglaten; anders met spatie ("(zich) wassen").
  const inWord = /\S$/.test(before) && /^\S/.test(after);
  return [...new Set([...expandOptional(before + m[1] + after), ...expandOptional(before + (inWord ? '' : ' ') + after)])];
}

/** Alle vormen die als goed tellen, vóór opschoning. */
export function acceptedForms(answer: string, article: string | undefined, rules: Pick<CheckRules, 'countArticle'>): string[] {
  const forms: string[] = [];
  for (const alt of splitAlternatives(answer)) {
    for (const form of expandOptional(alt)) {
      if (article) {
        forms.push(withArticle(form, article));
        if (!rules.countArticle) forms.push(form);
      } else forms.push(form);
    }
  }
  return [...new Set(forms)];
}

/**
 * @param given    wat de leerling typte
 * @param answer   het goede antwoord zoals in de lijst (zonder lidwoord)
 * @param article  lidwoord dat bij dit antwoord hoort, als het bij deze kant hoort
 */
export function checkAnswer(given: string, answer: string, rules: CheckRules, article?: string): CheckResult {
  const expected = withArticle(splitAlternatives(answer)[0] ?? answer, article);
  const g = tidy(given, rules);
  if (!g) return { result: 'fout', expected };

  const forms = acceptedForms(answer, article, rules);
  const cmp = (s: string) => (rules.ignoreCase ? s.toLocaleLowerCase() : s);

  // 1. Precies goed (volgens de regels).
  for (const f of forms) if (cmp(tidy(f, rules)) === cmp(g)) return { result: 'goed', expected: f };

  // 2. Alleen hoofdletters anders (als hoofdletters wél meetellen): fout, maar met uitleg is dat de typfout-regel.
  // 3. Alleen accenten anders.
  if (rules.ignoreAccents) {
    for (const f of forms) {
      if (cmp(stripAccents(tidy(f, rules))) === cmp(stripAccents(g))) return { result: 'goed', expected: f, note: 'accent' };
    }
  }

  // 4. Eén letter verschil = bijna goed (jij kiest of het telt).
  if (rules.allowTypos) {
    for (const f of forms) {
      const t = cmp(tidy(f, rules));
      if (t.length >= 4 && levenshtein(t, cmp(g)) === 1) return { result: 'bijna', expected: f, note: 'typfout' };
    }
  }

  return { result: 'fout', expected };
}
