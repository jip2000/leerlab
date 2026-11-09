/**
 * FRANSE WERKWOORDEN
 *
 * Regelmatige werkwoorden: alleen infinitief + vertaling (de regels doen de rest).
 *   group 'ir' = zoals finir (nous finissons). Alle andere -ir-werkwoorden staan bij de onregelmatige.
 * Onregelmatige werkwoorden: présent (6 vormen), voltooid deelwoord, stam van de futur,
 *   en de stam van de subjonctif (voor je/tu/il/ils). Nous/vous in de subjonctif = zoals de imparfait,
 *   tenzij er een volledige subjonctif (subjFull) staat.
 * aux 'être' = vervoegd met être in de passé composé.
 */

export interface FrRegular {
  inf: string;
  nl: string;
  group?: 'ir';
  aux?: 'être';
}

export interface FrIrregular {
  inf: string;
  nl: string;
  aux?: 'être';
  pres: [string, string, string, string, string, string];
  pp: string;
  fut: string;
  subj?: string;
  subjFull?: [string, string, string, string, string, string];
  /** Gebiedende wijs [tu, nous, vous], of null als die niet gebruikt wordt. */
  imp?: [string, string, string] | null;
  /** Stam van de imparfait als die afwijkt (alleen être). */
  impf?: string;
}

export const frRegular: FrRegular[] = [
  { inf: 'parler', nl: 'praten, spreken' },
  { inf: 'aimer', nl: 'houden van' },
  { inf: 'habiter', nl: 'wonen' },
  { inf: 'travailler', nl: 'werken' },
  { inf: 'regarder', nl: 'kijken (naar)' },
  { inf: 'écouter', nl: 'luisteren (naar)' },
  { inf: 'chercher', nl: 'zoeken' },
  { inf: 'trouver', nl: 'vinden' },
  { inf: 'donner', nl: 'geven' },
  { inf: 'penser', nl: 'denken' },
  { inf: 'demander', nl: 'vragen' },
  { inf: 'jouer', nl: 'spelen' },
  { inf: 'étudier', nl: 'studeren' },
  { inf: 'oublier', nl: 'vergeten' },
  { inf: 'arriver', nl: 'aankomen', aux: 'être' },
  { inf: 'entrer', nl: 'binnengaan', aux: 'être' },
  { inf: 'rester', nl: 'blijven', aux: 'être' },
  { inf: 'tomber', nl: 'vallen', aux: 'être' },
  { inf: 'rentrer', nl: 'naar huis gaan', aux: 'être' },
  { inf: 'manger', nl: 'eten' },
  { inf: 'nager', nl: 'zwemmen' },
  { inf: 'voyager', nl: 'reizen' },
  { inf: 'commencer', nl: 'beginnen' },
  { inf: 'appeler', nl: 'roepen, bellen' },
  { inf: 'jeter', nl: 'gooien' },
  { inf: 'acheter', nl: 'kopen' },
  { inf: 'lever', nl: 'optillen' },
  { inf: 'préférer', nl: 'liever hebben' },
  { inf: 'espérer', nl: 'hopen' },
  { inf: 'répéter', nl: 'herhalen' },
  { inf: 'payer', nl: 'betalen' },
  { inf: 'essayer', nl: 'proberen' },
  { inf: 'nettoyer', nl: 'schoonmaken' },
  { inf: 'finir', nl: 'afmaken, eindigen', group: 'ir' },
  { inf: 'choisir', nl: 'kiezen', group: 'ir' },
  { inf: 'réussir', nl: 'slagen, lukken', group: 'ir' },
  { inf: 'grandir', nl: 'groeien', group: 'ir' },
  { inf: 'réfléchir', nl: 'nadenken', group: 'ir' },
  { inf: 'vendre', nl: 'verkopen' },
  { inf: 'attendre', nl: 'wachten (op)' },
  { inf: 'répondre', nl: 'antwoorden' },
  { inf: 'entendre', nl: 'horen' },
  { inf: 'perdre', nl: 'verliezen' },
  { inf: 'descendre', nl: 'naar beneden gaan', aux: 'être' },
];

