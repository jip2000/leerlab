/**
 * FOTO VAN JE GRAMMATICABOEK → wat staat erop?
 * We krijgen de tekst die de tekstherkenning uit de foto haalt, en zoeken:
 *  - tijden: aan hun naam ("passé composé", "Perfekt", "present perfect") of aan rijtjes
 *    die alleen in die tijd voorkomen ("je suis allé", "ich habe gemacht");
 *  - werkwoorden: hele werkwoord of meerdere vormen ervan;
 *  - onderwerpen: woorden die typisch zijn voor één onderwerp (bijv. "durch, für, gegen").
 * Alles draait in de browser. Niet perfect, daarom kan de gebruiker het daarna aanpassen.
 */
import type { LanguageCode } from '@/data/languages';
import { getLanguage } from '@/data/languages';
import { exercisesOf, grammar } from '@/data/grammar';
import { verbEngines } from '@/features/verbs/registry';
import { variants } from '@/features/verbs/table';
import { explanationTopicIds } from './tenseLinks';
import type { Block, TopicContent } from './types';

/** Kleine letters, zonder accenten en leestekens, met spaties eromheen: " je suis alle ". */
export function norm(s: string): string {
  const t = s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
  return ` ${t} `;
}
const has = (text: string, phrase: string) => phrase.trim() !== '' && text.includes(` ${phrase.trim()} `);

/** Andere namen voor tijden, zoals ze in boeken staan (zonder accenten, kleine letters). */
const ALIASES: Partial<Record<LanguageCode, Record<string, string[]>>> = {
  fr: {
    present: ['present', 'le present', 'present de l indicatif'],
    'passe-compose': ['passe compose'],
    imparfait: ['imparfait'],
    'plus-que-parfait': ['plus que parfait'],
    'futur-simple': ['futur simple', 'le futur'],
    'futur-proche': ['futur proche', 'futur immediat'],
    'passe-recent': ['passe recent'],
    conditionnel: ['conditionnel', 'conditionnel present'],
    'conditionnel-passe': ['conditionnel passe'],
    subjonctif: ['subjonctif', 'subjonctif present'],
    imperatif: ['imperatif'],
  },
  de: {
    praesens: ['prasens', 'praesens'],
    praeteritum: ['prateritum', 'praeteritum', 'imperfekt'],
    perfekt: ['perfekt'],
    plusquamperfekt: ['plusquamperfekt'],
    futur1: ['futur i', 'futur 1', 'futur'],
    konjunktiv2: ['konjunktiv ii', 'konjunktiv 2', 'konjunktiv'],
    imperativ: ['imperativ'],
  },
  en: {
    'present-simple': ['present simple', 'simple present'],
    'present-continuous': ['present continuous', 'present progressive'],
    'past-simple': ['past simple', 'simple past'],
    'past-continuous': ['past continuous', 'past progressive'],
    'present-perfect': ['present perfect', 'present perfect simple'],
    'present-perfect-continuous': ['present perfect continuous', 'present perfect progressive'],
    'past-perfect': ['past perfect'],
    'future-will': ['future will', 'will future', 'future simple', 'future with will'],
    'going-to': ['going to', 'be going to', 'future going to'],
    'future-perfect': ['future perfect'],
  },
  es: {
    presente: ['presente', 'presente de indicativo'],
    'presente-continuo': ['presente continuo', 'estar gerundio', 'gerundio'],
    indefinido: ['indefinido', 'preterito indefinido', 'preterito perfecto simple'],
    imperfecto: ['imperfecto', 'preterito imperfecto'],
    perfecto: ['preterito perfecto', 'perfecto compuesto', 'preterito perfecto compuesto'],
    pluscuamperfecto: ['pluscuamperfecto'],
    futuro: ['futuro', 'futuro simple'],
    condicional: ['condicional'],
    subjuntivo: ['subjuntivo', 'presente de subjuntivo', 'subjuntivo presente'],
    'subjuntivo-imperfecto': ['subjuntivo imperfecto', 'imperfecto de subjuntivo'],
    imperativo: ['imperativo'],
  },
  it: { trapassato: ['trapassato', 'trapassato prossimo'], futuro: ['futuro', 'futuro semplice'], condizionale: ['condizionale'], congiuntivo: ['congiuntivo'] },
  pt: { perfeito: ['preterito perfeito', 'perfeito'], imperfeito: ['preterito imperfeito', 'imperfeito'], 'mais-que-perfeito': ['mais que perfeito'], conjuntivo: ['conjuntivo', 'presente do conjuntivo'] },
  nl: { tt: ['tegenwoordige tijd', 'o t t', 'ott'], vt: ['verleden tijd', 'o v t', 'ovt'], vtt: ['voltooide tijd', 'voltooid tegenwoordige tijd', 'v t t', 'vtt'] },
};

