/** ITALIAANSE GRAMMATICA (zelf geschreven). */
import type { TopicContent } from '@/features/grammar/types';

const P = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];
const rij = (forms: string[]) => P.map((p, i) => ({ label: p, answer: forms[i]! }));

export const itGrammar: TopicContent[] = [
  {
    id: 'essere-avere',
    blocks: [
      { type: 'table', head: ['', 'essere (zijn)', 'avere (hebben)'], rows: P.map((p, i) => [p, ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'][i]!, ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'][i]!]) },
      { type: 'text', text: 'In de **passato prossimo** gebruik je meestal **avere** (ho mangiato). **essere** gebruik je bij beweging of verandering (andare, venire, partire, arrivare, uscire, nascere, morire, restare) en bij wederkerende werkwoorden. Met essere past het deelwoord zich aan: è andat**o** / è andat**a** / sono andat**i** / sono andat**e**.' },
      { type: 'tip', text: 'Let op het accent: **è** (is) en **e** (en) zijn verschillende woorden. **ha** (heeft) en **a** (naar/aan) ook: de h hoor je niet.' },
    ],
    exercises: [
      { type: 'table', title: 'essere, presente', rows: rij(['sono', 'sei', 'è', 'siamo', 'siete', 'sono']) },
      { type: 'table', title: 'avere, presente', rows: rij(['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno']) },
      { type: 'gap', sentence: 'Maria ___ andata a Roma.', answer: 'è' },
      { type: 'gap', sentence: 'Noi ___ mangiato la pizza.', answer: 'abbiamo' },
      { type: 'gap', sentence: 'I ragazzi sono arrivat___.', answer: 'i' },
      { type: 'gap', sentence: 'Tu ___ molto simpatico.', answer: 'sei' },
      { type: 'choice', question: 'Ieri io ___ uscita con le amiche.', options: ['sono', 'ho', 'è', 'hai'], answer: 0 },
    ],
  },
  {
    id: 'tijden',
    blocks: [
      { type: 'table', caption: 'Presente', head: ['', '-are (parlare)', '-ere (credere)', '-ire (dormire)', '-ire met -isc- (finire)'], rows: P.map((p, i) => [p, ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano'][i]!, ['credo', 'credi', 'crede', 'crediamo', 'credete', 'credono'][i]!, ['dormo', 'dormi', 'dorme', 'dormiamo', 'dormite', 'dormono'][i]!, ['finisco', 'finisci', 'finisce', 'finiamo', 'finite', 'finiscono'][i]!]) },
      { type: 'table', caption: 'parlare in andere tijden', head: ['', 'passato prossimo', 'imperfetto', 'futuro', 'condizionale'], rows: P.map((p, i) => [p, ['ho parlato', 'hai parlato', 'ha parlato', 'abbiamo parlato', 'avete parlato', 'hanno parlato'][i]!, ['parlavo', 'parlavi', 'parlava', 'parlavamo', 'parlavate', 'parlavano'][i]!, ['parlerò', 'parlerai', 'parlerà', 'parleremo', 'parlerete', 'parleranno'][i]!, ['parlerei', 'parleresti', 'parlerebbe', 'parleremmo', 'parlereste', 'parlerebbero'][i]!]) },
      { type: 'text', text: '**Passato prossimo**: afgeronde handeling (avere/essere + deelwoord: -are → -ato, -ere → -uto, -ire → -ito). **Imperfetto**: beschrijving en gewoonte in het verleden. **Futuro**: toekomst (-are wordt -er-: parlerò). **Condizionale**: zou(den).' },
    ],
    exercises: [
      { type: 'table', title: 'parlare, presente', rows: rij(['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano']) },
      { type: 'table', title: 'finire, presente', rows: rij(['finisco', 'finisci', 'finisce', 'finiamo', 'finite', 'finiscono']) },
      { type: 'gap', sentence: 'Noi ___ italiano. (parlare, presente)', answer: 'parliamo' },
      { type: 'gap', sentence: 'Loro ___ fino a tardi. (dormire, presente)', answer: 'dormono' },
      { type: 'gap', sentence: 'Da bambino ___ sempre. (giocare, imperfetto, io)', answer: 'giocavo' },
      { type: 'gap', sentence: 'Domani ___ con lui. (parlare, futuro, io)', answer: 'parlerò' },
      { type: 'gap', sentence: 'Ieri ___ un libro. (leggere → letto, io)', answer: 'ho letto' },
    ],
  },
  {
    id: 'congiuntivo',
    blocks: [
      { type: 'text', text: 'De **congiuntivo** gebruik je na **che** bij mening, wens, twijfel of gevoel: Penso che sia vero. Voglio che tu venga. È importante che studiate.' },
      { type: 'table', caption: 'Congiuntivo presente', head: ['', 'parlare', 'credere / dormire', 'essere', 'avere'], rows: [['io/tu/lui', 'parli', 'creda / dorma', 'sia', 'abbia'], ['noi', 'parliamo', 'crediamo / dormiamo', 'siamo', 'abbiamo'], ['voi', 'parliate', 'crediate / dormiate', 'siate', 'abbiate'], ['loro', 'parlino', 'credano / dormano', 'siano', 'abbiano']] },
      { type: 'tip', text: 'io, tu en lui/lei zijn in de congiuntivo presente gelijk. Daarom zet je vaak het onderwerp erbij: che io parli, che tu parli.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'Penso che lui ___ ragione. (avere)', answer: 'abbia' },
      { type: 'gap', sentence: 'Voglio che tu ___ con me. (parlare)', answer: 'parli' },
      { type: 'gap', sentence: 'Spero che voi ___ bene. (stare → stiate)', answer: 'stiate' },
      { type: 'gap', sentence: 'Credo che ___ vero. (essere)', answer: 'sia' },
      { type: 'gap', sentence: 'È importante che loro ___. (dormire)', answer: 'dormano' },
      { type: 'gap', sentence: 'Penso che noi ___ fortunati. (essere)', answer: 'siamo' },
    ],
  },
  {
    id: 'imperativo',
    blocks: [
      { type: 'table', head: ['', 'parlare', 'credere', 'dormire', 'finire'], rows: [['tu', 'parla!', 'credi!', 'dormi!', 'finisci!'], ['noi', 'parliamo!', 'crediamo!', 'dormiamo!', 'finiamo!'], ['voi', 'parlate!', 'credete!', 'dormite!', 'finite!']] },
      { type: 'text', text: 'Ontkenning bij **tu**: **non** + infinitief: Non parlare! Non dormire! Bij noi en voi gewoon non ervoor: Non parlate!' },
      { type: 'tip', text: 'Korte onregelmatige tu-vormen: va’ (andare), fa’ (fare), da’ (dare), di’ (dire), sta’ (stare).' },
    ],
    exercises: [
      { type: 'gap', sentence: '___ più piano, per favore! (parlare, tu)', answer: 'Parla' },
      { type: 'gap', sentence: '___ i compiti! (finire, tu)', answer: 'Finisci' },
      { type: 'gap', sentence: 'Non ___! (parlare, tu)', answer: 'parlare' },
      { type: 'gap', sentence: '___ insieme! (cantare, noi)', answer: 'Cantiamo' },
      { type: 'gap', sentence: '___ la porta! (aprire, voi)', answer: 'Aprite' },
      { type: 'gap', sentence: '___ bene! (dormire, tu)', answer: 'Dormi' },
    ],
  },
  {
    id: 'articoli',
    blocks: [
      { type: 'table', head: ['', 'enkelvoud', 'meervoud', 'wanneer'], rows: [['mannelijk', 'il', 'i', 'il libro, i libri'], ['mannelijk', 'lo', 'gli', 'vóór s + medeklinker, z, gn, ps, y: lo studente, gli studenti, lo zaino'], ['mannelijk', 'l’', 'gli', 'vóór een klinker: l’amico, gli amici'], ['vrouwelijk', 'la', 'le', 'la casa, le case'], ['vrouwelijk', 'l’', 'le', 'vóór een klinker: l’amica, le amiche']] },
      { type: 'text', text: 'Onbepaald: **un** (m: un libro, un amico), **uno** (m vóór s + medeklinker, z…: uno studente), **una** (v: una casa), **un’** (v vóór klinker: un’amica).' },
    ],
    exercises: [
      { type: 'gap', sentence: '___ libro', answer: 'il' },
      { type: 'gap', sentence: '___ studente', answer: 'lo' },
      { type: 'gap', sentence: '___ amico', answer: "l'" },
      { type: 'gap', sentence: '___ studenti', answer: 'gli' },
      { type: 'gap', sentence: '___ case', answer: 'le' },
      { type: 'gap', sentence: '___ zaino (een)', answer: 'uno' },
      { type: 'gap', sentence: '___ amica (een)', answer: "un'" },
      { type: 'gap', sentence: '___ ragazzi', answer: 'i' },
    ],
  },
  {
    id: 'preposizioni-articolate',
    blocks: [
      { type: 'text', text: 'De voorzetsels **di, a, da, in, su** smelten samen met het bepaald lidwoord.' },
      { type: 'table', head: ['', 'il', 'lo', 'l’', 'la', 'i', 'gli', 'le'], rows: [['di', 'del', 'dello', 'dell’', 'della', 'dei', 'degli', 'delle'], ['a', 'al', 'allo', 'all’', 'alla', 'ai', 'agli', 'alle'], ['da', 'dal', 'dallo', 'dall’', 'dalla', 'dai', 'dagli', 'dalle'], ['in', 'nel', 'nello', 'nell’', 'nella', 'nei', 'negli', 'nelle'], ['su', 'sul', 'sullo', 'sull’', 'sulla', 'sui', 'sugli', 'sulle']] },
    ],
    exercises: [
      { type: 'gap', sentence: 'Vado ___ cinema. (a + il)', answer: 'al' },
      { type: 'gap', sentence: 'Il libro è ___ tavolo. (su + il)', answer: 'sul' },
      { type: 'gap', sentence: 'Abito ___ città. (in + la)', answer: 'nella' },
      { type: 'gap', sentence: 'Vengo ___ stazione. (da + la)', answer: 'dalla' },
      { type: 'gap', sentence: 'la casa ___ amici (di + gli)', answer: 'degli' },
      { type: 'gap', sentence: 'Parlo ___ studenti. (a + gli)', answer: 'agli' },
      { type: 'gap', sentence: 'Le chiavi sono ___ zaino. (in + lo)', answer: 'nello' },
    ],
  },
];
