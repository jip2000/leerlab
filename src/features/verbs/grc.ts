/**
 * Werkwoorden OUDGRIEKS: praesens, imperfectum, futurum en aoristus (indicativus activum).
 * Regelmatige werkwoorden op -ω worden uit hun stammen gemaakt. Het accent is
 * "terugtrekkend": daarom twee stammen voor imperfectum/aoristus (ἔλυον maar ἐλύομεν).
 * Accenten en spiritus hoef je niet te typen: zonder telt het ook als goed.
 */
import { tableEngine, type Six, type TableVerb } from './table';

const end = (stem: string, e: Six): Six => e.map((x) => stem + x) as Six;
const PRES: Six = ['ω', 'εις', 'ει', 'ομεν', 'ετε', 'ουσι(ν)'];

/** Imperfectum/aoristus: stam met accent vooraan voor ev + 3 mv, verschoven voor 1/2 mv. */
const past = (lang: string, kort: string, e: Six): Six => [lang + e[0], lang + e[1], lang + e[2], kort + e[3], kort + e[4], lang + e[5]];
const IMPF: Six = ['ον', 'ες', 'ε(ν)', 'ομεν', 'ετε', 'ον'];
const AOR: Six = ['α', 'ας', 'ε(ν)', 'αμεν', 'ατε', 'αν'];

interface Stammen {
  inf: string;
  nl: string;
  pres: string;
  impf: [string, string];
  fut: string;
  aor?: [string, string];
  aorForms?: Six;
}

const thema = (s: Stammen): TableVerb => ({
  inf: s.inf,
  nl: s.nl,
  tags: ['regelmatig'],
  forms: {
    praesens: end(s.pres, PRES),
    imperfectum: past(s.impf[0], s.impf[1], IMPF),
    futurum: end(s.fut, PRES),
    aoristus: s.aorForms ?? past(s.aor![0], s.aor![1], AOR),
  },
});

export const grcEngine = tableEngine({
  lang: 'grc',
  persons: ['1 ev (ik)', '2 ev (jij)', '3 ev (hij/zij/het)', '1 mv (wij)', '2 mv (jullie)', '3 mv (zij)'],
  pronouns: false,
  lenientAccents: true,
  tenses: [
    { id: 'praesens', label: 'praesens' },
    { id: 'imperfectum', label: 'imperfectum' },
    { id: 'futurum', label: 'futurum' },
    { id: 'aoristus', label: 'aoristus' },
  ],
  presets: [
    { id: 'onr', label: 'Onregelmatig', filter: (v) => v.tags.includes('onregelmatig') },
    { id: 'reg', label: 'Regelmatig', filter: (v) => v.tags.includes('regelmatig') },
  ],
  verbs: [
    {
      inf: 'εἰμί',
      nl: 'zijn',
      tags: ['onregelmatig'],
      forms: {
        praesens: ['εἰμί', 'εἶ', 'ἐστί(ν)', 'ἐσμέν', 'ἐστέ', 'εἰσί(ν)'],
        imperfectum: ['ἦ / ἦν', 'ἦσθα', 'ἦν', 'ἦμεν', 'ἦτε', 'ἦσαν'],
        futurum: ['ἔσομαι', 'ἔσῃ / ἔσει', 'ἔσται', 'ἐσόμεθα', 'ἔσεσθε', 'ἔσονται'],
        aoristus: ['', '', '', '', '', ''],
      },
    },
    thema({ inf: 'λύω', nl: 'losmaken', pres: 'λύ', impf: ['ἔλυ', 'ἐλύ'], fut: 'λύσ', aor: ['ἔλυσ', 'ἐλύσ'] }),
    thema({ inf: 'παιδεύω', nl: 'opvoeden', pres: 'παιδεύ', impf: ['ἐπαίδευ', 'ἐπαιδεύ'], fut: 'παιδεύσ', aor: ['ἐπαίδευσ', 'ἐπαιδεύσ'] }),
    thema({ inf: 'κελεύω', nl: 'bevelen', pres: 'κελεύ', impf: ['ἐκέλευ', 'ἐκελεύ'], fut: 'κελεύσ', aor: ['ἐκέλευσ', 'ἐκελεύσ'] }),
    thema({ inf: 'πιστεύω', nl: 'geloven, vertrouwen', pres: 'πιστεύ', impf: ['ἐπίστευ', 'ἐπιστεύ'], fut: 'πιστεύσ', aor: ['ἐπίστευσ', 'ἐπιστεύσ'] }),
    thema({ inf: 'βουλεύω', nl: 'beraadslagen', pres: 'βουλεύ', impf: ['ἐβούλευ', 'ἐβουλεύ'], fut: 'βουλεύσ', aor: ['ἐβούλευσ', 'ἐβουλεύσ'] }),
    thema({ inf: 'θύω', nl: 'offeren', pres: 'θύ', impf: ['ἔθυ', 'ἐθύ'], fut: 'θύσ', aor: ['ἔθυσ', 'ἐθύσ'] }),
    thema({ inf: 'γράφω', nl: 'schrijven', pres: 'γράφ', impf: ['ἔγραφ', 'ἐγράφ'], fut: 'γράψ', aor: ['ἔγραψ', 'ἐγράψ'] }),
    thema({ inf: 'πέμπω', nl: 'sturen', pres: 'πέμπ', impf: ['ἔπεμπ', 'ἐπέμπ'], fut: 'πέμψ', aor: ['ἔπεμψ', 'ἐπέμψ'] }),
    {
      ...thema({
        inf: 'λέγω', nl: 'zeggen', pres: 'λέγ', impf: ['ἔλεγ', 'ἐλέγ'], fut: 'λέξ',
        aorForms: ['εἶπον', 'εἶπες', 'εἶπε(ν)', 'εἴπομεν', 'εἴπετε', 'εἶπον'],
      }),
      tags: ['onregelmatig'],
    },
  ],
  explain: (v, tense) => {
    if (v.inf === 'εἰμί') return 'εἰμί is onregelmatig: leer dit rijtje uit je hoofd.';
    if (tense === 'imperfectum') return 'Imperfectum: augment ἐ- + praesensstam + -ον, -ες, -ε(ν), -ομεν, -ετε, -ον.';
    if (tense === 'aoristus') return v.inf === 'λέγω' ? 'λέγω heeft een sterke aoristus: εἶπον.' : 'Sigmatische aoristus: augment ἐ- + stam + σ + -α, -ας, -ε(ν), -αμεν, -ατε, -αν.';
    if (tense === 'futurum') return 'Futurum: stam + σ + de uitgangen van het praesens (γραφ- + σ → γραψ-).';
    return 'Praesens: -ω, -εις, -ει, -ομεν, -ετε, -ουσι(ν).';
  },
});
