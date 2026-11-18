/**
 * ZINNEN-SJABLONEN: een grammatica-onderwerp oefenen in de tijd die jij kiest.
 * Eén sjabloon = één zin met een gat (bijv. het lidwoord na een wisselvoorzetsel).
 * Het werkwoord komt uit de werkwoordmotor, in de gekozen tijd, op de goede plek:
 *   Präsens:  Ich lege das Buch auf ___ Tisch.
 *   Perfekt:  Ich habe das Buch auf ___ Tisch gelegt.
 *   Futur I:  Ich werde das Buch auf ___ Tisch legen.
 * (Duitse hoofdzin: persoonsvorm op plek 2, de rest van het werkwoord achteraan.)
 */
import type { LanguageCode } from '@/data/languages';
import { verbEngines } from '@/features/verbs/registry';
import type { Exercise } from './types';

export interface SentenceTemplate {
  /** Persoon voor de vervoeging (0 = ich … 5 = sie/Sie). */
  p: number;
  /** Onderwerp als het geen voornaamwoord is ("Das Buch", of met gat: "___ Lehrer"). */
  subject?: string;
  verb: string;
  /** Wat na de persoonsvorm komt, met ___ op de plek van het gat. */
  middle: string;
  answer: string;
  hint?: string;
  explain?: string;
  part?: string;
  cases?: string[];
}

/** Voornaamwoorden als onderwerp aan het begin van de zin. */
const SUBJECTS: Partial<Record<LanguageCode, string[]>> = {
  de: ['Ich', 'Du', 'Er', 'Wir', 'Ihr', 'Sie'],
};

/** Tijden waarin sjablonen niet werken (geen onderwerp in de gebiedende wijs). */
const SKIP_TENSES = new Set(['imperativ']);

const T = (t: SentenceTemplate) => t;