/** Woorden die in bijna elke uitleg staan en dus niets zeggen over het onderwerp. */
const STOP = new Set(
  ('de het een en van in is op je te met voor dat die als bij of zijn niet ook aan er om maar dan wat wordt worden naar door uit kan hij zij ze we wij jij ik nog al zo deze dit '
    + 'hebt heeft hebben was waren geen meer veel wel moet moeten altijd vaak soms alleen andere woord woorden zin zinnen vorm vormen voorbeeld bijvoorbeeld '
    + 'enkelvoud meervoud mannelijk vrouwelijk onzijdig werkwoord werkwoorden tijd tijden persoon personen uitleg oefening oefeningen '
    + 'the and to of a in is you it that for on are with as be at this'
  ).split(' '),
);

const blockText = (b: Block): string[] => {
  switch (b.type) {
    case 'text':
    case 'tip':
      return [b.text.replace(/\*\*/g, '')];
    case 'table':
      return [b.caption ?? '', ...b.head, ...b.rows.flat()];
    case 'examples':
      return b.items.flat();
  }
};

/** Alle tekst die bij een onderwerp hoort (uitleg + vaste oefeningen). */
function topicText(t: TopicContent): string {
  const parts = t.blocks.flatMap(blockText);
  if (typeof t.exercises !== 'function')
    for (const e of t.exercises) {
      if (e.type === 'gap') parts.push(e.sentence, e.answer);
      if (e.type === 'choice') parts.push(e.question, ...e.options);
      if (e.type === 'table') parts.push(e.title, ...e.rows.map((r) => `${r.label} ${r.answer}`));
      if (e.type === 'fix' || e.type === 'translate') parts.push(e.answer);
    }
  return parts.join(' ');
}
const tokens = (s: string) => norm(s).trim().split(' ').filter((w) => w.length >= 3 && !STOP.has(w));

export interface FoundTense { id: string; label: string; why: 'naam' | 'vormen' }
export interface FoundTopic { id: string; title: string; score: number; parts?: string[] }
export interface PhotoAnalysis {
  tenses: FoundTense[];
  verbs: string[];
  topics: FoundTopic[];
}

