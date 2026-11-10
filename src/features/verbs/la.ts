/**
 * Vervoegingsmotor LATIJN. Alle vormen komen uit de vier stamtijden:
 *   laudo, laudare, laudavi, laudatum
 * Conjugaties: 1 (-are), 2 (-ere, -eo), 3 (-ere), 4 (-ire), gemengd (capio, capere).
 * esse, posse, ire, ferre en velle staan volledig uitgeschreven.
 * Lengtetekens worden weggelaten (laudare in plaats van laudāre).
 */
import type { Tense, VerbEngine, VerbInfo } from './types';

type Six = [string, string, string, string, string, string];

interface LaVerb {
  pres: string; // 1e ev praesens
  inf: string;
  perf: string; // 1e ev perfectum
  sup?: string;
  nl: string;
  /** Geen passief (intransitief). */
  noPass?: boolean;
  imp?: [string, string];
}

const verbs: LaVerb[] = [
  { pres: 'laudo', inf: 'laudare', perf: 'laudavi', sup: 'laudatum', nl: 'prijzen' },
  { pres: 'amo', inf: 'amare', perf: 'amavi', sup: 'amatum', nl: 'houden van' },
  { pres: 'voco', inf: 'vocare', perf: 'vocavi', sup: 'vocatum', nl: 'roepen' },
  { pres: 'porto', inf: 'portare', perf: 'portavi', sup: 'portatum', nl: 'dragen' },
  { pres: 'do', inf: 'dare', perf: 'dedi', sup: 'datum', nl: 'geven' },
  { pres: 'moneo', inf: 'monere', perf: 'monui', sup: 'monitum', nl: 'waarschuwen' },
  { pres: 'habeo', inf: 'habere', perf: 'habui', sup: 'habitum', nl: 'hebben' },
  { pres: 'video', inf: 'videre', perf: 'vidi', sup: 'visum', nl: 'zien' },
  { pres: 'teneo', inf: 'tenere', perf: 'tenui', sup: 'tentum', nl: 'vasthouden' },
  { pres: 'timeo', inf: 'timere', perf: 'timui', nl: 'vrezen' },
  { pres: 'rego', inf: 'regere', perf: 'rexi', sup: 'rectum', nl: 'besturen' },
  { pres: 'duco', inf: 'ducere', perf: 'duxi', sup: 'ductum', nl: 'leiden', imp: ['duc', 'ducite'] },
  { pres: 'dico', inf: 'dicere', perf: 'dixi', sup: 'dictum', nl: 'zeggen', imp: ['dic', 'dicite'] },
  { pres: 'mitto', inf: 'mittere', perf: 'misi', sup: 'missum', nl: 'sturen' },
  { pres: 'scribo', inf: 'scribere', perf: 'scripsi', sup: 'scriptum', nl: 'schrijven' },
  { pres: 'lego', inf: 'legere', perf: 'legi', sup: 'lectum', nl: 'lezen' },
  { pres: 'audio', inf: 'audire', perf: 'audivi', sup: 'auditum', nl: 'horen' },
  { pres: 'venio', inf: 'venire', perf: 'veni', sup: 'ventum', nl: 'komen', noPass: true },
  { pres: 'dormio', inf: 'dormire', perf: 'dormivi', sup: 'dormitum', nl: 'slapen', noPass: true },
  { pres: 'capio', inf: 'capere', perf: 'cepi', sup: 'captum', nl: 'nemen' },
  { pres: 'facio', inf: 'facere', perf: 'feci', sup: 'factum', nl: 'doen, maken', imp: ['fac', 'facite'], noPass: true }, // passief is fio (onregelmatig)
];