export const sentenceTemplates: Partial<Record<LanguageCode, Record<string, SentenceTemplate[]>>> = {
  de: {
    voorzetsels: [
      // Altijd Akkusativ
      T({ p: 0, verb: 'kaufen', middle: 'ein Geschenk für ___ Mutter', answer: 'meine', hint: 'meine', explain: 'für = altijd Akkusativ.', part: 'akk', cases: ['akk'] }),
      T({ p: 3, verb: 'gehen', middle: 'durch ___ Park', answer: 'den', hint: 'der', explain: 'durch = altijd Akkusativ; Park is mannelijk: den.', part: 'akk', cases: ['akk'] }),
      T({ p: 2, verb: 'spielen', middle: 'gegen ___ Bruder', answer: 'seinen', hint: 'sein', explain: 'gegen = altijd Akkusativ: seinen.', part: 'akk', cases: ['akk'] }),
      T({ p: 4, verb: 'laufen', middle: 'um ___ See', answer: 'den', hint: 'der See', explain: 'um = altijd Akkusativ.', part: 'akk', cases: ['akk'] }),
      T({ p: 1, verb: 'suchen', middle: 'ein Hotel für ___ Familie', answer: 'deine', hint: 'deine', explain: 'für = altijd Akkusativ.', part: 'akk', cases: ['akk'] }),
      // Altijd Dativ
      T({ p: 0, verb: 'fahren', middle: 'mit ___ Bus zur Schule', answer: 'dem', hint: 'der', explain: 'mit = altijd Dativ.', part: 'dat', cases: ['dat'] }),
      T({ p: 2, subject: 'Anna', verb: 'wohnen', middle: 'bei ___ Oma', answer: 'ihrer', hint: 'ihre', explain: 'bei = altijd Dativ; Oma is vrouwelijk: ihrer.', part: 'dat', cases: ['dat'] }),
      T({ p: 3, verb: 'kommen', middle: 'aus ___ Schweiz', answer: 'der', hint: 'die', explain: 'aus = altijd Dativ: die Schweiz → aus der Schweiz.', part: 'dat', cases: ['dat'] }),
      T({ p: 1, verb: 'sprechen', middle: 'mit ___ Lehrerin', answer: 'der', hint: 'die', explain: 'mit = altijd Dativ.', part: 'dat', cases: ['dat'] }),
      T({ p: 5, subject: 'Die Schüler', verb: 'gehen', middle: 'nach ___ Unterricht nach Hause', answer: 'dem', hint: 'der', explain: 'nach = altijd Dativ.', part: 'dat', cases: ['dat'] }),
      // Wisselvoorzetsels
      T({ p: 0, verb: 'legen', middle: 'das Buch auf ___ Tisch', answer: 'den', hint: 'der, wohin?', explain: 'legen: wohin? → Akkusativ.', part: 'wissel', cases: ['akk'] }),
      T({ p: 2, subject: 'Das Buch', verb: 'liegen', middle: 'auf ___ Tisch', answer: 'dem', hint: 'der, wo?', explain: 'liegen: wo? → Dativ.', part: 'wissel', cases: ['dat'] }),
      T({ p: 1, verb: 'stellen', middle: 'die Flasche in ___ Kühlschrank', answer: 'den', hint: 'der, wohin?', explain: 'stellen: wohin? → Akkusativ.', part: 'wissel', cases: ['akk'] }),
      T({ p: 2, subject: 'Die Flasche', verb: 'stehen', middle: 'in ___ Kühlschrank', answer: 'dem', hint: 'der, wo?', explain: 'stehen: wo? → Dativ.', part: 'wissel', cases: ['dat'] }),
      T({ p: 3, verb: 'sitzen', middle: 'unter ___ Baum', answer: 'dem', hint: 'der, wo?', explain: 'sitzen: wo? → Dativ.', part: 'wissel', cases: ['dat'] }),
      T({ p: 4, verb: 'fahren', middle: 'in ___ Stadt', answer: 'die', hint: 'die, wohin?', explain: 'Je gaat ergens heen: wohin? → Akkusativ.', part: 'wissel', cases: ['akk'] }),
      T({ p: 5, subject: 'Die Kinder', verb: 'spielen', middle: 'auf ___ Straße', answer: 'der', hint: 'die, wo?', explain: 'Plaats: wo? → Dativ.', part: 'wissel', cases: ['dat'] }),
      T({ p: 0, verb: 'setzen', middle: 'mich neben ___ Freund', answer: 'meinen', hint: 'mein, wohin?', explain: 'sich setzen: wohin? → Akkusativ.', part: 'wissel', cases: ['akk'] }),
      // Samentrekkingen
      T({ p: 0, verb: 'gehen', middle: 'heute ___ Kino', answer: 'ins', hint: 'in + das', explain: 'in + das = ins.', part: 'samen', cases: ['akk'] }),
      T({ p: 3, verb: 'gehen', middle: '___ Bahnhof', answer: 'zum', hint: 'zu + dem', explain: 'zu + dem = zum.', part: 'samen', cases: ['dat'] }),
      T({ p: 5, subject: 'Die Kinder', verb: 'spielen', middle: '___ Garten', answer: 'im', hint: 'in + dem', explain: 'in + dem = im.', part: 'samen', cases: ['dat'] }),
      T({ p: 1, verb: 'fahren', middle: 'jeden Tag ___ Arbeit', answer: 'zur', hint: 'zu + der', explain: 'zu + der = zur.', part: 'samen', cases: ['dat'] }),
      T({ p: 4, verb: 'treffen', middle: 'eure Freunde ___ Bahnhof', answer: 'am', hint: 'an + dem', explain: 'an + dem = am.', part: 'samen', cases: ['dat'] }),
    ],
    'reflexive-verben': [
      T({ p: 0, verb: 'freuen', middle: '___ auf die Ferien', answer: 'mich', hint: 'sich freuen', explain: 'ich → mich.', cases: ['akk'] }),
      T({ p: 1, verb: 'interessieren', middle: '___ für Musik', answer: 'dich', hint: 'sich interessieren', explain: 'du → dich.', cases: ['akk'] }),
      T({ p: 2, verb: 'setzen', middle: '___ auf den Stuhl', answer: 'sich', hint: 'sich setzen', explain: 'er/sie/es → sich.', cases: ['akk'] }),
      T({ p: 3, verb: 'treffen', middle: '___ im Park', answer: 'uns', hint: 'sich treffen', explain: 'wir → uns.', cases: ['akk'] }),
      T({ p: 4, verb: 'freuen', middle: '___ über das Geschenk', answer: 'euch', hint: 'sich freuen', explain: 'ihr → euch.', cases: ['akk'] }),
      T({ p: 5, subject: 'Die Schüler', verb: 'interessieren', middle: '___ für Sport', answer: 'sich', hint: 'sich interessieren', explain: 'sie (meervoud) → sich.', cases: ['akk'] }),
      T({ p: 0, verb: 'waschen', middle: '___ die Hände', answer: 'mir', hint: 'sich waschen', explain: 'die Hände is al het lijdend voorwerp → Dativ: mir.', cases: ['dat'] }),
      T({ p: 1, verb: 'putzen', middle: '___ die Zähne', answer: 'dir', hint: 'sich putzen', explain: 'die Zähne is al het lijdend voorwerp → Dativ: dir.', cases: ['dat'] }),
    ],
    naamvallen: [
      T({ p: 2, subject: '___ Lehrer', verb: 'sprechen', middle: 'langsam', answer: 'Der', hint: 'der', explain: 'Onderwerp: 1e naamval (Nominativ), mannelijk: der.', part: 'bepaald', cases: ['nom'] }),
      T({ p: 0, verb: 'sehen', middle: '___ Hund', answer: 'den', hint: 'der', explain: 'Lijdend voorwerp: 4e naamval, mannelijk: den.', part: 'bepaald', cases: ['akk'] }),
      T({ p: 0, verb: 'geben', middle: '___ Frau ein Buch', answer: 'der', hint: 'die', explain: 'Aan wie? 3e naamval, vrouwelijk: der.', part: 'bepaald', cases: ['dat'] }),
      T({ p: 3, verb: 'helfen', middle: '___ Kind', answer: 'dem', hint: 'das', explain: 'helfen + 3e naamval, onzijdig: dem.', part: 'bepaald', cases: ['dat'] }),
      T({ p: 1, verb: 'suchen', middle: '___ Stift', answer: 'einen', hint: 'ein', explain: 'Lijdend voorwerp: 4e naamval, mannelijk: einen.', part: 'onbepaald', cases: ['akk'] }),
      T({ p: 2, verb: 'kaufen', middle: '___ Fahrrad', answer: 'ein', hint: 'ein', explain: 'Onzijdig blijft in de 4e naamval ein.', part: 'onbepaald', cases: ['akk'] }),
      T({ p: 5, subject: 'Die Eltern', verb: 'schreiben', middle: '___ Sohn einen Brief', answer: 'ihrem', hint: 'ihr', explain: 'Aan wie? 3e naamval, mannelijk: ihrem.', part: 'onbepaald', cases: ['dat'] }),
      T({ p: 3, verb: 'besuchen', middle: '___ Großeltern', answer: 'unsere', hint: 'unser', explain: 'Meervoud, 4e naamval: unsere.', part: 'onbepaald', cases: ['akk'] }),
    ],
    adjektivdeklination: [
      T({ p: 0, verb: 'sehen', middle: 'den alt___ Mann', answer: 'en', explain: 'Na den (4e naamval): -en.', part: 'zwak', cases: ['akk'] }),
      T({ p: 1, verb: 'helfen', middle: 'der nett___ Frau', answer: 'en', explain: 'Na der (3e naamval): -en.', part: 'zwak', cases: ['dat'] }),
      T({ p: 5, subject: 'Die Kinder', verb: 'spielen', middle: 'mit dem neu___ Ball', answer: 'en', explain: 'Na dem: -en.', part: 'zwak', cases: ['dat'] }),
      T({ p: 0, verb: 'kaufen', middle: 'einen rot___ Pullover', answer: 'en', explain: 'Na einen: -en.', part: 'gemengd', cases: ['akk'] }),
      T({ p: 3, verb: 'wohnen', middle: 'in einem klein___ Haus', answer: 'en', explain: 'Na einem: -en.', part: 'gemengd', cases: ['dat'] }),
      T({ p: 2, subject: 'Anna', verb: 'trinken', middle: 'kalt___ Wasser', answer: 'es', explain: 'Zonder lidwoord: uitgang van das → -es.', part: 'sterk', cases: ['akk'] }),
      T({ p: 4, verb: 'kaufen', middle: 'frisch___ Brot', answer: 'es', explain: 'Zonder lidwoord: uitgang van das → -es.', part: 'sterk', cases: ['akk'] }),
      T({ p: 2, verb: 'trinken', middle: 'heiß___ Tee', answer: 'en', explain: 'Zonder lidwoord, 4e naamval mannelijk: uitgang van den → -en.', part: 'sterk', cases: ['akk'] }),
    ],
    personalpronomen: [
      T({ p: 0, verb: 'sehen', middle: '___ jeden Tag', answer: 'ihn', hint: 'er', explain: '4e naamval van er: ihn.', cases: ['akk'] }),
      T({ p: 1, verb: 'helfen', middle: '___ beim Lernen', answer: 'mir', hint: 'ich', explain: 'helfen + 3e naamval: mir.', cases: ['dat'] }),
      T({ p: 3, verb: 'besuchen', middle: '___ am Wochenende', answer: 'euch', hint: 'ihr', explain: '4e naamval van ihr: euch.', cases: ['akk'] }),
      T({ p: 2, verb: 'geben', middle: '___ das Buch', answer: 'uns', hint: 'wir', explain: 'Aan wie? 3e naamval: uns.', cases: ['dat'] }),
      T({ p: 5, subject: 'Die Lehrer', verb: 'fragen', middle: '___ nach dem Weg', answer: 'sie', hint: 'sie, enkelvoud', explain: '4e naamval van sie: sie.', cases: ['akk'] }),
      T({ p: 0, verb: 'schreiben', middle: '___ einen Brief', answer: 'ihnen', hint: 'sie, meervoud', explain: '3e naamval van sie (meervoud): ihnen.', cases: ['dat'] }),
    ],
  },
};