export function analysePhotoText(lang: LanguageCode, raw: string): PhotoAnalysis {
  const text = norm(raw);
  const engine = verbEngines[lang];
  const out: PhotoAnalysis = { tenses: [], verbs: [], topics: [] };

  // 1. Tijden aan hun naam. Langste namen eerst en daarna wegstrepen,
  //    zodat "present perfect continuous" niet ook als "present perfect" telt.
  if (engine) {
    const names: { tense: string; phrase: string }[] = [];
    for (const t of engine.tenses) {
      const own = [norm(t.label), norm(t.id), ...(ALIASES[lang]?.[t.id] ?? []).map(norm)];
      for (const p of new Set(own.map((x) => x.trim()))) if (p.length >= 3) names.push({ tense: t.id, phrase: p });
    }
    names.sort((a, b) => b.phrase.length - a.phrase.length);
    let rest = text;
    const byName = new Set<string>();
    for (const n of names)
      if (has(rest, n.phrase)) {
        byName.add(n.tense);
        rest = rest.split(` ${n.phrase} `).join(' # ');
      }

    // 2. Tijden en werkwoorden aan de vormen in de tekst.
    const formHits = new Map<string, number>();
    const verbHits = new Map<string, number>();
    for (const v of engine.verbs) {
      const formsByTense = engine.tenses.map((t) => ({
        id: t.id,
        forms: [0, 1, 2, 3, 4, 5].flatMap((p) => variants(engine.bare(v.inf, t.id, p))).map((f) => norm(f).trim()).filter(Boolean),
      }));
      const count = new Map<string, number>();
      for (const f of formsByTense.flatMap((x) => x.forms)) count.set(f, (count.get(f) ?? 0) + 1);
      let hitsForVerb = 0;
      for (const { id, forms } of formsByTense) {
        // Alleen vormen die bij dit werkwoord in maar één tijd voorkomen, en niet te kort zijn
        // ("a", "es" staan overal); vormen van meer woorden ("suis alle") zijn altijd duidelijk.
        const unique = [...new Set(forms)].filter((f) => count.get(f) === 1 && (f.includes(' ') || f.length >= 4));
        const n = unique.filter((f) => has(text, f)).length;
        if (n) formHits.set(id, (formHits.get(id) ?? 0) + n);
        hitsForVerb += n;
      }
      const infinitive = norm(v.inf).trim();
      verbHits.set(v.inf, hitsForVerb + (infinitive.length >= 3 && has(text, infinitive) ? 2 : 0));
    }
    for (const t of engine.tenses) {
      if (byName.has(t.id)) out.tenses.push({ id: t.id, label: t.label, why: 'naam' });
      else if ((formHits.get(t.id) ?? 0) >= 3) out.tenses.push({ id: t.id, label: t.label, why: 'vormen' });
    }
    out.verbs = engine.verbs.map((v) => v.inf).filter((inf) => (verbHits.get(inf) ?? 0) >= 2);
  }

  // 3. Onderwerpen (zonder de uitleg-onderwerpen van tijden: die vonden we hierboven al).
  //    Telt mee: de hele naam van het onderwerp, of woorden die (bijna) alleen bij dit onderwerp
  //    horen. Losse woorden als "passé" of "simple" zeggen niets: die staan in veel namen.
  const skip = explanationTopicIds(lang);
  const lang_ = getLanguage(lang);
  const all = grammar[lang] ?? [];
  const titleOf = (id: string) => lang_.grammarTopics.find((g) => g.id === id)?.title ?? id;
  const tokenSets = new Map(all.map((t) => [t.id, new Set([...tokens(topicText(t)), ...tokens(titleOf(t.id))])]));
  const df = new Map<string, number>();
  for (const set of tokenSets.values()) for (const w of set) df.set(w, (df.get(w) ?? 0) + 1);
  for (const t of all) {
    if (skip.has(t.id)) continue;
    const title = titleOf(t.id);
    // De hele naam, of een stuk ervan ("ein-Gruppe" uit "der-Gruppe en ein-Gruppe").
    const bare = title.replace(/\(.*?\)/g, ' ');
    const phrases = [norm(bare).trim(), ...bare.split(/,| en | of | and /).map((x) => norm(x).trim()).filter((x) => x.length >= 8 && !STOP.has(x))];
    const titleTokens = new Set(tokens(title));
    let score = phrases.some((p, i) => (i === 0 ? p.length >= 5 : true) && has(text, p)) ? 6 : 0;
    for (const w of titleTokens) if (score < 6 && w.length >= 7 && (df.get(w) ?? 0) === 1 && has(text, w)) score += 3;
    for (const w of tokenSets.get(t.id)!) if (!titleTokens.has(w) && (df.get(w) ?? 0) <= 2 && has(text, w)) score += 1;
    if (score >= 5) {
      // Onderdelen: welke hints (bijv. "durch, für, gegen") staan op de foto?
      // Alleen woorden die bij dát onderdeel horen (niet "Gruppe" of "Voorzetsels", die delen ze).
      const own = (p: { label: string; hint?: string }) => new Set(tokens(`${p.label} ${p.hint ?? ''}`));
      const parts = t.parts
        ?.filter((p) => {
          const others = new Set(t.parts!.filter((x) => x !== p).flatMap((x) => [...own(x)]));
          return [...own(p)].filter((w) => !others.has(w) && has(text, w)).length >= 2;
        })
        .map((p) => p.id);
      out.topics.push({ id: t.id, title, score, parts: parts?.length ? parts : undefined });
    }
  }
  out.topics.sort((a, b) => b.score - a.score);
  out.topics = out.topics.slice(0, 3);
  return out;
}

/** Hebben we iets herkend? */
export const foundAnything = (a: PhotoAnalysis) => a.tenses.length + a.topics.length > 0;

/** Voor tests en de uitleg op het scherm: hoeveel oefeningen heeft een onderwerp? */
export const exerciseCount = (t: TopicContent) => exercisesOf(t).length;