/** Volledig onregelmatig: per tijd zes vormen ('' = bestaat niet). */
const IRR: Record<string, { nl: string; forms: Record<string, Six | string[]> }> = {
  esse: { nl: 'zijn', forms: {
    praesens: ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'], imperfectum: ['eram', 'eras', 'erat', 'eramus', 'eratis', 'erant'],
    futurum: ['ero', 'eris', 'erit', 'erimus', 'eritis', 'erunt'], perfectum: ['fui', 'fuisti', 'fuit', 'fuimus', 'fuistis', 'fuerunt'],
    plusquamperfectum: ['fueram', 'fueras', 'fuerat', 'fueramus', 'fueratis', 'fuerant'], 'futurum-exactum': ['fuero', 'fueris', 'fuerit', 'fuerimus', 'fueritis', 'fuerint'],
    'coniunctivus-praesens': ['sim', 'sis', 'sit', 'simus', 'sitis', 'sint'], 'coniunctivus-imperfectum': ['essem', 'esses', 'esset', 'essemus', 'essetis', 'essent'],
    imperativus: ['', 'es', '', '', 'este', ''] } },
  posse: { nl: 'kunnen', forms: {
    praesens: ['possum', 'potes', 'potest', 'possumus', 'potestis', 'possunt'], imperfectum: ['poteram', 'poteras', 'poterat', 'poteramus', 'poteratis', 'poterant'],
    futurum: ['potero', 'poteris', 'poterit', 'poterimus', 'poteritis', 'poterunt'], perfectum: ['potui', 'potuisti', 'potuit', 'potuimus', 'potuistis', 'potuerunt'],
    plusquamperfectum: ['potueram', 'potueras', 'potuerat', 'potueramus', 'potueratis', 'potuerant'], 'futurum-exactum': ['potuero', 'potueris', 'potuerit', 'potuerimus', 'potueritis', 'potuerint'],
    'coniunctivus-praesens': ['possim', 'possis', 'possit', 'possimus', 'possitis', 'possint'], 'coniunctivus-imperfectum': ['possem', 'posses', 'posset', 'possemus', 'possetis', 'possent'] } },
  ire: { nl: 'gaan', forms: {
    praesens: ['eo', 'is', 'it', 'imus', 'itis', 'eunt'], imperfectum: ['ibam', 'ibas', 'ibat', 'ibamus', 'ibatis', 'ibant'],
    futurum: ['ibo', 'ibis', 'ibit', 'ibimus', 'ibitis', 'ibunt'], perfectum: ['ii / ivi', 'isti / ivisti', 'iit / ivit', 'iimus / ivimus', 'istis / ivistis', 'ierunt / iverunt'],
    plusquamperfectum: ['ieram', 'ieras', 'ierat', 'ieramus', 'ieratis', 'ierant'], 'futurum-exactum': ['iero', 'ieris', 'ierit', 'ierimus', 'ieritis', 'ierint'],
    'coniunctivus-praesens': ['eam', 'eas', 'eat', 'eamus', 'eatis', 'eant'], 'coniunctivus-imperfectum': ['irem', 'ires', 'iret', 'iremus', 'iretis', 'irent'],
    imperativus: ['', 'i', '', '', 'ite', ''] } },
  ferre: { nl: 'dragen, brengen', forms: {
    praesens: ['fero', 'fers', 'fert', 'ferimus', 'fertis', 'ferunt'], imperfectum: ['ferebam', 'ferebas', 'ferebat', 'ferebamus', 'ferebatis', 'ferebant'],
    futurum: ['feram', 'feres', 'feret', 'feremus', 'feretis', 'ferent'], perfectum: ['tuli', 'tulisti', 'tulit', 'tulimus', 'tulistis', 'tulerunt'],
    plusquamperfectum: ['tuleram', 'tuleras', 'tulerat', 'tuleramus', 'tuleratis', 'tulerant'], 'futurum-exactum': ['tulero', 'tuleris', 'tulerit', 'tulerimus', 'tuleritis', 'tulerint'],
    'coniunctivus-praesens': ['feram', 'feras', 'ferat', 'feramus', 'feratis', 'ferant'], 'coniunctivus-imperfectum': ['ferrem', 'ferres', 'ferret', 'ferremus', 'ferretis', 'ferrent'],
    imperativus: ['', 'fer', '', '', 'ferte', ''] } },
  velle: { nl: 'willen', forms: {
    praesens: ['volo', 'vis', 'vult', 'volumus', 'vultis', 'volunt'], imperfectum: ['volebam', 'volebas', 'volebat', 'volebamus', 'volebatis', 'volebant'],
    futurum: ['volam', 'voles', 'volet', 'volemus', 'voletis', 'volent'], perfectum: ['volui', 'voluisti', 'voluit', 'voluimus', 'voluistis', 'voluerunt'],
    plusquamperfectum: ['volueram', 'volueras', 'voluerat', 'volueramus', 'volueratis', 'voluerant'], 'futurum-exactum': ['voluero', 'volueris', 'voluerit', 'voluerimus', 'volueritis', 'voluerint'],
    'coniunctivus-praesens': ['velim', 'velis', 'velit', 'velimus', 'velitis', 'velint'], 'coniunctivus-imperfectum': ['vellem', 'velles', 'vellet', 'vellemus', 'velletis', 'vellent'] } },
};

export const laTenses: Tense[] = [
  { id: 'praesens', label: 'praesens' },
  { id: 'imperfectum', label: 'imperfectum' },
  { id: 'futurum', label: 'futurum' },
  { id: 'perfectum', label: 'perfectum' },
  { id: 'plusquamperfectum', label: 'plusquamperfectum' },
  { id: 'futurum-exactum', label: 'futurum exactum' },
  { id: 'praesens-passief', label: 'praesens passief' },
  { id: 'imperfectum-passief', label: 'imperfectum passief' },
  { id: 'perfectum-passief', label: 'perfectum passief' },
  { id: 'coniunctivus-praesens', label: 'coniunctivus praesens' },
  { id: 'coniunctivus-imperfectum', label: 'coniunctivus imperfectum' },
  { id: 'imperativus', label: 'imperativus', persons: [1, 4] },
];

