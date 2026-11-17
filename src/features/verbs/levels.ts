/**
 * MOEILIJKHEID VAN DE ZINNEN (oefenvorm "In een zin")
 * 1 Makkelijk: korte zin, het voornaamwoord staat vlak voor het gat (Ich ___ (gestern)).
 * 2 Gemiddeld: een korte inleiding ervoor, en bij hij/zij (mv) een echt onderwerp
 *   ("Mein Bruder", "mes parents"): je moet zelf zien welke persoon het is.
 * 3 Moeilijk: een lange zin met een bijzin ervoor en een vervolg erna.
 *
 * De zin zelf (met het gat) komt van de werkwoordmotor; hier zetten we hem tussen
 * aanhalingstekens in een groter verhaal. Zo blijft de woordvolgorde altijd kloppen.
 */
import type { LanguageCode } from '@/data/languages';

export type Level = 1 | 2 | 3;

export const levels: { id: Level; label: string; text: string }[] = [
  { id: 1, label: 'Makkelijk', text: 'Korte zin, het werkwoord zie je meteen' },
  { id: 2, label: 'Gemiddeld', text: 'Langere zin, soms een naam in plaats van hij/zij' },
  { id: 3, label: 'Moeilijk', text: 'Lange zinnen met een bijzin ervoor en erna' },
];

interface LangLevels {
  /** Voornaamwoord in de zin → echt onderwerp, voor persoon 3 ev (2) en 3 mv (5). */
  subject: Partial<Record<2 | 5, { find: RegExp; nouns: string[] }>>;
  /** [ervoor, erna] */
  medium: [string, string][];
  hard: [string, string][];
}

const data: Partial<Record<LanguageCode, LangLevels>> = {
  fr: {
    subject: {
      // "il" als laatste los woord ("Il faut qu’il" → "Il faut que mon frère").
      2: { find: /(qu’|\b)il\b(?!.*\bil\b)/i, nouns: ['mon frère', 'le voisin', 'Paul'] },
      5: { find: /(qu’|\b)ils\b(?!.*\bils\b)/i, nouns: ['mes parents', 'les voisins', 'mes cousins'] },
    },
    medium: [['Léa dit : « ', ' »'], ['Mon ami m’écrit : « ', ' »'], ['Le prof explique : « ', ' »']],
    hard: [
      ['Pendant la pause de midi, alors que tout le monde parlait des vacances, Léa a raconté à ses amis : « ', ' », mais personne ne voulait vraiment la croire.'],
      ['Dans le message qu’il m’a envoyé hier soir après l’entraînement de foot, mon cousin écrit : « ', ' », et ensuite il m’a demandé de répondre vite.'],
    ],
  },
  de: {
    subject: {
      2: { find: /^Er\b/, nouns: ['Mein Bruder', 'Der Nachbar', 'Paul'] },
      5: { find: /^Sie\b/, nouns: ['Meine Eltern', 'Die Nachbarn', 'Meine Freunde'] },
    },
    medium: [['Lisa sagt: „', '“'], ['Mein Freund schreibt: „', '“'], ['Die Lehrerin erklärt: „', '“']],
    hard: [
      ['Als wir nach den langen Sommerferien endlich wieder in der Schule saßen, erzählte Lisa ihren Freundinnen: „', '“ – aber niemand wollte ihr so richtig glauben.'],
      ['In der Nachricht, die er mir gestern Abend nach dem Fußballtraining geschickt hat, schreibt mein Cousin: „', '“, und dann bittet er mich, schnell zu antworten.'],
    ],
  },
  en: {
    subject: {
      2: { find: /^He\b/, nouns: ['My brother', 'The neighbour', 'Tom'] },
      5: { find: /^They\b/, nouns: ['My parents', 'The neighbours', 'My cousins'] },
    },
    medium: [['Emma says: "', '"'], ['My friend writes: "', '"'], ['The teacher explains: "', '"']],
    hard: [
      ['While everyone was talking about the holidays during the lunch break, Emma suddenly told her friends: "', '", but nobody really believed her.'],
      ['In the message he sent me late last night after football practice, my cousin writes: "', '", and then he asks me to reply quickly.'],
    ],
  },
  es: {
    subject: {
      2: { find: /^\(él\)/, nouns: ['Mi hermano', 'El vecino', 'Pablo'] },
      5: { find: /^\(ellos\)/, nouns: ['Mis padres', 'Los vecinos', 'Mis primos'] },
    },
    medium: [['Lucía dice: «', '»'], ['Mi amigo escribe: «', '»'], ['El profesor explica: «', '»']],
    hard: [
      ['Mientras todos hablaban de las vacaciones durante el recreo, Lucía les contó a sus amigos: «', '», pero nadie la creyó del todo.'],
      ['En el mensaje que me mandó anoche después del entrenamiento, mi primo escribe: «', '», y luego me pide que le conteste pronto.'],
    ],
  },
  it: {
    subject: {
      2: { find: /^\(lui\/lei\)/, nouns: ['Mio fratello', 'Il vicino', 'Marco'] },
      5: { find: /^\(loro\)/, nouns: ['I miei genitori', 'I vicini', 'I miei cugini'] },
    },
    medium: [['Giulia dice: «', '»'], ['Il mio amico scrive: «', '»'], ['Il professore spiega: «', '»']],
    hard: [
      ['Mentre tutti parlavano delle vacanze durante l’intervallo, Giulia ha raccontato ai suoi amici: «', '», ma nessuno le ha creduto davvero.'],
      ['Nel messaggio che mi ha mandato ieri sera dopo l’allenamento, mio cugino scrive: «', '», e poi mi chiede di rispondere subito.'],
    ],
  },
  pt: {
    subject: {
      2: { find: /^\(ele\)/, nouns: ['O meu irmão', 'O vizinho', 'O Pedro'] },
      5: { find: /^\(eles\)/, nouns: ['Os meus pais', 'Os vizinhos', 'Os meus primos'] },
    },
    medium: [['A Ana diz: «', '»'], ['O meu amigo escreve: «', '»'], ['O professor explica: «', '»']],
    hard: [
      ['Enquanto todos falavam das férias durante o intervalo, a Ana contou aos amigos: «', '», mas ninguém acreditou nela.'],
      ['Na mensagem que me mandou ontem à noite depois do treino, o meu primo escreve: «', '», e depois pede-me para responder depressa.'],
    ],
  },
};

