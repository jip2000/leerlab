/** LATIJN (gymnasium): uitleg en oefeningen (zelf geschreven). Lengtetekens weggelaten. */
import type { TopicContent } from '@/features/grammar/types';

const naamvallen = ['nominativus', 'genitivus', 'dativus', 'accusativus', 'ablativus'];
const tabel = (ev: string[], mv: string[]) => naamvallen.map((n, i) => [n, ev[i]!, mv[i]!]);

export const laGrammar: TopicContent[] = [
  {
    id: 'declinaties',
    blocks: [
      { type: 'text', text: 'Latijn heeft vijf **declinaties** (rijtjes voor zelfstandige naamwoorden). Aan de **genitivus enkelvoud** zie je bij welke declinatie een woord hoort: -ae (1), -i (2), -is (3), -us (4), -ei (5).' },
      { type: 'table', caption: '1e declinatie: rosa, rosae (v.) roos', head: ['', 'enkelvoud', 'meervoud'], rows: tabel(['rosa', 'rosae', 'rosae', 'rosam', 'rosa'], ['rosae', 'rosarum', 'rosis', 'rosas', 'rosis']) },
      { type: 'table', caption: '2e declinatie: dominus, domini (m.) heer', head: ['', 'enkelvoud', 'meervoud'], rows: tabel(['dominus', 'domini', 'domino', 'dominum', 'domino'], ['domini', 'dominorum', 'dominis', 'dominos', 'dominis']) },
      { type: 'table', caption: '2e declinatie onzijdig: templum, templi (o.) tempel', head: ['', 'enkelvoud', 'meervoud'], rows: tabel(['templum', 'templi', 'templo', 'templum', 'templo'], ['templa', 'templorum', 'templis', 'templa', 'templis']) },
      { type: 'table', caption: '3e declinatie: rex, regis (m.) koning', head: ['', 'enkelvoud', 'meervoud'], rows: tabel(['rex', 'regis', 'regi', 'regem', 'rege'], ['reges', 'regum', 'regibus', 'reges', 'regibus']) },
      { type: 'table', caption: '3e declinatie onzijdig: corpus, corporis (o.) lichaam', head: ['', 'enkelvoud', 'meervoud'], rows: tabel(['corpus', 'corporis', 'corpori', 'corpus', 'corpore'], ['corpora', 'corporum', 'corporibus', 'corpora', 'corporibus']) },
      { type: 'table', caption: '4e declinatie: manus, manus (v.) hand', head: ['', 'enkelvoud', 'meervoud'], rows: tabel(['manus', 'manus', 'manui', 'manum', 'manu'], ['manus', 'manuum', 'manibus', 'manus', 'manibus']) },
      { type: 'table', caption: '5e declinatie: res, rei (v.) zaak', head: ['', 'enkelvoud', 'meervoud'], rows: tabel(['res', 'rei', 'rei', 'rem', 're'], ['res', 'rerum', 'rebus', 'res', 'rebus']) },
      { type: 'tip', text: 'Onzijdige woorden: nominativus = accusativus, en in het meervoud altijd **-a**. De vocativus is meestal gelijk aan de nominativus; bij -us van de 2e declinatie: domin**e**!' },
    ],
    exercises: [
      { type: 'table', title: 'rosa (1e decl.), enkelvoud', rows: naamvallen.map((n, i) => ({ label: n, answer: ['rosa', 'rosae', 'rosae', 'rosam', 'rosa'][i]! })) },
      { type: 'table', title: 'dominus (2e decl.), meervoud', rows: naamvallen.map((n, i) => ({ label: n, answer: ['domini', 'dominorum', 'dominis', 'dominos', 'dominis'][i]! })) },
      { type: 'table', title: 'rex, regis (3e decl.), enkelvoud', rows: naamvallen.map((n, i) => ({ label: n, answer: ['rex', 'regis', 'regi', 'regem', 'rege'][i]! })) },
      { type: 'gap', sentence: 'puella, puellae: accusativus meervoud = ___', answer: 'puellas' },
      { type: 'gap', sentence: 'servus, servi: genitivus meervoud = ___', answer: 'servorum' },
      { type: 'gap', sentence: 'bellum, belli: nominativus meervoud = ___', answer: 'bella' },
      { type: 'gap', sentence: 'consul, consulis: dativus meervoud = ___', answer: 'consulibus' },
      { type: 'gap', sentence: 'dies, diei: ablativus enkelvoud = ___', answer: 'die' },
    ],
  },
  {
    id: 'adjectieven',
    blocks: [
      { type: 'text', text: 'Een bijvoeglijk naamwoord past zich aan in **naamval, getal en geslacht** aan het zelfstandig naamwoord (niet per se in declinatie!): agricola bon**us** (een goede boer).' },
      { type: 'table', caption: '1e/2e declinatie: bonus, bona, bonum', head: ['', 'mannelijk', 'vrouwelijk', 'onzijdig'], rows: [['nom. ev', 'bonus', 'bona', 'bonum'], ['gen. ev', 'boni', 'bonae', 'boni'], ['acc. ev', 'bonum', 'bonam', 'bonum'], ['nom. mv', 'boni', 'bonae', 'bona']] },
      { type: 'table', caption: '3e declinatie: fortis, forte (sterk)', head: ['', 'mann./vrouw.', 'onzijdig'], rows: [['nom. ev', 'fortis', 'forte'], ['gen. ev', 'fortis', 'fortis'], ['abl. ev', 'forti', 'forti'], ['nom. mv', 'fortes', 'fortia'], ['gen. mv', 'fortium', 'fortium']] },
      { type: 'tip', text: 'Adjectieven van de 3e declinatie hebben ablativus enkelvoud op **-i**, genitivus meervoud op **-ium** en onzijdig meervoud op **-ia**.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'puella ___ (bonus) = een goed meisje', answer: 'bona' },
      { type: 'gap', sentence: 'templum ___ (magnus) = een grote tempel', answer: 'magnum' },
      { type: 'gap', sentence: 'agricola ___ (bonus) = een goede boer', answer: 'bonus', explain: 'agricola is mannelijk, al hoort het bij de 1e declinatie.' },
      { type: 'gap', sentence: 'milites ___ (fortis) = sterke soldaten', answer: 'fortes' },
      { type: 'gap', sentence: 'corpora ___ (fortis) = sterke lichamen', answer: 'fortia' },
      { type: 'gap', sentence: 'cum ___ (fortis) milite = met een sterke soldaat', answer: 'forti' },
      { type: 'choice', question: 'Welke vorm past bij "dominorum"?', options: ['bonorum', 'bonarum', 'bonis', 'boni'], answer: 0 },
    ],
  },
  {
    id: 'pronomina',
    blocks: [
      { type: 'table', caption: 'is, ea, id (hij, zij, het / die)', head: ['', 'm.', 'v.', 'o.'], rows: [['nom. ev', 'is', 'ea', 'id'], ['gen. ev', 'eius', 'eius', 'eius'], ['dat. ev', 'ei', 'ei', 'ei'], ['acc. ev', 'eum', 'eam', 'id'], ['abl. ev', 'eo', 'ea', 'eo'], ['nom. mv', 'ei / ii', 'eae', 'ea'], ['gen. mv', 'eorum', 'earum', 'eorum'], ['dat. mv', 'eis / iis', 'eis / iis', 'eis / iis'], ['acc. mv', 'eos', 'eas', 'ea'], ['abl. mv', 'eis / iis', 'eis / iis', 'eis / iis']] },
      { type: 'table', caption: 'Andere voornaamwoorden (nominativus ev)', head: ['', 'm.', 'v.', 'o.', 'betekenis'], rows: [['hic', 'hic', 'haec', 'hoc', 'deze'], ['ille', 'ille', 'illa', 'illud', 'die (daar)'], ['qui', 'qui', 'quae', 'quod', 'die/dat (betrekkelijk)']] },
      { type: 'tip', text: 'Gen. ev van hic, ille en qui: huius, illius, cuius. Dat. ev: huic, illi, cui.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'is: accusativus ev mannelijk = ___', answer: 'eum' },
      { type: 'gap', sentence: 'ea: genitivus mv = ___', answer: 'earum' },
      { type: 'gap', sentence: 'is, ea, id: genitivus ev = ___', answer: 'eius' },
      { type: 'gap', sentence: 'hic, haec, hoc: onzijdig nom ev = ___', answer: 'hoc' },
      { type: 'gap', sentence: 'ille: genitivus ev = ___', answer: 'illius' },
      { type: 'gap', sentence: 'qui: dativus ev = ___', answer: 'cui' },
      { type: 'choice', question: 'Vir, ___ librum legit, poeta est.', options: ['qui', 'quae', 'quod', 'quem'], answer: 0, explain: 'vir is mannelijk enkelvoud en onderwerp in de bijzin: qui.' },
    ],
  },
  {
    id: 'conjugaties',
    blocks: [
      { type: 'table', caption: 'Praesens indicativus activum', head: ['', '1 laudare', '2 monere', '3 regere', '4 audire', 'gemengd capere'], rows: [['1 ev', 'laudo', 'moneo', 'rego', 'audio', 'capio'], ['2 ev', 'laudas', 'mones', 'regis', 'audis', 'capis'], ['3 ev', 'laudat', 'monet', 'regit', 'audit', 'capit'], ['1 mv', 'laudamus', 'monemus', 'regimus', 'audimus', 'capimus'], ['2 mv', 'laudatis', 'monetis', 'regitis', 'auditis', 'capitis'], ['3 mv', 'laudant', 'monent', 'regunt', 'audiunt', 'capiunt']] },
      { type: 'text', text: 'Persoonsuitgangen actief: **-o/-m, -s, -t, -mus, -tis, -nt**. Passief: **-or/-r, -ris, -tur, -mur, -mini, -ntur** (laudor, laudaris, laudatur, laudamur, laudamini, laudantur).' },
    ],
    exercises: [
      { type: 'table', title: 'laudare, praesens activum', rows: ['1 ev', '2 ev', '3 ev', '1 mv', '2 mv', '3 mv'].map((l, i) => ({ label: l, answer: ['laudo', 'laudas', 'laudat', 'laudamus', 'laudatis', 'laudant'][i]! })) },
      { type: 'table', title: 'regere, praesens activum', rows: ['1 ev', '2 ev', '3 ev', '1 mv', '2 mv', '3 mv'].map((l, i) => ({ label: l, answer: ['rego', 'regis', 'regit', 'regimus', 'regitis', 'regunt'][i]! })) },
      { type: 'gap', sentence: 'audire, 3 mv praesens = ___', answer: 'audiunt' },
      { type: 'gap', sentence: 'monere, 1 mv praesens = ___', answer: 'monemus' },
      { type: 'gap', sentence: 'laudare, 3 ev praesens passief = ___', answer: 'laudatur' },
      { type: 'gap', sentence: 'capere, 3 mv praesens = ___', answer: 'capiunt' },
    ],
  },
  {
    id: 'onregelmatig',
    blocks: [
      { type: 'table', caption: 'Praesens', head: ['', 'esse', 'posse', 'ire', 'ferre', 'velle'], rows: [['1 ev', 'sum', 'possum', 'eo', 'fero', 'volo'], ['2 ev', 'es', 'potes', 'is', 'fers', 'vis'], ['3 ev', 'est', 'potest', 'it', 'fert', 'vult'], ['1 mv', 'sumus', 'possumus', 'imus', 'ferimus', 'volumus'], ['2 mv', 'estis', 'potestis', 'itis', 'fertis', 'vultis'], ['3 mv', 'sunt', 'possunt', 'eunt', 'ferunt', 'volunt']] },
      { type: 'text', text: 'Imperfectum van esse: eram, eras, erat… Futurum: ero, eris, erit, erimus, eritis, erunt. Perfectum: fui. posse = pot- + esse (pos- vóór een s): possum, poteram, potui.' },
    ],
    exercises: [
      { type: 'gap', sentence: 'esse, 3 mv praesens = ___', answer: 'sunt' },
      { type: 'gap', sentence: 'posse, 2 ev praesens = ___', answer: 'potes' },
      { type: 'gap', sentence: 'ire, 3 mv praesens = ___', answer: 'eunt' },
      { type: 'gap', sentence: 'velle, 3 ev praesens = ___', answer: 'vult' },
      { type: 'gap', sentence: 'ferre, 2 ev praesens = ___', answer: 'fers' },
      { type: 'gap', sentence: 'esse, 1 ev futurum = ___', answer: 'ero' },
      { type: 'gap', sentence: 'esse, 3 ev imperfectum = ___', answer: 'erat' },
    ],
  },
  {
    id: 'tijden-wijzen',
    blocks: [
      { type: 'table', caption: 'laudare (1) en regere (3), 1e persoon enkelvoud actief', head: ['tijd', 'laudare', 'regere', 'kenmerk'], rows: [['praesens', 'laudo', 'rego', ''], ['imperfectum', 'laudabam', 'regebam', '-ba-'], ['futurum', 'laudabo', 'regam', '1/2: -b-, 3/4: -a-/-e-'], ['perfectum', 'laudavi', 'rexi', 'perfectumstam + -i, -isti, -it, -imus, -istis, -erunt'], ['plusquamperfectum', 'laudaveram', 'rexeram', 'perfectumstam + -eram'], ['futurum exactum', 'laudavero', 'rexero', 'perfectumstam + -ero']] },
      { type: 'text', text: '**Coniunctivus praesens**: 1e conj. met -e- (laudem), andere met -a- (moneam, regam, audiam). **Coniunctivus imperfectum**: infinitief + persoonsuitgang (laudarem). **Imperativus**: lauda! laudate! / rege! regite!' },
      { type: 'text', text: '**Passief perfectum**: participium perfectum + vorm van esse: laudatus sum (ik ben geprezen).' },
    ],
    exercises: [
      { type: 'gap', sentence: 'laudare, 3 mv imperfectum = ___', answer: 'laudabant' },
      { type: 'gap', sentence: 'laudare, 1 ev futurum = ___', answer: 'laudabo' },
      { type: 'gap', sentence: 'regere, 3 ev futurum = ___', answer: 'reget' },
      { type: 'gap', sentence: 'laudare, 2 ev perfectum = ___', answer: 'laudavisti' },
      { type: 'gap', sentence: 'laudare, 3 mv perfectum = ___', answer: 'laudaverunt' },
      { type: 'gap', sentence: 'audire, 1 ev coniunctivus praesens = ___', answer: 'audiam' },
      { type: 'gap', sentence: 'laudare, 1 ev coniunctivus praesens = ___', answer: 'laudem' },
      { type: 'gap', sentence: 'laudare, 3 ev coniunctivus imperfectum = ___', answer: 'laudaret' },
    ],
  },
  {
    id: 'participia-infinitivi',
    blocks: [
      { type: 'table', caption: 'Participia van laudare', head: ['participium', 'vorm', 'betekenis'], rows: [['praesens activum (PPA)', 'laudans, laudantis', 'prijzend, terwijl hij prijst'], ['perfectum passivum (PPP)', 'laudatus, -a, -um', 'geprezen, nadat hij geprezen was'], ['futurum activum (PFA)', 'laudaturus, -a, -um', 'van plan om te prijzen']] },
      { type: 'table', caption: 'Infinitivi van laudare', head: ['', 'activum', 'passivum'], rows: [['praesens', 'laudare', 'laudari'], ['perfectum', 'laudavisse', 'laudatum esse'], ['futurum', 'laudaturum esse', '']] },
      { type: 'tip', text: 'Bij de 3e conjugatie eindigt de infinitief praesens passief op **-i**: regi, capi (niet -eri).' },
    ],
    exercises: [
      { type: 'gap', sentence: 'laudare: infinitivus praesens passivum = ___', answer: 'laudari' },
      { type: 'gap', sentence: 'regere: infinitivus praesens passivum = ___', answer: 'regi' },
      { type: 'gap', sentence: 'laudare: infinitivus perfectum activum = ___', answer: 'laudavisse' },
      { type: 'gap', sentence: 'audire: PPA nominativus ev = ___', answer: 'audiens' },
      { type: 'gap', sentence: 'monere: PPP nominativus ev mannelijk = ___', answer: 'monitus' },
      { type: 'gap', sentence: 'laudare: PFA nominativus ev mannelijk = ___', answer: 'laudaturus' },
    ],
  },
  {
    id: 'determineren',
    blocks: [
      { type: 'text', text: 'Bij **determineren** bepaal je alles van een vorm. Zelfstandig naamwoord: **naamval, getal, geslacht**. Werkwoord: **persoon, getal, tijd, wijs, genus** (actief/passief).' },
      { type: 'examples', items: [['rosarum', 'genitivus meervoud vrouwelijk'], ['laudabantur', '3e persoon meervoud imperfectum indicativus passivum']] },
      { type: 'tip', text: 'Werk van achter naar voren: eerst de persoonsuitgang (-ntur = 3 mv passief), dan het tijdskenmerk (-ba- = imperfectum).' },
    ],
    exercises: [
      { type: 'choice', question: 'rosam', options: ['acc. ev', 'nom. ev', 'abl. ev', 'acc. mv'], answer: 0 },
      { type: 'choice', question: 'dominorum', options: ['gen. mv', 'dat. mv', 'gen. ev', 'acc. mv'], answer: 0 },
      { type: 'choice', question: 'regem', options: ['acc. ev', 'abl. ev', 'nom. mv', 'gen. ev'], answer: 0 },
      { type: 'choice', question: 'templa', options: ['nom./acc. mv onzijdig', 'nom. ev vrouwelijk', 'abl. ev', 'gen. mv'], answer: 0 },
      { type: 'choice', question: 'laudabant', options: ['3 mv imperfectum ind. act.', '3 mv praesens ind. act.', '3 mv futurum ind. act.', '3 mv perfectum ind. act.'], answer: 0 },
      { type: 'choice', question: 'audiuntur', options: ['3 mv praesens ind. pass.', '3 mv praesens ind. act.', '3 mv imperfectum pass.', '2 mv praesens pass.'], answer: 0 },
      { type: 'choice', question: 'laudavisti', options: ['2 ev perfectum ind. act.', '2 ev plusquamperfectum', '2 mv perfectum', '2 ev futurum'], answer: 0 },
      { type: 'choice', question: 'monuerat', options: ['3 ev plusquamperfectum ind. act.', '3 ev perfectum', '3 ev imperfectum', '3 ev futurum exactum'], answer: 0 },
    ],
  },
  {
    id: 'stamtijden',
    blocks: [
      { type: 'text', text: 'Van elk werkwoord leer je vier **stamtijden**: 1e ev praesens, infinitief, 1e ev perfectum, supinum (of PPP). Daaruit kun je alle vormen maken.' },
      { type: 'table', head: ['praesens', 'infinitief', 'perfectum', 'supinum', 'betekenis'], rows: [['laudo', 'laudare', 'laudavi', 'laudatum', 'prijzen'], ['moneo', 'monere', 'monui', 'monitum', 'waarschuwen'], ['rego', 'regere', 'rexi', 'rectum', 'besturen'], ['audio', 'audire', 'audivi', 'auditum', 'horen'], ['capio', 'capere', 'cepi', 'captum', 'nemen'], ['video', 'videre', 'vidi', 'visum', 'zien'], ['venio', 'venire', 'veni', 'ventum', 'komen'], ['duco', 'ducere', 'duxi', 'ductum', 'leiden'], ['mitto', 'mittere', 'misi', 'missum', 'sturen'], ['facio', 'facere', 'feci', 'factum', 'doen, maken'], ['do', 'dare', 'dedi', 'datum', 'geven']] },
    ],
    exercises: [
      { type: 'table', title: 'rego', rows: [{ label: 'infinitief', answer: 'regere' }, { label: 'perfectum', answer: 'rexi' }, { label: 'supinum', answer: 'rectum' }] },
      { type: 'table', title: 'video', rows: [{ label: 'infinitief', answer: 'videre' }, { label: 'perfectum', answer: 'vidi' }, { label: 'supinum', answer: 'visum' }] },
      { type: 'table', title: 'mitto', rows: [{ label: 'infinitief', answer: 'mittere' }, { label: 'perfectum', answer: 'misi' }, { label: 'supinum', answer: 'missum' }] },
      { type: 'table', title: 'facio', rows: [{ label: 'infinitief', answer: 'facere' }, { label: 'perfectum', answer: 'feci' }, { label: 'supinum', answer: 'factum' }] },
      { type: 'table', title: 'do', rows: [{ label: 'infinitief', answer: 'dare' }, { label: 'perfectum', answer: 'dedi' }, { label: 'supinum', answer: 'datum' }] },
      { type: 'gap', sentence: 'duco, ducere, ___, ductum', answer: 'duxi' },
      { type: 'gap', sentence: 'capio, capere, cepi, ___', answer: 'captum' },
    ],
  },
];