const PERSONS = ['1 ev (ik)', '2 ev (jij)', '3 ev (hij/zij/het)', '1 mv (wij)', '2 mv (jullie)', '3 mv (zij)'];

/** 1, 2, 3, 4 of 5 (= gemengd, capio). */
function conj(v: LaVerb): 1 | 2 | 3 | 4 | 5 {
  if (v.inf.endsWith('are')) return 1;
  if (v.inf.endsWith('ire')) return 4;
  if (v.pres.endsWith('eo')) return 2;
  if (v.pres.endsWith('io')) return 5;
  return 3;
}

const EMPTY: Six = ['', '', '', '', '', ''];
const byInf = new Map(verbs.map((v) => [v.inf, v]));

function regular(v: LaVerb, tense: string): string[] {
  const c = conj(v);
  const root = v.inf.slice(0, -3); // laud, mon, reg, aud, cap
  const theme = { 1: `${root}a`, 2: `${root}e`, 3: root, 4: `${root}i`, 5: `${root}i` }[c];
  const perf = v.perf.slice(0, -1); // laudav, monu, rex
  const ppp = v.sup ? v.sup.replace(/um$/, '') : null; // laudat
  const act = ['', 's', 't', 'mus', 'tis', 'nt'];
  switch (tense) {
    case 'praesens': {
      if (c === 1) return [v.pres, `${root}as`, `${root}at`, `${root}amus`, `${root}atis`, `${root}ant`];
      if (c === 2) return [v.pres, `${root}es`, `${root}et`, `${root}emus`, `${root}etis`, `${root}ent`];
      if (c === 4) return [v.pres, `${root}is`, `${root}it`, `${root}imus`, `${root}itis`, `${root}iunt`];
      const pl = c === 5 ? `${root}iunt` : `${root}unt`;
      return [v.pres, `${root}is`, `${root}it`, `${root}imus`, `${root}itis`, pl];
    }
    case 'imperfectum': {
      const s = c <= 2 ? `${theme}ba` : c === 3 ? `${root}eba` : `${root}ieba`;
      return ['m', ...act.slice(1)].map((e) => s + e);
    }
    case 'futurum':
      if (c <= 2) return ['bo', 'bis', 'bit', 'bimus', 'bitis', 'bunt'].map((e) => theme + e);
      return ['am', 'es', 'et', 'emus', 'etis', 'ent'].map((e) => (c === 3 ? root : `${root}i`) + e);
    case 'perfectum':
      return ['i', 'isti', 'it', 'imus', 'istis', 'erunt'].map((e) => perf + e);
    case 'plusquamperfectum':
      return ['eram', 'eras', 'erat', 'eramus', 'eratis', 'erant'].map((e) => perf + e);
    case 'futurum-exactum':
      return ['ero', 'eris', 'erit', 'erimus', 'eritis', 'erint'].map((e) => perf + e);
    case 'praesens-passief': {
      if (v.noPass) return [...EMPTY];
      if (c === 1) return [`${root}or`, `${root}aris`, `${root}atur`, `${root}amur`, `${root}amini`, `${root}antur`];
      if (c === 2) return [`${root}eor`, `${root}eris`, `${root}etur`, `${root}emur`, `${root}emini`, `${root}entur`];
      if (c === 4) return [`${root}ior`, `${root}iris`, `${root}itur`, `${root}imur`, `${root}imini`, `${root}iuntur`];
      return [c === 5 ? `${root}ior` : `${root}or`, `${root}eris`, `${root}itur`, `${root}imur`, `${root}imini`, c === 5 ? `${root}iuntur` : `${root}untur`];
    }
    case 'imperfectum-passief': {
      if (v.noPass) return [...EMPTY];
      const s = c <= 2 ? `${theme}ba` : c === 3 ? `${root}eba` : `${root}ieba`;
      return ['r', 'ris', 'tur', 'mur', 'mini', 'ntur'].map((e) => s + e);
    }
    case 'perfectum-passief': {
      if (v.noPass || !ppp) return [...EMPTY];
      const sum = ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'];
      return sum.map((s, i) => (i < 3 ? `${ppp}us ${s} / ${ppp}a ${s}` : `${ppp}i ${s} / ${ppp}ae ${s}`));
    }
    case 'coniunctivus-praesens': {
      const s = c === 1 ? `${root}e` : c === 2 ? `${root}ea` : c === 3 ? `${root}a` : `${root}ia`;
      return ['m', ...act.slice(1)].map((e) => s + e);
    }
    case 'coniunctivus-imperfectum':
      return ['m', ...act.slice(1)].map((e) => `${v.inf}${e}`);
    case 'imperativus': {
      if (v.imp) return ['', v.imp[0], '', '', v.imp[1], ''];
      const sg = c === 1 ? `${root}a` : c === 2 ? `${root}e` : c === 4 ? `${root}i` : `${root}e`;
      const pl = c === 1 ? `${root}ate` : c === 2 ? `${root}ete` : c === 4 ? `${root}ite` : `${root}ite`;
      return ['', sg, '', '', pl, ''];
    }
    default:
      throw new Error(`Onbekende tijd: ${tense}`);
  }
}