export const frIrregular: FrIrregular[] = [
  { inf: 'être', nl: 'zijn', pres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], pp: 'été', fut: 'ser', impf: 'ét',
    subjFull: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'], imp: ['sois', 'soyons', 'soyez'] },
  { inf: 'avoir', nl: 'hebben', pres: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], pp: 'eu', fut: 'aur',
    subjFull: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'], imp: ['aie', 'ayons', 'ayez'] },
  { inf: 'aller', nl: 'gaan', aux: 'être', pres: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], pp: 'allé', fut: 'ir', subj: 'aill' },
  { inf: 'faire', nl: 'doen, maken', pres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], pp: 'fait', fut: 'fer',
    subjFull: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'] },
  { inf: 'dire', nl: 'zeggen', pres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], pp: 'dit', fut: 'dir', subj: 'dis' },
  { inf: 'pouvoir', nl: 'kunnen', pres: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], pp: 'pu', fut: 'pourr',
    subjFull: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'], imp: null },
  { inf: 'vouloir', nl: 'willen', pres: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], pp: 'voulu', fut: 'voudr', subj: 'veuill',
    imp: ['veuille', 'veuillons', 'veuillez'] },
  { inf: 'savoir', nl: 'weten', pres: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'], pp: 'su', fut: 'saur',
    subjFull: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'], imp: ['sache', 'sachons', 'sachez'] },
  { inf: 'devoir', nl: 'moeten', pres: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'], pp: 'dû', fut: 'devr', subj: 'doiv', imp: null },
  { inf: 'venir', nl: 'komen', aux: 'être', pres: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], pp: 'venu', fut: 'viendr', subj: 'vienn' },
  { inf: 'devenir', nl: 'worden', aux: 'être', pres: ['deviens', 'deviens', 'devient', 'devenons', 'devenez', 'deviennent'], pp: 'devenu', fut: 'deviendr', subj: 'devienn' },
  { inf: 'revenir', nl: 'terugkomen', aux: 'être', pres: ['reviens', 'reviens', 'revient', 'revenons', 'revenez', 'reviennent'], pp: 'revenu', fut: 'reviendr', subj: 'revienn' },
  { inf: 'tenir', nl: 'vasthouden', pres: ['tiens', 'tiens', 'tient', 'tenons', 'tenez', 'tiennent'], pp: 'tenu', fut: 'tiendr', subj: 'tienn' },
  { inf: 'voir', nl: 'zien', pres: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], pp: 'vu', fut: 'verr', subj: 'voi' },
  { inf: 'prendre', nl: 'nemen', pres: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], pp: 'pris', fut: 'prendr', subj: 'prenn' },
  { inf: 'apprendre', nl: 'leren', pres: ['apprends', 'apprends', 'apprend', 'apprenons', 'apprenez', 'apprennent'], pp: 'appris', fut: 'apprendr', subj: 'apprenn' },
  { inf: 'comprendre', nl: 'begrijpen', pres: ['comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent'], pp: 'compris', fut: 'comprendr', subj: 'comprenn' },
  { inf: 'mettre', nl: 'zetten, leggen', pres: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'], pp: 'mis', fut: 'mettr', subj: 'mett' },
  { inf: 'partir', nl: 'vertrekken', aux: 'être', pres: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'], pp: 'parti', fut: 'partir', subj: 'part' },
  { inf: 'sortir', nl: 'uitgaan', aux: 'être', pres: ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'], pp: 'sorti', fut: 'sortir', subj: 'sort' },
  { inf: 'dormir', nl: 'slapen', pres: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'], pp: 'dormi', fut: 'dormir', subj: 'dorm' },
  { inf: 'lire', nl: 'lezen', pres: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'], pp: 'lu', fut: 'lir', subj: 'lis' },
  { inf: 'écrire', nl: 'schrijven', pres: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'], pp: 'écrit', fut: 'écrir', subj: 'écriv' },
  { inf: 'boire', nl: 'drinken', pres: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'], pp: 'bu', fut: 'boir', subj: 'boiv' },
  { inf: 'connaître', nl: 'kennen', pres: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'], pp: 'connu', fut: 'connaîtr', subj: 'connaiss' },
  { inf: 'croire', nl: 'geloven', pres: ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'], pp: 'cru', fut: 'croir', subj: 'croi' },
  { inf: 'recevoir', nl: 'ontvangen', pres: ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent'], pp: 'reçu', fut: 'recevr', subj: 'reçoiv' },
  { inf: 'vivre', nl: 'leven', pres: ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'], pp: 'vécu', fut: 'vivr', subj: 'viv' },
  { inf: 'ouvrir', nl: 'openen', pres: ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'], pp: 'ouvert', fut: 'ouvrir', subj: 'ouvr' },
  { inf: 'offrir', nl: 'aanbieden, geven', pres: ['offre', 'offres', 'offre', 'offrons', 'offrez', 'offrent'], pp: 'offert', fut: 'offrir', subj: 'offr' },
  { inf: 'courir', nl: 'rennen', pres: ['cours', 'cours', 'court', 'courons', 'courez', 'courent'], pp: 'couru', fut: 'courr', subj: 'cour' },
  { inf: 'suivre', nl: 'volgen', pres: ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent'], pp: 'suivi', fut: 'suivr', subj: 'suiv' },
  { inf: 'rire', nl: 'lachen', pres: ['ris', 'ris', 'rit', 'rions', 'riez', 'rient'], pp: 'ri', fut: 'rir', subj: 'ri' },
  { inf: 'mourir', nl: 'sterven', aux: 'être', pres: ['meurs', 'meurs', 'meurt', 'mourons', 'mourez', 'meurent'], pp: 'mort', fut: 'mourr', subj: 'meur' },
  { inf: 'naître', nl: 'geboren worden', aux: 'être', pres: ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent'], pp: 'né', fut: 'naîtr', subj: 'naiss' },
  { inf: 'conduire', nl: 'rijden, besturen', pres: ['conduis', 'conduis', 'conduit', 'conduisons', 'conduisez', 'conduisent'], pp: 'conduit', fut: 'conduir', subj: 'conduis' },
  { inf: 'envoyer', nl: 'sturen', pres: ['envoie', 'envoies', 'envoie', 'envoyons', 'envoyez', 'envoient'], pp: 'envoyé', fut: 'enverr', subj: 'envoi' },
];