export const templatesFor = (lang: LanguageCode, topicId: string) => sentenceTemplates[lang]?.[topicId] ?? [];

/** Tijden waarin een sjabloon-onderwerp te oefenen is. */
export function templateTenses(lang: LanguageCode): string[] {
  return (verbEngines[lang]?.tenses ?? []).map((t) => t.id).filter((t) => !SKIP_TENSES.has(t));
}

/** Maakt de zin in de gekozen tijd. Geeft niets terug als die vorm niet bestaat. */
export function templateExercise(lang: LanguageCode, t: SentenceTemplate, tense: string): Exercise | undefined {
  const engine = verbEngines[lang];
  if (!engine || SKIP_TENSES.has(tense)) return undefined;
  const form = engine.bare(t.verb, tense, t.p);
  if (!form) return undefined;
  const [finite, ...rest] = form.split(' ');
  const subject = t.subject ?? SUBJECTS[lang]?.[t.p] ?? engine.persons[t.p];
  const sentence = `${[subject, finite, t.middle, ...rest].join(' ')}.`;
  const label = engine.tenses.find((x) => x.id === tense)?.label;
  return {
    type: 'gap',
    sentence,
    answer: t.answer,
    hint: [t.hint, label].filter(Boolean).join(' · '),
    explain: t.explain,
    part: t.part,
    cases: t.cases,
  };
}