function bareForms(inf: string, tense: string): string[] {
  const irr = IRR[inf];
  if (irr) return [...(irr.forms[tense] ?? EMPTY)];
  const v = byInf.get(inf);
  if (!v) throw new Error(`Onbekend Latijns werkwoord: ${inf}`);
  return regular(v, tense);
}

const first = (s: string) => s.split(' / ')[0]!;
const label = (inf: string) => {
  const v = byInf.get(inf);
  return v ? `${v.pres}, ${v.inf}, ${v.perf}${v.sup ? `, ${v.sup}` : ''}` : inf;
};

function explain(inf: string, tense: string): string | undefined {
  if (IRR[inf]) return `${inf} is onregelmatig: leer het rijtje uit je hoofd.`;
  const v = byInf.get(inf)!;
  const c = conj(v);
  const name = c === 5 ? 'gemengde conjugatie' : `${c}e conjugatie`;
  switch (tense) {
    case 'imperfectum': return `Imperfectum: kenmerk -ba- (${name}).`;
    case 'futurum': return c <= 2 ? 'Futurum bij de 1e en 2e conjugatie: -bo, -bis, -bit…' : 'Futurum bij de 3e, 4e en gemengde conjugatie: -am, -es, -et…';
    case 'perfectum':
    case 'plusquamperfectum':
    case 'futurum-exactum': return `Gebruik de perfectumstam: ${v.perf.slice(0, -1)}- (${label(inf)}).`;
    case 'perfectum-passief': return `Participium perfectum (${v.sup?.replace(/um$/, 'us')}) + vorm van esse; het participium past zich aan het onderwerp aan.`;
    case 'coniunctivus-praesens': return c === 1 ? 'Coniunctivus praesens 1e conjugatie: -e- (laudem).' : 'Coniunctivus praesens: -a- (moneam, regam, audiam).';
    case 'coniunctivus-imperfectum': return 'Coniunctivus imperfectum: infinitief + persoonsuitgang (laudarem).';
    case 'praesens-passief':
    case 'imperfectum-passief': return 'Passieve uitgangen: -r, -ris, -tur, -mur, -mini, -ntur.';
  }
  return `${name}: ${label(inf)}.`;
}

export const laEngine: VerbEngine = {
  lang: 'la',
  persons: PERSONS,
  tenses: laTenses,
  verbs: [
    ...Object.entries(IRR).map(([inf, v]): VerbInfo => ({ inf, nl: v.nl, tags: ['onregelmatig'] })),
    ...verbs.map((v): VerbInfo => ({ inf: v.inf, nl: v.nl, tags: [`conj-${conj(v)}`] })),
  ],
  presets: [
    { id: 'c1', label: '1e conjugatie', filter: (v) => v.tags.includes('conj-1') },
    { id: 'c2', label: '2e conjugatie', filter: (v) => v.tags.includes('conj-2') },
    { id: 'c3', label: '3e en gemengd', filter: (v) => v.tags.includes('conj-3') || v.tags.includes('conj-5') },
    { id: 'c4', label: '4e conjugatie', filter: (v) => v.tags.includes('conj-4') },
    { id: 'onr', label: 'esse, posse, ire, ferre, velle', filter: (v) => v.tags.includes('onregelmatig') },
  ],
  conjugate: (inf, tense) => bareForms(inf, tense).map((f) => (f ? f.split(' / ').slice(0, 1).join('') : '')),
  answer: (inf, tense, i) => bareForms(inf, tense)[i] ?? '',
  bare: (inf, tense, i) => first(bareForms(inf, tense)[i] ?? ''),
  explain: (inf, tense) => explain(inf, tense),
  sentence: (inf, tense, i) => ({ before: '', after: ` (${label(inf)}; ${laTenses.find((t) => t.id === tense)?.label}, ${PERSONS[i]})` }),
};