/** Heeft deze taal echte zinnen (en dus niveaus)? Latijn oefent alleen losse vormen. */
export const hasLevels = (lang: LanguageCode) => !!data[lang];

/** Vast getal per vraag, zodat de zin niet verspringt tijdens het oefenen. */
function pick<T>(list: T[], key: string): T {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return list[h % list.length]!;
}

export function levelSentence(
  lang: LanguageCode,
  base: { before: string; after: string } | undefined,
  key: { verb: string; tense: string; person: number },
  level: Level,
): { before: string; after: string } | undefined {
  const d = data[lang];
  if (!base || !d || level === 1) return base;
  const id = `${key.verb}|${key.tense}|${key.person}`;
  let before = base.before;
  const subj = key.person === 2 || key.person === 5 ? d.subject[key.person] : undefined;
  if (subj && subj.find.test(before)) {
    const noun = pick(subj.nouns, id);
    before = before.replace(subj.find, (m, qu?: string) => {
      // Frans: "qu’il" → "que mon frère"; hoofdletter houden aan het begin van de zin.
      const n = /^[A-ZÀ-Ý]/.test(m) && !qu ? noun.charAt(0).toUpperCase() + noun.slice(1) : noun;
      return typeof qu === 'string' && qu.startsWith('qu') ? `que ${n}` : n;
    });
  }
  const [pre, post] = pick(level === 2 ? d.medium : d.hard, id);
  // Bij een vervolg na het citaat ("», mais…") hoort de punt van de zin er niet meer bij.
  const after = level === 3 ? base.after.trimEnd().replace(/\.$/, '') : base.after.trimEnd();
  return { before: pre + before, after: after + post };
}
