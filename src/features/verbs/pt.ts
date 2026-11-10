/**
 * Vervoegingsmotor PORTUGEES (Europees Portugees, met vós voor de volledigheid).
 *  - Spelling: -car → qu, -gar → gu, -çar → c vóór e (fiquei, paguei, comecei);
 *    -cer → ç en -ger/-gir → j vóór a/o (conheço, protejo)
 *  - Persoonlijke infinitief: falar, falares, falar, falarmos, falardes, falarem
 */
import type { Tense, VerbEngine, VerbInfo } from './types';

type Six = [string, string, string, string, string, string];

interface PtVerb {
  inf: string;
  nl: string;
  pres?: Six;
  perf?: Six;
  impf?: Six;
  conj?: Six;
  fut?: string;
  pp?: string;
}

const verbs: PtVerb[] = [
  { inf: 'ser', nl: 'zijn', pres: ['sou', 'és', 'é', 'somos', 'sois', 'são'], perf: ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'], impf: ['era', 'eras', 'era', 'éramos', 'éreis', 'eram'], conj: ['seja', 'sejas', 'seja', 'sejamos', 'sejais', 'sejam'] },
  { inf: 'estar', nl: 'zijn (toestand)', pres: ['estou', 'estás', 'está', 'estamos', 'estais', 'estão'], perf: ['estive', 'estiveste', 'esteve', 'estivemos', 'estivestes', 'estiveram'], conj: ['esteja', 'estejas', 'esteja', 'estejamos', 'estejais', 'estejam'] },
  { inf: 'ter', nl: 'hebben', pres: ['tenho', 'tens', 'tem', 'temos', 'tendes', 'têm'], perf: ['tive', 'tiveste', 'teve', 'tivemos', 'tivestes', 'tiveram'], impf: ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tínheis', 'tinham'], conj: ['tenha', 'tenhas', 'tenha', 'tenhamos', 'tenhais', 'tenham'] },
  { inf: 'ir', nl: 'gaan', pres: ['vou', 'vais', 'vai', 'vamos', 'ides', 'vão'], perf: ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'], conj: ['vá', 'vás', 'vá', 'vamos', 'vades', 'vão'] },
  { inf: 'fazer', nl: 'doen, maken', pres: ['faço', 'fazes', 'faz', 'fazemos', 'fazeis', 'fazem'], perf: ['fiz', 'fizeste', 'fez', 'fizemos', 'fizestes', 'fizeram'], conj: ['faça', 'faças', 'faça', 'façamos', 'façais', 'façam'], fut: 'far', pp: 'feito' },
  { inf: 'dizer', nl: 'zeggen', pres: ['digo', 'dizes', 'diz', 'dizemos', 'dizeis', 'dizem'], perf: ['disse', 'disseste', 'disse', 'dissemos', 'dissestes', 'disseram'], conj: ['diga', 'digas', 'diga', 'digamos', 'digais', 'digam'], fut: 'dir', pp: 'dito' },
  { inf: 'poder', nl: 'kunnen', pres: ['posso', 'podes', 'pode', 'podemos', 'podeis', 'podem'], perf: ['pude', 'pudeste', 'pôde', 'pudemos', 'pudestes', 'puderam'], conj: ['possa', 'possas', 'possa', 'possamos', 'possais', 'possam'] },
  { inf: 'querer', nl: 'willen', pres: ['quero', 'queres', 'quer', 'queremos', 'quereis', 'querem'], perf: ['quis', 'quiseste', 'quis', 'quisemos', 'quisestes', 'quiseram'], conj: ['queira', 'queiras', 'queira', 'queiramos', 'queirais', 'queiram'] },
  { inf: 'saber', nl: 'weten', pres: ['sei', 'sabes', 'sabe', 'sabemos', 'sabeis', 'sabem'], perf: ['soube', 'soubeste', 'soube', 'soubemos', 'soubestes', 'souberam'], conj: ['saiba', 'saibas', 'saiba', 'saibamos', 'saibais', 'saibam'] },
  { inf: 'vir', nl: 'komen', pres: ['venho', 'vens', 'vem', 'vimos', 'vindes', 'vêm'], perf: ['vim', 'vieste', 'veio', 'viemos', 'viestes', 'vieram'], impf: ['vinha', 'vinhas', 'vinha', 'vínhamos', 'vínheis', 'vinham'], conj: ['venha', 'venhas', 'venha', 'venhamos', 'venhais', 'venham'], pp: 'vindo' },
  { inf: 'ver', nl: 'zien', pres: ['vejo', 'vês', 'vê', 'vemos', 'vedes', 'veem'], perf: ['vi', 'viste', 'viu', 'vimos', 'vistes', 'viram'], conj: ['veja', 'vejas', 'veja', 'vejamos', 'vejais', 'vejam'], pp: 'visto' },
  { inf: 'dar', nl: 'geven', pres: ['dou', 'dás', 'dá', 'damos', 'dais', 'dão'], perf: ['dei', 'deste', 'deu', 'demos', 'destes', 'deram'], conj: ['dê', 'dês', 'dê', 'demos', 'deis', 'deem'] },
  { inf: 'pôr', nl: 'zetten, leggen', pres: ['ponho', 'pões', 'põe', 'pomos', 'pondes', 'põem'], perf: ['pus', 'puseste', 'pôs', 'pusemos', 'pusestes', 'puseram'], impf: ['punha', 'punhas', 'punha', 'púnhamos', 'púnheis', 'punham'], conj: ['ponha', 'ponhas', 'ponha', 'ponhamos', 'ponhais', 'ponham'], fut: 'por', pp: 'posto' },
  { inf: 'trazer', nl: 'brengen', pres: ['trago', 'trazes', 'traz', 'trazemos', 'trazeis', 'trazem'], perf: ['trouxe', 'trouxeste', 'trouxe', 'trouxemos', 'trouxestes', 'trouxeram'], conj: ['traga', 'tragas', 'traga', 'tragamos', 'tragais', 'tragam'], fut: 'trar' },
  // regelmatig (met spellingsregels)
  { inf: 'falar', nl: 'spreken' },
  { inf: 'trabalhar', nl: 'werken' },
  { inf: 'morar', nl: 'wonen' },
  { inf: 'estudar', nl: 'studeren' },
  { inf: 'ficar', nl: 'blijven, worden' },
  { inf: 'chegar', nl: 'aankomen' },
  { inf: 'pagar', nl: 'betalen' },
  { inf: 'começar', nl: 'beginnen' },
  { inf: 'comer', nl: 'eten' },
  { inf: 'beber', nl: 'drinken' },
  { inf: 'aprender', nl: 'leren' },
  { inf: 'escrever', nl: 'schrijven', pp: 'escrito' },
  { inf: 'conhecer', nl: 'kennen' },
  { inf: 'partir', nl: 'vertrekken' },
  { inf: 'abrir', nl: 'openen', pp: 'aberto' },
  { inf: 'decidir', nl: 'besluiten' },
];

export const ptTenses: Tense[] = [
  { id: 'presente', label: 'presente' },
  { id: 'perfeito', label: 'pretérito perfeito' },
  { id: 'imperfeito', label: 'pretérito imperfeito' },
  { id: 'mais-que-perfeito', label: 'mais-que-perfeito composto' },
  { id: 'futuro', label: 'futuro' },
  { id: 'condicional', label: 'condicional' },
  { id: 'conjuntivo', label: 'conjuntivo presente' },
  { id: 'infinitivo-pessoal', label: 'infinitivo pessoal' },
];

const PRON = ['eu', 'tu', 'ele/ela/você', 'nós', 'vós', 'eles/elas/vocês'];
const PRONS = [['eu'], ['tu'], ['ele', 'ela', 'você'], ['nós'], ['vós'], ['eles', 'elas', 'vocês']];

const byInf = new Map(verbs.map((v) => [v.inf, v]));
const get = (inf: string) => {
  const v = byInf.get(inf);
  if (!v) throw new Error(`Onbekend Portugees werkwoord: ${inf}`);
  return v;
};
const group = (inf: string) => (inf.endsWith('ar') ? 'ar' : inf.endsWith('er') ? 'er' : 'ir');
const stemOf = (inf: string) => inf.slice(0, -2);

function spell(inf: string, stem: string, ending: string): string {
  const soft = /^[eé]/.test(ending);
  const hard = /^[ao]/.test(ending);
  if (inf.endsWith('car') && soft) return stem.replace(/c$/, 'qu') + ending;
  if (inf.endsWith('gar') && soft) return stem.replace(/g$/, 'gu') + ending;
  if (inf.endsWith('çar') && soft) return stem.replace(/ç$/, 'c') + ending;
  if (inf.endsWith('cer') && hard) return stem.replace(/c$/, 'ç') + ending;
  if (/g[ei]r$/.test(inf) && hard) return stem.replace(/g$/, 'j') + ending;
  return stem + ending;
}

const END = {
  pres: { ar: ['o', 'as', 'a', 'amos', 'ais', 'am'], er: ['o', 'es', 'e', 'emos', 'eis', 'em'], ir: ['o', 'es', 'e', 'imos', 'is', 'em'] },
  perf: { ar: ['ei', 'aste', 'ou', 'ámos', 'astes', 'aram'], er: ['i', 'este', 'eu', 'emos', 'estes', 'eram'], ir: ['i', 'iste', 'iu', 'imos', 'istes', 'iram'] },
  impf: { ar: ['ava', 'avas', 'ava', 'ávamos', 'áveis', 'avam'], er: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'], ir: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'] },
  conj: { ar: ['e', 'es', 'e', 'emos', 'eis', 'em'], er: ['a', 'as', 'a', 'amos', 'ais', 'am'], ir: ['a', 'as', 'a', 'amos', 'ais', 'am'] },
};

const conj6 = (v: PtVerb, key: keyof typeof END) => END[key][group(v.inf)].map((e) => spell(v.inf, stemOf(v.inf), e));
const futStem = (v: PtVerb) => v.fut ?? (v.inf === 'pôr' ? 'por' : v.inf);
const pp = (v: PtVerb) => v.pp ?? stemOf(v.inf) + (group(v.inf) === 'ar' ? 'ado' : 'ido');

function bareForms(inf: string, tense: string): string[] {
  const v = get(inf);
  switch (tense) {
    case 'presente': return v.pres ? [...v.pres] : conj6(v, 'pres');
    case 'perfeito': return v.perf ? [...v.perf] : conj6(v, 'perf');
    case 'imperfeito': return v.impf ? [...v.impf] : END.impf[group(inf)].map((e) => stemOf(inf) + e);
    case 'futuro': return ['ei', 'ás', 'á', 'emos', 'eis', 'ão'].map((e) => futStem(v) + e);
    case 'condicional': return ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'].map((e) => futStem(v) + e);
    case 'conjuntivo': return v.conj ? [...v.conj] : conj6(v, 'conj');
    case 'mais-que-perfeito': return ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tínheis', 'tinham'].map((t) => `${t} ${pp(v)}`);
    case 'infinitivo-pessoal': {
      const base = inf === 'pôr' ? 'por' : inf;
      return [inf, `${base}es`, inf, `${base}mos`, `${base}des`, `${base}em`];
    }
    default: throw new Error(`Onbekende tijd: ${tense}`);
  }
}

function explain(inf: string, tense: string, i: number): string | undefined {
  const v = get(inf);
  if (tense === 'presente' && v.pres) return `${inf} is onregelmatig in de presente.`;
  if (tense === 'perfeito') {
    if (v.perf) return `${inf} is onregelmatig in de pretérito perfeito.`;
    if (i === 0 && /(car|gar|çar)$/.test(inf)) return `Spelling: vóór -ei verandert -car in -qu-, -gar in -gu- en -çar in -c- (${bareForms(inf, 'perfeito')[0]}).`;
    if (i === 3 && group(inf) === 'ar') return 'In Portugal schrijf je nós falámos (met accent) om het verschil met de presente te zien.';
  }
  if (tense === 'futuro' || tense === 'condicional') return v.fut ? `${inf} heeft een korte stam: ${v.fut}-.` : 'Hele infinitief + uitgang.';
  if (tense === 'conjuntivo') return v.conj ? `${inf} is onregelmatig in de conjuntivo.` : '-ar → -e, -er/-ir → -a (de "omgekeerde" klinker).';
  if (tense === 'mais-que-perfeito') return `tinha + voltooid deelwoord (${pp(v)}).`;
  if (tense === 'infinitivo-pessoal') return 'Infinitief + -es, -mos, -des, -em als het een eigen onderwerp heeft.';
  return undefined;
}

const first = (s: string) => s.split(' / ')[0]!;

export const ptEngine: VerbEngine = {
  lang: 'pt',
  persons: PRON,
  tenses: ptTenses,
  verbs: verbs.map((v): VerbInfo => ({ inf: v.inf, nl: v.nl, tags: [v.pres ? 'onregelmatig' : 'regelmatig'] })),
  presets: [
    { id: 'onr', label: 'Onregelmatig', filter: (v) => v.tags.includes('onregelmatig') },
    { id: 'reg', label: 'Regelmatig', filter: (v) => v.tags.includes('regelmatig') },
  ],
  conjugate: (inf, tense) => bareForms(inf, tense).map((f, i) => `${PRON[i]} ${first(f)}`),
  answer(inf, tense, i) {
    const f = bareForms(inf, tense)[i]!;
    const out = f.split(' / ').flatMap((v) => [v, ...PRONS[i]!.map((p) => `${p} ${v}`), ...(tense === 'conjuntivo' ? PRONS[i]!.map((p) => `que ${p} ${v}`) : [])]);
    // In Brazilië zonder accent: falamos (perfeito).
    if (tense === 'perfeito' && i === 3) out.push(f.replace('ámos', 'amos'));
    return [...new Set(out)].join(' / ');
  },
  bare: (inf, tense, i) => first(bareForms(inf, tense)[i] ?? ''),
  explain,
  sentence: (_inf, _tense, i) => ({ before: `(${PRONS[i]![0]}) `, after: '' }),
};
